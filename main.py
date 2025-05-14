from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException
from models import Users
from database import get_db
from schemas import CreateUser, LoginUser
from auth import create_token, verify_token
from datetime import datetime, timedelta

def create_user(db: Session, user: CreateUser):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_user = Users(User_name=user.user_name, User_password=user.user_password,
                    User_number=user.user_number, User_email=user.user_email,
                    Total_used=0, Created_at=now)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_id(db: Session, user_id: int):
    return db.query(Users).filter(Users.User_id == user_id).first()

app = FastAPI()

@app.get("/")
def test():
    return {"message": "Hello World"}

@app.post("/signup/")
def signup(user: CreateUser, db: Session = Depends(get_db)):
    db_user = create_user(db, user)
    return {"message": "회원가입 완료", "user": db_user}

@app.post("/login/")
def login(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.User_email == user.user_email).first()
    
    if db_user is None:
        raise HTTPException(status_code=401, detail="존재하지 않음 회원가입 ㄱㄱ")
    elif db_user.User_password != user.uer_password:
        raise HTTPException(status_code=401, detail="비밀번호 틀림")
    
    access_token = create_token(data={"user_id": db_user.User_id},
                                expires_delta=timedelta(minutes=15))
    
    return {"message": "로그인 성공", 
            "access_token": access_token}