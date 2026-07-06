
CREATE POLICY "Admins can upload media files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can read media files"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');
