ALTER TABLE public.blog_posts ADD COLUMN language text NOT NULL DEFAULT 'de';
ALTER TABLE public.blog_posts ADD COLUMN translation_group_id uuid DEFAULT gen_random_uuid();