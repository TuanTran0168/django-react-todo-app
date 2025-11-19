from django.contrib import admin

from django.contrib import admin
from .models import Tasks, User


@admin.register(Tasks)
class TasksAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'priority', 'is_done', 'due_date', 'created_date')
    list_filter = ('priority', 'is_done', 'due_date', 'active')
    search_fields = ('title', 'description')
    ordering = ('due_date',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_superuser')
    list_filter = ('is_superuser', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('id',)

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_active')}
        ),
    )
