-- MboaScribe initial RBAC seed. Run after the schema migration.
INSERT INTO roles (code, name, description, is_system, is_protected)
VALUES
  ('SUPERADMIN', 'Superadmin', 'Platform governance and unrestricted administration.', true, true),
  ('ADMIN', 'Admin', 'Day-to-day platform administration.', true, false),
  ('OPERATIONS', 'Operations', 'Operational order and workforce coordination.', true, false),
  ('TRANSCRIBER', 'Transcriber', 'Can perform transcription work.', true, false),
  ('TRANSLATOR', 'Translator', 'Can perform translation work.', true, false),
  ('REVIEWER', 'Reviewer', 'Can review production work.', true, false),
  ('QUALITY_REVIEWER', 'Quality Reviewer', 'Can perform final quality review.', true, false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, name, description)
VALUES
  ('roles.manage', 'Manage roles', 'Create, update and retire non-protected roles.'),
  ('permissions.manage', 'Manage permissions', 'Manage role-permission mappings.'),
  ('roles.assign', 'Assign roles', 'Assign permitted platform roles to profiles.'),
  ('superadmin.assign', 'Assign superadmin', 'Assign or revoke the protected SUPERADMIN role.'),
  ('users.view', 'View users', 'View platform profiles and memberships.'),
  ('users.manage', 'Manage users', 'Manage platform profiles and account-level access.'),
  ('organizations.view', 'View organizations', 'View customer organizations.'),
  ('organizations.manage', 'Manage organizations', 'Manage customer organizations and memberships.'),
  ('orders.view', 'View orders', 'View orders permitted by operational scope.'),
  ('orders.manage', 'Manage orders', 'Update and administer orders.'),
  ('orders.assign', 'Assign orders', 'Assign production work.'),
  ('orders.cancel', 'Cancel orders', 'Cancel eligible orders.'),
  ('transcriptions.work', 'Work on transcriptions', 'Perform transcription work.'),
  ('translations.work', 'Work on translations', 'Perform translation work.'),
  ('reviews.work', 'Perform reviews', 'Review transcription or translation work.'),
  ('quality.approve', 'Approve quality', 'Give final quality approval.'),
  ('payments.view', 'View payments', 'View payment records and proof.'),
  ('payments.verify', 'Verify payments', 'Approve or reject manually verified payments.'),
  ('payments.refund', 'Refund payments', 'Authorize supported refunds.'),
  ('platform.settings.manage', 'Manage platform settings', 'Manage protected platform configuration.')
ON CONFLICT (code) DO NOTHING;

-- SUPERADMIN receives every permission. Protected permission enforcement must
-- also happen in server-side application logic.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPERADMIN'
ON CONFLICT DO NOTHING;

-- Sensible operational baseline for ADMIN. Deliberately excludes RBAC governance,
-- SUPERADMIN assignment and protected platform settings.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN (
  'users.view', 'users.manage',
  'organizations.view', 'organizations.manage',
  'orders.view', 'orders.manage', 'orders.assign', 'orders.cancel',
  'payments.view', 'payments.verify', 'payments.refund'
)
WHERE r.code = 'ADMIN'
ON CONFLICT DO NOTHING;
