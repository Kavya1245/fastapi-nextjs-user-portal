import pytest
from unittest.mock import MagicMock, patch
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from fastapi import HTTPException

class TestUserService:
    @pytest.fixture
    def mock_db(self):
        return MagicMock()

    @pytest.fixture
    def user_data(self):
        return UserCreate(first_name="John", last_name="Doe", email="John@EXAMPLE.com", password="Pass@123", confirm_password="Pass@123")

    def test_email_normalization(self, mock_db, user_data):
        # Mock DB query to return None (no existing user)
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        service = UserService(mock_db)
        
        # Patch the auth and redis services to isolate UserService logic
        with patch.object(service.auth_service, 'hash_password', return_value="hashed_pw"), \
             patch.object(service.redis_service, 'clear_user_cache'):
            
            result = service.register_user(user_data)
            
            # Assert email was lowercased
            assert result.email == "john@example.com"
            # Assert DB add and commit were called
            mock_db.add.assert_called_once()
            mock_db.commit.assert_called_once()

    def test_duplicate_email_normalized(self, mock_db, user_data):
        # Mock DB query to return an existing user (simulating duplicate)
        mock_db.query.return_value.filter.return_value.first.return_value = MagicMock()
        
        service = UserService(mock_db)
        
        # Assert HTTPException is raised
        with pytest.raises(HTTPException) as exc_info:
            service.register_user(user_data)
        
        assert exc_info.value.status_code == 400
        assert "Email already registered" in exc_info.value.detail
