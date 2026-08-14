import pytest
from unittest.mock import MagicMock, patch
from app.services.user_service import UserService
from app.schemas.user import UserCreate
from app.exceptions import DuplicateEmailError

class TestUserService:
    @pytest.fixture
    def mock_db(self):
        return MagicMock()

    @pytest.fixture
    def user_data(self):
        return UserCreate(first_name="John", last_name="Doe", email="John@EXAMPLE.com", password="Pass@123", confirm_password="Pass@123")

    def test_email_normalization(self, mock_db, user_data):
        mock_db.query.return_value.filter.return_value.first.return_value = None
        service = UserService(mock_db)
        
        with patch.object(service.auth_service, 'hash_password', return_value="hashed_pw"), \
             patch.object(service.redis_service, 'clear_user_cache'):
            result = service.register_user(user_data)
            assert result.email == "john@example.com"
            mock_db.add.assert_called_once()
            mock_db.commit.assert_called_once()

    def test_duplicate_email_normalized(self, mock_db, user_data):
        mock_db.query.return_value.filter.return_value.first.return_value = MagicMock()
        service = UserService(mock_db)
        
        # Assert DuplicateEmailError is raised (not HTTPException)
        with pytest.raises(DuplicateEmailError) as exc_info:
            service.register_user(user_data)
        
        assert "Email already registered" in str(exc_info.value)
