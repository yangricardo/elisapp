# Generated by Django 2.2 on 2019-04-07 22:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assunto',
            fields=[
                ('cod_assunto', models.IntegerField(primary_key=True, serialize=False)),
                ('cod_tip_assunto', models.IntegerField()),
                ('descr', models.TextField()),
                ('descr_tj', models.TextField()),
                ('txt_gloss_cnj', models.TextField()),
                ('assunto_pai', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Assunto')),
            ],
        ),
        migrations.CreateModel(
            name='Classe',
            fields=[
                ('cod_assunto', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.TextField()),
                ('descr_tj', models.TextField()),
                ('classe_pai', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Classe')),
            ],
        ),
        migrations.CreateModel(
            name='Comarca',
            fields=[
                ('cod_coma', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_coma', models.CharField(max_length=30)),
                ('desc_redu', models.CharField(max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Competencia',
            fields=[
                ('cod_comp', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='TipoPersonagem',
            fields=[
                ('cod_tip_pers', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_pers', models.CharField(max_length=20)),
                ('desc_abre', models.CharField(max_length=10)),
                ('desc_redu', models.CharField(max_length=3)),
                ('cod_tip_pers_inv', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem')),
            ],
        ),
        migrations.CreateModel(
            name='Serventia',
            fields=[
                ('cod_serv', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_serv', models.CharField(max_length=30)),
                ('desc_abre', models.CharField(max_length=10)),
                ('desc_redu', models.CharField(max_length=3)),
                ('comarca', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Comarca')),
            ],
        ),
        migrations.CreateModel(
            name='Processo',
            fields=[
                ('cod_proc', models.IntegerField(primary_key=True, serialize=False)),
                ('serventia', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Serventia')),
            ],
        ),
        migrations.CreateModel(
            name='ClasseAssunto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assunto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Assunto')),
                ('classe', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Classe')),
            ],
        ),
        migrations.AddField(
            model_name='classe',
            name='cod_pers_passivo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoPersonagem'),
        ),
    ]