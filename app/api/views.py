from django.contrib.auth.models import User
from django.shortcuts import render
from knox.auth import TokenAuthentication
from rest_framework import permissions, viewsets

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
    serializer_class = serializer.ComarcaSerializer(many=True)
    
    def perform_create(self, serializer):
        print(serializer)


class ServentiaViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.Serventia.objects.all()
    serializer_class = serializer.ServentiaSerializer


class CompetenciaViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.Competencia.objects.all()
    serializer_class = serializer.CompetenciaSerializer


class AssuntoViewSet(viewsets.ModelViewSet):
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = tj_models.Assunto.objects.all()
    serializer_class = serializer.AssuntoSerializer


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
