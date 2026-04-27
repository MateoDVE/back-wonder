import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../../../domain/entities/categoria.entity';
import { CategoriaRepositoryPort } from '../../../domain/ports/categoria.repository.port';

@Injectable()
export class TypeOrmCategoriaRepository implements CategoriaRepositoryPort {
  constructor(
    @InjectRepository(Categoria)
    private readonly repository: Repository<Categoria>,
  ) {}

  async create(
    categoria: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Categoria> {
    const newCategoria = this.repository.create(categoria);
    return await this.repository.save(newCategoria);
  }

  async findAll(activa?: boolean): Promise<Categoria[]> {
    const query = this.repository.createQueryBuilder('categoria');

    if (activa !== undefined) {
      query.where('categoria.activa = :activa', { activa });
    }

    return await query.orderBy('categoria.nombre', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Categoria | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['productos'],
    });
  }

  async findByName(nombre: string): Promise<Categoria | null> {
    return await this.repository.findOne({
      where: { nombre },
    });
  }

  async update(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    await this.repository.update(id, categoria);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Categoría no encontrada');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async toggleActiva(id: number): Promise<Categoria> {
    const categoria = await this.repository.findOne({ where: { id } });
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    categoria.activa = !categoria.activa;
    return await this.repository.save(categoria);
  }
}
