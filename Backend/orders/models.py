from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):

    # 1️⃣ ORDER STATUS (delivery)
    ORDER_STATUS_CHOICES = [
        ("PLACED", "Placed"),
        ("CONFIRMED", "Confirmed"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELLED", "Cancelled"),
    ]

    # 2️⃣ PAYMENT STATUS (money)
    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]

    # 3️⃣ CANCEL REASONS
    CANCEL_REASON_CHOICES = [
        ("COLOR_MISMATCH", "Color mismatch"),
        ("WRONG_SIZE", "Wrong size"),
        ("ADDRESS_CHANGE", "Address change"),
        ("OTHER", "Other"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # 🔥 NEW FIELDS
    order_status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS_CHOICES,
        default="PLACED"
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING"
    )

    # cancel tracking
    is_cancelled = models.BooleanField(default=False)
    cancel_reason = models.CharField(
        max_length=50,
        choices=CANCEL_REASON_CHOICES,
        null=True,
        blank=True
    )
    cancelled_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"



class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} ({self.size})"
