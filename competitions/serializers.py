from rest_framework import serializers
from .models import Module, Competition, CompTeam, SubmitPerformance, TeamMembers

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
    # 1. Add these fields so the API accepts them
    team_video = serializers.URLField(write_only=True, required=False, allow_blank=True)
    description = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = CompTeam
        fields = ['event', 'leader', 'team_name', 'team_members', 'team_video', 'description']

    def create(self, validated_data):
        members_data = validated_data.pop('team_members')
        video_link = validated_data.pop('team_video', None)
        desc_text = validated_data.pop('description', None)
        comp_team = CompTeam.objects.create(**validated_data)
        for member_name in members_data:
            member = TeamMembers.objects.create(name=member_name)
            comp_team.members.add(member)

        SubmitPerformance.objects.create(
            event=comp_team.event,
            team=comp_team,
            link=video_link if video_link else "", # Saves "" if blank
            description=desc_text if desc_text else ""
        )
        return comp_team

