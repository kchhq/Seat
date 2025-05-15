# auth/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from Backend.db import get_db
from Backend.models import User
from .hash import hash_password
from pydantic import BaseModel
from typing import Optional
from .hash import verify_password
from .auth import create_access_token

router = APIRouter(prefix="/v1/auth")

class LoginRequest(BaseModel):
    USER_id: str
    USER_password: str

class SignupRequest(BaseModel):
    USER_password: str
    USER_email: str
    USER_studentid: int
    USER_name: str

@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    # 이메일 중복 확인
    existing_user = db.query(User).filter(User.USER_email == request.USER_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")

    # 비밀번호 해싱 후 저장
    new_user = User(
        USER_password=hash_password(request.USER_password),
        USER_email=request.USER_email,
        USER_studentid=request.USER_studentid,
        USER_name=request.USER_name
    )
    db.add(new_user)
    db.commit()
    return {"msg": "회원가입 성공"}


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.USER_id == request.USER_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="존재하지 않는 사용자입니다")

    if not verify_password(request.USER_password, user.USER_password):
        raise HTTPException(status_code=401, detail="비밀번호가 틀렸습니다")

    access_token = create_access_token({"sub": user.USER_id})
    return {"access_token": access_token, "token_type": "bearer"}
