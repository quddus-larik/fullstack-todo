from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Task, TaskGroup,Friendship
from datetime import timedelta
from django.db.models import Q

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class FriendshipSerializer(serializers.ModelSerializer):
    friend_info = serializers.SerializerMethodField()

    class Meta:
        model = Friendship
        fields = ['id', 'status', 'created_at', 'friend_info']
        read_only_fields = ['status', 'created_at']

    # FIXED: This must be OUTSIDE Meta, but INSIDE the Serializer class
    def get_friend_info(self, obj):
        try:
            request_user = self.context['request'].user
            
            # Logic to find the "other" person
            if obj.creator == request_user:
                other_user = obj.friend
            else:
                other_user = obj.creator
                
            return {
                "id": other_user.id,
                "username": other_user.username,
                "email": other_user.email
            }
        except Exception:
            return None# 1. NEW: This powers the Sidebar and the "Member Picker"
class TaskGroupSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=User.objects.all(), source='members'
    )

    class Meta:
        model = TaskGroup
        fields = ['id', 'name', 'description', 'creator', 'members', 'member_ids', 'created_at']
        read_only_fields = ['creator']

    # THIS is where the friendship check belongs!
    def validate_member_ids(self, data):
        request_user = self.context['request'].user
        for member in data:
            if member == request_user: continue
            
            # Ensure an accepted friendship exists
            exists = Friendship.objects.filter(
                (Q(creator=request_user, friend=member) | Q(creator=member, friend=request_user)),
                status='accepted'
            ).exists()
            
            if not exists:
                raise serializers.ValidationError(f"You aren't friends with {member.username}")
        return data
class TaskSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='creator.username')
    creator_id = serializers.ReadOnlyField(source='creator.id')
    # Show the name in the UI, but use ID for the database update
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')

    deadline = serializers.DateTimeField(required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'deadline', 
            'completed', 'assigned_to', 'assigned_to_username', 
            'creator_id','creator_name', 'group'
        ]

    # 2. VALIDATION: Keeping your deadline check
    def validate_deadline(self, value):
        if value is None:
            return  timezone.now() + timedelta(hours=24)

        if value and value < timezone.now():
            raise serializers.ValidationError("Deadline cannot be in the past.")
        return value

    # 3. BRUTAL LOGIC: Enforce the "Group-Only Assignment"
    def validate(self, data):
        group = data.get('group')
        assigned_to = data.get('assigned_to')

        # If a group is set and an assignee is chosen, they MUST be in that group
        if group and assigned_to:
            if assigned_to not in group.members.all():
                raise serializers.ValidationError(
                    {"assigned_to": "That user is not a member of this workspace!"}
                )
        return data