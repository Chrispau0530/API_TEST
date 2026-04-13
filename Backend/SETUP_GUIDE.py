"""
GUÍA RÁPIDA DE CONFIGURACIÓN
=============================

Este archivo contiene pasos rápidos para poner en marcha el proyecto.
"""

# ============================================================================
# PASO 1: INSTALAR DEPENDENCIAS
# ============================================================================

"""
Ejecuta en la terminal (PowerShell/CMD):

pip install sqlalchemy pymysql python-dotenv fastapi uvicorn

O si tienes requirements.txt:

pip install -r requirements.txt
"""


# ============================================================================
# PASO 2: CREAR ARCHIVO .env
# ============================================================================

"""
Crea un archivo .env en la raíz del proyecto con:

DB_USER=root
DB_PASSWORD=1234
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=autolavadoDB
"""


# ============================================================================
# PASO 3: CREAR LA BASE DE DATOS
# ============================================================================

"""
Opción A: Usar el script SQL directamente en MySQL

1. Abre MySQL en línea de comandos:
   mysql -u root -p

2. Ejecuta:
   SOURCE database_schema.sql;

Opción B: Usar MySQL Workbench

1. Abre MySQL Workbench
2. Copia el contenido de database_schema.sql
3. Pégalo en una nueva consulta
4. Ejecuta (Ctrl+Enter)

Opción C: Usar Python

python -c "
from db_utils import initialize_database
initialize_database()
"
"""


# ============================================================================
# PASO 4: VERIFICAR LA CONEXIÓN
# ============================================================================

"""
Ejecuta en la terminal:

python -c "
from db_utils import test_connection, check_database_status
test_connection()
check_database_status()
"
"""


# ============================================================================
# PASO 5: USAR EN TU APLICACIÓN
# ============================================================================

"""
Ejemplo básico con FastAPI:

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.modelrol import Rols

app = FastAPI()

@app.get("/roles/")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Rols).all()
    return roles

@app.post("/roles/")
def create_role(description: str, db: Session = Depends(get_db)):
    rol = Rols(description=description, estatus=True)
    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""


# ============================================================================
# ESTRUCTURA DE ARCHIVOS CREADOS
# ============================================================================

"""
API_TEST/
│
├── database.py                    ✓ Configuración principal de BD
├── db_utils.py                    ✓ Funciones utilitarias
├── crud_operations.py             ✓ Operaciones CRUD
├── database_schema.sql            ✓ Script de creación
├── .env                           ✓ Variables de entorno
├── DATABASE_README.md             ✓ Documentación completa
│
├── schemas/                       ✓ Esquemas Pydantic
│   ├── schemauser.py
│   ├── schemarol.py
│   ├── schemacliente.py           ✓ Nuevo
│   ├── schemaservicio.py          ✓ Nuevo
│   ├── schemavehiculo.py          ✓ Nuevo
│   └── schemaserviciovehiculo.py  ✓ Nuevo
│
├── models/                        (Ya existentes)
│   ├── model_user.py
│   ├── modelcliente.py
│   ├── modelrol.py
│   ├── modelservicio.py
│   ├── vehiculos.py
│   └── serviciovehiculo.py
"""


# ============================================================================
# ARCHIVOS PRINCIPALES CREADOS
# ============================================================================

"""
1. database.py
   - Configuración de SQLAlchemy
   - Pool de conexiones
   - Funciones: get_db(), create_tables(), test_connection()

2. db_utils.py
   - initialize_database(): Inicializa BD
   - check_database_status(): Ver estado
   - execute_raw_query(): Ejecutar SQL directo
   - backup_database(): Hacer backup
   - reset_database(): Reiniciar BD (¡CUIDADO!)

3. crud_operations.py
   - Clases con operaciones CRUD para cada modelo
   - Métodos: crear, obtener, actualizar, eliminar

4. database_schema.sql
   - Script SQL completo de creación
   - Índices y constraints
   - Datos de ejemplo

5. .env
   - Variables de entorno
   - Configuración de conexión

6. DATABASE_README.md
   - Documentación completa
   - Estructura de tablas
   - Troubleshooting
"""


# ============================================================================
# EJEMPLOS DE USO
# ============================================================================

"""
# Ejemplo 1: Obtener sesión
from database import SessionLocal
db = SessionLocal()

# Ejemplo 2: Usar CRUD
from crud_operations import RolOperations
roles = RolOperations.obtener_todos_roles(db)

# Ejemplo 3: En FastAPI
from fastapi import Depends
from database import get_db

@app.get("/endpoint/")
def endpoint(db: Session = Depends(get_db)):
    # Usar db aquí
    pass

# Ejemplo 4: Ejecutar SQL directo
from db_utils import execute_raw_query
results = execute_raw_query("SELECT * FROM tbc_roles")
"""


# ============================================================================
# CONFIGURACIÓN ADICIONAL (OPCIONAL)
# ============================================================================

"""
Si usas FastAPI, agrega esto a main.py:

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_db
from db_utils import initialize_database

app = FastAPI(title="API Autolavado")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar BD al iniciar
@app.on_event("startup")
def startup_event():
    initialize_database()

# Tu código aquí...
"""


# ============================================================================
# COMANDOS ÚTILES
# ============================================================================

"""
# Ver estado de la BD
python -c "from db_utils import check_database_status; check_database_status()"

# Hacer backup
python -c "from db_utils import backup_database; backup_database()"

# Ejecutar main.py (si tienes una aplicación)
python main.py

# Con FastAPI
uvicorn main:app --reload

# Ver logs de SQL (cambiar echo=True en database.py)
"""


# ============================================================================
# PRÓXIMOS PASOS
# ============================================================================

"""
1. ✓ Revisar DATABASE_README.md para documentación completa
2. ✓ Crear endpoints en FastAPI usando los CRUD
3. ✓ Implementar validación con Pydantic (schemas)
4. ✓ Añadir autenticación si es necesario
5. ✓ Crear tests para las operaciones
"""

print("""
╔════════════════════════════════════════════════════════════════╗
║         ✓ CONFIGURACIÓN COMPLETADA EXITOSAMENTE               ║
║                                                                ║
║  Archivos creados:                                             ║
║  ✓ database.py          - Configuración principal              ║
║  ✓ db_utils.py          - Funciones utilitarias                ║
║  ✓ crud_operations.py   - Operaciones CRUD                     ║
║  ✓ database_schema.sql  - Script de creación                   ║
║  ✓ .env                 - Variables de entorno                 ║
║  ✓ DATABASE_README.md   - Documentación completa               ║
║                                                                ║
║  Schemas creados:                                              ║
║  ✓ schemacliente.py                                            ║
║  ✓ schemaservicio.py                                           ║
║  ✓ schemavehiculo.py                                           ║
║  ✓ schemaserviciovehiculo.py                                   ║
║                                                                ║
║  Lee DATABASE_README.md para instrucciones detalladas          ║
╚════════════════════════════════════════════════════════════════╝
""")
