# Create your views here.
import razorpay
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import Payment
from orders.models import Cart, Order
from products.models import Product

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

from orders.tasks import send_order_confirmation_email



@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print("🔥 WEBHOOK RECEIVED")
        print("EVENT:")
        print(request.data.get('event'))
        print("PAYLOAD:")
        print(request.data)

        signature = request.headers.get('X-Razorpay-Signature', '')

        try:
            razorpay_client.utility.verify_webhook_signature(
                request.body.decode('utf-8'),
                signature,
                settings.RAZORPAY_WEBHOOK_SECRET
            )
        except razorpay.errors.SignatureVerificationError:
            return HttpResponse(status=400)

        payload = request.data
        event = payload.get('event')

        if event == 'payment.captured':
            payment_entity = payload['payload']['payment']['entity']
            razorpay_order_id = payment_entity['order_id']
            razorpay_payment_id = payment_entity['id']

            try:
                payment = Payment.objects.select_related('order').get(
                    razorpay_order_id=razorpay_order_id
                )
            except Payment.DoesNotExist:
                return HttpResponse(status=404)

            payment.razorpay_payment_id = razorpay_payment_id
            payment.status = 'captured'
            payment.save(update_fields=['razorpay_payment_id', 'status'])

            order = payment.order

            if order.status != Order.Status.PAID:
                order.status = Order.Status.PAID
                order.save(update_fields=['status'])

        elif event == 'payment.failed':
            payment_entity = request.data['payload']['payment']['entity']

            razorpay_order_id = payment_entity['order_id']

            try:
                payment = Payment.objects.select_related('order').get(
                    razorpay_order_id=razorpay_order_id
                )
            except Payment.DoesNotExist:
                return HttpResponse(status=404)

            payment.status = 'failed'
            payment.save(update_fields=['status'])

            order = payment.order

            if order.status == Order.Status.PENDING:
                order.status = Order.Status.CANCELLED
                order.save(update_fields=['status'])

        return HttpResponse(status=200)




from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import PaymentSerializer


class PaymentStatusView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'order_id'

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user).order_by('-created_at')

    def get_object(self):
        order_id = self.kwargs['order_id']
        return self.get_queryset().get(order_id=order_id).first()


from django.db import transaction
from rest_framework.response import Response
from rest_framework import status


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        ]):
            return Response(
                {'detail': 'Payment verification data is incomplete.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Find payment belonging to logged-in user
        try:
            payment = Payment.objects.select_related('order').get(
                razorpay_order_id=razorpay_order_id,
                order__user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {'detail': 'Payment not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        order = payment.order

        # 2. Already verified
        if payment.status == 'captured':
            return Response({
                'success': True,
                'order_id': order.id,
                'payment_status': payment.status,
                'order_status': order.status,
            })

        # 3. Verify Razorpay signature
        try:
            razorpay_client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature,
            })
        except razorpay.errors.SignatureVerificationError:
            return Response(
                {'detail': 'Invalid payment signature.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Get order items
        order_items = order.items.select_related('product').all()

        # 5. Lock products
        product_ids = [
            item.product_id
            for item in order_items
            if item.product_id
        ]

        locked_products = {
            product.id: product
            for product in Product.objects.select_for_update().filter(
                id__in=product_ids
            )
        }

        # 6. Check stock
        for item in order_items:
            product = locked_products.get(item.product_id)

            if not product:
                return Response(
                    {'detail': f'Product for order item {item.id} no longer exists.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if product.stock_quantity < item.quantity:
                return Response(
                    {
                        'detail': (
                            f'Insufficient stock for {product.name}. '
                            f'Only {product.stock_quantity} left.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 7. Deduct stock
        for item in order_items:
            product = locked_products[item.product_id]
            product.stock_quantity -= item.quantity
            product.save(update_fields=['stock_quantity'])

        # 8. Mark payment captured
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'captured'

        payment.save(
            update_fields=[
                'razorpay_payment_id',
                'razorpay_signature',
                'status',
            ]
        )

        # 9. Mark order paid
        order.status = Order.Status.PAID
        order.save(update_fields=['status'])

        # Send confirmation email after transaction commits
        transaction.on_commit(
            lambda: send_order_confirmation_email.delay(order.id)
            )

        # 10. Clear cart
        Cart.objects.filter(user=request.user).delete()

        return Response({
            'success': True,
            'order_id': order.id,
            'payment_status': payment.status,
            'order_status': order.status,
        })

    
class RetryPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(
                id=order_id,
                user=request.user,
                status=Order.Status.PENDING
            )
        except Order.DoesNotExist:
            return Response(
                {"detail": "Pending order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create a new Razorpay order for this retry
        razorpay_order = razorpay_client.order.create({
            "amount": int(order.total_amount * 100),
            "currency": "INR",
            "receipt": f"order_{order.id}_retry",
        })

        # Reuse the existing Payment because Payment is OneToOne with Order
        payment = order.payment

        payment.razorpay_order_id = razorpay_order["id"]
        payment.razorpay_payment_id = ""
        payment.razorpay_signature = ""
        payment.status = "created"
        payment.save()

        return Response({
            "order_id": order.id,
            "razorpay_order_id": razorpay_order["id"],
            "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            "amount": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "payment_id": payment.id,
        })


from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from .permissions import IsAdminRole
from .serializers import AdminPaymentSerializer


class AdminPaymentListView(generics.ListAPIView):
    serializer_class = AdminPaymentSerializer
    permission_classes = [IsAdminRole]
    queryset = Payment.objects.select_related('order', 'order__user').order_by('-created_at')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['order__user__username', 'order__items__product__name',
                      'razorpay_order_id','razorpay_payment_id',]