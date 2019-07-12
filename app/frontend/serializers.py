from rest_framework import serializers

from . import models as views 
from api import models as tj_models



class AnoDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.AnoDisponivel
        fields = '__all__'


class ClasseAssuntoDiponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ClasseAssuntoDisponivel
        fields = '__all__'


class ComarcaServentiaDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ComarcaServentiaDisponivel
        fields = '__all__'


class CompetenciaDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.CompetenciaDisponivel
        fields = '__all__'


class JuizDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.JuizDisponivel
        fields = '__all__'


class AdvogadoDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.AdvogadoDisponivel
        fields = '__all__'


class PersonagemDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.PersonagemDisponivel
        fields = '__all__'


class ProcessoEstatisticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ProcessoEstatistica
        fields = ('referencia','referenciado')

class AdvogadoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.AdvogadoProcesso
        fields = '__all__'


class PersonagemProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.PersonagemProcesso
        fields = '__all__'


class DocumentoProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.DocumentoProcesso
        fields = '__all__'


class SentencaSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.Sentenca
        fields = '__all__'


class ProcessoSimilarBaseSimilarSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ProcessoSimilar
        fields = '__all__'

class ProcessoSimilarSerializer(serializers.ModelSerializer):
    id = serializers.HyperlinkedIdentityField(read_only=True, view_name='processosimilar-detail')
    class Meta:
        model = views.ProcessoSimilar
        fields = '__all__'

class ProcessoSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.Processo
        fields = '__all__'

class ListaSimilaresSerializer(serializers.ModelSerializer):
    id = serializers.HyperlinkedIdentityField(read_only=True, view_name='processosimilar-detail')
    class Meta:
        model = views.ProcessoSimilar
        fields = ('id', 'similaridade','processo_base_tj','processo_base_cnj','processo_similar_tj','processo_similar_cnj')


class AvaliacaoSimilaridadeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = views.AvaliacaoSimilaridade
        fields = ('user','processo_similar','inicial','contestacao','sentenca','comentario')