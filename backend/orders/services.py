from django.db import transaction
from .models import Order
from products.models import Product


@transaction.atomic
def cancel_order_and_restore_stock(order):
    if order.status != Order.Status.PENDING:
        return False

    items = order.items.select_related("product").all()

    product_ids = [item.product_id for item in items]

    products = {
        product.id: product
        for product in Product.objects.select_for_update().filter(
            id__in=product_ids
        )
    }

    for item in items:
        product = products[item.product_id]
        product.stock_quantity += item.quantity
        product.save(update_fields=["stock_quantity"])

    order.status = Order.Status.CANCELLED
    order.save(update_fields=["status"])

    return True