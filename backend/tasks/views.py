from django.shortcuts import render
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tasks, User
from .paginators import BasePagination
from .serializers import TasksSerializer, UserSerializer, CreateUserSerializer, CreateTasksSerializer, \
    BulkActionTasksSerializer
from drf_spectacular.utils import extend_schema


class TasksViewSet(viewsets.ModelViewSet):
    queryset = Tasks.objects.all()
    serializer_class = TasksSerializer
    pagination_class = BasePagination

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateTasksSerializer

        return self.serializer_class

    @extend_schema(
        request=BulkActionTasksSerializer,
        responses={200: TasksSerializer(many=True)}
    )
    @action(detail=False, methods=['post'])
    def bulk_done(self, request):
        serializer = BulkActionTasksSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data['ids']

        Tasks.objects.filter(id__in=ids).update(is_done=True, priority='DONE')

        updated_tasks = Tasks.objects.filter(id__in=ids)
        updated_serializer = TasksSerializer(updated_tasks, many=True)
        return Response({
            "updated_count": updated_tasks.count(),
            "updated_tasks": updated_serializer.data
        })

    @extend_schema(
        request=BulkActionTasksSerializer,
        responses={200: serializers.DictField(child=serializers.IntegerField())}
    )
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        serializer = BulkActionTasksSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data['ids']

        tasks_to_delete = list(Tasks.objects.filter(id__in=ids).values_list('id', flat=True))
        deleted_count, _ = Tasks.objects.filter(id__in=ids).delete()

        return Response({
            "deleted_count": deleted_count,
            "deleted_ids": tasks_to_delete
        })


class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = BasePagination

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateUserSerializer

        return self.serializer_class
