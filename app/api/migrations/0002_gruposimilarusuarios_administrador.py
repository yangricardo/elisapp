# Generated by Django 2.2.2 on 2019-06-16 20:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='gruposimilarusuarios',
            name='administrador',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, related_name='administrador', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
