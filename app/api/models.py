from django.db import models

# Create your models here.
class Comarca(models.Model):
    cod_coma = models.IntegerField(primary_key=True)
    desc_coma = models.CharField(max_length=30)
    desc_redu = models.CharField(max_length=3)


class Serventia(models.Model):
    cod_serv = models.IntegerField(primary_key=True)
    comarca = models.ForeignKey(Comarca, on_delete=models.DO_NOTHING)
    desc_serv = models.CharField(max_length=30)
    desc_abre = models.CharField(max_length=10)
    desc_redu = models.CharField(max_length=3)


class TipoPersonagem(models.Model):
    cod_tip_pers = models.IntegerField(primary_key=True)
    cod_tip_pers_inv = models.ForeignKey('api.TipoPersonagem', on_delete=models.DO_NOTHING)
    desc_pers = models.CharField(max_length=20)
    desc_abre = models.CharField(max_length=10)
    desc_redu = models.CharField(max_length=3)
    

class Assunto(models.Model):
    cod_assunto = models.IntegerField(primary_key=True)
    cod_tip_assunto = models.IntegerField()
    assunto_pai = models.ForeignKey('api.Assunto', on_delete=models.DO_NOTHING)
    descr = models.TextField()
    descr_tj = models.TextField()
    txt_gloss_cnj = models.TextField()


class Classe(models.Model):
    cod_assunto = models.IntegerField(primary_key=True)
    classe_pai = models.ForeignKey('api.Classe', on_delete=models.DO_NOTHING)
    descr = models.TextField()
    descr_tj = models.TextField()
    cod_pers_passivo = models.ForeignKey(TipoPersonagem, related_name="personagem_passivo" ,on_delete=models.DO_NOTHING, default=None)
    cod_pers_ativo = models.ForeignKey(TipoPersonagem, related_name="personagem_ativo", on_delete=models.DO_NOTHING, default=None)


class ClasseAssunto(models.Model):
    assunto = models.ForeignKey(Assunto, on_delete=models.DO_NOTHING)
    classe = models.ForeignKey(Classe, on_delete=models.DO_NOTHING)
    

class Competencia(models.Model):
    cod_comp = models.IntegerField(primary_key=True)



class Processo(models.Model):
    cod_proc = models.IntegerField(primary_key=True)
    serventia = models.ForeignKey(Serventia, on_delete=models.DO_NOTHING)
    