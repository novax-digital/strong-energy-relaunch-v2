
-- Media categories table
CREATE TABLE public.media_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_de text NOT NULL,
  name_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage media categories" ON public.media_categories
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read media categories" ON public.media_categories
  FOR SELECT TO public
  USING (true);

-- Media items table
CREATE TABLE public.media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_de text NOT NULL,
  title_en text NOT NULL DEFAULT '',
  description_de text,
  description_en text,
  category_id uuid REFERENCES public.media_categories(id) ON DELETE SET NULL,
  media_type text NOT NULL DEFAULT 'image',
  file_url text,
  video_url text,
  thumbnail_url text,
  product_slugs text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage media items" ON public.media_items
  FOR ALL TO public
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read published media items" ON public.media_items
  FOR SELECT TO public
  USING (is_published = true);
