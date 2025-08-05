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

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
