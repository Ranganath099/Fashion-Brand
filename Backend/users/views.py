import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, OTP

class SendOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        otp = str(random.randint(100000, 999999))
        OTP.objects.create(phone=phone, otp=otp)
        print("OTP:", otp)  # Replace with SMS service
        return Response({"message": "OTP sent"})

class VerifyOTPView(APIView):
    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")

        otp_obj = OTP.objects.filter(phone=phone).order_by("-created_at").first()

        if not otp_obj or otp_obj.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        user, _ = User.objects.get_or_create(phone=phone)
        refresh = RefreshToken.for_user(user)

        # OPTIONAL: delete OTP after use
        otp_obj.delete()

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

