import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import {
  AgregarItemAlCarritoUseCase,
  ObtenerCarritoDeUsuarioUseCase,
  ObtenerItemDelCarritoUseCase,
  ActualizarCantidadItemUseCase,
  EliminarItemDelCarritoUseCase,
  VaciarCarritoUseCase,
} from '../../domain/use-cases';
import { SupabaseCarritoRepository } from '../../infrastructure/adapters/repositories';
import { CARRITO_REPOSITORY } from '../../domain/ports';

@Module({
  providers: [
    // Use-Cases
    AgregarItemAlCarritoUseCase,
    ObtenerCarritoDeUsuarioUseCase,
    ObtenerItemDelCarritoUseCase,
    ActualizarCantidadItemUseCase,
    EliminarItemDelCarritoUseCase,
    VaciarCarritoUseCase,
    // Adapter
    SupabaseCarritoRepository,
    // Port binding (interface to implementation)
    {
      provide: CARRITO_REPOSITORY,
      useClass: SupabaseCarritoRepository,
    },
    // Service
    CarritoService,
  ],
  controllers: [CarritoController],
  exports: [CarritoService],
})
export class CarritoModule {}
