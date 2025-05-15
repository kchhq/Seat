# 로그인 시에 액세스 토큰 발급 (유효기간 KST 기준 60분)
from jose import jwt
from datetime import datetime, timedelta, timezone, timedelta

SECRET_KEY = "dH9Eyz60Eg1pEc3DTr8pXlLBQ"
REFRESH_SECRET_KEY = "dH9Eyz60Eg1pEc3DTr8pXlLBQ_refresh"  # 다른 시크릿 추천
ALGORITHM = "HS256"

KST = timezone(timedelta(hours=9)) # KST == UTC + 9

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.now(KST) + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_days: int = 7):
    to_encode = data.copy()
    expire = datetime.now(KST) + timedelta(days=expires_days)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
