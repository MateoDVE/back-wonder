import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import type { CarritoItem } from '../entities/carrito.entity';
import type { CarritoRepositoryPort } from '../ports/carrito.repository.port';
import { CARRITO_REPOSITORY } from '../ports/carrito.repository.port';

export interface AgregarItemInput {
  usuario_id: string;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
}

export interface ActualizarCantidadInput {
  cantidad: number;
}

@Injectable()
export class AgregarItemAlCarritoUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(input: AgregarItemInput): Promise<CarritoItem> {
    if (input.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const itemExistente = await this.carritoRepository.findOneByUsuarioYProducto(
      input.usuario_id,
      input.producto_id,
    );

    if (itemExistente) {
      const nuevaCantidad = itemExistente.cantidad + input.cantidad;
      return await this.carritoRepository.actualizarCantidad(itemExistente.id, nuevaCantidad);
    }

    return await this.carritoRepository.agregarItem({
      usuario_id: input.usuario_id,
      producto_id: input.producto_id,
      cantidad: input.cantidad,
      precio_unitario: input.precio_unitario,
    });
  }
}

@Injectable()
export class ObtenerCarritoDeUsuarioUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(usuarioId: string): Promise<CarritoItem[]> {
    return await this.carritoRepository.findByUsuario(usuarioId);
  }
}

@Injectable()
export class ObtenerItemDelCarritoUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(id: number): Promise<CarritoItem> {
    const item = await this.carritoRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`El item con ID ${id} no existe en el carrito`);
    }

    return item;
  }
}

@Injectable()
export class ActualizarCantidadItemUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(id: number, cantidad: number): Promise<CarritoItem> {
    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor a 0');
    }

    const item = await this.carritoRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`El item con ID ${id} no existe en el carrito`);
    }

    return await this.carritoRepository.actualizarCantidad(id, cantidad);
  }
}

@Injectable()
export class EliminarItemDelCarritoUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const item = await this.carritoRepository.findOne(id);

    if (!item) {
      throw new NotFoundException(`El item con ID ${id} no existe en el carrito`);
    }

    await this.carritoRepository.eliminarItem(id);
  }
}

@Injectable()
export class VaciarCarritoUseCase {
  constructor(
    @Inject(CARRITO_REPOSITORY)
    private readonly carritoRepository: CarritoRepositoryPort,
  ) {}

  async execute(usuarioId: string): Promise<void> {
    await this.carritoRepository.vaciarCarrito(usuarioId);
  }
}
