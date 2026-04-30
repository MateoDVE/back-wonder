import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.client';
import { CarritoItem } from '../../../domain/entities/carrito.entity';
import { CarritoRepositoryPort } from '../../../domain/ports/carrito.repository.port';

@Injectable()
export class SupabaseCarritoRepository implements CarritoRepositoryPort {
  async agregarItem(
    item: Omit<CarritoItem, 'id' | 'created_at' | 'updated_at' | 'producto'>,
  ): Promise<CarritoItem> {
    const { data, error } = await supabase
      .from('carrito')
      .insert([item])
      .select(`*, producto:productos(id, nombre, imagen_url, precio_venta)`)
      .single();

    if (error) {
      throw new Error(`Error agregando item al carrito: ${error.message}`);
    }

    return data;
  }

  async findByUsuario(usuarioId: number): Promise<CarritoItem[]> {
    const { data, error } = await supabase
      .from('carrito')
      .select(`*, producto:productos(id, nombre, imagen_url, precio_venta, stock, activo)`)
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error obteniendo carrito: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: number): Promise<CarritoItem | null> {
    const { data, error } = await supabase
      .from('carrito')
      .select(`*, producto:productos(id, nombre, imagen_url, precio_venta, stock, activo)`)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo item del carrito: ${error.message}`);
    }

    return data || null;
  }

  async findOneByUsuarioYProducto(
    usuarioId: number,
    productoId: number,
  ): Promise<CarritoItem | null> {
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
  }

  async actualizarCantidad(id: number, cantidad: number): Promise<CarritoItem> {
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
  }

  async eliminarItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando item del carrito: ${error.message}`);
    }
  }

  async vaciarCarrito(usuarioId: number): Promise<void> {
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('usuario_id', usuarioId);

    if (error) {
      throw new Error(`Error vaciando carrito: ${error.message}`);
    }
  }
}
