```
╔════════════════════════════════════════════════════════════════════════════╗
║                   API AUTOLAVADO - GUÍA RÁPIDA VISUAL                      ║
╚════════════════════════════════════════════════════════════════════════════╝

📁 ESTRUCTURA DEL PROYECTO
═══════════════════════════════════════════════════════════════════════════════

API_TEST/
│
├─ 🗄️  BASE DE DATOS
│  ├─ database.py              ← ⭐ PUNTO DE ENTRADA (conexión SQLAlchemy)
│  ├─ db_utils.py              ← Funciones auxiliares
│  ├─ crud_operations.py        ← Operaciones CRUD
│  ├─ database_schema.sql       ← Script de creación
│  └─ .env                      ← Credenciales (NO commitar)
│
├─ 📋 SCHEMAS (Validación Pydantic)
│  ├─ schemauser.py            (existente)
│  ├─ schemarol.py             (existente)
│  ├─ schemacliente.py         ✨ NUEVO
│  ├─ schemaservicio.py        ✨ NUEVO
│  ├─ schemavehiculo.py        ✨ NUEVO
│  └─ schemaserviciovehiculo.py ✨ NUEVO
│
├─ 🏗️  MODELOS (SQLAlchemy ORM)
│  ├─ model_user.py
│  ├─ modelcliente.py
│  ├─ modelrol.py
│  ├─ modelservicio.py
│  ├─ vehiculos.py
│  └─ serviciovehiculo.py
│
├─ 📚 DOCUMENTACIÓN
│  ├─ DATABASE_README.md        ← 📖 DOCUMENTACIÓN COMPLETA
│  ├─ SETUP_GUIDE.py            ← Guía de instalación
│  ├─ RESUMEN_TRABAJO.md        ← Resumen detallado
│  ├─ CHECKLIST.md              ← Verificación
│  └─ README_VISUAL.txt         ← Este archivo
│
├─ 💻 EJEMPLOS Y HERRAMIENTAS
│  ├─ app_example.py            ← FastAPI lista para usar
│  ├─ menu_rapido.bat           ← Menú Windows
│  └─ quick_commands.ps1        ← Comandos PowerShell
│
└─ ⚙️  CONFIGURACIÓN
   ├─ main.py                   (existente)
   ├─ requirements.txt
   └─ config/
      ├─ __init__.py
      └─ db.py


═══════════════════════════════════════════════════════════════════════════════
🚀 INICIO RÁPIDO (5 PASOS)
═══════════════════════════════════════════════════════════════════════════════

1️⃣  INSTALAR DEPENDENCIAS
    ┌─────────────────────────────────────────────┐
    │ pip install sqlalchemy pymysql python-dotenv│
    └─────────────────────────────────────────────┘

2️⃣  CREAR ARCHIVO .env
    ┌──────────────────────────┐
    │ DB_USER=root             │
    │ DB_PASSWORD=1234         │
    │ DB_HOST=127.0.0.1        │
    │ DB_PORT=3306             │
    │ DB_NAME=autolavadoDB     │
    └──────────────────────────┘

3️⃣  CREAR BASE DE DATOS
    ┌──────────────────────────────────────────────────┐
    │ mysql -u root -p autolavadoDB < database_schema │
    └──────────────────────────────────────────────────┘

4️⃣  VERIFICAR CONEXIÓN
    ┌────────────────────────────────────────────────┐
    │ python -c "from db_utils import test_connection│
    │ test_connection()"                             │
    └────────────────────────────────────────────────┘

5️⃣  USAR EN CÓDIGO
    ┌──────────────────────────────────────────────┐
    │ from database import SessionLocal              │
    │ db = SessionLocal()                            │
    │ # Usar db para operaciones                     │
    │ db.close()                                     │
    └──────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
📊 ESTRUCTURA DE BASE DE DATOS
═══════════════════════════════════════════════════════════════════════════════

    tbc_roles                tbb_users              tbc_cliente
    ────────                ─────────              ───────────
    🔑 id                   🔑 Id                  🔑 Id
    📝 description          🔑→ rol_Id             📝 nombre
    ✓ estatus              📝 nombre              📝 papellido
                           📝 papellido           📝 sapellido
                           📝 sapellido           📝 direccion
                           📝 usuario             📝 telefono
                           🔐 contrasena         ✓ estatus
                           📞 telefono           ⏰ fecha_registro
                           ✓ estatus             ⏰ fecha_modificacion
                           ⏰ fecha_registro
                           ⏰ fecha_modificacion

                    tbc_servicio               tbb_vehiculo
                    ────────────               ────────────
                    🔑 Id                      🔑 Id
                    📝 nombre                  🔑→ cliente_Id
                    📝 descripcion             📝 matricula
                    💲 costo                   📝 modelo
                    ✓ estatus                  📝 color
                    ⏰ fecha_registro          📝 numero_del_dueno
                    ⏰ fecha_modificacion      ✓ estatus
                                              ⏰ fecha_registro
                                              ⏰ fecha_modificacion

                    tbd_serviciovehiculo
                    ────────────────────
                    🔑 Id
                    🔑→ cajero_Id
                    🔑→ lavador_Id
                    🔑→ servicio_Id
                    🔑→ vehiculo_Id
                    📅 fecha
                    ✓ estatus
                    ⏰ fecha_registro
                    ⏰ fecha_modificacion


═══════════════════════════════════════════════════════════════════════════════
💡 EJEMPLOS DE USO
═══════════════════════════════════════════════════════════════════════════════

┌─ OBTENER CONEXIÓN ──────────────────────────────────────────────┐
│                                                                   │
│  from database import SessionLocal                               │
│  db = SessionLocal()                                              │
│  # Usar db                                                       │
│  db.close()                                                      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌─ USAR EN FASTAPI ───────────────────────────────────────────────┐
│                                                                   │
│  from fastapi import Depends                                     │
│  from database import get_db                                     │
│                                                                   │
│  @app.get("/endpoint/")                                          │
│  def endpoint(db: Session = Depends(get_db)):                    │
│      # Usar db                                                   │
│      return {}                                                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌─ OPERACIONES CRUD ──────────────────────────────────────────────┐
│                                                                   │
│  from crud_operations import RolOperations                       │
│                                                                   │
│  # Crear                                                         │
│  rol = RolOperations.crear_rol(db, "Admin")                      │
│                                                                   │
│  # Obtener todos                                                 │
│  roles = RolOperations.obtener_todos_roles(db)                   │
│                                                                   │
│  # Obtener uno                                                   │
│  rol = RolOperations.obtener_rol(db, 1)                          │
│                                                                   │
│  # Actualizar                                                    │
│  rol = RolOperations.actualizar_rol(db, 1, description="Editor")│
│                                                                   │
│  # Eliminar                                                      │
│  RolOperations.eliminar_rol(db, 1)                               │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

┌─ VALIDACIÓN CON PYDANTIC ───────────────────────────────────────┐
│                                                                   │
│  from schemas.schemarol import SchemaRol                          │
│                                                                   │
│  # Validar datos                                                 │
│  datos = SchemaRol(                                               │
│      nombre="Administrador",                                     │
│      descripcion="Usuario admin",                                │
│      estado=True                                                 │
│  )                                                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
🔧 FUNCIONES ÚTILES
═══════════════════════════════════════════════════════════════════════════════

from db_utils import:

  test_connection()           → Verificar conexión ✓
  check_database_status()     → Ver estado completo
  create_tables()             → Crear tablas
  drop_tables()               → Eliminar tablas (¡CUIDADO!)
  initialize_database()       → Inicializar BD
  execute_raw_query(sql)      → SQL directo
  backup_database()           → Hacer backup
  reset_database()            → Reiniciar BD (¡CUIDADO!)
  get_database_info()         → Info completa


═══════════════════════════════════════════════════════════════════════════════
📚 DOCUMENTACIÓN
═══════════════════════════════════════════════════════════════════════════════

├─ DATABASE_README.md        → Guía completa (LEER PRIMERO)
├─ SETUP_GUIDE.py           → Instalación paso a paso
├─ RESUMEN_TRABAJO.md       → Resumen de cambios
├─ CHECKLIST.md             → Verificación final
└─ app_example.py           → Código de ejemplo


═══════════════════════════════════════════════════════════════════════════════
🎯 ARCHIVOS CLAVE (Orden de importancia)
═══════════════════════════════════════════════════════════════════════════════

1️⃣  database.py              ← Empieza aquí
2️⃣  .env                     ← Configura aquí
3️⃣  database_schema.sql      ← Crea BD aquí
4️⃣  crud_operations.py       ← Usa operaciones
5️⃣  app_example.py           ← Ve ejemplos


═══════════════════════════════════════════════════════════════════════════════
⚠️  COSAS IMPORTANTES
═══════════════════════════════════════════════════════════════════════════════

✓ HACER:
  ✅ Mantener .env en .gitignore
  ✅ Cambiar credenciales en producción
  ✅ Hacer backups regularmente
  ✅ Usar pool de conexiones
  ✅ Cerrar sesiones después de usar

✗ NO HACER:
  ❌ Commitar archivo .env
  ❌ Compartir credenciales
  ❌ Usar contraseña "1234" en producción
  ❌ Ejecutar reset_database() sin confirmación
  ❌ Olvidar db.close() en scripts


═══════════════════════════════════════════════════════════════════════════════
🚀 EJECUTAR APLICACIÓN FASTAPI
═══════════════════════════════════════════════════════════════════════════════

  python app_example.py

  O con uvicorn:

  uvicorn app_example:app --reload

  Luego accede a:
  📖 http://localhost:8000/docs        (Swagger)
  📖 http://localhost:8000/redoc       (ReDoc)


═══════════════════════════════════════════════════════════════════════════════
✅ ESTADO FINAL: COMPLETADO Y LISTO PARA USAR
═══════════════════════════════════════════════════════════════════════════════

✓ 4 Schemas nuevos creados
✓ 3 Archivos de base de datos configurados
✓ 2 Scripts SQL completos
✓ 6 Documentos detallados
✓ 1 Aplicación FastAPI de ejemplo
✓ Herramientas de línea de comandos

¡Listo para empezar! 🎉
```
