from rest_framework import serializers
from . import models as tj_model



class ServentiaSerializer(serializers.ModelSerializer):
    comarca = serializers.StringRelatedField()
    class Meta:
        model = tj_model.Serventia
        fields = ('desc_serv', 'comarca')

class ProcessoSerializer(serializers.ModelSerializer):
    cod_proc = serializers.RegexField(r'^\d{4}.\d{3}.\d{6}-\d[a-zA-Z]?$')
    cod_cnj = serializers.RegexField(r'^\d{7}-\d{2}.\d{4}.\d.\d{2}.\d{4}$')
    serventia = ServentiaSerializer()
    competencia = serializers.StringRelatedField()
    competencia = serializers.StringRelatedField()

    class Meta:
        model = tj_model.Processo
        fields = ('cod_proc','cod_cnj','serventia')