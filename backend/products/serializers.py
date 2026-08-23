from rest_framework import serializers
from .models import Category, Product

class CategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image',
                   'hero_title', 'hero_description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializers(read_only = True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(), source = 'category', write_only = True
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'stock_quantity',
                   'image', 'is_active', 'category', 'category_id']
