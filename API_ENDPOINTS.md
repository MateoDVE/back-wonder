# API Endpoints - Catálogo de Productos

## Categorías

### Obtener todas las categorías
```
GET /categorias
Query params:
  - activa: boolean (opcional) - Filtrar por categorías activas
```

### Obtener una categoría específica
```
GET /categorias/:id
```

### Crear una nueva categoría
```
POST /categorias
Body:
{
  "nombre": "Vinos",
  "descripcion": "Vinos nacionales e internacionales",
  "imagen_url": "https://...",
  "activa": true (opcional)
}
```

### Actualizar una categoría
```
PUT /categorias/:id
Body:
{
  "nombre": "Vinos Premium",
  "descripcion": "...",
  "imagen_url": "...",
  "activa": true
}
```

### Togglear estado de una categoría
```
PUT /categorias/:id/toggle
```

### Eliminar una categoría
```
DELETE /categorias/:id
```

---

## Productos

### Obtener todos los productos
```
GET /productos
Query params:
  - categoriaId: number (opcional)
  - activo: boolean (opcional)
  - destacado: boolean (opcional)
  - search: string (opcional) - Busca en nombre y descripción
```

### Obtener productos destacados
```
GET /productos/destacados/:limit
```

### Obtener productos por categoría
```
GET /productos/categoria/:categoriaId
```

### Obtener un producto específico
```
GET /productos/:id
```

### Crear un nuevo producto
```
POST /productos
Body:
{
  "nombre": "Vino Tinto Reserva",
  "descripcion": "Descripción del producto",
  "categoria_id": 1,
  "precio_costo": 35.00,
  "precio_venta": 65.00,
  "stock": 50,
  "stock_minimo": 5,
  "marca": "Concha y Toro",
  "gradacion_alcoholica": 14.0,
  "volumen_ml": 750,
  "tipo_bebida": "vino",
  "pais_origen": "Chile",
  "imagen_url": "https://...",
  "imagenes_adicionales": "[\"url1\", \"url2\"]",
  "activo": true,
  "destacado": true
}
```

### Actualizar un producto
```
PUT /productos/:id
Body: (Todos los campos son opcionales)
{
  "nombre": "...",
  "descripcion": "...",
  "precio_venta": 75.00,
  "stock": 60,
  ...
}
```

### Actualizar stock de un producto
```
PUT /productos/:id/stock
Body:
{
  "cantidad": -5  // Positivo suma, negativo resta
}
```

### Togglear producto como destacado
```
PUT /productos/:id/toggle-destacado
```

### Eliminar un producto
```
DELETE /productos/:id
```

---

## Ejemplos de uso

### Obtener todos los productos activos de la categoría de Vinos
```
GET /productos?categoriaId=1&activo=true
```

### Buscar productos por nombre
```
GET /productos?search=vino
```

### Obtener 10 productos destacados
```
GET /productos/destacados/10
```

### Actualizar solo el precio de un producto
```
PUT /productos/5
Body:
{
  "precio_venta": 70.00
}
```

---

## Estructura de Respuesta

### Producto
```json
{
  "id": 1,
  "nombre": "Vino Tinto Reserva Concha y Toro",
  "descripcion": "Vino tinto chileno de alta calidad",
  "categoria_id": 1,
  "precio_costo": 35.00,
  "precio_venta": 65.00,
  "stock": 50,
  "stock_minimo": 5,
  "marca": "Concha y Toro",
  "gradacion_alcoholica": 14.0,
  "volumen_ml": 750,
  "tipo_bebida": "vino",
  "pais_origen": "Chile",
  "imagen_url": "https://...",
  "imagenes_adicionales": "[...]",
  "activo": true,
  "destacado": true,
  "created_at": "2025-02-17T10:30:00Z",
  "updated_at": "2025-02-17T10:30:00Z",
  "categoria": {
    "id": 1,
    "nombre": "Vinos",
    "descripcion": "...",
    "imagen_url": "...",
    "activa": true,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### Categoría
```json
{
  "id": 1,
  "nombre": "Vinos",
  "descripcion": "Vinos nacionales e internacionales",
  "imagen_url": "https://...",
  "activa": true,
  "created_at": "2025-02-17T10:30:00Z",
  "updated_at": "2025-02-17T10:30:00Z"
}
```
