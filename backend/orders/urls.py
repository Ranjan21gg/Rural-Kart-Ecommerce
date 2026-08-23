from django.urls import path
from .views import CartDetailView, CartItemView
from .order_views import CheckoutView, OrderListView, OrderDetailView
from .order_views import AdminOrderListView, AdminOrderStatusUpdateView


urlpatterns = [
    path('cart/', CartDetailView.as_view(), name='cart-detail'),
    path('cart/items/', CartItemView.as_view(), name='cart-item-add'),
    path('cart/items/<int:item_id>/', CartItemView.as_view(), name='cart-item-detail'),
    
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    path('admin/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/status/', AdminOrderStatusUpdateView.as_view(), name='admin-order-status'),
]