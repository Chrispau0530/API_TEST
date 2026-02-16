"""Schemas para ServicioVehiculo."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ServicioVehiculoBase(BaseModel):
    """Schema base para ServicioVehiculo."""

    cajero_Id: int = Field(..., description="ID del usuario cajero")
    lavador_Id: int = Field(..., description="ID del usuario lavador")
    servicio_Id: int = Field(..., description="ID del servicio")
    vehiculo_Id: int = Field(..., description="ID del vehículo")
    fecha: datetime
    estatus: Optional[bool] = True


class ServicioVehiculoCreate(ServicioVehiculoBase):
    """Schema para crear un ServicioVehiculo."""

    pass


class ServicioVehiculoUpdate(BaseModel):
    """Schema para actualizar un ServicioVehiculo."""

    cajero_Id: Optional[int] = None
    lavador_Id: Optional[int] = None
    servicio_Id: Optional[int] = None
    vehiculo_Id: Optional[int] = None
    fecha: Optional[datetime] = None
    estatus: Optional[bool] = None


class ServicioVehiculoRead(ServicioVehiculoBase):
    """Schema para retornar un ServicioVehiculo."""

    Id: int
    fecha_registro: Optional[datetime] = None
    fecha_modificacion: Optional[datetime] = None

    class Config:
        orm_mode = True
