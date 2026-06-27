-- ── 0005: Persistent user cart and wishlist ──────────────────────────────────

CREATE TABLE IF NOT EXISTS user_cart (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_slug text       NOT NULL,
  name        text        NOT NULL DEFAULT '',
  price       text        NOT NULL DEFAULT '',
  price_num   numeric(12,2) NOT NULL DEFAULT 0,
  image       text        NOT NULL DEFAULT '',
  quantity    integer     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_slug)
);

CREATE INDEX IF NOT EXISTS user_cart_user_id_idx ON user_cart(user_id);

CREATE TABLE IF NOT EXISTS user_wishlist (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_slug text       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_slug)
);

CREATE INDEX IF NOT EXISTS user_wishlist_user_id_idx ON user_wishlist(user_id);
