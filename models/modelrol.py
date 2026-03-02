from sqlalchemy import Column, Integer, String, Boolean
from config.db import Base

class Rols(Base):
    '''En este apartado se define la clase con sus atributos'''
    __tablename__ = "tbc_roles"
    id = Column(Integer, primary_key=True, index=True)
    # Use names aligned with schemas: 'nombre' and 'estado'
    nombre = Column(String(60))
    descripcion = Column(String(120))
    estado = Column(Boolean)


    