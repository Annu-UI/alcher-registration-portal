from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import ShowAllCompetitionsView, RegisterCompetitionView, CompetitionDetailView, CompetitionViewSet, MyRegisteredCompetitionsView, superuser_dashboard

router = DefaultRouter()
router.register(r'competitions', CompetitionViewSet, basename='competition')

urlpatterns = [
    # All competitions (for frontend grid)
    path('competitions/', ShowAllCompetitionsView.as_view(), name='show_all_competitions'),

    # Competition detail (for RegisterPage)
    path('competitions/<uuid:pk>/', CompetitionDetailView.as_view(), name='competition_detail'),

    # Register team for competition
    path('register-competition/', RegisterCompetitionView.as_view(), name='register_competition'),
    
    # My registered competitions
    path('my-registered-competitions/', MyRegisteredCompetitionsView.as_view(), name='my_registered_competitions'),

    # Include router URLs
    path('', include(router.urls)),
    path('super-dashboard/', superuser_dashboard, name='super_dashboard'),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)