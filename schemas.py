from pydantic import BaseModel

class CreateUser(BaseModel):
    user_name: str
    user_number: str
    user_email: str
    user_password: str