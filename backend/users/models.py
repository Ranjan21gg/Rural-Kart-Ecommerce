from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = 'customer' , 'Customer'
        ADMIN = 'admin' , 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    shipping_address = models.TextField(blank=True, default='')

    def __str__(self):
        return self.username
