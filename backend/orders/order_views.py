from django.db import transaction
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from products.models import Product
from .models import Cart, Order, OrderItem
from .serializers import OrderSerializer
import razorpay
from django.conf import settings
from payments.models import Payment

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipping_address = request.data.get('shipping_address', '').strip()

        if not shipping_address:
            return Response(
                {'detail': 'Shipping address is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        # -------------------------------------------------
        # 1. Decide: BUY NOW or CART CHECKOUT
        # -------------------------------------------------

        if product_id:
            # BUY NOW
            try:
                quantity = int(quantity or 1)

                if quantity < 1:
                    raise ValueError

            except (TypeError, ValueError):
                return Response(
                    {'detail': 'Invalid quantity.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                product = Product.objects.get(
                    id=product_id,
                    is_active=True
                )
            except Product.DoesNotExist:
                return Response(
                    {'detail': 'Product not found.'},
                    status=status.HTTP_404_NOT_FOUND
                )

            checkout_items = [
                {
                    'product': product,
                    'quantity': quantity,
                }
            ]

            cart = None

        else:
            # CART CHECKOUT
            try:
                cart = Cart.objects.get(
                    user=request.user
                )
            except Cart.DoesNotExist:
                return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            cart_items = cart.items.select_related('product').all()

            if not cart_items.exists():
                return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

            checkout_items = [
                {
                    'product': item.product,
                    'quantity': item.quantity,
                    'cart_item': item,
                }
                for item in cart_items
            ]

        # -------------------------------------------------
        # 2. Transaction
        # -------------------------------------------------

        with transaction.atomic():

            # Get all products involved in this checkout
            product_ids = [
                item['product'].id
                for item in checkout_items
            ]

            # Lock product rows
            locked_products = {
                product.id: product
                for product in Product.objects.select_for_update().filter(
                    id__in=product_ids
                )
            }

            # -------------------------------------------------
            # 3. Validate stock
            # -------------------------------------------------

            for item in checkout_items:
                product = locked_products[item['product'].id]
                quantity = item['quantity']

                if product.stock_quantity < quantity:
                    return Response(
                        {
                            'detail': (
                                f'Insufficient stock for {product.name}. '
                                f'Only {product.stock_quantity} left.'
                            )
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # -------------------------------------------------
            # 4. Calculate total
            # -------------------------------------------------

            total = sum(
                item['quantity']
                * locked_products[item['product'].id].price
                for item in checkout_items
            )

            # -------------------------------------------------
            # 5. Create pending order
            # -------------------------------------------------

            # Save address to user's profile
            request.user.shipping_address = shipping_address
            request.user.save(update_fields=["shipping_address"])

            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=total,
                shipping_address=shipping_address,
                status=Order.Status.PENDING,
            )

            # -------------------------------------------------
            # 6. Create order items
            # -------------------------------------------------

            for item in checkout_items:
                product = locked_products[item['product'].id]

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                    price_at_purchase=product.price,
                )

            # -------------------------------------------------
            # 7. Create Razorpay order
            # -------------------------------------------------

            razorpay_order = razorpay_client.order.create({
                'amount': int(total * 100),
                'currency': 'INR',
                'receipt': f'order_{order.id}',
            })

            # -------------------------------------------------
            # 8. Create payment record
            # -------------------------------------------------

            Payment.objects.create(
                order=order,
                razorpay_order_id=razorpay_order['id'],
                amount=total,
                status='created',
            )

        # -------------------------------------------------
        # 9. Response
        # -------------------------------------------------

        return Response(
            {
                'order_id': order.id,
                'razorpay_order_id': razorpay_order['id'],
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'amount': razorpay_order['amount'],
                'currency': 'INR',
            },
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')





from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdminRole
from .serializers import AdminOrderSerializer, OrderStatusUpdateSerializer


class AdminOrderListView(generics.ListAPIView):
    serializer_class = AdminOrderSerializer
    permission_classes = [IsAdminRole]
    queryset = Order.objects.select_related('user').prefetch_related('items').order_by('-created_at')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['user__username', 'id']


class AdminOrderStatusUpdateView(generics.UpdateAPIView):
    serializer_class = OrderStatusUpdateSerializer
    permission_classes = [IsAdminRole]
    queryset = Order.objects.all()
    http_method_names = ['patch']