from pydantic import BaseModel

class CreateUser(BaseModel):
    user_name: str
    user_number: str
    user_email: str
    user_password: str

class LoginUser(BaseModel):
    user_email: str
    uer_password: str