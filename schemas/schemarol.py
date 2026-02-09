"""Schemas para Rol"""

from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class SchemaRol(BaseModel):
    """Schema base para Rol"""

    nombre: str
    descripcion: Optional[str] = None
    estado: Optional[bool] = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class RolCreate(SchemaRol):
    """Schema para crear un rol"""


class RolUpdate(SchemaRol):
    """Schema para actualizar un rol"""


class Rol(SchemaRol):
    """Schema para retornar un rol"""

    id: int

    class Config:
        orm_mode = True
