import type { Categoria } from '../entities/categoria.entity';

export const CATEGORIA_REPOSITORY = Symbol('CATEGORIA_REPOSITORY');

export interface CategoriaRepositoryPort {
  create(categoria: Omit<Categoria, 'id' | 'created_at' | 'updated_at' | 'productos'>): Promise<Categoria>;
  findAll(activa?: boolean): Promise<Categoria[]>;
  findOne(id: number): Promise<Categoria | null>;
  findByName(nombre: string): Promise<Categoria | null>;
  update(id: number, categoria: Partial<Categoria>): Promise<Categoria>;
  delete(id: number): Promise<void>;
  toggleActiva(id: number): Promise<Categoria>;
}
