"""
Ejemplos de operaciones CRUD (Create, Read, Update, Delete)
usando SQLAlchemy con los modelos del proyecto.
"""

from sqlalchemy.orm import Session
from datetime import datetime


# Importar modelos
from models.model_user import User
from models.modelcliente import Cliente
from models.modelrol import Rols
from models.modelservicio import Servicio
from models.vehiculos import Vehiculo
from models.serviciovehiculo import ServicioVehiculo
from models.modelproducto import Producto


# Importar base de datos
from database import SessionLocal


# ==================== OPERACIONES CON ROLES ====================

class RolOperations:
    """Operaciones CRUD para Roles"""
    
    @staticmethod
    def crear_rol(db: Session, description: str, estatus: bool = True) -> Rols:
        """Crear un nuevo rol"""
        nuevo_rol = Rols(description=description, estatus=estatus)
        db.add(nuevo_rol)
        db.commit()
        db.refresh(nuevo_rol)
        return nuevo_rol
    
    @staticmethod
    def obtener_rol(db: Session, rol_id: int) -> Rols:
        """Obtener un rol por ID"""
        return db.query(Rols).filter(Rols.id == rol_id).first()
    
    @staticmethod
    def obtener_todos_roles(db: Session):
        """Obtener todos los roles"""
        return db.query(Rols).all()
    
    @staticmethod
    def actualizar_rol(db: Session, rol_id: int, **kwargs) -> Rols:
        """Actualizar un rol"""
        rol = db.query(Rols).filter(Rols.id == rol_id).first()
        if rol:
            for key, value in kwargs.items():
                if hasattr(rol, key):
                    setattr(rol, key, value)
            db.commit()
            db.refresh(rol)
        return rol
    
    @staticmethod
    def eliminar_rol(db: Session, rol_id: int) -> bool:
        """Eliminar un rol"""
        rol = db.query(Rols).filter(Rols.id == rol_id).first()
        if rol:
            db.delete(rol)
            db.commit()
            return True
        return False







# ==================== OPERACIONES CON USUARIOS ====================
from security import hash_password
from sqlalchemy.exc import IntegrityError

class UsuarioOperations:
    """Operaciones CRUD para Usuarios"""
    
    @staticmethod
    def crear_usuario(db: Session, rol_id: int, nombre: str, papellido: str,
                     usuario: str, contrasena: str, **kwargs) -> User:
        """Crear un nuevo usuario con contraseña hasheada"""

        # Verificar si ya existe
        existing = db.query(User).filter(User.usuario == usuario).first()
        if existing:
            raise ValueError("El usuario ya existe")

        # 🔐 Hashear contraseña (máx 72 bytes)
        hashed_password = hash_password(contrasena)

        nuevo_usuario = User(
            rol_Id=rol_id,
            nombre=nombre,
            papellido=papellido,
            usuario=usuario,
            contrasena=hashed_password,
            fecha_registro=datetime.now(),
            fecha_modificacion=datetime.now(),
            **kwargs
        )

        try:
            db.add(nuevo_usuario)
            db.commit()
            db.refresh(nuevo_usuario)
        except IntegrityError:
            db.rollback()
            raise ValueError("Error de integridad en base de datos")

        return nuevo_usuario
    

    @staticmethod
    def obtener_usuario(db: Session, usuario_id: int) -> User:
        return db.query(User).filter(User.Id == usuario_id).first()
    

    @staticmethod
    def obtener_usuario_por_nombre(db: Session, usuario: str) -> User:
        return db.query(User).filter(User.usuario == usuario).first()
    

    @staticmethod
    def obtener_todos_usuarios(db: Session):
        return db.query(User).all()
    

    @staticmethod
    def actualizar_usuario(db: Session, usuario_id: int, **kwargs) -> User:
        """Actualizar usuario (si cambia contraseña, la hashea)"""

        usuario = db.query(User).filter(User.Id == usuario_id).first()
        if not usuario:
            return None

        for key, value in kwargs.items():

            if key == "contrasena":
                # 🔐 Hashear solo si no está hasheada
                if not value.startswith("$2b$"):
                    value = hash_password(value)

            if hasattr(usuario, key) and key != 'fecha_registro':
                setattr(usuario, key, value)

        usuario.fecha_modificacion = datetime.now()
        db.commit()
        db.refresh(usuario)

        return usuario
    

    @staticmethod
    def eliminar_usuario(db: Session, usuario_id: int) -> bool:
        usuario = db.query(User).filter(User.Id == usuario_id).first()
        if usuario:
            db.delete(usuario)
            db.commit()
            return True
        return False

# ==================== OPERACIONES CON CLIENTES ====================

class ClienteOperations:
    """Operaciones CRUD para Clientes"""
    
    @staticmethod
    def crear_cliente(db: Session, nombre: str, papellido: str, **kwargs) -> Cliente:
        """Crear un nuevo cliente"""
        nuevo_cliente = Cliente(
            nombre=nombre,
            papellido=papellido,
            fecha_registro=datetime.now(),
            fecha_modificacion=datetime.now(),
            **kwargs
        )
        db.add(nuevo_cliente)
        db.commit()
        db.refresh(nuevo_cliente)
        return nuevo_cliente
    
    @staticmethod
    def obtener_cliente(db: Session, cliente_id: int) -> Cliente:
        """Obtener un cliente por ID"""
        return db.query(Cliente).filter(Cliente.Id == cliente_id).first()
    
    @staticmethod
    def obtener_todos_clientes(db: Session):
        """Obtener todos los clientes"""
        return db.query(Cliente).all()
    
    @staticmethod
    def actualizar_cliente(db: Session, cliente_id: int, **kwargs) -> Cliente:
        """Actualizar un cliente"""
        cliente = db.query(Cliente).filter(Cliente.Id == cliente_id).first()
        if cliente:
            for key, value in kwargs.items():
                if hasattr(cliente, key) and key != 'fecha_registro':
                    setattr(cliente, key, value)
            cliente.fecha_modificacion = datetime.now()
            db.commit()
            db.refresh(cliente)
        return cliente
    
    @staticmethod
    def eliminar_cliente(db: Session, cliente_id: int) -> bool:
        """Eliminar un cliente"""
        cliente = db.query(Cliente).filter(Cliente.Id == cliente_id).first()
        if cliente:
            db.delete(cliente)
            db.commit()
            return True
        return False


# ==================== OPERACIONES CON SERVICIOS ====================

class ServicioOperations:
    """Operaciones CRUD para Servicios"""
    
    @staticmethod
    def crear_servicio(db: Session, nombre: str, costo: int, **kwargs) -> Servicio:
        """Crear un nuevo servicio"""
        nuevo_servicio = Servicio(
            nombre=nombre,
            costo=costo,
            fecha_registro=datetime.now(),
            fecha_modificacion=datetime.now(),
            **kwargs
        )
        db.add(nuevo_servicio)
        db.commit()
        db.refresh(nuevo_servicio)
        return nuevo_servicio
    
    @staticmethod
    def obtener_servicio(db: Session, servicio_id: int) -> Servicio:
        """Obtener un servicio por ID"""
        return db.query(Servicio).filter(Servicio.Id == servicio_id).first()
    
    @staticmethod
    def obtener_todos_servicios(db: Session):
        """Obtener todos los servicios"""
        return db.query(Servicio).all()
    
    @staticmethod
    def actualizar_servicio(db: Session, servicio_id: int, **kwargs) -> Servicio:
        """Actualizar un servicio"""
        servicio = db.query(Servicio).filter(Servicio.Id == servicio_id).first()
        if servicio:
            for key, value in kwargs.items():
                if hasattr(servicio, key) and key != 'fecha_registro':
                    setattr(servicio, key, value)
            servicio.fecha_modificacion = datetime.now()
            db.commit()
            db.refresh(servicio)
        return servicio
    
    @staticmethod
    def eliminar_servicio(db: Session, servicio_id: int) -> bool:
        """Eliminar un servicio"""
        servicio = db.query(Servicio).filter(Servicio.Id == servicio_id).first()
        if servicio:
            db.delete(servicio)
            db.commit()
            return True
        return False


# ==================== OPERACIONES CON VEHÍCULOS ====================

class VehiculoOperations:
    """Operaciones CRUD para Vehículos"""
    
    @staticmethod
    def crear_vehiculo(db: Session, cliente_id: int, matricula: str, 
                      modelo: str, **kwargs) -> Vehiculo:
        """Crear un nuevo vehículo"""
        nuevo_vehiculo = Vehiculo(
            cliente_Id=cliente_id,
            matricula=matricula,
            modelo=modelo,
            fecha_registro=datetime.now(),
            fecha_modificacion=datetime.now(),
            **kwargs
        )
        db.add(nuevo_vehiculo)
        db.commit()
        db.refresh(nuevo_vehiculo)
        return nuevo_vehiculo
    
    @staticmethod
    def obtener_vehiculo(db: Session, vehiculo_id: int) -> Vehiculo:
        """Obtener un vehículo por ID"""
        return db.query(Vehiculo).filter(Vehiculo.Id == vehiculo_id).first()
    
    @staticmethod
    def obtener_vehiculo_por_matricula(db: Session, matricula: str) -> Vehiculo:
        """Obtener un vehículo por matrícula"""
        return db.query(Vehiculo).filter(Vehiculo.matricula == matricula).first()
    
    @staticmethod
    def obtener_vehiculos_cliente(db: Session, cliente_id: int):
        """Obtener todos los vehículos de un cliente"""
        return db.query(Vehiculo).filter(Vehiculo.cliente_Id == cliente_id).all()
    
    @staticmethod
    def actualizar_vehiculo(db: Session, vehiculo_id: int, **kwargs) -> Vehiculo:
        """Actualizar un vehículo"""
        vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == vehiculo_id).first()
        if vehiculo:
            for key, value in kwargs.items():
                if hasattr(vehiculo, key) and key != 'fecha_registro':
                    setattr(vehiculo, key, value)
            vehiculo.fecha_modificacion = datetime.now()
            db.commit()
            db.refresh(vehiculo)
        return vehiculo
    
    @staticmethod
    def eliminar_vehiculo(db: Session, vehiculo_id: int) -> bool:
        """Eliminar un vehículo"""
        vehiculo = db.query(Vehiculo).filter(Vehiculo.Id == vehiculo_id).first()
        if vehiculo:
            db.delete(vehiculo)
            db.commit()
            return True
        return False


# ==================== OPERACIONES CON SERVICIOS DE VEHÍCULOS ====================

class ServicioVehiculoOperations:
    """Operaciones CRUD para Servicios de Vehículos"""
    
    @staticmethod
    def crear_servicio_vehiculo(db: Session, cajero_id: int, lavador_id: int,
                               servicio_id: int, vehiculo_id: int, 
                               fecha: datetime, **kwargs) -> ServicioVehiculo:
        """Crear un nuevo registro de servicio de vehículo"""
        nuevo_registro = ServicioVehiculo(
            cajero_Id=cajero_id,
            lavador_Id=lavador_id,
            servicio_Id=servicio_id,
            vehiculo_Id=vehiculo_id,
            fecha=fecha,
            fecha_registro=datetime.now(),
            fecha_modificacion=datetime.now(),
            **kwargs
        )
        db.add(nuevo_registro)
        db.commit()
        db.refresh(nuevo_registro)
        return nuevo_registro
    
    @staticmethod
    def obtener_servicio_vehiculo(db: Session, registro_id: int) -> ServicioVehiculo:
        """Obtener un registro por ID"""
        return db.query(ServicioVehiculo).filter(ServicioVehiculo.Id == registro_id).first()
    
    @staticmethod
    def obtener_servicios_vehiculo(db: Session, vehiculo_id: int):
        """Obtener todos los servicios de un vehículo"""
        return db.query(ServicioVehiculo).filter(
            ServicioVehiculo.vehiculo_Id == vehiculo_id
        ).all()
    
    @staticmethod
    def actualizar_servicio_vehiculo(db: Session, registro_id: int, **kwargs) -> ServicioVehiculo:
        """Actualizar un registro"""
        registro = db.query(ServicioVehiculo).filter(
            ServicioVehiculo.Id == registro_id
        ).first()
        if registro:
            for key, value in kwargs.items():
                if hasattr(registro, key) and key != 'fecha_registro':
                    setattr(registro, key, value)
            registro.fecha_modificacion = datetime.now()
            db.commit()
            db.refresh(registro)
        return registro
    
    @staticmethod
    def eliminar_servicio_vehiculo(db: Session, registro_id: int) -> bool:
        """Eliminar un registro"""
        registro = db.query(ServicioVehiculo).filter(
            ServicioVehiculo.Id == registro_id
        ).first()
        if registro:
            db.delete(registro)
            db.commit()
            return True
        return False

 #==================Operaciones con Producto 
 class ProductoOperations:
    """Operaciones CRUD para Productos"""
    
    @staticmethod
    def crear_producto(db: Session, Descuento: int, Costo_Total: int, estatus: bool = True) -> Producto:
        """Crear un nuevo producto"""
        nuevo_producto = Producto(
            Descuento=Descuento,
            Costo_Total=Costo_Total,
            estatus=estatus
        )
        db.add(nuevo_producto)
        db.commit()
        db.refresh(nuevo_producto)
        return nuevo_producto
    

    @staticmethod
    def obtener_producto(db: Session, producto_id: int) -> Producto:
        """Obtener un producto por ID"""
        return db.query(Producto).filter(Producto.id == producto_id).first()
    

    @staticmethod
    def obtener_todos_productos(db: Session):
        """Obtener todos los productos"""
        return db.query(Producto).all()
    

    @staticmethod
    def actualizar_producto(db: Session, producto_id: int, **kwargs) -> Producto:
        """Actualizar un producto"""
        producto = db.query(Producto).filter(Producto.id == producto_id).first()
        
        if producto:
            for key, value in kwargs.items():
                if hasattr(producto, key) and key != 'fecha_registro':
                    setattr(producto, key, value)
            
            db.commit()
            db.refresh(producto)
        
        return producto
    

    @staticmethod
    def eliminar_producto(db: Session, producto_id: int) -> bool:
        """Eliminar un producto"""
        producto = db.query(Producto).filter(Producto.id == producto_id).first()
        
        if producto:
            db.delete(producto)
            db.commit()
            return True
        
        return False
# ==================== EJEMPLO DE USO ====================

if __name__ == "__main__":
    # Obtener sesión
    db = SessionLocal()
    
    try:
        # Ejemplo: Crear un rol
        # rol = RolOperations.crear_rol(db, "Administrador")
        # print(f"Rol creado: {rol.id} - {rol.description}")
        
        # Ejemplo: Obtener todos los roles
        # roles = RolOperations.obtener_todos_roles(db)
        # for rol in roles:
        #     print(f"{rol.id}: {rol.description}")
        
        print("✓ Módulo de operaciones CRUD cargado correctamente")
        print("Importa las clases para usarlas en tu aplicación")
        
    finally:
        db.close()
