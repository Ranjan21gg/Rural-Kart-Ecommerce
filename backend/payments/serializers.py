from rest_framework import serializers
from .models import Payment
from orders.serializers import OrderItemSerializer


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    order_status = serializers.CharField(source='order.status', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'status', 'amount', 'order_status', 'created_at']



class AdminPaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    order_status = serializers.CharField(source='order.status', read_only=True)
    customer_username = serializers.CharField(source='order.user.username', read_only=True)
    items = OrderItemSerializer(source='order.items', many=True, read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order_id', 'customer_username', 'status', 'amount',
            'order_status', 'razorpay_order_id', 'razorpay_payment_id', 'created_at',
            'items',
        ]