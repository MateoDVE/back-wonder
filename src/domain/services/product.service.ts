import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll() {
    return this.productRepository.findAll();
  }

  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.productRepository.create(dto);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    return this.productRepository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.productRepository.delete(id);
  }
}