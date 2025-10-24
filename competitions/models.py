from django.db import models
import uuid
from email.policy import default
from django.db.models.base import Model
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from django.conf import settings
from competitions.validators import validate_file_extension
from users.models import NewUser,TeamMembers
# Create your models here.



class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.CharField(max_length=127)
    module_query_name_without_spaces_all_small = models.CharField(max_length=127)
    module_icon = models.ImageField(
        upload_to="image_uploads/moduleicons/",
        default="image_uploads/moduleicons/module_icon_default.png"
    )
    module_icon_active = models.ImageField(
        upload_to="image_uploads/moduleicons/active/",
    )

    def __str__(self):
        return self.module

        


class Competition(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(
        Module, related_name='modulename', on_delete=models.CASCADE
    )
    event_name = models.CharField(max_length=255)
    event_short = models.CharField(max_length=255, null=True, blank=True)
    event_tags = models.CharField(max_length=255, null=True, blank=True)
    event_desc = models.CharField(max_length=500)
    event_rules = models.TextField()
    solo_or_group = models.CharField(max_length=10, default="")
    min_members = models.IntegerField(default=1)
    max_members = models.IntegerField(default=1)
    prize_worth = models.CharField(max_length=255)
    event_mode = models.CharField(max_length=10, default="true")
    image = models.ImageField(
        upload_to="image_uploads/event_pics/",
        default="image_uploads/event_pics/event_default.png"
    )
    showPeformanceLink = models.BooleanField(default=True)
    portalUrl = models.CharField(max_length=50, default='', blank=True)

    def __str__(self):
        return self.event_name



class CompTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Competition, related_name="event_name1", on_delete=models.CASCADE)
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="teams_leader", on_delete=models.CASCADE)
    team_name=models.CharField(max_length=255,default="undefined")
    members = models.ManyToManyField(TeamMembers)

    def __str__(self):
        return str(self.leader)


class SubmitPerformance(models.Model):
    event = models.ForeignKey(
        Competition, related_name="event_name2", on_delete=models.CASCADE)
    team = models.ForeignKey(
        CompTeam, related_name="compteams2", on_delete=models.CASCADE)
    link = models.URLField(max_length=2000, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    