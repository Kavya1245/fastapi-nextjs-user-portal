from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import uuid
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserUpdate, UserResponse, Token, ForgotPasswordRequest
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.limiter import limiter
from app.exceptions import UserNotFoundError, DuplicateEmailError

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=201)
@limiter.limit("5/minute")
def signup(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    try:
        return user_service.register_user(user)
    except DuplicateEmailError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
def login(request: Request, credentials: UserLogin, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.authenticate_user(credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    auth_service = AuthService()
    token_data = {"sub": user.email, "user_id": str(user.id)}
    token = auth_service.create_access_token(token_data)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

# C-003 Fixed: Removed public GET /api/users endpoint to prevent data exposure

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: uuid.UUID, 
    user_data: UserUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if str(current_user.id) != str(user_id):
        raise HTTPException(status_code=403, detail="Forbidden: You can only update your own account.")
    user_service = UserService(db)
    try:
        return user_service.update_user(str(user_id), user_data)
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except DuplicateEmailError as e:
        raise HTTPException(status_code=409, detail=str(e))

# M-012 Fixed: Changed DELETE to return 204 No Content
@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: uuid.UUID, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if str(current_user.id) != str(user_id):
        raise HTTPException(status_code=403, detail="Forbidden: You can only delete your own account.")
    user_service = UserService(db)
    try:
        user_service.delete_user(str(user_id))
    except UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    return None

@router.post("/forgot-password")
@limiter.limit("5/minute")
def forgot_password(request: Request, req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)
    if user_service.check_user_exists(req.email):
        pass # H-001: Documented stub. Email integration (e.g., SendGrid) goes here.
    return {"message": "If an account with that email exists, a password reset link has been sent."}
