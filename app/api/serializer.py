from django.contrib.auth.models import User
from rest_framework import serializers

from . import models as tj_model


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class ComarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Comarca
        fields = '__all__'


class ServentiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Serventia
        fields = '__all__'


class TipoPersonagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoPersonagem
        fields = '__all__'


class AssuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Assunto
        fields = '__all__'


class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Classe
        fields = '__all__'


class ClasseAssuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.ClasseAssunto
        fields = '__all__'


class CompetenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Competencia
        fields = '__all__'


class ProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Processo
        fields = '__all__'


class ProcessoUnicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.ProcessoUnico
        fields = '__all__'


class TipoMovimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoMovimento
        fields = '__all__'


class TipoAndamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoAndamento
        fields = '__all__'


class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Cargo
        fields = '__all__'
