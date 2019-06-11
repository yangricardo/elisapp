from rest_framework import serializers

from . import models as views 
from api import models as tj_models



class AnoDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.AnoDisponivel
        fields = '__all__'



class AssuntoDiponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.AssuntoDisponivel
        fields = '__all__'


class ClasseDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ClasseDisponivel
        fields = '__all__'



class ComarcaDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ComarcasDisponivel
        fields = '__all__'


class ServentiaDisponivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = views.ServentiaDisponivel
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
        fields = ('id', 'similaridade','processo_similar_tj','processo_similar_cnj')


class AvaliacaoSimilaridadeSerializer(serializers.ModelSerializer):

    class Meta:
        model = views.AvaliacaoSimilaridade
        fields = ('processo_similar','inicial','contestacao','sentenca','comentario')