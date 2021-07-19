from django.contrib import admin

# Register your models here.
from cart import models

admin.site.register(models.Profile)
admin.site.register(models.Product)
admin.site.register(models.Order)
admin.site.register(models.OutputProduce)
