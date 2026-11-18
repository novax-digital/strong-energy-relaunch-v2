alter table public.blog_posts
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists focus_keyword text,
  add column if not exists cover_image_alt text;

comment on column public.blog_posts.seo_title is 'Optional title for search results and social previews.';
comment on column public.blog_posts.seo_description is 'Optional meta description for search results and social previews.';
comment on column public.blog_posts.focus_keyword is 'Editorial focus keyword used by the admin SEO checklist.';
comment on column public.blog_posts.cover_image_alt is 'Accessible alternative text for the blog cover image.';
