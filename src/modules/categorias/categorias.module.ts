import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import {
  CrearCategoriaUseCase,
  ObtenerTodasLasCategoríasUseCase,
  ObtenerUnaCategoríaUseCase,
  ActualizarCategoríaUseCase,
  EliminarCategoríaUseCase,
  ToggleCategoríaUseCase,
} from '../../domain/use-cases';
import { SupabaseCategoriaRepository } from '../../infrastructure/adapters/repositories';
import { CATEGORIA_REPOSITORY } from '../../domain/ports';

@Module({
  providers: [
    // Use-Cases
    CrearCategoriaUseCase,
    ObtenerTodasLasCategoríasUseCase,
    ObtenerUnaCategoríaUseCase,
    ActualizarCategoríaUseCase,
    EliminarCategoríaUseCase,
    ToggleCategoríaUseCase,
    // Adapter
    SupabaseCategoriaRepository,
    // Port binding (interface to implementation)
    {
      provide: CATEGORIA_REPOSITORY,
      useClass: SupabaseCategoriaRepository,
    },
    // Service
    CategoriasService,
  ],
  controllers: [CategoriasController],
  exports: [CategoriasService],
})
export class CategoriasModule {}
