

# Create your models here.
from django.db import models
from auth_service.models import CustomUser

class Feedback(models.Model):
    SENTIMENT_CHOICES = (
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    )
    manager = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='feedback_given')
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='feedback_received')
    strengths = models.TextField()
    improvement_areas = models.TextField()
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES)
    acknowledged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
