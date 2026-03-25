from sqlalchemy import Column, Integer, DateTime, Boolean, String
from sqlalchemy.sql import func
from config.db import Base


class Producto(Base):
    __tablename__ = "tb_productos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_registro = Column(DateTime, server_default=func.current_timestamp())
    Descuento = Column(Integer)
    Costo_Total = Column(Integer)
    estatus = Column(Boolean, default=True)
    stock = Column(Integer, default=0)
    Descripcion = Column(String(120), nullable=True)