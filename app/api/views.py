from __future__ import absolute_import, unicode_literals

import json
import logging
from builtins import object
from functools import wraps

from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache.backends.base import DEFAULT_TIMEOUT
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.http import Http404, JsonResponse
from django.shortcuts import get_list_or_404 as _get_list_or_404
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page, never_cache
from django.views.decorators.vary import vary_on_cookie
from knox.auth import TokenAuthentication
from rest_framework import mixins, pagination, permissions, status, viewsets
from rest_framework.response import Response

from backend.celery import app

from . import models as tj_models
from . import serializer
from frontend import permissions as api_permissions

# Get an instance of a logger
logger = logging.getLogger(__name__)

CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)


class LargeResultsSetPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 150


class TJModelViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated, permissions.IsAdminUser)

    @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        logger.info(serializer)
        return Response(serializer.data)

    @method_decorator(never_cache)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if type(serializer.initial_data) is not list:
            serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
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

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `serventia` query parameter in the URL.
        """
        queryset = tj_models.Serventia.objects.all()
        descricao = self.request.query_params.get('descricao', None)
        if descricao is not None:
            queryset = queryset.filter(desc_serv__upper__contains=descricao)
        return queryset


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
    pagination_class = LargeResultsSetPagination
    lookup_field = 'cod_proc'
    lookup_value_regex = r'\d{4}.\d{3}.\d{6}-\d[a-zA-Z]?'


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


class AndamentoProcessoViewSet(TJModelViewSet):
    queryset = tj_models.AndamentoProcesso.objects.all()
    serializer_class = serializer.AndamentoProcessoSerializer
    pagination_class = LargeResultsSetPagination

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `processo` query parameter in the URL.
        """
        queryset = tj_models.AndamentoProcesso.objects.all()
        processo = self.request.query_params.get('processo', None)
        if processo is not None:
            queryset = queryset.filter(processo__cod_proc=processo)
        return queryset


class PersonagemViewSet(TJModelViewSet):
    queryset = tj_models.Personagem.objects.all()
    serializer_class = serializer.PersonagemSerializer


class AdvogadoViewSet(TJModelViewSet):
    queryset = tj_models.Advogado.objects.all()
    serializer_class = serializer.AdvogadoSerializer


class PersonagemProcessoViewSet(TJModelViewSet):
    queryset = tj_models.PersonagemProcesso.objects.all()
    serializer_class = serializer.PersonagemProcessoSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `processo` query parameter in the URL.
        """
        queryset = tj_models.PersonagemProcesso.objects.all()
        processo = self.request.query_params.get('processo', None)
        if processo is not None:
            queryset = queryset.filter(processo__cod_proc=processo)

        personagem = self.request.query_params.get(
            'personagem', None)
        if personagem is not None:
            queryset = queryset.filter(personagem__nome=personagem.upper())

        return queryset


class AdvogadoProcessoViewSet(TJModelViewSet):
    queryset = tj_models.AdvogadoProcesso.objects.all()
    serializer_class = serializer.AdvogadoProcessoSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `processo` query parameter in the URL.
        """
        queryset = tj_models.PersonagemProcesso.objects.all()
        processo = self.request.query_params.get('processo', None)
        if processo is not None:
            queryset = queryset.filter(processo__cod_proc=processo)

        advogado = self.request.query_params.get('advogado', None)
        if advogado is not None:
            queryset = queryset.filter(advogado__nome_adv__upper=advogado.upper())

        oab = self.request.query_params.get('oab', None)
        if oab is not None:
            queryset = queryset.filter(advogado__num_oab__upper=oab.upper())

        return queryset


class DocumentoProcessoViewSet(TJModelViewSet):
    queryset = tj_models.DocumentoProcesso.objects.all()
    serializer_class = serializer.DocumentoProcessoSerializer


class ProcessosSimilaresViewSet(TJModelViewSet):
    serializer_class = serializer.ProcessosSimilaresSerializer
    queryset = tj_models.ProcessosSimilares.objects.all()

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `processo` query parameter in the URL.
        """
        queryset = tj_models.ProcessosSimilares.objects.all()
        processo_base = self.request.query_params.get('processo_base', None)
        if processo_base is not None:
            queryset = queryset.filter(processo_base__cod_proc=processo_base)
        
        processo_similar = self.request.query_params.get('processo_similar', None) 
        
        if processo_similar is not None:
            queryset = queryset.filter(processo_similar__cod_proc=processo_similar)

        processo_base_cnj = self.request.query_params.get('processo_base_cnj', None)
        if processo_base_cnj is not None:
            queryset = queryset.filter(processo_base__cod_cnj=processo_base_cnj)
        
        processo_similar_cnj = self.request.query_params.get('processo_similar_cnj', None)
        if processo_similar_cnj is not None:
            queryset = queryset.filter(processo_similar__cod_cnj=processo_similar_cnj)

        return queryset


class RelatorioProcessosSimilaresViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated)
    queryset = tj_models.ProcessosSimilares.objects.all()
    serializer_class = serializer.ProcessosSimilaresSerializer

    def list(self, request, *args, **kwargs):
        processo_base = self.request.query_params.get('processo_base', None)
        if processo_base is not None:
            queryset = queryset.filter(processo_base__cod_proc=processo_base)

        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class UserModelViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(user=self.request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class GrupoSimilarViewSet(UserModelViewSet):
    queryset = tj_models.GrupoSimilar.objects.all()
    serializer_class = serializer.GrupoSimilarSerializer

    def perform_create(self, serializer):
        grupo_similar = serializer.save(user=self.request.user)
        tj_models.GrupoSimilarUsuarios.objects.create(grupo=grupo_similar,user=self.request.user,administrador=self.request.user)

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        queryset = tj_models.GrupoSimilarUsuarios.objects.filter(
            Q(user=self.request.user) | Q(administrador=self.request.user) 
        )

        grupo = self.request.query_params.get('grupo', None)
        if grupo is not None:
            queryset = queryset.filter(grupo=grupo)

        serialized = serializer.GrupoSimilarUsuariosDetailSerializer(queryset, many=True)
        return Response(serialized.data)


class GrupoSimilarProcessosViewSet(UserModelViewSet):
    queryset = tj_models.GrupoSimilarProcessos.objects.all()
    serializer_class = serializer.GrupoSimilarProcessosSerializer

    def perform_create(self, serializer):
        serializer.save()

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        queryset = tj_models.GrupoSimilarProcessosView.objects.all()

        grupo = self.request.query_params.get('grupo', None)
        if grupo is not None:
            queryset = queryset.filter(grupo=grupo)

        gspv_serializer = serializer.GrupoSimilarProcessosViewSerializer(queryset, many=True)
        return Response(gspv_serializer.data)
    

class GrupoSimilarUsuariosViewSet(UserModelViewSet):
    queryset = tj_models.GrupoSimilarUsuarios.objects.all()
    serializer_class = serializer.GrupoSimilarUsuariosSerializer

    @method_decorator(never_cache)
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            Q(user=self.request.user) | Q(administrador=self.request.user) 
        )

        grupo = self.request.query_params.get('grupo', None)
        if grupo is not None:
            queryset = queryset.filter(grupo=grupo)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)