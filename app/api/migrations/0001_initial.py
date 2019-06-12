# Generated by Django 2.2.2 on 2019-06-12 03:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Advogado',
            fields=[
                ('cod_adv', models.IntegerField(primary_key=True, serialize=False)),
                ('num_oab', models.TextField(db_index=True)),
                ('nome_adv', models.TextField(db_index=True)),
            ],
        ),
        migrations.CreateModel(
            name='Assunto',
            fields=[
                ('cod_assunto', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.TextField()),
                ('assunto_pai', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.Assunto')),
            ],
        ),
        migrations.CreateModel(
            name='Cargo',
            fields=[
                ('cod_carg', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Classe',
            fields=[
                ('cod_classe', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.TextField()),
                ('classe_pai', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.Classe')),
            ],
        ),
        migrations.CreateModel(
            name='Comarca',
            fields=[
                ('cod_coma', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_coma', models.CharField(max_length=50)),
                ('desc_redu', models.CharField(max_length=3)),
            ],
        ),
        migrations.CreateModel(
            name='Competencia',
            fields=[
                ('cod_comp', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_comp', models.CharField(max_length=50)),
                ('desc_res', models.CharField(max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='GrupoSimilar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.CharField(db_index=True, max_length=150)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Personagem',
            fields=[
                ('cod_pers', models.IntegerField(primary_key=True, serialize=False)),
                ('nome', models.TextField(db_index=True)),
            ],
        ),
        migrations.CreateModel(
            name='Processo',
            fields=[
                ('id_proc', models.IntegerField(primary_key=True, serialize=False)),
                ('cod_proc', models.CharField(db_index=True, max_length=18, unique=True)),
                ('cod_cnj', models.CharField(blank=True, db_index=True, max_length=25, null=True, unique=True)),
                ('data_cad', models.DateTimeField(blank=True, null=True)),
                ('assunto', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='assunto_processo', to='api.Assunto')),
                ('classe', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='classe_processo', to='api.Classe')),
                ('competencia', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='competencia_processo', to='api.Competencia')),
            ],
        ),
        migrations.CreateModel(
            name='TipoAtoJuiz',
            fields=[
                ('cod_tip_ato', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='TipoDecisaoRecurso',
            fields=[
                ('cod_tip_dec_rec', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=25)),
            ],
        ),
        migrations.CreateModel(
            name='TipoDocumento',
            fields=[
                ('id_tip_doc', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=210)),
            ],
        ),
        migrations.CreateModel(
            name='TipoPersonagem',
            fields=[
                ('cod_tip_pers', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_pers', models.CharField(max_length=25)),
                ('tipo_part', models.CharField(max_length=1)),
                ('cod_tip_pers_inv', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_personagem_inverso', to='api.TipoPersonagem')),
            ],
        ),
        migrations.CreateModel(
            name='TipoMovimento',
            fields=[
                ('cod_tip_mov', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=100)),
                ('cod_tip_mov_pai', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_movimento_pai', to='api.TipoMovimento')),
            ],
        ),
        migrations.CreateModel(
            name='TipoAndamento',
            fields=[
                ('cod_tip_and', models.IntegerField(primary_key=True, serialize=False)),
                ('descr', models.CharField(max_length=60)),
                ('cod_tip_mov', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_movimento_andamento', to='api.TipoMovimento')),
            ],
        ),
        migrations.CreateModel(
            name='Serventia',
            fields=[
                ('cod_serv', models.IntegerField(primary_key=True, serialize=False)),
                ('desc_serv', models.CharField(max_length=80)),
                ('desc_abre', models.CharField(blank=True, max_length=10, null=True)),
                ('comarca', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='comarca', to='api.Comarca')),
            ],
        ),
        migrations.CreateModel(
            name='ProcessosSimilares',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('similaridade', models.FloatField()),
                ('processo_base', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='processo_base', to='api.Processo', to_field='cod_proc')),
                ('processo_similar', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='processo_similar', to='api.Processo', to_field='cod_proc')),
            ],
        ),
        migrations.AddField(
            model_name='processo',
            name='serventia',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='serventia_processo', to='api.Serventia'),
        ),
        migrations.CreateModel(
            name='GrupoSimilarUsuarios',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grupo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.GrupoSimilar')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GrupoSimilarProcessos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('grupo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.GrupoSimilar')),
                ('processo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.Processo')),
            ],
        ),
        migrations.CreateModel(
            name='Funcionario',
            fields=[
                ('num_matr', models.TextField(primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('cod_carg', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='cargo', to='api.Cargo')),
            ],
        ),
        migrations.CreateModel(
            name='DocumentoProcesso',
            fields=[
                ('cod_docto_elet', models.TextField(primary_key=True, serialize=False)),
                ('assunto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='documento_assunto', to='api.Assunto')),
                ('classe', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='documento_classe', to='api.Classe')),
                ('competencia', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='documento_competencia', to='api.Competencia')),
                ('processo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='documento_processo', to='api.Processo', to_field='cod_proc')),
                ('tipo_documento', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='api.TipoDocumento')),
            ],
        ),
        migrations.AddField(
            model_name='classe',
            name='cod_pers_ativo',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='personagem_ativo', to='api.TipoPersonagem'),
        ),
        migrations.AddField(
            model_name='classe',
            name='cod_pers_passivo',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='personagem_passivo', to='api.TipoPersonagem'),
        ),
        migrations.CreateModel(
            name='AtoJuiz',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cod_ato', models.IntegerField()),
                ('descr', models.CharField(max_length=60)),
                ('tipo_ato_juiz', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_ato_juiz', to='api.TipoAtoJuiz')),
                ('tipo_movimento', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_movimento_ato_juiz', to='api.TipoMovimento')),
            ],
            options={
                'unique_together': {('cod_ato', 'tipo_ato_juiz', 'tipo_movimento')},
            },
        ),
        migrations.CreateModel(
            name='PersonagemProcesso',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('personagem', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='personagem_processo', to='api.Personagem')),
                ('processo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='processo_personagem', to='api.Processo', to_field='cod_proc')),
                ('tipo_personagem', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_personagem_processo', to='api.TipoPersonagem')),
            ],
            options={
                'unique_together': {('processo', 'personagem')},
            },
        ),
        migrations.CreateModel(
            name='ClasseAssunto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assunto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='assunto_classe', to='api.Assunto')),
                ('classe', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='classe_assunto', to='api.Classe')),
            ],
            options={
                'unique_together': {('classe', 'assunto')},
            },
        ),
        migrations.CreateModel(
            name='AndamentoProcesso',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ordem', models.IntegerField()),
                ('dt_ato', models.DateTimeField(blank=True, null=True)),
                ('txt_descr', models.TextField()),
                ('txt_descr_len', models.IntegerField()),
                ('ato_juiz', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='ato_juiz_andamento_processo', to='api.AtoJuiz')),
                ('juiz', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='juiz_andamento_processo', to='api.Funcionario')),
                ('processo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='processo_andamento', to='api.Processo', to_field='cod_proc')),
                ('serventia', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='serventia_andamento_processo', to='api.Serventia')),
                ('tipo_andamento', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_andamento_processo', to='api.TipoAndamento')),
                ('tipo_ato_juiz', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_ato_juiz_andamento_processo', to='api.TipoAtoJuiz')),
                ('tipo_decisao_recurso', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_decisao_recurso', to='api.TipoDecisaoRecurso')),
            ],
            options={
                'unique_together': {('processo', 'ordem', 'txt_descr_len')},
            },
        ),
        migrations.CreateModel(
            name='AdvogadoProcesso',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tip_polo', models.CharField(blank=True, max_length=1, null=True)),
                ('advogado', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='advogado_processo', to='api.Advogado')),
                ('processo', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='processo_advogado', to='api.Processo', to_field='cod_proc')),
                ('tipo_personagem', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='tipo_personagem_advogado_processo', to='api.TipoPersonagem')),
            ],
            options={
                'unique_together': {('processo', 'advogado')},
            },
        ),
    ]
