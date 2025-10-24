from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import NewUser  # Replace with your app and model!

class Command(BaseCommand):
    help = 'Delete unverified user accounts older than 5 minutes'

    def handle(self, *args, **kwargs):
        cutoff = timezone.now() - timedelta(minutes=5)
        count, _ = NewUser.objects.filter(
            is_active=False,
            verified_email=False,
            date_joined__lt=cutoff
        ).delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {count} expired unverified users.'))
