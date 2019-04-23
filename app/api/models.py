from django.db import models

# Create your models here.


class Comarca(models.Model):
    cod_coma = models.IntegerField(primary_key=True)
    desc_coma = models.CharField(max_length=30)
    desc_redu = models.CharField(max_length=3)
    objects = models.Manager


class Serventia(models.Model):
    cod_serv = models.IntegerField(primary_key=True)
    comarca = models.ForeignKey(Comarca, on_delete=models.DO_NOTHING)
    desc_serv = models.CharField(max_length=30)
    desc_abre = models.CharField(max_length=10)
    desc_redu = models.CharField(max_length=3)
    objects = models.Manager


class TipoPersonagem(models.Model):
    cod_tip_pers = models.IntegerField(primary_key=True)
    cod_tip_pers_inv = models.ForeignKey(
        'api.TipoPersonagem', on_delete=models.DO_NOTHING)
    desc_pers = models.CharField(max_length=20)
    desc_abre = models.CharField(max_length=10)
    desc_redu = models.CharField(max_length=3)
    objects = models.Manager


class Assunto(models.Model):
    cod_assunto = models.IntegerField(primary_key=True)
    cod_tip_assunto = models.IntegerField()
    assunto_pai = models.ForeignKey('api.Assunto', on_delete=models.DO_NOTHING)
    descr = models.TextField()
    descr_tj = models.TextField()
    txt_gloss_cnj = models.TextField()
    objects = models.Manager


class Classe(models.Model):
    cod_assunto = models.IntegerField(primary_key=True)
    classe_pai = models.ForeignKey('api.Classe', on_delete=models.DO_NOTHING)
    descr = models.TextField()
    descr_tj = models.TextField()
    cod_pers_passivo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_passivo", on_delete=models.DO_NOTHING, default=None)
    cod_pers_ativo = models.ForeignKey(
        TipoPersonagem, related_name="personagem_ativo", on_delete=models.DO_NOTHING, default=None)
    objects = models.Manager


class ClasseAssunto(models.Model):
    assunto = models.ForeignKey(Assunto, on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(Classe, on_delete=models.DO_NOTHING)
    objects = models.Manager


class Competencia(models.Model):
    cod_comp = models.IntegerField(primary_key=True)
    desc_comp = models.CharField(max_length=50)
    desc_res = models.CharField(max_length=13)
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
