# Generated by Django 3.2.3 on 2021-06-03 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0019_auto_20210603_2204'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='is_resetting_password',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
