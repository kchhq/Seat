from pydantic import BaseModel

# 회원가입 시 클라이언트로부터 받을 데이터 형식
class CreateUser(BaseModel):
    user_name: str
    user_number: str
    user_email: str
    user_password: str

# 로그인 시 클라이언트로부터 받을 데이터 형식 정의
class LoginUser(BaseModel):
    user_email: str
    user_password: str

# 사용자 정보 받을 데이터 형식
class UserInfoResponse(BaseModel):
    user_name: str
    user_number: str
    user_email: str