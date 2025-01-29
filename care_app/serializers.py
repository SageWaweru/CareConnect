from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser, CaretakerProfile, Review

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'is_superuser']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.role = validated_data.get('role', instance.role)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
        
        instance.save()    
        return instance
    

class CaretakerProfileSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()
    profile_picture = serializers.CharField(source='profile_picture.url', allow_blank=True)

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
         setattr(instance, field, value)
        instance.save()
        return instance
    
    class Meta:
        model = CaretakerProfile
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['rating', 'review_text']

