from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import CustomUser, CaretakerProfile, Review
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer, UserSerializer
from django.contrib.auth import login as auth_login
from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import CaretakerProfileSerializer, ReviewSerializer


User = get_user_model()

# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#     role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'role']

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data['role']
#         )
#         return user



class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'role': user.role,
            }, status=status.HTTP_200_OK)
        
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserListView(APIView):
    #  permission_classes = [IsAdminUser]  

     def get(self, request, *args, **kwargs):
        users = CustomUser.objects.all() 
        serializer = UserSerializer(users, many=True)  
        return Response(serializer.data)  

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user  # Get the currently authenticated user
        serializer = UserSerializer(user)  # Serialize the user object
        return Response(serializer.data)
    
class UpdateUserDetailsView(APIView):
    def put(self, request, id, *args, **kwargs):
        try:
            user = CustomUser.objects.get(id=id)

            serializer = UserSerializer(user, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'User details updated successfully'},
                    status=status.HTTP_200_OK
                )
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
class IsCaretaker(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'caretaker'

class CaretakerProfileViewSet(viewsets.ModelViewSet):
    queryset = CaretakerProfile.objects.all()
    serializer_class = CaretakerProfileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['skills', 'availability', 'ratings']
    
    # def get_queryset(self):
    #     return CaretakerProfile.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsCaretaker()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CaretakerProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        profile = get_object_or_404(CaretakerProfile, user=user_id)
        serializer = CaretakerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    def put(self, request, user_id):
        profile = get_object_or_404(CaretakerProfile, user=user_id)
        print("Request Data:", request.data)
        serializer = CaretakerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CaretakerProfileListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        profiles = CaretakerProfile.objects.all()
        serializer = CaretakerProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class ReviewListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, caretaker_id):
        reviews = Review.objects.filter(caretaker_profile=caretaker_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


