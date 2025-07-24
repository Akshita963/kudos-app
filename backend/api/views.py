# api/views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Organization, Kudo, UserProfile
from .serializers import OrganizationSerializer, UserSerializer, KudoSerializer
from .permissions import IsInSameOrg
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView

class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # only users in your org
        org = self.request.user.userprofile.organization
        return User.objects.filter(userprofile__organization=org)

class KudoViewSet(viewsets.ModelViewSet):
    serializer_class = KudoSerializer
    permission_classes = [permissions.IsAuthenticated, IsInSameOrg]

    def get_queryset(self):
        user = self.request.user
        qs = Kudo.objects.all()
        t = self.request.query_params.get('type')
        if t == 'sent':
            return qs.filter(sender=user).order_by('-created_at')
        return qs.filter(receiver=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
