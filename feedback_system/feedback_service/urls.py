from rest_framework.routers import DefaultRouter
from .views import FeedbackViewSet, ManagerDashboardView, EmployeeDashboardView
from django.urls import path, include

router = DefaultRouter()
router.register('feedback', FeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/manager/', ManagerDashboardView.as_view(), name='manager-dashboard'),
    path('dashboard/employee/', EmployeeDashboardView.as_view(), name='employee-dashboard'),
]
