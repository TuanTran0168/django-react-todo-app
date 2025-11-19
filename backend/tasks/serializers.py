from rest_framework import serializers
from .models import Tasks, User

BASE_FIELD = [
    'created_date',
    'updated_date',
    'deleted_date',
    'active',
]


class TasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = ['id',
                  'title',
                  'description',
                  'due_date',
                  'priority',
                  'is_done',
                  ] + BASE_FIELD
        read_only_fields = ['id', 'created_date', 'updated_date']


class CreateTasksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasks
        fields = ['title', 'description', 'due_date', 'priority', ]

class BulkActionTasksSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
        help_text="List of task IDs"
    )

class BulkDeleteResponseSerializer(serializers.Serializer):
    deleted_count = serializers.IntegerField()
    deleted_ids = serializers.ListField(
        child=serializers.IntegerField()
    )

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
            'last_login',
            'is_confirm',
        ]
        read_only_fields = ['id', 'username', 'email', 'last_login']


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # hash password
        user.save()
        return user
