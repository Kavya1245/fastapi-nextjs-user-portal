import pytest
from app.schemas.user import UserCreate
from pydantic import ValidationError

class TestSchemas:
    def test_valid_user_creation(self):
        data = {"first_name": "John", "last_name": "Doe", "email": "john@example.com", "password": "Pass@123", "confirm_password": "Pass@123"}
        user = UserCreate(**data)
        assert user.first_name == "John"

    def test_invalid_firstname_numbers(self):
        with pytest.raises(ValidationError):
            UserCreate(first_name="John123", last_name="Doe", email="j@j.com", password="Pass@123", confirm_password="Pass@123")

    def test_invalid_firstname_too_long(self):
        with pytest.raises(ValidationError):
            UserCreate(first_name="A"*21, last_name="Doe", email="j@j.com", password="Pass@123", confirm_password="Pass@123")

    def test_invalid_lastname_too_long(self):
        with pytest.raises(ValidationError):
            UserCreate(first_name="John", last_name="B"*16, email="j@j.com", password="Pass@123", confirm_password="Pass@123")

    def test_weak_password_missing_symbol(self):
        with pytest.raises(ValidationError):
            UserCreate(first_name="John", last_name="Doe", email="j@j.com", password="Pass1234", confirm_password="Pass1234")

    def test_password_mismatch(self):
        with pytest.raises(ValidationError):
            UserCreate(first_name="John", last_name="Doe", email="j@j.com", password="Pass@123", confirm_password="Diff@123")
