# api/serializers.py
from rest_framework import serializers,permissions
from django.contrib.auth.models import User
from .models import Organization, Kudo, UserProfile

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    organization = serializers.CharField(source='userprofile.organization.name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'organization']

class KudoSerializer(serializers.ModelSerializer):
    sender   = UserSerializer(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Kudo
        fields = ['id', 'sender', 'receiver', 'message', 'created_at']
        read_only_fields = ['created_at']

    def validate_message(self, msg):
        if not msg.strip():
            raise serializers.ValidationError("Message cannot be empty.")
        return msg
class IsInSameOrg(permissions.BasePermission):
    """
    Allows access only to objects where the request.user’s organization
    matches the object’s related user profile organization.
    """
    def has_object_permission(self, request, view, obj):
        # obj may be a User or a Kudo instance
        # for Users, obj.userprofile.org must match
        # for Kudos, check sender or receiver profile
        user_org = getattr(request.user, 'userprofile', None)
        if not user_org:
            return False

        # If object is a User
        if hasattr(obj, 'userprofile'):
            return obj.userprofile.organization == user_org.organization

        # If object is a Kudo
        if hasattr(obj, 'sender') and hasattr(obj, 'receiver'):
            return (
                obj.sender.userprofile.organization == user_org.organization and
                obj.receiver.userprofile.organization == user_org.organization
            )

        return False