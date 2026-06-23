-- ── 0003: Full schema migration ───────────────────────────────────────────────
-- Adds new columns to existing tables and creates orders, admin_users,
-- and store_settings tables.
-- Safe to run multiple times (uses IF NOT EXISTS / DO NOTHING guards).

-- ── Extend categories ─────────────────────────────────────────────────────────
ALTER TABLE categories
  ALTER COLUMN intro SET DEFAULT '',
  ALTER COLUMN image_url SET DEFAULT '';

-- ── Extend products ───────────────────────────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description        text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS category_id        text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price              numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compare_price      numeric(12,2),
  ADD COLUMN IF NOT EXISTS images             text         NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS stock_quantity     integer      NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sku                text         NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_new_arrival     boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured        boolean      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active          boolean      NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at         timestamptz  NOT NULL DEFAULT now();

-- Back-fill category_id from category_slug for existing rows
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.slug = p.category_slug
  AND p.category_id = '';

-- Back-fill price from price_label (strips "From KES " prefix and commas)
UPDATE products
SET price = CAST(
  REGEXP_REPLACE(price_label, '[^0-9.]', '', 'g')
  AS numeric
)
WHERE price = 0 AND price_label <> '';

-- Back-fill images from image_url for existing rows
UPDATE products
SET images = json_build_array(image_url)::text
WHERE images = '[]' AND image_url <> '';

-- Back-fill is_featured from legacy featured column
UPDATE products SET is_featured = featured WHERE is_featured = false AND featured = true;

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref       text         NOT NULL UNIQUE,
  customer        text         NOT NULL DEFAULT '',
  customer_phone  text         NOT NULL DEFAULT '',
  items           text         NOT NULL DEFAULT '[]',
  total           numeric(12,2) NOT NULL DEFAULT 0,
  status          text         NOT NULL DEFAULT 'Pending',
  notes           text         NOT NULL DEFAULT '',
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);

-- ── Admin users ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id            uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text  NOT NULL UNIQUE,
  password_hash text  NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Seed the default admin user
-- Password: Asmah123  (bcrypt hash below, cost 10)
INSERT INTO admin_users (email, password_hash)
VALUES (
  'admin@lacesnheels.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
)
ON CONFLICT (email) DO NOTHING;

-- ── Store settings ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS store_settings (
  id         uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text  NOT NULL UNIQUE,
  value      text  NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO store_settings (key, value) VALUES
  ('storeName',     'Laces & Heels'),
  ('storeEmail',    'hello@lacesnheels.com'),
  ('storePhone',    '+254 100 663761'),
  ('storeAddress',  'Nairobi, Kenya'),
  ('storeCurrency', 'KES')
ON CONFLICT (key) DO NOTHING;
