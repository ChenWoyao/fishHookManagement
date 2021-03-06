# Generated by Django 3.2.3 on 2021-06-01 15:12

from decimal import Decimal
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0015_profile'),
    ]

    operations = [
        migrations.CreateModel(
            name='OutputProduce',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(default='', max_length=100)),
                ('amount', models.IntegerField(default=0)),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('update_time', models.DateTimeField(auto_now_add=True)),
                ('producer_id', models.CharField(default='', max_length=100)),
                ('state', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'output_produce',
            },
        ),
        migrations.AddField(
            model_name='orders',
            name='amount',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='orders',
            name='created_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='orders',
            name='seller_id',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='orders',
            name='state',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='orders',
            name='type',
            field=models.CharField(default='', max_length=100),
        ),
        migrations.AddField(
            model_name='orders',
            name='update_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='products',
            name='cost_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
        migrations.AddField(
            model_name='products',
            name='created_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='products',
            name='inventory_num',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='products',
            name='total_make_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
        migrations.AddField(
            model_name='products',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
        migrations.AddField(
            model_name='products',
            name='type',
            field=models.CharField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='products',
            name='unit_price',
            field=models.DecimalField(decimal_places=2, default=Decimal('0.00'), max_digits=10),
        ),
        migrations.AddField(
            model_name='products',
            name='update_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
