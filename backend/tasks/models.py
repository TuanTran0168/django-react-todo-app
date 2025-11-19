from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    deleted_date = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Tasks(BaseModel):
    PRIORITY_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
    ]
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True)
    due_date = models.DateField(default=timezone.localdate)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='TODO')
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta(BaseModel.Meta):
        ordering = ['due_date', 'id']


class User(AbstractUser):
    is_confirm = models.BooleanField(default=False)

    def __str__(self):
        return self.username
