-- Seed admin role
INSERT INTO "Roles" ("id", "name", "description", "created_at", "updated_at")
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Administrador',
  'Rol con acceso total al sistema',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("name") DO UPDATE
SET
  "description" = EXCLUDED."description",
  "updated_at" = CURRENT_TIMESTAMP;

-- Seed root admin user
INSERT INTO "Users" (
  "id",
  "email",
  "password",
  "firstName",
  "lastName",
  "active",
  "email_verified",
  "created_at",
  "updated_at",
  "roleId"
)
SELECT
  '22222222-2222-2222-2222-222222222222',
  'root@admin.com',
  'Admin*123',
  'Root',
  'Admin',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  "id"
FROM "Roles"
WHERE "name" = 'Administrador'
ON CONFLICT ("email") DO UPDATE
SET
  "password" = EXCLUDED."password",
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  "active" = EXCLUDED."active",
  "email_verified" = EXCLUDED."email_verified",
  "updated_at" = CURRENT_TIMESTAMP,
  "roleId" = EXCLUDED."roleId";
