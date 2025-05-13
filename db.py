from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# DB 접속 URL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://BackM:zkfkapf81429@localhost/SEATWEB"

# BackM계정으로 SEATWEB 접속
# SQLALCHEMY_DATABASE_URL = "mysql+pymysql://BackM:zkfkapf81429@localhost/SEATWEB"

# DB 연결 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# 세션 클래스 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ORM 모델들이 상속할 베이스 클래스
Base = declarative_base()
