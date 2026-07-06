-- Blog topics table
CREATE TABLE public.blog_topics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic text NOT NULL,
  description text,
  used_at timestamptz,
  used_in_post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blog topics"
  ON public.blog_topics FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Blog authors table
CREATE TABLE public.blog_authors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  avatar_url text,
  bio text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage blog authors"
  ON public.blog_authors FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read blog authors"
  ON public.blog_authors FOR SELECT
  USING (true);

-- Add author_id to blog_posts
ALTER TABLE public.blog_posts
  ADD COLUMN author_id uuid REFERENCES public.blog_authors(id) ON DELETE SET NULL;

-- Storage bucket for author avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-authors', 'blog-authors', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Blog author avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-authors');

CREATE POLICY "Admins can upload blog author avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'blog-authors' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update blog author avatars"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'blog-authors' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can delete blog author avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'blog-authors' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));