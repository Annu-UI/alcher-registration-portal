import uuid, random
from datetime import timedelta
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, Group, Permission
from django.conf import settings
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.crypto import get_random_string

from django.db.models import JSONField #rohit
class RegistrationSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # fullname = models.CharField(max_length=150)
    # phone_number = PhoneNumberField()
    # alternate_phone = PhoneNumberField(blank=True, null=True)
    # username = models.CharField(max_length=150)
    # email = models.EmailField()
    # password = models.CharField(max_length=128)

    # collegename = models.CharField(max_length=150 , null=True , blank=True)
    # city = models.CharField(max_length=150 ,null=True , blank=True)
    # state = models.CharField(max_length=200, null=True , blank=True)
    # OTP
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, # Make it optional for now
        blank=True
    )
    otp = models.CharField(max_length=6, blank=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    otp_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    session_stage = models.CharField(max_length=20, choices=[
        ('profile', 'Profile'),
        ('team', 'Team'),
        ('otp', 'OTP')
    ], default='profile')

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.otp_created_at = timezone.now()
        self.otp_verified = False
        self.save()

    def is_otp_valid(self):
        return (self.otp_created_at
                and not self.otp_verified
                and timezone.now() < self.otp_created_at + timedelta(minutes=5)
        )

GENDER_CHOICES = [('M', _('Male')), ('F', _('Female')), ('O', _('Other'))]
ACCOMMODATION_CHOICES = [('Y', _('Yes')), ('N', _('No'))]
USER_ROLE_CHOICES = [
    ('participant', _('Participant')),
    ('volunteer', _('Volunteer')),
    ('judge', _('Judge')),
    ('sponsor', _('Sponsor')),
    ('organizer', _('Organizer')),
]

def create_new_ref_number():
    base = "ALC-" + str(NewUser.objects.count() + 5001)
    suffix = "-" + get_random_string(length=4)
    alcherid = base + suffix
    if NewUser.objects.filter(alcherid=alcherid).exists():
        return create_new_ref_number()
    return alcherid

class CustomAccountManager(BaseUserManager):
    def create_user(self, email, password, **other_fields):
        if not email:
            raise ValueError(_('You must provide an email address'))
        user = self.model(email=self.normalize_email(email), **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        return self.create_user(email, password, **other_fields)

class NewUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True, db_index=True)
    pixel_highlight = models.JSONField(default=list, blank=True) #rohit
    
    # --- CHANGE 1 OF 2: `unique=True` has been removed from this line ---
    username = models.CharField(max_length=150, blank=True, null=True)
    
    provider = models.CharField(max_length=200, default='email')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    verified_email = models.BooleanField(default=False)
    profile_pic_url = models.CharField(max_length=255, blank=True, null=True)
    password_reset_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_expiry = models.DateTimeField(blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = CustomAccountManager()

    class Meta:
        ordering = ['email']

    groups = models.ManyToManyField(
        Group,
        related_name='newuser_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='newuser_permissions_set',
        blank=True
    )

    # Profile fields
    fullname = models.CharField(max_length=150)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='M')
    role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='participant')
    img = models.ImageField(upload_to="image_uploads/userdp/%Y/%m/%d/", default='user-default.png')
    about = models.TextField(max_length=500, blank=True)
    percentage_complete = models.IntegerField(default=0)
    
    # --- CHANGE 2 OF 2: `unique=True` has been removed from this line ---
    phone_number = PhoneNumberField()
    
    alternate_phone = PhoneNumberField(blank=True, null=True)
    # Team info (required on registration)
    collegename = models.CharField(max_length=150 , null=True , blank=True)
    city = models.CharField(max_length=150 , null=True , blank=True)
    state = models.CharField(max_length=200 , null=True , blank=True)

    alcherid = models.CharField(max_length=255, blank=True, unique=True)
    referred_by = models.CharField(max_length=255, blank=True)
    otp = models.CharField(max_length=6, default='000000')
    otp_created_at = models.DateTimeField(blank=True, null=True)
    otp_used = models.BooleanField(default=False)
    team_members = models.IntegerField(default=0)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.otp_created_at = timezone.now()
        self.otp_used = False
        self.save()

    def is_otp_valid(self):
        return (
            self.otp_created_at and
            not self.otp_used and
            timezone.now() < self.otp_created_at + timedelta(minutes=5)
        )

    def save(self, *args, **kwargs):
        if not self.alcherid:
            self.alcherid = create_new_ref_number()
        required_fields = [
            'fullname', 'email', 'phone_number',
            'collegename', 'city', 'state',
            'gender', 'username'
        ]
        completed = sum(
            getattr(self, f) not in (None, '', self._meta.get_field(f).default)
            for f in required_fields
        )
        self.percentage_complete = (completed * 100) // len(required_fields)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.email)

# The following three models (TeamMembers, Team, Price) remain **untouched**, exactly as in your file.

# --- Unchanged models ---
class TeamMembers(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    memberid = models.CharField(max_length=255, blank=True, unique=True)
    img = models.ImageField(upload_to="image_uploads/userdp/%Y/%m/%d/", default='user-default.png')
    email = models.EmailField()
    name = models.CharField(max_length=150, blank=True)
    phone = PhoneNumberField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    collegename = models.CharField(max_length=150)
    city = models.CharField(max_length=150, blank=True)
    state = models.CharField(max_length=200, blank=True)
    accommodation = models.BooleanField(default=False)
    days_stay = models.IntegerField(default=0)
    accommodation_type = models.CharField(max_length=14, default='none')

    def save(self, *args, **kwargs):
        if not self.memberid:
            self.memberid = f"MEM-{get_random_string(length=4)}-{get_random_string(length=4)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.email)

class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, blank=True, null=True)
    accommodation = models.CharField(max_length=1, choices=ACCOMMODATION_CHOICES, default='N', null=True, blank=True)
    blankets = models.IntegerField(default=0)
    dues = models.IntegerField(default=0)
    total_paid = models.IntegerField(default=0)
    leader = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="team", on_delete=models.CASCADE)
    members = models.ManyToManyField(TeamMembers, related_name="teams") #rohit

    def __str__(self):
        return str(self.leader)

class Price(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='prices')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    datetime_created = models.DateTimeField(auto_now_add=True)
    datetime_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Team {self.team_id}: {self.price}"