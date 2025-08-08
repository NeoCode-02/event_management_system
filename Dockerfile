FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser

WORKDIR /app

RUN pip install uv

COPY pyproject.toml ./

RUN uv pip install --system --no-deps . && uv sync

COPY . .

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
