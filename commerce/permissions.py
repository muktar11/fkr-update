from rest_framework.permissions import BasePermission

CHOICES = (
    ('CSO', 'CSO'),
    ('SDM', 'SDM'),
    ('FM', 'FM'),
    ('GM', 'GM'),
    ('ADMIN', 'ADMIN'),
    ('Clerk', 'Clerk'),
)

class IsCSO(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'CSO'
    

class IsSDM(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'SDM'
    

class IsFM(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'FM'
    
class IsGM(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'GM'
    
class IsADMIN(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'
    
class IsClerk(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Clerk'
    

