# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.permissions import IsAuthenticated
from auth_service.models import CustomUser
from rest_framework.views import APIView

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'manager':
            if self.request.query_params.get('all') == 'true':
                return Feedback.objects.all()
            return Feedback.objects.filter(manager=user)
        return Feedback.objects.filter(employee=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'manager':
            raise PermissionDenied("Only managers can give feedback.")
        
        employee = serializer.validated_data['employee']
        if employee.manager != user:
            raise PermissionDenied("You can only give feedback to your own team.")
        
        serializer.save(manager=user)

    @action(detail=True, methods=['patch'], url_path='acknowledge')
    def acknowledge(self, request, pk=None):
        feedback = self.get_object()
        user = request.user
        if user != feedback.employee:
            return Response({'detail': 'Only the employee can acknowledge this feedback.'}, status=403)
        feedback.acknowledged = True
        feedback.save()
        return Response({'detail': 'Feedback acknowledged.'}, status=200)

class ManagerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'manager':
            return Response({'detail': 'Only managers can access this dashboard.'}, status=403)
        team = user.team_members.all()
        data = []
        for member in team:
            feedbacks = Feedback.objects.filter(employee=member)
            sentiment_counts = {
                'positive': feedbacks.filter(sentiment='positive').count(),
                'neutral': feedbacks.filter(sentiment='neutral').count(),
                'negative': feedbacks.filter(sentiment='negative').count(),
            }
            data.append({
                'employee_id': member.id,
                'employee_username': member.username,
                'feedback_count': feedbacks.count(),
                'sentiment_counts': sentiment_counts,
            })
        return Response({'team_overview': data})

class EmployeeDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != 'employee':
            return Response({'detail': 'Only employees can access this dashboard.'}, status=403)
        feedbacks = Feedback.objects.filter(employee=user).order_by('-created_at')
        sentiment_counts = {
            'positive': feedbacks.filter(sentiment='positive').count(),
            'neutral': feedbacks.filter(sentiment='neutral').count(),
            'negative': feedbacks.filter(sentiment='negative').count(),
        }
        timeline = FeedbackSerializer(feedbacks, many=True).data
        return Response({'timeline': timeline, 'sentiment_counts': sentiment_counts})
