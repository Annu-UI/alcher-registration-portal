from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import RegistrationSession, NewUser, TeamMembers, Team, Price


@admin.register(RegistrationSession)
class RegistrationSessionAdmin(admin.ModelAdmin):
    # list_display = ("id", "fullname", "phone_number", "email", "session_stage", "otp_verified", "created_at")
    # search_fields = ("fullname", "email", "phone_number")
    # list_filter = ("session_stage", "otp_verified", "created_at")
    # readonly_fields = ("created_at",)   
    # list_per_page = 50                  
    # --- USE THIS UPDATED DISPLAY CONFIGURATION ---
    list_display = (
        "id",
        "get_fullname",  # Use a custom method for a nice column name
        "get_email",
        "session_stage",
        "otp_verified",
        "created_at"
    )
    search_fields = ("user__fullname", "user__email", "user__phone_number")
    list_filter = ("session_stage", "otp_verified", "created_at")
    readonly_fields = ("created_at",)
    list_per_page = 50

    # --- ADD THESE METHODS TO FETCH THE DATA ---
    @admin.display(description='Full Name', ordering='user__fullname')
    def get_fullname(self, obj):
        return obj.user.fullname if obj.user else 'N/A'

    @admin.display(description='Email', ordering='user__email')
    def get_email(self, obj):
        return obj.user.email if obj.user else 'N/A'


class CustomUserAdmin(UserAdmin):
    model = NewUser
    list_display = (
        "email", "fullname", "role", "phone_number", "get_team_name",
        "city", "state", "is_active", "percentage_complete", "pixel_highlight",
    )
    @admin.display(description='Team Name', ordering='team__name')
    def get_team_name(self, obj):
        # This safely gets the team name if it exists
        try:
            return obj.team.name
        except obj.team.RelatedObjectDoesNotExist:
            return "No Team"
    list_filter = ("is_active", "is_staff", "role", "gender")
    search_fields = ("email", "fullname", "phone_number", "alcherid")
    ordering = ("email",)
    list_per_page = 50
    readonly_fields = ("get_team_name","date_joined", "otp_created_at", "pixel_highlight")  # safe fields

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("fullname", "username", "gender", "role", "phone_number", "alternate_phone", "img", "about", "pixel_highlight")}),
        ("Team Info", {"fields": ("get_team_name","collegename", "city", "state", "alcherid", "referred_by", "team_members")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Security", {"fields": ("otp", "otp_created_at", "otp_used", "password_reset_token", "password_reset_expiry")}),
        ("Important dates", {"fields": ("date_joined",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "fullname", "gender", "role", "phone_number", "is_active", "is_staff")}
        ),
    )


admin.site.register(NewUser, CustomUserAdmin)

# Register your TeamMembers model as before
@admin.register(TeamMembers)
class TeamMembersAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "name", "phone", "collegename", "city", "state", "accommodation")
    search_fields = ("email", "name", "phone", "memberid")
    list_filter = ("accommodation", "gender")
    list_per_page = 50

# 1. Define the inline class for the members
class TeamMembersInline(admin.TabularInline):
    model = Team.members.through  # Use the auto-created through model
    verbose_name = "Team Member"
    verbose_name_plural = "Team Members"
    extra = 1  # Provides 1 extra blank row for adding new members

# 2. Update your TeamAdmin to use the inline
@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "leader", "accommodation", "blankets", "dues", "total_paid")
    search_fields = ("name", "leader__email")
    list_filter = ("accommodation",)
    list_per_page = 50
    
    # This is the crucial part that adds the inline view
    inlines = [TeamMembersInline]
    
    # 3. (Recommended) Exclude the original 'members' field to prevent it
    # from showing up as a large, confusing multi-select box.
    exclude = ('members',)

@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ("team", "price", "datetime_created", "datetime_updated")
    search_fields = ("team__name", "team__leader__email")
    readonly_fields = ("datetime_created", "datetime_updated")
    list_per_page = 50
