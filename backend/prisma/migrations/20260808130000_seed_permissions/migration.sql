-- 1. Insertar Permisos iniciales (IDs fijos para consistencia)
-- Nota: se descartan permisos/accesos de la app de tienda (contenido, productos,
-- pedidos, mis-pedidos y tienda). El árbol queda con los módulos de administración
-- agrupados bajo el menú padre "Administración": Dashboard (raíz) y
-- Administración > Usuarios, Roles.
INSERT INTO "Permissions" ("id", "path", "title", "type", "icon", "order", "active", "parentId", "created_at", "updated_at")
VALUES
-- Menús Raíz
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0002', '/dashboard', 'Dashboard', 'MENU', 'BarChart3', 5, true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0001', '/administracion', 'Administración', 'MENU', 'Settings', 10, true, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Submenús de Administración
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0003', '/usuarios', 'Usuarios', 'MENU', 'Users', 1, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', '/roles', 'Roles', 'MENU', 'ShieldCheck', 5, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Acciones de Dashboard
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0201', '/dashboard/acceso', 'Acceso', 'ACTION', 'LogIn', 1, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Acciones de Usuarios
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0301', '/usuarios/acceso', 'Acceso', 'ACTION', 'LogIn', 1, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0302', '/usuarios/nuevo', 'Nuevo', 'ACTION', 'Plus', 3, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0303', '/usuarios/editar', 'Editar', 'ACTION', 'Edit', 5, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0304', '/usuarios/inactivar', 'Inactivar', 'ACTION', 'Trash2', 10, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Acciones de Roles
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0401', '/roles/acceso', 'Acceso', 'ACTION', 'LogIn', 1, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0402', '/roles/nuevo', 'Nuevo', 'ACTION', 'Plus', 3, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0403', '/roles/editar', 'Editar', 'ACTION', 'Edit', 5, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0404', '/roles/inactivar', 'Inactivar', 'ACTION', 'Trash2', 10, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0405', '/roles/permisos', 'Gestionar Permisos', 'ACTION', 'LockKeyhole', 15, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Acciones de Gestionar Permisos
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0501', '/roles/permisos/acceso', 'Acceso', 'ACTION', 'LogIn', 1, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0405', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0502', '/roles/permisos/guardar', 'Guardar', 'ACTION', 'Save', 3, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0405', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0503', '/roles/permisos/editar-arbol', 'Editar Árbol', 'ACTION', 'Settings2', 5, true, 'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0405', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- 2. Asignar todos los permisos al rol Administrador
INSERT INTO "RolePermissions" ("id", "roleId", "permissionId", "active", "created_at", "updated_at")
SELECT
    gen_random_uuid()::text,
    r.id,
    p.id,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Permissions" p
JOIN "Roles" r ON r."name" = 'Administrador'
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

-- 3. Asignar permisos específicos al rol Cliente
INSERT INTO "RolePermissions" ("id", "roleId", "permissionId", "active", "created_at", "updated_at")
SELECT
    gen_random_uuid()::text,
    r.id,
    p.id,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "Permissions" p
JOIN "Roles" r ON r."name" = 'Cliente'
WHERE p.id IN (
    'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0002', -- Dashboard (Menú)
    'b1c1dbd9-a0eb-4e8f-8d6a-9f4b7c1a0201'  -- Dashboard (Acceso)
)
ON CONFLICT ("roleId", "permissionId") DO NOTHING;