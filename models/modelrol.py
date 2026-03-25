from sqlalchemy import Column, Integer, String, Boolean
from config.db import Base

class Rols(Base):
    __tablename__ = "tbc_roles"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(60))
    estatus = Column(Boolean)