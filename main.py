# uvicorn main:app --reload 데베랑 fastapi연결 테스트 (터미널)
#

from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from db import SessionLocal, Base, engine
from models import User  # ← User 테이블 예시로 테스트

app = FastAPI()

# DB 세션 생성 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 테스트용 루트 엔드포인트
@app.get("/")
def read_root(db: Session = Depends(get_db)):
    # User 테이블에서 첫 번째 사용자 조회 (없으면 None)
    user = db.query(User).first()
    return {"msg": "DB 연결 성공!", "example_user": user.USER_id if user else "사용자 없음"}
