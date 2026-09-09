/*
# Add multi-image support (before_urls, after_urls) to luts

The before/after slider now shows a 2x2 grid of images on each side.
Previously only a single before_url and after_url were stored.

Changes:

1. New columns
   - `before_urls` (text[], nullable) — up to 4 before image URLs
   - `after_urls`  (text[], nullable) — up to 4 after image URLs

2. Backfill
   - Populate before_urls/after_urls from existing before_url/after_url
     so current products keep working with the new grid slider.

3. Security
   - No RLS changes — existing CRUD policies cover the new columns.
*/

ALTER TABLE luts ADD COLUMN IF NOT EXISTS before_urls text[];
ALTER TABLE luts ADD COLUMN IF NOT EXISTS after_urls text[];

UPDATE luts SET before_urls = ARRAY[before_url] WHERE before_urls IS NULL AND before_url IS NOT NULL;
UPDATE luts SET after_urls = ARRAY[after_url] WHERE after_urls IS NULL AND after_url IS NOT NULL;
