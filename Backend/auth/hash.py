# auth/hash.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 회원가입시 비밀번호를 해싱해서 db에 저장
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# 로그인시 입력한 비밀번호를 해싱해서 db에 저장된것과 비교
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)