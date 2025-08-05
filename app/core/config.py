from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_HOURS: int

    # === REDIS (Celery Broker/Backend) ===
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str

    # Redis
    REDIS_URL: str

    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    EMAIL_ADDRESS: str
    EMAIL_PASSWORD: str
    EMAIL_SENDER_NAME: str = "Event Manager"

    class Config:
        env_file = ".env"


settings = Settings()
