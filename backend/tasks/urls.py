from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TasksViewSet, UsersViewSet

router = DefaultRouter()
router.register(r'tasks', TasksViewSet, basename='tasks')
router.register(r'users', UsersViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
]
