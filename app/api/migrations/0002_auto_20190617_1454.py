# Generated by Django 2.2.2 on 2019-06-17 17:54

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='gruposimilarprocessos',
            unique_together={('grupo', 'processos_similares')},
        ),
        migrations.AlterUniqueTogether(
            name='gruposimilarusuarios',
            unique_together={('grupo', 'user')},
        ),
    ]