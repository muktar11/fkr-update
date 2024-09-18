import calendar
from django.utils import timezone
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view 
from datetime import datetime, timedelta
from rest_framework.response import Response
from decimal import Decimal 
from rest_framework import generics
from django.db.models import Subquery, OuterRef
from .models import(
    RawMaterialRequest,
    WebCustomer,
     SalesOrder,
    SalesPerson, 
    Plate, 
    SetPrice,
    AADDSalesOrder,
    InventoryReturnForm,
    AADSalesOrderReload,
    CustomerDebitForm,
    LedgerDeposit,
    WarehouseStock,
    AgentSalesPerfomanceMeasure
)
from serializer.serializers import (
    RawMaterialRequestSerializer,
    WebCustomerSerializer,
    SalesOrderSerializer,
    SalesPersonSerializer, 
    PlateSerializer,
    SetPriceSerializer,
    AADDSalesOrderSerializer,
    InventoryReturnFormSerializer, 
    SalesSerializer,
    ReturnsSerializer, 
    SalespersonDebtSerializer,
    PieOrderSerializer,
    LineOrderSerializer,
    AADSalesOrderReloadSerializer,
    CustomerDebitFormSerializer,
    LedgerDepositSerialzier,
    CombinedDataSerializer,
    AgentSalesPerfomanceMeasureSerializer
)
from rest_framework import viewsets
from rest_framework.views import APIView
from django.db.models import Sum
from Account.models import WebCustomer, Staff 
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import datetime 
from dateutil import parser
from django.utils import timezone
from itertools import chain 


@api_view(['POST'])
def create_sales_order(request, pk):
    customer = WebCustomer.objects.get(_id=pk)
    data = request.data

    
    ledger_balance = int(data['ledgerBalance'])
    total_cash = int(data['Total_CASH'])
   
    if ledger_balance < total_cash:
        return Response({"error": "Not enough balance."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        sales_order = SalesOrder.objects.create(
            customers_name=customer,
            sales_Route=data['sales_Route'],
            Route=data['Route'],
            Qp=data['Qp'],
            Hp=data['Hp'],
            ONEp=data['ONEp'],
            TWOp=data['TWOp'],
            Totalp=data['Totalp'],
            Q_Unit=data['Q_Unit'],
            H_Unit=data['H_Unit'],
            ONE_Unit=data['ONE_Unit'],
            TWO_Unit=data['TWO_Unit'],
            Q_CASH=data['Q_CASH'],
            H_CASH=data['H_CASH'],
            ONE_CASH=data['ONE_CASH'],
            TWO_CASH=data['TWO_CASH'],
            Total_CASH=total_cash,
            Grand_Total_CASH=data['Grand_Total_CASH'],
            Inventory=data['Inventory'],
            LedgerBalance=ledger_balance,
            plate=data['plate'],
            is_mobile_approved=True,
            cso_remote_process_approved=True,
        )
        
        if ledger_balance >= total_cash:
            sales_order.save()  # Save the sales order
        
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)



@api_view(['POST'])
def create_remote_sales_order(request, pk, pks):
    customer = WebCustomer.objects.get(_id=pk)
    staff = Staff.objects.get(id=pks)
    data = request.data    
    ledger_balance = int(data['ledgerBalance'])
    total_cash = int(data['Grand_Total_CASH'])  
    if ledger_balance < total_cash:
        return Response({"error": "Not enough balance."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        sales_order = SalesOrder.objects.create(
            customers_name=customer,
            supervisor=staff,
            sales_Route=data['sales_Route'],
            Route=data['Route'],
            Qp=data['Qp'],
            Hp=data['Hp'],
            ONEp=data['ONEp'],
            TWOp=data['TWOp'],
            Q_Unit=data['Q_Unit'],
            H_Unit=data['H_Unit'],
            ONE_Unit=data['ONE_Unit'],
            TWO_Unit=data['TWO_Unit'],
            Totalp=data['Totalp'],
            Q_CASH=data['Q_CASH'],
            H_CASH=data['H_CASH'],
            ONE_CASH=data['ONE_CASH'],
            TWO_CASH=data['TWO_CASH'],
            Total_CASH=data['Total_CASH'],
            Inventory=data['Inventory'],
            Grand_Total_CASH=total_cash,
            LedgerBalance=ledger_balance,
            supervisor_remark=data['Remark'],
            is_mobile=True, 
            supervisor_created_at = datetime.now()          
        )
        
        if ledger_balance >= total_cash:
            sales_order.save()  # Save the sales order
        
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)



@api_view(['PUT'])
def update_remote_sales_order(request, pk):
    data = request.data 
    ledger_balance = int(data['ledgerBalance'])
    total_cash = int(data['Grand_Total_CASH'])  
    if ledger_balance < total_cash:
        return Response({"error": "Not enough balance."}, status=status.HTTP_400_BAD_REQUEST)
    else: 
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.Inventory=data['Inventory']
        sales_order.Qp=data['Qp']
        sales_order.Hp=data['Hp']
        sales_order.ONEp=data['ONEp']
        sales_order.TWOp=data['TWOp']
        sales_order.Totalp=data['Totalp']
        sales_order.Q_CASH=data['Q_Total']
        sales_order.H_CASH=data['H_Total']      
        sales_order.ONE_CASH=data['ONE_Total']
        sales_order.TWO_CASH=data['TWO_Total']  # Added comma here
        sales_order.Total_CASH=data['Total_CASH']
        sales_order.Grand_Total_CASH=data['Grand_Total_CASH']
        sales_order.cso_remote_process_updated=True
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)


@api_view(['PUT'])
def reject_remote_sales_order(request, pk):
    data = request.data 
    sales_order = SalesOrder.objects.get(_id=pk)
    sales_order.cso_remote_process_first_name=data['cso_remote_approve_first_name'],
    sales_order.cso_remote_process_last_name=data['cso_remote_approve_last_name'],
    sales_order.cso_remote_process_return_issue=data['cso_return_issue'],
    sales_order.cso_remote_process_returned = True
    sales_order.save() 
    serializer = SalesOrderSerializer(sales_order, context={'request': request})
    return Response(serializer.data)




@api_view(['GET'])
def sales_order_remote_view(request):
    try: 
        sales_orders = SalesOrder.objects.filter(sdm_approved=False, is_mobile=True, cso_remote_process_returned=False,  cso_remote_process_updated=False, cso_remote_process_approved=False, is_mobile_approved=False, sdm_returned=False)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def sales_order_remote_rejected_view(request):
    try: 
        sales_orders = SalesOrder.objects.filter(sdm_approved=False, is_mobile=True, cso_remote_process_returned=True,  cso_remote_process_updated=False, cso_remote_process_approved=False, is_mobile_approved=False, sdm_returned=False)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['PUT'])
def remote_sales_order_approve_create_view(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.cso_remote_process_first_name=data['cso_remote_approve_first_name'],
        sales_order.cso_remote_process_last_name=data['cso_remote_approve_last_name'],
        sales_order.is_mobile_approved=True
        sales_order.cso_remote_process_approved = True
        sales_order.supervisor_created_at = datetime.now()
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order)
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def retrieve_remote_sales_order_by_supervisor(request, pk):
    # Retrieve the supervisor instance by ID or return a 404 response if not found
    supervisor = get_object_or_404(Staff, id=pk) 
    # Retrieve sales orders associated with the supervisor
    sales_orders = SalesOrder.objects.filter(supervisor=supervisor) 
    # Serialize the queryset
    serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request}) 
    return Response(serializer.data)
from rest_framework.response import Response

@api_view(['GET'])
def sales_order_status_view(request, pk):
    data = request.data 
    sales_order = SalesOrder.objects.get(pk=pk)
    
    approval_stages = ['cso_remote_process_approved', 'sdm_approved',
     'finance_approved', 'is_loaded', 'inventory_check', 'is_deliverd']
    status_mapping = {
        'cso_remote_process_approved': "CSO",
        'sdm_approved': "SDM",
        'finance_approved': "Finance",
        'is_loaded': "Loaded",
        'inventory_check': 'WareHouse',
        'is_deliverd': 'Track' 
    }
    
    status = None  # Initializing status variable

    for stage in approval_stages:
        approval_status = getattr(sales_order, stage)
        if not approval_status:
            status = status_mapping[stage]
            break  # Break the loop when a False approval is found

    if status:
        return Response({"status": status}, status=200)
    else:
        return Response({"status": "All Approved"}, status=200)
    

 
@api_view(['PUT'])
def update_sales_order(request, pk):
    data = request.data 
    sales_order = SalesOrder.objects.get(_id=pk)
    sales_order.Qp=data['Qp']
    sales_order.Hp=data['Hp']
    sales_order.ONEp=data['ONEp']
    sales_order.TWOp=data['TWOp']
    sales_order.Totalp=data['Totalp']



    sales_order.Q_CASH=data['Q_Total']
    sales_order.H_CASH=data['H_Total']
    sales_order.ONE_CASH=data['ONE_Total']
    sales_order.TWO_CASH=data['TWO_Total']  # Added comma here
    sales_order.Total_CASH=data['Total_CASH']
    sales_order.payment = request.FILES.get('payment')
    if data.get('sdm_returned'):
        sales_order.sdm_returned = False
    if data.get('finance_returned'):
        sales_order.finance_returned = False        
    sales_order.save()
    serializer = SalesOrderSerializer(sales_order, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def retrieve_sales_order_by_id(request, pk):
    try:
        sales_order = SalesOrder.objects.get(pk=pk)
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    
@api_view(['GET'])
def retrieve_sales_order_all(request):
    sales_orders = SalesOrder.objects.all()
    serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
    return Response(serializer.data)


    
@api_view(['GET'])
def retrieve_reject_sdm_view(request):
    sales_orders = SalesOrder.objects.filter(sdm_returned=True, sdm_approved=False)
    serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
def sdm_approve_reject_view(request, pk):
    try:
        sales_order = SalesOrder.objects.get(_id=pk)
        data = request.data 
        sales_order.sdm_returned_issue = data['sdm_returned_issue']
        sales_order.sdm_returned = True
        sales_order.sdm_approved = False 
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['POST'])
def finance_approve_reject_view(request, pk):
    try:
        sales_order = SalesOrder.objects.get(_id=pk)
        data = request.data 
        sales_order.finance_returned_issue = data['finance_returned_issue']
        sales_order.finance_returned = True
        sales_order.finance_approved = False 
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_all(request):
    sales_orders = SalesOrder.objects.all()
    serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
def sdm_approve_create_view(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.sdm_approved = True
        sales_order.sdm_returned = False
        sales_order.sdmcreated_at =  datetime.now()
        sales_order.sdmcreated_first_name = data['sdmcreated_first_name']
        sales_order.sdmcreated_last_name = data['sdmcreated_last_name']
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order)
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def sales_order_smd_view_aa(request):
    try: 
        sales_orders = SalesOrder.objects.filter(
            sdm_approved=False, 
            is_mobile_approved=True, 
            sdm_returned=False, 
            sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']
        )
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    


@api_view(['GET'])
def sales_order_smd_view_upc(request):
    try: 
        excluded_routes = ['AdissAbabaMarket', 'AdissAbabaMarket2']
        sales_orders = SalesOrder.objects.filter(
            sdm_approved=False, 
            is_mobile_approved=True, 
            sdm_returned=False
        ).exclude(sales_Route__in=excluded_routes)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['GET'])
def sdm_approve_retrieve_view_by_id(request, pk):
    try:
        sales_order = SalesOrder.objects.get(pk=pk, sdm_approved=True)
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    
@api_view(['GET'])
def sdm_approve_retrieve_all(request):
    try:
        sales_orders = SalesOrder.objects.filter(sdm_approved=True, finance_returned=False)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    



    

@api_view(['GET'])
def finance_approve_retrieve_all(request):
    try: 
        sales_order = SalesOrder.objects.filter(sdm_approved=True, finance_returned=True)
        serialzer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serialzer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def finance_approve_retrieve_all(request):
    try: 
        sales_order = SalesOrder.objects.filter(finance_approved=True)
        serialzer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serialzer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)



@api_view(['GET'])
def sales_order_finance_view(request):
    try: 
        sales_orders = SalesOrder.objects.filter(finance_approved=False, sdm_approved=True)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

from django.db import IntegrityError
@api_view(['PUT'])
def finance_approve_create_view(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)        

        # Check if the provided CSI_CRSI_Number already exists
        csi_crsi_number = data['CSI_CRSI_NUMBER']
        existing_order = SalesOrder.objects.filter(CSI_CRSI_Number=csi_crsi_number).exclude(_id=pk).first()
        if existing_order:
            return Response({"error": "CSI_CRSI_Number must be unique."}, status=status.HTTP_400_BAD_REQUEST)

        sales_order.CSI_CRSI_Number = csi_crsi_number
        sales_order.financecreated_first_name = data['financecreated_first_name']
        sales_order.financecreated_last_name = data['financecreated_last_name']
        sales_order.financecreated_at = datetime.now()  
        sales_order.finance_approved = True
        sales_order.finance_returned = False 
        
        # Deduct Total_CASH from LedgerDeposit Balance
        customer = sales_order.customers_name
        ledger_deposit = LedgerDeposit.objects.filter(customers_name=customer).last()
        ledger_deposit.Balance -= int(sales_order.Total_CASH)
        ledger_deposit.save()
        
        sales_order.save()  # Save the sales order
        
        serializer = SalesOrderSerializer(sales_order)
        return Response(serializer.data)
    except IntegrityError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET'])
def finance_approve_retrieve_view_by_id(request, pk):
    try:
        sales_order = SalesOrder.objects.get(pk=pk, finance_approved=True)
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def finance_approve_retrieve_all(request):
    try: 
        sales_order = SalesOrder.objects.filter(finance_approved=True)
        serialzer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serialzer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def sales_order_finance_manager_view(request):
    try: 
        sales_orders = SalesOrder.objects.filter(finance_approved=True, finance_manager_approved = False, sdm_approved=True,  finance_returned=False)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['GET'])
def finance_manager_approve_retrieve_by_id(request, pk):
    try:
        sales_order = SalesOrder.objects.get(pk=pk, finance_manager_approved=True)
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404) 
    
 

@api_view(['PUT'])
def finance_manager_approve_create_view(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.finance_manager_approved = True
        sales_order.financemanagercreated_at = datetime.now()
        sales_order.financemanagercreated_first_name = data['financemanagercreated_first_name']
        sales_order.financemanagercreated_last_name = data['financemanagercreated_last_name']
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def access_logistic_aadd_view(request):
    SalesORDER = SalesOrder.objects.filter(finance_approved=True, is_loaded=False)
    serializer = SalesOrderSerializer(SalesORDER, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
def create_logisitc_aadd_view(request, pk):
    try:
        data = request.data
        smd = SalesOrder.objects.get(_id=pk)
        smd.Inventory = data["inventory"]
        smd.plate_no = data["plate_no"]
        smd.Driver = data["Driver"]
        smd.logisitcmanagercreated_first_name = data["logisitcmanagercreated_first_name"]
        smd.logisitcmanagercreated_last_name = data["logisitcmanagercreated_last_name"]
        smd.logisitcmanagercreated_at = datetime.now()
        smd.is_loaded=True
        smd.save()
        serializer  = SalesOrderSerializer(smd, context={'request': request})
        return Response(serializer.data)
    except SalesOrderSerializer.DoesNotExist:
        return Response(statue=404)
        


@api_view(['GET'])
def finance_manager_approve_retrieve_all(request):
    try: 
        sales_order = SalesOrder.objects.filter(finance_approved=True, inventory_check=False, is_loaded=True)
        serializer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist: 
        return Response(status=404) 

@api_view(['GET'])
def finance_manager_retrieve_aa(request):
    try:
        sales_order = SalesOrder.objects.filter(finance_approved=True, inventory_check=False, is_loaded=True,sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2'])
        serializer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def finance_manager_retrieve_upc(request):
    try:
        excluded_routes = ['AdissAbabaMarket',  'AdissAbabaMarket2']
        sales_order = SalesOrder.objects.filter(finance_approved=True, inventory_check=False, is_loaded=True).exclude(sales_Route__in=excluded_routes)
        serializer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404) 



@api_view(['PUT'])
def finance_inventory_create(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.inventory_ddo = data['inventory_ddo']
        sales_order.inventory_recipant = data['inventory_recipant']
        sales_order.inventory_check = True
        sales_order.is_deliverd = True
        sales_order.inventorycreated_at = datetime.now()
        sales_order.inventorycreated_first_name = data["inventorycreated_first_name"]
        sales_order.inventorycreated_last_name = data["inventorycreated_last_name"]
        sales_order.save()
        serializer = SalesOrderSerializer(sales_order)
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404) 
    
from datetime import datetime

@api_view(['PUT'])
def finance_inventory_create_AdissAbaba(request, pk):
    data = request.data
    try:
        # Get the SalesOrder object by its primary key
        sales_order = SalesOrder.objects.get(_id=pk)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'SalesOrder not found'}, status=404)

    # Update the sales_order with the inventory details from the request
    sales_order.inventory_recipant = data['inventory_recipant']
    sales_order.inventory_file = data['inventory_ddo']
    sales_order.inventory_check = True
    sales_order.inventorycreated_at = timezone.now()
    sales_order.inventorycreated_first_name = data["inventorycreated_first_name"]
    sales_order.inventorycreated_last_name = data["inventorycreated_last_name"]
    # Fetch the warehouse stock for AdissAbaba
    try:
        raw_material_request = WarehouseStock.objects.get(warehouse='AdissAbaba')
    except WarehouseStock.DoesNotExist:
        return Response({'error': 'RawMaterialRequest for AdissAbaba not found'}, status=404)

    # Deduct the values from raw_material_request based on the sales order
    raw_material_request.FG_Standardized_035ml -= sales_order.Qp
    raw_material_request.FG_Standardized_06ml -= sales_order.Hp
    raw_material_request.FG_Standardized_1L -= sales_order.ONEp
    raw_material_request.FG_Standardized_2l -= sales_order.TWOp
    # Assuming you want to deduct Totalp from another field
    # raw_material_request.FG_Standardized_Total -= sales_order.Totalp  # Uncomment if necessary

    # Save the updated raw material request and sales order
    raw_material_request.save()
    sales_order.save()

    # Serialize and return the updated sales order
    serializer = SalesOrderSerializer(sales_order)
    return Response(serializer.data)

   
    


@api_view(['PUT'])
def finance_inventory_create_Agena(request, pk):
    data = request.data
    try:
        # Get the SalesOrder object by its primary key
        sales_order = SalesOrder.objects.get(_id=pk)
    except SalesOrder.DoesNotExist:
        return Response({'error': 'SalesOrder not found'}, status=404)
    
    # Update the sales_order with the inventory details from the request
    sales_order.inventory_recipant = data['inventory_recipant']
    sales_order.inventory_file = data['inventory_ddo']
    sales_order.inventory_check = True
    sales_order.inventorycreated_at = datetime.now()
    sales_order.inventorycreated_first_name = data['inventorycreated_first_name']
    sales_order.inventorycreated_last_name = data['inventorycreated_last_name']
   
    # Fetch the warehouse stock for Agena
    try:
        raw_material_request = WarehouseStock.objects.get(warehouse='Agena')
    except WarehouseStock.DoesNotExist:
        return Response({'error': 'RawMaterialRequest for Agena not found'}, status=404)

    # Deduct the values from raw_material_request based on the sales order
    raw_material_request.FG_Standardized_035ml -= sales_order.Qp
    raw_material_request.FG_Standardized_06ml -= sales_order.Hp
    raw_material_request.FG_Standardized_1L -= sales_order.ONEp
    raw_material_request.FG_Standardized_2l -= sales_order.TWOp
    # Assuming you want to deduct Totalp from another field
    # raw_material_request.FG_Standardized_Total -= sales_order.Totalp  # Uncomment if necessary
    
    # Save the updated raw material request and sales order
    raw_material_request.save()
    sales_order.save()

    # Serialize and return the updated sales order
    serializer = SalesOrderSerializer(sales_order)
    return Response(serializer.data)



 
@api_view(['GET'])
def finance_inventory_access(request):
    finance = SalesOrder.objects.filter(inventory_check=True,)
    serialzier = SalesOrderSerializer(finance, many=True, context={'request': request})
    return Response(serialzier.data)

