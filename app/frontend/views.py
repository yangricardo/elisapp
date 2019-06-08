from __future__ import absolute_import, unicode_literals

import json
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
from . import models, serializers

# Get an instance of a logger
logger = logging.getLogger(__name__)

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

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

def build_processo_extra_data(processo_base,processo_similar):
    advogados_base = get_advogados_serializer(processo_base)
    advogados_similar = get_advogados_serializer(processo_similar)
    personagens_base = get_personagens_serializer(processo_base)
    personagens_similar = get_personagens_serializer(processo_similar)
    documentos_base = get_documentos_serializer(processo_base)
    documentos_similar = get_documentos_serializer(processo_similar)
    sentencas_base = get_sentencas_serializer(processo_base)
    sentencas_similar = get_sentencas_serializer(processo_similar)
    estatistica_base = get_estatistica_serializer(processo_base)
    estatistica_similar = get_estatistica_serializer(processo_similar)
    
    return {
        'advogados_base':advogados_base,
        'advogados_similar':advogados_similar,
        'personagens_base':personagens_base,
        'personagens_similar':personagens_similar,
        'documentos_base':documentos_base,
        'documentos_similar':documentos_similar,
        'sentencas_base':sentencas_base,
        'sentencas_similar':sentencas_similar,
        'estatistica_base':estatistica_base,
        'estatistica_similar':estatistica_similar,
    }

class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 1


class ProcessosSimilaresViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.ListModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.ProcessoSimilar.objects.all()
    serializer_class = serializers.ProcessoSimilarSerializer
    pagination_class = LargeResultsSetPagination
    
    @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance).data
        serializer.update(build_processo_extra_data(instance.processo_base_tj,instance.processo_similar_tj))
        serializer.update({'processos_similares' : serializers.ListaSimilaresSerializer(
                models.ProcessoSimilar.objects.filter(processo_base_tj=instance.processo_base_tj),
                many=True, context={'request': request}
            ).data})
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


        processos_similares = self.get_serializer(instance=queryset, many=True).data
        processos_similares = list(map(lambda ps: 
            (   ps['similaridade'], 
                ps['id'], 
                ps['processo_similar_tj'], ps['processo_similar_cnj']
            ),processos_similares)
        )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(instance=page, many=True).data
            if serializer:
                serializer[0].update(build_processo_extra_data(page[0].processo_base_tj,page[0].processo_similar_tj))
                serializer[0].update({'processos_similares' : serializers.ListaSimilaresSerializer(
                    models.ProcessoSimilar.objects.filter(processo_base_tj=page[0].processo_base_tj),
                    many=True, context={'request': request}
                ).data})
            return self.get_paginated_response(serializer)

# Create your views here.
@ensure_csrf_cookie
def index(request):
    return render(request, 'frontend/index.html')
