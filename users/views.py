# src/views.py

from rest_framework import generics, status, permissions
from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import RegistrationSession, NewUser, TeamMembers, Team, Price
from .serializers import RegisterSerializer, VerifyOTPSerializer, LoginSerializer, ProfileSerializer , TeamMembersSerializer, TeamSerializer, PriceSerializer, ForgotPasswordSerializer, ResetPasswordConfirmSerializer ,ProfileUpdateSerializer
from django.core.mail import send_mail
from django.conf import settings
import secrets
from django.utils import timezone
from datetime import timedelta

from django.db.models import Q 

from allauth.socialaccount.models import SocialAccount
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from .models import  TeamMembers
from .serializers import ParticipantSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view

def clean_old_unverified_users():
    cutoff = timezone.now() - timedelta(minutes=5)
    NewUser.objects.filter(
        is_active=False,
        verified_email=False,
        date_joined__lt=cutoff
    ).delete()


def send_otp_email(user):
    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP code is {user.otp}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False,
    )

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        """
        Overrides the default create method to handle existing but unverified users
        based ONLY on their email address.
        """
        clean_old_unverified_users()

        email = request.data.get('email')

        # Check for an existing user using ONLY the email field.
        existing_user = NewUser.objects.filter(email=email).first()

        if existing_user:
            # Case 1: An existing user with this email is found
            if existing_user.verified_email:
                # User is fully verified, so this is a legitimate conflict.
                return Response(
                    {'email': 'new user with this email address already exists.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # User exists but is NOT verified. Update them and resend the OTP.
                serializer = self.get_serializer(instance=existing_user, data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                send_otp_email(user)
                return Response(serializer.data, status=status.HTTP_200_OK)

        # Case 2: No user with this email found. Proceed with standard creation.
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = serializer.save()
        send_otp_email(user)

class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        try:
            user = NewUser.objects.get(email=email)

            if user.otp != otp or not user.is_otp_valid():
                return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

            # --- MODIFICATION START ---
            # Differentiate flow based on user's active status
            if user.is_active:
                # This is a PASSWORD RESET flow for an existing, active user
                user.otp_used = True
                
                # Generate a secure, temporary token for password reset
                token = secrets.token_urlsafe(32)
                user.password_reset_token = token
                user.password_reset_expiry = timezone.now() + timedelta(minutes=10) # Token expires in 10 minutes
                user.save()
                
                return Response({
                    "detail": "OTP verified successfully. Proceed to reset password.",
                    "reset_token": token
                })
            else:
                # This is the original REGISTRATION flow
                user.is_active = True
                user.otp_used = True
                user.verified_email = True
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': ProfileSerializer(user).data,
                })
            # --- MODIFICATION END ---
                
        except NewUser.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

# --- NEW VIEW 1: ForgotPasswordView ---
class ForgotPasswordView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        try:
            user = NewUser.objects.get(email=email, is_active=True)
            user.generate_otp()
            send_otp_email(user)
            return Response({"detail": "An OTP has been sent to your email address."}, status=status.HTTP_200_OK)
        except NewUser.DoesNotExist:
            return Response({"detail": "No active account found with this email address."}, status=status.HTTP_404_NOT_FOUND)

# --- NEW VIEW 2: ResetPasswordConfirmView ---
class ResetPasswordConfirmView(generics.GenericAPIView):
    serializer_class = ResetPasswordConfirmSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']

        try:
            user = NewUser.objects.get(password_reset_token=token)
            
            if user.password_reset_expiry < timezone.now():
                return Response({"detail": "Password reset token has expired."}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(password)
            # Invalidate the token after use
            user.password_reset_token = None
            user.password_reset_expiry = None
            user.save()
            
            return Response({"detail": "Your password has been reset successfully."}, status=status.HTTP_200_OK)
        except NewUser.DoesNotExist:
            return Response({"detail": "Invalid password reset token."}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def get(self, request):
        return Response({
            "detail": "Send POST request with email and password",
            "format": {
                "email": "user@example.com",
                "password": "yourpassword"
            }
        })
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(email=serializer.validated_data['email'], password=serializer.validated_data['password'])
        if user and user.is_active:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': ProfileSerializer(user).data,
            })
        return Response({'detail': 'Invalid credentials or account not activated.'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_object(self):
        return self.request.user
    
    # +++ START: ADDED FOR EDIT PROFILE +++
class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # After updating, re-serialize the user object with the read-only ProfileSerializer
        # to get all fields, including the updated team_name.
        updated_user_data = ProfileSerializer(instance, context={'request': request}).data
        
        return Response({"user": updated_user_data})
# +++ END: ADDED FOR EDIT PROFILE +++
    
class TeamMembersViewSet(viewsets.ModelViewSet):
    queryset = TeamMembers.objects.all() 
    serializer_class = TeamMembersSerializer
    permission_classes = [IsAuthenticated]
    
    
    
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]


class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer
    permission_classes = [IsAdminUser]  # only admin can manage prices


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def google_complete_profile(request):
    user = request.user
    profile_data = ProfileSerializer(user).data
    refresh = RefreshToken.for_user(user)
    needs_completion = any([
        not user.phone_number,
        not user.collegename,
        not user.city,
        not user.state,
        not hasattr(user, 'team') # <-- ADD THIS CHECK
    ])
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': profile_data,
        'needs_completion': needs_completion
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_profile(request):
    user = request.user
    team_name = request.data.get('team_name')

    user.fullname = request.data.get('fullname', user.fullname)
    user.phone_number = request.data.get('phone_number', user.phone_number)
    user.alternate_phone = request.data.get('alternate_phone', user.alternate_phone)
    user.collegename = request.data.get('collegename', user.collegename)
    user.city = request.data.get('city', user.city)
    user.state = request.data.get('state', user.state)
    user.pixel_highlight = request.data.get('pixel_highlight', user.pixel_highlight)
    user.save()

    # --- STEP 2: Create or update the Team object for this user ---
    if team_name:
        Team.objects.update_or_create(
            leader=user, 
            defaults={'name': team_name}
        )
    user.refresh_from_db()

    return Response({'detail': 'Profile updated', 'user': ProfileSerializer(user).data})


from django.http import HttpResponse
def homepage(request):
    return HttpResponse("Welcome to the homepage!")

@api_view(['GET','POST'])
def google_login(request):
    token = request.data.get('token')
    if not token:
        return Response({'detail': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify token with Google
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), "719905784477-e7cc0nhv3vd6v8r1cmr87asn42bc77uc.apps.googleusercontent.com")
        email = idinfo['email']
        name = idinfo.get('name', '')
        
        picture_url = idinfo.get('picture', None)

        # Get or create the user
        user, created = NewUser.objects.get_or_create(
            email=email,
            defaults={
                'fullname': name,
                'username': email.split('@')[0],
                'provider': 'google',
                'is_active': True,  # Google verified email
                'verified_email': True,
                'profile_pic_url': picture_url
            }
        )
        
        if not created and user.profile_pic_url != picture_url:
            user.profile_pic_url = picture_url
            user.save(update_fields=['profile_pic_url'])

        # Generate refresh & access tokens
        refresh = RefreshToken.for_user(user)

        # Check for profile completion
        needs_completion = any([
            not user.phone_number,
            not user.collegename,
            not user.city,
            not user.state,
            not hasattr(user, 'team') # <-- ADD THIS CHECK
        ])

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': ProfileSerializer(user).data,
            'needs_completion': needs_completion
        })

    except ValueError:
        return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@login_required
def competition_list(request):
    return Response({"message": "List of competitions"})


class ParticipantviewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        try:
            team = user.team
            return team.members.all()
        except Team.DoesNotExist:
            return TeamMembers.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        team_member = serializer.save()
        team, created = Team.objects.get_or_create(
            leader=user,
            defaults={'name': f"{user.fullname}'s Team"}
        )
        team.members.add(team_member)
        user.team_members = team.members.count()
        user.save(update_fields=['team_members'])
    
    def perform_destroy(self, instance):
        user = self.request.user
        try:
            team = user.team
            team.members.remove(instance)
            user.team_members = team.members.count()
            user.save(update_fields=['team_members'])
        except Team.DoesNotExist:
            pass
        instance.delete()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                serializer.data, 
                status=status.HTTP_201_CREATED
            )
        return Response(
            serializer.errors, 
            status=status.HTTP_400_BAD_REQUEST
        )