from django.contrib import admin

# Register your models here.
from .models import (
    Plate, SalesPerson,  
    SalesOrder, AADDSalesOrder,
    LedgerDeposit, AADSalesOrderReload,
    SetPrice, AADDSalesOrder, InventoryReturnForm, 
    CustomerDebitForm,
    WarehouseStock,
    AgentSalesPerfomanceMeasure, 
    SupervisorSalesPerfomanceMeasure,
    RawMaterialRequest
    
)

admin.site.register(Plate)
admin.site.register(SalesPerson)
admin.site.register(SalesOrder)
admin.site.register(AADSalesOrderReload)
admin.site.register(AADDSalesOrder)
admin.site.register(WarehouseStock)
admin.site.register(InventoryReturnForm)
admin.site.register(SetPrice)
admin.site.register(RawMaterialRequest)
admin.site.register(CustomerDebitForm)
admin.site.register(LedgerDeposit)
admin.site.register(AgentSalesPerfomanceMeasure)
admin.site.register(SupervisorSalesPerfomanceMeasure)