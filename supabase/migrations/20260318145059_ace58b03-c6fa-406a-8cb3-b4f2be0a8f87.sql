DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

CREATE OR REPLACE VIEW public.site_settings_public AS
  SELECT id, password_protection_enabled, updated_at
  FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;

CREATE POLICY "Only admins can read site settings"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));