# Generated by Django 2.2 on 2019-04-23 05:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20190423_0527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assunto',
            name='assunto_pai',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.Assunto'),
        ),
    ]
