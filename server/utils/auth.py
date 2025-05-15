from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from models import Users
from database import get_db 
import os
from dotenv import load_dotenv

load_dotenv()  # .env 파일 로드

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY가 설정되어 있지 않습니다.")

# JWT 알고리즘 (HS256: 대칭 키 방식)
ALGORITHM = "HS256"

# 토츤 유지 시간 (분단위)
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))


# JWT 액세스 토큰 생성 함수
def create_token(data: dict, expires_delta: timedelta = None):

    to_encode = data.copy() # 원본 data 훼손 방지를 위해 복사

    # 토큰 만료 시간 계산
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire}) # 만료 시간(exp) 정보를 토큰에 추가
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) #JWT 인코딩
    return encoded_jwt

# JWT 토큰 검증 함수
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None # 유효하지 않거나 만료된 토큰


 # 클라이언트가 토큰을 발급받는 경로
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login") 

# 현재 로그인한 유저 정보를 가져오는 함수
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    
    # 전달받은 토큰을 검증하고, 내부 payload(데이터)를 추출
    payload = verify_token(token)

     # 토큰이 유효하지 않거나 디코딩에 실패한 경우 (예: 만료, 위조 등) -> 에러 처리
    if payload is None:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")

    # 토큰 payload에서 사용자 ID 추출
    user_id: Optional[int] = payload.get("user_id")

     # 사용자 ID가 토큰에 없다면 인증 실패로 간주
    if user_id is None:
        raise HTTPException(status_code=401, detail="토큰에 사용자 ID가 없습니다.")

     # 데이터베이스에서 해당 ID의 사용자 정보를 조회
    user = db.query(Users).filter(Users.id == user_id).first()

    # 사용자가 DB에 존재하지 않으면 에러 반환
    if user is None:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    # 모든 검증이 완료되었을 경우, 사용자 정보를 반환
    return user