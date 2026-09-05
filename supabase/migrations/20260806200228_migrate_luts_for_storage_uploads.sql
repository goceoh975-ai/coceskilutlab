/*
# Migrate luts table for Supabase storage + admin uploads

1. New columns on `luts` table
- `before_url` (text) — URL of the "before" (original) image in storage
- `after_url`  (text) — URL of the "after" (graded) image in storage
- `zip_url`    (text) — URL of the .zip LUT file in storage
- `lemon_link` (text) — Lemon Squeezy checkout link (replaces checkout_url)

2. Data migration
- Copy existing `image_url` into both `before_url` and `after_url` (same image for both,
  the CSS filter on after_image provides the "graded" look until the admin uploads
  separate before/after images)
- Copy existing `checkout_url` into `lemon_link`
- Existing `is_bundle`, `filter_css`, and other columns are preserved

3. Security
- RLS already enabled with anon+authenticated CRUD policies — no changes needed
- Existing policies remain valid for the new columns
*/

ALTER TABLE luts ADD COLUMN IF NOT EXISTS before_url text;
ALTER TABLE luts ADD COLUMN IF NOT EXISTS after_url text;
ALTER TABLE luts ADD COLUMN IF NOT EXISTS zip_url text;
ALTER TABLE luts ADD COLUMN IF NOT EXISTS lemon_link text;

-- Migrate existing data into new columns
UPDATE luts SET before_url = image_url WHERE before_url IS NULL AND image_url IS NOT NULL;
UPDATE luts SET after_url = image_url WHERE after_url IS NULL AND image_url IS NOT NULL;
UPDATE luts SET lemon_link = checkout_url WHERE lemon_link IS NULL AND checkout_url IS NOT NULL;
