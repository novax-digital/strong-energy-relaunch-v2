
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_type TEXT NOT NULL CHECK (customer_type IN ('installateur', 'gewerbe', 'privatperson')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bundesland TEXT,
  product_slug TEXT,
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public contact form)
CREATE POLICY "Anyone can submit an inquiry"
ON public.inquiries
FOR INSERT
WITH CHECK (true);

-- Only service role can read
CREATE POLICY "Service role can read inquiries"
ON public.inquiries
FOR SELECT
USING (false);
