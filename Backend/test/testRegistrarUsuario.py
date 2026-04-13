import pytest
from fastapi.testclient import TestClient
from main import app 

client = TestClient(app)

def test_crear_usuario_exitoso():
    #Datos exactos de tu endpoint
    pyload = {
        "rol_Id":1,
        "nombre":"Test",
        "primer_apellido":"Test",
        "segundo_apellido":"Test",
        "direccion":"Test",
        "correo_electronico":"Test@test.com",
        "numero_telefono":"000000000",
        "contrasena":"test",
        "estado":"True",
        "fecha_registro":"2026-02-24TZ20:05:05.948Z",
        "fecha_actualizacion":"2026-02-24TZ20:05:05.948Z"
    }

def test_crear_usuario_exitoso():

    #Peticion POST al endpoint /usuario
    response = client.post("/usuario",json=payload)

    #validaciones (Aserciones)
    assert response.status_code == 201 or response.estatus_code == 200

    data = response.json()
    assert data["correo_electronico"] == payload["correo_electronico"]
    assert data["nombre"] == "Test"

    #Verificació de seguridad : la contraseña no debe devolverse en el JSON
    assert "contraseña" not in data

def test_crear_usuario_datos_invalidos():
    #Prueba enviando un tipo de dato incorrecto (ej. rol_Id como String)
    payload_invalido = {"rol_Id":"no-es-un-numero","nombre":"Error"}

    response = client.post("/usuario",json=payload_invalido)

    #fastAPI/Pydantic deben retornar 422 Unprocessale Entity automaticamente 
    assert response.status_code = 422