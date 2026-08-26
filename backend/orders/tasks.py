# Email tasks

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


@shared_task
def send_order_confirmation_email(order_id):
    from .models import Order

    try:
        order = (Order.objects.select_related('user')
            .prefetch_related('items__product')
            .get(id=order_id)
        )
    except Order.DoesNotExist:
        return f"Order {order_id} no longer exists."

    # Email subject
    subject = f"Rural-Kart | Order #{order.id} confirmed"

    # Plain-text fallback
    text_message = (
        f"Hi {order.user.username},\n\n"
        f"Your order #{order.id} has been confirmed and paid.\n\n"
        f"Total: Rs. {order.total_amount}\n\n"
        f"Shipping to:\n"
        f"{order.shipping_address}\n\n"
        f"Thank you for shopping with Rural-Kart!\n\n"
        f"Rural-Kart\n"
        f"Local • Authentic • Yours"
    )

    order_url = (
        f"{settings.RURAL_KART_FRONTEND_URL}"
        f"/orders/{order.id}"
    )

    # HTML email
    html_message = render_to_string(
        'emails/order_confirmation.html',
        {
            'order': order,
            'logo_url': settings.RURAL_KART_LOGO_URL,
            "order_url": order_url,
        }
    )

    # Send email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[order.user.email],
    )
    email.attach_alternative(html_message,'text/html')
    try:
        email.send()
    except Exception as exc:
        return f"Failed to send confirmation email for order {order_id}: {exc}"

    return f"Confirmation email sent for order {order_id}"