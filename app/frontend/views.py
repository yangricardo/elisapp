from __future__ import absolute_import, unicode_literals

import json, re
import logging
from builtins import object
from functools import wraps

from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.core.exceptions import ValidationError
from django.http import Http404, JsonResponse
from django.shortcuts import get_list_or_404 as _get_list_or_404, render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.vary import vary_on_cookie
from django.db.models.functions import Coalesce
from knox.auth import TokenAuthentication
from rest_framework import mixins, pagination, permissions, status, viewsets
from rest_framework.response import Response
from . import models, serializers, permissions as api_permissions
from api import models as tj_models
from backend.celery import cache_pages

# Get an instance of a logger
logger = logging.getLogger(__name__)

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

def get_processo_serializer(processo):
    # obtem advogados associados ao processo e serializa
    return json.loads(json.dumps(serializers.ProcessoSerializer(
                models.Processo.objects.get(processo_tj=processo)
            ).data))

def get_advogados_serializer(processo):
    # obtem advogados associados ao processo e serializa
    return json.loads(json.dumps(serializers.AdvogadoProcessoSerializer(
                models.AdvogadoProcesso.objects.filter(processo_tj=processo),
                many=True
            ).data))

def get_personagens_serializer(processo):
    # obtem personagens associados ao processo e serializa
    return json.loads(json.dumps(serializers.PersonagemProcessoSerializer(
                models.PersonagemProcesso.objects.filter(processo_tj=processo),
                many=True
            ).data))

def get_documentos_serializer(processo):
    # obtem documentos associados ao processo e serializa
    return json.loads(json.dumps(serializers.DocumentoProcessoSerializer(
                models.DocumentoProcesso.objects.filter(processo_tj=processo),
                many=True
            ).data))
        
def get_sentencas_serializer(processo):
    # obtem sentenças associados ao processo e serializa
    return json.loads(json.dumps(serializers.SentencaSerializer(
                models.Sentenca.objects.filter(processo_tj=processo),
                many=True
            ).data))
            
def get_estatistica_serializer(processo):
    # obtem estatistica de referencias ao processo e serializa
    return json.loads(json.dumps(serializers.ProcessoEstatisticaSerializer(
                models.ProcessoEstatistica.objects.filter(processo_tj=processo),
                many=True
            ).data))

def get_processos_similares_serializer(processo, request):
    return  json.loads(json.dumps(serializers.ProcessoSimilarSerializer(
                models.ProcessoSimilar.objects.filter(processo_base_tj=processo).order_by('-similaridade'),
                many=True, context={'request': request}
            ).data))


def build_processo_serializer(processo, request):
    processo_serializer = get_processo_serializer(processo)
    advogados = get_advogados_serializer(processo)
    personagens = get_personagens_serializer(processo)
    documentos = get_documentos_serializer(processo)
    sentencas = get_sentencas_serializer(processo)
    estatistica = get_estatistica_serializer(processo)
    processos_similares = get_processos_similares_serializer(processo, request)

    processo_serializer.update({
        'advogados':advogados,
        'personagens':personagens,
        'documentos':documentos,
        'sentencas':sentencas,
        'estatistica':estatistica,
        'processos_similares' : processos_similares
    })

    return processo_serializer


def build_processo_similar(processo_base,processo_similar, request):
    processo_base = build_processo_serializer(processo_base, request)
    processo_similar = build_processo_serializer(processo_similar, request)
    return {
        'processo_base':processo_base,
        'processo_similar':processo_similar,
    }

class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProcessosSimilaresViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.ListModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.ProcessoSimilar.objects.all()
    serializer_class = serializers.ProcessoSimilarSerializer
    pagination_class = LargeResultsSetPagination
    
    @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = build_processo_similar(instance.processo_base_tj,instance.processo_similar_tj, request)
        return Response(serializer)

    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).order_by('-similaridade')
        processo_tj = self.request.query_params.get('processo_tj', None)
        if processo_tj is not None:
            queryset = queryset.filter(processo_base_tj=processo_tj)

        processo_cnj = self.request.query_params.get('processo_cnj', None)
        if processo_cnj is not None:
            queryset = queryset.filter(processo_base_cnj=processo_cnj)
        
        processo_similar_tj = self.request.query_params.get('processo_similar_tj', None)
        if processo_similar_tj is not None:
            queryset = queryset.filter(processo_similar_tj=processo_similar_tj)

        processo_similar_cnj = self.request.query_params.get('processo_similar_cnj', None)
        if processo_similar_cnj is not None:
            queryset = queryset.filter(processo_similar_cnj=processo_similar_cnj)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(instance=page, many=True)
            return self.get_paginated_response(serializer.data)


class AvaliacaoSimilaridadeViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, api_permissions.IsOwnerOrReadOnly)
    queryset = models.AvaliacaoSimilaridade.objects.all()
    serializer_class = serializers.AvaliacaoSimilaridadeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Create your views here.
@ensure_csrf_cookie
def index(request):
    return render(request, 'frontend/index.html')
