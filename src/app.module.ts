import { Module } from '@nestjs/common';
import { CategoryController } from './application/controllers/category.controller';
import { ProductController } from './application/controllers/product.controller';
import { CategoryService } from './domain/services/category.service';
import { ProductService } from './domain/services/product.service';
import { CategoryRepository } from './domain/repositories/category.repository';
import { ProductRepository } from './domain/repositories/product.repository';

@Module({
  controllers: [CategoryController, ProductController],
  providers: [CategoryService, ProductService, CategoryRepository, ProductRepository],
})
export class AppModule {}