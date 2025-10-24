from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    RegisterView, VerifyOTPView, LoginView, ProfileView, homepage, ParticipantviewSet,
    google_complete_profile, complete_profile, google_login,
    TeamMembersViewSet, TeamViewSet, PriceViewSet,
    # Import the new views for password reset
    ForgotPasswordView, ResetPasswordConfirmView,ProfileUpdateView
)

Participant_list =  ParticipantviewSet.as_view({
    'get': 'list',
    'post': 'create'
})

Participant_detail =  ParticipantviewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
    'get': 'list'
})

router = DefaultRouter()
router.register(r"team-members", TeamMembersViewSet, basename="team-member")
router.register(r"teams", TeamViewSet, basename="team")
router.register(r"prices", PriceViewSet)


urlpatterns = [
    path('', homepage, name='homepage'),

    # Auth routes
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    
    # --- UPDATED: New Password Reset URLs ---
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password-confirm/', ResetPasswordConfirmView.as_view(), name='reset-password-confirm'),

    path('profile/', ProfileView.as_view(), name='profile'),
    
    # +++ START: ADDED FOR EDIT PROFILE +++
    path('auth/edit-profile/', ProfileUpdateView.as_view(), name='edit-profile'),
    # +++ END: ADDED FOR EDIT PROFILE +++

    # Google authentication
    path('accounts/', include('allauth.urls')),
    path('auth/google/', google_login, name='google_login'),
    path('auth/google/complete/', google_complete_profile, name='google_complete_profile'),
    path('auth/complete-profile/', complete_profile, name='complete_profile'),

    # DRF router endpoints
    path('', include(router.urls)),
    path('Participant/',  Participant_list, name=' Participant-list'),
    path('Participant/<uuid:pk>/',  Participant_detail, name=' Participant-detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)