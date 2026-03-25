from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, Text
from sqlalchemy.sql import func
from config.db import Base


class StockMovement(Base):
    __tablename__ = 'tb_stock_movimientos'

    Id = Column(Integer, primary_key=True, autoincrement=True)
    producto_Id = Column(Integer, ForeignKey('tb_productos.id'), nullable=False)
    cantidad = Column(Integer, nullable=False)
    tipo = Column(String(10), nullable=False)  # 'IN' | 'OUT'
    descripcion = Column(Text, nullable=True)
    usuario_Id = Column(Integer, nullable=True)
    fecha = Column(DateTime, server_default=func.current_timestamp())
