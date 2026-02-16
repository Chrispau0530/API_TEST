"""Schemas para Servicio."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, constr


class ServicioBase(BaseModel):
    """Schema base para Servicio."""

    nombre: constr(max_length=60)
    descripcion: Optional[constr(max_length=60)] = None
    costo: int = Field(..., gt=0, description="Costo del servicio")
    estatus: Optional[bool] = True


class ServicioCreate(ServicioBase):
    """Schema para crear un Servicio."""

    pass


class ServicioUpdate(BaseModel):
    """Schema para actualizar un Servicio."""

    nombre: Optional[constr(max_length=60)] = None
    descripcion: Optional[constr(max_length=60)] = None
    costo: Optional[int] = Field(None, gt=0, description="Costo del servicio")
    estatus: Optional[bool] = None


class ServicioRead(ServicioBase):
    """Schema para retornar un Servicio."""

    Id: int
    fecha_registro: Optional[datetime] = None
    fecha_modificacion: Optional[datetime] = None

    class Config:
        orm_mode = True
