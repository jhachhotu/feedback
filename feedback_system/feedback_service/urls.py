from rest_framework.routers import DefaultRouter
from .views import FeedbackViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
