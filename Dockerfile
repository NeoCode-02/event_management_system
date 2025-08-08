FROM python:3.12-slim

# Install system packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a user
RUN useradd -m appuser

# Set working directory
WORKDIR /app

# Install uv globally
RUN pip install uv

# Copy only dependency files first for caching
COPY pyproject.toml ./

# Install dependencies into the system environment
RUN uv pip install --system --no-deps . && uv sync

# Copy the rest of the code
COPY . .

# Set non-root user
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Default command (overridden by docker-compose for celery)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
