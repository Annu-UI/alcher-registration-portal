from rest_framework import serializers
from .models import RegistrationSession, NewUser, TeamMembers, Team, Price
from .models import NewUser
from .models import  TeamMembers

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembers
        fields = ['id', 'name', 'email', 'gender', 'phone', 'collegename', 'city', 'state']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    team_name = serializers.CharField(write_only=True, max_length=150)
    class Meta:
        model = NewUser
        fields = (
            'email', 'username', 'fullname',
            'phone_number', 'alternate_phone',
            'collegename', 'city', 'state',
            'password', 'confirm_password',
            'team_name'
        )

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before passing to create_user
        team_name = validated_data.pop('team_name')
        user = NewUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            fullname=validated_data.get('fullname'),
            collegename=validated_data.get('collegename'),
            city=validated_data.get('city'),
            state=validated_data.get('state'),
            phone_number=validated_data.get('phone_number'),
            alternate_phone=validated_data.get('alternate_phone'),
            password=validated_data['password']
        )
        user.is_active = False  # Not active until OTP verification
        user.generate_otp()
        user.save()
        Team.objects.create(leader=user, name=team_name)
        RegistrationSession.objects.create(user=user, otp=user.otp, otp_created_at=user.otp_created_at)

        return user

    # --- THIS IS THE NEWLY ADDED METHOD ---
    def update(self, instance, validated_data):
        """
        Handle updates for existing (unverified) users.
        """
        # Remove confirm_password as it's not a model field
        validated_data.pop('confirm_password', None)
        team_name = validated_data.pop('team_name', None)
        if team_name:
            Team.objects.update_or_create(leader=instance, defaults={'name': team_name})

        
        # Update password if it's provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        # Update other fields by looping through the validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # This is the crucial step: generate a new OTP for the existing user
        instance.generate_otp()
        instance.save()
        return instance

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

# --- NEW SERIALIZER 1: ForgotPasswordSerializer ---
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

# --- NEW SERIALIZER 2: ResetPasswordConfirmSerializer ---
class ResetPasswordConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

        
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class ProfileSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    img = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = NewUser
        exclude = [
            'password', 'otp', 'otp_created_at', 'otp_used', 'password_reset_token', 'password_reset_expiry'
        ]
        
        # +++ START: ADDED FOR EDIT PROFILE +++
class ProfileUpdateSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(max_length=150, required=False)

    class Meta:
        model = NewUser
        fields = [
            'fullname', 'gender', 'phone_number', 
            'alternate_phone', 'collegename', 'city', 'state', 'team_name','img'
        ]

    def update(self, instance, validated_data):
        # Handle the team_name separately as it's on a related model
        team_name = validated_data.pop('team_name', None)
        if team_name:
            # Get or create a team for the user and update its name
            Team.objects.update_or_create(
                leader=instance,
                defaults={'name': team_name}
            )

        # Update the NewUser instance with the remaining data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
# +++ END: ADDED FOR EDIT PROFILE +++

class TeamMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembers
        fields = "__all__"


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMembersSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = "__all__"


class PriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Price
        fields = "__all__"