from django.urls import path
from .views import AddToCartView, MyCartView, RemoveCartItemView,UpdateCartItemView

urlpatterns = [
    path("add/", AddToCartView.as_view()),
    path("", MyCartView.as_view()),
    path("remove/<int:item_id>/", RemoveCartItemView.as_view()),
    path("update/<int:item_id>/", UpdateCartItemView.as_view()),

]
