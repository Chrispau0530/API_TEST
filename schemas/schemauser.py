"""Pydantic schemas for User."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, constr


class UserBase(BaseModel):
	"""Base schema with common User fields."""

	rol_Id: Optional[int] = Field(None, description="ID del rol")
	nombre: Optional[constr(max_length=60)] = None
	papellido: Optional[constr(max_length=60)] = None
	sapellido: Optional[constr(max_length=60)] = None
	usuario: Optional[constr(max_length=60)] = None
	telefono: Optional[constr(max_length=10)] = None
	estatus: Optional[bool] = True


class UserCreate(UserBase):
	"""Schema used when creating a new User."""

	contrasena: constr(min_length=6, max_length=60)


class UserUpdate(BaseModel):
	"""Schema used when updating an existing User."""

	rol_Id: Optional[int] = None
	nombre: Optional[constr(max_length=60)] = None
	papellido: Optional[constr(max_length=60)] = None
	sapellido: Optional[constr(max_length=60)] = None
	usuario: Optional[constr(max_length=60)] = None
	contrasena: Optional[constr(min_length=6, max_length=60)] = None
	telefono: Optional[constr(max_length=10)] = None
	estatus: Optional[bool] = None


class UserRead(UserBase):
	"""Schema returned when reading a User from the API/DB."""

	Id: int
	fecha_registro: Optional[datetime] = None
	fecha_modificacion: Optional[datetime] = None

	class Config:
		from_attributes = True

