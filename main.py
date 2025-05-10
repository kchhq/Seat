from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from models import Users
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from datetime import datetime
def create_user(db: Session, user_name: str, user_password: str,
                user_number: str, user_email: str):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db_user = Users(User_name=user_name, User_password=user_password,
                    User_number=user_number, User_email=user_email,
                    Total_used=0, Created_at=now)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_id(db: Session, user_id: int):
    return db.query(Users).filter(Users.User_id == user_id).first()


from fastapi import FastAPI
from schemas import CreateUser

app = FastAPI()

@app.post("/signup/")
def signup(user: CreateUser, db: Session = Depends(get_db)):
    db_user = create_user(db, user.user_name, user.user_password, 
                          user.user_number, user.user_email)
    return db_user