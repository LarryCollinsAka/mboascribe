# Cloudflare R2 setup

MboaScribe uses a private R2 bucket and short-lived presigned PUT URLs. Keep these server-only variables in `.env.local` and in the corresponding Vercel environment:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME` (development: `mboascribe-dev`)
- `R2_ENDPOINT`

Do not prefix credentials with `NEXT_PUBLIC_`.

## Browser upload CORS

Before testing browser-to-R2 uploads, configure the `mboascribe-dev` bucket CORS policy for the exact local/preview origins you use. Allow `PUT` and the `Content-Type` request header. Do not make the bucket public. Production should use its own bucket, token, and origin policy.

The presign endpoint is `POST /api/uploads/presign`. It authenticates the Supabase session, checks access to the order, validates MIME type and size, creates the recording/document metadata row, generates a server-controlled object key, and returns a five-minute presigned upload URL.
