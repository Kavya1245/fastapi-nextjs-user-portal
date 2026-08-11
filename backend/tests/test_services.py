import pytest
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from app.models.user import User

class TestUserService:
    def test_email_normalization(self, client):
        # Use the test client's DB session
        from tests.conftest import TestingSessionLocal
        db = TestingSessionLocal()
        
        user_service = UserService(db)
        user_data = UserCreate(
            first_name="John", last_name="Doe", email="John@EXAMPLE.com", 
            password="Pass@123", confirm_password="Pass@123"
        )
        user = user_service.register_user(user_data)
        
        # Verify email was converted to lowercase
        assert user.email == "john@example.com"
        assert user.hashed_password != "Pass@123" # Verify password was hashed
        db.close()

    def test_duplicate_email_normalized(self, client):
        from tests.conftest import TestingSessionLocal
        db = TestingSessionLocal()
        user_service = UserService(db)
        
        # Create first user
        user_data_1 = UserCreate(first_name="John", last_name="Doe", email="John@example.com", password="Pass@123", confirm_password="Pass@123")
        user_service.register_user(user_data_1)
        
        # Try to create second user with different case
        user_data_2 = UserCreate(first_name="Jane", last_name="Doe", email="JOHN@EXAMPLE.COM", password="Pass@123", confirm_password="Pass@123")
        
        with pytest.raises(Exception) as exc_info:
            user_service.register_user(user_data_2)
        
        assert "Email already registered" in str(exc_info.value.detail)
        db.close()
