"""Pydantic schemas for Producto."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ProductoBase(BaseModel):
    """Base schema with common Producto fields."""

    Descuento: Optional[int] = None
    Costo_Total: int
    Descripcion: Optional[str] = None
    estatus: Optional[bool] = True
    stock: Optional[int] = 0


class ProductoCreate(ProductoBase):
    """Schema used when creating a new Producto."""

    pass


class ProductoUpdate(BaseModel):
    """Schema used when updating an existing Producto."""
    Descripcion: Optional[str] = None
    Descuento: Optional[int] = None
    Costo_Total: Optional[int] = None
    estatus: Optional[bool] = None
    stock: Optional[int] = None


class ProductoRead(ProductoBase):
    """Schema returned when reading a Producto from the API/DB."""

    id: int
    fecha_registro: Optional[datetime] = None
    
    class Config:
        from_attributes = True