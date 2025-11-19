from django.shortcuts import render
from rest_framework import viewsets

from .models import Tasks, User
from .serializers import TasksSerializer, UserSerializer, CreateUserSerializer, CreateTasksSerializer


class TasksViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.all()
    serializer_class = TasksSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTasksSerializer

        return self.serializer_class


class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer

        return self.serializer_class