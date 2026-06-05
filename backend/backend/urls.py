from django.contrib import admin
from django.urls import path, include
from competitions.views import ShowAllCompetitionsView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
        path('admin/', admin.site.urls),
        path('api/', include('users.urls')),
        path('', include('users.urls')),
        path('accounts/', include('allauth.urls')),
        path('api/', include('competitions.urls')),
        path('Participantdata/', include('users.urls')),
        path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('competitions/', include('competitions.urls')),
        path('offlineportal/', include('offlinePortal.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)