/*
# Create LUT presets catalog table

1. New Tables
- `luts`: stores LUT color preset products for sale.
  - `id` (uuid, primary key)
  - `name` (text, not null) — display name of the LUT preset
  - `description` (text, not null) — what the LUT does / its look
  - `price` (numeric, not null) — price in USD
  - `image_url` (text, not null) — sample photo used for before/after preview
  - `filter_css` (text, not null) — CSS filter string that simulates the LUT's "after" look on the image
  - `software` (text[], not null) — compatible software: 'premiere', 'davinci'
  - `category` (text, not null) — e.g. 'Cinematic', 'Vintage', 'Portrait', 'Night'
  - `featured` (boolean, default false) — show in hero/featured section
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `luts`.
- Public read access (anon + authenticated) since this is a product catalog with no auth.
- No public write access — inserts/updates/deletes restricted to authenticated (admin) users.
*/

CREATE TABLE IF NOT EXISTS luts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text NOT NULL,
  filter_css text NOT NULL,
  software text[] NOT NULL DEFAULT '{}',
  category text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE luts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_luts" ON luts;
CREATE POLICY "public_read_luts" ON luts FOR SELECT
TO anon, authenticated USING (true);
