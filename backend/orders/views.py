from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from django.db.models import Prefetch

# Create your views here.

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user= self.request.user)
        cart = Cart.objects.prefetch_related(
            Prefetch('items', queryset=CartItem.objects.select_related('product','product__category'))
        ).get(pk=cart.pk)
        
        return cart


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        item , created = CartItem.objects.get_or_create(
            cart = cart, product_id = product_id,
            defaults={'quantity': quantity}
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartItemSerializer(item).data, status= status.HTTP_201_CREATED)

    def patch(self, request, item_id):
        try:
            item = CartItem.objects.select_related('product').get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'datail':'Not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {'detail': 'Quantity is required.'},
                status=status.HTTP_400_BAD_REQUEST
                )

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'detail': 'Quantity must be a valid integer.'},
                status=status.HTTP_400_BAD_REQUEST
                )

        if quantity < 1:
            return Response(
                {'detail': 'Quantity must be at least 1.'},
                status=status.HTTP_400_BAD_REQUEST
                )

        if quantity > item.product.stock_quantity:
            return Response(
                {'detail': (f'Only {item.product.stock_quantity}'
                            'items available.'
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

        item.quantity = quantity
        item.save(update_fields=['quantity'])

        cart = item.cart

        return Response(CartSerializer(cart, context={"request": request}).data)
        # return Response(CartItemSerializer(item).data, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        CartItem.objects.filter(id=item_id, cart__user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
