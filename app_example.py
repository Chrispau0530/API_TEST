"""
Ejemplo de aplicación FastAPI con conexión a base de datos.
Este archivo muestra cómo estructurar una API REST con los modelos y esquemas.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

# Importar configuración de BD
from database import get_db
from db_utils import initialize_database, test_connection

# Importar modelos
from models.modelrol import Rols
from models.model_user import User
from models.modelcliente import Cliente
from models.modelservicio import Servicio
from models.vehiculos import Vehiculo
from models.serviciovehiculo import ServicioVehiculo

# Importar esquemas (Pydantic)
from schemas.schemarol import SchemaRol
from schemas.schemauser import UserCreate, UserUpdate, UserRead
from schemas.schemacliente import ClienteCreate, ClienteUpdate, ClienteRead
from schemas.schemaservicio import ServicioCreate, ServicioUpdate, ServicioRead
from schemas.schemavehiculo import VehiculoCreate, VehiculoUpdate, VehiculoRead
from schemas.schemaserviciovehiculo import (
    ServicioVehiculoCreate, 
    ServicioVehiculoUpdate, 
    ServicioVehiculoRead
)

# ============================================================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ============================================================================

app = FastAPI(
    title="API Autolavado",
    description="API para gestión de autolavado",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# EVENTOS DE INICIO Y CIERRE
# ============================================================================

@app.on_event("startup")
def startup_event():
    """Se ejecuta al iniciar la aplicación"""
    print("\n🚀 Iniciando aplicación...")
    if test_connection():
        print("✓ Base de datos conectada")
        initialize_database()
        print("✓ Base de datos inicializada")
    else:
        print("⚠️ Advertencia: No se pudo conectar a la base de datos")

@app.on_event("shutdown")
def shutdown_event():
    """Se ejecuta al cerrar la aplicación"""
    print("\n🛑 Cerrando aplicación...")

# ============================================================================
# ENDPOINTS DE SALUD
# ============================================================================

@app.get("/")
def read_root():
    """Endpoint raíz"""
    return {
        "mensaje": "Bienvenido a API Autolavado",
        "versión": "1.0.0",
        "documentación": "/docs"
    }

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Verificar estado de la aplicación y BD"""
    try:
        # Intentar una query simple
        db.execute("SELECT 1")
        return {
            "estado": "✓ Saludable",
            "base_datos": "✓ Conectada"
        }
    except Exception as e:
        return {
            "estado": "✗ Error",
            "error": str(e)
        }

# ============================================================================
# ENDPOINTS DE ROLES
# ============================================================================

@app.get("/roles/", tags=["Roles"])
def obtener_roles(db: Session = Depends(get_db)):
    """Obtener todos los roles"""
    roles = db.query(Rols).all()
    return roles

@app.post("/roles/", tags=["Roles"])
def crear_rol(rol: SchemaRol, db: Session = Depends(get_db)):
    """Crear un nuevo rol"""
    nuevo_rol = Rols(
        description=rol.nombre,
        estatus=rol.estado
    )
    db.add(nuevo_rol)
    db.commit()
    db.refresh(nuevo_rol)
    return nuevo_rol

@app.get("/roles/{rol_id}", tags=["Roles"])
def obtener_rol(rol_id: int, db: Session = Depends(get_db)):
    """Obtener un rol por ID"""
    rol = db.query(Rols).filter(Rols.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return rol

# ============================================================================
# ENDPOINTS DE USUARIOS
# ============================================================================

@app.get("/usuarios/", response_model=List[UserRead], tags=["Usuarios"])
def obtener_usuarios(db: Session = Depends(get_db)):
    """Obtener todos los usuarios"""
    usuarios = db.query(User).all()
    return usuarios

@app.post("/usuarios/", response_model=UserRead, tags=["Usuarios"])
def crear_usuario(usuario: UserCreate, db: Session = Depends(get_db)):
    """Crear un nuevo usuario"""
    # Verificar que el rol existe
    rol = db.query(Rols).filter(Rols.id == usuario.rol_Id).first()
    if not rol:
        raise HTTPException(status_code=400, detail="Rol no existe")
    
    # Verificar que el usuario no existe
    if db.query(User).filter(User.usuario == usuario.usuario).first():
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    nuevo_usuario = User(
        rol_Id=usuario.rol_Id,
        nombre=usuario.nombre,
        papellido=usuario.papellido,
        sapellido=usuario.sapellido,
        usuario=usuario.usuario,
        contrasena=usuario.contrasena,
        telefono=usuario.telefono,
        estatus=usuario.estatus,
        fecha_registro=datetime.now(),
        fecha_modificacion=datetime.now()
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@app.get("/usuarios/{usuario_id}", response_model=UserRead, tags=["Usuarios"])
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Obtener un usuario por ID"""
    usuario = db.query(User).filter(User.Id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@app.put("/usuarios/{usuario_id}", response_model=UserRead, tags=["Usuarios"])
def actualizar_usuario(usuario_id: int, usuario_update: UserUpdate, 
                       db: Session = Depends(get_db)):
    """Actualizar un usuario"""
    usuario = db.query(User).filter(User.Id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    for key, value in usuario_update.dict(exclude_unset=True).items():
        setattr(usuario, key, value)
    
    usuario.fecha_modificacion = datetime.now()
    db.commit()
    db.refresh(usuario)
    return usuario

@app.delete("/usuarios/{usuario_id}", tags=["Usuarios"])
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """Eliminar un usuario"""
    usuario = db.query(User).filter(User.Id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    db.delete(usuario)
    db.commit()
    return {"mensaje": "Usuario eliminado"}

# ============================================================================
# ENDPOINTS DE CLIENTES
# ============================================================================

@app.get("/clientes/", response_model=List[ClienteRead], tags=["Clientes"])
def obtener_clientes(db: Session = Depends(get_db)):
    """Obtener todos los clientes"""
    clientes = db.query(Cliente).all()
    return clientes

@app.post("/clientes/", response_model=ClienteRead, tags=["Clientes"])
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    """Crear un nuevo cliente"""
    nuevo_cliente = Cliente(
        nombre=cliente.nombre,
        papellido=cliente.papellido,
        sapellido=cliente.sapellido,
        direccion=cliente.direccion,
        telefono=cliente.telefono,
        estatus=cliente.estatus,
        fecha_registro=datetime.now(),
        fecha_modificacion=datetime.now()
    )
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

# ============================================================================
# ENDPOINTS DE SERVICIOS
# ============================================================================

@app.get("/servicios/", response_model=List[ServicioRead], tags=["Servicios"])
def obtener_servicios(db: Session = Depends(get_db)):
    """Obtener todos los servicios"""
    servicios = db.query(Servicio).all()
    return servicios

@app.post("/servicios/", response_model=ServicioRead, tags=["Servicios"])
def crear_servicio(servicio: ServicioCreate, db: Session = Depends(get_db)):
    """Crear un nuevo servicio"""
    nuevo_servicio = Servicio(
        nombre=servicio.nombre,
        descripcion=servicio.descripcion,
        costo=servicio.costo,
        estatus=servicio.estatus,
        fecha_registro=datetime.now(),
        fecha_modificacion=datetime.now()
    )
    db.add(nuevo_servicio)
    db.commit()
    db.refresh(nuevo_servicio)
    return nuevo_servicio

# ============================================================================
# ENDPOINTS DE VEHÍCULOS
# ============================================================================

@app.get("/vehiculos/", response_model=List[VehiculoRead], tags=["Vehículos"])
def obtener_vehiculos(db: Session = Depends(get_db)):
    """Obtener todos los vehículos"""
    vehiculos = db.query(Vehiculo).all()
    return vehiculos

@app.post("/vehiculos/", response_model=VehiculoRead, tags=["Vehículos"])
def crear_vehiculo(vehiculo: VehiculoCreate, db: Session = Depends(get_db)):
    """Crear un nuevo vehículo"""
    # Verificar que el cliente existe
    cliente = db.query(Cliente).filter(Cliente.Id == vehiculo.cliente_Id).first()
    if not cliente:
        raise HTTPException(status_code=400, detail="Cliente no existe")
    
    # Verificar que la matrícula no existe
    if db.query(Vehiculo).filter(Vehiculo.matricula == vehiculo.matricula).first():
        raise HTTPException(status_code=400, detail="Matrícula ya existe")
    
    nuevo_vehiculo = Vehiculo(
        cliente_Id=vehiculo.cliente_Id,
        matricula=vehiculo.matricula,
        modelo=vehiculo.modelo,
        color=vehiculo.color,
        numero_del_dueno=vehiculo.numero_del_dueno,
        estatus=vehiculo.estatus,
        fecha_registro=datetime.now(),
        fecha_modificacion=datetime.now()
    )
    db.add(nuevo_vehiculo)
    db.commit()
    db.refresh(nuevo_vehiculo)
    return nuevo_vehiculo

# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║            API Autolavado - Iniciando...                   ║
    ║                                                            ║
    ║  📚 Documentación: http://localhost:8000/docs              ║
    ║  🔍 ReDoc: http://localhost:8000/redoc                     ║
    ║                                                            ║
    ║  Presiona Ctrl+C para detener                              ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
