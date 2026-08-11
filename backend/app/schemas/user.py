from pydantic import BaseModel, EmailStr, field_validator, UUID4, ConfigDict
from datetime import datetime
import re

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("first_name")
    def validate_first_name(cls, v):
        if not v or not v.strip():
            raise ValueError("First name is required")
        if not re.match(r"^[A-Za-z]{1,20}$", v):
            raise ValueError("First name must be 1-20 alphabets only")
        return v.strip()

    @field_validator("last_name")
    def validate_last_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Last name is required")
        if not re.match(r"^[A-Za-z]{1,15}$", v):
            raise ValueError("Last name must be 1-15 alphabets only")
        return v.strip()

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one digit")
        if not re.search(r"[@$!%*?&]", v):
            raise ValueError("Password must contain at least one special character (@$!%*?&)")
        return v

    @field_validator("confirm_password")
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: str = None
    last_name: str = None
    email: EmailStr = None

    @field_validator("first_name")
    def validate_first_name(cls, v):
        if v is not None:
            if not re.match(r"^[A-Za-z]{1,20}$", v):
                raise ValueError("First name must be 1-20 alphabets only")
        return v

    @field_validator("last_name")
    def validate_last_name(cls, v):
        if v is not None:
            if not re.match(r"^[A-Za-z]{1,15}$", v):
                raise ValueError("Last name must be 1-15 alphabets only")
        return v

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID4
    first_name: str
    last_name: str
    email: str
    created_at: datetime = None

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
