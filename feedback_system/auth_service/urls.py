from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserDetailView, TeamListView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='jwt-login'),
    path('refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    path('me/', UserDetailView.as_view()),
    path('team/', TeamListView.as_view()),
]
