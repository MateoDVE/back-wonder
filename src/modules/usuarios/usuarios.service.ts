import { Injectable } from '@nestjs/common';
import { supabase } from '../../infrastructure/supabase/supabase.client';

@Injectable()
export class UsuariosService {
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
}
