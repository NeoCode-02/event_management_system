import random
import smtplib
from email.mime.text import MIMEText

from celery import Celery

from app.core.config import settings
from app.utils.redis import (
    store_verification_code,
    is_rate_limited,
    set_rate_limit,
)

celery_app = Celery(
    __name__,
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.task_routes = {
    "app.utils.tasks.send_email_verification": {"queue": "emails"},
}


def generate_verification_code(length: int = 6) -> str:
    """Return a numeric code of `length` digits."""
    return f"{random.randint(10**(length-1), 10**length - 1)}"


@celery_app.task(bind=True, max_retries=3)
def send_email_verification(self, to_email: str, code: str) -> None:
    """Send verification e-mail via SMTP. Retries automatically on failure."""
    subject = "Your Verification Code"
    body = (
        f"Hello,\n\n"
        f"Your verification code is: {code}\n\n"
        f"Thanks for registering with Event Manager."
    )
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = f"{settings.EMAIL_SENDER_NAME} <{settings.EMAIL_ADDRESS}>"
    msg["To"] = to_email

    try:
        with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
            server.sendmail(settings.EMAIL_ADDRESS, to_email, msg.as_string())
    except Exception as exc:
        # Exponential back-off: 60 s, 120 s, 240 s
        countdown = 60 * (2 ** self.request.retries)
        raise self.retry(exc=exc, countdown=countdown)


def send_verification_email_task(to_email: str) -> str:
    """
    1. Check rate-limit.
    2. Generate & store code.
    3. Set rate-limit.
    4. Dispatch Celery task.
    Returns the generated code so the caller can return it in tests.
    """
    if is_rate_limited(to_email):
        raise Exception("Please wait before requesting another code.")

    code = generate_verification_code()
    store_verification_code(to_email, code)
    set_rate_limit(to_email)

    send_email_verification.delay(to_email, code)
    return code