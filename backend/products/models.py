from django.db import models
from django.utils.text import slugify


def category_image_upload_path(instance, filename):
    category_slug = instance.slug or slugify(instance.name)

    return f"categories/{category_slug}/{filename}"


def product_image_upload_path(instance, filename):
    category_slug = instance.category.slug
    product_slug = instance.slug or slugify(instance.name)

    return f"products/{category_slug}/{product_slug}/{filename}"


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, null=True)
    image = models.ImageField(upload_to= category_image_upload_path, blank=True, null=True)
    
    hero_title = models.CharField(max_length=200, blank=True)
    hero_description = models.TextField(blank=True)


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to= product_image_upload_path, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self,*args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    