# Generated by Django 3.2.3 on 2021-06-09 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0023_alter_order_state'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='state',
            field=models.IntegerField(default=0),
        ),
    ]
