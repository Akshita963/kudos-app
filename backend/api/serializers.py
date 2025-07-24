# api/serializers.py
from rest_framework import serializers
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
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Kudo
        fields = ['id','sender','receiver','message','created_at']

    def create(self, validated_data):
        # you’ll need to accept a `receiver_id` param instead
        user_id = self.context['request'].data.get('receiver_id')
        receiver = User.objects.get(pk=user_id)
        return Kudo.objects.create(
            sender=self.context['request'].user,
            receiver=receiver,
            message=validated_data['message']
        )

