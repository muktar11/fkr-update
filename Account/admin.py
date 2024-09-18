from django.contrib import admin
from .models import Staff, WebCustomer, WebCustomerProfile, UserLocation
admin.site.register(Staff)
admin.site.register(WebCustomer)
admin.site.register(WebCustomerProfile)
admin.site.register(UserLocation)