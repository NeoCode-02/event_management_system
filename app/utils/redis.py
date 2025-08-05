import redis
from typing import Optional

from app.core.config import settings

redis_client = redis.StrictRedis.from_url(
    settings.REDIS_URL, decode_responses=True
)

VERIFICATION_PREFIX = "email:verification"
RATE_LIMIT_PREFIX   = "email:rate_limit"

def store_verification_code(email: str, code: str, ttl: int = 600) -> None:
    key = f"{VERIFICATION_PREFIX}:{email}"
    redis_client.setex(key, ttl, code)

def retrieve_verification_code(email: str) -> Optional[str]:
    key = f"{VERIFICATION_PREFIX}:{email}"
    return redis_client.get(key)

def delete_verification_code(email: str) -> None:
    key = f"{VERIFICATION_PREFIX}:{email}"
    redis_client.delete(key)

#Rate limiter
def is_rate_limited(email: str) -> bool:
    key = f"{RATE_LIMIT_PREFIX}:{email}"
    return bool(redis_client.exists(key))

def set_rate_limit(email: str, ttl: int = 600) -> None:
    key = f"{RATE_LIMIT_PREFIX}:{email}"
    redis_client.setex(key, ttl, "1")

def clear_rate_limit(email: str) -> None:
    key = f"{RATE_LIMIT_PREFIX}:{email}"
    redis_client.delete(key)