"""
Archivo de ejemplo y utilidades para la conexión a base de datos.
Contiene ejemplos de cómo usar la conexión y funciones útiles.
"""

from database import (
    engine,
    SessionLocal,
    Base,
    test_connection,
    create_tables,
    get_database_info
)
from sqlalchemy.orm import Session
from sqlalchemy import text


def initialize_database():
    """
    Inicializa la base de datos creando todas las tablas.
    Ejecutar esta función al iniciar la aplicación por primera vez.
    """
    print("Inicializando base de datos...")
    
    # Probar conexión
    if not test_connection():
        print("No se pudo conectar a la base de datos.")
        return False
    
    # Crear tablas
    try:
        create_tables()
        print("✓ Tablas creadas exitosamente")
        return True
    except Exception as e:
        print(f"✗ Error al crear tablas: {e}")
        return False


def check_database_status():
    """
    Verifica el estado de la base de datos y muestra información.
    """
    print("\n=== ESTADO DE LA BASE DE DATOS ===\n")
    
    if not test_connection():
        return
    
    db_info = get_database_info()
    if db_info:
        print(f"Base de Datos: {db_info['database']}")
        print(f"Host: {db_info['host']}:{db_info['port']}")
        print(f"\nTablas ({len(db_info['tables'])}):")
        
        for table_name in db_info['tables']:
            columns = db_info['table_details'][table_name]['columns']
            print(f"\n  📊 {table_name}")
            for col in columns:
                pk = "🔑" if col['primary_key'] else "  "
                nullable = "✓" if col['nullable'] else "✗"
                print(f"    {pk} {col['name']}: {col['type']} (nullable: {nullable})")


def execute_raw_query(query: str, params: dict = None) -> list:
    """
    Ejecuta una consulta SQL directa.
    
    Args:
        query (str): La consulta SQL a ejecutar.
        params (dict, optional): Parámetros para la consulta.
    
    Returns:
        list: Resultados de la consulta.
    """
    db = SessionLocal()
    try:
        result = db.execute(text(query), params or {})
        db.commit()
        return result.fetchall()
    except Exception as e:
        print(f"Error al ejecutar consulta: {e}")
        db.rollback()
        return []
    finally:
        db.close()


def backup_database(backup_name: str = "backup") -> bool:
    """
    Crea un backup de la base de datos (requiere mysqldump).
    
    Args:
        backup_name (str): Nombre del archivo de backup.
    
    Returns:
        bool: True si el backup fue exitoso.
    """
    import subprocess
    import os
    from datetime import datetime
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{backup_name}_{timestamp}.sql"
    
    try:
        command = f'mysqldump -u root -p1234 -h 127.0.0.1 autolavadoDB > {backup_file}'
        subprocess.run(command, shell=True, check=True)
        print(f"✓ Backup creado: {backup_file}")
        return True
    except Exception as e:
        print(f"✗ Error al crear backup: {e}")
        return False


def reset_database():
    """
    Reinicia la base de datos eliminando todas las tablas y recreándolas.
    ¡USAR CON CUIDADO - BORRA TODOS LOS DATOS!
    """
    confirm = input("⚠️  ¿Estás seguro de que deseas reiniciar la base de datos? (SÍ/NO): ")
    
    if confirm.upper() == "SÍ":
        try:
            from database import drop_tables
            
            print("Eliminando tablas...")
            drop_tables()
            print("✓ Tablas eliminadas")
            
            print("Recreando tablas...")
            create_tables()
            print("✓ Tablas recreadas")
            
            print("✓ Base de datos reiniciada exitosamente")
            return True
        except Exception as e:
            print(f"✗ Error al reiniciar base de datos: {e}")
            return False
    else:
        print("Operación cancelada.")
        return False


if __name__ == "__main__":
    # Descomentar la función deseada para ejecutar
    
    # initialize_database()  # Ejecutar al iniciar por primera vez
    # check_database_status()  # Ver estado de la BD
    # reset_database()  # Reiniciar la BD (¡CUIDADO!)
    
    print("Módulo de utilidades de base de datos cargado.")
    print("Importa las funciones para usarlas en tu aplicación.")
