from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . views import (
    UserRegistrationView,
    UserLoginView,
    UserListView,
    UserDetailView,
    CurrentUserView,
    UpdateUserDetailsView,
    CaretakerProfileViewSet,
    CaretakerProfileDetailView,
    CaretakerProfileByIdView,
    ReviewListCreateView,
    ChatMessageListView,
    ReplyAPIView,
    JobApplicationListCreateAPIView,
    JobPostListCreateAPIView,
    JobApplicationDetailUpdateAPIView,
    VocationalSchoolView, 
    CourseView, 
    ApproveEnrollmentView,
    ApproveCertificationView,
    EnrollmentAPIView,
    VocationalSchoolListView,
    SchoolCoursesView,
    SchoolEnrollmentsView,
    # caregiver_chat_detail,
    # caregiver_chats,
)

router = DefaultRouter()
router.register(r'caretaker-profiles', CaretakerProfileViewSet, basename='caretaker-profile')


urlpatterns = [
    # JWT Token Authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User registration and login
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    
    # User management
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:user_id>/', UserDetailView.as_view(), name='specific-user'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'), 
    path('update-user/<int:id>/', UpdateUserDetailsView.as_view(), name='update_user'),
    
    # Caretaker profile detail and review
    path('api/caretaker-profiles/user/<int:user_id>/', CaretakerProfileDetailView.as_view(), name='caretaker-profile-detail'),
    
    # Caretaker profile by ID
    path("api/caretaker-profiles/<int:id>/", CaretakerProfileByIdView.as_view(), name="caretaker-profile-by-id"),
    
    # Review path
    path('api/caretaker/<int:caretaker_id>/reviews/', ReviewListCreateView.as_view(), name='caretaker-reviews'),
    path('messages/', ChatMessageListView.as_view(), name='chat-messages'),

    # path("caregiver-chats/", caregiver_chats, name="caregiver-chats"), 
    path('messages/<int:message_id>/replies/', ReplyAPIView.as_view(), name='message-replies'),
    path("messages/<int:sender_id>/", ChatMessageListView.as_view(), name="chat-messag-detail"),

    # Job Post URLs
    path('jobs/', JobPostListCreateAPIView.as_view(), name='job-list-create'),
    path('jobs/<int:job_id>/', JobPostListCreateAPIView.as_view(), name='job-update'),

    # Job Application URLs
    path('applications/', JobApplicationListCreateAPIView.as_view(), name='application-list-create'),
    path('jobs/<int:job_id>/applications/', JobApplicationListCreateAPIView.as_view(), name='job-applications'),
    path('applications/<int:application_id>/update/', JobApplicationDetailUpdateAPIView.as_view(), name='application-update'),

    path("school/", VocationalSchoolView.as_view(), name="school"),
    path("schools/", VocationalSchoolListView.as_view(), name="schools"),
    path("courses/", CourseView.as_view(), name="courses"),
    path("courses/school/<int:school_id>/", SchoolCoursesView.as_view(), name="school-courses"),
    path("courses/<int:pk>/", CourseView.as_view(), name="course-detail"),
    path("courses/<int:course_id>/toggle-status/", CourseView.as_view(), name="toggle-course-status"),
    path('courses/<int:course_id>/enroll/', EnrollmentAPIView.as_view(), name='enroll-course'),
    path("enrollments/school/<int:school_id>/", SchoolEnrollmentsView.as_view(), name="school-enrollments"),
    path("approve-enrollment/<int:enrollment_id>/", ApproveEnrollmentView.as_view(), name="approve-enrollment"),
    path("approve-certification/<int:certification_id>/", ApproveCertificationView.as_view(), name="approve-certification"),
    # Include the router URLs for caretaker profiles
    path('api/', include(router.urls)),
  
]
