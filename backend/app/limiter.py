from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings

# H-003 Fixed: Use Redis for distributed rate limiting
limiter = Limiter(key_func=get_remote_address, storage_uri=settings.REDIS_URL)
