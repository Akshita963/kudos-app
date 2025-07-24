# api/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile, Organization

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        # assign a default org if you want, or skip until admin sets it
        org = Organization.objects.first()
        UserProfile.objects.create(user=instance, organization=org)
