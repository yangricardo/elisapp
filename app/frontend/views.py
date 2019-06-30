from __future__ import absolute_import, unicode_literals

import json
import re
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
from django.views.decorators.cache import cache_page, never_cache
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.vary import vary_on_cookie
from django.db.models.functions import Coalesce
from django.db.models import Q
from knox.auth import TokenAuthentication
from rest_framework import mixins, pagination, permissions, status, viewsets
from rest_framework.response import Response
from . import models, serializers, permissions as api_permissions
from api import models as tj_models

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
    return json.loads(json.dumps(serializers.ProcessoSimilarSerializer(
        models.ProcessoSimilar.objects.filter(
            processo_base_tj=processo).order_by('-similaridade'),
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
        'advogados': advogados,
        'personagens': personagens,
        'documentos': documentos,
        'sentencas': sentencas,
        'estatistica': estatistica,
        'processos_similares': processos_similares
    })

    return processo_serializer


def build_processo_similar(processo_base, processo_similar, request):
    processo_base = build_processo_serializer(processo_base, request)
    processo_similar = build_processo_serializer(processo_similar, request)
    return {
        'processo_base': processo_base,
        'processo_similar': processo_similar,
    }


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 100


class FilterResultsSetPagination(pagination.PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 8

class ProcessosSimilaresViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.ListModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = models.ProcessoSimilar.objects.all()
    serializer_class = serializers.ProcessoSimilarSerializer
    pagination_class = LargeResultsSetPagination

    @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = build_processo_similar(
            instance.processo_base_tj, instance.processo_similar_tj, request)
        return Response(serializer)

    @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()).order_by('-similaridade')

        random = self.request.query_params.get('random', None)
        if random is not None:
            queryset = queryset.order_by('?')[:int(random)]

        processo_tj = self.request.query_params.get('processo_tj', None)
        if processo_tj is not None:
            queryset = queryset.filter(processo_base_tj=processo_tj)

        processo_cnj = self.request.query_params.get('processo_cnj', None)
        if processo_cnj is not None:
            queryset = queryset.filter(processo_base_cnj=processo_cnj)

        processo_similar_tj = self.request.query_params.get(
            'processo_similar_tj', None)
        if processo_similar_tj is not None:
            queryset = queryset.filter(processo_similar_tj=processo_similar_tj)

        processo_similar_cnj = self.request.query_params.get(
            'processo_similar_cnj', None)
        if processo_similar_cnj is not None:
            queryset = queryset.filter(
                processo_similar_cnj=processo_similar_cnj)

        if set(['similaridade_minima','similaridade_maxima']).intersection(self.request.query_params):
            self.pagination_class = FilterResultsSetPagination

        similaridade_minima = self.request.query_params.get(
            'similaridade_minima', None)
        if similaridade_minima is not None:
            queryset = queryset.filter(similaridade__gte=similaridade_minima)

        similaridade_maxima = self.request.query_params.get(
            'similaridade_maxima', None)
        if similaridade_maxima is not None:
            queryset = queryset.filter(similaridade__lte=similaridade_maxima)

        comarca = self.request.query_params.get('comarca', None)
        if comarca is not None:
            queryset = queryset.filter(
                Q(processo_base_comarca__icontains=comarca) |
                Q(processo_similar_comarca__icontains=comarca)
            )

        serventia = self.request.query_params.get('serventia', None)
        if serventia is not None:
            queryset = queryset.filter(
                Q(processo_base_serventia__icontains=serventia) |
                Q(processo_similar_serventia__icontains=serventia)
            )

        classe = self.request.query_params.get('classe', None)
        if classe is not None:
            queryset = queryset.filter(
                Q(processo_base_classe__icontains=classe) |
                Q(processo_similar_classe__icontains=classe)
            )

        assunto = self.request.query_params.get('assunto', None)
        if assunto is not None:
            queryset = queryset.filter(
                Q(processo_base_assunto__icontains=assunto) |
                Q(processo_similar_assunto__icontains=assunto)
            )

        ano = self.request.query_params.get('ano', None)
        if ano is not None:
            queryset = queryset.filter(
                Q(processo_base_tj__startswith=ano) |
                Q(processo_similar_tj__startswith=ano)
            )

        personagem = self.request.query_params.get('personagem', None)
        if personagem is not None:
            queryset = queryset.filter(
                Q(processo_base_personagens__icontains=personagem) |
                Q(processo_similar_personagens__icontains=personagem)
            )

        advogado = self.request.query_params.get('advogado', None)
        if advogado is not None:
            queryset = queryset.filter(
                Q(processo_base_advogados__icontains=advogado) |
                Q(processo_similar_advogados__icontains=advogado)
            )

        juiz = self.request.query_params.get('juiz', None)
        if juiz is not None:
            queryset = queryset.filter(
                Q(processo_base_juizes__icontains=juiz) |
                Q(processo_similar_juizes__icontains=juiz)
            )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(instance=page, many=True)
            return self.get_paginated_response(serializer.data)


class AvaliacaoSimilaridadeViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, api_permissions.IsOwner)
    queryset = models.AvaliacaoSimilaridade.objects.all()
    serializer_class = serializers.AvaliacaoSimilaridadeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(
            self.get_queryset()).filter(user=self.request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@method_decorator(never_cache, name='list')
class ListSearchViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = FilterResultsSetPagination

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(instance=page, many=True)
            return self.get_paginated_response(serializer.data)
        return JsonResponse(json.loads(json.dumps(serializer.data)), safe=False)


class AnosDisponiveisViewSet(ListSearchViewSet):
    queryset = models.AnoDisponivel.objects.all().order_by('anos')
    serializer_class = serializers.AnoDisponivelSerializer

    def filter_queryset(self, queryset):
        ano = self.request.query_params.get('ano', None)
        if ano is not None:
            queryset = queryset.filter(anos=ano)
        return queryset


class ComarcasServentiasDisponiveisViewSet(ListSearchViewSet):
    queryset = models.ComarcaServentiaDisponivel.objects.all().order_by('?')
    serializer_class = serializers.ComarcaServentiaDisponivelSerializer

    def filter_queryset(self, queryset):
        comarca = self.request.query_params.get('comarca', None)
        if comarca is not None:
            queryset = queryset.filter(comarca__icontains=comarca)

        serventia = self.request.query_params.get('serventia', None)
        if serventia is not None:
            queryset = queryset.filter(serventia__icontains=serventia)

        return queryset


class PersonagensDisponiveisViewSet(ListSearchViewSet):
    queryset = models.PersonagemDisponivel.objects.all().order_by('?')
    serializer_class = serializers.PersonagemDisponivelSerializer

    def filter_queryset(self, queryset):
        personagem = self.request.query_params.get('personagem', None)
        if personagem is not None:
            queryset = queryset.filter(
                Q(nome_personagem__startswith=personagem) |
                Q(nome_personagem__icontains=personagem)
            )

        return queryset


class AdvogadosDisponiveisViewSet(ListSearchViewSet):
    queryset = models.AdvogadoDisponivel.objects.all().order_by('?')
    serializer_class = serializers.AdvogadoDisponivelSerializer

    def filter_queryset(self, queryset):
        advogado = self.request.query_params.get('advogado', None)
        if advogado is not None:
            queryset = queryset.filter(
                Q(nome__startswith=advogado) |
                Q(nome__icontains=advogado) |
                Q(oab__icontains=advogado)
            )

        return queryset


class ClassesAssuntosDisponiveisViewSet(ListSearchViewSet):
    queryset = models.ClasseAssuntoDisponivel.objects.all().order_by('?')
    serializer_class = serializers.ClasseAssuntoDiponivelSerializer

    def filter_queryset(self, queryset):
        classe = self.request.query_params.get('classe', None)
        if classe is not None:
            queryset = queryset.filter(
                Q(classe__startswith=classe) |
                Q(classe__icontains=classe)
            )

        assunto = self.request.query_params.get('assunto', None)
        if assunto is not None:
            queryset = queryset.filter(
                Q(assunto__startswith=assunto) |
                Q(assunto__icontains=assunto)
            )

        return queryset


class JuizesDisponiveisViewSet(ListSearchViewSet):
    queryset = models.JuizDisponivel.objects.all().order_by('?')
    serializer_class = serializers.JuizDisponivelSerializer

    def filter_queryset(self, queryset):
        juiz = self.request.query_params.get('juiz', None)
        if juiz is not None:
            queryset = queryset.filter(
                Q(nome_juiz__startswith=juiz) |
                Q(nome_juiz__icontains=juiz)
            )

        return queryset


# Create your views here.
def index(request):
    return render(request, 'frontend/index.html')
