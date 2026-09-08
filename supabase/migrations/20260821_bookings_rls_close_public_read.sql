-- Ferme la lecture publique de la table `bookings`.
--
-- ⚠️ CORRECTIF DE SÉCURITÉ — à exécuter en priorité.
--
-- Contexte : la migration 20260610_bookings.sql a créé la policy
-- « Lecture publique des réservations » (SELECT USING (true)), pensée comme
-- provisoire (« à restreindre quand auth notaire sera en place »). Elle est
-- toujours active. Or la clé anon est publiquement exposée dans le bundle
-- navigateur : n'importe qui peut donc lire l'intégralité de la table, qui
-- contient client_nom, client_email, dossier (succession, divorce…) et
-- participants (civilité, nom, téléphone, date de naissance, adresse).
--
-- Ce correctif retire la lecture publique et la remplace par deux accès ciblés.
-- La fonction publique.notaire_owns_booking() vient de 20260612_notaire_documents.sql ;
-- elle est SECURITY DEFINER, donc insensible au RLS de bookings (pas de récursion).
--
-- À exécuter dans Supabase Dashboard → SQL Editor.

-- 1) Retrait de la lecture publique.
--    ⚠️ Deux noms coexistent : celui de la migration d'origine, et « Public select »,
--    créé/renommé directement dans le dashboard Supabase (constaté le 21/08/2026 —
--    seul ce second nom était réellement actif en production, la policy d'origine
--    n'existait plus). On supprime les deux pour couvrir les deux environnements.
DROP POLICY IF EXISTS "Lecture publique des réservations" ON public.bookings;
DROP POLICY IF EXISTS "Public select" ON public.bookings;

-- Contrôle après exécution — il ne doit rester AUCUNE ligne SELECT en {public} :
--   select policyname, cmd, roles::text from pg_policies
--   where schemaname='public' and tablename='bookings' order by policyname;

-- 2) Le notaire lit les réservations de son étude.
--    Couvre components/NotaireDashboard.tsx, qui interroge bookings côté client
--    avec la session du notaire (filtre .eq("notaire_id", …)).
DROP POLICY IF EXISTS "Le notaire lit les réservations de son étude" ON public.bookings;
CREATE POLICY "Le notaire lit les réservations de son étude"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.notaire_owns_booking(id::text));

-- 3) Le particulier lit ses propres réservations.
--    Recréée ici pour que ce fichier soit autosuffisant si l'on rejoue les
--    migrations dans l'ordre (identique à 20260611_bookings_user.sql).
--    Couvre lib/client-dossiers.ts et components/EspaceClient.tsx.
DROP POLICY IF EXISTS "Un utilisateur lit ses propres réservations" ON public.bookings;
CREATE POLICY "Un utilisateur lit ses propres réservations"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Note : les routes serveur (app/api/booking, booking-document, cron/reminders)
-- utilisent SUPABASE_SERVICE_ROLE_KEY et contournent le RLS — elles ne sont pas
-- affectées. Vérifier toutefois que cette variable est bien renseignée en
-- production : lib côté API retombe sinon sur la clé anon, et ces routes
-- casseraient une fois la lecture publique retirée.
