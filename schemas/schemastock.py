from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class StockMovementCreate(BaseModel):
    cantidad: int
    tipo: str  # 'IN' or 'OUT'
    descripcion: Optional[str] = None


class StockMovementRead(BaseModel):
    Id: int
    producto_Id: int
    cantidad: int
    tipo: str
    descripcion: Optional[str] = None
    usuario_Id: Optional[int] = None
    fecha: Optional[datetime] = None

    class Config:
        from_attributes = True
