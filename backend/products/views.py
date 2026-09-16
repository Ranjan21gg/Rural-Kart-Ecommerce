from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from users.models import User
from .serializers import CategorySerializers, ProductSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializers
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter()
    serializer_class = ProductSerializer

    # Accepts Multipart
    parser_classes = [MultiPartParser, FormParser]

    # when someone hit the detail URL, match against the slug intead id
    lookup_field = 'slug'
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    # ?search = iphone
    search_fields = ['name', 'description']

    # ?ordering=-price
    ordering_fields = ['price', 'created_at']

    # odering by id
    ordering = ['id']

    # ?category__slug = phone
    filterset_fields = ['category__slug',]

    def get_queryset(self):
        queryset = Product.objects.all()

        if self.request.user.is_authenticated:
            if self.request.user.role == User.Role.ADMIN:
                return queryset

        return queryset.filter(is_active=True)




    