from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser, CaretakerProfile, Review, Message, Reply, JobApplication, JobPost, VocationalSchool, Course, Enrollment, Certification

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
    profile_picture = serializers.SerializerMethodField()

    def get_profile_picture(self, obj):
        try:
            return obj.profile_picture.url if obj.profile_picture else None
        except AttributeError:
            return None

    class Meta:
        model = CaretakerProfile
        fields = '__all__'
        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id','user', 'rating', 'review_text', 'created_at']
        
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

# ReplySerializer for handling replies
class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

    def create(self, validated_data):
        # Retrieve the message being replied to
        message = validated_data['message']
        
        # Check if it's a reply and populate the `reply_to` field
        reply_to_message = validated_data.get('reply_to', None)
        
        # If reply_to_message is None, we should not link it to any other message
        reply = Reply.objects.create(
            message=message,
            sender=validated_data['sender'],
            receiver=validated_data['receiver'],
            content=validated_data['content'],
            reply_to=reply_to_message  # Only link if reply_to_message is provided
        )
        
        return reply

# ChatMessageSerializer to include replies as nested data
class ChatMessageSerializer(serializers.ModelSerializer):
    replies = ReplySerializer(many=True, read_only=True)  # Use ReplySerializer for replies

    class Meta:
        model = Message
        fields = '__all__'
    def get_replies(self, obj):
        # Fetch replies related to the message (optimize with prefetch_related if necessary)
        replies = Reply.objects.filter(message=obj)
        return ReplySerializer(replies, many=True).data  # Use ReplySerializer to serialize replies

class JobPostSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = JobPost
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    caretaker = serializers.StringRelatedField(read_only=True)
    job = serializers.PrimaryKeyRelatedField(queryset=JobPost.objects.all())  
    caretaker_user_id = serializers.IntegerField(source='caretaker.id', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = '__all__'

    def validate(self, data):
        job = data.get('job')
        if job and job.status != 'Open':
            raise serializers.ValidationError("This job is no longer open for applications.")
        return data


class VocationalSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocationalSchool
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["manager"] = request.user
        return super().create(validated_data)    
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.location = validated_data.get("location", instance.location)
        instance.logo = validated_data.get("logo", instance.logo)
        instance.save()
        return instance

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    class Meta:
        model = Enrollment
        fields = '__all__'

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'
