-- Insertar Roles iniciales
INSERT INTO "Roles" ("id", "name", "description", "created_at", "updated_at")
VALUES (
  gen_random_uuid()::text,
  'Administrador',
  'Rol con acceso total al sistema',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Roles" ("id", "name", "description", "created_at", "updated_at")
VALUES (
  gen_random_uuid()::text,
  'Cliente', 
  'Rol Basico', 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP
)
ON CONFLICT ("name") DO NOTHING;

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
VALUES (
  gen_random_uuid()::text,
  'root@admin.com',
  'Admin*123',
  'Root',
  'Admin',
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  (SELECT id FROM "Roles" WHERE "name" = 'Administrador' LIMIT 1)
)
ON CONFLICT ("email") DO NOTHING;
