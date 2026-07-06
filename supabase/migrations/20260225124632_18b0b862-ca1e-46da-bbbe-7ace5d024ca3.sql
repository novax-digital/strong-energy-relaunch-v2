-- Table for configurable notification recipients
CREATE TABLE public.notification_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  form_type text NOT NULL DEFAULT 'both',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Validation trigger instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_notification_recipient()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.form_type NOT IN ('contact', 'inquiry', 'both') THEN
    RAISE EXCEPTION 'form_type must be contact, inquiry, or both';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_notification_recipient
  BEFORE INSERT OR UPDATE ON public.notification_recipients
  FOR EACH ROW EXECUTE FUNCTION public.validate_notification_recipient();

ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage notification recipients"
  ON public.notification_recipients
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.notification_recipients (name, email, form_type)
VALUES ('Standard', 'info_de@strong-energy.eu', 'both');