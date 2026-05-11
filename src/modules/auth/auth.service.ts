import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(email: string, password: string) {
    const user = await this.usuariosService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.activo === false) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const secret = process.env.JWT_SECRET || 'wonder-dev-secret-change-me';
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        rol: user.rol,
      },
      secret,
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        rol: user.rol,
      },
    };
  }
}
