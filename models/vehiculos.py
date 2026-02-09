'''
Docstring for models.vehiculos
'''
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Date , ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
class Vehiculo(Base):
    ''' Docstring for Vehiculo'''
    __tablename__ = "tbb_vehiculo"
    Id = Column(Integer, primary_key=True, index=True)
    cliente_Id = Column(Integer, ForeignKey("tbc_cliente.Id"))
    matricula = Column(String(60))
    modelo = Column(String(60))
    color = Column(String(60))
    numero_del_dueno = Column(String(60))
    estatus = Column(Boolean)
    fecha_registro = Column(DateTime)
    fecha_modificacion = Column(DateTime)