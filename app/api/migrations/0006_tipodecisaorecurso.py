# Generated by Django 2.2 on 2019-05-01 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_funcionario'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoDecisaoRecurso',
            fields=[
                ('cod_tip_dec_rec', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=25)),
            ],
        ),
    ]
