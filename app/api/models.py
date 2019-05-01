from django.db import models
from django.db.models.fields.related import ForeignKey

# Create your models here.


class Comarca(models.Model):
    cod_coma = models.IntegerField(primary_key=True)
    desc_coma = models.CharField(max_length=50)
    desc_redu = models.CharField(max_length=3)
    objects = models.Manager


class Serventia(models.Model):
    cod_serv = models.IntegerField(primary_key=True)
    comarca = models.ForeignKey(Comarca, on_delete=models.DO_NOTHING)
    desc_serv = models.CharField(max_length=80)
    desc_abre = models.CharField(max_length=10, blank=True, null=True)
    objects = models.Manager


class TipoPersonagem(models.Model):
    cod_tip_pers = models.IntegerField(primary_key=True)
    cod_tip_pers_inv = models.ForeignKey(
        'api.TipoPersonagem',  blank=True, null=True, on_delete=models.DO_NOTHING)
    desc_pers = models.CharField(max_length=25)
    tipo_part = models.CharField(max_length=1)
    objects = models.Manager


class Assunto(models.Model):
    cod_assunto = models.IntegerField(primary_key=True)
    # TO DO PROCESSAR DUAS VEZES< com campo assunto_pai nulo e depois atualizando quando tiver as chaves cadastradas
    assunto_pai = models.ForeignKey(
        'api.Assunto', null=True, blank=True, on_delete=models.DO_NOTHING)
    descr = models.TextField()
    objects = models.Manager


class Classe(models.Model):
    cod_classe = models.IntegerField(primary_key=True)
    classe_pai = models.ForeignKey(
        'api.Classe', blank=True, null=True, on_delete=models.DO_NOTHING)
    descr = models.TextField()
    cod_pers_passivo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_passivo", blank=True, null=True, on_delete=models.DO_NOTHING, default=None)
    cod_pers_ativo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_ativo", blank=True, null=True, on_delete=models.DO_NOTHING, default=None)
    objects = models.Manager


class ClasseAssunto(models.Model):
    assunto = models.ForeignKey(Assunto, on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(Classe, on_delete=models.DO_NOTHING)
    objects = models.Manager

    class Meta:
        unique_together = (('classe', 'assunto'),)


class Competencia(models.Model):
    cod_comp = models.IntegerField(primary_key=True)
    desc_comp = models.CharField(max_length=50)
    desc_res = models.CharField(max_length=15)
    objects = models.Manager


class Processo(models.Model):
    cod_proc = models.CharField(primary_key=True, max_length=18)
    serventia = models.ForeignKey(Serventia, on_delete=models.DO_NOTHING)
    competencia = models.ForeignKey(Competencia, on_delete=models.CASCADE)
    objects = models.Manager


class ProcessoUnico(models.Model):
    processo = models.ForeignKey(Processo, on_delete=models.CASCADE)
    cod_cnj = models.CharField(max_length=25, unique=True)
    id_proc = models.IntegerField(unique=True)
    objects = models.Manager

    class Meta:
        unique_together = (('processo', 'cod_cnj', 'id_proc'),)


class TipoMovimento(models.Model):
    cod_tip_mov = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=100)
    cod_tip_mov_pai = ForeignKey(
        'api.TipoMovimento', blank=True, null=True, on_delete=models.DO_NOTHING, default=None)
    objects = models.Manager


class TipoAndamento(models.Model):
    cod_tip_and = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=60)
    cod_tip_mov = ForeignKey(TipoMovimento, blank=True,
                             null=True, on_delete=models.DO_NOTHING, default=None)
    objects = models.Manager


class Cargo(models.Model):
    cod_carg = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=50)
    objects = models.Manager


class Funcionario(models.Model):
    num_matr = models.TextField(primary_key=True)
    nome = models.CharField(max_length=100)
    cod_carg = models.ForeignKey(Cargo, blank=True, null=True, on_delete=models.DO_NOTHING)
    objects = models.Manager

class TipoDecisaoRecurso(models.Model):
    cod_tip_dec_rec = models.IntegerField(primary_key=True)
    descr = models.CharField(max_length=25)
    objects = models.Manager