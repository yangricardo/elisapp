from django.urls import path
from . import views
from django.views.generic import TemplateView

catchall_views = TemplateView.as_view(template_name='frontend/index.html')

urlpatterns = [
    path('', catchall_views)
]
