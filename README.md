# 📚 Django-React Todo Application

A TodoList app with **Django** backend, **React** frontend, and **PostgreSQL**, ready to run via **Docker**.

The entire environment is configured to run smoothly using **Docker** and **Docker Compose** for local development.

---

## ⚙️ Requirements

* Docker & Docker Compose  
* Python 3.11 (if running locally without Docker)  
* PostgreSQL 17 (Docker container is already configured)  
* Node.js 22 (used in frontend Docker container)  

---

## 🐳 Running the Project with Docker

This project uses a separate Docker Compose file (`docker-compose-local.yml`) for the backend and its database, and a separate one (`docker-compose.dev.yaml`) for the frontend.

### 1. Backend & Database Setup

Use the backend's local Docker Compose file to start the Django and PostgreSQL services:

```bash
docker-compose -f docker-compose-local.yml up -d --build
```

### 2. Initializing the Backend

After the containers are up, run migrations and create a superuser for the Django application.

**Enter the Django container:**

```bash
docker exec -it django_todo_dev bash
```

**Run migrations and create a superuser:**

```bash
python manage.py migrate
python manage.py createsuperuser
```

**Start the Django development server:**

```bash
python manage.py runserver 0.0.0.0:8000
```

### 3. Running the Frontend

Use the development Docker Compose file to start the React application:

```bash
docker-compose -f docker-compose.dev.yaml up -d --build
```

---

## 🚀 Access Points

| Service                | Address                               | Description                                    |
|------------------------|---------------------------------------|------------------------------------------------|
| Backend API (Django)   | [http://localhost:8000](http://localhost:8000) | The core REST API serving task data           |
| Frontend UI (React/Vite) | [http://localhost:5173](http://localhost:5173) | The main user interface for the Todo app     |
| API Docs (Swagger UI)  | [http://localhost:8000/api/swagger/](http://localhost:8000/api/swagger/) | Interactive documentation for all API endpoints |
| API Docs (ReDoc)       | [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/) | Alternative, developer-friendly API documentation |

---

## 👂 Project Structure

### Backend (Django)

```
. backend
├── tasks/                  # App for managing tasks
│   ├── migrations/         # Django migrations
│   ├── middlewares/        # Middlewares
│   ├── admin.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── paginators/
│   └── tests.py
├── todo_project/           # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
├── Dockerfile.local        # Dockerfile for local development
├── docker-compose-local.yml # Docker Compose configuration
├── requirements.txt        # Python dependencies
├── manage.py               
└── run.sh                  # Script to run the project
```

### Frontend (React/Vite)

```
. frontend
├── .vite/                  # Vite internal cache
├── public/                 # Static assets (images, icons, etc.)
├── src/                    # Main application source code
│   ├── assets/             
│   ├── components/         
│   ├── pages/              
│   ├── services/           
│   ├── utils/              
│   ├── App.css             
│   ├── App.jsx             
│   ├── index.css           
│   └── main.jsx            
├── .gitignore              
├── Dockerfile              # Dockerfile for (production / build)
├── docker-compose.yaml     # Dockerfile for (production / build)
├── Dockerfile.dev          # Dockerfile for frontend development
├── docker-compose.dev.yaml # Docker Compose for frontend development
├── README.md               
├── eslint.config.js       
├── index.html              
├── package-lock.json       
├── package.json           
├── postcss.config.js       
├── tailwind.config.js      
└── vite.config.js          
```

---

## 💡 Notes

* Frontend styling uses **Tailwind CSS**.
* Backend API documentation is available via Swagger and ReDoc.  
* **Hot reload** works for both frontend and backend when using Docker containers.  

