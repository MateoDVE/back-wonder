import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
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
import { SupabaseProductoRepository } from '../../infrastructure/adapters/repositories';
import { PRODUCTO_REPOSITORY } from '../../domain/ports';

@Module({
  providers: [
    // Use-Cases
    CrearProductoUseCase,
    ObtenerTodosLosProductosUseCase,
    ObtenerUnProductoUseCase,
    ObtenerProductosPorCategoríaUseCase,
    ObtenerProductosDestacadosUseCase,
    ActualizarProductoUseCase,
    EliminarProductoUseCase,
    ActualizarStockProductoUseCase,
    ToggleProductoDestacadoUseCase,
    // Adapter
    SupabaseProductoRepository,
    // Port binding (interface to implementation)
    {
      provide: PRODUCTO_REPOSITORY,
      useClass: SupabaseProductoRepository,
    },
    // Service
    ProductosService,
  ],
  controllers: [ProductosController],
  exports: [ProductosService],
})
export class ProductosModule {}
