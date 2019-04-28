from django.contrib.auth.models import User
from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
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

    def create(self, request, *args, **kwargs):
        comarca_serializer = serializer.ComarcaSerializer(
            data=request.data, many=True)
        comarca_serializer.is_valid(raise_exception=True)
        comarca_serializer.save()
        logger.info(f'Comarcas Salvas: \n{comarca_serializer}')
        headers = self.get_success_headers(comarca_serializer.data)
        return Response(comarca_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ServentiaViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Serventia.objects.all()
    serializer_class = serializer.ServentiaSerializer

    def create(self, request, *args, **kwargs):
        serventia_serializer = serializer.ServentiaSerializer(
            data=request.data, many=True)
        serventia_serializer.is_valid(raise_exception=True)
        serventia_serializer.save()
        logger.info(f'Serventias Salvas: \n{serventia_serializer}')
        headers = self.get_success_headers(serventia_serializer.data)
        return Response(serventia_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CompetenciaViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Competencia.objects.all()
    serializer_class = serializer.CompetenciaSerializer

    def create(self, request, *args, **kwargs):
        competencia_serializer = serializer.CompetenciaSerializer(
            data=request.data, many=True)
        competencia_serializer.is_valid(raise_exception=True)
        competencia_serializer.save()
        logger.info(f'Competencias salvas: \n{competencia_serializer}')
        headers = self.get_success_headers(competencia_serializer.data)
        return Response(competencia_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Assunto.objects.all()
    serializer_class = serializer.AssuntoSerializer

    def create(self, request, *args, **kwargs):
        assunto_serializer = serializer.AssuntoSerializer(
            data=request.data, many=True)
        assunto_serializer.is_valid(raise_exception=True)
        assunto_serializer.save()
        logger.info(f'Assuntos salvos: \n {assunto_serializer}')
        headers = self.get_success_headers(assunto_serializer.data)
        return Response(assunto_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TipoPersonagemViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoPersonagem.objects.all()
    serializer_class = serializer.TipoPersonagemSerializer

    def create(self, request, *args, **kwargs):
        tip_pers_serializer = serializer.TipoPersonagemSerializer(
            data=request.data, many=True)
        tip_pers_serializer.is_valid(raise_exception=True)
        tip_pers_serializer.save()
        logger.info(f'Tipos Personagem salvos: \n {tip_pers_serializer}')
        headers = self.get_success_headers(tip_pers_serializer.data)
        return Response(tip_pers_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ClasseViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Classe.objects.all()
    serializer_class = serializer.ClasseSerializer

    def create(self, request, *args, **kwargs):
        classe_serializer = serializer.ClasseSerializer(
            data=request.data, many=True)
        classe_serializer.is_valid(raise_exception=True)
        classe_serializer.save()
        logger.info(f'Classes salvas: \n {classe_serializer}')
        headers = self.get_success_headers(classe_serializer.data)
        return Response(classe_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ClasseAssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.ClasseAssunto.objects.all()
    serializer_class = serializer.ClasseAssuntoSerializer

    def create(self, request, *args, **kwargs):
        classeassunto_serializer = serializer.ClasseAssuntoSerializer(
            data=request.data, many=True)
        classeassunto_serializer.is_valid(raise_exception=True)
        classeassunto_serializer.save()
        logger.info(f'Classes Assuntos salvas: \n {classeassunto_serializer}')
        headers = self.get_success_headers(classeassunto_serializer.data)
        return Response(classeassunto_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TipoMovimentoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoMovimento.objects.all()
    serializer_class = serializer.TipoMovimentoSerializer

    def create(self, request, *args, **kwargs):
        tp_movimento_serializer = serializer.TipoMovimentoSerializer(
            data=request.data, many=True)
        tp_movimento_serializer.is_valid(raise_exception=True)
        tp_movimento_serializer.save()
        logger.info(f'Tipo Movimento salvos: \n {tp_movimento_serializer}')
        headers = self.get_success_headers(tp_movimento_serializer.data)
        return Response(tp_movimento_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TipoAndamentoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.TipoAndamento.objects.all()
    serializer_class = serializer.TipoAndamentoSerializer

    def create(self, request, *args, **kwargs):
        tp_andamento_serializer = serializer.TipoAndamentoSerializer(
            data=request.data, many=True)
        tp_andamento_serializer.is_valid(raise_exception=True)
        tp_andamento_serializer.save()
        logger.info(f'Tipo Andamentos salvos: \n {tp_andamento_serializer}')
        headers = self.get_success_headers(tp_andamento_serializer.data)
        return Response(tp_andamento_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CargoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Cargo.objects.all()
    serializer_class = serializer.CargoSerializer

    def create(self, request, *args, **kwargs):
        cargo_serializer = serializer.CargoSerializer(
            data=request.data, many=True)
        cargo_serializer.is_valid(raise_exception=True)
        cargo_serializer.save()
        logger.info(f'Cargos salvos: \n {cargo_serializer}')
        headers = self.get_success_headers(cargo_serializer.data)
        return Response(cargo_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProcessoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.Processo.objects.all()
    serializer_class = serializer.ProcessoSerializer


class ProcessoUnicoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.ProcessoUnico.objects.all()
    serializer_class = serializer.ProcessoUnicoSerializer
