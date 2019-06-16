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
        lookup_field = 'cod_proc'


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
        lookup_field = 'processo'


class PersonagemSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Personagem
        fields = '__all__'


class AdvogadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.Advogado
        fields = '__all__'


class PersonagemProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.PersonagemProcesso
        fields = '__all__'


class AdvogadoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.AdvogadoProcesso
        fields = '__all__'


class DocumentoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.DocumentoProcesso
        fields = '__all__'

class ProcessosSimilaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.ProcessosSimilares
        fields = '__all__'

class DescricaoProcessoSerializer(serializers.Serializer):
    advogado_processo = serializers.StringRelatedField(many=True)
    personagem_processo = serializers.StringRelatedField(many=True)
    processo_andamento = serializers.StringRelatedField(many=True)

    class Meta:
        model = tj_model.Processo
        fields = ('cod_proc','cod_cnj','advogado_processo','personagem_processo','processo_andamento')


class GrupoSimilarSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = tj_model.GrupoSimilar
        fields = '__all__'

class GrupoSimilarProcessosSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.GrupoSimilarProcessos
        fields = '__all__'

class GrupoSimilarUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = tj_model.GrupoSimilarUsuarios
        fields = '__all__'