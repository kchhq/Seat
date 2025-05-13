from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "dH9Eyz60Eg1pEc3DTr8pXlLBQ"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_minutes: int = 60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
