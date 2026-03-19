from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Task, TaskGroup, Friendship
from .serializers import TaskSerializer, TaskGroupSerializer, UserSerializer, FriendshipSerializer
from rest_framework import viewsets, permissions, status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, permissions, filters
from rest_framework import serializers  # for DRF validation errors
from django.core.exceptions import ValidationError  # for Django model clean/save errors
class UserSearchView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Keep these, but we'll make get_queryset smarter
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']

    def get_queryset(self):
        # 1. Start with everyone EXCEPT the logged-in user
        queryset = User.objects.exclude(id=self.request.user.id)
        
        # 2. Get the 'q' parameter from the URL (?q=...)
        # Note: If your frontend uses ?search=, SearchFilter handles it.
        # If your frontend uses ?q=, we handle it manually here:
        query = self.request.query_params.get('q', None)
        
        if query:
            # __icontains is essential for PostgreSQL (Neon)
            queryset = queryset.filter(username__icontains=query)
            
        return queryset.order_by('username')
class RegisterView(APIView):
    # 🚨 CRITICAL: Allow anyone to access this, otherwise they can't sign up!
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create the User
        user = User.objects.create_user(
            username=username, 
            password=password, 
            email=email
        )

        # 2. THE AUTO-LOGIN: Generate JWT tokens immediately
        refresh = RefreshToken.for_user(user)
        
        # 3. Return user data + tokens
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)
# 1. AUTH: Keep this for the Frontend to know who is logged in
class UserMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

# 2. SIDEBAR: This provides the list of groups for the Shadcn Sidebar
class TaskGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TaskGroupSerializer

    def get_queryset(self):
        # Only show groups where the user is a member
        return TaskGroup.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        # Automatically make the creator a member of their own group
        group = serializer.save(creator=self.request.user)
        group.members.add(self.request.user)

# 3. TASKS: The core logic for collaborative and personal tasks
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # 🚨 THE FIX: If we are targeting a specific task (DELETE/PATCH),
        # look at ALL tasks the user has a right to see, ignoring the group filter.
        if self.detail:
            return Task.objects.filter(Q(creator=user) | Q(assigned_to=user) | Q(group__members=user)).distinct()

        group_id = self.request.query_params.get('group')
        if group_id:
            return Task.objects.filter(group_id=group_id, group__members=user)
        
        return Task.objects.filter(
            Q(group__isnull=True, creator=user) | Q(assigned_to=user)
        ).distinct()
    
    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        # Only the person who created the task can kill it
        if task.creator != request.user:
            return Response(
                {"error": "You didn't create this. Hands off."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['patch', 'post'])
    def toggle(self, request, pk=None):
        task = self.get_object()
        user=request.user
        if task.creator != user and task.assigned_to != user:
            return Response(
                {"error": "You aren't responsible for this task!"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        task.completed = not task.completed
        task.save()
        return Response({'status': 'task toggled', 'completed': task.completed})
    
    #4 Adding Friends



# --- Friendships ---
class FriendshipViewset(viewsets.ModelViewSet):
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Friendship.objects.filter(Q(creator=user) | Q(friend=user))

    def perform_create(self, serializer):
        try:
            serializer.save(creator=self.request.user)
        except ValidationError as e:
            raise serializers.ValidationError({"error": e.messages})

    @action(detail=False, methods=['get'])
    def requests(self, request):
        pending = Friendship.objects.filter(friend=request.user, status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        if friendship.friend != request.user:
            return Response({"error": "Only the recipient can accept this."}, status=status.HTTP_403_FORBIDDEN)
        friendship.status = 'accepted'
        friendship.save()
        serializer = self.get_serializer(friendship)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def accepted_friends(self, request):
        user = request.user
        friends = Friendship.objects.filter(
            Q(creator=user) | Q(friend=user),
            status='accepted'
        )
        serializer = self.get_serializer(friends, many=True)
        return Response(serializer.data)