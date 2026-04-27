import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from '../../application/dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(
    @Query('categoriaId', new ParseIntPipe({ optional: true })) categoriaId?: number,
    @Query('activo') activo?: string,
    @Query('destacado') destacado?: string,
    @Query('search') search?: string,
  ) {
    const activoBool = activo ? activo === 'true' : undefined;
    const destacadoBool = destacado ? destacado === 'true' : undefined;

    return this.productosService.findAll({
      categoriaId,
      activo: activoBool,
      destacado: destacadoBool,
      search,
    });
  }

  @Get('destacados/:limit')
  findDestacados(@Param('limit', ParseIntPipe) limit: number = 6) {
    return this.productosService.findDestacados(limit);
  }

  @Get('categoria/:categoriaId')
  findByCategoria(
    @Param('categoriaId', ParseIntPipe) categoriaId: number,
  ) {
    return this.productosService.findByCategoria(categoriaId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Put(':id/stock')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('cantidad', ParseIntPipe) cantidad: number,
  ) {
    return this.productosService.updateStock(id, cantidad);
  }

  @Put(':id/toggle-destacado')
  toggleDestacado(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.toggleDestacado(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
