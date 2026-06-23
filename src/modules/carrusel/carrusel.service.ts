import { Injectable, NotFoundException } from '@nestjs/common';
import { supabase } from '../../infrastructure/supabase/supabase.client';
import { CreateCarruselImagenDto, UpdateCarruselImagenDto } from './carrusel.dto';
import { CarruselImagen } from './carrusel.entity';

@Injectable()
export class CarruselService {
  async create(dto: CreateCarruselImagenDto): Promise<CarruselImagen> {
    const { data, error } = await supabase
      .from('carrusel_imagenes')
      .insert([dto])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear imagen del carrusel: ${error.message}`);
    }

    return data;
  }

  async findAll(onlyActive: boolean = false): Promise<CarruselImagen[]> {
    let query = supabase.from('carrusel_imagenes').select('*');
    
    if (onlyActive) {
      query = query.eq('activo', true);
    }
    
    const { data, error } = await query.order('orden', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener imagenes del carrusel: ${error.message}`);
    }

    return data || [];
  }

  async findOne(id: number): Promise<CarruselImagen> {
    const { data, error } = await supabase
      .from('carrusel_imagenes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Imagen de carrusel con ID ${id} no encontrada`);
    }

    return data;
  }

  async update(id: number, dto: UpdateCarruselImagenDto): Promise<CarruselImagen> {
    const { data, error } = await supabase
      .from('carrusel_imagenes')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar imagen del carrusel: ${error.message}`);
    }

    return data;
  }

  async remove(id: number): Promise<void> {
    const { error } = await supabase
      .from('carrusel_imagenes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar imagen del carrusel: ${error.message}`);
    }
  }
}
