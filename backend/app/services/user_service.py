from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.auth_service import AuthService
from app.services.redis_service import RedisService
from app.exceptions import UserNotFoundError, DuplicateEmailError

class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.auth_service = AuthService()
        self.redis_service = RedisService()

    def register_user(self, user_data: UserCreate) -> User:
        normalized_email = user_data.email.strip().lower()
        if self.db.query(User).filter(User.email == normalized_email).first():
            raise DuplicateEmailError("Email already registered")
        
        hashed_pw = self.auth_service.hash_password(user_data.password)
        db_user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=normalized_email,
            hashed_password=hashed_pw
        )
        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
        except Exception:
            self.db.rollback()
            raise
        self.redis_service.clear_user_cache()
        return db_user

    def authenticate_user(self, email: str, password: str) -> User:
        normalized_email = email.strip().lower()
        user = self.db.query(User).filter(User.email == normalized_email).first()
        if not user or not self.auth_service.verify_password(password, user.hashed_password):
            return None
        return user

    def get_all_users(self):
        cache_key = "users:all"
        cached = self.redis_service.get_cache(cache_key)
        if cached:
            return cached
            
        users = self.db.query(User).all()
        result = [{"id": str(u.id), "first_name": u.first_name, "last_name": u.last_name, "email": u.email, "created_at": str(u.created_at)} for u in users]
        self.redis_service.set_cache(cache_key, result)
        return result

    def get_user_by_id(self, user_id: str) -> User:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise UserNotFoundError(f"User {user_id} not found")
        return user

    def check_user_exists(self, email: str) -> bool:
        normalized_email = email.strip().lower()
        return self.db.query(User).filter(User.email == normalized_email).first() is not None

    def update_user(self, user_id: str, user_data: UserUpdate) -> User:
        user = self.get_user_by_id(user_id)
        
        if user_data.first_name is not None: user.first_name = user_data.first_name
        if user_data.last_name is not None: user.last_name = user_data.last_name
        if user_data.email is not None:
            normalized_email = user_data.email.strip().lower()
            if self.db.query(User).filter(User.email == normalized_email, User.id != user_id).first():
                raise DuplicateEmailError("Email already in use")
            user.email = normalized_email
            
        try:
            self.db.commit()
            self.db.refresh(user)
        except Exception:
            self.db.rollback()
            raise
        self.redis_service.clear_user_cache(user_id)
        return user

    def delete_user(self, user_id: str):
        user = self.get_user_by_id(user_id)
        try:
            self.db.delete(user)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
        self.redis_service.clear_user_cache(user_id)
        return {"message": "User deleted successfully"}
