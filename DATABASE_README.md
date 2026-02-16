# 📚 Guía de Configuración de Base de Datos - API Autolavado

## 📋 Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
- [Uso](#uso)
- [Archivos Principales](#archivos-principales)

---

## Requisitos Previos

- **Python 3.8+**
- **MySQL 5.7+** o **MariaDB**
- Librerías necesarias:
  ```bash
  pip install sqlalchemy pymysql python-dotenv
  ```

---

## Instalación

### 1. Configurar MySQL/MariaDB

Asegúrate de tener MySQL/MariaDB instalado y ejecutándose en tu sistema:

```bash
# En Windows (si usas WSL o MySQL en línea de comandos)
mysql -u root -p

# Crear la base de datos (opcional, el script SQL lo hace)
CREATE DATABASE autolavadoDB;
```

### 2. Ejecutar el Script SQL

Ejecuta el script de creación de la base de datos:

```bash
mysql -u root -p autolavadoDB < database_schema.sql
```

O en MySQL Workbench:
1. Abre MySQL Workbench
2. Copia el contenido de `database_schema.sql`
3. Pégalo en una nueva consulta
4. Ejecuta (Ctrl+Enter)

### 3. Instalar Dependencias Python

```bash
pip install -r requirements.txt
```

---

## Configuración

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

```env
# Configuración de Base de Datos
DB_USER=root
DB_PASSWORD=1234
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=autolavadoDB

# Configuración de la Aplicación
DEBUG=False
LOG_LEVEL=INFO

# Configuración de JWT (si usas autenticación)
SECRET_KEY=tu-clave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**⚠️ Nota:** Este archivo no debe ser commiteado a Git. Agregarlo a `.gitignore`.

---

## Estructura de la Base de Datos

### Tablas Principales

#### 🔐 `tbc_roles`
Almacena los roles de usuario (Admin, Cajero, Lavador, Cliente)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID principal |
| description | VARCHAR(60) | Descripción del rol |
| estatus | BOOLEAN | Estado activo/inactivo |

#### 👤 `tbb_users`
Información de usuarios del sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | ID principal |
| rol_Id | INT | Referencia al rol (FK) |
| nombre | VARCHAR(60) | Nombre del usuario |
| papellido | VARCHAR(60) | Primer apellido |
| sapellido | VARCHAR(60) | Segundo apellido |
| usuario | VARCHAR(60) | Usuario (único) |
| contrasena | VARCHAR(60) | Contraseña |
| telefono | VARCHAR(10) | Teléfono |
| estatus | BOOLEAN | Estado activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |
| fecha_modificacion | DATETIME | Última modificación |

#### 🏪 `tbc_cliente`
Información de clientes del autolavado

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | ID principal |
| nombre | VARCHAR(60) | Nombre del cliente |
| papellido | VARCHAR(60) | Primer apellido |
| sapellido | VARCHAR(60) | Segundo apellido |
| direccion | VARCHAR(60) | Dirección |
| telefono | VARCHAR(10) | Teléfono |
| estatus | BOOLEAN | Estado activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |
| fecha_modificacion | DATETIME | Última modificación |

#### 🛠️ `tbc_servicio`
Servicios ofrecidos (lavado completo, interior, exterior, etc.)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | ID principal |
| nombre | VARCHAR(60) | Nombre del servicio |
| descripcion | VARCHAR(60) | Descripción |
| costo | INT | Costo del servicio |
| estatus | BOOLEAN | Estado activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |
| fecha_modificacion | DATETIME | Última modificación |

#### 🚗 `tbb_vehiculo`
Vehículos registrados en el sistema

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | ID principal |
| cliente_Id | INT | Referencia al cliente (FK) |
| matricula | VARCHAR(60) | Placa del vehículo (única) |
| modelo | VARCHAR(60) | Modelo del vehículo |
| color | VARCHAR(60) | Color |
| numero_del_dueno | VARCHAR(60) | Número de propietario |
| estatus | BOOLEAN | Estado activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |
| fecha_modificacion | DATETIME | Última modificación |

#### 📋 `tbd_serviciovehiculo`
Registro de servicios realizados a vehículos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | INT | ID principal |
| cajero_Id | INT | Referencia al usuario cajero (FK) |
| lavador_Id | INT | Referencia al usuario lavador (FK) |
| servicio_Id | INT | Referencia al servicio (FK) |
| vehiculo_Id | INT | Referencia al vehículo (FK) |
| fecha | DATETIME | Fecha del servicio |
| estatus | BOOLEAN | Estado activo/inactivo |
| fecha_registro | DATETIME | Fecha de creación |
| fecha_modificacion | DATETIME | Última modificación |

---

## Uso

### 1. Inicializar la Base de Datos (Primera Ejecución)

En tu archivo `main.py` o en un script de inicialización:

```python
from db_utils import initialize_database, check_database_status

if __name__ == "__main__":
    # Ejecutar una sola vez
    initialize_database()
    
    # Ver estado de la BD
    check_database_status()
```

### 2. Usar Sesiones en FastAPI

```python
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db

app = FastAPI()

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
```

### 3. Ejecutar Consultas SQL Directas

```python
from db_utils import execute_raw_query

# Obtener todos los usuarios activos
results = execute_raw_query(
    "SELECT * FROM tbb_users WHERE estatus = 1"
)
for row in results:
    print(row)
```

### 4. Crear un Backup

```python
from db_utils import backup_database

backup_database("autolavado_backup")
```

### 5. Reiniciar la Base de Datos (⚠️ CUIDADO)

```python
from db_utils import reset_database

reset_database()  # Solicita confirmación
```

---

## Archivos Principales

| Archivo | Descripción |
|---------|-------------|
| `database.py` | Configuración principal de SQLAlchemy y conexión |
| `db_utils.py` | Utilidades y funciones auxiliares |
| `database_schema.sql` | Script SQL con la estructura completa |
| `.env` | Variables de entorno (NO commitar a Git) |
| `schemas/` | Directorio con esquemas Pydantic (validación) |
| `models/` | Directorio con modelos SQLAlchemy (ORM) |

---

## Troubleshooting

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Solución:**
- Verifica las credenciales en `.env`
- Asegúrate de que MySQL esté ejecutándose
- Reinicia MySQL si es necesario

### ❌ Error: "Can't connect to MySQL server"

**Solución:**
- Verifica que MySQL esté corriendo en el puerto 3306
- Comprueba la dirección IP en `.env` (usa `127.0.0.1` o `localhost`)

### ❌ Error: "Table already exists"

**Solución:**
- Usa `reset_database()` para reiniciar, o
- Ejecuta `DROP TABLE IF EXISTS` en MySQL

### ❌ Error: "Foreign key constraint fails"

**Solución:**
- Asegúrate de que los registros referenciados existan
- El orden de inserción importa (roles antes que usuarios, etc.)

---

## 📞 Soporte

Para más información sobre SQLAlchemy:
- [Documentación SQLAlchemy](https://docs.sqlalchemy.org/)
- [Documentación pymysql](https://pymysql.readthedocs.io/)

---

**Última actualización:** Febrero 2026
