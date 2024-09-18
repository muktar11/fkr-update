from django.db import models
from Account.models import Staff, WebCustomer

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
    ('AdissAbabaMarketDirectSales', 'AdissAbabaMarketDirectSales'),
)


WareHouse = (
    ('AdissAbaba', 'AdissAbaba'),
    ('Agena', 'Agena'),
    ('Wolketie', 'Wolketie'),
)

import os 
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import Sum
def customer_file_path(instance, filename):
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a new filename
    filename = f'{instance._id}.{ext}'
    # Return the file path
    return os.path.join('uploads', 'payment', filename)

def inventory_file_path(instance, filename):
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a new filename
    filename = f'{instance._id}.{ext}'
    # Return the file path
    return os.path.join('uploads', 'inventory', filename)

def AADSinventory_file_path(instance, filename):
    # Get the file extension
    ext = filename.split('.')[-1]
    # Generate a new filename
    filename = f'{instance._id}.{ext}'
    # Return the file path
    return os.path.join('uploads', 'AADSinventory', filename)


class SalesPerson(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    sales_person = models.CharField(max_length=255, unique=True, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    sales_target = models.CharField(max_length=255, blank=True, null=True)
    Route =  models.CharField(choices=AreaRoute, max_length=255, blank=False, null=False) 
    is_approved = models.BooleanField(default=False) # for registeration
    is_cleared = models.BooleanField(default=False)  # clear of debt
    is_state = models.BooleanField(default=False) # in state of possess 
    
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.sales_person)
    
class Plate(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    plate_no = models.CharField(max_length=255, unique=True, blank=True, null=True)
    drivers_name = models.CharField(max_length=255, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.plate_no) 



class SetPrice(models.Model):
    sales_Route = models.CharField(choices=AreaRoute, max_length=255, blank=False, null=False) 
    warehouse = models.CharField(choices=WareHouse, max_length=255, blank=False, null=True) 
    TransportationFee = models.CharField(max_length=255, blank=False, null=False) 
    Q = models.CharField(max_length=255, blank=False, null=False)
    H = models.CharField(max_length=255, blank=False, null=False)
    ONE = models.CharField(max_length=255, blank=False, null=False)
    TWO  = models.CharField(max_length=255, blank=False, null=False)    
    _id = models.AutoField(primary_key=True, editable=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.sales_Route) 
    


class LedgerDeposit(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    customers_name = models.ForeignKey(WebCustomer, on_delete=models.SET_NULL, null=True, limit_choices_to={'is_approved': True}, related_name='ledger_deposits')
    Bank_Name = models.CharField(max_length=255, blank=True, null=True )
    Branch_Name = models.CharField(max_length=255, blank=False, null=True )
    Narrative  = models.CharField(max_length=255, blank=False, null=True )
    Deposit_Amount = models.IntegerField(default=0, blank=True, null=True )
    Bank_Reference_Number = models.CharField(max_length=255, unique=True, blank=True, null=True )
    Deposit_Date = models.DateField(blank=True,  null=True )
    finance_approved = models.BooleanField(default=False)
    finance_returned = models.BooleanField(default=False)
    is_mobile = models.BooleanField(default=False)
    payment = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    mobile_payment = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    Balance = models.IntegerField(blank=True, null=True)
    previous_balance = models.IntegerField(blank=True, null=True)
    return_issue =  models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.customers_name) 



warehouse = [
        ('Agena', 'Agena'),
        ('AdissAbaba', 'AdissAbaba'),
        ('Wolkete', 'Wolkete'),
        ('Factory', 'Factory'),
        ('Promotion', 'Promotion'),
]


     
class RawMaterialRequest(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    issue_store  = models.CharField(choices=warehouse, max_length=255, blank=True, null=False) 
    recipant_store  = models.CharField(choices=warehouse, max_length=255, blank=True, null=False) 
    Preform_14gm =  models.IntegerField(blank=True, null=True, default=0)
    Preform_18gm =  models.IntegerField(blank=True, null=True, default=0)
    Preform_28gm =  models.IntegerField(blank=True, null=True, default=0)
    Preform_40gm =  models.IntegerField(blank=True, null=True, default=0)
    is_Preform = models.BooleanField(blank=True, null=True)
    Shrink_35gm =  models.IntegerField(blank=True, null=True, default=0)
    Shrink_38gm =  models.IntegerField(blank=True, null=True, default=0)
    Shrink_42gm =  models.IntegerField(blank=True, null=True, default=0)
    Shrink_48gm =  models.IntegerField(blank=True, null=True, default=0)
    is_Shrink = models.BooleanField(blank=True, null=True)
    Label_035ml =  models.IntegerField(blank=True, null=True, default=0)
    Label_06ml =  models.IntegerField(blank=True, null=True, default=0)
    Label_1Lgm =  models.IntegerField(blank=True, null=True, default=0)
    Label_2L =  models.IntegerField(blank=True, null=True, default=0)
    is_Label = models.BooleanField(blank=True, null=True)
    Caps =  models.IntegerField(blank=True, null=True, default=0)
    is_Caps = models.BooleanField(blank=True, null=True)
    FG_Standardized_035ml = models.IntegerField(blank=True, null=True, default=0)
    FG_Standardized_06ml = models.IntegerField(blank=True, null=True, default=0)
    FG_Standardized_1L = models.IntegerField(blank=True, null=True, default=0)
    FG_Standardized_2l = models.IntegerField(blank=True, null=True, default=0)
    FG_Standardized_Total = models.IntegerField(blank=True, null=True, default=0)
    is_FG_Standardized = models.BooleanField(blank=True, null=True)
    FG_Damaged_035ml = models.IntegerField(blank=True, null=True, default=0)
    FG_Damaged_06ml = models.IntegerField(blank=True, null=True, default=0)
    FG_Damaged_1L = models.IntegerField(blank=True, null=True, default=0)
    FG_Damaged_2l = models.IntegerField(blank=True, null=True, default=0)
    FG_Damaged_Total = models.IntegerField(blank=True, null=True, default=0)
    is_FG_Damaged_Total = models.BooleanField(blank=True, null=True)
    FG_Damaged_Description = models.CharField(max_length=255, blank=True, null=True)
    FG_Damaged_UOM = models.CharField(max_length=255,blank=True, null=True)
    FG_Damaged_Quantity = models.IntegerField(blank=True, null=True)
    issue_store_file = models.FileField(blank=True, null=True)
    recipant_store_file = models.FileField(blank=True, null=True)
    FG_Damaged_Remark = models.CharField(max_length=255, blank=True, null=True)
    Plate = models.CharField(max_length=255, blank=True, null=True)
    Driver = models.CharField(max_length=255, blank=True, null=True)
    time = models.DateTimeField(auto_now_add=True)
    is_return = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False) 
    is_loaded = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False) 
    is_ready = models.BooleanField(default=False) 
    is_await = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.issue_store + " to " + self.recipant_store ) 
    
class WarehouseStock(models.Model):
    warehouse = models.CharField(choices=warehouse, max_length=255, primary_key=True)
    Preform_14gm = models.IntegerField(default=0)
    Preform_18gm = models.IntegerField(default=0)
    Preform_28gm = models.IntegerField(default=0)
    Preform_40gm = models.IntegerField(default=0)
    Shrink_35gm = models.IntegerField(default=0)
    Shrink_38gm = models.IntegerField(default=0)
    Shrink_42gm = models.IntegerField(default=0)
    Shrink_48gm = models.IntegerField(default=0)
    Label_035ml = models.IntegerField(default=0)
    Label_06ml = models.IntegerField(default=0)
    Label_1Lgm = models.IntegerField(default=0)
    Label_2L = models.IntegerField(default=0)
    Caps = models.IntegerField(default=0)
    FG_Standardized_035ml = models.IntegerField(default=0)
    FG_Standardized_06ml = models.IntegerField(default=0)
    FG_Standardized_1L = models.IntegerField(default=0)
    FG_Standardized_2l = models.IntegerField(default=0)
    FG_Damaged_035ml = models.IntegerField(default=0)
    FG_Damaged_06ml = models.IntegerField(default=0)
    FG_Damaged_1L = models.IntegerField(default=0)
    FG_Damaged_2l = models.IntegerField(default=0)

    def __str__(self):
        return self.warehouse

class SalesOrder(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    customers_name = models.ForeignKey(WebCustomer, on_delete=models.SET_NULL, null=True, limit_choices_to={'is_approved': True}, related_name='sales_order')    
    supervisor = models.ForeignKey(Staff,on_delete=models.SET_NULL, blank=True, null=True, limit_choices_to={'role': 'Supervisior'}, related_name='sales_orders')
    supplier = models.ForeignKey(RawMaterialRequest,on_delete=models.SET_NULL, blank=True, null=True)
    sales_Route = models.CharField(AreaRoute, max_length=255, blank=True, null=False)
    Route = models.CharField(max_length=255, blank=True, null=True) 
    LedgerBalance = models.IntegerField(default=0,blank=False, null=False)
    Qp = models.IntegerField(blank=False, null=False)
    Hp = models.IntegerField(blank=False, null=False)
    ONEp = models.IntegerField(blank=False, null=False)
    TWOp  = models.IntegerField(blank=False, null=False)   
    Q_Unit = models.IntegerField(default=0, blank=False, null=False)
    H_Unit = models.IntegerField(default=0, blank=False, null=False)
    ONE_Unit = models.IntegerField(default=0, blank=False, null=False)
    TWO_Unit  = models.IntegerField(default=0, blank=False, null=False)   
    Totalp = models.IntegerField(blank=False, null=False)
    Q_CASH = models.IntegerField(blank=True, null=True)
    H_CASH = models.IntegerField( blank=True, null=True)
    ONE_CASH = models.IntegerField(blank=True, null=True)
    TWO_CASH  = models.IntegerField( blank=True, null=True)   
    Total_CASH = models.IntegerField(blank=True, null=True)
    Grand_Total_CASH = models.IntegerField(blank=True, null=True)
    payment =  models.FileField(upload_to=customer_file_path, blank=True, null=True)
    plate = models.CharField(max_length=255, blank=True, null=True) 
    CSI_CRSI_Number = models.CharField(max_length=255,  blank=True)
    Bank_Name = models.CharField(max_length=255, blank=True, null=True )
    Amount = models.CharField(max_length=255, blank=True, null=True )
    Bank_Reference_Number = models.CharField(max_length=255,  blank=True, null=True )
    Deposit_Date = models.DateField(blank=True,  null=True )
    sdm_approved = models.BooleanField(default=False)
    sdmcreated_at = models.DateTimeField(blank=True,  null=True) 
    sdmcreated_first_name = models.CharField(max_length=255, blank=True, null=True) 
    sdmcreated_last_name = models.CharField(max_length=255, blank=True,  null=True) 
    sdm_returned = models.BooleanField(default=False)
    sdm_returned_issue =  models.CharField(max_length=255, blank=True, null=True)
    finance_approved = models.BooleanField(default=False)
    financepayment_at = models.DateTimeField(blank=True,  null=True) 
    financecreated_at = models.DateTimeField(blank=True,  null=True) 
    financecreated_first_name = models.CharField(max_length=255, blank=True, null=True) 
    financecreated_last_name = models.CharField(max_length=255, blank=True,  null=True) 
    finance_manager_approved = models.BooleanField(default=False)
    financemanagercreated_at = models.DateTimeField(blank=True,  null=True) 
    financemanagercreated_first_name = models.CharField(max_length=255, blank=True, null=True) 
    financemanagercreated_last_name = models.CharField(max_length=255, blank=True,  null=True) 
    finance_returned = models.BooleanField(default=False)
    finance_returned_issue =  models.CharField(max_length=255, blank=True, null=True)
    plate_no = models.CharField(max_length=255, blank=True, null=True)
    Inventory =  models.CharField(max_length=255, blank=True, null=True)
    logisitcmanagercreated_at = models.DateTimeField(blank=True,  null=True)
    logisitcmanagercreated_first_name = models.CharField(max_length=255, blank=True, null=True) 
    logisitcmanagercreated_last_name = models.CharField(max_length=255, blank=True,  null=True)  
    Driver = models.CharField(max_length=255, blank=True, null=True)
    is_loaded = models.BooleanField(default=False)
    is_deliverd = models.BooleanField(default=False)
    inventory_check = models.BooleanField(default=False)
    inventorycreated_at = models.DateTimeField(blank=True,  null=True) 
    inventorycreated_first_name = models.CharField(max_length=255, blank=True, null=True) 
    inventorycreated_last_name = models.CharField(max_length=255, blank=True,  null=True)  
    inventory_recipant = models.CharField(max_length=255, blank=True, null=True)
    inventory_file = models.FileField(upload_to=inventory_file_path, blank=True, null=True)
    inventory_ddo = models.CharField(max_length=255, blank=True, null=True)
    finance_clear = models.BooleanField(default=False)
    finance_clear_issue = models.CharField(max_length=255, blank=True, null=True)
    supervisor_created_at = models.DateTimeField(blank=True,  null=True) 
    supervisor_remark = models.CharField(max_length=255, blank=True, null=True) 
    cso_remote_process_first_name = models.CharField(max_length=255, blank=True, null=True) 
    cso_remote_process_last_name = models.CharField(max_length=255, blank=True,  null=True)  
    cso_remote_process_created_at = models.DateTimeField(blank=True,  null=True) 
    cso_remote_process_updated = models.BooleanField(default=False)
    cso_remote_process_returned = models.BooleanField(default=False)
    cso_remote_process_return_issue = models.CharField(max_length=255, blank=True,  null=True) 
    cso_remote_process_approved = models.BooleanField(default=False)
    is_mobile = models.BooleanField(default=False)
    is_mobile_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)  
    execution_time = models.DateTimeField(blank=True, null=True) 
  


    def __str__(self):
        return str(self.customers_name)

    class Meta:
        ordering = ['-created_at']  




     
class AADDSalesOrder(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    Plate_number = models.ForeignKey(Plate, on_delete=models.CASCADE)
    SalesPerson = models.ForeignKey(SalesPerson,  on_delete=models.SET_NULL, null=True, limit_choices_to={'is_cleared': True, 'is_state': False})
    sales_Route = models.CharField(AreaRoute, max_length=255, blank=True, null=False) 
    Qp =  models.IntegerField(blank=False, null=False)
    Hp =  models.IntegerField( blank=False, null=False)
    ONEp =  models.IntegerField(blank=False, null=False)
    TWOp  =  models.IntegerField( blank=False, null=False)   
    Totalp =  models.IntegerField(blank=False, null=False)
    Q_CASH =  models.IntegerField(blank=True, null=True)
    H_CASH =  models.IntegerField(blank=True, null=True)
    ONE_CASH =  models.IntegerField( blank=True, null=True)
    TWO_CASH  =  models.IntegerField(blank=True, null=True)   
    Total_CASH =  models.IntegerField(blank=True, null=True)
    payment =  models.FileField(upload_to=customer_file_path, blank=True, null=True)
    TransportationFee = models.CharField(max_length=255, blank=True, null=True) 
    #for finance
    sdm_returned = models.BooleanField(default=False)
    sdm_returned_issue =  models.CharField(max_length=255, blank=True, null=True)
    CSI_CRSI_Number = models.CharField(max_length=255,  blank=True, unique=False)
    Bank_Name = models.CharField(max_length=255, blank=True, null=True )
    Amount = models.CharField(max_length=255, blank=True, null=True )
    Bank_reference_Number = models.CharField(max_length=255, unique=True, blank=True, null=True )
    smd_approved = models.BooleanField(default=False)
    finance_approved = models.BooleanField(default=False)
    Inventory =  models.CharField(max_length=255, blank=False, null=True, default='AdissAbaba')
    finance_manager_approved = models.BooleanField(default=False) 
    is_return = models.BooleanField(default=False)  
    is_financed_approve = models.BooleanField(default=False)
    inventory_check = models.BooleanField(default=False)
    inventory_recipant = models.CharField(max_length=255, blank=True, null=True)
    inventory_file = models.FileField(upload_to=AADSinventory_file_path,blank=True, null=True)
    inventory_ddo = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_finished = models.BooleanField(default=False)
    no_reload = models.IntegerField(default=0, blank=True, null=True)
 
    
    def __str__(self):
        return str(self.SalesPerson)             

    class Meta:
        ordering = ['-created_at']  


class AADSalesOrderReload(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    order = models.ForeignKey(AADDSalesOrder, on_delete=models.SET_NULL, null=True, blank=True )
    Qp = models.IntegerField( blank=False, null=False)
    Hp =  models.IntegerField(blank=False, null=False)
    ONEp =  models.IntegerField(blank=False, null=False)
    TWOp  =  models.IntegerField(blank=False, null=False)   
    Totalp =  models.IntegerField(blank=False, null=False)      
    Q_CASH = models.IntegerField( blank=True, null=False)
    H_CASH=  models.IntegerField(blank=True, null=False)
    ONE_CASH =  models.IntegerField(blank=True, null=False)
    TWO_CASH =  models.IntegerField(blank=True, null=False)   
    Total_CASH =  models.IntegerField(blank=True, null=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    reload_recipient = models.CharField(max_length=255, blank=True, null=True)
    reload_file = models.FileField(upload_to=AADSinventory_file_path,blank=True, null=True)
    inventory_ddo = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return str(self.order)  


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_check()
        self.update_no_reload()

    def update_no_reload(self):
        if self.order:
            self.order.no_reload += 1
            self.order.save()

    def update_check(self):
        if self.order:
            self.order.inventory_check = False
            self.order.save()


    
class InventoryReturnForm(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    sales = models.ForeignKey(AADDSalesOrder, on_delete=models.SET_NULL, null=True)
    Qp = models.CharField(max_length=19, blank=False, null=False)
    Hp= models.CharField(max_length=19, blank=False, null=False)
    ONEp = models.CharField(max_length=19, blank=False, null=False)
    TWOp = models.CharField(max_length=19, blank=False, null=False)
    Totalp = models.CharField(max_length=19, blank=False, null=False)
    Q_CASH = models.CharField(max_length=19, blank=True, null=False)
    H_CASH = models.CharField(max_length=19, blank=True, null=False)
    ONE_CASH = models.CharField(max_length=19, blank=True, null=False)
    TWO_CASH = models.CharField(max_length=19, blank=True, null=False)
    Total_CASH = models.CharField(max_length=19, blank=True, null=False)
    return_Qp = models.IntegerField(default=0, blank=True, null=True)
    return_Hp = models.IntegerField(default=0, blank=True, null=True)
    return_ONEp = models.IntegerField(default=0, blank=True, null=True)
    return_TWOp = models.IntegerField(default=0, blank=True, null=True)
    return_Totalp = models.IntegerField(default=0, blank=True, null=True)
    return_Q_CASH = models.IntegerField(default=0, blank=True, null=True)
    return_H_CASH = models.IntegerField(default=0, blank=True, null=True)
    return_ONE_CASH = models.IntegerField(default=0, blank=True, null=True)
    return_TWO_CASH = models.IntegerField(default=0, blank=True, null=True)
    return_Total_CASH = models.IntegerField(default=0, blank=True, null=True)
    sold_Qp = models.IntegerField(default=0, blank=True, null=True)
    sold_Hp = models.IntegerField(default=0, blank=True, null=True)
    sold_ONEp = models.IntegerField(default=0, blank=True, null=True)
    sold_TWOp = models.IntegerField(default=0, blank=True, null=True)
    sold_Totalp = models.IntegerField(default=0, blank=True, null=True)
    sold_Q_CASH = models.IntegerField(default=0, blank=True, null=True)
    sold_H_CASH = models.IntegerField(default=0, blank=True, null=True)
    sold_ONE_CASH = models.IntegerField(default=0, blank=True, null=True)
    sold_TWO_CASH = models.IntegerField(default=0, blank=True, null=True)
    sold_Total_CASH = models.IntegerField(default=0, blank=True, null=True)
    payment = models.FileField(upload_to=customer_file_path, blank=True, null=True)
    recipient = models.CharField(max_length=255, blank=False, null=False)
    CSI_CSRI_Number = models.CharField(max_length=255, blank=True, unique=False)
    Bank_Name = models.CharField(max_length=255, blank=True, null=True)
    Amount = models.CharField(max_length=255, blank=True, null=True)
    RCSNO = models.CharField(max_length=255, blank=True, null=True)
    Discount_Amount = models.IntegerField(default=0, blank=True, null=True)
    Bank_reference_Number = models.CharField(max_length=255,unique=True, blank=True, null=True)
    Deposit_Date = models.DateField(blank=True, null=True)
    ledger_payment = models.FileField(blank=True, null=True)
    ledger_CSI_CRSI_Number = models.CharField(max_length=255, blank=True, unique=False)
    ledger_Bank_Name = models.CharField(max_length=255, blank=True, null=True)
    ledger_Amount = models.CharField(max_length=255, blank=True, null=True)
    ledger_Bank_reference_Number = models.CharField(max_length=255, blank=True, null=True)
    ledger_Deposit_Date = models.DateField(blank=True, null=True)
    is_pending = models.BooleanField(default=False)
    is_clear = models.BooleanField(default=False)
    is_Discount = models.BooleanField(default=False)
    is_processing = models.BooleanField(default=False)
    is_financed_approve = models.BooleanField(default=False)
    issues = models.CharField(max_length=9999, blank=True, null=True)
    is_return_finance = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    no_pending = models.IntegerField(default=0, blank=True, null=True)
    is_finished = models.BooleanField(default=False)


    def __str__(self):
        return str(self.sales)

    def calculate_Qp_price(self):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            set_price = SetPrice.objects.filter(sales_Route=sales_person.Route).last()
            price = int(self.Qp) * int(set_price.Q)
            return str(price)
        return "0"

    def calculate_Hp_price(self):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            set_price = SetPrice.objects.filter(sales_Route=sales_person.Route).last()
            price = int(self.Hp) * int(set_price.H)
            return str(price)
        return "0"

    def calculate_ONEp_price(self):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            set_price = SetPrice.objects.filter(sales_Route=sales_person.Route).last()
            price = int(self.ONEp) * int(set_price.ONE)
            return str(price)
        return "0"

    def calculate_TWOp_price(self):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            set_price = SetPrice.objects.filter(sales_Route=sales_person.Route).last()
            price = int(self.TWOp) * int(set_price.TWO)
            return str(price)
        return "0"

    def calculate_Total_price(self):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            Qp_price = int(self.calculate_Qp_price())
            Hp_price = int(self.calculate_Hp_price())
            ONEp_price = int(self.calculate_ONEp_price())
            TWOp_price = int(self.calculate_TWOp_price())
            total_price = Qp_price + Hp_price + ONEp_price + TWOp_price
            return str(total_price)
        return "0"

    def save(self, *args, **kwargs):
        sales_person = self.sales.SalesPerson if self.sales else None
        if sales_person:
            self.Q_CASH = self.calculate_Qp_price()
            self.H_CASH = self.calculate_Hp_price()
            self.ONE_CASH = self.calculate_ONEp_price()
            self.TWO_CASH = self.calculate_TWOp_price()
            self.Total_CASH = self.calculate_Total_price()
        super().save(*args, **kwargs)
       
    def save(self, *args, **kwargs):
        if not self.is_processing:  # Check if is_processing is False
            sales_person = self.sales.SalesPerson if self.sales else None
            if sales_person:
                self.Q_CASH = self.calculate_Qp_price()
                self.H_CASH = self.calculate_Hp_price()
                self.ONE_CASH = self.calculate_ONEp_price()
                self.TWO_CASH = self.calculate_TWOp_price()
                self.Total_CASH = self.calculate_Total_price()

            if self.return_Qp:
                self.return_Qp = int(self.Qp) - int(self.return_Qp)
            elif self.sales and hasattr(self.sales, 'Qp'):
                self.return_Qp = int(self.sales.Qp) - int(self.Qp)

            if self.return_Hp:
                self.return_Hp = int(self.Hp) - int(self.return_Hp)
            elif self.sales and hasattr(self.sales, 'Hp'):
                self.return_Hp = int(self.sales.Hp) - int(self.Hp)

            if self.return_ONEp:
                self.return_ONEp = int(self.ONEp) - int(self.return_ONEp)
            elif self.sales and hasattr(self.sales, 'ONEp'):
                self.return_ONEp = int(self.sales.ONEp) - int(self.ONEp)

            if self.return_TWOp:
                self.return_TWOp = int(self.TWOp) - int(self.return_TWOp)
            elif self.sales and hasattr(self.sales, 'TWOp'):
                self.return_TWOp = int(self.sales.TWOp) - int(self.TWOp)

            self.return_Totalp = (
                self.return_Qp + self.return_Hp + self.return_ONEp + self.return_TWOp
            )
            self.return_Hp = int(self.sales.Hp or 0) - int(self.Hp or 0)
            self.return_Qp = int(self.sales.Qp or 0) - int(self.Qp or 0)
            self.return_ONEp = int(self.sales.ONEp or 0) - int(self.ONEp or 0)
            self.return_TWOp = int(self.sales.TWOp or 0) - int(self.TWOp or 0)

            difference_QCASH = int(self.sales.Q_CASH or 0) - int(self.Q_CASH or 0)
            difference_HCASH = int(self.sales.H_CASH or 0) - int(self.H_CASH or 0)
            difference_ONECASH = int(self.sales.ONE_CASH or 0) - int(self.ONE_CASH or 0)
            difference_TWOCASH = int(self.sales.TWO_CASH or 0) - int(self.TWO_CASH or 0)

            self.return_Q_CASH = difference_QCASH
            self.return_H_CASH = difference_HCASH
            self.return_ONE_CASH = difference_ONECASH
            self.return_TWO_CASH = difference_TWOCASH

            self.return_Total_CASH = (
                self.return_Q_CASH + self.return_H_CASH + self.return_ONE_CASH + self.return_TWO_CASH
            )
    
        self.is_processing = True  # Set is_processing to True
        super().save(*args, **kwargs)

class CustomerDebitForm(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    customer = models.ForeignKey(WebCustomer, on_delete=models.SET_NULL, null=True, blank=True , limit_choices_to={'is_credit': True})
    Inventory = models.ForeignKey(InventoryReturnForm, on_delete=models.SET_NULL, null=True, blank=True )
    Qp = models.IntegerField( blank=False, null=False)
    Hp =  models.IntegerField(blank=False, null=False)
    ONEp =  models.IntegerField(blank=False, null=False)
    TWOp  =  models.IntegerField(blank=False, null=False)   
    Totalp =  models.IntegerField(blank=False, null=False)      
    Q_CASH = models.IntegerField( blank=True, null=False)
    H_CASH=  models.IntegerField(blank=True, null=False)
    ONE_CASH =  models.IntegerField(blank=True, null=False)
    TWO_CASH =  models.IntegerField(blank=True, null=False)   
    Total_CASH =  models.IntegerField(blank=True, null=False)      
    payment =  models.FileField(upload_to=customer_file_path, blank=True, null=True)
    CSI_CSRI_Number = models.CharField(max_length=255,  blank=True,null=True )
    Bank_Name = models.CharField(max_length=255, blank=True, null=True )
    Amount = models.CharField(max_length=255, blank=True, null=True )
    Bank_reference_Number = models.CharField(max_length=255,unique=True,  blank=True, null=True )
    Deposit_Date = models.DateField(blank=True,  null=True )
    due_date = models.DateField(blank=True,  null=True )
    issues = models.CharField(max_length=9999, blank=True, null=True)
    is_clear = models.BooleanField(default=False)

    def __str__(self):
        return str(self.customer)

    def save(self, *args, **kwargs):
        if self.Inventory:
            self.calculate_return_values()
        super().save(*args, **kwargs)
    def calculate_return_values(self):
        if self.Inventory:
            return_Qp = int(self.Qp)
            return_Hp = int(self.Hp)
            return_ONEp = int(self.ONEp)
            return_TWOp = int(self.TWOp)
            return_Totalp = int(self.Totalp)
            return_Q_CASH = int(self.Q_CASH)
            return_H_CASH = int(self.H_CASH)
            return_ONE_CASH = int(self.ONE_CASH)
            return_TWO_CASH = int(self.TWO_CASH)
            return_Total_CASH = int(self.Total_CASH)
            self.Inventory.return_Qp -= return_Qp
            self.Inventory.return_Hp -= return_Hp
            self.Inventory.return_ONEp -= return_ONEp
            self.Inventory.return_TWOp -= return_TWOp
            self.Inventory.return_Totalp -= return_Totalp
            self.Inventory.return_Q_CASH -= return_Q_CASH
            self.Inventory.return_H_CASH -= return_H_CASH
            self.Inventory.return_ONE_CASH -= return_ONE_CASH
            self.Inventory.return_TWO_CASH -= return_TWO_CASH
            self.Inventory.return_Total_CASH -= return_Total_CASH
            self.Inventory.no_pending += 1


            self.Inventory.save()

'''  
@receiver(post_save, sender=WebCustomer)
def create_sales_performance_measure(sender, instance, created, **kwargs):
    if created:
        sales_target = instance.sales_target

        # Attempt to convert sales_target to an integer
        try:
            sales_target = int(sales_target)
        except ValueError:
            # Handle the case where sales_target is not a valid integer
            # You might want to add logging or handle this case appropriately
            pass
        
        # Now, perform operations if sales_target is an integer
        if isinstance(sales_target, int):
            monthly_sales_expectation = sales_target
            daily_sales_expectation = sales_target / 26
            annually_sales_expectation = sales_target * 12

            AgentSalesPerfomanceMeasure.objects.create(
                customer=instance,
                daily_sales_performance_qty_expectation=daily_sales_expectation,
                monthly_sales_performance_qty_expectation=monthly_sales_expectation,
                annually_sales_performance_qty_expectation=annually_sales_expectation
                # You may add other default values or leave them as defaults if needed
            )
'''

class AgentSalesPerfomanceMeasure(models.Model):
    customer = models.ForeignKey(WebCustomer, on_delete=models.SET_NULL, null=True, blank=True)
    sales = models.ForeignKey(SalesOrder, on_delete=models.SET_NULL, null=True)
    daily_sales_performance_qty_expectation = models.FloatField(blank=True, null=True, default=0)
    daily_sales_performance_qty_achievement = models.FloatField(blank=True, null=True, default=0)
    monthly_sales_performance_qty_expectation = models.FloatField(blank=True, null=True, default=0)
    monthly_sales_performance_qty_achievement = models.FloatField(blank=True, null=True, default=0)
    annually_sales_performance_qty_expectation = models.FloatField(blank=True, null=True, default=0)
    annually_sales_performance_qty_achievement = models.FloatField(blank=True, null=True, default=0) 



    
    def __str__(self):
        return str(self.customer)

class SupervisorSalesPerfomanceMeasure(models.Model):
    supervisor = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True , limit_choices_to={'role': 'Supervisor'})
    daily_sales_performance_qty_expectation = models.IntegerField(blank=True, null=True, default=0)
    daily_sales_performance_qty_achievement = models.IntegerField(blank=True, null=True, default=0)
    monthly_sales_performance_qty_expectation = models.IntegerField(blank=True, null=True, default=0)
    monthly_sales_performance_qty_achievement = models.IntegerField(blank=True, null=True, default=0)
    annually_sales_performance_qty_expectation = models.IntegerField(blank=True, null=True, default=0)
    annually_sales_performance_qty_achievement = models.IntegerField(blank=True, null=True, default=0)


    def __str__(self):
        return str(self.customer)