from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth_service import AuthService
from app.services.redis_service import RedisService

class UserService:
    """Handles User CRUD operations and business logic."""
    
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService()
        self.redis_service = RedisService()

    def register_user(self, user_data: UserCreate) -> User:
        # Normalize email to lowercase to prevent case-sensitivity duplicates
        normalized_email = user_data.email.strip().lower()
        
        if self.db.query(User).filter(User.email == normalized_email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_pw = self.auth_service.hash_password(user_data.password)
        
        db_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=normalized_email,
            hashed_password=hashed_pw
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        self.redis_service.clear_user_cache()
        return db_user

    def authenticate_user(self, email: str, password: str) -> User:
        normalized_email = email.strip().lower()
        user = self.db.query(User).filter(User.email == normalized_email).first()
        
        if not user or not self.auth_service.verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return user

    def get_all_users(self):
        cache_key = "users:all"
        cached = self.redis_service.get_cache(cache_key)
        if cached:
            return cached
            
        users = self.db.query(User).all()
        result = [
            {
                "id": str(u.id), 
                "first_name": u.first_name, 
                "last_name": u.last_name, 
                "email": u.email, 
                "created_at": str(u.created_at)
            } for u in users
        ]
        self.redis_service.set_cache(cache_key, result)
        return result

    def get_user_by_id(self, user_id: str) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def get_user_by_email(self, email: str) -> User:
        normalized_email = email.strip().lower()
        user = self.db.query(User).filter(User.email == normalized_email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def update_user(self, user_id: str, user_data: UserUpdate) -> User:
        user = self.get_user_by_id(user_id)
        
        if user_data.first_name: user.first_name = user_data.first_name
        if user_data.last_name: user.last_name = user_data.last_name
        if user_data.email:
            normalized_email = user_data.email.strip().lower()
            if self.db.query(User).filter(User.email == normalized_email, User.id != user_id).first():
                raise HTTPException(status_code=400, detail="Email already in use")
            user.email = normalized_email
            
        self.db.commit()
        self.db.refresh(user)
        self.redis_service.clear_user_cache(user_id)
        return user

    def delete_user(self, user_id: str):
        user = self.get_user_by_id(user_id)
        self.db.delete(user)
        self.db.commit()
        self.redis_service.clear_user_cache(user_id)
        return {"message": "User deleted successfully"}
