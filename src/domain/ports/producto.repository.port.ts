import type { Producto } from '../entities/producto.entity';

export const PRODUCTO_REPOSITORY = Symbol('PRODUCTO_REPOSITORY');

export interface ProductoRepositoryPort {
  create(producto: Omit<Producto, 'id' | 'created_at' | 'updated_at' | 'categoria'>): Promise<Producto>;
  findAll(filters?: {
    categoriaId?: number;
    activo?: boolean;
    destacado?: boolean;
    search?: string;
  }): Promise<Producto[]>;
  findOne(id: number): Promise<Producto | null>;
  findByCategoria(categoriaId: number): Promise<Producto[]>;
  findDestacados(limit: number): Promise<Producto[]>;
  update(id: number, producto: Partial<Producto>): Promise<Producto>;
  delete(id: number): Promise<void>;
  updateStock(id: number, cantidad: number): Promise<Producto>;
  toggleDestacado(id: number): Promise<Producto>;
}
