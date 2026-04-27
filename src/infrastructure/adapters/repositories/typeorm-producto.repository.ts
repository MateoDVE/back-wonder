import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../../domain/entities/producto.entity';
import { ProductoRepositoryPort } from '../../../domain/ports/producto.repository.port';

@Injectable()
export class TypeOrmProductoRepository implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(Producto)
    private readonly repository: Repository<Producto>,
  ) {}

  async create(
    producto: Omit<Producto, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Producto> {
    const newProducto = this.repository.create(producto);
    return await this.repository.save(newProducto);
  }

  async findAll(filters?: {
    categoriaId?: number;
    activo?: boolean;
    destacado?: boolean;
    search?: string;
  }): Promise<Producto[]> {
    const query = this.repository
      .createQueryBuilder('producto')
      .leftJoinAndSelect('producto.categoria', 'categoria');

    if (filters?.categoriaId) {
      query.andWhere('producto.categoria_id = :categoriaId', {
        categoriaId: filters.categoriaId,
      });
    }

    if (filters?.activo !== undefined) {
      query.andWhere('producto.activo = :activo', { activo: filters.activo });
    }

    if (filters?.destacado !== undefined) {
      query.andWhere('producto.destacado = :destacado', {
        destacado: filters.destacado,
      });
    }

    if (filters?.search) {
      query.andWhere(
        '(producto.nombre ILIKE :search OR producto.descripcion ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return await query.orderBy('producto.nombre', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Producto | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return await this.repository.find({
      where: { categoria_id: categoriaId, activo: true },
      relations: ['categoria'],
      order: { nombre: 'ASC' },
    });
  }

  async findDestacados(limit: number): Promise<Producto[]> {
    return await this.repository.find({
      where: { destacado: true, activo: true },
      relations: ['categoria'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async update(id: number, producto: Partial<Producto>): Promise<Producto> {
    await this.repository.update(id, producto);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Producto no encontrado');
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async updateStock(id: number, cantidad: number): Promise<Producto> {
    const producto = await this.repository.findOne({ where: { id } });
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    producto.stock += cantidad;
    return await this.repository.save(producto);
  }

  async toggleDestacado(id: number): Promise<Producto> {
    const producto = await this.repository.findOne({ where: { id } });
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    producto.destacado = !producto.destacado;
    return await this.repository.save(producto);
  }
}
