import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CarritoModule } from './modules/carrito/carrito.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CloudinaryModule,
    UploadsModule,
    CategoriasModule,
    ProductosModule,
    CarritoModule,
    PedidosModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}