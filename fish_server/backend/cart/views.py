from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.db.models.functions import TruncDay
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, serializers, status, filters

from cart import models as cart_models
from cart import filters as cart_filters
from cart import serializers as cart_serializers
from cart import permissions as cart_permission

from cart.page import StandardResultsSetPagination


class FViewSet(viewsets.ModelViewSet):
    model = NotImplemented
    serializer_class = NotImplemented
    admin_serializer_class = NotImplemented
    filter_class = NotImplemented
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination
    search_fields = "__all__"
    ordering_fields = "__all__"
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        self.permission_classes = (cart_permission.IsStaff, permissions.IsAdminUser)
        self.check_permissions(self.request)

    def perform_update(self, serializer):
        self.permission_classes = (cart_permission.IsStaff, permissions.IsAdminUser)
        self.check_permissions(self.request)

    def get_queryset(self):
        if "page" not in self.request.query_params:
            self.pagination_class = None
        return super(FViewSet, self).get_queryset()

    @action(detail=False, permission_classes=[permissions.IsAdminUser], methods=["POST", ])
    def admin_create_or_update(self, request, *args, **kwargs):
        pk = self.request.data.get("id")
        if pk:
            partial = True
            ins = self.model.objects.get(pk=pk)
            serializer = self.admin_serializer_class(ins, data=self.request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            serializer.save(updater=self.request.user.id)
            return Response(serializer.data)
        else:
            serializer = self.admin_serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(creator=self.request.user.id)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, permission_classes=[permissions.IsAdminUser])
    def admin_list(self, request):
        queryset = self.filter_queryset(self.model.objects.all())
        if "page" in request.query_params:
            page = self.paginate_queryset(queryset)
            serializer = self.admin_serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.admin_serializer_class(queryset, many=True)
        return Response(serializer.data)


class ProductsViewSet(FViewSet):
    model = cart_models.Product
    serializer_class = cart_serializers.ProductsSerializer
    admin_serializer_class = cart_serializers.ProductsAdminSerializer
    filter_class = cart_filters.ProductFilter
    queryset = model.objects.all()


class OrdersViewSet(FViewSet):
    model = cart_models.Order
    serializer_class = cart_serializers.OrdersSerializer
    admin_serializer_class = cart_serializers.OrdersAdminSerializer
    filter_class = cart_filters.OrderFilter
    queryset = model.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(seller_id=self.request.user.id)


class UserViewSet(FViewSet):
    model = cart_models.User
    serializer_class = cart_serializers.UserSerializer
    admin_serializer_class = cart_serializers.UserSerializer
    filter_class = cart_filters.UserFilter
    queryset = model.objects.all()
    permission_classes = (permissions.IsAdminUser,)

    @action(detail=False, permission_classes=[permissions.AllowAny], methods=["POST", ])
    def user_create(self, request):
        data = request.data
        data["password"] = make_password(data["password"])
        phone = data.pop("phone")
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer_profile = cart_serializers.ProfileSerializer(data={"phone": phone})
        serializer_profile.is_valid(raise_exception=True)
        user = serializer.save()
        serializer_profile.save(user=user.id)
        headers = self.get_success_headers(serializer.data)
        return Response(self.serializer_class(self.model.objects.get(id=user.id)).data, status=status.HTTP_201_CREATED,
                        headers=headers)

    @action(detail=False, permission_classes=[cart_permission.IsStaffOrTargetUser], methods=["POST", ])
    def user_update(self, request):
        data = request.data
        data["password"] = make_password(self.request.data['password'])
        phone = self.request.data.get("phone")
        ins = self.model.objects.get(id=data["id"])
        serializer = self.serializer_class(ins, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        if phone:
            ins = cart_models.Profile.objects.get(user=data["id"])
            serializer_profile = cart_serializers.ProfileSerializer(ins, data={"phone": phone})
            serializer_profile.is_valid(raise_exception=True)
            serializer_profile.save()
        return Response(self.serializer_class(self.model.objects.get(id=data["id"])).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def update_passwd(self, request, *args, **kwargs):
        ins = request.user
        serializer = self.get_serializer(ins, data=request.data)
        profile = cart_models.Profile.objects.filter(id=ins.id)
        if not profile or not profile.is_resetting_password:
            raise permissions.exceptions.PermissionDenied
        profile = profile[0]
        if self.request.data.get("password") != self.request.data.get("confirmPassword"):
            return Response({"result": "密码不一致"})
        password = make_password(self.request.data['password'])
        serializer.password = password
        if serializer.is_valid():
            serializer.save()
        profile.is_resetting_password = False
        profile.save()
        return Response({"result": True})

    @action(detail=True, methods=['post'], url_path="update_profile",
            permission_classes=[cart_permission.IsStaffOrTargetUser])
    def update_profile(self, request, *args, **kwargs):
        user = self.get_object()
        if "password" in request.data:
            raise permissions.exceptions.PermissionDenied
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save(phone=request.data.get("phone"))
            return Response({"result": True})
        else:
            raise serializers.ValidationError({"result": "invalid input"})


class OutputProduceViewSet(FViewSet):
    model = cart_models.OutputProduce
    serializer_class = cart_serializers.OutputProduceSerializer
    admin_serializer_class = cart_serializers.OutputProduceSerializer
    filter_class = cart_filters.OutputProduceFilter
    permission_classes = [permissions.IsAuthenticated, ]
    queryset = model.objects.all()

    def get_queryset(self):
        self.queryset = self.queryset.filter(producer_id=self.request.user.id)
        return super(OutputProduceViewSet, self).get_queryset()

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def statistics_month_by_day_line(self, request):
        prs = self.model.objects.filter(producer_id=str(self.request.user.id),
                                        update_time__gte=timezone.now() - timezone.timedelta(days=30))
        res = prs.annotate(day=TruncDay('create_time')).values("day") \
            .annotate(count=Count('id')).values('day', 'count').order_by("day")
        return Response(res)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def statistics_month_by_day_pie(self, request):
        prs = self.model.objects.filter(producer_id=str(self.request.user.id),
                                        update_time__gte=timezone.now() - timezone.timedelta(days=30)) \
            .order_by("type")
        res = prs.values("type").annotate(count=Count('id')).values('type', 'count')
        for i in res:
            prod = cart_models.Product.objects.get(type=i.get("type"))
            i["product"] = cart_serializers.ProductsSerializer(prod).data
        return Response(res)

    def perform_create(self, serializer):
        user_id = self.request.user.id
        serializer.save(producer_id=str(user_id))

    def perform_update(self, serializer):
        user_id = self.request.user.id
        serializer.save(producer_id=str(user_id))

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def statistic(self, request, pk=None):
        res = cart_models.OutputProduce.objects.filter(producer_id=str(self.request.user.id)).values("type").annotate(
            count=Count('id')) \
            .values('type', 'count', "price").order_by("-count")
        for i in res:
            prod = cart_models.Product.objects.get(type=i.get("type"))
            i["product"] = cart_serializers.ProductsSerializer(prod).data
            i["total_price"] = i["count"] * i["price"]
        return Response(res)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def audit(self, request, *args, **kwargs):
        prgs = self.get_queryset()
        page = self.paginate_queryset(prgs)
        if page is None:
            res = cart_serializers.OutputProduceSerializer(prgs, many=True).data
        else:
            res = cart_serializers.OutputProduceSerializer(page, many=True).data
        for i in res:
            prod = cart_models.Product.objects.get(type=i.get("type"))
            i["name"] = prod.name
        if page is None:
            ret = Response(res)
        else:
            ret = self.get_paginated_response(res)
        return ret
