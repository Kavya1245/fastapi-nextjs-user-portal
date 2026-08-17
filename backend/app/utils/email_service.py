import logging
logger = logging.getLogger(__name__)

def send_password_reset_email(email: str, token: str):
    """Mock email service. In production, integrate SendGrid/SMTP."""
    # Simulate network delay/service call
    logger.info(f"SIMULATING EMAIL SEND -> To: {email}, Reset Token: {token}")
    print(f"Mock Email Service: Password reset link sent to {email}")
