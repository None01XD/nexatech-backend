# Backend Productos

Proyecto backend con Node.js, Express y MySQL. API REST para CRUD de productos.

Instalación:

```bash
cd backend
npm install
```

Configurar variables de entorno: copia `.env` y ajusta credenciales.

Crear base de datos (MySQL):

```sql
-- Ejecutar archivo create_db.sql
```

Scripts:

- `npm run dev` — inicia con nodemon
- `npm start` — inicia con node

Endpoints API:

- GET /api/productos
- GET /api/productos/:id
- POST /api/productos
- PUT /api/productos/:id
- DELETE /api/productos/:id

Frontend estático en `src/public` (páginas de ejemplo empresariales).
