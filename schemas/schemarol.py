from typing import Optional
from pydantic import BaseModel, field_validator
import json

class SchemaRol(BaseModel):
    description: str
    estatus: Optional[bool] = True

class Rol(BaseModel):
    id: int
    description: str
    estatus: Optional[bool] = True

    # ✅ Esto expone "nombre" al frontend sin tocar la DB
    @property
    def nombre(self):
        return self.description

    model_config = {"from_attributes": True}