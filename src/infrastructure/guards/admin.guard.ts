import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    // First validate JWT
    super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.rol !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
