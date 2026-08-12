from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserUpdate, UserResponse, Token, ForgotPasswordRequest
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.register_user(user)

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.authenticate_user(credentials.email, credentials.password)
    auth_service = AuthService()
    token_data = {"sub": user.email, "user_id": str(user.id)}
    token = auth_service.create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/users", response_model=list)
def get_users(db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.get_all_users()

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: uuid.UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.update_user(str(user_id), user_data)

@router.delete("/users/{user_id}")
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.delete_user(str(user_id))

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)
    if user_service.check_user_exists(req.email):
        pass # In a real app, send email here.
    return {"message": "If an account with that email exists, a password reset link has been sent."}
