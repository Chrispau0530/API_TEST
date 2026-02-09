" Este archivo permite conectar con la base de datos"
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQALCHEMY_DATABASE_URL = "msyql://root:1234@127.0.0.1:3306/autolavadoDB"
engine = create_engine(SQALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)
Base = declarative_base()