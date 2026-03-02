'''
Docstring for models.serviciovehiculo
'''
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Date , ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base
class ServicioVehiculo(Base):
    ''' Docstring for ServicioVehiculo'''
    __tablename__ = "tbd_serviciovehiculo"
    Id = Column(Integer, primary_key=True, index=True)
    # ForeignKey targets must match the actual table names and primary key column names
    cajero_Id = Column(Integer, ForeignKey("tbb_users.Id"))
    lavador_Id = Column(Integer, ForeignKey("tbb_users.Id"))
    servicio_Id = Column(Integer, ForeignKey("tbc_servicio.Id"))
    vehiculo_Id = Column(Integer, ForeignKey("tbb_vehiculo.Id"))
    fecha = Column(DateTime)
    estatus = Column(Boolean)
    fecha_registro = Column(DateTime)
    fecha_modificacion = Column(DateTime)