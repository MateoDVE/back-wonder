import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.categoryRepository.create(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);
    return this.categoryRepository.update(id, dto);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.categoryRepository.delete(id);
  }
}