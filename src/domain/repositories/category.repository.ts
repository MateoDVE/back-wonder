import { Injectable } from '@nestjs/common';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../entities/category.entity';
import { supabase } from '../../infrastructure/supabase/supabase.client';

@Injectable()
export class CategoryRepository {
  private table = 'categories';

  async findAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('order_number', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const { data, error } = await supabase
      .from(this.table)
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  }
}