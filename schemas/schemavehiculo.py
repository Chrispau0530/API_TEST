"""Schemas para Vehiculo."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, constr


class VehiculoBase(BaseModel):
    """Schema base para Vehiculo."""

    cliente_Id: int = Field(..., description="ID del cliente propietario")
    matricula: constr(max_length=60)
    modelo: constr(max_length=60)
    color: Optional[constr(max_length=60)] = None
    numero_del_dueno: Optional[constr(max_length=60)] = None
    estatus: Optional[bool] = True


class VehiculoCreate(VehiculoBase):
    """Schema para crear un Vehiculo."""

    pass


class VehiculoUpdate(BaseModel):
    """Schema para actualizar un Vehiculo."""

    cliente_Id: Optional[int] = None
    matricula: Optional[constr(max_length=60)] = None
    modelo: Optional[constr(max_length=60)] = None
    color: Optional[constr(max_length=60)] = None
    numero_del_dueno: Optional[constr(max_length=60)] = None
    estatus: Optional[bool] = None


class VehiculoRead(VehiculoBase):
    """Schema para retornar un Vehiculo."""

    Id: int
    fecha_registro: Optional[datetime] = None
    fecha_modificacion: Optional[datetime] = None

    class Config:
        from_attributes = True
