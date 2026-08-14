from pydantic import BaseModel, EmailStr, field_validator, UUID4, ConfigDict
from typing import Optional
from datetime import datetime
import json
import os
import re

VALIDATIONS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "shared", "validations.json")
with open(VALIDATIONS_PATH, "r") as f:
    VALIDATIONS = json.load(f)

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("first_name")
    def validate_first_name(cls, v):
        if not v or not v.strip(): raise ValueError("First name is required")
        if len(v) > VALIDATIONS["firstName"]["maxLength"]: raise ValueError(VALIDATIONS["firstName"]["message"])
        if not re.match(VALIDATIONS["firstName"]["regex"], v): raise ValueError(VALIDATIONS["firstName"]["message"])
        return v.strip()

    @field_validator("last_name")
    def validate_last_name(cls, v):
        if not v or not v.strip(): raise ValueError("Last name is required")
        if len(v) > VALIDATIONS["lastName"]["maxLength"]: raise ValueError(VALIDATIONS["lastName"]["message"])
        if not re.match(VALIDATIONS["lastName"]["regex"], v): raise ValueError(VALIDATIONS["lastName"]["message"])
        return v.strip()

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < VALIDATIONS["password"]["minLength"]: raise ValueError(VALIDATIONS["password"]["message"])
        if not re.match(VALIDATIONS["password"]["regex"], v): raise ValueError(VALIDATIONS["password"]["message"])
        return v

    @field_validator("confirm_password")
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]: raise ValueError("Passwords do not match")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None

    @field_validator("first_name")
    def validate_first_name(cls, v):
        if v is not None:
            if len(v) > VALIDATIONS["firstName"]["maxLength"]: raise ValueError(VALIDATIONS["firstName"]["message"])
            if not re.match(VALIDATIONS["firstName"]["regex"], v): raise ValueError(VALIDATIONS["firstName"]["message"])
        return v

    @field_validator("last_name")
    def validate_last_name(cls, v):
        if v is not None:
            if len(v) > VALIDATIONS["lastName"]["maxLength"]: raise ValueError(VALIDATIONS["lastName"]["message"])
            if not re.match(VALIDATIONS["lastName"]["regex"], v): raise ValueError(VALIDATIONS["lastName"]["message"])
        return v

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID4
    first_name: str
    last_name: str
    email: str
    created_at: Optional[datetime] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
