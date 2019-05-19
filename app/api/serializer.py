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
    cod_proc = serializers.RegexField(r'^\d{4}.\d{3}.\d{6}-\d[a-zA-Z]?$')
    cod_cnj = serializers.RegexField(r'^\d{7}-\d{2}.\d{4}.\d.\d{2}.\d{4}$')
    class Meta:
        model = tj_model.Processo
        fields = '__all__'
        lookup_field='cod_proc'


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


class FuncionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Funcionario
        fields = '__all__'


class TipoDecisaoRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoDecisaoRecurso
        fields = '__all__'


class TipoAtoJuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoAtoJuiz
        fields = '__all__'


class AtoJuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.AtoJuiz
        fields = '__all__'


class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.TipoDocumento
        fields = '__all__'

class AndamentoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.AndamentoProcesso
        fields = '__all__'
        lookup_field='processo'
