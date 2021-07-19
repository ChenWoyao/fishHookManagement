from django.contrib.auth.models import User

from rest_framework import serializers
from cart.models import Product, Order, Profile, OutputProduce


class UserSerializer(serializers.ModelSerializer):
    phone = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'phone')
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def get_phone(self, obj):
        prf = Profile.objects.filter(user=obj.id)
        if prf:
            return str(prf[0].phone)


class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "type", "inventory_num", "unit_price", "create_time", "update_time", "name")


class ProductsAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "type", "inventory_num", "unit_price", "create_time", "update_time", "name",
                  "cost_price", "total_price", "total_make_price", "creator", "updater")


class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ("id", "type", "amount", "create_time", "update_time", "seller_id", "state",)


class OrdersAdminSerializer(serializers.ModelSerializer):
    seller = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ("id", "type", "amount", "create_time", "update_time", "state", "seller")

    def get_seller(self, obj):
        seller = User.objects.filter(id=obj.seller_id)
        if seller:
            return UserSerializer(seller[0]).data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class OutputProduceSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutputProduce
        fields = ("id", "type", "amount", "price", "producer_id", "create_time", "update_time")
