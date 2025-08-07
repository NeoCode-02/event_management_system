# Event Management System

A modern, scalable, and secure event management system built with FastAPI, SQLAlchemy, and PostgreSQL. This system provides a robust API for managing events, user registrations, and authentication.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication system
- **Event Management**: Create, read, update, and delete events
- **Registration System**: Users can register for events
- **Admin Dashboard**: Built-in admin interface for managing content
- **Asynchronous Tasks**: Background task processing with Celery and Redis
- **RESTful API**: Clean, well-documented API endpoints
- **Database Migrations**: Using Alembic for database versioning

## 🛠️ Tech Stack

- **Backend**: Python 3.12+
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0+
- **Authentication**: JWT (JSON Web Tokens)
- **Task Queue**: Celery with Redis as broker
- **Admin Panel**: Starlette Admin
- **Containerization**: Docker (coming soon)

## 🚀 Getting Started

### Prerequisites

- Python 3.12 or higher
- PostgreSQL database
- Redis server

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-management-system.git
   cd event-management-system
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

### Running the Application

1. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```

2. Start Celery worker (in a separate terminal):
   ```bash
   celery -A app.utils.tasks worker --loglevel=info
   ```

3. Access the application:
   - API Documentation: http://localhost:8000/docs
   - Admin Panel: http://localhost:8000/admin


## 🐳 Docker Setup

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This will start:
- FastAPI app (http://localhost:8000)
- PostgreSQL (localhost:5432)
- Redis (localhost:6379)

### 2. Environment Variables

Copy and edit your environment file:
```bash
cp .env.example .env
# Edit .env as needed
```

The following variables are set by docker-compose, but you can override them in your .env:
- `DATABASE_URL=postgresql+psycopg2://eventuser:eventpass@db:5432/eventdb`
- `REDIS_URL=redis://redis:6379/0`
- `CELERY_BROKER_URL=redis://redis:6379/0`
- `CELERY_RESULT_BACKEND=redis://redis:6379/0`

Add your JWT secrets and email credentials to `.env`.

### 3. Run Alembic Migrations

In a new terminal (with containers running):
```bash
docker-compose exec app alembic upgrade head
```

### 4. Stopping Services

```bash
docker-compose down
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚡ Dependency Management with uv

This project uses [uv](https://github.com/astral-sh/uv) for fast dependency management in Docker and optionally for local development. You can install it with:

```bash
pip install uv
```

### Docker Notes
- The Dockerfile now uses uv for dependency management for faster, more efficient builds.
