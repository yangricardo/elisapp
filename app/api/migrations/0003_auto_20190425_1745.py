# Generated by Django 2.2 on 2019-04-25 17:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20190423_2304'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='processounico',
            unique_together={('processo', 'cod_cnj', 'id_proc')},
        ),
        migrations.CreateModel(
            name='TipoMovimento',
            fields=[
                ('cod_tip_mov', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=100)),
                ('cod_tip_mov_pai', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoMovimento')),
            ],
        ),
        migrations.CreateModel(
            name='TipoAndamento',
            fields=[
                ('cod_tip_and', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=60)),
                ('cod_tip_mov', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoMovimento')),
            ],
        ),
    ]
