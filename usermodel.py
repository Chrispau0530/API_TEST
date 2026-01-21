from typing import List,Optional
from uuid import UUID, uuid4
from pydantic import BaseModel 
from enum import Enum


class Genero (str,Enum):
    masculino = "Hombre"
    femenino = "Mujer"
    noBinario = "NoBinario"

class Role (str,Enum):
    admin = "admin"
    user = "user"
    invitado = "invitado"

class User(BaseModel):
    id:Optional[UUID]=None
    nombre:str
    apellidos:str
    genero:Genero
    Roles:List[Role]    

    