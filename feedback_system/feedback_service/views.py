# Create your views here.
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from .models import Feedback
from .serializers import FeedbackSerializer
from rest_framework.permissions import IsAuthenticated

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
