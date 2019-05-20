# Generated by Django 2.2.1 on 2019-05-20 04:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20190520_0125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advogadoprocesso',
            name='tipo_personagem',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem'),
        ),
        migrations.AlterField(
            model_name='personagemprocesso',
            name='tipo_personagem',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem'),
        ),
    ]