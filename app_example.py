"""
API Autolavado - CRUD COMPLETO + Seguridad JWT
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date

# DB
from database import get_db
from db_utils import initialize_database, test_connection

# Modelos
from models.modelrol import Rols
from models.model_user import User
from models.modelcliente import Cliente
from models.modelservicio import Servicio
from models.vehiculos import Vehiculo
from models.modelproducto import Producto

# Seguridad
from security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

# Schemas
from schemas.schemarol import SchemaRol, Rol
from schemas.schemauser import UserCreate, UserUpdate, UserRead
from schemas.schemacliente import ClienteCreate, ClienteUpdate, ClienteRead
from schemas.schemaservicio import ServicioCreate, ServicioUpdate, ServicioRead
from schemas.schemavehiculo import VehiculoCreate, VehiculoUpdate, VehiculoRead
from schemas.schemaproductos import ProductoCreate, ProductoUpdate, ProductoRead

# ======================================================
# APP CONFIG
# ======================================================

app = FastAPI(title="API Autolavado CRUD Completo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# STARTUP
# ======================================================

@app.on_event("startup")
def startup():
    if test_connection():
        initialize_database()

# ======================================================
# LOGIN
# ======================================================

@app.post("/login", tags=["Autenticación"])
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.usuario == form_data.username).first()

    if not user or not verify_password(form_data.password, user.contrasena):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    token = create_access_token(data={"sub": user.usuario})
    return {"access_token": token, "token_type": "bearer"}

# ======================================================
# ROLES CRUD
# ======================================================

@app.get("/roles/", response_model=List[Rol], tags=["Roles"])
def get_roles(db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    return db.query(Rols).all()


@app.get("/roles/{id}", response_model=Rol, tags=["Roles"])
def get_rol(id: int, db: Session = Depends(get_db),
            current_user: User = Depends(get_current_user)):
    rol = db.query(Rols).filter(Rols.id == id).first()
    if not rol:
        raise HTTPException(404, "Rol no encontrado")
    return rol


@app.post("/roles/", response_model=Rol, tags=["Roles"])
def create_rol(rol: SchemaRol, db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    nuevo = Rols(nombre=rol.nombre, descripcion=rol.descripcion, estado=rol.estado)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/roles/{id}", response_model=Rol, tags=["Roles"])
def update_rol(id: int, rol_data: SchemaRol,
               db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    rol = db.query(Rols).filter(Rols.id == id).first()
    if not rol:
        raise HTTPException(404, "Rol no encontrado")

    rol.nombre = rol_data.nombre
    rol.descripcion = rol_data.descripcion
    rol.estado = rol_data.estado
    db.commit()
    db.refresh(rol)
    return rol


@app.delete("/roles/{id}", tags=["Roles"])
def delete_rol(id: int,
               db: Session = Depends(get_db),
               current_user: User = Depends(get_current_user)):
    rol = db.query(Rols).filter(Rols.id == id).first()
    if not rol:
        raise HTTPException(404, "Rol no encontrado")

    db.delete(rol)
    db.commit()
    return {"mensaje": "Rol eliminado"}

# ======================================================
# USUARIOS CRUD
# ======================================================

@app.get("/usuarios/", response_model=List[UserRead], tags=["Usuarios"])
def get_users(db: Session = Depends(get_db),
              current_user: User = Depends(get_current_user)):
    return db.query(User).all()


# =====================================================
# 📌 OBTENER USUARIO POR ID
# =====================================================

@app.get("/usuarios/{id}", response_model=UserRead, tags=["Usuarios"])
def get_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.Id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return user


# =====================================================
# 📌 CREAR USUARIO
# =====================================================

@app.post("/usuarios/", response_model=UserRead, tags=["Usuarios"])
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # 🔍 Verificar si el usuario ya existe
    existing_user = db.query(User).filter(User.usuario == user.usuario).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está registrado"
        )

    # 🔐 Validar que la contraseña es un string válido
    if not isinstance(user.contrasena, str) or len(user.contrasena) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña debe ser un string no vacío"
        )

    # 🔐 Hashear contraseña
    try:
        hashed_password = hash_password(user.contrasena)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al procesar la contraseña: {str(e)}"
        )

    nuevo_usuario = User(
        rol_Id=user.rol_Id,
        nombre=user.nombre,
        papellido=user.papellido,
        sapellido=user.sapellido,
        usuario=user.usuario,
        telefono=user.telefono,
        estatus=user.estatus,
        contrasena=hashed_password
    )

    try:
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el usuario: {str(e)}"
        )

    return nuevo_usuario

@app.put("/usuarios/{id}", response_model=UserRead, tags=["Usuarios"])
def update_user(id: int, data: UserUpdate,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.Id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    update_data = data.dict(exclude_unset=True)

    if "contrasena" in update_data:
        update_data["contrasena"] = hash_password(update_data["contrasena"])

    for key, value in update_data.items():
        setattr(user, key, value)

    user.fecha_modificacion = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


@app.delete("/usuarios/{id}", tags=["Usuarios"])
def delete_user(id: int,
                db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    user = db.query(User).filter(User.Id == id).first()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    db.delete(user)
    db.commit()
    return {"mensaje": "Usuario eliminado"}

# ======================================================
# CLIENTES CRUD
# ======================================================

@app.get("/clientes/", response_model=List[ClienteRead], tags=["Clientes"])
def get_clientes(db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    return db.query(Cliente).all()


@app.get("/clientes/{id}", response_model=ClienteRead, tags=["Clientes"])
def get_cliente(id: int, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
    cliente = db.query(Cliente).filter(Cliente.Id == id).first()
    if not cliente:
        raise HTTPException(404, "Cliente no encontrado")
    return cliente


@app.post("/clientes/", response_model=ClienteRead, tags=["Clientes"])
def create_cliente(cliente: ClienteCreate,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    nuevo = Cliente(
        nombre=cliente.nombre,
        papellido=cliente.papellido,
        sapellido=cliente.sapellido,
        direccion=cliente.direccion,
        telefono=cliente.telefono,
        estatus=cliente.estatus,
        fecha_registro=datetime.utcnow(),
        fecha_modificacion=datetime.utcnow()
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/clientes/{id}", response_model=ClienteRead, tags=["Clientes"])
def update_cliente(id: int, data: ClienteUpdate,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    cliente = db.query(Cliente).filter(Cliente.Id == id).first()
    if not cliente:
        raise HTTPException(404, "Cliente no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(cliente, key, value)

    cliente.fecha_modificacion = datetime.utcnow()
    db.commit()
    db.refresh(cliente)
    return cliente


@app.delete("/clientes/{id}", tags=["Clientes"])
def delete_cliente(id: int,
                   db: Session = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    cliente = db.query(Cliente).filter(Cliente.Id == id).first()
    if not cliente:
        raise HTTPException(404, "Cliente no encontrado")

    db.delete(cliente)
    db.commit()
    return {"mensaje": "Cliente eliminado"}

# ======================================================
# SERVICIOS CRUD
# ======================================================

@app.get("/servicios/", response_model=List[ServicioRead], tags=["Servicios"])
def get_servicios(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    return db.query(Servicio).all()


@app.get("/servicios/{id}", response_model=ServicioRead, tags=["Servicios"])
def get_servicio(id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    servicio = db.query(Servicio).filter(Servicio.Id == id).first()
    if not servicio:
        raise HTTPException(404, "Servicio no encontrado")
    return servicio


@app.post("/servicios/", response_model=ServicioRead, tags=["Servicios"])
def create_servicio(servicio: ServicioCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    nuevo = Servicio(
        nombre=servicio.nombre,
        descripcion=servicio.descripcion,
        costo=servicio.costo,
        estatus=servicio.estatus,
        fecha_registro=datetime.utcnow(),
        fecha_modificacion=datetime.utcnow()
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/servicios/{id}", response_model=ServicioRead, tags=["Servicios"])
def update_servicio(id: int, data: ServicioUpdate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    servicio = db.query(Servicio).filter(Servicio.Id == id).first()
    if not servicio:
        raise HTTPException(404, "Servicio no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(servicio, key, value)

    servicio.fecha_modificacion = datetime.utcnow()
    db.commit()
    db.refresh(servicio)
    return servicio


@app.delete("/servicios/{id}", tags=["Servicios"])
def delete_servicio(id: int,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    servicio = db.query(Servicio).filter(Servicio.Id == id).first()
    if not servicio:
        raise HTTPException(404, "Servicio no encontrado")

    db.delete(servicio)
    db.commit()
    return {"mensaje": "Servicio eliminado"}

# ======================================================
# VEHICULOS CRUD
# ======================================================

@app.get("/vehiculos/", response_model=List[VehiculoRead], tags=["Vehículos"])
def get_vehiculos(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    return db.query(Vehiculo).all()


@app.get("/vehiculos/{id}", response_model=VehiculoRead, tags=["Vehículos"])
def get_vehiculo(id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == id).first()
    if not vehiculo:
        raise HTTPException(404, "Vehículo no encontrado")
    return vehiculo


@app.post("/vehiculos/", response_model=VehiculoRead, tags=["Vehículos"])
def create_vehiculo(vehiculo: VehiculoCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    nuevo = Vehiculo(
        cliente_Id=vehiculo.cliente_Id,
        matricula=vehiculo.matricula,
        modelo=vehiculo.modelo,
        color=vehiculo.color,
        numero_del_dueno=vehiculo.numero_del_dueno,
        estatus=vehiculo.estatus,
        fecha_registro=datetime.utcnow(),
        fecha_modificacion=datetime.utcnow()
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/vehiculos/{id}", response_model=VehiculoRead, tags=["Vehículos"])
def update_vehiculo(id: int, data: VehiculoUpdate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == id).first()
    if not vehiculo:
        raise HTTPException(404, "Vehículo no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(vehiculo, key, value)

    vehiculo.fecha_modificacion = datetime.utcnow()
    db.commit()
    db.refresh(vehiculo)
    return vehiculo


@app.delete("/vehiculos/{id}", tags=["Vehículos"])
def delete_vehiculo(id: int,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == id).first()
    if not vehiculo:
        raise HTTPException(404, "Vehículo no encontrado")

    db.delete(vehiculo)
    db.commit()
    return {"mensaje": "Vehículo eliminado"}

# ======================================================
# PRODUCTOS CRUD
# ======================================================

@app.get("/productos/", response_model=List[ProductoRead], tags=["Productos"])
def get_productos(db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    return db.query(Producto).all()


@app.get("/productos/{id}", response_model=ProductoRead, tags=["Productos"])
def get_producto(id: int, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")
    return producto


@app.post("/productos/", response_model=ProductoRead, tags=["Productos"])
def create_producto(producto: ProductoCreate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    nuevo = Producto(
        Descuento=producto.Descuento,
        Costo_Total=producto.Costo_Total,
        estatus=producto.estatus
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/productos/{id}", response_model=ProductoRead, tags=["Productos"])
def update_producto(id: int, data: ProductoUpdate,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(producto, key, value)

    db.commit()
    db.refresh(producto)
    return producto


@app.delete("/productos/{id}", tags=["Productos"])
def delete_producto(id: int,
                    db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}

# ======================================================
# SERVICIOS DETALLADOS - ENDPOINT ESPECIAL
# ======================================================

# Schema para respuesta detallada del servicio
from pydantic import BaseModel

class ServicioDetalleResponse(BaseModel):
    """Schema para retornar detalles completos del servicio"""
    servicio_id: int
    nombre_cajero: str
    nombre_operativo: str  # Nombre del lavador
    costo_servicio: int
    modelo_vehiculo: str
    placas_vehiculo: str
    color_vehiculo: str
    costo_total: int
    fecha_servicio: datetime


@app.get("/servicios-detalle/", response_model=List[ServicioDetalleResponse], tags=["Servicios"])
def get_servicios_detalle(
    fecha: date = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obtiene los servicios con detalles completos filtrados por fecha.
    Si no se especifica fecha, retorna los servicios de hoy.
    
    Parámetros:
    - fecha: Fecha en formato YYYY-MM-DD (opcional, por defecto hoy)
    
    Retorna:
    - nombre_cajero: Nombre del usuario que actúa como cajero
    - nombre_operativo: Nombre del usuario que actúa como lavador
    - costo_servicio: Costo del servicio realizado
    - modelo_vehiculo: Modelo del vehículo
    - placas_vehiculo: Matrícula/placas del vehículo
    - color_vehiculo: Color del vehículo
    - costo_total: Costo total del producto/servicio
    """
    
    # Si no se especifica fecha, usar la fecha de hoy
    if fecha is None:
        fecha = date.today()
    
    # Convertir date a datetime para comparación
    from datetime import timedelta
    fecha_inicio = datetime.combine(fecha, datetime.min.time())
    fecha_fin = datetime.combine(fecha, datetime.max.time())
    
    # Usaremos una consulta directa sobre `ServicioVehiculo` para obtener los registros
    # Una consulta más simple y efectiva
    from sqlalchemy import func, and_

    servicios_list = []

    # Mejor: hacer query directa en ServicioVehiculo
    from models.serviciovehiculo import ServicioVehiculo
    from sqlalchemy import cast, String, Date
    
    servicios_detalle = db.query(ServicioVehiculo).filter(
        cast(ServicioVehiculo.fecha, Date) == fecha
    ).all()
    
    resultado = []
    
    for sv in servicios_detalle:
        # Obtener datos relacionados
        usuario_cajero = db.query(User).filter(User.Id == sv.cajero_Id).first()
        usuario_operativo = db.query(User).filter(User.Id == sv.lavador_Id).first()
        servicio = db.query(Servicio).filter(Servicio.Id == sv.servicio_Id).first()
        vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == sv.vehiculo_Id).first()
        
        # Obtener costo total del producto (si existe relación)
        # Usaremos el costo del servicio como costo_total
        costo_total = servicio.costo if servicio else 0
        
        if usuario_cajero and usuario_operativo and servicio and vehiculo:
            resultado.append(
                ServicioDetalleResponse(
                    servicio_id=sv.Id,
                    nombre_cajero=usuario_cajero.nombre,
                    nombre_operativo=usuario_operativo.nombre,
                    costo_servicio=servicio.costo,
                    modelo_vehiculo=vehiculo.modelo,
                    placas_vehiculo=vehiculo.matricula,
                    color_vehiculo=vehiculo.color,
                    costo_total=costo_total,
                    fecha_servicio=sv.fecha
                )
            )
    
    return resultado