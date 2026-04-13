# Script de PowerShell para ejecutar comandos rápidos
# Uso: powershell.exe -ExecutionPolicy Bypass -File quick_commands.ps1

# Colores para consola
$Green = 'Green'
$Yellow = 'Yellow'
$Red = 'Red'

Write-Host "`n" -ForegroundColor $Green
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║    API AUTOLAVADO - COMANDOS RÁPIDOS (PowerShell)         ║" -ForegroundColor $Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Green
Write-Host ""

Write-Host "OPCIONES DISPONIBLES:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "  1. Verificar conexión a BD"
Write-Host "  2. Ver estado de la BD"
Write-Host "  3. Crear backup"
Write-Host "  4. Instalar dependencias"
Write-Host "  5. Ejecutar FastAPI"
Write-Host "  6. Ver documentación"
Write-Host "  7. Ejecutar pruebas de conexión"
Write-Host "  8. Reiniciar BD (CUIDADO)"
Write-Host "  0. Salir"
Write-Host ""

$option = Read-Host "Ingresa tu opción (0-8)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "✓ Verificando conexión..." -ForegroundColor $Green
        python -c "
from db_utils import test_connection
test_connection()
"
        Write-Host ""
        break
    }
    "2" {
        Write-Host ""
        Write-Host "✓ Estado de la BD..." -ForegroundColor $Green
        python -c "
from db_utils import check_database_status
check_database_status()
"
        Write-Host ""
        break
    }
    "3" {
        Write-Host ""
        Write-Host "✓ Creando backup..." -ForegroundColor $Green
        python -c "
from db_utils import backup_database
backup_database('autolavado')
"
        Write-Host ""
        break
    }
    "4" {
        Write-Host ""
        Write-Host "✓ Instalando dependencias..." -ForegroundColor $Green
        pip install sqlalchemy pymysql python-dotenv fastapi uvicorn
        Write-Host ""
        break
    }
    "5" {
        Write-Host ""
        Write-Host "✓ Ejecutando FastAPI..." -ForegroundColor $Green
        Write-Host "📚 Accede a: http://localhost:8000/docs" -ForegroundColor $Yellow
        Write-Host ""
        python app_example.py
        Write-Host ""
        break
    }
    "6" {
        Write-Host ""
        Write-Host "✓ Abriendo documentación..." -ForegroundColor $Green
        Invoke-Item DATABASE_README.md
        Write-Host ""
        break
    }
    "7" {
        Write-Host ""
        Write-Host "✓ Ejecutando pruebas..." -ForegroundColor $Green
        python -c "
from database import test_connection, get_database_info
from db_utils import initialize_database

print('\n=== PRUEBA DE CONEXIÓN ===')
if test_connection():
    print('\n=== INFORMACIÓN DE BASE DE DATOS ===')
    info = get_database_info()
    if info:
        print(f'Base de Datos: {info[\"database\"]}')
        print(f'Host: {info[\"host\"]}:{info[\"port\"]}')
        print(f'Tablas: {len(info[\"tables\"])}')
        for table in info['tables']:
            print(f'  - {table}')
"
        Write-Host ""
        break
    }
    "8" {
        Write-Host ""
        Write-Host "⚠️  OPERACIÓN PELIGROSA" -ForegroundColor $Red
        Write-Host "Esto eliminará TODOS los datos de la base de datos." -ForegroundColor $Red
        $confirm = Read-Host "¿Estás seguro? (SÍ/NO)"
        
        if ($confirm -eq "SÍ") {
            Write-Host "Reiniciando BD..." -ForegroundColor $Yellow
            python -c "
from db_utils import reset_database
reset_database()
"
        } else {
            Write-Host "Operación cancelada" -ForegroundColor $Green
        }
        Write-Host ""
        break
    }
    "0" {
        Write-Host "Hasta luego!" -ForegroundColor $Green
        exit
    }
    default {
        Write-Host "Opción inválida" -ForegroundColor $Red
    }
}

Write-Host "Presiona Enter para salir..."
Read-Host
