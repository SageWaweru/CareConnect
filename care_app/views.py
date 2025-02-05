from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from .models import CustomUser, CaretakerProfile, Review, Message, Reply, JobPost, JobApplication, VocationalSchool, Course, Enrollment, Certification
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser,IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer, UserSerializer, ReviewSerializer,CaretakerProfileSerializer, ChatMessageSerializer, ReplySerializer, JobApplicationSerializer, JobPostSerializer, VocationalSchoolSerializer, CourseSerializer, EnrollmentSerializer, CertificationSerializer
from django.contrib.auth import login as auth_login
from rest_framework import viewsets, permissions, generics
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.db.models import Max
from rest_framework.parsers import MultiPartParser, FormParser



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


class UserDetailView(APIView):
    permission_classes = []  # Require authentication to view user details

    def get(self, request, user_id):
        user = get_object_or_404(CustomUser, id=user_id)  
        serializer = UserSerializer(user)  
        return Response(serializer.data, status=status.HTTP_200_OK)

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
    filterset_fields = ['skills', 'availability', 'average_rating']
    
    # def get_queryset(self):
    #     return CaretakerProfile.objects.filter(user=self.request.user)
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsCaretaker()]
        return [permissions.AllowAny()]
    
    def perform_create(self, serializer):
        profile_picture = self.request.data.get('profile_picture')
        if profile_picture and isinstance(profile_picture, str):  # If it's a URL
                serializer.save(user=self.request.user, profile_picture=profile_picture)
        else:
         serializer.save(user=self.request.user)

class CaretakerProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        profile = get_object_or_404(CaretakerProfile, user=user_id)
        serializer = CaretakerProfileSerializer(profile)
        print("Response Data:", serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK) 
    
    def put(self, request, user_id):
        profile = get_object_or_404(CaretakerProfile, user=user_id)
        profile_picture = self.request.data.get('profile_picture')
        print("Request Data:", request.data)  # Debugging request data
        
        # Ensure profile_picture is updated
        if 'profile_picture' in request.data:
            print("New profile_picture:", request.data['profile_picture'])
        
        serializer = CaretakerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  
            print("Response Data:", serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CaretakerProfileByIdView(APIView):
    permission_classes = [AllowAny]  # Customers don't need authentication

    def get(self, request, id):
        profile = get_object_or_404(CaretakerProfile, id=id)
        serializer = CaretakerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CaretakerProfileListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        profiles = CaretakerProfile.objects.all()
        serializer = CaretakerProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        caretaker_id = self.kwargs['caretaker_id']
        return Review.objects.filter(caretaker_id=caretaker_id)

    def perform_create(self, serializer):
        caretaker_id = self.kwargs['caretaker_id']
        caretaker = CaretakerProfile.objects.get(id=caretaker_id)
        
        # Check if the user has the "customer" role
        if not self.request.user.role == "customer":  # Assuming 'role' is a field in your User model
            raise ValidationError("Only customers can review caretakers.")

        # Check if the user has already reviewed this caretaker
        if Review.objects.filter(user=self.request.user, caretaker=caretaker).exists():
            raise ValidationError("You have already reviewed this caretaker.")
        
        serializer.save(user=self.request.user, caretaker=caretaker)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message, Reply
from .serializers import ChatMessageSerializer, ReplySerializer

class ChatMessageListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        sender_id = kwargs.get('sender_id')
        if sender_id:
            conversation = Message.objects.filter(
                Q(sender=request.user, receiver_id=sender_id) |
                Q(sender_id=sender_id, receiver=request.user)
            ).select_related('sender', 'receiver').prefetch_related('replies').order_by('timestamp')
        else:
            conversation = Message.objects.filter(
                Q(sender=request.user) | Q(receiver=request.user)
            ).select_related('sender', 'receiver').prefetch_related('replies').order_by('timestamp')

        serializer = ChatMessageSerializer(conversation, many=True)
        return Response({"all_messages": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        receiver_id = request.data.get("receiver")
        content = request.data.get("content")
        reply_to_id = request.data.get("reply_to")  # Expect the frontend to send this field when replying

        if not receiver_id or not content:
            return Response({"error": "Receiver and content are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            CustomUser = get_user_model()
            receiver = CustomUser.objects.get(id=receiver_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

        # If replying to a message or a reply
        if reply_to_id:
            try:
                # Try to find the reply first
                reply_to = Reply.objects.get(id=reply_to_id)
                # If found, create a new message and link it to the reply
                reply = Reply.objects.create(
                    message=reply_to.message,  # Link to the original message
                    sender=request.user,
                    receiver=receiver,
                    content=content,
                    reply_to=reply_to  # Link to the original reply
                )
                serializer = ReplySerializer(reply)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            except Reply.DoesNotExist:
                try:
                    # If no reply is found, try to find the message
                    original_message = Message.objects.get(id=reply_to_id)
                    reply = Reply.objects.create(
                        message=original_message,
                        sender=request.user,
                        receiver=receiver,
                        content=content,
                        reply_to=None  # Reply to a message, no reply_to set
                    )
                    serializer = ReplySerializer(reply)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except Message.DoesNotExist:
                    return Response({"error": "Message or Reply not found."}, status=status.HTTP_404_NOT_FOUND)
        
        else:
            # If no reply_to is provided, create a new message
            message = Message.objects.create(
                sender=request.user,
                receiver=receiver,
                content=content
            )
            serializer = ChatMessageSerializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class ReplyAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, message_id):
        try:
            # Fetch the original message that the reply is for
            message = Message.objects.get(id=message_id)
        except Message.DoesNotExist:
            return Response({"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure the logged-in user is allowed to reply
        if request.user != message.receiver:  # Assuming only the receiver can reply
            return Response({"error": "You cannot reply to this message."}, status=status.HTTP_403_FORBIDDEN)

        # Get the content for the reply from the request
        reply_content = request.data.get("content")
        if not reply_content:
            return Response({"error": "Reply content is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the reply message (no `reply_to` argument for Message)
        try:
            reply_message = Message.objects.create(
                sender=request.user,
                receiver=message.sender,  # The original message's sender becomes the receiver of the reply
                content=reply_content
            )

            # Create the reply (link it to the original message)
            Reply.objects.create(
                message=reply_message,
                sender=request.user,
                receiver=message.sender,
                content=reply_content,
                reply_to=message  # Linking to the original message
            )
        except Exception as e:
            return Response({"error": f"Failed to create reply: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": "Reply sent successfully!"}, status=status.HTTP_201_CREATED)

class JobPostListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        jobs = JobPost.objects.all().order_by("-created_at")
        serializer = JobPostSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(customer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, job_id=None):
        try:
            job = JobPost.objects.get(id=job_id)  # Fetch the job post using the job_id
        except JobPost.DoesNotExist:
            return Response({"detail": "Job post not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is the owner of the job post
        if job.customer != request.user:
            return Response({"detail": "You are not authorized to update this job post."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")

        # Ensure the new status is one of the valid choices
        if new_status and new_status not in ["Open", "In Progress", "Closed"]:
            return Response({"detail": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the job's status if a valid status is provided
        if new_status:
            job.status = new_status
            job.save()

        # Serialize the job post and return the updated data
        serializer = JobPostSerializer(job)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, job_id=None):
        try:
            job = JobPost.objects.get(id=job_id)  # Fetch the job post using the job_id
        except JobPost.DoesNotExist:
            return Response({"detail": "Job post not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user is the owner of the job post
        if job.customer != request.user:
            return Response({"detail": "You are not authorized to delete this job post."}, status=status.HTTP_403_FORBIDDEN)

        # Delete all applications for this job
        JobApplication.objects.filter(job=job).delete()

        # Now delete the job post
        job.delete()

        return Response({"detail": "Job post and its applications have been deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class JobApplicationListCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Check if the user is a customer (you can use a custom user model check or group check)
        if request.user.role == 'customer':  # Assuming your user model has an `role` field
            # Get the jobs posted by the customer (assuming JobPost has a foreign key to the customer)
            job_posts = JobPost.objects.filter(customer=request.user)
            applications = JobApplication.objects.filter(job__in=job_posts)
        else:
            # Handle case for caretakers (if needed)
            applications = JobApplication.objects.filter(caretaker=request.user)
        
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        # Check if the user has already applied for this job
        job_id = request.data.get('job')  # Assuming job ID is passed in the request data
        if JobApplication.objects.filter(caretaker=request.user, job_id=job_id).exists():
            return Response(
                {"detail": "You have already applied for this job. Please check your previous application or apply for another job."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        # If not, proceed to create the job application
        serializer = JobApplicationSerializer(data=request.data)
        if serializer.is_valid():
            # Save the job application, assigning the caretaker to the current user
            serializer.save(caretaker=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class JobApplicationDetailUpdateAPIView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, application_id):
        try:
            application = JobApplication.objects.get(id=application_id)
        except JobApplication.DoesNotExist:
            return Response({"detail": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure only the job poster (customer) can update
        if application.job.customer != request.user:
            return Response({"detail": "Unauthorized to update this application."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in ["pending", "hired", "rejected"]:
            return Response({"detail": "Invalid status value."}, status=status.HTTP_400_BAD_REQUEST)

        application.status = new_status
        application.save()

        # If the job is hired, automatically mark the job as "In Progress"
        if new_status == "Hired":
            application.job.status = "In Progress"
            application.job.save()
            # self.trigger_payment(request, application)

        return Response({"message": f"Application status updated to {new_status}."}, status=status.HTTP_200_OK)

    # def trigger_payment(self, request, application):
    #     # Get the job and payment details
    #     job = application.job
    #     amount = job.pay_rate  # Assuming you use the job pay rate as the amount to pay the caretaker
    #     phone_number = job.customer.phone_number  # Customer phone number for the payment

    #     # Initiate payment using M-Pesa Daraja API
    #     mpesa_token = get_mpesa_token()  # Get the token
    #     response = lipa_na_mpesa_payment(phone_number, amount, "your_shortcode", "your_lipa_na_mpesa_shortcode", "your_shortcode_secret", mpesa_token)

    #     # You can handle the payment status and update your job and payment status accordingly
    #     if response['ResponseCode'] == '0':  # If payment was successful
    #         job.status = 'Closed'  # Mark the job as closed after payment
    #         job.save()
    #         # Optionally, notify the caretaker about the successful hire and payment
    #         self.notify_caretaker(application.caretaker)

    # def notify_caretaker(self, caretaker):
    #     # Send a notification (email/SMS/other) to the caretaker about the successful hire
    #     pass

    #     return Response({"message": f"Application status updated to {new_status}."}, status=status.HTTP_200_OK)



# ✅ Create & Edit School Profile (Only for Vocational School Managers)
class VocationalSchoolView(APIView):
    permission_classes = []

    def get(self, request):
        try:
            school = request.user.school
        except VocationalSchool.DoesNotExist:
            return Response({"error": "School profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = VocationalSchoolSerializer(school)
        return Response(serializer.data)


    def post(self, request):
        if request.user.role != "vocational_school":
            return Response({"error": "Only vocational school managers can create a school"}, status=status.HTTP_403_FORBIDDEN)
        
        print("Authenticated User:", request.user)  # Debugging
        print("User Role:", getattr(request.user, "role", None))

        # Convert request data into a mutable copy and add manager
        data = request.data.copy()
        data["manager"] = request.user.id  # Pass user ID, not user object

        serializer = VocationalSchoolSerializer(data=data, context={"request": request})

        if serializer.is_valid():
            serializer.save()  # Save instance
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        try:
            school = VocationalSchool.objects.get(manager=request.user)
        except VocationalSchool.DoesNotExist:
            return Response({"error": "School profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = VocationalSchoolSerializer(school, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(manager=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VocationalSchoolListView(APIView):
    permission_classes = []

    def get(self, request):
        schools = VocationalSchool.objects.all()
        serializer = VocationalSchoolSerializer(schools, many=True)
        return Response(serializer.data)



class CourseView(APIView):
    permission_classes = []

    # Get all courses
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    # Add a new course
# Fix course creation in CourseView
    def post(self, request):
        if request.user.role != "vocational_school":
            return Response(
                {"error": "Only vocational school managers can add courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            school = request.user.school  # Ensure user has an associated school
        except VocationalSchool.DoesNotExist:
            return Response({"error": "School profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(school=school)  # Associate course with the user's school
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Edit an existing course
    def put(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != "vocational_school" or course.school != request.user.school:
            return Response({"error": "You are not authorized to edit this course"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, course_id):
        if request.user.role != "vocational_school":
            return Response({"error": "Only school managers can update course status"}, status=status.HTTP_403_FORBIDDEN)

        try:
            course = Course.objects.get(id=course_id, school=request.user.school)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        course.status = "closed" if course.status == "open" else "open"
        course.save()

        return Response({"message": f"Course is now {course.status}"}, status=status.HTTP_200_OK)
    
    # Delete a course
    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != "vocational_school" or course.school != request.user.school:
            return Response({"error": "You are not authorized to delete this course"}, status=status.HTTP_403_FORBIDDEN)

        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SchoolCoursesView(APIView):
    def get(self, request, school_id):
        try:
            school = VocationalSchool.objects.get(id=school_id)
        except VocationalSchool.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

        courses = Course.objects.filter(school=school)
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class EnrollmentAPIView(APIView):
    permission_classes = []  

    def post(self, request, course_id, *args, **kwargs):
        user = request.user 
        course = Course.objects.get(id=course_id)  # Get the course based on course_id from URL

        if not course:
            return Response({"detail": "Course not found."}, status=status.HTTP_404_NOT_FOUND)

        if Enrollment.objects.filter(caretaker=user, course=course).exists():
            return Response({"detail": "You are already enrolled in this course."}, status=status.HTTP_400_BAD_REQUEST)
        
        if course.status == "closed":
                    return Response({"detail": "This course is currently closed for enrollment."}, status=status.HTTP_400_BAD_REQUEST)

        name = request.data.get('name')
        email = request.data.get('email')
        age = request.data.get('age')

        # Check if all necessary details are provided
        if not name or not email or not age:
            return Response({"detail": "Name, email, and age are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new enrollment record
        enrollment = Enrollment.objects.create(
            caretaker=user,
            course=course,
            name=name,
            email=email,
            age=age
        )

        # Serialize the enrollment object to return the response
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SchoolEnrollmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, school_id):
        if request.user.role != "vocational_school":
            return Response({"error": "Only school managers can view enrollments"}, status=status.HTTP_403_FORBIDDEN)

        try:
            school = VocationalSchool.objects.get(id=school_id)
        except VocationalSchool.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

        enrollments = Enrollment.objects.filter(course__school=school)
        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Approve Enrollments (Only School Managers)
class ApproveEnrollmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, enrollment_id):
        if request.user.role != "vocational_school":
            return Response({"error": "Only school managers can approve enrollments"}, status=status.HTTP_403_FORBIDDEN)

        try:
            enrollment = Enrollment.objects.get(id=enrollment_id, course__school=request.user.school)
        except Enrollment.DoesNotExist:
            return Response({"error": "Enrollment not found"}, status=status.HTTP_404_NOT_FOUND)

        enrollment.approved = True
        enrollment.save()
        return Response({"message": "Enrollment approved"}, status=status.HTTP_200_OK)


# ✅ Approve Certifications (Only School Managers)
class ApproveCertificationView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, certification_id):
        if request.user.role != "vocational_school":
            return Response({"error": "Only school managers can approve certifications"}, status=status.HTTP_403_FORBIDDEN)

        try:
            certification = Certification.objects.get(id=certification_id, enrollment__course__school=request.user.school)
        except Certification.DoesNotExist:
            return Response({"error": "Certification not found"}, status=status.HTTP_404_NOT_FOUND)

        certification.approved = True
        certification.save()
        return Response({"message": "Certification approved"}, status=status.HTTP_200_OK)


