from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas import CreateUser, LoginUser
from database import get_db
from models import Users
from utils.auth import create_token
from datetime import datetime, timedelta
from schemas import UserInfoResponse  
from utils.auth import get_current_user

router = APIRouter()

@router.post("/signup")
def signup(user: CreateUser, db: Session = Depends(get_db)):
    now = datetime.now()
    db_user = Users(
        User_name=user.user_name,
        User_password=user.user_password,
        User_number=user.user_number,
        User_email=user.user_email,
        Total_used="0",
        Created_at=str(now),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "회원가입 완료", "user": db_user}

@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.User_email == user.user_email).first()
    if db_user is None:
        raise HTTPException(status_code=401, detail="존재하지 않는 회원입니다.")
    if db_user.User_password != user.user_password:
        raise HTTPException(status_code=401, detail="비밀번호가 틀렸습니다.")

    access_token = create_token(
        data={"user_id": db_user.User_id},
        expires_delta=timedelta(minutes=15),
    )
    return {"message": "로그인 성공", "access_token": access_token}

# 회원정보 가져오기
@router.get("/users", response_model=UserInfoResponse)
def get_my_info(current_user=Depends(get_current_user)):
    return current_user