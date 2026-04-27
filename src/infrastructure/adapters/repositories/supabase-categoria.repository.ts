import { Injectable } from '@nestjs/common';
import { supabase } from '../../supabase/supabase.client';
import { Categoria } from '../../../domain/entities/categoria.entity';
import { CategoriaRepositoryPort } from '../../../domain/ports/categoria.repository.port';

@Injectable()
export class SupabaseCategoriaRepository implements CategoriaRepositoryPort {
  async create(
    categoria: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .insert([categoria])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creando categoría: ${error.message}`);
    }

    return data;
  }

  async findAll(activa?: boolean): Promise<Categoria[]> {
    let query = supabase.from('categorias').select('*');

    if (activa !== undefined) {
      query = query.eq('activa', activa);
    }

    const { data, error } = await query.order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Error obteniendo categorías: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: number): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error obteniendo categoría: ${error.message}`);
    }

    return data || null;
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('nombre', nombre)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error buscando categoría: ${error.message}`);
    }

    return data || null;
  }

  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .update(categoria)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando categoría: ${error.message}`);
    }

    return data;
  }

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando categoría: ${error.message}`);
    }
  }

  async toggleActiva(id: number): Promise<Categoria> {
    // Primero obtener la categoría actual
    const current = await this.findOne(id);
    if (!current) {
      throw new Error('Categoría no encontrada');
    }

    // Actualizar con el valor opuesto
    const { data, error } = await supabase
      .from('categorias')
      .update({ activa: !current.activa })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando estado de categoría: ${error.message}`);
    }

    return data;
  }
}
