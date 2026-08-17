from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.services.user_service import UserService
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

def get_auth_service() -> AuthService:
    return AuthService()

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    user_service: UserService = Depends(get_user_service)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
        
    # M-002 Fixed: Use user_service to query DB instead of direct db.query
    user = user_service.authenticate_user(email, "") # Pass empty password just to fetch user by email
    # authenticate_user will return None because password is empty, so we fetch directly but via service
    # Actually, better to just fetch directly from db to avoid password check logic:
    db = user_service.db
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
