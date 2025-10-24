from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django.core.mail import send_mail
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
    Sends a confirmation email to the user after successful
    competition registration.
    """
    leader = user
    competition_name = competition.event_name
    
    # Get the names of the team members
    member_names = [member.name for member in team_members_queryset]
    
    # Construct the members string, including the team leader
    if member_names:
        # List the leader first, then the other members
        all_members_str = f"- {leader.fullname} (Team Leader)\n"
        all_members_str += "\n".join([f"- {name}" for name in member_names])
    else:
        # This handles if the leader registered solo
        all_members_str = f"- {leader.fullname} (Team Leader)"

    subject = f"Successful Registration for {competition_name}"
    message = f"""
    Hello {leader.fullname},

    You have successfully registered for the competition: {competition_name}.

    Your registered team is:
    {all_members_str}

    We look forward to seeing you at the event!

    Best regards,
    The Alcheringa Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending registration email to {user.email}: {e}") # Log this
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

        # Step 3: Prepare data for serializer
        serializer_data = {
            "event": str(competition.id),
            "leader": str(request.user.id),
            "team_name": request.data.get('team_name', "Untitled Team"),
            "team_members": request.data.get('team_members', []),  # ✅ fixed field name
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