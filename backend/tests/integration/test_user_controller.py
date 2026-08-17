import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime
from app.main import app
from app.models.user import User
from app.utils.dependencies import get_user_service
import uuid

class TestUserControllers:
    @pytest.fixture
    def client(self):
        return TestClient(app)

    @pytest.fixture
    def mock_user_service(self):
        # Create a mock service instance
        mock = MagicMock()
        # Override the FastAPI dependency to return our mock
        app.dependency_overrides[get_user_service] = lambda: mock
        yield mock
        # Clean up override after test
        app.dependency_overrides.clear()

    def test_successful_signup(self, client, mock_user_service):
        mock_user = User(id=uuid.uuid4(), first_name="John", last_name="Doe", email="john@example.com", hashed_password="hash", created_at=datetime.now())
        mock_user_service.register_user.return_value = mock_user

        res = client.post("/api/signup", json={
            "first_name": "John", "last_name": "Doe", "email": "john@example.com",
            "password": "Pass@123", "confirm_password": "Pass@123"
        })
        
        assert res.status_code == 201
        assert res.json()["email"] == "john@example.com"

    def test_forgot_password_security(self, client, mock_user_service):
        mock_user_service.check_user_exists.return_value = False
        
        res = client.post("/api/forgot-password", json={"email": "nonexistent@example.com"})
        
        assert res.status_code == 200
        assert res.json()["message"] == "If an account with that email exists, a password reset link has been sent."

    def test_protected_route_without_token(self, client):
        # Remove dependency override for this specific test to test real auth
        app.dependency_overrides.clear()
        res = client.get("/api/users/me")
        assert res.status_code == 401
