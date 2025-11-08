from django.contrib import admin
from .models import Competition  , Module, CompTeam


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ('id', 'event_name', 'module', 'prize_worth', 'event_mode')
    readonly_fields = ('id',)

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'module')
    
@admin.register(CompTeam)
class CompTeamAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'event', 'leader', 'members_list')
    search_fields = ('team_name', 'leader__email')
    
    fields = ('event', 'leader', 'team_name', 'current_members_text')
    readonly_fields = ('current_members_text',)

    def members_list(self, obj):
        return ", ".join([m.name for m in obj.members.all()])
    members_list.short_description = "Members"

    def current_members_text(self, obj):
        # improved to handle missing emails gracefully
        return ", ".join([f"{m.name} ({m.email})" if m.email else m.name for m in obj.members.all()])
    current_members_text.short_description = "Current Team Members"