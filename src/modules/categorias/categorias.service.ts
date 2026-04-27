import { Injectable } from '@nestjs/common';
import { Categoria } from '../../domain/entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from '../../application/dto';
import {
  CrearCategoriaUseCase,
  ObtenerTodasLasCategoríasUseCase,
  ObtenerUnaCategoríaUseCase,
  ActualizarCategoríaUseCase,
  EliminarCategoríaUseCase,
  ToggleCategoríaUseCase,
} from '../../domain/use-cases';

@Injectable()
export class CategoriasService {
  constructor(
    private readonly crearCategoriaUseCase: CrearCategoriaUseCase,
    private readonly obtenerTodasLasCategoríasUseCase: ObtenerTodasLasCategoríasUseCase,
    private readonly obtenerUnaCategoríaUseCase: ObtenerUnaCategoríaUseCase,
    private readonly actualizarCategoríaUseCase: ActualizarCategoríaUseCase,
    private readonly eliminarCategoríaUseCase: EliminarCategoríaUseCase,
    private readonly toggleCategoríaUseCase: ToggleCategoríaUseCase,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return await this.crearCategoriaUseCase.execute(createCategoriaDto);
  }

  async findAll(activa?: boolean): Promise<Categoria[]> {
    return await this.obtenerTodasLasCategoríasUseCase.execute(activa);
  }

  async findOne(id: number): Promise<Categoria> {
    return await this.obtenerUnaCategoríaUseCase.execute(id);
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return await this.actualizarCategoríaUseCase.execute(id, updateCategoriaDto);
  }

  async remove(id: number): Promise<void> {
    return await this.eliminarCategoríaUseCase.execute(id);
  }

  async toggleActiva(id: number): Promise<Categoria> {
    return await this.toggleCategoríaUseCase.execute(id);
  }
}
