# MboaScribe Supabase Auth setup

This slice uses Supabase Auth with cookie-based SSR for Next.js 16.

## Environment

Keep these in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
DIRECT_DATABASE_URL=...
```

Never put the Supabase `service_role` key in a `NEXT_PUBLIC_*` variable.

## Install

```bash
npm install
npm run build
```

## Email confirmation (when Confirm email is enabled)

In Supabase Authentication > Email Templates > Confirm signup, use a confirmation URL that targets the SSR confirmation endpoint:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Set the Supabase Site URL to your local/production application URL as appropriate.

## First account

Create the account through `/en/signup` (or `/fr/signup`, `/es/signup`). After the account has an authenticated session and reaches the dashboard, MboaScribe creates its `profiles` row using the exact `auth.users.id` UUID.

Do not assign SUPERADMIN until that real profile exists.
