from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserListView,
    CurrentUserView,
    UpdateUserDetailsView,
    CaretakerProfileViewSet,
    CaretakerProfileDetailView,
)
router = DefaultRouter()
router.register(r'caretaker-profiles', CaretakerProfileViewSet, basename='caretaker-profile')

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'), 
    path('update-user/<int:id>/', UpdateUserDetailsView.as_view(), name='update_user'),
    path('api/caretaker-profiles/<int:user_id>/', CaretakerProfileDetailView.as_view(), name='caretaker-profile-detail'),
    path('api/', include(router.urls)),
]

