from django.conf import settings
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from . import models as tj_models
from . import serializer
import logging
import json
from celery import shared_task
from django.utils.decorators import method_decorator

# Get an instance of a logger
logger = logging.getLogger(__name__)


@shared_task
def run_async(task_request, serializer):
    return task_request(serializer)


CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


class TJModelViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    @method_decorator(cache_page(CACHE_TTL))
    @method_decorator(vary_on_cookie)
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if type(serializer.initial_data) is not list:
            serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        run_async(self.perform_create,serializer)
        logger.info(f'Criado: {serializer.data}')
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserViewSet(TJModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializer.UserSerializer


class ComarcaViewSet(TJModelViewSet):
    queryset = tj_models.Comarca.objects.all()
    serializer_class = serializer.ComarcaSerializer


class ServentiaViewSet(TJModelViewSet):
    queryset = tj_models.Serventia.objects.all()
    serializer_class = serializer.ServentiaSerializer


class CompetenciaViewSet(TJModelViewSet):
    queryset = tj_models.Competencia.objects.all()
    serializer_class = serializer.CompetenciaSerializer


class AssuntoViewSet(TJModelViewSet):
    queryset = tj_models.Assunto.objects.all()
    serializer_class = serializer.AssuntoSerializer


class TipoPersonagemViewSet(TJModelViewSet):
    queryset = tj_models.TipoPersonagem.objects.all()
    serializer_class = serializer.TipoPersonagemSerializer


class ClasseViewSet(TJModelViewSet):
    queryset = tj_models.Classe.objects.all()
    serializer_class = serializer.ClasseSerializer


class ClasseAssuntoViewSet(TJModelViewSet):
    queryset = tj_models.ClasseAssunto.objects.all()
    serializer_class = serializer.ClasseAssuntoSerializer


class TipoMovimentoViewSet(TJModelViewSet):
    queryset = tj_models.TipoMovimento.objects.all()
    serializer_class = serializer.TipoMovimentoSerializer


class TipoAndamentoViewSet(TJModelViewSet):
    queryset = tj_models.TipoAndamento.objects.all()
    serializer_class = serializer.TipoAndamentoSerializer


class CargoViewSet(TJModelViewSet):
    queryset = tj_models.Cargo.objects.all()
    serializer_class = serializer.CargoSerializer


class FuncionarioViewSet(TJModelViewSet):
    queryset = tj_models.Funcionario.objects.all()
    serializer_class = serializer.FuncionarioSerializer


class ProcessoViewSet(TJModelViewSet):
    queryset = tj_models.Processo.objects.all()
    serializer_class = serializer.ProcessoSerializer


class TipoDecisaoRecursoViewSet(TJModelViewSet):
    queryset = tj_models.TipoDecisaoRecurso.objects.all()
    serializer_class = serializer.TipoDecisaoRecursoSerializer


class TipoAtoJuizViewSet(TJModelViewSet):
    queryset = tj_models.TipoAtoJuiz.objects.all()
    serializer_class = serializer.TipoAtoJuizSerializer


class AtoJuizViewSet(TJModelViewSet):
    queryset = tj_models.AtoJuiz.objects.all()
    serializer_class = serializer.AtoJuizSerializer


class TipoDocumentoViewSet(TJModelViewSet):
    queryset = tj_models.TipoDocumento.objects.all()
    serializer_class = serializer.TipoDocumentoSerializer
