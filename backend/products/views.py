from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import CategorySerializers, ProductSerializer
from .permissions import IsAdminOrReadOnly

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active = True)
    serializer_class = ProductSerializer

    # when someone hit the detail URL, match against the slug intead id
    lookup_field = 'slug'
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # ?search = iphone
    search_fields = ['name', 'description']

    # ?ordering=price
    # ?ordering=-price
    ordering_fields = ['price', 'created_at']

    # ?category__slug = phone
    filterset_fields = ['category__slug',]




    