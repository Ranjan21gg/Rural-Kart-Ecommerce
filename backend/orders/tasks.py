# Email tasks
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_order_confirmation_email(order_id):
    from .models import Order

    try:
        order = Order.objects.select_related('user').get(id=order_id)
    except Order.DoesNotExist:
        return f"Order {order_id} no longer exists."

    subject = f"Order #{order.id} confirmed"
    message = (
        f"Hi {order.user.username},\n\n"
        f"Your order #{order.id} has been confirmed and paid.\n"
        f"Total: Rs. {order.total_amount}\n"
        f"Shipping to: {order.shipping_address}\n\n"
        f"Thank you for your order!"
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [order.user.email])
    return f"Confirmation email sent for order {order_id}"