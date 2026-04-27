import { Injectable } from '@nestjs/common';
import { Producto } from '../../domain/entities/producto.entity';
import { CreateProductoDto, UpdateProductoDto } from '../../application/dto';
import {
  CrearProductoUseCase,
  ObtenerTodosLosProductosUseCase,
  ObtenerUnProductoUseCase,
  ObtenerProductosPorCategoríaUseCase,
  ObtenerProductosDestacadosUseCase,
  ActualizarProductoUseCase,
  EliminarProductoUseCase,
  ActualizarStockProductoUseCase,
  ToggleProductoDestacadoUseCase,
} from '../../domain/use-cases';

@Injectable()
export class ProductosService {
  constructor(
    private readonly crearProductoUseCase: CrearProductoUseCase,
    private readonly obtenerTodosLosProductosUseCase: ObtenerTodosLosProductosUseCase,
    private readonly obtenerUnProductoUseCase: ObtenerUnProductoUseCase,
    private readonly obtenerProductosPorCategoríaUseCase: ObtenerProductosPorCategoríaUseCase,
    private readonly obtenerProductosDestacadosUseCase: ObtenerProductosDestacadosUseCase,
    private readonly actualizarProductoUseCase: ActualizarProductoUseCase,
    private readonly eliminarProductoUseCase: EliminarProductoUseCase,
    private readonly actualizarStockProductoUseCase: ActualizarStockProductoUseCase,
    private readonly toggleProductoDestacadoUseCase: ToggleProductoDestacadoUseCase,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    return await this.crearProductoUseCase.execute(createProductoDto);
  }

  async findAll(
    filters?: {
      categoriaId?: number;
      activo?: boolean;
      destacado?: boolean;
      search?: string;
    },
  ): Promise<Producto[]> {
    return await this.obtenerTodosLosProductosUseCase.execute(filters);
  }

  async findOne(id: number): Promise<Producto> {
    return await this.obtenerUnProductoUseCase.execute(id);
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return await this.actualizarProductoUseCase.execute(id, updateProductoDto);
  }

  async remove(id: number): Promise<void> {
    return await this.eliminarProductoUseCase.execute(id);
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return await this.obtenerProductosPorCategoríaUseCase.execute(categoriaId);
  }

  async findDestacados(limit: number = 6): Promise<Producto[]> {
    return await this.obtenerProductosDestacadosUseCase.execute(limit);
  }

  async updateStock(id: number, cantidad: number): Promise<Producto> {
    return await this.actualizarStockProductoUseCase.execute(id, cantidad);
  }

  async toggleDestacado(id: number): Promise<Producto> {
    return await this.toggleProductoDestacadoUseCase.execute(id);
  }
}
