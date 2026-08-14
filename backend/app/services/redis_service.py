import json
import logging
import redis
from app.config import settings

logger = logging.getLogger(__name__)

class RedisService:
    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.cache_ttl = 300

    def set_cache(self, key: str, value, ttl: int = None):
        try:
            self.redis_client.setex(key, ttl or self.cache_ttl, json.dumps(value, default=str))
        except Exception as e:
            logger.error("Redis set error: %s", e, exc_info=True)

    def get_cache(self, key: str):
        try:
            value = self.redis_client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            logger.error("Redis get error: %s", e, exc_info=True)
            return None

    def delete_cache(self, key: str):
        try:
            self.redis_client.delete(key)
        except Exception as e:
            logger.error("Redis delete error: %s", e, exc_info=True)

    def clear_user_cache(self, user_id: str = None):
        try:
            if user_id:
                self.delete_cache(f"user:{user_id}")
            self.delete_cache("users:all")
        except Exception as e:
            logger.error("Redis clear error: %s", e, exc_info=True)
