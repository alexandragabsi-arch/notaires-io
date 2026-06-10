-- Table des réservations de rendez-vous
-- À exécuter dans Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  notaire_id    TEXT        NOT NULL,
  notaire_nom   TEXT        NOT NULL,
  slot_key      TEXT        NOT NULL,        -- ex: "13-10:00"
  slot_label    TEXT        NOT NULL,        -- ex: "Mer. 11 juin · 10h00"
  dossier       TEXT        NOT NULL,
  modalite      TEXT        NOT NULL CHECK (modalite IN ('visio', 'cabinet')),
  participants  JSONB       NOT NULL DEFAULT '[]',
  client_nom    TEXT,
  client_email  TEXT,
  status        TEXT        NOT NULL DEFAULT 'confirmé',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes par notaire
CREATE INDEX IF NOT EXISTS bookings_notaire_id_idx ON bookings (notaire_id);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON bookings (created_at DESC);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- N'importe qui peut créer une réservation (client non authentifié)
CREATE POLICY "Tout le monde peut créer une réservation"
  ON bookings FOR INSERT WITH CHECK (true);

-- Lecture libre pour l'instant (à restreindre quand auth notaire sera en place)
CREATE POLICY "Lecture publique des réservations"
  ON bookings FOR SELECT USING (true);
