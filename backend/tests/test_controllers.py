import pytest

class TestUserControllers:
    def test_successful_signup(self, client):
        res = client.post("/api/signup", json={
            "first_name": "John", "last_name": "Doe", "email": "john@example.com",
            "password": "Pass@123", "confirm_password": "Pass@123"
        })
        assert res.status_code == 201
        assert res.json()["email"] == "john@example.com"

    def test_successful_login(self, client):
        client.post("/api/signup", json={
            "first_name": "John", "last_name": "Doe", "email": "john@example.com",
            "password": "Pass@123", "confirm_password": "Pass@123"
        })
        res = client.post("/api/login", json={"email": "john@example.com", "password": "Pass@123"})
        assert res.status_code == 200
        assert "access_token" in res.json()

    def test_login_wrong_password(self, client):
        client.post("/api/signup", json={
            "first_name": "John", "last_name": "Doe", "email": "john@example.com",
            "password": "Pass@123", "confirm_password": "Pass@123"
        })
        res = client.post("/api/login", json={"email": "john@example.com", "password": "Wrong@123"})
        assert res.status_code == 401

    def test_forgot_password_security(self, client):
        # Test with an email that does NOT exist
        res = client.post("/api/forgot-password", json={"email": "nonexistent@example.com"})
        assert res.status_code == 200
        assert res.json()["message"] == "If an account with that email exists, a password reset link has been sent."

    def test_protected_route_without_token(self, client):
        res = client.get("/api/users/me")
        assert res.status_code == 401
