-- Migración: Convertir tabla usuarios a UUID

-- 1. Remover foreign keys dependientes
ALTER TABLE carrito DROP CONSTRAINT IF EXISTS carrito_usuario_id_fkey CASCADE;
ALTER TABLE ordenes DROP CONSTRAINT IF EXISTS ordenes_usuario_id_fkey CASCADE;
ALTER TABLE resenas DROP CONSTRAINT IF EXISTS resenas_usuario_id_fkey CASCADE;

-- 2. Remover vistas que dependen
DROP VIEW IF EXISTS vista_ordenes_resumen CASCADE;

-- 3. Remover el constraint de foreign key si existe
ALTER TABLE usuarios
  DROP CONSTRAINT IF EXISTS fk_auth_users CASCADE;

-- 4. Remover el valor por defecto de la columna id
ALTER TABLE usuarios
  ALTER COLUMN id DROP DEFAULT;

-- 5. Crear columna temporal con UUID
ALTER TABLE usuarios
  ADD COLUMN id_uuid uuid DEFAULT gen_random_uuid();

-- 6. Actualizar las columnas en tablas dependientes a UUID
ALTER TABLE carrito
  ADD COLUMN usuario_id_uuid uuid;

ALTER TABLE ordenes
  ADD COLUMN usuario_id_uuid uuid;

ALTER TABLE resenas
  ADD COLUMN usuario_id_uuid uuid;

-- 7. Copiar datos convertidos
UPDATE carrito SET usuario_id_uuid = u.id_uuid
FROM usuarios u WHERE carrito.usuario_id = u.id;

UPDATE ordenes SET usuario_id_uuid = u.id_uuid
FROM usuarios u WHERE ordenes.usuario_id = u.id;

UPDATE resenas SET usuario_id_uuid = u.id_uuid
FROM usuarios u WHERE resenas.usuario_id = u.id;

-- 8. Remover columnas antiguas
ALTER TABLE carrito DROP COLUMN usuario_id;
ALTER TABLE ordenes DROP COLUMN usuario_id;
ALTER TABLE resenas DROP COLUMN usuario_id;

-- 9. Renombrar columnas nuevas
ALTER TABLE carrito RENAME COLUMN usuario_id_uuid TO usuario_id;
ALTER TABLE ordenes RENAME COLUMN usuario_id_uuid TO usuario_id;
ALTER TABLE resenas RENAME COLUMN usuario_id_uuid TO usuario_id;

-- 10. Remover la columna id antigua de usuarios
ALTER TABLE usuarios DROP COLUMN id;

-- 11. Renombrar la columna nueva a id
ALTER TABLE usuarios RENAME COLUMN id_uuid TO id;

-- 12. Establecer como PRIMARY KEY
ALTER TABLE usuarios ADD PRIMARY KEY (id);

-- 13. Remover la secuencia antigua si existe
DROP SEQUENCE IF EXISTS usuarios_id_seq;

-- 14. Remover password_hash si existe
ALTER TABLE usuarios DROP COLUMN IF EXISTS password_hash;

-- 15. Recrear foreign keys
ALTER TABLE carrito
  ADD CONSTRAINT carrito_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

ALTER TABLE ordenes
  ADD CONSTRAINT ordenes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

ALTER TABLE resenas
  ADD CONSTRAINT resenas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Verificar estructura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;
