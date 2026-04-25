import { Injectable } from '@nestjs/common';
import { Product, CreateProductDto, UpdateProductDto } from '../entities/product.entity';
import { supabase } from '../../infrastructure/supabase/supabase.client';

@Injectable()
export class ProductRepository {
  private table = 'products';

  async findAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { data, error } = await supabase
      .from(this.table)
      .insert(dto)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
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