-- Create storage bucket for product videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-videos', 'product-videos', true);

-- Allow public read access
CREATE POLICY "Product videos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-videos');

-- Allow authenticated users to upload (for admin)
CREATE POLICY "Authenticated users can upload product videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-videos' AND auth.role() = 'authenticated');