# 테이블 생성 #
# init_db.py

from db import Base, engine
from models import *

# 실제 DB에 테이블 생성
Base.metadata.create_all(bind=engine)
