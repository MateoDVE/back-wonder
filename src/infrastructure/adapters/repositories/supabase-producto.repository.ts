import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.client';
import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoRepositoryPort } from '../../../domain/ports/producto.repository.port';

@Injectable()
export class SupabaseProductoRepository implements ProductoRepositoryPort {
  async create(
    producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Producto> {
    const { data, error } = await supabase
      .from('productos')
      .insert([producto])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creando producto: ${error.message}`);
    }

    return data;
  }

  async findAll(filters?: {
    categoriaId?: number;
    activo?: boolean;
    destacado?: boolean;
    search?: string;
  }): Promise<Producto[]> {
    let query = supabase.from('productos').select('*');

    if (filters?.categoriaId) {
      query = query.eq('categoria_id', filters.categoriaId);
    }

    if (filters?.activo !== undefined) {
      query = query.eq('activo', filters.activo);
    }

    if (filters?.destacado !== undefined) {
      query = query.eq('destacado', filters.destacado);
    }

    if (filters?.search) {
      query = query.or(
        `nombre.ilike.%${filters.search}%,descripcion.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query.order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: number): Promise<Producto | null> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }

    return data || null;
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria_id', categoriaId)
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Error obteniendo productos por categoría: ${error.message}`);
    }

    return data || [];
  }

  async findDestacados(limit: number): Promise<Producto[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('destacado', true)
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Error obteniendo productos destacados: ${error.message}`);
    }

    return data || [];
  }

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    const { data, error } = await supabase
      .from('productos')
      .update(producto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando producto: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }

  async updateStock(id: number, cantidad: number): Promise<Producto> {
    const current = await this.findOne(id);
    if (!current) {
      throw new Error('Producto no encontrado');
    }

    const { data, error } = await supabase
      .from('productos')
      .update({ stock: current.stock + cantidad })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando stock: ${error.message}`);
    }

    return data;
  }

  async toggleDestacado(id: number): Promise<Producto> {
    const current = await this.findOne(id);
    if (!current) {
      throw new Error('Producto no encontrado');
    }

    const { data, error } = await supabase
      .from('productos')
      .update({ destacado: !current.destacado })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando estado destacado: ${error.message}`);
    }

    return data;
  }
}
