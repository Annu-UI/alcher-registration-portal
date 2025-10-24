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

    class Meta:
        model = CompTeam
        fields = ['event', 'leader', 'team_name', 'team_members']

    def create(self, validated_data):
        members_data = validated_data.pop('team_members')
        comp_team = CompTeam.objects.create(**validated_data)
        for member_name in members_data:
            member = TeamMembers.objects.create(name=member_name)
            comp_team.members.add(member)
        return comp_team

