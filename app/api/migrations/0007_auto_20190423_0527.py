# Generated by Django 2.2 on 2019-04-23 05:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20190423_0515'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assunto',
            name='descr_tj',
        ),
        migrations.RemoveField(
            model_name='assunto',
            name='txt_gloss_cnj',
        ),
    ]