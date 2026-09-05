from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from products.models import Product

from .services import ask_ruralkart_ai


class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '').strip()

        if not message:
            return Response(
                {
                    'detail': 'Message is required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        products = (
            Product.objects
            .filter(
                is_active=True,
                stock_quantity__gt=0
            )
            .select_related('category')
            .order_by('-id')[:30]
        )

        try:
            ai_result = ask_ruralkart_ai(
                user_message=message,
                products=products
            )

            product_ids = ai_result.get('product_ids', [])

            recommended_products = (
                Product.objects
                .filter(
                    id__in=product_ids,
                    is_active=True,
                    stock_quantity__gt=0
                )
                .select_related('category')
            )

            product_map = {
                product.id: product
                for product in recommended_products
            }

            product_data = []

            for product_id in product_ids:
                product = product_map.get(product_id)

                if not product:
                    continue

                product_data.append({
                    'id': product.id,
                    'name': product.name,
                    'slug': product.slug,
                    'price': str(product.price),
                    'image': product.image.url if product.image else None,
                    'stock_quantity': product.stock_quantity,
                    'category': (
                        product.category.name
                        if product.category
                        else None
                    ),
                })

            return Response(
                {
                    'answer': ai_result.get('answer', ''),
                    'products': product_data,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            print('RuralKart AI error:', repr(e))

            return Response(
                {
                    'detail': 'AI assistant is temporarily unavailable.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

