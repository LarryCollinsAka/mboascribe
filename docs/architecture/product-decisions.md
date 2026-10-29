# MboaScribe product decisions

## Product scope
- MboaScribe is a language-services platform, not a transcription-only application.
- MVP service types: transcription and translation.
- The domain leaves room for combined transcription + translation and subtitling without exposing every service in the first UI.
- Books, manuscripts, long documents and specialist translation begin with a custom quote rather than automatic per-word pricing.

## UI direction
- Cameroon-inspired accents: green, red and gold used sparingly.
- Primary visual system: brown / earth tones with a dominant brownish golden-yellow.
- Rounded, radial forms and gradients rather than a generic SaaS blue interface.
- Product locale baseline: English, French and Spanish, with locale-aware URLs and configuration designed to expand.

## Storage
- Cloudflare R2 is the production object store.
- Customer media and documents must remain private.
- Browser uploads should go directly to R2 using short-lived upload authorization rather than proxying large files through Vercel.
- Database records store object keys, not permanent public URLs.

## Database
- PostgreSQL on PlanetScale is the system of record for business state.
- Drizzle owns schema and migrations.
- Order is service-neutral. Recordings and documents are service-specific source assets.

## Payments — MVP
- Methods represented by the domain: Selar, manual payment, Grey bank transfer and Airtm.
- Grey/Airtm are treated as externally completed, manually verified payment methods unless a supported automated integration is explicitly implemented.
- A customer's claim or uploaded proof never marks an order paid. Verification is required before the order moves to PAID.
- Direct Cameroon payment-rail integrations are deferred until order volume justifies them.
