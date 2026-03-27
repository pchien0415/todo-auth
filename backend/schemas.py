from pydantic import BaseModel


class UserRegister(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class TodoCreate(BaseModel):
    text: str


class TodoResponse(BaseModel):
    id: int
    text: str
    user_id: int

    class Config:
        from_attributes = True