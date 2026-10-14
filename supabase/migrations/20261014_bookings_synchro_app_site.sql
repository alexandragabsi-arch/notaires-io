-- Synchronisation des réservations entre le site et l'app iOS (Rork).
--
-- Constat du 14/10/2026 : le site et l'app écrivent dans la même table
-- `bookings`, mais pas dans le même format.
--   • statut     : site « confirmé »          / app « confirmed »
--   • créneau    : site « 2-17:00 » (index de jour relatif, sans date)
--                  / app « 2026-08-28T14:00:00Z » (instant ISO UTC)
--   • modalité   : site colonne `modalite`     / app colonne `mode`
-- Conséquences : aucun des deux ne voit les créneaux pris par l'autre, la base
-- ne refuse pas deux RDV sur le même créneau, et le cron de rappels (qui ne lit
-- que « confirmé ») ignore les RDV pris dans l'app.
--
-- Format commun retenu (celui de l'app) :
--   status   ∈ pending | confirmed | cancelled
--   slot_key = instant ISO UTC « YYYY-MM-DDTHH:MI:SSZ »
--   mode et modalite renseignés tous les deux (visio | cabinet)
--
-- À exécuter dans Supabase Dashboard → SQL Editor.

-- 1) FAILLE : la vue des créneaux pris était modifiable par anon/authenticated.
--    Vue simple sans security_invoker → un DELETE via l'API supprimait les
--    lignes de bookings avec les droits du propriétaire, RLS contourné.
--    On ne laisse que la lecture (notaire_id + slot_key, aucune donnée client).
REVOKE ALL ON public.notaire_booked_slots FROM anon, authenticated;
GRANT SELECT ON public.notaire_booked_slots TO anon, authenticated;

-- 2) Normalisation à l'écriture + garde-fous pour les écritures côté client.
CREATE OR REPLACE FUNCTION public.bookings_normaliser()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  -- anon / authenticated = écriture directe depuis un navigateur ou l'app ;
  -- service_role et postgres (routes serveur, migrations) ne sont pas bridés.
  -- On lit le rôle du JWT : dans une fonction SECURITY DEFINER, current_user
  -- vaut le propriétaire de la fonction, pas l'appelant.
  cote_client boolean := coalesce(auth.jwt() ->> 'role', '') IN ('anon', 'authenticated');
  est_notaire boolean := false;
BEGIN
  -- Statuts : on accepte les anciens libellés français, on stocke le format commun.
  NEW.status := CASE lower(coalesce(NEW.status, ''))
    WHEN 'confirmé' THEN 'confirmed'
    WHEN 'confirme' THEN 'confirmed'
    WHEN 'annulé'   THEN 'cancelled'
    WHEN 'annule'   THEN 'cancelled'
    WHEN 'canceled' THEN 'cancelled'
    WHEN ''         THEN 'pending'
    ELSE NEW.status
  END;

  -- Modalité : l'app lit `mode`, le site `modalite` → on remplit les deux.
  NEW.mode     := coalesce(NEW.mode, NEW.modalite);
  NEW.modalite := coalesce(NEW.modalite, NEW.mode);

  -- Créneau : forme canonique, pour que l'index d'unicité compare des valeurs
  -- identiques (« …T14:00:00.000Z » et « …T16:00:00+02:00 » → « …T14:00:00Z »).
  IF NEW.slot_key ~ '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}' THEN
    NEW.slot_key := to_char(NEW.slot_key::timestamptz AT TIME ZONE 'UTC',
                            'YYYY-MM-DD"T"HH24:MI:SS"Z"');
  END IF;

  IF NOT cote_client THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Réservation rattachée à un autre compte' USING ERRCODE = '42501';
    END IF;
    IF NEW.status NOT IN ('pending', 'confirmed') THEN
      RAISE EXCEPTION 'Statut de création invalide' USING ERRCODE = '42501';
    END IF;
    NEW.reminder_eve_sent := false;
    NEW.reminder_2h_sent  := false;
    NEW.notaire_documents := '[]'::jsonb;
    RETURN NEW;
  END IF;

  -- UPDATE : le notaire de l'étude garde la main ; le client ne peut ni
  -- réattribuer le RDV (notaire, compte, e-mail), ni toucher aux rappels ou aux
  -- pièces du notaire, ni passer un RDV à un autre statut qu'« annulé ».
  SELECT EXISTS (
    SELECT 1 FROM notaire_profiles p
    WHERE p.id = OLD.notaire_id AND p.user_id = auth.uid()
  ) INTO est_notaire;

  IF NEW.notaire_id IS DISTINCT FROM OLD.notaire_id
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.client_email IS DISTINCT FROM OLD.client_email THEN
    RAISE EXCEPTION 'Champs non modifiables' USING ERRCODE = '42501';
  END IF;

  IF NOT est_notaire THEN
    IF NEW.reminder_eve_sent IS DISTINCT FROM OLD.reminder_eve_sent
       OR NEW.reminder_2h_sent IS DISTINCT FROM OLD.reminder_2h_sent
       OR NEW.notaire_documents IS DISTINCT FROM OLD.notaire_documents THEN
      RAISE EXCEPTION 'Champs réservés au notaire' USING ERRCODE = '42501';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status <> 'cancelled' THEN
      RAISE EXCEPTION 'Le client peut seulement annuler' USING ERRCODE = '42501';
    END IF;
  END IF;

  -- Un créneau modifié repart pour un cycle de rappels.
  IF NEW.slot_key IS DISTINCT FROM OLD.slot_key THEN
    NEW.reminder_eve_sent := false;
    NEW.reminder_2h_sent  := false;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_normaliser ON public.bookings;
CREATE TRIGGER bookings_normaliser
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.bookings_normaliser();

-- 3) Reprise des lignes existantes au format commun.
--    La seule ligne au format site (« 2-17:00 ») correspond au libellé
--    « Lun. 12 oct. · 17:00 » → 12/10/2026 17:00 Paris = 15:00 UTC.
UPDATE public.bookings
   SET slot_key = '2026-10-12T15:00:00Z'
 WHERE slot_key = '2-17:00' AND slot_label = 'Lun. 12 oct. · 17:00';

-- Repasse toutes les lignes dans le trigger (statut, mode/modalite, ISO canonique).
UPDATE public.bookings SET status = status;

-- 4) Protection des réservations : un seul RDV actif par créneau et par notaire,
--    quelle que soit l'origine (site ou app). Une insertion en doublon échoue
--    avec le code 23505, que le site traduit en « créneau déjà pris ».
CREATE UNIQUE INDEX IF NOT EXISTS bookings_creneau_unique
  ON public.bookings (notaire_id, slot_key)
  WHERE status <> 'cancelled';

-- 5) Index du cron de rappels, aligné sur le nouveau statut.
DROP INDEX IF EXISTS public.bookings_reminders_pending_idx;
CREATE INDEX bookings_reminders_pending_idx
  ON public.bookings (created_at DESC)
  WHERE status = 'confirmed' AND (reminder_eve_sent = false OR reminder_2h_sent = false);

-- 6) Insertions directes : on remplace les policies « check (true) » par une
--    règle explicite (le trigger complète les contrôles champ par champ).
DROP POLICY IF EXISTS "Public insert" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_authenticated" ON public.bookings;
CREATE POLICY "Insertion d'une réservation"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status IN ('pending', 'confirmed', 'confirmé')
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- 7) Mise à jour par le client ou le notaire : la ligne doit leur appartenir
--    encore après la modification (au lieu de « check (true) »).
DROP POLICY IF EXISTS "bookings_update_client_or_notaire" ON public.bookings;
CREATE POLICY "bookings_update_client_or_notaire"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    lower(coalesce(client_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR EXISTS (SELECT 1 FROM notaire_profiles p
               WHERE p.user_id = auth.uid() AND p.id = bookings.notaire_id)
  )
  WITH CHECK (
    lower(coalesce(client_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR EXISTS (SELECT 1 FROM notaire_profiles p
               WHERE p.user_id = auth.uid() AND p.id = bookings.notaire_id)
  );

-- Contrôles après exécution :
--   select status, count(*) from bookings group by 1;          -- plus de « confirmé »
--   select slot_key from bookings where slot_key !~ '^\d{4}-'; -- aucune ligne
--   select grantee, privilege_type from information_schema.role_table_grants
--    where table_name = 'notaire_booked_slots';                -- SELECT seulement
