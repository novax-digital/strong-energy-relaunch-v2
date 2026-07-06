-- Preferred local command:
-- npm run supabase:grant-admin -- admin@example.com
--
-- SQL fallback:
-- Run this after creating the first auth user in the new Supabase project.
-- Replace admin@example.com with the user's e-mail address.

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where lower(email) = lower('admin@example.com')
on conflict (user_id, role) do nothing;
