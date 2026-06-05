from rest_framework import serializers
from .models import Module, Competition, CompTeam, SubmitPerformance, TeamMembers
from users.models import Team as MainTeam

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = "__all__"

class CompetitionSerializer(serializers.ModelSerializer):
    module = ModuleSerializer()  # nested
    class Meta:
        model = Competition
        fields = "__all__"

class TeamMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMembers
        fields = "__all__"

class CompTeamSerializer(serializers.ModelSerializer):
    event = CompetitionSerializer()
    leader_name = serializers.CharField(source="leader.username", read_only=True)
    members = TeamMembersSerializer(many=True)
    class Meta:
        model = CompTeam
        fields = "__all__"

class SubmitPerformanceSerializer(serializers.ModelSerializer):
    event = CompetitionSerializer()
    team = CompTeamSerializer()
    class Meta:
        model = SubmitPerformance
        fields = "__all__"
        
class RegisterCompSerializer(serializers.ModelSerializer):
    team_members = serializers.ListField(
        child=serializers.CharField(), write_only=True
    )
    team_video = serializers.URLField(write_only=True, required=False, allow_blank=True)
    description = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CompTeam
        fields = ['event', 'leader', 'team_name', 'team_members', 'team_video', 'description']

    def create(self, validated_data):
        members_data = validated_data.pop('team_members')
        video_link = validated_data.pop('team_video', "")
        desc_text = validated_data.pop('description', "")
        
        # Get the leader (user) to look up their original team
        leader_user = validated_data.get('leader')

        # 2. FETCH THE LEADER'S MAIN TEAM MEMBERS (The Source of Truth)
        source_members = []
        try:
            # Check if this leader has a main team
            main_team = MainTeam.objects.get(leader=leader_user)
            source_members = main_team.members.all()
        except MainTeam.DoesNotExist:
            source_members = []

        comp_team = CompTeam.objects.create(**validated_data)
        
        for member_name in members_data:
            # 3. CREATE THE NEW MEMBER OBJECT (Don't save yet)
            new_member = TeamMembers(name=member_name)

            # 4. LOOK UP DETAILS: Try to find this name in the Leader's main list
            # We use 'name__iexact' to ignore case (e.g., "Ali" vs "ali")
            original_data = source_members.filter(name__iexact=member_name).first()

            if original_data:
                # 5. COPY THE DETAILS AUTOMATICALLY
                new_member.email = original_data.email
                new_member.phone = original_data.phone
                new_member.collegename = original_data.collegename
                new_member.city = original_data.city
                new_member.state = original_data.state
                new_member.gender = original_data.gender
                new_member.accommodation = original_data.accommodation
            
            # 6. NOW SAVE
            new_member.save()
            comp_team.members.add(new_member)

        # Create Submission (as verified before)
        SubmitPerformance.objects.create(
            event=comp_team.event,
            team=comp_team,
            link=video_link if video_link else "",
            description=desc_text if desc_text else ""
        )

        return comp_team