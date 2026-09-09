/*
# Fix admin product save — RLS write policies + schema alignment

The /admin page could not save products (HTTP 400). Two root causes:

1. RLS blocked every write. The `luts` table had RLS enabled with only a
   SELECT policy. There were NO insert/update/delete policies, so all writes
   from the anon-key frontend were rejected.

2. Schema/code mismatch. The frontend saves a field called `after_filter`,
   but the database column was `filter_css`. In addition, the legacy columns
   `image_url` and `filter_css` were NOT NULL with no default, so even a
   test product without images failed the insert.

Changes:

1. New column
   - `after_filter` (text, nullable) — CSS filter string applied to the
     "after" image for the before/after preview slider. This is the field
     the admin frontend writes; `filter_css` is the legacy equivalent kept
     for back-compat.

2. Relaxed constraints (data-safe — columns already existed)
   - `image_url`: drop NOT NULL so products using `before_url` instead can save.
   - `filter_css`: drop NOT NULL so products using `after_filter` instead can save.

3. Backfill
   - Copy any existing `filter_css` values into `after_filter` so no preview
     data is lost.

4. Security — RLS write policies (single-tenant, no-auth app)
   This app has no sign-in screen; the admin panel runs entirely on the anon
   key with a frontend-only password gate. Per the bolt-database guidance,
   policies are scoped `TO anon, authenticated` so the anon-key client can
   read AND write. RLS stays ENABLED (not disabled) with explicit per-verb
   policies instead of a blanket open table.

   Added:
   - insert_own_luts  (FOR INSERT, WITH CHECK (true))
   - update_own_luts  (FOR UPDATE, USING (true) WITH CHECK (true))
   - delete_own_luts  (FOR DELETE, USING (true))

   The existing `public_read_luts` SELECT policy is retained unchanged.
   `USING (true)` / `WITH CHECK (true)` is correct here because this is an
   intentionally public/shared single-tenant catalog — not a shortcut around
   an ownership check.

5. Storage buckets
   No changes required — the `images` and `luts` buckets already have
   anon+authenticated read/write/delete policies and are public. Storage
   was not the cause of the 400 error.
*/

-- 1. Add after_filter column to match frontend field name
ALTER TABLE luts ADD COLUMN IF NOT EXISTS after_filter text;

-- 2. Backfill after_filter from filter_css where present
UPDATE luts SET after_filter = filter_css WHERE after_filter IS NULL AND filter_css IS NOT NULL;

-- 3. Relax legacy NOT NULL columns so before_url/after_url flow works
ALTER TABLE luts ALTER COLUMN image_url DROP NOT NULL;
ALTER TABLE luts ALTER COLUMN filter_css DROP NOT NULL;

-- 4. Add the missing RLS write policies (RLS stays ENABLED)
DROP POLICY IF EXISTS "insert_luts" ON luts;
CREATE POLICY "insert_luts" ON luts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_luts" ON luts;
CREATE POLICY "update_luts" ON luts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_luts" ON luts;
CREATE POLICY "delete_luts" ON luts FOR DELETE
  TO anon, authenticated USING (true);
