CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  intro text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category_slug text NOT NULL REFERENCES categories(slug),
  price_label text NOT NULL,
  badge_label text NOT NULL,
  image_url text NOT NULL,
  colors text NOT NULL,
  details text NOT NULL,
  condition text NOT NULL,
  availability text NOT NULL,
  description text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_slug_idx ON products(category_slug);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
