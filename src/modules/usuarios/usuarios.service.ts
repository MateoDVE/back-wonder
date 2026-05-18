import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { supabase } from '../../infrastructure/supabase/supabase.client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function isSupabaseUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message);
}

@Injectable()
export class UsuariosService {
  async ensureInitialAdminUser(): Promise<void> {
    const email = 'matu2207@gmail.com';

    try {
      // Check if user exists in Supabase Auth
      const { data: existingAuth, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        throw new BadRequestException(`Error listing users: ${listError.message}`);
      }
      const userExists = existingAuth?.users?.some((u: any) => u.email === email);

      if (userExists) {
        return;
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: '123456',
        email_confirm: true,
      });

      if (authError) {
        throw new BadRequestException(
          `Error creando usuario en Auth: ${authError.message}`,
        );
      }

      // Create user profile in usuarios table
      const { error: dbError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        email,
        nombre: 'Mateo',
        apellido: 'Vargas',
        rol: 'admin',
        activo: true,
        verificado: true,
        pais: 'Bolivia',
      });

      if (dbError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new BadRequestException(
          `Error creando perfil de usuario: ${dbError.message}`,
        );
      }
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return;
      }
      throw error;
    }
  }

  async crearInvitado(): Promise<{ id: string }> {
    const timestamp = Date.now();
    const email = `invitado_${timestamp}@wonder.local`;
    const password = Math.random().toString(36).substring(2, 15);

    try {
      // Create guest user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        throw new Error(`Error creando usuario invitado en Auth: ${authError.message}`);
      }

      // Create user profile
      const { error: dbError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email,
          nombre: 'Invitado',
          rol: 'cliente',
          activo: true,
          verificado: false,
        });

      if (dbError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Error creando perfil invitado: ${dbError.message}`);
      }

      return { id: authData.user.id };
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return { id: `invitado_${timestamp}` };
      }
      throw error;
    }
  }

  async findById(id: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Error buscando usuario: ${error.message}`);
      }

      return data ?? null;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return null;
      }
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, nombre, apellido, telefono, direccion, ciudad, departamento, codigo_postal, pais, rol, activo } = createUserDto;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        throw new BadRequestException('Email already registered');
      }
      throw new BadRequestException(`Error creating user: ${authError.message}`);
    }

    // Create user profile in database
    const { data, error: dbError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        nombre,
        apellido,
        telefono,
        direccion,
        ciudad,
        departamento,
        codigo_postal,
        pais,
        rol: rol || 'cliente',
        activo: typeof activo === 'boolean' ? activo : true,
        verificado: false,
      })
      .select('*')
      .single();

    if (dbError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new BadRequestException(`Error creating user profile: ${dbError.message}`);
    }

    return data;
  }

  async findAll(opts?: { page?: number; pageSize?: number; rol?: string; activo?: boolean }) {
    const page = opts?.page ?? 1;
    const pageSize = opts?.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      let query = supabase.from('usuarios').select('*');
      if (opts?.rol) query = (query as any).eq('rol', opts.rol);
      if (typeof opts?.activo === 'boolean') query = (query as any).eq('activo', opts.activo);

      const { data, error, count } = await (query as any).order('id', { ascending: false }).range(from, to);
      if (error) {
        throw new BadRequestException(error.message);
      }

      // remove password_hash
      const items = (data || []).map((u: any) => {
        const { password_hash, ...rest } = u;
        return rest;
      });

      return { items, page, pageSize, total: null };
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return { items: [], page, pageSize, total: 0 };
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto as any;

    // Update password in Supabase Auth if provided
    if (password) {
      const { error: authError } = await supabase.auth.admin.updateUserById(id, {
        password,
      });
      if (authError) {
        throw new BadRequestException(`Error updating password: ${authError.message}`);
      }
    }

    // Update user profile
    const { data, error } = await supabase
      .from('usuarios')
      .update(rest)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) throw new NotFoundException('Usuario no encontrado');

    return data;
  }

  async remove(id: string) {
    // Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      throw new BadRequestException(`Error deleting user: ${authError.message}`);
    }

    // Delete user profile from database
    const { error: dbError } = await supabase.from('usuarios').delete().eq('id', id);
    if (dbError) {
      throw new BadRequestException(dbError.message);
    }

    return { deleted: true, id };
  }

  async findByEmail(email: string) {
    try {
      const { data, error } = await supabase.from('usuarios').select('*').eq('email', email).maybeSingle();
      if (error) throw new BadRequestException(error.message);
      return data ?? null;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return null;
      }
      throw error;
    }
  }
}
