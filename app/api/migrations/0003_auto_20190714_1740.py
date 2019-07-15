# Generated by Django 2.2.2 on 2019-07-14 20:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20190617_1454'),
    ]

    operations = [
        migrations.CreateModel(
            name='GrupoSimilarProcessosView',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('similaridade', models.FloatField()),
                ('processo_base_tj', models.CharField(blank=True, db_index=True, max_length=18, null=True)),
                ('processo_base_cnj', models.CharField(blank=True, db_index=True, max_length=25, null=True)),
                ('processo_similar_tj', models.CharField(blank=True, db_index=True, max_length=18, null=True)),
                ('processo_similar_cnj', models.CharField(blank=True, db_index=True, max_length=25, null=True)),
            ],
            options={
                'db_table': 'api_view_gruposimilar_processos',
                'managed': False,
            },
        ),
        migrations.AlterField(
            model_name='gruposimilarprocessos',
            name='grupo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.GrupoSimilar'),
        ),
        migrations.AlterField(
            model_name='gruposimilarprocessos',
            name='processos_similares',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.ProcessosSimilares'),
        ),
        migrations.AlterField(
            model_name='gruposimilarusuarios',
            name='administrador',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='administrador', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='gruposimilarusuarios',
            name='grupo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.GrupoSimilar'),
        ),
        migrations.AlterField(
            model_name='gruposimilarusuarios',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]