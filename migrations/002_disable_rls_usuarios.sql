-- Script para deshabilitar RLS en tabla usuarios si es necesario
-- Esto permite que el backend inserte/actualice datos sin restricciones

-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'usuarios';

-- Deshabilitar RLS en la tabla usuarios (permite acceso sin restricciones)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Si después quieres habilitar RLS nuevamente:
-- ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
