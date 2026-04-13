@echo off
REM Archivo batch para ejecutar comandos rápidos en Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         API AUTOLAVADO - MENU RAPIDO                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Selecciona una opción:
echo.
echo 1. Verificar conexión a BD
echo 2. Ver estado de la BD
echo 3. Crear backup de BD
echo 4. Instalar dependencias
echo 5. Ejecutar aplicación (FastAPI)
echo 6. Ver documentación
echo 0. Salir
echo.

set /p option="Ingresa tu opción (0-6): "

if "%option%"=="1" (
    echo.
    echo ✓ Verificando conexión...
    python -c "from db_utils import test_connection; test_connection()"
    echo.
) else if "%option%"=="2" (
    echo.
    echo ✓ Estado de la BD...
    python -c "from db_utils import check_database_status; check_database_status()"
    echo.
) else if "%option%"=="3" (
    echo.
    echo ✓ Creando backup...
    python -c "from db_utils import backup_database; backup_database('autolavado')"
    echo.
) else if "%option%"=="4" (
    echo.
    echo ✓ Instalando dependencias...
    pip install sqlalchemy pymysql python-dotenv fastapi uvicorn
    echo.
) else if "%option%"=="5" (
    echo.
    echo ✓ Ejecutando FastAPI...
    echo Accede a: http://localhost:8000/docs
    echo.
    python app_example.py
    echo.
) else if "%option%"=="6" (
    echo.
    echo ✓ Abriendo documentación...
    start DATABASE_README.md
    echo.
) else if "%option%"=="0" (
    echo Hasta luego!
    exit /b
) else (
    echo Opción inválida
)

pause
goto :EOF
