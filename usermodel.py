"""Modelos de datos para la API de usuarios.

Contiene enums para género y rol, y el modelo `User`.
"""

from typing import List, Optional
from uuid import UUID
from enum import Enum

# pylint: disable=import-error
from pydantic import BaseModel


class Genero(str, Enum):
    """Géneros disponibles para un usuario."""

    MASCULINO = "Hombre"
    FEMENINO = "Mujer"
    NO_BINARIO = "NoBinario"


class Role(str, Enum):
    """Roles disponibles para un usuario."""

    ADMIN = "admin"
    USER = "user"
    INVITADO = "invitado"


class User(BaseModel):
    """Modelo Pydantic que representa un usuario."""

    id: Optional[UUID] = None
    nombre: str
    apellidos: str
    genero: Genero
    Roles: List[Role]   
    