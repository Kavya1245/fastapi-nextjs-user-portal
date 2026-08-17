import smtplib
import os
import logging
from email.message import EmailMessage

logger = logging.getLogger(__name__)

def send_password_reset_email(to_email: str, token: str):
    """Production-ready email service using standard smtplib."""
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    from_email = os.getenv("SMTP_FROM", "no-reply@userportal.com")
    
    msg = EmailMessage()
    msg["Subject"] = "Password Reset Request"
    msg["From"] = from_email
    msg["To"] = to_email
    msg.set_content(f"Use this token to reset your password: {token}")
    
    try:
        if smtp_host:
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                if smtp_user and smtp_pass:
                    server.login(smtp_user, smtp_pass)
                server.send_message(msg)
            logger.info(f"Password reset email successfully sent to {to_email}")
        else:
            logger.warning("SMTP_HOST not configured. Simulating email send.")
            print(f"Simulated Email -> To: {to_email}, Token: {token}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
