"""
Módulo de conexión a base de datos SQL con SQLAlchemy.
Proporciona utilidades para gestionar conexiones y sesiones.
"""

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from typing import Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de la base de datos
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "1234")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3307")
DB_NAME = os.getenv("DB_NAME", "autolavadoDB")

# URL de conexión a la base de datos
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Crear motor de base de datos con pool de conexiones
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,  # Número de conexiones a mantener en el pool
    max_overflow=20,  # Conexiones adicionales permitidas
    pool_pre_ping=True,  # Verificar conexiones antes de usarlas
    echo=False,  # Cambiar a True para ver las queries SQL
)

# Crear sesión local
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base para los modelos ORM
Base = declarative_base()


def get_db() -> Session:
    """
    Función para obtener una sesión de base de datos.
    Se usa típicamente en FastAPI con Depends().
    
    Yields:
        Session: Sesión de SQLAlchemy para operaciones de base de datos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """
    Crea todas las tablas en la base de datos basadas en los modelos.
    """
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """
    Elimina todas las tablas de la base de datos.
    ¡USAR CON CUIDADO!
    """
    Base.metadata.drop_all(bind=engine)


def test_connection() -> bool:
    """
    Prueba la conexión a la base de datos.
    
    Returns:
        bool: True si la conexión es exitosa, False en caso contrario.
    """
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("✓ Conexión a la base de datos exitosa")
        return True
    except Exception as e:
        print(f"✗ Error al conectar a la base de datos: {e}")
        return False


def get_database_info() -> Optional[dict]:
    """
    Obtiene información sobre la base de datos y sus tablas.
    
    Returns:
        dict: Información de la base de datos incluyendo tabla e índices.
    """
    try:
        inspector = inspect(engine)
        
        db_info = {
            "database": DB_NAME,
            "host": DB_HOST,
            "port": DB_PORT,
            "tables": inspector.get_table_names(),
            "table_details": {}
        }
        
        for table_name in inspector.get_table_names():
            columns = inspector.get_columns(table_name)
            indexes = inspector.get_indexes(table_name)
            
            db_info["table_details"][table_name] = {
                "columns": [
                    {
                        "name": col["name"],
                        "type": str(col["type"]),
                        "nullable": col["nullable"],
                        "primary_key": col.get("primary_key", False)
                    }
                    for col in columns
                ],
                "indexes": indexes
            }
        
        return db_info
    except Exception as e:
        print(f"Error al obtener información de la base de datos: {e}")
        return None


# Dependencia para FastAPI (opcional)
async def get_db_async() -> Session:
    """
    Función asíncrona para obtener una sesión de base de datos.
    
    Yields:
        Session: Sesión de SQLAlchemy para operaciones de base de datos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
