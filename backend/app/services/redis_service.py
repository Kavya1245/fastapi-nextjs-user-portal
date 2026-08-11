import json
import redis
from app.config import settings

class RedisService:
    """Handles Redis cache operations."""
    
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.cache_ttl = 300 # 5 minutes

    def set_cache(self, key: str, value, ttl: int = None):
        try:
            self.redis_client.setex(key, ttl or self.cache_ttl, json.dumps(value, default=str))
        except Exception as e:
            print(f"Redis set error: {e}")

    def get_cache(self, key: str):
        try:
            value = self.redis_client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    def delete_cache(self, key: str):
        try:
            self.redis_client.delete(key)
        except Exception as e:
            print(f"Redis delete error: {e}")

    def clear_user_cache(self, user_id: str = None):
        try:
            if user_id:
                self.delete_cache(f"user:{user_id}")
            self.delete_cache("users:all")
        except Exception as e:
            print(f"Redis clear error: {e}")
