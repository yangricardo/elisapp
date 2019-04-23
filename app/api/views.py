from django.contrib.auth.models import User
from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from . import models as tj_models
from . import serializer


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
        headers = self.get_success_headers(competencia_serializer.data)
        return Response(competencia_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = tj_models.Assunto.objects.all()
    serializer_class = serializer.AssuntoSerializer
    
    def create(self, request, *args, **kwargs):
        assuntos_serializer = serializer.AssuntoSerializer(
            data=request.data, many=True)
        for assunto in assuntos_serializer.initial_data:
            print(assunto)
            assunto_serializer = serializer.AssuntoSerializer(data=assunto)
            assunto_serializer.is_valid(raise_exception=True)
            assunto_serializer.save()
        headers = self.get_success_headers(assunto_serializer.data)
        return Response(assunto_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ClasseViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.Classe.objects.all()
    serializer_class = serializer.ClasseSerializer


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
