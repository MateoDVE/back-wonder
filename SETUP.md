# Backend TiendaWonder - API REST

## 🚀 Descripción

Backend NestJS para un sistema e-commerce de licores y bebidas. Implementa CRUDs completos para Categorías y Productos para mostrar el catálogo.

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- PostgreSQL (o Supabase)

## 🔧 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno (.env)

Ya está configurado con Supabase. Si deseas usar otra BD PostgreSQL, actualiza:

```env
# Database Configuration
DB_HOST=tu_host
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=tienda_wonder
DB_SSL=true
```

### 3. Ejecutar migraciones SQL

Ejecuta el archivo SQL que compartiste en tu base de datos PostgreSQL/Supabase para crear las tablas.

## 🏃‍♂️ Ejecutar el proyecto

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Estructura del Proyecto

```
src/
├── domain/
│   └── entities/           # Entidades TypeORM
│       ├── categoria.entity.ts
│       └── producto.entity.ts
├── application/
│   └── dto/               # Data Transfer Objects
│       ├── categoria.dto.ts
│       └── producto.dto.ts
├── infrastructure/
│   └── database/          # Configuración de BD
│       └── data-source.ts
├── modules/
│   ├── categorias/        # Módulo de categorías
│   │   ├── categorias.controller.ts
│   │   ├── categorias.service.ts
│   │   └── categorias.module.ts
│   └── productos/         # Módulo de productos
│       ├── productos.controller.ts
│       ├── productos.service.ts
│       └── productos.module.ts
├── app.module.ts          # Módulo principal
└── main.ts               # Punto de entrada
```

## 🔌 Endpoints Disponibles

### Categorías
- `GET /categorias` - Listar todas
- `GET /categorias/:id` - Obtener una
- `POST /categorias` - Crear
- `PUT /categorias/:id` - Actualizar
- `PUT /categorias/:id/toggle` - Togglear estado
- `DELETE /categorias/:id` - Eliminar

### Productos
- `GET /productos` - Listar todos (con filtros)
- `GET /productos/:id` - Obtener uno
- `GET /productos/categoria/:categoriaId` - Por categoría
- `GET /productos/destacados/:limit` - Destacados
- `POST /productos` - Crear
- `PUT /productos/:id` - Actualizar
- `PUT /productos/:id/stock` - Actualizar stock
- `PUT /productos/:id/toggle-destacado` - Togglear destacado
- `DELETE /productos/:id` - Eliminar

**Ver documentación completa en [API_ENDPOINTS.md](./API_ENDPOINTS.md)**

## 🧪 Tests

```bash
# Unit tests
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Ejemplos de Uso

### Crear una categoría
```bash
curl -X POST http://localhost:3000/categorias \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Vinos",
    "descripcion": "Vinos nacionales e internacionales",
    "imagen_url": "https://...",
    "activa": true
  }'
```

### Crear un producto
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Vino Tinto Reserva",
    "descripcion": "Vino de alta calidad",
    "categoria_id": 1,
    "precio_venta": 65.00,
    "stock": 50,
    "marca": "Concha y Toro",
    "volumen_ml": 750,
    "tipo_bebida": "vino",
    "pais_origen": "Chile",
    "activo": true,
    "destacado": true
  }'
```

### Obtener productos destacados
```bash
curl http://localhost:3000/productos/destacados/6
```

### Buscar productos
```bash
curl "http://localhost:3000/productos?search=vino&categoriaId=1&activo=true"
```

## 🛡️ Validación

Todos los DTOs incluyen validación usando `class-validator`:
- Validación de tipos
- URLs válidas
- Rangos de valores
- Campos requeridos/opcionales

## 📦 Dependencias Principales

- **@nestjs/core** - Framework NestJS
- **@nestjs/typeorm** - ORM
- **typeorm** - Object Relational Mapper
- **pg** - Driver PostgreSQL
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de DTOs

## 🚀 Próximos Pasos

Para completar la plataforma, considera añadir:

1. **Módulo de Usuarios** - Autenticación y autorización
2. **Módulo de Carrito** - Gestión del carrito de compras
3. **Módulo de Órdenes** - Gestión de pedidos
4. **Módulo de Pagos** - Integración de pasarelas
5. **Módulo de Reseñas** - Opiniones de clientes
6. **Autenticación JWT** - Seguridad
7. **Paginación** - Para listar grandes volúmenes
8. **Caching** - Redis para mejor rendimiento

## 📧 Soporte

Para dudas o problemas, contacta al equipo de desarrollo.

---

**Última actualización:** 17/02/2025
