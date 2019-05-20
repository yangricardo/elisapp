# Generated by Django 2.2.1 on 2019-05-20 04:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_advogado_advogadoprocesso_personagem_personagemprocesso'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advogadoprocesso',
            name='tipo_personagem',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem'),
        ),
        migrations.AlterField(
            model_name='personagemprocesso',
            name='tipo_personagem',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem'),
        ),
    ]
