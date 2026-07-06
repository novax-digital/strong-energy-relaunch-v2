CREATE TABLE public.product_categories (
  slug TEXT PRIMARY KEY,
  label_de TEXT NOT NULL,
  label_en TEXT NOT NULL DEFAULT '',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage product categories"
  ON public.product_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read product categories"
  ON public.product_categories FOR SELECT
  USING (true);

INSERT INTO public.product_categories (slug, label_de, label_en, is_visible, sort_order) VALUES
  ('solaranlagen', 'Solaranlagen', 'Solar Systems', true, 0),
  ('gewerbespeicher-aio', 'All-in-One Gewerbespeicher', 'All-in-One Commercial Storage', true, 1),
  ('gewerbespeicher-container', 'Container Gewerbespeicher', 'Container Commercial Storage', false, 2);