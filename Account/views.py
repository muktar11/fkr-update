from django.shortcuts import render
from django.http import JsonResponse
from .models import Staff, UserLocation, WebCustomer, WebCustomerProfile
from serializer.serializers import  (StaffSerializer, UserLocationSerializer,
WebCustomerLoginSerializer, MyTokenObtainPairSerializer,
RegisterWebCustomerSerializer,RegisterWebCustomerAuthSerializer,
RegisterStaffSerializer, WebCustomerSerializer,
WebCustomerProfileSerialzier, ForgotPasswordSerializer)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import generics 
from .permissions import IsWebCustomerUser, IsStaffUser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.core.paginator import Paginator
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView


def index(request):
    return render(request, 'index.html')



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = self.get_user(request.data['phone'])  # Get the user based on the provided email
        if isinstance(user, Staff):
            response.data['role'] = user.role
        if isinstance(user, Staff):
            response.data['last_name'] = user.last_name
        if isinstance(user, Staff):
            response.data['first_name'] = user.first_name
        if isinstance(user, Staff):
            response.data['id'] = user.id
        return response
    def get_user(self, phone):
        try:
            return Staff.objects.get(phone=phone)
        except Staff.DoesNotExist:
            return None

class RegisterWebCustomerAuthView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = RegisterWebCustomerAuthSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password set successfully, authentication enabled."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveAuthInWebCustomer(APIView):
    def get(self, request, *args, **kwargs):
        # Filter staff where is_web is True
        staff_members = Staff.objects.filter(is_web=True)
        # Prepare a list to store the combined staff and web customer data
        combined_data = []
        for staff in staff_members:
            try:
                web_customer = WebCustomer.objects.get(_id=staff.web_id)
                combined_data.append({
                    'staff': StaffSerializer(staff, context={'request': request}).data,
                    'web_customer': WebCustomerSerializer(web_customer, context={'request': request}).data
                })
            except WebCustomer.DoesNotExist:
                continue
        return Response(combined_data)


class WebCustomerLoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = WebCustomerLoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterStaffView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegisterStaffSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)      
        return Response({
            'message': 'User registered successfully',
            'user': RegisterStaffSerializer(user).data,
            'access_token': access_token,          
        })

class UserLocationView(APIView):
    permission_classes = [AllowAny]  # Adjust as needed

    def post(self, request):
        user_id = request.data.get('id')
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        if user_id and latitude and longitude:
            try:
                user = Staff.objects.get(id=user_id)  # Retrieve user instance
                location = UserLocation.objects.create(
                    user=user,
                    latitude=latitude,
                    longitude=longitude
                )
                serializer = UserLocationSerializer(location)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Staff.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

class AllUsersLocationView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    def get(self, request):
        try:
            # Fetch all user locations
            locations = UserLocation.objects.all()
            serializer = UserLocationSerializer(locations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserLocationByIdView(APIView):
    permission_classes = [AllowAny]  # Adjust permissions as needed
    def get(self, request):
        user_id = request.query_params.get('id')
        if user_id:
            try:
                locations = UserLocation.objects.filter(user_id=user_id)
                serializer = UserLocationSerializer(locations, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "User ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_profiles(request):
    queryset = Staff.objects.all()
    serializer = StaffSerializer(queryset,many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_profile(request, pk):
    queryset = Staff.objects.filter(id=pk)
    serializer = StaffSerializer(queryset,many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT'])
def update_profile(request, pk):
    data = request.data
    staff = Staff.objects.get(id=pk)    
    if 'email' in data:
        staff.email = data['email']
    if 'first_name' in data:
        staff.first_name = data['first_name']
    if 'last_name' in data:
        staff.last_name = data['last_name']
    if 'image' in data:
        staff.image = data['image']
    if 'role' in data:
        staff.role = data['role']
    if 'password' in data and data['password'] != '':
        staff.set_password(data['password'])
    staff.save()
    serializer = StaffSerializer(staff, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def access_staff(request):
    queryset = Staff.objects.all()
    serializer = StaffSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)

class WebCustomerCreateView(generics.CreateAPIView):
    queryset = WebCustomer.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterWebCustomerSerializer

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            # Print the error to the console
            print(f"Error during saving WebCustomer: {e}")
            raise serializers.ValidationError({"detail": f"Error during customer creation: {str(e)}"})

    def create(self, request, *args, **kwargs):
        # Call the original create method
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Customizing the response with status 200 OK
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def approve_web_customer(request, _id):
    customer = WebCustomer.objects.get(_id=_id)
    customer.is_approved = True
    customer.save()
    serializer = WebCustomerSerializer(customer, context={'request': request})
    return Response(serializer.data)
        

@api_view(['GET'])
def retrieve_not_approved_customers(request):
    not_approved_customers = WebCustomer.objects.filter(is_approved=False)
    serializer = WebCustomerSerializer(not_approved_customers, many=True, context={'request': request})
    return Response(serializer.data)




@api_view(['GET'])
def retrieve_approved_customers(request):
    approved_customers = WebCustomer.objects.filter(is_approved=True)
    serializer = WebCustomerSerializer(approved_customers, many=True, context={'request': request})
    return Response(serializer.data)

class WebCustomerListView(generics.ListAPIView):
    queryset = WebCustomer.objects.all()
    permission_classes = [AllowAny]
    serializer_class = WebCustomerSerializer


class WebCustomerEdit(generics.RetrieveUpdateDestroyAPIView):
    queryset = WebCustomerProfile.objects.all()
    permission_classes  = (AllowAny)
    serializer_class = WebCustomerProfileSerialzier 


class ForgotPasswordView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Password reset token sent successfully."})