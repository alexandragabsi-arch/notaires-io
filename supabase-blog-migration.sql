-- Migration : table blog_articles pour l'agent SEO N8N
-- À exécuter dans Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS blog_articles (
  slug             TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  meta_title       TEXT,
  meta_description TEXT,
  excerpt          TEXT,
  h1               TEXT,
  intro            TEXT,
  content_html     TEXT NOT NULL DEFAULT '',
  faq_json         JSONB,
  category         TEXT NOT NULL DEFAULT 'Guide',
  keyword          TEXT,
  keyword_type     TEXT,
  reading_time     INT  NOT NULL DEFAULT 6,
  published        BOOLEAN NOT NULL DEFAULT TRUE,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_blog_articles_published_at ON blog_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published    ON blog_articles (published);

-- RLS : lecture publique, écriture service_role uniquement
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON blog_articles FOR SELECT
  USING (published = true);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
