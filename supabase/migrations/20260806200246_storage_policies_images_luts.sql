/*
# Storage policies for images and luts buckets

1. Storage policies
- `images` bucket: allow anon + authenticated to read, upload, update, delete files
- `luts` bucket:   allow anon + authenticated to read, upload, update, delete files

2. Security notes
- Both buckets are PUBLIC (anyone can read via the public URL)
- Write access is open to anon + authenticated because the admin panel uses the
  anon key (no sign-in flow) — this matches the single-tenant no-auth design
- The admin password gate is enforced in the frontend only; storage write access
  is intentionally open to match the app's no-auth architecture
*/

-- images bucket policies
DROP POLICY IF EXISTS "images_public_read" ON storage.objects;
CREATE POLICY "images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_insert" ON storage.objects;
CREATE POLICY "images_anon_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_update" ON storage.objects;
CREATE POLICY "images_anon_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "images_anon_delete" ON storage.objects;
CREATE POLICY "images_anon_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'images');

-- luts bucket policies
DROP POLICY IF EXISTS "luts_public_read" ON storage.objects;
CREATE POLICY "luts_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'luts');

DROP POLICY IF EXISTS "luts_anon_insert" ON storage.objects;
CREATE POLICY "luts_anon_insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'luts');

DROP POLICY IF EXISTS "luts_anon_update" ON storage.objects;
CREATE POLICY "luts_anon_update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'luts') WITH CHECK (bucket_id = 'luts');

DROP POLICY IF EXISTS "luts_anon_delete" ON storage.objects;
CREATE POLICY "luts_anon_delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'luts');
