import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import type { Producto } from '../entities/producto.entity';
import type { ProductoRepositoryPort } from '../ports/producto.repository.port';
import { PRODUCTO_REPOSITORY } from '../ports/producto.repository.port';

export interface CreateProductoInput {
  nombre: string;
  descripcion?: string;
  categoria_id: number;
  precio_costo?: number;
  precio_venta: number;
  stock?: number;
  stock_minimo?: number;
  marca?: string;
  gradacion_alcoholica?: number;
  volumen_ml?: number;
  tipo_bebida?: string;
  pais_origen?: string;
  imagen_url?: string;
  imagenes_adicionales?: string;
  activo?: boolean;
  destacado?: boolean;
}

export interface UpdateProductoInput {
  nombre?: string;
  descripcion?: string;
  categoria_id?: number;
  precio_costo?: number;
  precio_venta?: number;
  stock?: number;
  stock_minimo?: number;
  marca?: string;
  gradacion_alcoholica?: number;
  volumen_ml?: number;
  tipo_bebida?: string;
  pais_origen?: string;
  imagen_url?: string;
  imagenes_adicionales?: string;
  activo?: boolean;
  destacado?: boolean;
}

export interface ProductoFilterInput {
  categoriaId?: number;
  activo?: boolean;
  destacado?: boolean;
  search?: string;
}

@Injectable()
export class CrearProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(input: CreateProductoInput): Promise<Producto> {
    return await this.productoRepository.create({
      nombre: input.nombre,
      descripcion: input.descripcion || null,
      categoria_id: input.categoria_id,
      precio_costo: input.precio_costo || null,
      precio_venta: input.precio_venta,
      stock: input.stock ?? 0,
      stock_minimo: input.stock_minimo ?? 5,
      marca: input.marca || null,
      gradacion_alcoholica: input.gradacion_alcoholica || null,
      volumen_ml: input.volumen_ml || null,
      tipo_bebida: input.tipo_bebida || null,
      imagen_url: input.imagen_url || null,
      imagenes_adicionales: input.imagenes_adicionales || null,
      activo: input.activo ?? true,
      destacado: input.destacado ?? false,
    } as any);
  }
}

@Injectable()
export class ObtenerTodosLosProductosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(filters?: ProductoFilterInput): Promise<Producto[]> {
    return await this.productoRepository.findAll(filters);
  }
}

@Injectable()
export class ObtenerUnProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne(id);

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    return producto;
  }
}

@Injectable()
export class ObtenerProductosPorCategoríaUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(categoriaId: number): Promise<Producto[]> {
    return await this.productoRepository.findByCategoria(categoriaId);
  }
}

@Injectable()
export class ObtenerProductosDestacadosUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(limit: number = 6): Promise<Producto[]> {
    return await this.productoRepository.findDestacados(limit);
  }
}

@Injectable()
export class ActualizarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(id: number, input: UpdateProductoInput): Promise<Producto> {
    const producto = await this.productoRepository.findOne(id);

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    return await this.productoRepository.update(id, input);
  }
}

@Injectable()
export class EliminarProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const producto = await this.productoRepository.findOne(id);

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    await this.productoRepository.delete(id);
  }
}

@Injectable()
export class ActualizarStockProductoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(id: number, cantidad: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne(id);

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    if (producto.stock + cantidad < 0) {
      throw new BadRequestException('Stock insuficiente');
    }

    return await this.productoRepository.updateStock(id, cantidad);
  }
}

@Injectable()
export class ToggleProductoDestacadoUseCase {
  constructor(
    @Inject(PRODUCTO_REPOSITORY)
    private readonly productoRepository: ProductoRepositoryPort,
  ) {}

  async execute(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne(id);

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    return await this.productoRepository.toggleDestacado(id);
  }
}