"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls import include
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from rest_framework.authtoken import views as rest_views

from api import views as api_views
from auth import urls as auth_urls
from frontend import urls as frontend_urls
from leads.api import LeadViewSet

from . import settings

router = routers.DefaultRouter()
router.register('users', api_views.UserViewSet)
router.register('assuntos', api_views.AssuntoViewSet)
router.register('classes', api_views.ClasseViewSet)
router.register('comarcas', api_views.ComarcaViewSet)
router.register('competencias', api_views.CompetenciaViewSet)
router.register('serventias', api_views.ServentiaViewSet)
router.register('serventias', api_views.ServentiaViewSet)
router.register('classesassuntos', api_views.ClasseAssuntoViewSet)
router.register('processosunicos', api_views.ProcessoUnicoViewSet)
router.register('processos', api_views.ProcessoViewSet)
router.register('tipospersonagem', api_views.TipoPersonagemViewSet)
router.register('tiposmovimento',api_views.TipoMovimentoViewSet)
router.register('tiposandamento',api_views.TipoAndamentoViewSet)
router.register('cargos',api_views.CargoViewSet)
router.register('funcionarios',api_views.FuncionarioViewSet)
router.register('leads', LeadViewSet, 'leads')

urlpatterns = [
    path('', include(frontend_urls)),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('auth/', include(auth_urls))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
