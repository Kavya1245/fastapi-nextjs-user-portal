from slowapi import Limiter
from slowapi.util import get_remote_address

# Standard rate limiter. 
# Note: For production behind a proxy, ensure your server (e.g., Uvicorn/Gunicorn) 
# is configured to trust X-Forwarded-For headers so request.client.host is accurate.
limiter = Limiter(key_func=get_remote_address)
