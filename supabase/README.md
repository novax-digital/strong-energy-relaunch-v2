# Strong Energy Supabase Setup

This project is prepared for a fresh Supabase backend. The migrations in `supabase/migrations` recreate the tables, storage buckets, RLS policies and helper functions from the original backend.

The browser-facing Next app only exposes variables prefixed with `NEXT_PUBLIC_`. Keep the service-role key out of `.env.local`; Supabase provides it automatically to deployed edge functions.

## 1. Create the project

Create a new Supabase project in the Supabase dashboard.

## 2. Add local setup values

Copy `.env.example` to `.env.local` in the project root and fill in the values from your new Supabase project:

```bash
cp .env.example .env.local
```

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_OR_PUBLISHABLE_KEY
SUPABASE_PROJECT_REF=YOUR_PROJECT_REF
SUPABASE_DB_PASSWORD=YOUR_DATABASE_PASSWORD
```

Optional:

```bash
SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
DEPLOY_SUPABASE_FUNCTIONS=false
RESEND_API_KEY=
```

`SUPABASE_ACCESS_TOKEN` is only needed when you are not already logged in through `npx supabase login`.

## 3. Run the setup

The setup script reads `.env.local`, links the Supabase project and pushes all migrations, including initial content seeds.

```bash
npm run supabase:setup
```

This creates:

- auth role table and admin helper
- inquiry and contact-message tables
- blog, downloads, media and product-category tables
- storage buckets and RLS policies
- initial content seeds for products/downloads/media/blog from `src/content/generated`

## 4. Optional: deploy edge functions

Set `DEPLOY_SUPABASE_FUNCTIONS=true` in `.env.local` before running `npm run supabase:setup`.

These are optional:

- `manage-users` powers the admin user-management tab. Without it, create users manually in Supabase Authentication.
- `send-notification-email` sends form notification emails. Without it, form entries are still saved in the database.
- `verify-site-password` is only needed if you use the old website-password protection flow.
- `generate-blog-post` powers the admin AI blog generator and creates German/English blog drafts.
- `temp-upload-media` and `migrate-media-files` are admin-only helpers for media uploads and legacy media migration.

## 5. Optional: add function secrets

Only the deployed edge functions need server-side secrets. The Next app does not need these.

The notification function sends mail through Resend. Add this before setup if needed:

```bash
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

The AI blog generator needs an OpenAI-compatible LLM key. Add this before setup if needed:

```bash
LLM_API_KEY=YOUR_LLM_API_KEY
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
```

Supabase provides `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` automatically to deployed edge functions. The service-role key stays inside Supabase and is never exposed to the browser or `.env.local`.

## 6. Create the first admin

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `.env.local`, create or update the first admin user with:

```bash
npm run supabase:create-admin
```

Alternatively, create a user in Supabase Authentication, then grant the admin role by e-mail:

```bash
npm run supabase:grant-admin -- admin@example.com
```

After that, the user can log in at `/login` and access `/admin`.
