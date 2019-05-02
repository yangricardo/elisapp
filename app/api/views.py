from django.contrib.auth.models import User
from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from django.http import JsonResponse
from . import models as tj_models
from . import serializer
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializer.UserSerializer


class ComarcaViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Comarca.objects.all()
    serializer_class = serializer.ComarcaSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Comarca criada: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return JsonResponse(serializer.data)


class ServentiaViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Serventia.objects.all()
    serializer_class = serializer.ServentiaSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Serventia criada: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class CompetenciaViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Competencia.objects.all()
    serializer_class = serializer.CompetenciaSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Competencia criada: \n{serializer}')


class AssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Assunto.objects.all()
    serializer_class = serializer.AssuntoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Assunto criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class TipoPersonagemViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoPersonagem.objects.all()
    serializer_class = serializer.TipoPersonagemSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Personagem criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class ClasseViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Classe.objects.all()
    serializer_class = serializer.ClasseSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Classe criada: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class ClasseAssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.ClasseAssunto.objects.all()
    serializer_class = serializer.ClasseAssuntoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Classe Assunto criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class TipoMovimentoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoMovimento.objects.all()
    serializer_class = serializer.TipoMovimentoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Movimento criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class TipoAndamentoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoAndamento.objects.all()
    serializer_class = serializer.TipoAndamentoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Andamento criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class CargoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Cargo.objects.all()
    serializer_class = serializer.CargoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Cargo criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class FuncionarioViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Funcionario.objects.all()
    serializer_class = serializer.FuncionarioSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Funcionario criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


# class ProcessoViewSet(viewsets.ModelViewSet):
#     authentication_classes = [
#         TokenAuthentication
#     ]
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]
#     queryset = tj_models.Processo.objects.all()
#     serializer_class = serializer.ProcessoSerializer

#     def perform_create(self, serializer):
#         serializer.save()
#         logger.info(f'Processo criado: \n{serializer}')

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)
#         return JsonResponse(serializer.data)


class TipoDecisaoRecursoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.TipoDecisaoRecurso.objects.all()
    serializer_class = serializer.TipoDecisaoRecursoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Decisão Recurso criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class TipoAtoJuizViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.TipoAtoJuiz.objects.all()
    serializer_class = serializer.TipoAtoJuizSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Ato Juiz criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class AtoJuizViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.AtoJuiz.objects.all()
    serializer_class = serializer.AtoJuizSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Ato Juiz criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)


class TipoDocumentoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.TipoDocumento.objects.all()
    serializer_class = serializer.TipoDocumentoSerializer

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f'Tipo Documento criado: \n{serializer}')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return JsonResponse(serializer.data)
