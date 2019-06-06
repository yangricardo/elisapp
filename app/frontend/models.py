from django.db import models
from api import models as tj_models
# Create your models here.

class DBView(models.Model):
    objects = models.Manager

    class Meta:
        abstract = True


class ProcessoDBView(DBView):
    processo_tj = models.IntegerField(db_index=True)
    processo_cnj = models.IntegerField(db_index=True, blank=True, null=True)

    class Meta:
        abstract = True    

class AdvogadoProcesso(ProcessoDBView):
    processo_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='advogado_processo_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='advogado_processo_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    nome = models.TextField(db_index=True)
    oab = models.TextField(db_index=True)
    polo = models.CharField(max_length=1, blank=True, null=True)
    
    def __str__(self):
        return f'{self.oab} - {self.nome} - {self.polo} - {self.processo_tj} - {self.processo_cnj}'

    class Meta:
        managed = False
        db_table = 'api_mview_advogado_processo'


class DocumentoProcesso(ProcessoDBView):
    processo_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='documento_processo_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='documento_processo_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    cod_documento = models.TextField(primary_key=True)
    id_tipo_documento = models.CharField(max_length=1, blank=True, null=True)
    tipo_documento = models.CharField(max_length=210)

    def __str__(self):
        return f'{self.cod_documento} - {self.tipo_documento} - {self.processo_tj} - {self.processo_cnj}'

    class Meta:
        managed = False
        db_table = 'api_mview_documento_processo'


class PersonagemProcesso(ProcessoDBView):
    processo_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='personagem_processo_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='personagem_processo_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    nome_personagem = models.TextField(db_index=True)
    tipo_personagem = models.CharField(max_length=25)
    participacao = models.CharField(max_length=1)

    def __str__(self):
        return f'{self.nome_personagem} - {self.tipo_personagem}- {self.participacao} - {self.processo_tj} - {self.processo_cnj}'

    class Meta:
        managed = False
        db_table = 'api_mview_personagens_processo'


class Sentenca(ProcessoDBView):
    processo_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='sentenca_processo_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='sentenca_processo_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    texto_sentenca = models.TextField()
    ato_juiz = models.CharField(max_length=20)
    nome_juiz = models.CharField(max_length=100)
    matricula_juiz = models.TextField()
    cargo_juiz = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.nome_juiz} - {self.cargo_juiz} - {self.ato_juiz} - {self.processo_tj} - {self.processo_cnj}'

    class Meta:
        managed = False
        db_table = 'api_mview_sentencas'


class ProcessoSimilar(DBView):
    similaridade = models.FloatField(blank=False, null=False)
    processo_base_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='processo_base_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_base_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='processo_base_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_similar_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='processo_similar_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_similar_cnj = models.ForeignKey(tj_models.Processo, to_field='cod_cnj',related_name='processo_similar_cnj_view',db_index=True, on_delete=models.DO_NOTHING)
    processo_base_tj = models.IntegerField(db_index=True)
    processo_base_cnj = models.IntegerField(db_index=True, blank=True, null=True)
    processo_similar_tj = models.IntegerField(db_index=True)
    processo_similar_cnj = models.IntegerField(db_index=True, blank=True, null=True)
    processo_base_comarca = models.CharField(max_length=50, db_index=True, blank=True, null=True)
    processo_similar_comarca = models.CharField(max_length=50, db_index=True, blank=True, null=True)
    processo_base_serventia = models.CharField(max_length=80, db_index=True, blank=True, null=True)
    processo_similar_serventia = models.CharField(max_length=80, db_index=True, blank=True, null=True)
    processo_base_assunto = models.TextField()
    processo_similar_assunto = models.TextField()
    processo_base_classe = models.TextField()
    processo_similar_classe = models.TextField()
    processo_base_competencia = models.TextField()
    processo_similar_competencia = models.TextField()
    
    def __str__(self):
        return f'{self.similaridade} - {self.processo_base_tj} - {self.processo_similar_tj} - {self.processo_base_cnj} - {self.processo_similar_cnj}'

    class Meta:
        managed = False
        db_table = 'api_mview_processossimilares'


class AnoDisponivel(DBView):
    ano = models.CharField(primary_key=True, max_length=4)

    def __str__(self):
        return f'{self.ano}'

    class Meta:
        managed = False
        db_table = 'api_view_anos_disponiveis'


class AssuntoDisponivel(DBView):
    assunto = models.TextField(primary_key=True)

    def __str__(self):
        return f'{self.assunto}'

    class Meta:
        managed = False
        db_table = 'api_view_assuntos_disponiveis'


class ClasseDisponivel(DBView):
    classe = models.TextField(primary_key=True)

    def __str__(self):
        return f'{self.classe}'

    class Meta:
        managed = False
        db_table = 'api_view_classes_disponiveis'



class ComarcasDisponivel(DBView):
    comarca = models.TextField(primary_key=True)

    def __str__(self):
        return f'{self.comarca}'

    class Meta:
        managed = False
        db_table = 'api_view_comarcas_disponiveis'


class CompetenciaDisponivel(DBView):
    competencia = models.TextField(primary_key=True)

    def __str__(self):
        return f'{self.competencia}'

    class Meta:
        managed = False
        db_table = 'api_view_competencias_disponiveis'


class ServentiaDisponivel(DBView):
    serventia = models.TextField(primary_key=True)

    def __str__(self):
        return f'{self.serventia}'

    class Meta:
        managed = False
        db_table = 'api_view_serventias_disponiveis'


class JuizDisponivel(DBView):
    matricula_juiz = models.TextField(primary_key=True)
    juiz = models.TextField()
    cargo_juiz = models.TextField()

    def __str__(self):
        return f'{self.juiz}'

    class Meta:
        managed = False
        db_table = 'api_view_juizes_disponiveis'


class AdvogadoDisponivel(DBView):
    oab = models.TextField(primary_key=True)
    advogado = models.TextField()

    def __str__(self):
        return f'{self.advogado}'

    class Meta:
        managed = False
        db_table = 'api_views_advogados_disponiveis'


class PersonagemDisponivel(DBView):
    id = models.TextField(primary_key=True)
    nome_personagem = models.TextField()

    def __str__(self):
        return f'{self.nome_personagem}'

    class Meta:
        managed = False
        db_table = 'api_views_personagens_disponiveis'


class ProcessoEstatistica(DBView):
    processo_tj = models.ForeignKey(tj_models.Processo, to_field='cod_proc',related_name='processo_base_view',db_index=True, on_delete=models.DO_NOTHING)
    referencia = models.IntegerField()
    referenciado = models.IntegerField()

    def __str__(self):
        return f'{self.processo_tj} - {self.referencia} - {self.referenciado}'

    class Meta:
        managed = False
        db_table = 'api_view_processo_estatistica'