# Identity and RBAC

Supabase Auth owns authentication (`auth.users`). MboaScribe owns business identity and authorization in the public schema.

## Identity

`profiles.id` uses the same UUID as the corresponding Supabase `auth.users.id`. Drizzle intentionally does not manage the protected Supabase `auth` schema.

## Platform RBAC

A profile may hold multiple platform roles through `profile_roles`. This allows, for example, the same worker to be both `TRANSCRIBER` and `TRANSLATOR`.

Initial system roles to seed:

- SUPERADMIN (protected)
- ADMIN
- OPERATIONS
- TRANSCRIBER
- TRANSLATOR
- REVIEWER
- QUALITY_REVIEWER

Roles receive granular permissions through `role_permissions`. SUPERADMIN is the authorization-governance role and must be protected in application logic from deletion, renaming, or assignment by ordinary admins.

## Organization access

Customer access is modeled separately through `organization_memberships` with OWNER, ADMIN, MEMBER and BILLING roles. Customer is therefore not a platform workforce role.

## Translation

Translation-specific metadata belongs in `translation_projects`; `documents` only describes uploaded files. This supports books, manuscripts, articles, academic writing, websites, marketing, business, legal and technical content without coupling file format to service type.
