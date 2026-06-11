-- Rattache les réservations au compte du particulier + mémorise les pièces
-- pour que le dossier suive le client d'un appareil à l'autre (espace-client).
-- À exécuter dans Supabase Dashboard → SQL Editor.

-- Compte du particulier qui a pris le RDV (null si réservation anonyme)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Métadonnées des pièces transmises : [{ id, label, fileName }]
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]';

-- Index pour retrouver rapidement les RDV d'un particulier
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings (user_id);

-- Un particulier connecté peut lire ses propres réservations.
-- (Politique additive ; prend tout son sens quand la lecture publique sera
--  retirée — cf. resserrage RLS prévu côté /security.)
DROP POLICY IF EXISTS "Un utilisateur lit ses propres réservations" ON bookings;
CREATE POLICY "Un utilisateur lit ses propres réservations"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);
