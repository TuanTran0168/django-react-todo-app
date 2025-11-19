from rest_framework import serializers
from .models import Tasks, User


class TasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = [
            'id',
            'title',
            'description',
            'due_date',
            'priority',
            'is_done',
            'created_date',
            'updated_date',
            'deleted_date',
            'active',
        ]
        read_only_fields = ['id', 'created_date', 'updated_date']


class UserSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(source='pk', read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'last_login'
        ]
        read_only_fields = ['id', 'username', 'email', 'last_login']
