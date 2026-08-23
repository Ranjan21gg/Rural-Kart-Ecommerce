from django.contrib import admin

# Register your models here.
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'razorpay_order_id', 'status', 'amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('razorpay_order_id', 'razorpay_payment_id', 'order__id')
    readonly_fields = ('order', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature', 'amount', 'created_at')