from django.urls import path
from .views import RazorpayWebhookView, PaymentStatusView, VerifyPaymentView, RetryPaymentView, AdminPaymentListView

urlpatterns = [
    path('webhook/', RazorpayWebhookView.as_view(), name='razorpay-webhook'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('retry/<int:order_id>/', RetryPaymentView.as_view(), name='retry-payment'),
    
    path('status/<int:order_id>/', PaymentStatusView.as_view(), name='payment-status'),
    path('admin/', AdminPaymentListView.as_view(), name='admin-payment-list'),
]