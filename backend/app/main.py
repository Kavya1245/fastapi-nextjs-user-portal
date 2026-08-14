from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.proxy_headers import ProxyHeadersMiddleware
from app.routes.user_routes import api_router
from app.config import settings
from app.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(title="User Management System")

# Securely parse X-Forwarded-For headers from trusted proxies (like Render/Vercel)
# This ensures request.client.host contains the real user IP, not the proxy IP,
# and prevents spoofing attacks.
app.add_middleware(ProxyHeadersMiddleware(trusted_hosts="*"))

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = settings.ALLOWED_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "API Running"}
