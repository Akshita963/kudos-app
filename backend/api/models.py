# api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from datetime import timedelta

class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} @ {self.organization.name}"

class Kudo(models.Model):
    sender   = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_kudos")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_kudos")
    message  = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # no self‑kudos
        if self.sender == self.receiver:
            raise ValidationError("Cannot send kudos to yourself.")
        # same organization?
        if self.sender.userprofile.organization != self.receiver.userprofile.organization:
            raise ValidationError("Can only send kudos within your organization.")
        # weekly limit
        now = timezone.now()
        start_of_week = now - timedelta(days=now.weekday())
        sent_count = Kudo.objects.filter(
            sender=self.sender, created_at__gte=start_of_week
        ).count()
        if sent_count >= 3:
            raise ValidationError("Weekly limit of 3 kudos reached.")

    def save(self, *args, **kwargs):
        self.full_clean()  # calls clean() →
        super().save(*args, **kwargs)
