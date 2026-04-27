# Test Requests - TiendaWonder API

Puedes importar estas requests en Postman o similar para probar la API.

## 🏪 Categorías

### 1. Crear Categoría
```
POST http://localhost:3000/categorias
Content-Type: application/json

{
  "nombre": "Vinos",
  "descripcion": "Vinos nacionales e internacionales de diferentes regiones",
  "imagen_url": "https://via.placeholder.com/400?text=Vinos",
  "activa": true
}
```

### 2. Listar todas las categorías
```
GET http://localhost:3000/categorias
```

### 3. Listar solo categorías activas
```
GET http://localhost:3000/categorias?activa=true
```

### 4. Obtener una categoría específica
```
GET http://localhost:3000/categorias/1
```

### 5. Actualizar categoría
```
PUT http://localhost:3000/categorias/1
Content-Type: application/json

{
  "nombre": "Vinos Premium",
  "descripcion": "Vinos de alta gama"
}
```

### 6. Togglear estado de categoría
```
PUT http://localhost:3000/categorias/1/toggle
```

### 7. Eliminar categoría
```
DELETE http://localhost:3000/categorias/1
```

---

## 🍷 Productos

### 1. Crear Producto
```
POST http://localhost:3000/productos
Content-Type: application/json

{
  "nombre": "Vino Tinto Reserva Concha y Toro",
  "descripcion": "Vino tinto chileno de alta calidad con notas de frutas rojas",
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
  "imagen_url": "https://via.placeholder.com/300?text=Vino+Concha",
  "imagenes_adicionales": "[\"url1\", \"url2\"]",
  "activo": true,
  "destacado": true
}
```

### 2. Listar todos los productos
```
GET http://localhost:3000/productos
```

### 3. Listar solo productos activos
```
GET http://localhost:3000/productos?activo=true
```

### 4. Listar solo productos destacados
```
GET http://localhost:3000/productos?destacado=true
```

### 5. Filtrar por categoría
```
GET http://localhost:3000/productos?categoriaId=1
```

### 6. Combinación de filtros (Categoría + Activos + Destacados)
```
GET http://localhost:3000/productos?categoriaId=1&activo=true&destacado=true
```

### 7. Buscar productos
```
GET http://localhost:3000/productos?search=vino
```

### 8. Obtener 8 productos destacados
```
GET http://localhost:3000/productos/destacados/8
```

### 9. Obtener productos de una categoría específica
```
GET http://localhost:3000/productos/categoria/1
```

### 10. Obtener un producto específico
```
GET http://localhost:3000/productos/1
```

### 11. Actualizar producto (parcial)
```
PUT http://localhost:3000/productos/1
Content-Type: application/json

{
  "precio_venta": 75.00,
  "stock": 45
}
```

### 12. Actualizar solo el precio
```
PUT http://localhost:3000/productos/1
Content-Type: application/json

{
  "precio_venta": 70.00
}
```

### 13. Aumentar stock
```
PUT http://localhost:3000/productos/1/stock
Content-Type: application/json

{
  "cantidad": 10
}
```

### 14. Reducir stock
```
PUT http://localhost:3000/productos/1/stock
Content-Type: application/json

{
  "cantidad": -5
}
```

### 15. Togglear como destacado
```
PUT http://localhost:3000/productos/1/toggle-destacado
```

### 16. Eliminar producto
```
DELETE http://localhost:3000/productos/1
```

---

## 🔄 Flujos Completos de Prueba

### Flujo 1: Crear catálogo básico

1. Crear 3 categorías:
   - Vinos
   - Cervezas  
   - Destilados

2. Crear 2 productos en cada categoría

3. Marcar algunos como destacados

4. Obtener productos destacados

### Flujo 2: Gestionar inventario

1. Crear un producto con stock inicial de 100

2. Reducir stock a 95

3. Aumentar stock a 110

4. Verificar el stock final

### Flujo 3: Búsqueda y filtrado

1. Crear múltiples productos en diferentes categorías

2. Buscar por nombre

3. Filtrar por categoría

4. Combinar filtros

---

## 💡 Notas

- Todos los precios deben ser números decimales (ejemplo: 65.00)
- Las URLs de imagen pueden ser cualquier URL válida o placeholder
- El campo `imagenes_adicionales` espera un JSON string o array
- El `stock_minimo` por defecto es 5 si no se especifica
- Los estados pueden ser `true` o `false` (minúsculas)

## 🐛 Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 400 Bad Request | Datos inválidos | Verifica el formato del JSON |
| 404 Not Found | Recurso no existe | Verifica el ID del producto/categoría |
| 409 Conflict | Nombre duplicado en categoría | Usa un nombre único |
| 422 Validation Error | Campo requerido faltante | Revisa los campos requeridos en DTOs |

---

**Última actualización:** 17/02/2025
