
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  password_protection_enabled BOOLEAN NOT NULL DEFAULT true,
  password_protection_password TEXT NOT NULL DEFAULT 'Strong26!',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (needed for PasswordGate)
CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert initial row
INSERT INTO public.site_settings (id, password_protection_enabled, password_protection_password)
VALUES ('main', true, 'Strong26!');
