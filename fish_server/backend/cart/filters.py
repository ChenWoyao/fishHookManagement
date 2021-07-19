from django_filters import rest_framework as filters

from cart import models
from cart.models import Product, Order


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class ProductFilter(filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Product
        fields = ['id_in', "id", "type"]


class OrderFilter(filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = Order
        fields = ("type", "amount", "create_time", "update_time", "seller_id", "state",)


class UserFilter(filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = models.User
        fields = ("id", "id_in", "username")


class OutputProduceFilter(filters.FilterSet):
    id_in = NumberInFilter(field_name='id', lookup_expr='in')

    class Meta:
        model = models.OutputProduce
        fields = ("id", "type", "amount", "price", "producer_id", "create_time", "update_time", "state")
