# Generated by Django 3.2.3 on 2021-06-09 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0022_auto_20210607_1607'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='state',
            field=models.CharField(choices=[('rejected', 'rejected'), ('approved', 'approved'), ('new', 'new')], default='new', max_length=100),
        ),
    ]