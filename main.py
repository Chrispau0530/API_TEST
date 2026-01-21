from fastapi import FastAPI
from typing import List,Optional
from uuid import  UUID,uuid4
from enum import Enum
from usermodel import Role,Genero,User

app = FastAPI()
db:List[User] =[
 User(
     id=uuid4(),
     nombre="Chris",
     apellidos="Rodriguez Perez",
     genero=Genero.masculino,
     Roles=[Role.admin]
 ),
  User(
     id=uuid4(),
     nombre="Daniela",
     apellidos="Leon Jimenez",
     genero=Genero.femenino,
     Roles=[Role.user]
 ),
  User(
     id=uuid4(),
     nombre="Tania",
     apellidos="Marquez Cabrera",
     genero=Genero.femenino,
     Roles=[Role.admin]
 ),
  User(
     id=uuid4(),
     nombre="Abril",
     apellidos="Guzman Pazos",
     genero=Genero.femenino,
     Roles=[Role.invitado]
 ),
]

@app.get("/")
async def root():
    return{
        "Saludo":"HOLAAAA CHRIS"
    }

@app.get("api/llenado/users")
async def get_users():
    return db

    