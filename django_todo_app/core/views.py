from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Task, TaskGroup, Friendship
from .serializers import TaskSerializer, TaskGroupSerializer, UserSerializer, FriendshipSerializer


from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework import generics, permissions, filters

class UserSearchView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username'] # This allows ?search=username in the URL

    def get_queryset(self):
        # Don't show the logged-in user in the search results!
        return User.objects.exclude(id=self.request.user.id)
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

class FriendshipViewset(viewsets.ModelViewSet):
    serializer_class = FriendshipSerializer

    def get_queryset(self):
        # Return all friendships the user is part of
        return Friendship.objects.filter(Q(creator=self.request.user) | Q(friend=self.request.user))

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=False, methods=['get'])
    def accepted_friends(self, request):
        # Filter for only ACCEPTED friendships involving the current user
        friends = Friendship.objects.filter(
            (Q(creator=request.user) | Q(friend=request.user)),
            status='accepted' # Crucial filter
        )
        serializer = FriendshipSerializer(friends, many=True)
        return Response(serializer.data)
    
    # NEW: This is the "Inbox" endpoint for the frontend
    @action(detail=False, methods=['get'])
    def requests(self, request):
        pending = Friendship.objects.filter(friend=request.user, status='pending')
        serializer = FriendshipSerializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friendship = self.get_object()
        if friendship.friend == request.user:
            friendship.status = 'accepted' # ✅ Correct assignment
            friendship.save()
            return Response({"status": "Friendship Accepted"})
        return Response({"error": "Unauthorized"}, status=403)
    serializer_class=FriendshipSerializer

    def get_queryset(self):
        return Friendship.objects.filter(
            Q(creator=self.request.user) | Q(friend=self.request.user)
        )
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=True,methods=['post'])
    def accept(self,request,pk=None):
        friendship=self.get_object()
        if friendship.friend==request.user:
            friendship.status=='accept'
            friendship.save()
            return Response({"status","Friendship Accepted"})
        return Response({"Error","Not authorized"},status=status.HTTP_403_FORBIDDEN)