from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models.model_user import User
import hashlib
import os

# =====================================================
# 🔐 CONFIGURACIÓN JWT
# =====================================================

SECRET_KEY = os.getenv("SECRET_KEY", "CAMBIAR_ESTA_CLAVE_EN_PRODUCCION")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# bcrypt como algoritmo principal
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# =====================================================
# 🔒 NORMALIZAR CONTRASEÑA (SOLUCIÓN ERROR 72 BYTES)
# =====================================================

def normalize_password(password: str) -> str:
    """
    Convierte cualquier contraseña a SHA256 fijo
    evitando el límite de 72 bytes de bcrypt
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

# =====================================================
# 🔐 HASH DE CONTRASEÑA
# =====================================================

def hash_password(password: str) -> str:
    normalized = normalize_password(password)
    return pwd_context.hash(normalized)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    normalized = normalize_password(plain_password)
    return pwd_context.verify(normalized, hashed_password)

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