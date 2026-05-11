import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { supabase } from '../../infrastructure/supabase/supabase.client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsuariosService {
  async ensureInitialAdminUser(): Promise<void> {
    const email = 'matu2207@gmail.com';

    const { data: existing, error: existingError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingError) {
      throw new BadRequestException(
        `Error verificando usuario inicial: ${existingError.message}`,
      );
    }

    if (existing) {
      return;
    }

    const password_hash = await bcrypt.hash('123456', 10);

    const { error } = await supabase.from('usuarios').insert({
      email,
      password_hash,
      nombre: 'Mateo',
      apellido: 'Vargas',
      rol: 'admin',
      activo: true,
      verificado: true,
      pais: 'Bolivia',
    });

    if (error) {
      throw new BadRequestException(
        `Error creando usuario inicial: ${error.message}`,
      );
    }
  }

  async crearInvitado(): Promise<{ id: number }> {
    const timestamp = Date.now();
    const email = `invitado_${timestamp}@wonder.local`;

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email,
        password_hash: 'guest',
        nombre: 'Invitado',
        rol: 'cliente',
        activo: true,
        verificado: false,
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Error creando usuario invitado: ${error.message}`);
    }

    return { id: data.id };
  }

  async findById(id: number): Promise<{ id: number } | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error buscando usuario: ${error.message}`);
    }

    return data ?? null;
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, nombre, apellido, telefono, direccion, ciudad, departamento, codigo_postal, pais, rol, activo } = createUserDto;

    // Check existing
    const { data: existing } = await supabase.from('usuarios').select('id').eq('email', email).limit(1).maybeSingle();
    if ((existing as any) && (existing as any).id) {
      throw new BadRequestException('Email already registered');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        email,
        password_hash,
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

    if (error) {
      throw new BadRequestException(error.message);
    }

    // don't return password hash
    const { password_hash: _, ...rest } = data as any;
    return rest;
  }

  async findAll(opts?: { page?: number; pageSize?: number; rol?: string; activo?: boolean }) {
    const page = opts?.page ?? 1;
    const pageSize = opts?.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto as any;

    const updatePayload: any = { ...rest };
    if (password) {
      updatePayload.password_hash = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase.from('usuarios').update(updatePayload).eq('id', id).select('*').single();
    if (error) {
      throw new BadRequestException(error.message);
    }

    if (!data) throw new NotFoundException('Usuario no encontrado');

    const { password_hash, ...user } = data as any;
    return user;
  }

  async remove(id: number) {
    const { data, error } = await supabase.from('usuarios').delete().eq('id', id).select('id').single();
    if (error) {
      throw new BadRequestException(error.message);
    }

    return { deleted: true, id: data.id };
  }

  async findByEmail(email: string) {
    const { data, error } = await supabase.from('usuarios').select('*').eq('email', email).maybeSingle();
    if (error) throw new BadRequestException(error.message);
    return data ?? null;
  }
}
