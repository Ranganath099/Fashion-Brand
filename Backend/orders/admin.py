from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total_amount",
        "payment_status",
        "created_at",
    )
    list_filter = (
        "payment_status",
        "created_at",
    )
    search_fields = (
        "user__username",
        "user__email",
    )
    ordering = ("-created_at",)
