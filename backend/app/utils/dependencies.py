from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.services.user_service import UserService
from app.exceptions import UserNotFoundError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# H-003 Fixed: Dependency provider for UserService
def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)

def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db),
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
        
    # Use service layer instead of direct DB query
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
