import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { supabase, supabaseAuth } from '../../infrastructure/supabase/supabase.client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async login(email: string, password: string) {
    const { data, error } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!data.user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.debug(`User logged in: ${data.user.id}`);

    // Obtener datos adicionales del perfil
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('nombre, apellido, rol, activo')
      .eq('id', data.user.id)
      .single();

    this.logger.debug(`Profile query for ${data.user.id}: ${JSON.stringify({ data: userProfile, error: profileError })}`);

    if (profileError && profileError.code !== 'PGRST116') {
      this.logger.error(`Profile fetch error: ${profileError.message}`);
    }

    if (userProfile?.activo === false) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const user = {
      id: data.user.id,
      email: data.user.email,
      nombre: userProfile?.nombre || '',
      apellido: userProfile?.apellido || '',
      rol: userProfile?.rol || 'cliente',
    };

    this.logger.debug(`User object: ${JSON.stringify(user)}`);

    return {
      accessToken: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
      user,
    };
  }

  async signup(email: string, password: string) {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAuth.auth.signUp({
      email,
      password,
    });

    if (authError) {
      if (authError.message.includes('already exists')) {
        throw new BadRequestException('Email already registered');
      }
      throw new BadRequestException(authError.message);
    }

    if (!authData.user) {
      throw new BadRequestException('Error creating user');
    }

    // Create user profile in database
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email,
        nombre: '',
        apellido: '',
        rol: 'cliente',
        activo: true,
        verificado: false,
      });

    if (dbError) {
      // Clean up auth user if profile creation fails
      await supabaseAuth.auth.admin.deleteUser(authData.user.id);
      throw new BadRequestException(dbError.message);
    }

    return {
      message: 'User created successfully. Check your email to verify your account.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    };
  }
}
