import { Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

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
}
