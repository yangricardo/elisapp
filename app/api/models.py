from django.db import models
from django.db.models.fields.related import ForeignKey
from django.contrib.auth.models import User
# Create your models here.


class ManagedModel(models.Model):
    objects = models.Manager

    class Meta:
        abstract = True


class Comarca(ManagedModel):
    cod_coma = models.IntegerField(primary_key=True)
    desc_coma = models.CharField(max_length=50)
    desc_redu = models.CharField(max_length=3)

    def __str__(self):
        return self.desc_coma


class Serventia(ManagedModel):
    cod_serv = models.IntegerField(primary_key=True)
    comarca = models.ForeignKey(
        Comarca, related_name='comarca', on_delete=models.DO_NOTHING)
    desc_serv = models.CharField(max_length=80,)
    desc_abre = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.desc_serv


class TipoPersonagem(ManagedModel):
    cod_tip_pers = models.IntegerField(primary_key=True)
    cod_tip_pers_inv = models.ForeignKey(
        'api.TipoPersonagem', related_name='tipo_personagem_inverso', blank=True, null=True, on_delete=models.DO_NOTHING)
    desc_pers = models.CharField(max_length=25)
    tipo_part = models.CharField(max_length=1)

    def __str__(self):
        return self.desc_pers


class Assunto(ManagedModel):
    cod_assunto = models.IntegerField(primary_key=True)
    assunto_pai = models.ForeignKey(
        'api.Assunto', null=True, blank=True, on_delete=models.DO_NOTHING)
    descr = models.TextField()

    def __str__(self):
        return self.descr


class Classe(ManagedModel):
    cod_classe = models.IntegerField(primary_key=True)
    classe_pai = models.ForeignKey(
        'api.Classe', blank=True, null=True, on_delete=models.DO_NOTHING)
    descr = models.TextField()
    cod_pers_passivo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_passivo", blank=True, null=True, on_delete=models.DO_NOTHING, default=None)
    cod_pers_ativo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_ativo", blank=True, null=True, on_delete=models.DO_NOTHING, default=None)

    def __str__(self):
        return self.descr


class ClasseAssunto(ManagedModel):
    assunto = models.ForeignKey(
        Assunto, related_name='assunto_classe', on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(
        Classe, related_name='classe_assunto', on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = (('classe', 'assunto'),)

    def __str__(self):
        return '%s : %s' % (self.assunto, self.classe)


class Competencia(ManagedModel):
    cod_comp = models.IntegerField(primary_key=True)
    desc_comp = models.CharField(max_length=50)
    desc_res = models.CharField(max_length=15)

    def __str__(self):
        return self.desc_comp


class Processo(ManagedModel):
    id_proc = models.IntegerField(primary_key=True)
    cod_proc = models.CharField(max_length=18, db_index=True, unique=True)
    cod_cnj = models.CharField(
        max_length=25, db_index=True, unique=True, blank=True, null=True)
    data_cad = models.DateTimeField(
        blank=True, null=True, auto_now=False, auto_now_add=False)
    serventia = models.ForeignKey(
        Serventia, related_name='serventia_processo', db_index=True, blank=True, null=True, on_delete=models.DO_NOTHING)
    competencia = models.ForeignKey(
        Competencia, related_name='competencia_processo', db_index=True, blank=True, null=True, on_delete=models.DO_NOTHING)
    assunto = models.ForeignKey(
        Assunto, related_name='assunto_processo', db_index=True, blank=True, null=True, on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(
        Classe, related_name='classe_processo', db_index=True, blank=True, null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return '%s : %s' % (self.cod_proc, self.cod_cnj)


class TipoMovimento(ManagedModel):
    cod_tip_mov = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=100)
    cod_tip_mov_pai = ForeignKey(
        'api.TipoMovimento', related_name='tipo_movimento_pai', blank=True, null=True, on_delete=models.DO_NOTHING, default=None)

    def __str__(self):
        return self.descr


class TipoAndamento(ManagedModel):
    cod_tip_and = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=60)
    cod_tip_mov = ForeignKey(TipoMovimento, related_name='tipo_movimento_andamento', blank=True,
                             null=True, on_delete=models.DO_NOTHING, default=None)

    def __str__(self):
        return self.descr


class Cargo(ManagedModel):
    cod_carg = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=50)

    def __str__(self):
        return self.descr


class Funcionario(ManagedModel):
    num_matr = models.TextField(primary_key=True)
    nome = models.CharField(max_length=100)
    cod_carg = models.ForeignKey(
        Cargo, related_name='cargo', blank=True, null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return '%s: %s' % (self.cod_carg, self.nome)


class TipoDecisaoRecurso(ManagedModel):
    cod_tip_dec_rec = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=25)

    def __str__(self):
        return self.descr


class TipoAtoJuiz(ManagedModel):
    cod_tip_ato = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=20)

    def __str__(self):
        return self.descr


class AtoJuiz(ManagedModel):
    cod_ato = models.IntegerField()
    tipo_ato_juiz = models.ForeignKey(
        TipoAtoJuiz, related_name='tipo_ato_juiz', blank=True, null=True, on_delete=models.DO_NOTHING)
    tipo_movimento = models.ForeignKey(
        TipoMovimento, related_name='tipo_movimento_ato_juiz', blank=True, null=True, on_delete=models.DO_NOTHING)
    descr = models.CharField(max_length=60)

    class Meta:
        unique_together = (('cod_ato', 'tipo_ato_juiz', 'tipo_movimento'),)

    def __str__(self):
        return self.descr


class TipoDocumento(ManagedModel):
    id_tip_doc = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=210)

    def __str__(self):
        return self.descr


class AndamentoProcesso(ManagedModel):
    processo = models.ForeignKey(Processo, to_field='cod_proc',
                                 related_name='processo_andamento', db_index=True, on_delete=models.DO_NOTHING)
    ordem = models.IntegerField()
    tipo_andamento = models.ForeignKey(TipoAndamento, related_name='tipo_andamento_processo',
                                       db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    juiz = models.ForeignKey(Funcionario, related_name='juiz_andamento_processo',
                             db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    tipo_ato_juiz = models.ForeignKey(TipoAtoJuiz, related_name='tipo_ato_juiz_andamento_processo',
                                      db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    ato_juiz = models.ForeignKey(AtoJuiz, related_name='ato_juiz_andamento_processo',
                                 db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    serventia = models.ForeignKey(Serventia, related_name='serventia_andamento_processo',
                                  db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    dt_ato = models.DateTimeField(
        auto_now=False, auto_now_add=False, blank=True, null=True)
    tipo_decisao_recurso = models.ForeignKey(
        TipoDecisaoRecurso, related_name='tipo_decisao_recurso', db_index=True, on_delete=models.DO_NOTHING, blank=True, null=True)
    txt_descr = models.TextField()
    txt_descr_len = models.IntegerField()

    class Meta:
        unique_together = (('processo', 'ordem', 'txt_descr_len'),)

    def __str__(self):
        return self.txt_descr


class Personagem(ManagedModel):
    cod_pers = models.IntegerField(primary_key=True)
    nome = models.TextField(db_index=True)

    def __str__(self):
        return self.nome


class Advogado(ManagedModel):
    cod_adv = models.IntegerField(primary_key=True)
    num_oab = models.TextField(db_index=True)
    nome_adv = models.TextField(db_index=True)

    def __str__(self):
        return self.nome_adv


class PersonagemProcesso(ManagedModel):
    processo = models.ForeignKey(Processo, related_name='processo_personagem',
                                 to_field='cod_proc', db_index=True, on_delete=models.DO_NOTHING)
    personagem = models.ForeignKey(Personagem, related_name='personagem_processo',
                                   to_field='cod_pers', db_index=True, on_delete=models.DO_NOTHING)
    tipo_personagem = models.ForeignKey(TipoPersonagem, related_name='tipo_personagem_processo',
                                        to_field='cod_tip_pers', db_index=True, on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = (('processo', 'personagem'),)

    def __str__(self):
        return '%s: %s' % (self.tipo_personagem, self.personagem)


class AdvogadoProcesso(ManagedModel):
    processo = models.ForeignKey(Processo, related_name='processo_advogado',
                                 to_field='cod_proc', db_index=True, on_delete=models.DO_NOTHING)
    advogado = models.ForeignKey(Advogado, related_name='advogado_processo',
                                 to_field='cod_adv', db_index=True, on_delete=models.DO_NOTHING)
    tipo_personagem = models.ForeignKey(TipoPersonagem, related_name='tipo_personagem_advogado_processo',
                                        to_field='cod_tip_pers', db_index=True, on_delete=models.DO_NOTHING)
    tip_polo = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        unique_together = (('processo', 'advogado'),)

    def __str__(self):
        return 'Polo %s: %s' % ('Réu' if self.tip_polo == 'P' else 'Autor', self.advogado)


class DocumentoProcesso(ManagedModel):
    cod_docto_elet = models.TextField(primary_key=True)
    processo = models.ForeignKey(Processo, related_name='documento_processo',
                                 to_field='cod_proc', db_index=True, on_delete=models.DO_NOTHING)
    competencia = models.ForeignKey(Competencia, related_name='documento_competencia',
                                    to_field='cod_comp', db_index=True, on_delete=models.DO_NOTHING)
    assunto = models.ForeignKey(Assunto, related_name='documento_assunto',
                                to_field='cod_assunto', db_index=True, on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(Classe, related_name='documento_classe',
                               to_field='cod_classe', db_index=True, on_delete=models.DO_NOTHING)
    tipo_documento = models.ForeignKey(
        TipoDocumento, to_field='id_tip_doc', db_index=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return '%s: %s' % (self.tipo_documento, self.cod_docto_elet)


class ProcessosSimilares(ManagedModel):
    processo_base = models.ForeignKey(Processo, related_name="processo_base",
                                      to_field='cod_proc', db_index=True, on_delete=models.DO_NOTHING)
    processo_similar = models.ForeignKey(
        Processo, related_name="processo_similar", to_field='cod_proc', db_index=True, on_delete=models.DO_NOTHING)
    similaridade = models.FloatField(blank=False, null=False)

    def __str__(self):
        return 'Base: %s\n%s\n%.2f' % (self.processo_base, self.processo_similar, self.similaridade)


class GrupoSimilar(ManagedModel):
    descricao = models.CharField(max_length=150, db_index=True)
    user = models.ForeignKey(User, db_index=True, on_delete=models.DO_NOTHING)


class GrupoSimilarUsuarios(ManagedModel):
    grupo = models.ForeignKey(
        GrupoSimilar, db_index=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, db_index=True, on_delete=models.CASCADE)
    administrador = models.ForeignKey(
        User, related_name='administrador', db_index=True, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('grupo', 'user'),)

class GrupoSimilarProcessos(ManagedModel):
    grupo = models.ForeignKey(
        GrupoSimilar, db_index=True, on_delete=models.CASCADE)
    processos_similares = models.ForeignKey(
        ProcessosSimilares, db_index=True, on_delete=models.CASCADE)

    class Meta:
        unique_together = (('grupo', 'processos_similares'),)


class GrupoSimilarProcessosView(ManagedModel):
    grupo = models.ForeignKey(
        GrupoSimilar, to_field='id', db_index=True, on_delete=models.CASCADE)
    processos_similares = models.ForeignKey(
        ProcessosSimilares, to_field='id', db_index=True, on_delete=models.CASCADE)
    similaridade = models.FloatField(blank=False, null=False)
    processo_base_tj = models.CharField(max_length=18, db_index=True,null=True, blank=True)
    processo_base_cnj = models.CharField(max_length=25, db_index=True, blank=True, null=True)
    processo_similar_tj = models.CharField(max_length=18, db_index=True,null=True, blank=True)
    processo_similar_cnj = models.CharField(max_length=25, db_index=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'api_view_gruposimilar_processos'