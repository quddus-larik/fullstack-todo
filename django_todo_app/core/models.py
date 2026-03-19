from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError

def get_deadline():
    return timezone.now() + timedelta(hours=24)

class TaskGroup(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")
    members = models.ManyToManyField(User, related_name="joined_groups")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_tasks")
    group = models.ForeignKey(TaskGroup, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(default=get_deadline)
    completed = models.BooleanField(default=False)

    def __str__(self):
        status = "✅" if self.completed else "⏳"
        return f"{status} {self.title} | Group: {self.group.name if self.group else 'Private'}"

class Friendship(models.Model):
    STATUS_CHOICES = (
        ('pending','Pending'),
        ('accepted','Accepted'),
        ('blocked','Blocked'),
    )
    creator = models.ForeignKey(User, related_name="friendship_creator", on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name="friend_set", on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('creator', 'friend')
        ordering = ['-id']

    def save(self, *args, **kwargs):
        if self.creator == self.friend:
            raise ValidationError("You cannot friend yourself.")
        if Friendship.objects.filter(creator=self.friend, friend=self.creator).exists():
            raise ValidationError("A friendship request already exists between you two.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.creator.username} -> {self.friend.username} ({self.status})"