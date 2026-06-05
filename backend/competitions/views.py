from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.core.mail import EmailMultiAlternatives, send_mail # Add EmailMultiAlternatives
from django.utils.html import strip_tags # Add this import
from django.template.loader import render_to_string # Optional, but good practice for complex emails
from django.conf import settings
from .models import Competition, Module, TeamMembers, CompTeam 
from .serializers import (
    CompetitionSerializer,
    ModuleSerializer,
    RegisterCompSerializer,
    CompTeamSerializer,
)
def send_registration_email(user, competition, team_members_queryset):
    """
    Sends a confirmation email (both HTML and plain text) to the user after 
    successful competition registration.
    """
    leader = user
    competition_name = competition.event_name
    
    # Get the names of the team members
    member_names = [member.name for member in team_members_queryset]
    
    # Construct the members string for plain text
    if member_names:
        all_members_str = f"- {leader.fullname} (Team Leader)\n"
        all_members_str += "\n".join([f"- {name}" for name in member_names])
    else:
        all_members_str = f"- {leader.fullname} (Team Leader)"

    # Construct the members HTML list
    if member_names:
        all_members_html = f"<li>{leader.fullname} (Team Leader)</li>"
        all_members_html += "".join([f"<li>{name}</li>" for name in member_names])
    else:
        all_members_html = f"<li>{leader.fullname} (Team Leader)</li>"

    subject = "Alcheringa Registration Confirmed: Get Ready for an Unforgettable Experience!"
    from_email = settings.EMAIL_HOST_USER
    to = [user.email]

    # --- HTML Version ---
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }}
        .container {{
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        .header {{
            background-color: #1a1a1a; /* Dark background for header */
            color: #e67e22; /* Alcheringa orange accent */
            padding: 20px;
            text-align: center;
        }}
        .header h2 {{
            margin: 0;
            font-size: 24px;
        }}
        .content {{
            padding: 30px;
        }}
        .warning-box {{
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
        }}
        .team-list {{
            background-color: #f9f9f9;
            border-left: 4px solid #e67e22;
            padding: 15px 20px;
            margin: 20px 0;
        }}
        .team-list ul {{
            margin: 0;
            padding-left: 20px;
        }}
        .team-list li {{
            margin-bottom: 5px;
        }}
        .footer {{
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eaeaea;
        }}
        .contact-info {{
            margin-top: 10px;
            font-weight: bold;
            color: #555;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>ALCHERINGA 2026</h2>
        </div>
        <div class="content">
            <p>Hello <strong>{leader.fullname}</strong>,</p>

            <div class="warning-box">
                THIS IS NOT THE FINAL CONFIRMATION MAIL FOR PARTICIPATION.<br>
                YOU WILL RECEIVE FINAL CONFIRMATION AFTER VERIFICATION.
            </div>

            <p>We're delighted to inform you that your registration for Alcheringa, IIT Guwahati's annual cultural fest, is <strong>confirmed</strong>!</p>
            
            <p>Your registration for the competition <strong style="color: #e67e22;">{competition_name}</strong> has been verified, and we're currently in the process of finalizing participant selections.</p>
            
            <p>Expect an email from the Alcheringa team soon, confirming your selection for active participation in the upcoming festivities.</p>
            
            <p>Exciting news is on the way! We can't wait for you to be a part of this incredible cultural celebration.</p>

            <p>Your registered team is:</p>
            <div class="team-list">
                <ul>
                    {all_members_html}
                </ul>
            </div>

            <p>Warm regards,</p>
            <p><strong>Team PR & Branding,<br>Alcheringa 2026</strong></p>
        </div>
        <div class="footer">
            For further queries contact:
            <div class="contact-info">
                Khushi Gupta: +91 9864875424<br>
                Shashank Daga: +91 8240950055
            </div>
            <p style="margin-top: 20px;">© 2025 Alcheringa, IIT Guwahati. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
"""

    # --- Plain Text Version (Fallback) ---
    text_content = f"""
Hello {leader.fullname},

*** THIS IS NOT THE FINAL CONFIRMATION MAIL FOR PARTICIPATION. YOU WILL RECEIVE FINAL CONFIRMATION AFTER VERIFICATION. ***

We're delighted to inform you that your registration for Alcheringa, IIT Guwahati's annual cultural fest, is confirmed! 
Your registration for the competition {competition_name} has been verified, and we're currently in the process of finalizing participant selections. 

Expect an email from the Alcheringa team soon, confirming your selection for active participation in the upcoming festivities.
Exciting news is on the way! We can't wait for you to be a part of this incredible cultural celebration.

Your registered team is:
{all_members_str}

Warm regards,
Team PR & Branding, 
Alcheringa 2026

For further queries contact:
Khushi Gupta: +91 9864875424
Shashank Daga: +91 8240950055
"""

    try:
        email = EmailMultiAlternatives(
            subject,
            text_content,
            from_email,
            to
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
    except Exception as e:
        print(f"Error sending registration email to {user.email}: {e}")
# ------------------------------
# FIXED Competition Detail View (GET only)
# ------------------------------
class CompetitionDetailView(generics.RetrieveAPIView):
    """
    Used to fetch a single competition by ID (GET request).
    Example: GET /api/competitions/<uuid:pk>/
    """
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    
    
class MyRegisteredCompetitionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        teams = CompTeam.objects.filter(leader=request.user)
        serializer = CompTeamSerializer(teams, many=True)
        return Response(serializer.data)


# ------------------------------
# Existing view: show all competitions (kept as is)
# ------------------------------
class ShowAllCompetitionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        modulequery = request.GET.get('module') or None
        modulefilter1 = request.GET.get('filter1') or None
        modulefilter2 = request.GET.get('filter2') or None
        compfilter3 = request.GET.get('filter3') or None

        module_comp = Competition.objects.all()
        module = None

        # Filter by module
        if modulequery:
            module = Module.objects.filter(
                module_query_name_without_spaces_all_small=modulequery
            ).first()
            if module:
                module_comp = module_comp.filter(module=module)

        # Filter by members
        if modulefilter1:
            if modulefilter1 == '0':
                module_comp = module_comp.exclude(max_members=1)
            else:
                module_comp = module_comp.filter(min_members=1, max_members=1)

        # Filter by online flag
        if modulefilter2 in ['0', '1']:
            module_comp = module_comp.filter(event_mode=bool(int(modulefilter2)))

        # Filter by event name search
        if compfilter3:
            flt3 = compfilter3.replace("+", " ")
            module_comp = module_comp.filter(event_name__icontains=flt3)

        competitions_data = CompetitionSerializer(module_comp, many=True).data
        modules_data = ModuleSerializer(Module.objects.order_by('-id'), many=True).data
        event_names = list(Competition.objects.values_list('event_name', flat=True))

        return Response({
            'modules': modules_data,
            'allcomp': competitions_data,
            'modulename': module.module_query_name_without_spaces_all_small if module else "",
            'active_page': 'competitions',
            'data': event_names
        })


# ------------------------------
# ViewSet for fetching all competitions
# ------------------------------
class CompetitionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This ViewSet is used by your React frontend to get competitions.
    Example:
        GET /api/competitions/
        GET /api/competitions/<id>/
    """
    queryset = Competition.objects.all().order_by('event_name')
    serializer_class = CompetitionSerializer
    permission_classes = [AllowAny]


# ------------------------------
# FIXED: Registration View
# ------------------------------
class RegisterCompetitionView(APIView):
    """
    Handles team registration for a competition.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Step 1: Validate competition ID
        competition_id = request.data.get('competition_id')
        if not competition_id:
            return Response({"error": "Competition ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found."}, status=status.HTTP_404_NOT_FOUND)

        # Step 2: Prevent duplicate registration by same leader
        existing_team = CompTeam.objects.filter(event=competition, leader=request.user).first()
        if existing_team:
            return Response({"error": "You have already registered for this competition."}, status=status.HTTP_400_BAD_REQUEST)
        # --- START CHANGE ---
        # 1. Retrieve team name directly from the logged-in user's profile
        try:
            # Access the 'team' related object defined in your User models.py
            team_name = request.user.team.name
            
            # Fallback if the name is somehow blank in the database
            if not team_name:
                 team_name = f"{request.user.fullname}'s Team"
                 
        except Exception:
            # Fallback safety if the user has no Team object yet
            team_name = f"{request.user.fullname}'s Team"
        # --- END CHANGE ---

        # Step 3: Prepare data for serializer
        serializer_data = {
            "event": str(competition.id),
            "leader": str(request.user.id),
            "team_name": team_name,  # <-- Using the retrieved name here,
            "team_members": request.data.get('team_members', []),  # ✅ fixed field name
            # ADD THESE TWO LINES:
            'team_video': request.data.get('team_video'), 
            'description': request.data.get('description')
        }

        # Step 4: Validate and save
        serializer = RegisterCompSerializer(data=serializer_data)
        if serializer.is_valid():
            # --- THIS IS THE KEY CHANGE ---
            
            comp_team = serializer.save(
                leader=request.user, 
                event=competition  # This is the corrected line
            )

            # 2. Get the list of members who were just registered
            registered_members = comp_team.members.all()

            # 3. Call the email function with all the info
            send_registration_email(
                user=request.user,
                competition=competition,
                team_members_queryset=registered_members
            )
            
            # 4. Return the original success response
            return Response(
                {"message": "Registration successful!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test


# This decorator ensures ONLY superusers can see this page
@user_passes_test(lambda u: u.is_superuser, login_url='/admin/login/')
def superuser_dashboard(request):
    teams_qs = CompTeam.objects.select_related('event', 'leader')\
                               .prefetch_related('members', 'compteams2')\
                               .all()

    table_data = []
    
    for team in teams_qs:
        leader = team.leader
        l_city = getattr(leader, 'city', '-')
        l_college = getattr(leader, 'collegename', '-')
        l_alcher_id = getattr(leader, 'alcherid', '-')
        l_name = getattr(leader, 'fullname', '-')
        l_phone = getattr(leader, 'phone_number', '-')
        l_email = getattr(leader, 'email', 'N/A')

        l_contact = f"{l_phone} | {l_email}"

        submission = team.compteams2.first()
        perf_link = submission.link if submission else ""
        desc = submission.description if submission else "-"

        # --- UPDATED SECTION: DETAILED MEMBERS LIST ---
        members_list = []
        for m in team.members.all():
            # Handle empty values gracefully
            m_phone = m.phone if m.phone else "N/A"
            m_email = m.email if m.email else "N/A"
            
            # Format:Name - Phone - Email
            # Using ' || ' as a separator so it doesn't break CSV commas
            details = f"[Name: {m.name} | Phone: {m_phone} | Email: {m_email}]"
            members_list.append(details)
        
        # Join all members into one long string separated by " || "
        members_str = " || ".join(members_list)
        # -----------------------------------------------

        row = {
            'team_name': team.team_name,
            'competition': team.event.event_name,
            'city': l_city,
            'college': l_college,
            'alcher_id': l_alcher_id,
            'leader_name': l_name,
            'leader_contact': l_contact,
            'participants': members_str, # <-- Now contains full details
            'link': perf_link,
            'description': desc,
        }
        table_data.append(row)

    context = {'table_data': table_data}
    return render(request, 'competitions/dashboard.html', context)