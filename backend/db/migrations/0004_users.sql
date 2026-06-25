-- ── 0004: Customer users table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id    text        NOT NULL UNIQUE,
  email        text        NOT NULL UNIQUE,
  name         text        NOT NULL DEFAULT '',
  avatar       text        NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_login   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_google_id_idx ON users(google_id);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
