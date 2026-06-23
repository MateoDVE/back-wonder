#!/usr/bin/env node

/**
 * Script para crear usuario administrador inicial en Supabase Auth
 * 
 * Uso: npm run create-admin
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

async function createAdminUser() {
  const email = 'wonderbolivia@gmail.com';
  const password = '5312681Wonder.';

  console.log('🔧 Creando usuario administrador...\n');

  try {
    // 1. Crear usuario en Supabase Auth
    console.log(`📧 Creando usuario en Auth: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error(`❌ Error creando usuario en Auth: ${authError.message}`);
      process.exit(1);
    }

    if (!authData.user) {
      console.error('❌ Error: No se recibió el usuario creado');
      process.exit(1);
    }

    console.log(`✅ Usuario creado en Auth con ID: ${authData.user.id}\n`);

    // 2. Crear perfil en tabla usuarios
    console.log('👤 Creando perfil de usuario...');
    const { error: profileError } = await supabase.from('usuarios').insert({
      id: authData.user.id,
      email,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'admin',
      activo: true,
      verificado: true,
      pais: 'Bolivia',
    });

    if (profileError) {
      console.error(`❌ Error creando perfil: ${profileError.message}`);
      // Intentar limpiar el usuario de Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      process.exit(1);
    }

    console.log('✅ Perfil de usuario creado\n');

    // 3. Mostrar resultado
    console.log('✨ ¡Usuario administrador creado exitosamente!\n');
    console.log('📋 Detalles:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${password}`);
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Rol: admin`);
    console.log('\n✅ Ya puedes iniciar sesión en la aplicación');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  }
}

createAdminUser();
