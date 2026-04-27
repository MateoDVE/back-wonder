import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import type { Categoria } from '../entities/categoria.entity';
import type { CategoriaRepositoryPort } from '../ports/categoria.repository.port';
import { CATEGORIA_REPOSITORY } from '../ports/categoria.repository.port';

export interface CreateCategoriaInput {
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  activa?: boolean;
}

export interface UpdateCategoriaInput {
  nombre?: string;
  descripcion?: string;
  imagen_url?: string;
  activa?: boolean;
}

@Injectable()
export class CrearCategoriaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(input: CreateCategoriaInput): Promise<Categoria> {
    const existingCategoria = await this.categoriaRepository.findByName(input.nombre);

    if (existingCategoria) {
      throw new BadRequestException(
        `La categoría con nombre "${input.nombre}" ya existe`,
      );
    }

    return await this.categoriaRepository.create({
      nombre: input.nombre,
      descripcion: input.descripcion || null,
      imagen_url: input.imagen_url || null,
      activa: input.activa ?? true,
    } as any);
  }
}

@Injectable()
export class ObtenerTodasLasCategoríasUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(activa?: boolean): Promise<Categoria[]> {
    return await this.categoriaRepository.findAll(activa);
  }
}

@Injectable()
export class ObtenerUnaCategoríaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne(id);

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    return categoria;
  }
}

@Injectable()
export class ActualizarCategoríaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(id: number, input: UpdateCategoriaInput): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne(id);

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    if (input.nombre) {
      const existingCategoria = await this.categoriaRepository.findByName(input.nombre);

      if (existingCategoria && existingCategoria.id !== id) {
        throw new BadRequestException(
          `La categoría con nombre "${input.nombre}" ya existe`,
        );
      }
    }

    return await this.categoriaRepository.update(id, input);
  }
}

@Injectable()
export class EliminarCategoríaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(id: number): Promise<void> {
    const categoria = await this.categoriaRepository.findOne(id);

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    await this.categoriaRepository.delete(id);
  }
}

@Injectable()
export class ToggleCategoríaUseCase {
  constructor(
    @Inject(CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: CategoriaRepositoryPort,
  ) {}

  async execute(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne(id);

    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${id} no existe`);
    }

    return await this.categoriaRepository.toggleActiva(id);
  }
}
