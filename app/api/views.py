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
        logger.info('Assuntos salvos: \n {assunto_serializer}')
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
        logger.info('Tipos Personagem salvos: \n {tip_pers_serializer}')
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
        logger.info('Classes salvas: \n {classe_serializer}')
        headers = self.get_success_headers(classe_serializer.data)
        return Response(classe_serializer.data, status=status.HTTP_201_CREATED, headers=headers)



class ClasseAssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.ClasseAssunto.objects.all()
    serializer_class = serializer.ClasseAssuntoSerializer


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
