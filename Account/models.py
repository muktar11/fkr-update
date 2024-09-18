from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, Group, Permission
from django.db import models
import os 
from django.utils.crypto import get_random_string
from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError('The Phone field must be set')
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user    
    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(phone, password, **extra_fields)



CHOICES = (
    ('CSO', 'CSO'),
    ('SDM', 'SDM'),
     ('BC', 'BC'),
    ('FM', 'FM'),
    ('FINANCE', 'FINANCE'),
    ('AGENAFINANCE', 'AGENAFINANCE'),
    ('LOGISTIC', 'LOGISTIC'),
    ('GM', 'GM'),
    ('Clerk', 'Clerk'),
    ('AdissAbabaInventory', 'AdissAbabaInventory'),
    ('AgenaInventory', 'AgenaInventory'),
    ('ProductionInventory', 'ProductionInventory'),
    ('Inventory', 'Inventory'),
    ('Supervisior', 'Supervisior'),
    ('Agent', 'Agent'),
    ('superAdmin', 'superAdmin'),
)

AreaRoute = (
    ('Area1', 'Area1'),
    ('Area1B', 'Area1B'),
    ('Area2', 'Area2'),
    ('Area3', 'Area3'),
    ('EastMarket', 'EastMarket'),
    ('AdissAbabaMarket', 'AdissAbabaMarket'),
    ('AdissAbabaMarket2', 'AdissAbabaMarket2'),
    ('Area8', 'Area8'),
    ('Area1DirectSales', 'Area1DirectSales'),
    ('AdissAbabaMarket', 'AdissAbabaMarket'),
)

class Staff(AbstractBaseUser, PermissionsMixin): 
    email = models.EmailField(unique=True, blank=True, null=True, max_length=254)
    phone = models.CharField(unique=True, max_length=15)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    role = models.CharField(max_length=100, choices=CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_web=models.BooleanField(default=False)
    web_id = models.CharField(max_length=255, blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        related_name='staff_set',  # Avoids clash with default User model
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='staff_set',  # Avoids clash with default User model
        blank=True
    )

    def __str__(self):
        return self.phone

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser



def customer_file_path(instance, filename):
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a new filename
    filename = f'{instance.email}.{ext}'
    # Return the file path
    return os.path.join('uploads', 'webcustomer', filename)


class WebCustomer(AbstractBaseUser):
    _id = models.AutoField(primary_key=True, editable=False)
    email = models.EmailField(unique=True, max_length=254)
    customer_name = models.CharField(max_length=255,  blank=True, null=True)
    sales_route = models.CharField(choices=AreaRoute, max_length=255, blank=False, null=False) 
    tin_number = models.CharField(max_length=255, blank=True, null=True)
    tin_number_doc = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    business_license_no = models.CharField(max_length=255, blank=True, null=True)
    business_license_no_doc = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    business_registration_no = models.CharField(max_length=255, blank=True, null=True)
    business_registration_no_doc = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    sales_target = models.CharField(max_length=255, blank=True, null=True)
    gps_coordinates = models.CharField(max_length=255, blank=True, null=True) 
    ledger = models.IntegerField(default=0, blank=True, null=True) 
    is_approved = models.BooleanField(default=False)
    is_credit = models.BooleanField(default=False)
    credit_limit = models.IntegerField(blank=True, null=True, default=0)
    phone = models.CharField(max_length=255, blank=True, null=True)
    contact_information = models.CharField(max_length=255, blank=True, null=True)
    is_cell = models.BooleanField(default=False, blank=True, null=True)
    USERNAME_FIELD = 'phone' 
    objects = CustomUserManager()
    def __str__(self):
        return self.customer_name

    

   
from django.db.models.signals import post_save
from django.dispatch import receiver




class WebCustomerProfile(models.Model):
    client = models.OneToOneField(WebCustomer, on_delete=models.CASCADE)
    ledger = models.CharField(max_length=255, blank=True, null=True)
    Phone = models.TextField(max_length=255, blank=True, null=True)



class UserLocation(models.Model):
    user = models.ForeignKey(Staff, on_delete=models.CASCADE)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    timestamp = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.first_name} - {self.latitude}, {self.longitude}"