from rest_framework import generics, permissions
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

# Create your views here.

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = RegisterSerializer(request.user)
        return Response(serializer.data)