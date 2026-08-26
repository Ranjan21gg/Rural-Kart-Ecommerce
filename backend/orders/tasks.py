# Email tasks

from celery import shared_task
from django.conf import settings
from django.template.loader import render_to_string
import requests


@shared_task
def send_order_confirmation_email(order_id):
    from .models import Order

    try:
        order = (
            Order.objects
            .select_related('user')
            .prefetch_related('items__product')
            .get(id=order_id)
        )
    except Order.DoesNotExist:
        return f"Order {order_id} no longer exists."

    subject = f"Rural-Kart | Order #{order.id} confirmed"

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

    html_message = render_to_string(
        'emails/order_confirmation.html',
        {
            'order': order,
            'logo_url': settings.RURAL_KART_LOGO_URL,
            'order_url': order_url,
        }
    )

    payload = {
        "sender": {
            "email": settings.DEFAULT_FROM_EMAIL,
            "name": "Rural-Kart",
        },
        "to": [
            {
                "email": order.user.email,
                "name": order.user.username,
            }
        ],
        "subject": subject,
        "htmlContent": html_message,
        "textContent": text_message,
    }

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers=headers,
            json=payload,
            timeout=10,
        )

        response.raise_for_status()

        data = response.json()

        return (
            f"Confirmation email sent for order {order_id}. "
            f"Message ID: {data.get('messageId')}"
        )

    except requests.RequestException as exc:
        return f"Failed to send email for order {order_id}: {exc}"