# Frontend React - Sistema Autolavado

Frontend de React para el sistema de gestión de autolavado.

## Estructura del Proyecto

```
src/
├── pages/          # Páginas principales (Login, Dashboard)
├── components/     # Componentes reutilizables
├── services/       # Servicios de API
├── contexts/       # Context para estado global (Auth)
├── assets/         # Imágenes y recursos estáticos
├── App.jsx         # Componente principal
└── main.jsx        # Punto de entrada
```

## Instalación

1. **Instala las dependencias del frontend:**
   ```bash
   npm install
   ```

## Desarrollo

1. **Asegúrate de que el backend está ejecutándose:**
   ```bash
   uvicorn app_example:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Inicia el servidor de desarrollo del frontend:**
   ```bash
   npm run dev
   ```

3. **Abre tu navegador:**
   - http://localhost:5173 (puerto por defecto de Vite)

## Compilación para Producción

```bash
npm run build
```

Esto generará los archivos estáticos en la carpeta `dist/`.

## Uso

### Login
- Accede a http://localhost:5173/login
- Ingresa tus credenciales (usuario y contraseña del backend)
- Se guardará un token JWT en localStorage

### Dashboard
- Una vez autenticado, accederás al dashboard
- Puedes ver datos de Roles, Usuarios, Clientes, Vehículos, Servicios y Pro ductos
- Cada tab carga los datos del backend en tiempo real

## Características

- ✅ Autenticación con JWT
- ✅ Rutas protegidas
- ✅ Visualización de datos en tablas
- ✅ Proxy configurado para desarrollo
- ✅ Interceptores de Axios para manejo de tokens
- ✅ Manejo de errores

## Dependencias Principales

- **React**: UI library
- **React Router DOM**: Navegación
- **Axios**: Cliente HTTP
- **Vite**: Build tool

## Configuración del Backend

El frontend está configurado para conectarse al backend en `http://localhost:8000`.

En **vite.config.js** hay un proxy configurado para las siguientes rutas:
- `/login`
- `/roles`
- `/usuarios`
- `/clientes`
- `/servicios`
- `/vehiculos`
- `/productos`

## Variables de Entorno

Copia `.env.example` a `.env.local` si necesitas personalizar:

```bash
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Error de CORS
- Asegúrate de que el backend tiene CORS habilitado (ya está configurado)
- Verifica que el backend está ejecutándose en puerto 8000

### Token expirado
- El token se valida en cada request
- Si es inválido, serás redirigido al login automáticamente

### Datos vacíos
- Verifica que hay datos en la base de datos del backend
- Comprueba que estás autenticado correctamente
