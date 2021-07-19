from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

from decimal import Decimal
from phonenumber_field.modelfields import PhoneNumberField


# Create your models here.
class Product(models.Model):
    category = models.CharField(max_length=30)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    # quantity = models.PositiveIntegerField()
    rating = models.PositiveSmallIntegerField(default=0)
    description = models.TextField(default='Product description.')
    image_url = models.TextField(default='')
    creator = models.CharField(max_length=100, default='')
    updater = models.CharField(max_length=100, default='')

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    inventory_num = models.IntegerField(default=0)  # 库存
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))  # 单价，售价
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))  # 单价 * 库存 = 总价
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))  # 成本价
    total_make_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))  # 成本价 * 库存 = 制作金额
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product'


class Profile(models.Model):
    user = models.CharField(max_length=100, default='')  # User ID
    phone = PhoneNumberField()
    is_resetting_password = models.BooleanField(default=False)

    class Meta:
        db_table = 'user_profile'


class Order(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    products = ArrayField(models.CharField(max_length=50), default=[])
    quantities = ArrayField(models.PositiveIntegerField(), default=[])
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    delivery_method = models.CharField(max_length=30, default='')
    payment_method = models.CharField(max_length=30, default='')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)

    type = models.CharField(max_length=100, default='')  # 产品型号
    amount = models.IntegerField(default=0)  # 出库数量
    create_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now_add=True)
    seller_id = models.CharField(max_length=100, default='')  # 销售 ID
    state = models.IntegerField(default=0)

    class Meta:
        db_table = 'order'


class OutputProduce(models.Model):
    type = models.CharField(max_length=100, default='')  # 产品型号
    amount = models.IntegerField(default=0)  # 生产数量
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    producer_id = models.CharField(max_length=100, default='')  # 生产员 ID
    create_time = models.DateTimeField(auto_now_add=True)  # 生产日期
    update_time = models.DateTimeField(auto_now_add=True)
    state = models.IntegerField(default=0)

    class Meta:
        db_table = 'output_produce'
