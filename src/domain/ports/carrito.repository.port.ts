import type { CarritoItem } from '../entities/carrito.entity';

export const CARRITO_REPOSITORY = Symbol('CARRITO_REPOSITORY');

export interface CarritoRepositoryPort {
  agregarItem(item: Omit<CarritoItem, 'id' | 'created_at' | 'updated_at' | 'producto'>): Promise<CarritoItem>;
  findByUsuario(usuarioId: string): Promise<CarritoItem[]>;
  findOne(id: number): Promise<CarritoItem | null>;
  findOneByUsuarioYProducto(usuarioId: string, productoId: number): Promise<CarritoItem | null>;
  actualizarCantidad(id: number, cantidad: number): Promise<CarritoItem>;
  eliminarItem(id: number): Promise<void>;
  vaciarCarrito(usuarioId: string): Promise<void>;
}
