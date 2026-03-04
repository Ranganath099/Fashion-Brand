from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart
from django.utils import timezone

class CreateOrderView(generics.GenericAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # 1️⃣ Get cart
        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            raise ValidationError({"detail": "Cart is empty"})

        # 2️⃣ Calculate total securely
        total = sum(
            item.product.price * item.quantity
            for item in cart.items.all()
        )

        # 3️⃣ Create order
        order = Order.objects.create(
            user=user,
            total_amount=total,
            payment_status="PENDING"
        )

        # 4️⃣ Create order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                size=item.size,
                quantity=item.quantity,
                price=item.product.price
            )

        # 5️⃣ Clear cart
        cart.items.all().delete()

        # 6️⃣ Serialize response
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CancelOrderView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        reason = request.data.get("reason")

        if not reason:
            raise ValidationError({"reason": "Cancellation reason is required"})

        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user
            )
        except Order.DoesNotExist:
            raise ValidationError({"detail": "Order not found"})

        # ❌ Cannot cancel delivered order
        if order.order_status == "DELIVERED":
            raise ValidationError(
                {"detail": "Delivered orders cannot be cancelled"}
            )

        if order.is_cancelled:
            raise ValidationError(
                {"detail": "Order already cancelled"}
            )

        # ✅ Cancel
        order.is_cancelled = True
        order.order_status = "CANCELLED"
        order.payment_status = (
            "REFUNDED" if order.payment_status == "PAID" else order.payment_status
        )
        order.cancel_reason = reason
        order.cancelled_at = timezone.now()
        order.save()

        return Response(
            {"detail": "Order cancelled successfully"},
            status=status.HTTP_200_OK
        )

    
class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)