from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models.model_user import User
import os

# =====================================================
# 🔐 CONFIGURACIÓN JWT
# =====================================================

SECRET_KEY = os.getenv("SECRET_KEY", "CAMBIAR_ESTA_CLAVE_EN_PRODUCCION")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Usar pbkdf2_sha256 en lugar de bcrypt para evitar problemas de versión
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# =====================================================
# 🔒 HASH DE CONTRASEÑA (PBKDF2-SHA256)
# =====================================================

def hash_password(password: str) -> str:
    """
    Hashea una contraseña usando PBKDF2-SHA256.
    
    PBKDF2 es más flexible que bcrypt y no tiene límite de 72 bytes.
    Passlib maneja automáticamente el salt y las iteraciones.
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string, not " + type(password).__name__)
    
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña contra su hash.
    """
    if not isinstance(plain_password, str):
        return False
    
    return pwd_context.verify(plain_password, hashed_password)

# =====================================================
# 🎟 CREAR TOKEN JWT
# =====================================================

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# =====================================================
# 👤 OBTENER USUARIO ACTUAL
# =====================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.usuario == username).first()

    if user is None:
        raise credentials_exception

    return user

# =====================================================
# 👑 OPCIONAL: RESTRINGIR SOLO ADMIN
# =====================================================

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Solo permite usuarios con rol_Id == 1 (ADMIN)
    """
    if current_user.rol_Id != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para esta acción"
        )
    return current_user