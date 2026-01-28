"""API simple con endpoints para listar, actualizar y eliminar usuarios."""
# pylint: disable=import-error

from typing import List
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException

from usermodel import Role, Genero, User

app = FastAPI()
db: List[User] = [
 User(
     id=uuid4(),
     nombre="Chris",
     apellidos="Rodriguez Perez",
    genero=Genero.MASCULINO,
    Roles=[Role.ADMIN]
 ),
  User(
     id=uuid4(),
     nombre="Daniela",
     apellidos="Leon Jimenez",
    genero=Genero.FEMENINO,
    Roles=[Role.USER]
 ),
  User(
     id=uuid4(),
     nombre="Tania",
     apellidos="Marquez Cabrera",
    genero=Genero.FEMENINO,
    Roles=[Role.ADMIN]
 ),
  User(
     id=uuid4(),
     nombre="Abril",
     apellidos="Guzman Pazos",
    genero=Genero.FEMENINO,
    Roles=[Role.INVITADO]
 ),
]

@app.get("/")
async def root():
    """Endpoint raíz que devuelve un saludo simple."""

    return {
        "Saludo": "HOLAAAA CHRIS",
    }


@app.get("/api/llenado/users")
async def get_users():
    """Devuelve la lista de usuarios en memoria."""

    return db


@app.put("/api/users/{user_id}")
async def update_user(user_id: UUID, user: User):
    """Actualiza un usuario por `user_id` con los datos proporcionados.

    Mantiene el `id` original incluso si el cuerpo lo omite o tiene otro.
    """

    for idx, u in enumerate(db):
        if u.id == user_id:
            updated = user.copy(update={"id": user_id})
            db[idx] = updated

            return {"message": "Usuario actualizado", "user": updated}

    raise HTTPException(status_code=404, detail="Usuario no encontrado")


@app.delete("/api/users/{user_id}")
async def delete_user(user_id: UUID):
    """Elimina un usuario por `user_id` si existe."""

    for idx, u in enumerate(db):
        if u.id == user_id:
            db.pop(idx)

            return {"message": "Usuario eliminado"}




    