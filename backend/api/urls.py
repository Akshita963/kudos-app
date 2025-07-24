# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, UserViewSet, KudoViewSet

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='org')
router.register(r'users', UserViewSet, basename='user')
router.register(r'kudos', KudoViewSet, basename='kudo')

urlpatterns = [path('', include(router.urls)),]
