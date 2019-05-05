from rest_framework import routers
from . import views as api_views
from leads.api import LeadViewSet

models = routers.DefaultRouter()
models.register('users', api_views.UserViewSet)
models.register('assuntos', api_views.AssuntoViewSet)
models.register('classes', api_views.ClasseViewSet)
models.register('comarcas', api_views.ComarcaViewSet)
models.register('competencias', api_views.CompetenciaViewSet)
models.register('serventias', api_views.ServentiaViewSet)
models.register('serventias', api_views.ServentiaViewSet)
models.register('classesassuntos', api_views.ClasseAssuntoViewSet)
models.register('processos', api_views.ProcessoViewSet)
models.register('tipospersonagem', api_views.TipoPersonagemViewSet)
models.register('tiposmovimento', api_views.TipoMovimentoViewSet)
models.register('tiposandamento', api_views.TipoAndamentoViewSet)
models.register('cargos', api_views.CargoViewSet)
models.register('funcionarios', api_views.FuncionarioViewSet)
models.register('tiposdecisaorecurso', api_views.TipoDecisaoRecursoViewSet)
models.register('tiposatojuiz', api_views.TipoAtoJuizViewSet)
models.register('atosjuiz', api_views.AtoJuizViewSet)
models.register('tiposdocumento', api_views.TipoDocumentoViewSet)
models.register('leads', LeadViewSet, 'leads')