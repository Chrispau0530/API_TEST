"""Schemas para Cliente."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, constr


class ClienteBase(BaseModel):
    """Schema base para Cliente."""

    nombre: constr(max_length=60)
    papellido: constr(max_length=60)
    sapellido: Optional[constr(max_length=60)] = None
    direccion: Optional[constr(max_length=60)] = None
    telefono: Optional[constr(max_length=10)] = None
    estatus: Optional[bool] = True


class ClienteCreate(ClienteBase):
    """Schema para crear un Cliente."""

    pass


class ClienteUpdate(BaseModel):
    """Schema para actualizar un Cliente."""

    nombre: Optional[constr(max_length=60)] = None
    papellido: Optional[constr(max_length=60)] = None
    sapellido: Optional[constr(max_length=60)] = None
    direccion: Optional[constr(max_length=60)] = None
    telefono: Optional[constr(max_length=10)] = None
    estatus: Optional[bool] = None


class ClienteRead(ClienteBase):
    """Schema para retornar un Cliente."""

    Id: int
    fecha_registro: Optional[datetime] = None
    fecha_modificacion: Optional[datetime] = None

    class Config:
        from_attributes = True
