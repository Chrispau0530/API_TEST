from sqlalchemy import Column, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Producto(Base):
    __tablename__ = "tb_productos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha_registro = Column(DateTime, server_default=func.current_timestamp())
    Descuento = Column(Integer)
    Costo_Total = Column(Integer)
    estatus = Column(Boolean, default=True)