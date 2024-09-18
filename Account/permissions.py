from rest_framework.permissions import BasePermission
from .models import WebCustomer, Staff

class IsWebCustomerUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and isinstance(request.user, WebCustomer)
    

class IsStaffUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and isinstance(request.user, Staff)
    
class IsCSO(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'CSO'
        )


class IsSDM(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'SDM'
        )


class IsFinance(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'FINANCE'
        )

class IsFM(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'FM'
        )

class IsLOGISTIC(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'LOGISTIC'
        )


class IsClerk(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'Clerk'
        )


class IsInventory(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'Inventory'
        )

class IsSupervisior(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'Supervisior'
        )

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            isinstance(request.user, Staff) and
            request.user.role == 'superAdmin'
        )

