# Django React Todo App

This is the backend of a TodoList application built with **Django**, **React** and **PostgreSQL**, configured to run with Docker for local development.

## 👂 Project Structure (BACKEND)

```
. backend
├── tasks/                  # App for managing tasks
│   ├── migrations/         # Django migrations
│   ├── admin.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── paginators.py
│   └── tests.py
├── todo_project/           # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
├── Dockerfile.local        # Dockerfile for local development
├── docker-compose-local.yml # Docker Compose configuration
├── requirements.txt        # Python dependencies
├── manage.py               # Django CLI
└── run.sh                  # Script to run the project
```

## ⚙️ Requirements

* Docker & Docker Compose
* Python 3.11 (if running locally without Docker)
* PostgreSQL 17 (Docker container is already configured)

## 🐳 Running the Project with Docker

1. Build and start the containers:

```bash
docker-compose -f docker-compose-local.yml up -d --build
```

2. Enter the Django container:

```bash
docker exec -it django_todo_dev bash
```

3. Run migrations and create a superuser:

```bash
python manage.py migrate
python manage.py createsuperuser
```

4. Start the Django development server:

```bash
python manage.py runserver 0.0.0.0:8000
```

The server will be available at: `http://localhost:8000`

Swagger UI: `http://localhost:8000/api/swagger/`

ReDoc: `http://localhost:8000/api/redoc/`
