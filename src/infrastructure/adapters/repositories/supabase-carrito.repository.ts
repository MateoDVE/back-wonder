import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.client';
import { CarritoItem } from '../../../domain/entities/carrito.entity';
import { CarritoRepositoryPort } from '../../../domain/ports/carrito.repository.port';

function isSupabaseUnavailable(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message);
}

@Injectable()
export class SupabaseCarritoRepository implements CarritoRepositoryPort {
  async agregarItem(
    item: Omit<CarritoItem, 'id' | 'created_at' | 'updated_at' | 'producto'>,
  ): Promise<CarritoItem> {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .insert([item])
        .select(`*, producto:productos(id, nombre, imagen_url, precio_venta)`)
        .single();

      if (error) {
        throw new Error(`Error agregando item al carrito: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return {
          id: Date.now(),
          usuario_id: item.usuario_id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          created_at: new Date(),
          updated_at: new Date(),
          producto: null,
        };
      }
      throw error;
    }
  }

  async findByUsuario(usuarioId: string): Promise<CarritoItem[]> {
    if (!usuarioId || usuarioId === 'undefined' || usuarioId === 'null') {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('carrito')
        .select(`*, producto:productos(id, nombre, imagen_url, precio_venta, stock, activo)`)
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Error obteniendo carrito: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return [];
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<CarritoItem | null> {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .select(`*, producto:productos(id, nombre, imagen_url, precio_venta, stock, activo)`)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Error obteniendo item del carrito: ${error.message}`);
      }

      return data || null;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return null;
      }
      throw error;
    }
  }

  async findOneByUsuarioYProducto(
    usuarioId: string,
    productoId: number,
  ): Promise<CarritoItem | null> {
    if (!usuarioId || usuarioId === 'undefined' || usuarioId === 'null') {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('carrito')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('producto_id', productoId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Error buscando item en carrito: ${error.message}`);
      }

      return data || null;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return null;
      }
      throw error;
    }
  }

  async actualizarCantidad(id: number, cantidad: number): Promise<CarritoItem> {
    try {
      const { data, error } = await supabase
        .from('carrito')
        .update({ cantidad, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`*, producto:productos(id, nombre, imagen_url, precio_venta, stock, activo)`)
        .single();

      if (error) {
        throw new Error(`Error actualizando cantidad: ${error.message}`);
      }

      return data;
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return {
          id,
          usuario_id: '',
          producto_id: 0,
          cantidad,
          precio_unitario: 0,
          created_at: new Date(),
          updated_at: new Date(),
          producto: null,
        };
      }
      throw error;
    }
  }

  async eliminarItem(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error eliminando item del carrito: ${error.message}`);
      }
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return;
      }
      throw error;
    }
  }

  async vaciarCarrito(usuarioId: string): Promise<void> {
    if (!usuarioId || usuarioId === 'undefined' || usuarioId === 'null') {
      return;
    }

    try {
      const { error } = await supabase
        .from('carrito')
        .delete()
        .eq('usuario_id', usuarioId);

      if (error) {
        throw new Error(`Error vaciando carrito: ${error.message}`);
      }
    } catch (error) {
      if (isSupabaseUnavailable(error)) {
        return;
      }
      throw error;
    }
  }
}
