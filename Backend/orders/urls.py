from django.urls import path
from .views import CreateOrderView, MyOrdersView, CancelOrderView

urlpatterns = [
    path("create/", CreateOrderView.as_view()),
    path("my-orders/", MyOrdersView.as_view()),
    path("cancel/<int:order_id>/", CancelOrderView.as_view()),
]
