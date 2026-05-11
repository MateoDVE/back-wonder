import { Controller, Get, Param, Post, ParseIntPipe, Body, Query, Put, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

class ListUsersQuery {
  page?: number;
  pageSize?: number;
  rol?: string;
  activo?: boolean;
}

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('invitado')
  crearInvitado() {
    return this.usuariosService.crearInvitado();
  }

  @Get(':id/existe')
  async existe(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.usuariosService.findById(id);
    return { existe: !!usuario };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usuariosService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: ListUsersQuery) {
    const page = query.page ? Number(query.page) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 20;
    const activo = typeof query.activo === 'boolean' ? query.activo : undefined;
    return this.usuariosService.findAll({ page, pageSize, rol: query.rol, activo });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const u = await this.usuariosService.findById(id);
    if (!u) return { error: 'Not found' };
    return u;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usuariosService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
