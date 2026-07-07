with desired_authors (name, avatar_url, bio, is_default) as (
  values
    ('David Norris', '/assets/david-norris-B7MVbvOm.jpg', 'Deputy GM of Strong Energy D/A/CH', true),
    ('Farideh M. Nezamabadi', '/assets/farideh-nezamabadi-DrisO523.jpg', 'Order Operation Management', false),
    ('Jason Gao', '/assets/jason-gao-DwOvahh8.jpg', 'Product Engineer PV & Battery', false),
    ('Michael Müller', '/assets/michael-mueller-BnLIIN3Z.jpg', 'Head of Marketing', false),
    ('Niklas Balakowski', '/assets/niklas-balakowski-DyTINIJV.jpg', 'Key Account Manager', false),
    ('Nils Beck', '/assets/nils-beck-BQ8OoITI.jpg', 'Head of Technical Solutions', false)
),
updated_authors as (
  update public.blog_authors as author
  set
    avatar_url = desired_authors.avatar_url,
    bio = desired_authors.bio,
    is_default = desired_authors.is_default
  from desired_authors
  where author.name = desired_authors.name
  returning author.name
)
insert into public.blog_authors (name, avatar_url, bio, is_default)
select name, avatar_url, bio, is_default
from desired_authors
where not exists (
  select 1
  from public.blog_authors existing
  where existing.name = desired_authors.name
);

update public.blog_authors
set is_default = false
where name <> 'David Norris';
