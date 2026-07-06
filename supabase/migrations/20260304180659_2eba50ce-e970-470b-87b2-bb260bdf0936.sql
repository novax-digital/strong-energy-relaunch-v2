
-- Create downloads table
CREATE TABLE public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_de text NOT NULL,
  title_en text NOT NULL DEFAULT '',
  description_de text,
  description_en text,
  category text NOT NULL DEFAULT 'Datenblatt',
  file_url_de text,
  file_url_en text,
  product_slugs text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Anyone can read published downloads
CREATE POLICY "Anyone can read published downloads"
  ON public.downloads FOR SELECT
  USING (is_published = true);

-- Admins can manage all downloads
CREATE POLICY "Admins can manage downloads"
  ON public.downloads FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for download files
INSERT INTO storage.buckets (id, name, public) VALUES ('downloads', 'downloads', true);

-- Storage policies for downloads bucket
CREATE POLICY "Anyone can read download files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'downloads');

CREATE POLICY "Admins can upload download files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'downloads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete download files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'downloads' AND has_role(auth.uid(), 'admin'::app_role));
