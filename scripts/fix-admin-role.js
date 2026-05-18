#!/usr/bin/env node

/**
 * Script para verificar y corregir el rol del usuario administrador
 * 
 * Uso: npm run fix-admin-role
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_KEY no están configuradas en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminRole() {
  const email = 'abvargas13@gmail.com';

  console.log('🔧 Verificando y corrigiendo rol del administrador...\n');

  try {
    // 1. Buscar usuario por email
    console.log(`📧 Buscando usuario: ${email}`);
    const { data: usuario, error: queryError } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, rol, activo')
      .eq('email', email)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error(`❌ Error buscando usuario: ${queryError.message}`);
      process.exit(1);
    }

    if (!usuario) {
      console.error(`❌ Usuario no encontrado: ${email}`);
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   ID: ${usuario.id}`);
    console.log(`   Nombre: ${usuario.nombre}`);
    console.log(`   Rol actual: ${usuario.rol}`);
    console.log('');

    if (usuario.rol === 'admin') {
      console.log('✨ ¡El usuario ya tiene rol admin!');
      process.exit(0);
    }

    // 2. Corregir el rol
    console.log('🔄 Actualizando rol a admin...');
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ rol: 'admin' })
      .eq('id', usuario.id);

    if (updateError) {
      console.error(`❌ Error actualizando rol: ${updateError.message}`);
      process.exit(1);
    }

    // 3. Verificar que se actualizó
    const { data: usuarioActualizado } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', usuario.id)
      .single();

    console.log(`✅ Rol actualizado a: ${usuarioActualizado.rol}`);
    console.log('\n✨ ¡Usuario administrador corregido exitosamente!');
    console.log('📝 Ahora intenta hacer login de nuevo');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

fixAdminRole();
