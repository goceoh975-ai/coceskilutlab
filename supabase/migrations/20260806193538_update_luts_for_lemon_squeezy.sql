/*
# Update LUT catalog for Lemon Squeezy integration

1. Changes to `luts` table
- Add `checkout_url` (text) — Lemon Squeezy checkout link for each product
- Add `is_bundle` (boolean, default false) — flags the Complete Pack bundle product
- Add unique constraint on `name` so ON CONFLICT upserts work

2. Data changes
- Delete LUTs that are not in the 6 required presets (12 rows -> 6 rows)
- Delete any existing bundle row so we can re-insert cleanly
- Update remaining prices to $5.00
- Insert the Complete Pack bundle at $19.00
- Set `checkout_url` to '#' placeholders — the site owner replaces these
  with real Lemon Squeezy checkout URLs from their dashboard

3. Security
- No RLS changes — public read access remains unchanged
*/

ALTER TABLE luts ADD COLUMN IF NOT EXISTS checkout_url text;
ALTER TABLE luts ADD COLUMN IF NOT EXISTS is_bundle boolean NOT NULL DEFAULT false;

-- Add unique constraint on name for upsert support
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'luts_name_unique'
  ) THEN
    ALTER TABLE luts ADD CONSTRAINT luts_name_unique UNIQUE (name);
  END IF;
END $$;

-- Remove LUTs not in the required 6
DELETE FROM luts WHERE name NOT IN (
  'Cinematic Teal & Orange',
  'Moody Blue Shadow',
  'Golden Hour Glow',
  'Neon Night Grade',
  'Vintage Film Emulation',
  'Noir Mono Contrast'
);

-- Update the 6 individual LUTs to $5.00 and set placeholder checkout URLs
UPDATE luts SET price = 5.00, checkout_url = '#', is_bundle = false WHERE name IN (
  'Cinematic Teal & Orange',
  'Moody Blue Shadow',
  'Golden Hour Glow',
  'Neon Night Grade',
  'Vintage Film Emulation',
  'Noir Mono Contrast'
);

-- Unfeature the individual LUTs; bundle will be featured
UPDATE luts SET featured = false WHERE is_bundle = false;

-- Insert the Complete Pack bundle (upsert)
INSERT INTO luts (name, description, price, image_url, filter_css, software, category, featured, is_bundle, checkout_url)
VALUES (
  'Complete Pack',
  'All 6 COCESKI LUTLab presets in one bundle. Get every cinematic look for Premiere Pro, DaVinci Resolve, Final Cut Pro, and more — at 37% off the individual price.',
  19.00,
  'https://images.pexels.com/photos/879532/pexels-photo-879532rgb&h=650&w=940',
  'contrast(1.18) saturate(1.5) hue-rotate(-5deg) brightness(1.05) sepia(0.12)',
  ARRAY['premiere','davinci'],
  'Bundle',
  true,
  true,
  '#'
)
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  is_bundle = EXCLUDED.is_bundle,
  checkout_url = EXCLUDED.checkout_url,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured;
