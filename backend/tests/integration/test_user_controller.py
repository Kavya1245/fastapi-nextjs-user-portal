import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime
from app.main import app
from app.models.user import User
import uuid

class TestUserControllers:
    @pytest.fixture
    def client(self):
        return TestClient(app)

    @patch('app.controllers.user_controller.UserService')
    def test_successful_signup(self, mock_user_service_class, client):
        mock_service = mock_user_service_class.return_value
        # Provide a valid datetime object to satisfy UserResponse schema
        mock_user = User(id=uuid.uuid4(), first_name="John", last_name="Doe", email="john@example.com", hashed_password="hash", created_at=datetime.now())
        mock_service.register_user.return_value = mock_user

        res = client.post("/api/signup", json={
            "first_name": "John", "last_name": "Doe", "email": "john@example.com",
            "password": "Pass@123", "confirm_password": "Pass@123"
        })
        
        assert res.status_code == 201
        assert res.json()["email"] == "john@example.com"

    @patch('app.controllers.user_controller.UserService')
    def test_forgot_password_security(self, mock_user_service_class, client):
        mock_service = mock_user_service_class.return_value
        mock_service.check_user_exists.return_value = False # Simulate email not in DB
        
        res = client.post("/api/forgot-password", json={"email": "nonexistent@example.com"})
        
        # Even though email doesn't exist, API must return 200 OK with generic message
        assert res.status_code == 200
        assert res.json()["message"] == "If an account with that email exists, a password reset link has been sent."

    def test_protected_route_without_token(self, client):
        res = client.get("/api/users/me")
        assert res.status_code == 401
