from django.contrib.auth.password_validation import validate_password
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from Account.models import Staff, UserLocation, WebCustomer, WebCustomerProfile
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.http import JsonResponse
from django.urls import reverse
from django.utils.html import format_html
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.contrib.auth import authenticate
import random
import string
from dateutil.parser import isoparse
from django.urls import reverse
from django.conf import settings 
from datetime import datetime
User = get_user_model()
from rest_framework import serializers
from commerce.models import(
     Plate, SalesPerson, SalesOrder,CustomerDebitForm, RawMaterialRequest,
     AADDSalesOrder, AADSalesOrderReload, LedgerDeposit, 
     InventoryReturnForm, SetPrice, AgentSalesPerfomanceMeasure, SupervisorSalesPerfomanceMeasure, WarehouseStock )
from django.db.models import Sum
import shortuuid
from django.utils import timezone 
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = ('id', 'email', 'first_name', 'last_name', 'image', 'role')


class WebCustomerSerializer(serializers.ModelSerializer):
    tin_number_doc_url = serializers.SerializerMethodField()
    business_license_no_doc_url = serializers.SerializerMethodField()
    business_registration_no_doc_url = serializers.SerializerMethodField()
    class Meta:
        model = WebCustomer
        fields = '__all__'

    def create(self, validated_data):
        is_credit = validated_data.pop('is_credit', False)
        credit_limit = validated_data.pop('credit_limit', None)

        if is_credit not in [True, False]:
            raise serializers.ValidationError({'is_credit': 'Must be a valid boolean.'})
        if credit_limit is not None and not isinstance(credit_limit, int):
            raise serializers.ValidationError({'credit_limit': 'A valid integer is required.'})

        instance = super().create(validated_data)
        instance.is_credit = is_credit
        instance.credit_limit = credit_limit
        instance.save()
        return instance

  

    def get_business_license_no_doc_url(self, obj):
        if obj.business_license_no_doc:
            return self.context['request'].build_absolute_uri(obj.business_license_no_doc.url)
        return None

    def get_tin_number_doc_url(self, obj):
        if obj.tin_number_doc:
            return self.context['request'].build_absolute_uri(obj.tin_number_doc.url)
        return None

    def get_business_registration_no_doc_url(self, obj):
        if obj.business_registration_no_doc:
            return self.context['request'].build_absolute_uri(obj.business_registration_no_doc.url)
        return None
  
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Custom claims for Staff users
        if isinstance(user, Staff):
            token['id'] = user.id
        if isinstance(user, Staff):
            token['role'] = user.role
        if isinstance(user, Staff):
            token['first_name'] = user.first_name 
        if isinstance(user, Staff):
            token['last_name'] = user.last_name 
        return token

class RegisterWebCustomerSerializer(serializers.ModelSerializer):
    tin_number_doc_url = serializers.SerializerMethodField()
    business_license_no_doc_url = serializers.SerializerMethodField()
    business_registration_no_doc_url = serializers.SerializerMethodField()

    class Meta:
        model = WebCustomer
        fields = (
            'email', 'customer_name', 'sales_route', 'tin_number', 
            'business_license_no', 'business_registration_no', 'sales_target', 
            'gps_coordinates', 'is_approved', 'is_credit', 'credit_limit', 
            'phone', 'contact_information',
            'tin_number_doc',  # Include file fields here
            'business_license_no_doc',
            'business_registration_no_doc',
            'tin_number_doc_url',  
            'business_license_no_doc_url', 
            'business_registration_no_doc_url',
        )
        extra_kwargs = {
            'tin_number_doc': {'write_only': True},
            'business_license_no_doc': {'write_only': True},
            'business_registration_no_doc': {'write_only': True},
        }

    def create(self, validated_data):
        # Pop the files from the validated data
        tin_number_doc = validated_data.pop('tin_number_doc', None)
        business_license_no_doc = validated_data.pop('business_license_no_doc', None)
        business_registration_no_doc = validated_data.pop('business_registration_no_doc', None)

        # Create the user instance
        user = WebCustomer.objects.create(**validated_data)

        # Set the file fields if they exist
        if tin_number_doc:
            user.tin_number_doc = tin_number_doc
        if business_license_no_doc:
            user.business_license_no_doc = business_license_no_doc
        if business_registration_no_doc:
            user.business_registration_no_doc = business_registration_no_doc

        # Save the user instance after setting the file fields
        user.save()

        return user

    def get_business_license_no_doc_url(self, obj):
        if obj.business_license_no_doc:
            return self.context['request'].build_absolute_uri(obj.business_license_no_doc.url)
        return None

    def get_tin_number_doc_url(self, obj):
        if obj.tin_number_doc:
            return self.context['request'].build_absolute_uri(obj.tin_number_doc.url)
        return None

    def get_business_registration_no_doc_url(self, obj):
        if obj.business_registration_no_doc:
            return self.context['request'].build_absolute_uri(obj.business_registration_no_doc.url)
        return None



class RegisterWebCustomerAuthSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = WebCustomer
        fields = ('phone', 'password', 'password2')

    def validate(self, attrs):
        phone = attrs.get('phone').strip()  # Strip leading/trailing spaces

        # Ensure WebCustomer exists with the exact phone number
        try:
            web_customer = WebCustomer.objects.get(phone__iexact=phone)  # Case-insensitive exact match
        except WebCustomer.DoesNotExist:
            raise serializers.ValidationError({"phone": "No customer found with this phone number."})

        # Ensure no Staff is already registered with this phone number
        if Staff.objects.filter(phone__iexact=phone).exists():
            raise serializers.ValidationError({"phone": "You already have an account."})

        # Check if passwords match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        # Remove password2 as it's not needed
        validated_data.pop('password2')
        phone = validated_data['phone'].strip()  # Normalize phone number by stripping spaces
        password = validated_data['password']

        # Find the WebCustomer by phone number (already validated in 'validate')
        web_customer = WebCustomer.objects.get(phone__iexact=phone)

        # Set the password for WebCustomer
        web_customer.set_password(password)
        web_customer.is_web = True  # Assuming you have this field
        web_customer.save()

        # Ensure no Staff is already registered with this phone number (in case you didn't do it in `validate`)
        if Staff.objects.filter(phone=phone).exists():
            raise serializers.ValidationError({"phone": "You already have an account."})
        # Create or update Staff model based on WebCustomer
        staff, created = Staff.objects.get_or_create(
            phone=phone,
            defaults={
                'email': web_customer.email,
                'first_name': web_customer.customer_name,
                'last_name': '',  # You can adjust this as needed
                'role': 'Agent',  # Assuming a role for web customers
                'is_active': True,
                'is_staff': False,
                'is_web': True,
                'web_id': str(web_customer._id),  # Assign WebCustomer's _id to the staff's web_id
            }
        )
        # If the Staff instance already exists, update the fields and password
        if not created:
            staff.email = web_customer.email
            staff.first_name = web_customer.customer_name
            staff.web_id = str(web_customer._id)  # Update the web_id with WebCustomer's _id
            staff.save()
        # Set the password for Staff using the same password as WebCustomer
        staff.set_password(password)
        staff.save()
        return web_customer


class UserLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLocation
        fields = ['user','latitude', 'longitude', 'timestamp']
        

class WebCustomerLoginSerializer(serializers.Serializer):
    phone = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        phone = data.get('phone')
        password = data.get('password')
        user = authenticate(phone=phone, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.pk,
                'email': user.email,
                'phone': user.phone,
                'customer_name': getattr(user, 'customer_name', None),
                'role': getattr(user, 'role', None),
            }
        else:
            raise serializers.ValidationError('Invalid credentials')

class RegisterStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = Staff
        fields = ('phone', 'first_name', 'last_name', 'password', 'password2', 'role')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = Staff.objects.create(
            phone=validated_data['phone'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=validated_data['role']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    


    

    def create(self, validated_data):
        # Create the user
        user = WebCustomer.objects.create(
            email=validated_data['email'],
            phone=validated_data['phone'],
            customer_name=validated_data['customer_name'],
            sales_route=validated_data['sales_route'],
            tin_number=validated_data['tin_number'],
            business_license_no=validated_data['business_license_no'],
            business_registration_no=validated_data['business_registration_no'],
            sales_target=validated_data['sales_target'],
            ledger=validated_data['ledger'],
            contact_information=validated_data['contact_information'],
            gps_coordinates=validated_data['gps_coordinates']
        ) 
        # Set the password and save the user
       
        user.save()

        # Return the serialized user with the access token
        return {
            'message': 'User registered successfully',
            'user': WebCustomerSerializer(user).data,
            
        }



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")

        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        # Generate a random password reset token
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=10))

        # Update the user's password reset token field
        user.password_reset_token = token
        user.save()

        # Send password reset email with token
        send_mail(
            'Password Reset',
            f'Your password reset token is: {token}',
            'from@example.com',
            [email],
            fail_silently=False,
        )

        return user 
    
class WebCustomerProfileSerialzier(serializers.Serializer):
    client  = RegisterWebCustomerSerializer()

    class Meta:
        Model = WebCustomerProfile
        fields = ['client', 'ledger', 'phone']


class AgentSalesPerfomanceMeasureSerializer(serializers.ModelSerializer):
    daily_sales_performance_qty_achievement = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = AgentSalesPerfomanceMeasure
        fields = '__all__'

    def get_daily_sales_performance_qty_achievement(self, instance):
        return instance.daily_sales_performance_qty_achievement

def calculate_sales_performance(customer, sales_orders_24_hours, sales_orders_current_month, sales_orders_current_year):
        total_p_24_hours = sales_orders_24_hours.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        total_p_current_month = sales_orders_current_month.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        total_p_current_year = sales_orders_current_year.aggregate(total_p=Sum('Totalp'))['total_p'] or 0

        sales_target = float(customer.sales_target) if customer.sales_target else 0

        daily_sales_performance = round((total_p_24_hours / sales_target) * 100, 2) if sales_target != 0 else 0
        daily_sales_expectation = round(sales_target / 25, 2) if sales_target != 0 else 0
        monthly_sales_performance = round((total_p_current_month / sales_target) * 12 / 100, 2) if sales_target != 0 else 0
        annual_sales_performance = round((total_p_current_year / sales_target) * 310 / 100, 2) if sales_target != 0 else 0


        result = {
            "daily_sales_performance_qty_achievement": daily_sales_performance,
            "monthly_sales_performance_qty_achievement": monthly_sales_performance,
            "annually_sales_performance_qty_achievement":  annual_sales_performance ,
          

        # Optionally, include other necessary fields here...
        }

        return result


from datetime import datetime, timedelta

class SalesOrderSerializer(serializers.ModelSerializer):
    customers_name = serializers.CharField(source='customers_name.customer_name')
    customers_id = serializers.CharField(source='customers_name._id')
    supervisor = serializers.SerializerMethodField()
    inventory_file = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    tin_numbers = serializers.SerializerMethodField()
    reg_numbers = serializers.SerializerMethodField()
    sdmcreated_at = serializers.DateTimeField()
    financemanagercreated_at = serializers.DateTimeField()
    financecreated_at   = serializers.DateTimeField()
    logisitcmanagercreated_at = serializers.DateTimeField()
    inventorycreated_at = serializers.DateTimeField()
    agent_sales_performance = serializers.SerializerMethodField()
    class Meta:
        model = SalesOrder
        fields = (  '_id', 'customers_name', 'customers_id', 'sales_Route', 'Route','LedgerBalance', 'Qp', 'Hp', 'ONEp','TWOp',
                   'Q_Unit', 'H_Unit', 'ONE_Unit','TWO_Unit', 'Totalp',
                    'Q_CASH', 'H_CASH', 'ONE_CASH','TWO_CASH', 'Total_CASH','Grand_Total_CASH', 'payment', 'plate_no',
                    'CSI_CRSI_Number', 'Bank_Name', 'Amount', 'Bank_Reference_Number', 'Deposit_Date',
                    'sdm_approved', 'sdm_returned', 'sdm_returned_issue', 'finance_approved', 
                    'finance_returned','LedgerBalance', 'finance_returned_issue','tin_numbers','reg_numbers', 'finance_manager_approved',
                    'Inventory', 'Driver', 'is_loaded', 'inventory_check', 'inventory_recipant', 'inventory_file', 'created_at',
                    'sdmcreated_at', 'sdmcreated_first_name','inventory_ddo', 'inventory_ddo', 
                    'financecreated_at', 'financepayment_at', 'financecreated_first_name',  'financecreated_last_name',
                    'financemanagercreated_at',  'financemanagercreated_first_name',  'financemanagercreated_last_name',
                    'logisitcmanagercreated_at', 'is_mobile', 'is_mobile_approved','is_deliverd', 'supervisor',
                    'supervisor_created_at', 'cso_remote_process_first_name',  
                    'cso_remote_process_last_name', 'cso_remote_process_created_at', 'cso_remote_process_updated',
                    'cso_remote_process_returned', 'cso_remote_process_return_issue', 'cso_remote_process_approved',
                    'logisitcmanagercreated_first_name',  'logisitcmanagercreated_last_name', 'supervisor_remark',
                    'inventorycreated_at', 'inventorycreated_first_name','agent_sales_performance',  
                      'inventorycreated_last_name', 'execution_time', 
                ) 

    
    def get_agent_sales_performance(self, obj):
        now = timezone.now()
        past_24_hours = now - timedelta(hours=24)

        sales_orders_24_hours = SalesOrder.objects.filter(
            customers_name=obj.customers_name,
            created_at__range=(past_24_hours, now)
        )
        sales_orders_current_month = SalesOrder.objects.filter(
            customers_name=obj.customers_name,
            created_at__month=now.month,
            created_at__year=now.year
        )
        sales_orders_current_year = SalesOrder.objects.filter(
            customers_name=obj.customers_name,
            created_at__year=now.year
        )

        try:
            customer = WebCustomer.objects.get(_id=obj.customers_name._id)
            performance_data = calculate_sales_performance(customer, sales_orders_24_hours, sales_orders_current_month, sales_orders_current_year)

            agent_performance_instance = AgentSalesPerfomanceMeasure(
                daily_sales_performance_qty_achievement=performance_data['daily_sales_performance_qty_achievement'],
                monthly_sales_performance_qty_achievement=performance_data['monthly_sales_performance_qty_achievement'],
                
            # Set other necessary fields here...
            )

            agent_performance_instance = AgentSalesPerfomanceMeasure(**performance_data)
            serializer = AgentSalesPerfomanceMeasureSerializer(agent_performance_instance)
            return serializer.data

        except WebCustomer.DoesNotExist:
            return {}
    def calculate_time_gap(self, timestamp1, timestamp2):
        if timestamp1 and timestamp2:
            timestamp1 = isoparse(timestamp1)
            timestamp2 = isoparse(timestamp2)
            time_difference = timestamp2 - timestamp1
            return time_difference.total_seconds()
        return None


    
    def format_time(self, seconds):
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)

        if int(hours) == 0 and int(minutes) == 0:
            return f"{int(seconds)} sec"
        elif int(hours) == 0:
            return f"{int(minutes)} mins, {int(seconds)} sec"
        else:
            return f"{int(hours)} hrs, {int(minutes)} min, {int(seconds)} sec"

    def to_representation(self, instance):
        data = super().to_representation(instance)

        inventory_created_at = data['inventorycreated_at']
        created_at = data['created_at']

        time_gap_seconds = self.calculate_time_gap(created_at, inventory_created_at)

        if time_gap_seconds is not None:
            time_gap_readable = self.format_time(time_gap_seconds)
            data['time_gap_inventory_created'] = time_gap_readable
        else:
            data['time_gap_inventory_created'] = None

        return data

    def get_tin_numbers(self, obj):
        tinnumber = WebCustomer.objects.filter(customer_name=obj.customers_name).first()
        if  tinnumber:
            return tinnumber.tin_number
        return None

    def get_reg_numbers(self, obj):
        regnumber = WebCustomer.objects.filter(customer_name=obj.customers_name).first()
        if  regnumber:
            return regnumber.business_registration_no
        return None

    def get_supervisor(self, obj):
        if obj.supervisor:
            return f"{obj.supervisor.first_name} {obj.supervisor.last_name}"
        return None
    
    def get_payment(self, obj):
        if obj.payment:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment.url)
        return None
    

    def get_inventory_file(self, obj):
        if obj.inventory_file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.inventory_file.url)
        return None



    
class SalesPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesPerson
        fields = '__all__'

class PlateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plate
        fields = '__all__'

class SetPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SetPrice
        fields = ('sales_Route', 'warehouse', 'TransportationFee', 'Q', 'H', 'ONE', 'TWO', '_id', 'created_at')


class AgentSalesPerfomanceMeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentSalesPerfomanceMeasure
        fields = '__all__'

class SupervisorSalesPerfomanceMeasureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorSalesPerfomanceMeasure
        fields = '__all__'

class AADDSalesOrderSerializers(serializers.ModelSerializer):
    SalesPerson = serializers.StringRelatedField()
    sales_Route_price = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    inventory_file = serializers.SerializerMethodField()

    class Meta:
        model = AADDSalesOrder
        fields = ('_id', 'SalesPerson', 'sales_Route', 'payment',
                   'inventory_file',  'inventory_ddo', 'sales_Route_price', 'is_finished')
    depth = 1 
    def get_sales_Route_price(self, obj):
        sales_route = obj.sales_Route
        try:
            price = SetPrice.objects.filter(sales_Route=sales_route).first()
            if price:
                return SetPriceSerializer(price).data
            else:
                return None
        except SetPrice.DoesNotExist:
            return None

    def get_payment(self, obj):
        if obj.payment:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment.url)
        return None
    
    def get_inventory_file(self, obj):
        if obj.inventory_file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.inventory_file.url)
        return None




class LedgerDepositSerialzier(serializers.ModelSerializer):
    customers_name = serializers.CharField(source='customers_name.customer_name', read_only=True)
    customer_id = serializers.SerializerMethodField()

    def get_customer_id(self, obj):
        return obj.customers_name_id

    class Meta:
        model = LedgerDeposit
        fields = ['_id', 'customer_id', 'is_mobile', 'customers_name', 
                  
        'mobile_payment','previous_balance',
        'Bank_Name', 'Branch_Name', 'Narrative', 'Deposit_Amount', 'Bank_Reference_Number', 
        'Deposit_Date', 'finance_approved', 'finance_returned', 
        'payment',     'Balance', 'return_issue', 'created_at']


class CombinedDataSerializer(serializers.Serializer):
    def to_representation(self, instance):
        if isinstance(instance, LedgerDeposit):
            return {'ledger': LedgerDepositSerialzier(instance).data}
        elif isinstance(instance, SalesOrder):
            return {'sales': SalesOrderSerializer(instance).data}
        else:
            return super().to_representation(instance)



class RawMaterialRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterialRequest
        fields = (
            '_id',
            'issue_store',
            'recipant_store',
            'Preform_14gm',
            'Preform_18gm',
            'Preform_28gm',
            'Preform_40gm',
            'Shrink_35gm',
            'Shrink_38gm',
            'Shrink_42gm',
            'Shrink_48gm',
            'Label_035ml',
            'Label_06ml',
            'Label_1Lgm',
            'Label_2L',
            'Caps',
            'time',
            'FG_Standardized_035ml',
            'FG_Standardized_06ml',
            'FG_Standardized_1L',
            'FG_Standardized_2l',
            'FG_Standardized_Total',
            'FG_Damaged_035ml',
            'FG_Damaged_06ml',
            'FG_Damaged_1L',
            'FG_Damaged_2l',
            'FG_Damaged_Total',
            'FG_Damaged_Description',
            'FG_Damaged_UOM',
            'FG_Damaged_Quantity',
            'FG_Damaged_Remark',
            'is_return',
            'is_ready',
            'is_await',
            'is_approved',
            'is_accepted',
            'issue_store_file',
            'recipant_store_file',
            'Plate',
            'Driver',
            'is_Caps',
            'is_loaded',
            'is_Preform',
            'is_Shrink',
            'is_Label',        
            'is_FG_Standardized',
            'is_FG_Damaged_Total',
        )
        extra_kwargs = {
            'Preform_14gm': {'required': False},
            'Preform_18gm': {'required': False},
            'Preform_28gm': {'required': False},
            'Preform_40gm': {'required': False},
            'Shrink_35gm': {'required': False},
            'Shrink_38gm': {'required': False},
            'Shrink_42gm': {'required': False},
            'Shrink_48gm': {'required': False},
            'Label_035ml': {'required': False},
            'Label_06ml': {'required': False},
            'Label_1Lgm': {'required': False},
            'Label_2L': {'required': False},
            'time': {'required': False},
            'is_FG_Standardized': {'required': False},
            'FG_Standardized_035ml': {'required': False},
            'FG_Standardized_06ml': {'required': False},
            'FG_Standardized_1L': {'required': False},
            'FG_Standardized_2L': {'required': False},
            'is_FG_Damaged': {'required': False},
            'FG_Damaged_Description': {'required': False},
            'FG_Damaged_UOM': {'required': False},
            'FG_Damaged_Quantity': {'required': False},
            'FG_Damaged_Remark': {'required': False},
            'issue_store_file': {'required': False},
            'recipant_store_file': {'required': False},
            'Plate': {'required': False},
            'Driver': {'required': False},
            'is_return': {'required': False},
            'is_loaded': {'required': False},
            'is_approved': {'required': False},
            'is_accepted': {'required': False},
            'is_ready': {'required': False},
            'is_await': {'required': False},
        }

class WareHouseStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseStock 
        fields = '__all__'

class InventoryReturnFormSerializer(serializers.ModelSerializer):
    sales_Qp = serializers.SerializerMethodField()
    sales_Hp = serializers.SerializerMethodField()
    sales_ONEp = serializers.SerializerMethodField()
    sales_TWOp = serializers.SerializerMethodField()
    sales_Totalp = serializers.SerializerMethodField()

    sales_Q_CASH= serializers.SerializerMethodField()
    sales_H_CASH= serializers.SerializerMethodField()
    sales_ONE_CASH= serializers.SerializerMethodField()
    sales_TWO_CASH= serializers.SerializerMethodField()
    sales_Total_CASH= serializers.SerializerMethodField()
   

    Qp_price = serializers.SerializerMethodField()
    Hp_price = serializers.SerializerMethodField()
    ONEp_price = serializers.SerializerMethodField()
    TWOp_price = serializers.SerializerMethodField()
    Total_price = serializers.SerializerMethodField()


    difference_QCASH = serializers.SerializerMethodField()
    difference_HCASH = serializers.SerializerMethodField()
    difference_ONECASH = serializers.SerializerMethodField()
    difference_TWOCASH = serializers.SerializerMethodField()
    TotalDifferenceCash  = serializers.SerializerMethodField()

    sales_person = serializers.SerializerMethodField()
    plate = serializers.SerializerMethodField()
    Route = serializers.SerializerMethodField()

    
    TotalSales = serializers.SerializerMethodField()
    TotalReturns = serializers.SerializerMethodField()

    difference_amount = serializers.SerializerMethodField()
    deductions = serializers.SerializerMethodField()
    sales = AADDSalesOrderSerializers()
    sales_Route_price = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()

 
    
  
    class Meta:
        model = InventoryReturnForm
        fields = (
            '_id',  'sales_person', 'plate', 'Route', 'Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp', 'Q_CASH', 'H_CASH', 'ONE_CASH', 'TWO_CASH', 'Total_CASH',  
            'return_Qp', 'return_Hp', 'return_ONEp', 'return_TWOp', 'return_Totalp', 
            'return_Q_CASH', 'return_H_CASH', 'return_ONE_CASH', 'return_TWO_CASH', 'return_Total_CASH',
            'sold_Qp', 'sold_Hp', 'sold_ONEp', 'sold_TWOp', 'sold_Totalp', 
            'sold_Q_CASH', 'sold_H_CASH', 'sold_ONE_CASH', 'sold_TWO_CASH', 'sold_Total_CASH',
            'Qp_price', 'Hp_price', 'ONEp_price', 'TWOp_price', 'Total_price',
            'Qp_price', 'Hp_price', 'ONEp_price', 'TWOp_price', 'Total_price',
            'payment', 'recipient', 'CSI_CSRI_Number', 'is_Discount',
            'Bank_Name', 'Amount', 'Discount_Amount', 'Bank_reference_Number', 'Deposit_Date', 'is_pending', 'is_clear',
            'issues', 'sales_Qp', 'sales_Hp', 'sales_ONEp', 'sales_TWOp', 'sales_Totalp',
            'sales_Q_CASH', 'sales_H_CASH', 'sales_ONE_CASH', 'sales_TWO_CASH', 'sales_Total_CASH',
            'difference_QCASH', 'difference_HCASH', 'difference_ONECASH', 'difference_TWOCASH', 
            'TotalDifferenceCash', 'TotalSales', 'TotalReturns', 'is_return_finance',  
            'difference_amount','ledger_payment', 'ledger_CSI_CRSI_Number', 'RCSNO',
            'ledger_Bank_Name', 'ledger_Amount', 'ledger_Bank_reference_Number', 'ledger_Deposit_Date', 
            'created_at', 'deductions',  'sales_Route_price','sales', 'no_pending', 'is_financed_approve',
          'is_finished',
       )
        depth = 1 

    def get_payment(self, obj):
        if obj.payment:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment.url)
        return None
    

    
    def get_deductions(self, obj):
        deductions = CustomerDebitForm.objects.filter(Inventory=obj)
        request = self.context.get('request')
        return CustomerDebitFormSerializer(deductions, many=True, context={'request': request}).data
    

    def get_sales_Route_price(self, obj):
        if obj.sales is not None:
            sales_route = obj.sales.sales_Route
            try:
                price = SetPrice.objects.filter(sales_Route=sales_route).last()   
                return SetPriceSerializer(price).data
            except SetPrice.DoesNotExist:
                return None
        else:
            return None
    
    def get_TotalReturns(self, obj):
        return int(obj.Qp) + int(obj.Hp) + int(obj.ONEp) + int(obj.TWOp)
    
    def get_sales_order(self, obj):
        sales_order = obj.sales  # Assuming 'sales' is the related field to AADDSalesOrder
        if sales_order:
            serializer = AADDSalesOrderSerializer(sales_order, context=self.context)
            return serializer.data
        return None
    
    def get_sales_Qp(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.Qp
        else:
            return None

    def get_sales_Hp(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.Hp
        else:
            return None

    def get_sales_ONEp(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.ONEp
        else:
            return None

    def get_sales_TWOp(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.TWOp
        else:
            return None
        

    def get_sales_Totalp(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.Totalp
        else:
            return None


    def get_sales_Q_CASH(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.Q_CASH
        else:
            return None

    def get_sales_H_CASH(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.H_CASH
        else:
            return None

    def get_sales_ONE_CASH(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.ONE_CASH
        else:
            return None

    def get_sales_TWO_CASH(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.TWO_CASH
        else:
            return None
        

    def get_sales_Total_CASH(self, obj):
        sales = obj.sales
        if sales is not None:
            return sales.Total_CASH
        else:
            return None
        

    def get_Qp_price(self, obj):
        return obj.calculate_Qp_price()

    def get_Hp_price(self, obj):
        return obj.calculate_Hp_price()

    def get_ONEp_price(self, obj):
        return obj.calculate_ONEp_price()

    def get_TWOp_price(self, obj):
        return obj.calculate_TWOp_price()
    
    def get_Total_price(self, obj):
        return obj.calculate_Total_price()

    def get_sales_person(self, obj):
        sales = obj.sales
        if sales is not None and hasattr(sales, 'SalesPerson'):
            return sales.SalesPerson.sales_person
        else:
            return None 

    def get_plate(self, obj):
        sales = obj.sales
        if sales is not None and hasattr(sales, 'Plate_number'):
            return sales.Plate_number.plate_no
        else:
            return None 
    '''    
    def get_difference_Qp(self, obj):
        sales = obj.sales 
        salesreturn = obj.return_Qp 
        if  salesreturn == 0:
            if sales is not None and hasattr(sales, 'Qp'):
                return int(sales.Qp) -int(obj.Qp) 
            else:
                return 0
        else: 
            if salesreturn is not None:
                return int(obj.Qp) - int(obj.return_Qp)  
            else:
                return 0 
'''

    def get_Route(self, obj):
        sales = obj.sales
        if sales is not None and hasattr(sales, 'sales_Route'):
            return sales.sales_Route
        else:
            return None

    def get_difference_QCASH(self, obj):
        sales_Q_CASH = self.get_sales_Q_CASH(obj)
        Qp_price = self.get_Qp_price(obj)  
        Q_returns = obj.return_Q_CASH

        if Q_returns is not None and Qp_price is not None:
                return  int(Q_returns) - int(Qp_price)
        elif sales_Q_CASH is not None and Qp_price is not None:
                return int(sales_Q_CASH) - int(Qp_price)
        else:
            return None


    
    def get_difference_HCASH(self, obj):
        sales_H_CASH = self.get_sales_H_CASH(obj)
        Hp_price = self.get_Hp_price(obj)

        if sales_H_CASH is not None and Hp_price is not None:
            return int(sales_H_CASH) - int(Hp_price)
        else:
            return None

    def get_difference_ONECASH(self, obj):
        sales_ONE_CASH = self.get_sales_ONE_CASH(obj)
        ONEp_price = self.get_ONEp_price(obj)
        if sales_ONE_CASH is not None and ONEp_price is not None:
            return int(sales_ONE_CASH) - int(ONEp_price)
        else:
            return None

    def get_difference_TWOCASH(self, obj):
        sales_TWO_CASH = self.get_sales_TWO_CASH(obj)
        TWOp_price = self.get_TWOp_price(obj)
        if sales_TWO_CASH is not None and TWOp_price is not None:
            return int(sales_TWO_CASH) - int(TWOp_price)
        else:
            return None
    def get_TotalDifferenceCash(self, obj):
        difference_QCASH = self.get_difference_QCASH(obj)
        difference_HCASH = self.get_difference_HCASH(obj)
        difference_ONECASH = self.get_difference_ONECASH(obj)
        difference_TWOCASH = self.get_difference_TWOCASH(obj)

        total_difference_cash = 0

        if difference_QCASH is not None:
            total_difference_cash += difference_QCASH
        if difference_HCASH is not None:
            total_difference_cash += difference_HCASH
        if difference_ONECASH is not None:
            total_difference_cash += difference_ONECASH
        if difference_TWOCASH is not None:
            total_difference_cash += difference_TWOCASH

        return total_difference_cash
   


    def get_TotalSales(self, obj):
        sales_Qp = self.get_sales_Qp(obj)
        sales_Hp = self.get_sales_Hp(obj)
        sales_ONEp = self.get_sales_ONEp(obj)
        sales_TWOp = self.get_sales_TWOp(obj)
        total_sales = 0
        if sales_Qp is not None:
            total_sales += int(sales_Qp)
        if sales_Hp is not None:
            total_sales += int(sales_Hp)
        if sales_ONEp is not None:
            total_sales += int(sales_ONEp)
        if sales_TWOp is not None:
            total_sales += int(sales_TWOp)
        return total_sales
    
    def get_difference_amount(self, obj):
        total_difference_cash = self.get_TotalDifferenceCash(obj)
        amount = obj.Amount

        if total_difference_cash is not None and amount is not None:
            try:
                total_difference_cash = float(total_difference_cash)
                amount = float(amount)
                return total_difference_cash - amount
            except ValueError:
                return None
        else:
            return None
        

class AADDSalesOrderSerializer(serializers.ModelSerializer):
    SalesPerson = serializers.CharField(source='SalesPerson.sales_person')
    Plate_number = serializers.CharField(source='Plate_number.plate_no')
    payment = serializers.SerializerMethodField()
    inventory_file = serializers.SerializerMethodField()
    inventory_return_forms = InventoryReturnFormSerializer(many=True, read_only=True, source='inventoryreturnform_set')
    reload = serializers.SerializerMethodField()
    
    class Meta:
        model = AADDSalesOrder
        fields = ('_id', 'Plate_number', 'SalesPerson', 'sales_Route', 'Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp', 'Q_CASH',
                  'H_CASH', 'ONE_CASH', 'TWO_CASH', 'Total_CASH', 'payment', 'TransportationFee', 'CSI_CRSI_Number',
                  'Bank_Name', 'Amount', 'Bank_reference_Number', 'smd_approved', 'finance_approved',
                  'finance_manager_approved',  'sdm_returned', 'sdm_returned_issue',
    'inventory_return_forms',  'is_return', 
    'created_at',  'inventory_check', 'inventory_recipant', 'inventory_file', 'is_financed_approve', 'no_reload','reload',
    
    )


    def get_reload(self, obj):
        reloads = AADSalesOrderReload.objects.filter(order=obj)
        request = self.context.get('request')
        return AADSalesOrderReloadSerializer(reloads, many=True, context={'request': request}).data


    def get_payment(self, obj):
        if obj.payment:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment.url)
        return None


    def get_inventory_file(self, obj):
        if obj.inventory_file:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.inventory_file.url)
        return None
  


class AADSalesOrderReloadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AADSalesOrderReload
        fields = [ 'order', 'Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp',                 
                'Q_CASH', 'H_CASH', 'ONE_CASH', 'TWO_CASH', 'Total_CASH',
                'reload_recipient','inventory_ddo','created_at']

    
class CustomerDebitFormSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source='customer.customer_name')
    Inventory = serializers.CharField(source='Inventory.sales')
    sales_Route = serializers.CharField(source='customer.sales_route', read_only=True)
    q_value = serializers.SerializerMethodField()
    h_value = serializers.SerializerMethodField()
    one_value = serializers.SerializerMethodField()
    two_value = serializers.SerializerMethodField()
    tin_numbers = serializers.SerializerMethodField()
    reg_numbers = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    class Meta:
        model = CustomerDebitForm
        fields = [  '_id', 'sales_Route', 'q_value', 'h_value', 'one_value', 'two_value', 'customer', 
                  'Inventory', 'Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp', 'Q_CASH', 'H_CASH', 'ONE_CASH', 'TWO_CASH', 
                  'Total_CASH', 'payment', 'CSI_CSRI_Number', 'Bank_Name', 'Amount', 'Bank_reference_Number',
                    'Deposit_Date', 'due_date', 'issues', 'is_clear', 'tin_numbers','reg_numbers',]

    depth = 1 
    def get_tin_numbers(self, obj):
        tinnumber = WebCustomer.objects.filter(customer_name=obj.customer).first()
        if  tinnumber:
            return tinnumber.tin_number
        return None
    
    def get_reg_numbers(self, obj):
        regnumber = WebCustomer.objects.filter(customer_name=obj.customer).first()
        if  regnumber:
            return regnumber.business_registration_no
        return None
    
    def get_q_value(self, instance):
        sales_route = instance.customer.sales_route
        set_price = SetPrice.objects.filter(sales_Route=sales_route).first()
        return set_price.Q if set_price else None

    def get_h_value(self, instance):
        sales_route = instance.customer.sales_route
        set_price = SetPrice.objects.filter(sales_Route=sales_route).first()
        return set_price.H if set_price else None

    def get_one_value(self, instance):
        sales_route = instance.customer.sales_route
        set_price = SetPrice.objects.filter(sales_Route=sales_route).first()
        return set_price.ONE if set_price else None

    def get_two_value(self, instance):
        sales_route = instance.customer.sales_route
        set_price = SetPrice.objects.filter(sales_Route=sales_route).first()
        return set_price.TWO if set_price else None

    def get_payment(self, obj):
        if obj.payment:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment.url)
        return None
    
    def create(self, validated_data):
        # Decrease the corresponding values in InventoryReturnForm
        inventory = validated_data['Inventory']
        inventory.Qp -= validated_data['Qp']
        inventory.Hp -= validated_data['Hp']
        inventory.ONEp -= validated_data['ONEp']
        inventory.TWOp -= validated_data['TWOp']
        inventory.Totalp = inventory.calculate_Total_price()
        inventory.save()
        
        # Create the CustomerDebitForm
        return CustomerDebitForm.objects.create(**validated_data)
    

class PieOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = ['Qp', 'Hp', 'ONEp', 'TWOp', 'created_at']





class LineOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesOrder
        fields = ('Totalp',  'created_at')














class SalesSerializer(serializers.Serializer):
    plate_number = serializers.CharField(source='Plate_number__plate_no')
    sales_route = serializers.CharField(source='sales_Route')
    qp = serializers.CharField(source='Qp')
    hp = serializers.CharField(source='Hp')
    onep = serializers.CharField(source='ONEp')
    twop = serializers.CharField(source='TWOp')
    totalp = serializers.CharField(source='Totalp')
    q_cash = serializers.CharField(source='Q_CASH')
    h_cash = serializers.CharField(source='H_CASH')
    one_cash = serializers.CharField(source='ONE_CASH')
    two_cash = serializers.CharField(source='TWO_CASH')
    total_cash = serializers.CharField(source='Total_CASH')

class ReturnsSerializer(serializers.Serializer):
    qp = serializers.CharField()
    hp = serializers.CharField()
    onep = serializers.CharField()
    twop = serializers.CharField()
    totalp = serializers.CharField()
    recipant = serializers.CharField()

class SalespersonDebtSerializer(serializers.Serializer):
    salesperson = serializers.CharField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_returns = serializers.DecimalField(max_digits=10, decimal_places=2)
    difference = serializers.DecimalField(max_digits=10, decimal_places=2)
    sales = SalesSerializer(many=True)
    returns = ReturnsSerializer(many=True)


class SalesOrderMixSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customers_name.customer_name')

    class Meta:
        model = SalesOrder 
        fields = ['_id', 'customers_name', 'sales_Route', 'Route','LedgerBalance', 'Qp', 'Hp', 'ONEp','TWOp',
                   'Q_unit', 'H_unit', 'ONE_unit','TWO_unit', 'Totalp',
                    'Q_CASH', 'H_CASH', 'ONE_CASH','TWO_CASH', 'Total_CASH', 'payment', 'plate', 'created_at' ]
        # Add any other fields you need

class AADDSalesOrderMixSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customers_name.customer_name')

    class Meta:
        model = AADDSalesOrder 
        fields = ['_id', 'customer_name', 'sales_Route', 'Route', 'LedgerBalance'] 
        depth = 1

class LedgerDepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = LedgerDeposit
        fields = '__all__'

class WarehouseStocksSerializer(serializers.ModelSerializer):
    class Meta:
        model = WarehouseStock
        fields = '__all__'

class TransactionSerializer(serializers.Serializer):
    transaction_id = serializers.IntegerField()
    transaction_ref = serializers.CharField()
    transaction_date = serializers.DateTimeField()
    transaction_amount = serializers.IntegerField()
    balance = serializers.IntegerField()
    transaction_type = serializers.CharField()