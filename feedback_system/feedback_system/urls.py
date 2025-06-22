
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
     path('auth/', include('auth_service.urls')),
    path('api/', include('feedback_service.urls')),
]
