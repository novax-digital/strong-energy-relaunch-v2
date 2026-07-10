ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS zendori_contact_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS zendori_commercial_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS zendori_partner_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS zendori_product_inquiry_enabled boolean NOT NULL DEFAULT true;

CREATE OR REPLACE VIEW public.site_settings_public AS
  SELECT
    id,
    password_protection_enabled,
    updated_at,
    zendori_contact_enabled,
    zendori_commercial_enabled,
    zendori_partner_enabled,
    zendori_product_inquiry_enabled
  FROM public.site_settings;

GRANT SELECT ON public.site_settings_public TO anon, authenticated;
