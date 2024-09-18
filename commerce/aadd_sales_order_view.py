import calendar
from django.utils import timezone
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from dateutil.parser import parse 
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
def create_AADDSales_Order(request, salesperson_pk, plate_pk):
    salesperson = SalesPerson.objects.get(_id=salesperson_pk)
    plate = Plate.objects.get(_id=plate_pk)
    data = request.data
    payment = request.FILES.get('payment')
    # Check if the salesperson is already in check
    if salesperson.is_state:
        return Response("User has already been checked", status=status.HTTP_400_BAD_REQUEST)

    else:
        sales_order = AADDSalesOrder.objects.create(
            SalesPerson=salesperson, 
            Plate_number=plate,
            sales_Route=data['Route'],
            Qp=data['Qp'],
            Hp=data['Hp'],
            ONEp=data['ONEp'],
            TWOp=data['TWOp'],
            Totalp=data['Totalp'],
            Q_CASH=data['Q_CASH'],
            H_CASH=data['H_CASH'],
            ONE_CASH=data['ONE_CASH'],
            TWO_CASH=data['TWO_CASH'],
            Total_CASH=data['Total_CASH'],
            TransportationFee = data['TransportationFee'],
            payment=payment,       
        )
    # Update the is_state field of SalesPerson to True
    salesperson.is_state = True
    salesperson.save()
    serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
    return Response(serializer.data)

@api_view(['PUT'])
def smd_approve_AADD(request, pk):
    try:
        smd = AADDSalesOrder.objects.get(_id=pk)
        smd.smd_approved = True  # Update smd_approved field
        smd.save()
        serializer = AADDSalesOrderSerializer(smd, context={'request': request})
        data = serializer.data
        data['smd_approved'] = True  # Manually update the smd_approved field
        return Response(data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)



@api_view(['POST'])
def sdm_approve_aadd_reject_view(request, pk):
    try:
        sales_order = AADDSalesOrder.objects.get(_id=pk)
        data = request.data 
        sales_order.sdm_returned_issue = data['sdm_returned_issue']
        sales_order.sdm_returned = True
        sales_order.smd_approved = False 
        sales_order.save()
        serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)
    


@api_view(['GET'])
def smd_approve_view_AADD(request):
    try:
        smd = AADDSalesOrder.objects.filter(smd_approved=False, sdm_returned=False)
        serializer = AADDSalesOrderSerializer(smd, many=True, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def fm_approve_view_AADD(request):
    try:
        smd = AADDSalesOrder.objects.filter(smd_approved=True, finance_manager_approved=False)
        serializer = AADDSalesOrderSerializer(smd, many=True, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['PUT'])
def fm_approve_AADD(request, pk):
    try:
        fm = AADDSalesOrder.objects.get(_id=pk)
        fm.finance_manager_approved = True  # Update smd_approved field
        fm.save()
        serializer = AADDSalesOrderSerializer(fm, context={'request': request})
        data = serializer.data
        data['finance_manager_approved'] = True  # Manually update the smd_approved field
        return Response(data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['GET'])
def aadd_finance_manager_invenroty_retrieve_all(request):
    try: 
        sales_order = AADDSalesOrder.objects.filter(inventory_check=False, finance_manager_approved=True)
        serializer = AADDSalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist: 
        return Response(status=404) 
    

@api_view(['PUT'])
def AADD_finance_inventory_create(request, pk):
    """
    Updates the AADDSalesOrder with inventory details and deducts from WarehouseStock.
    """
    try:
        # Retrieve the AADDSalesOrder by its primary key
        sales_order = AADDSalesOrder.objects.get(_id=pk)
        
        # Get data from the request
        data = request.data
        sales_order.inventory_recipant = data.get('inventory_recipant', sales_order.inventory_recipant)
        sales_order.inventory_ddo = data.get('inventory_ddo', sales_order.inventory_ddo)
        sales_order.inventory_check = True  # Mark the inventory check as done

        # Fetch the warehouse stock for 'AdissAbaba'
        try:
            raw_material_request = WarehouseStock.objects.get(warehouse='AdissAbaba')
        except WarehouseStock.DoesNotExist:
            return Response({'error': 'Warehouse stock for AdissAbaba not found'}, status=404)

        # Deduct values from the raw material request based on the sales order quantities
        if sales_order.Qp is not None:
            raw_material_request.FG_Standardized_035ml -= sales_order.Qp
        if sales_order.Hp is not None:
            raw_material_request.FG_Standardized_06ml -= sales_order.Hp
        if sales_order.ONEp is not None:
            raw_material_request.FG_Standardized_1L -= sales_order.ONEp
        if sales_order.TWOp is not None:
            raw_material_request.FG_Standardized_2l -= sales_order.TWOp

        # Check for negative stock values and handle appropriately
        if (raw_material_request.FG_Standardized_035ml < 0 or
            raw_material_request.FG_Standardized_06ml < 0 or
            raw_material_request.FG_Standardized_1L < 0 or
            raw_material_request.FG_Standardized_2l < 0):
            print('error Insufficient stock in warehouse')
            return Response({'error': 'Insufficient stock in warehouse'}, status=400)

        # Save the updated raw material request and sales order
        raw_material_request.save()
        sales_order.save()

        # Serialize and return the updated sales order
        serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    
    except AADDSalesOrder.DoesNotExist:
        return Response({'error': 'AADDSalesOrder not found'}, status=404)
    except KeyError as e:
        return Response({'error': f'Missing field: {str(e)}'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


@api_view(['GET'])
def access_inventory_form(request):
    return_list = AADDSalesOrder.objects.filter(inventory_check = True , finance_manager_approved=True, is_return=False, SalesPerson__is_state=True)
    serializer = AADDSalesOrderSerializer(return_list, many=True, context={'request': request})
    return Response(serializer.data) 

@api_view(['POST'])
def create_inventory_return(request, pk):
    """
    Creates an inventory return record and adds the returned quantities back to the warehouse stock.
    """
    try:
        # Retrieve the AADDSalesOrder by its primary key
        order = AADDSalesOrder.objects.get(_id=pk)
        data = request.data
        
        # Create the InventoryReturnForm record
        sales = InventoryReturnForm.objects.create(
            sales=order, 
            Qp=int(data['Qpp']),  # Convert to integer
            Hp=int(data['Hpp']),  # Convert to integer
            ONEp=int(data['ONEpp']),  # Convert to integer
            TWOp=int(data['TWOpp']),  # Convert to integer
            Totalp=int(data['Totalpp']),  # Convert to integer
            recipient=data['recipient'],
            RCSNO=data['RCSNO'],
        )
        
        # Fetch the WarehouseStock for 'AdissAbaba'
        try:
            warehouse_stock = WarehouseStock.objects.get(warehouse='AdissAbaba')
        except WarehouseStock.DoesNotExist:
            return Response({'error': 'Warehouse stock for AdissAbaba not found'}, status=404)

        # Add the returned values back to the warehouse stock
        warehouse_stock.FG_Standardized_035ml += sales.Qp
        warehouse_stock.FG_Standardized_06ml += sales.Hp
        warehouse_stock.FG_Standardized_1L += sales.ONEp
        warehouse_stock.FG_Standardized_2l += sales.TWOp
        #warehouse_stock.FG_Standardized_Total += sales.Totalp

        # Save the updated warehouse stock and mark the order as returned
        warehouse_stock.save()
        order.is_return = True
        order.save()

        # Serialize and return the created InventoryReturnForm record
        serializer = InventoryReturnFormSerializer(sales, context={'request': request})
        return Response(serializer.data)

    except AADDSalesOrder.DoesNotExist:
        return Response({'error': 'AADDSalesOrder not found'}, status=404)
    except KeyError as e:
        return Response({'error': f'Missing field: {str(e)}'}, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

    
@api_view(['POST'])
def undo_inventory_returns(request, pk):
    try:
        inventory_return = InventoryReturnForm.objects.get(_id=pk)
        # Reverse the actions performed in create_inventory_return
        sales_order = inventory_return.sales
        sales_order.is_return = False
        sales_order.save()
        
        # Delete the InventoryReturnForm
        inventory_return.delete()
        
        return Response({"message": "Inventory return undone successfully"})
    except InventoryReturnForm.DoesNotExist:
        return Response(status=404)



@api_view(['PUT'])
def update_inventory_return(request, pk):
    try:
        data = request.data 
        return_form = InventoryReturnForm.objects.get(_id=pk) 
        if 'Bank_Reference_Number' in data and return_form.Bank_reference_Number:
            return Response('Bank reference already exists.', status=status.HTTP_400_BAD_REQUEST)
        else:
            return_form.CSI_CSRI_Number = data['CSI_CSRI_Number']
            return_form.Bank_Name = data['Bank_Name']
            return_form.Amount = data['Amount']
            return_form.Discount_Amount = data['Discount_Amount']
            return_form.Bank_reference_Number = data['Bank_Reference_Number']
            return_form.issues = data.get('issues', '') 
            return_form.is_pending = bool(data.get('is_pending', False))
            return_form.is_clear = bool(data.get('is_clear', False))
            return_form.is_Discount = bool(data.get('is_Discount', False))
            return_form.payment = request.FILES.get('payment')
        # Convert Deposit_Date to the correct format


            

            deposit_date_str = data['Deposit_Date']
            deposit_date_str_no_timezone = deposit_date_str.split(' (')[0]
            
            # Parse date without timezone
           
            deposit_date = parse(deposit_date_str_no_timezone)
            return_form.Deposit_Date = deposit_date.date().isoformat()

            return_form.sold_Qp = return_form.return_Qp
            return_form.sold_Hp = return_form.return_Hp
            return_form.sold_ONEp = return_form.return_ONEp
            return_form.sold_TWOp = return_form.return_TWOp
            return_form.sold_Totalp = return_form.return_Totalp
            return_form.sold_H_CASH = return_form.return_H_CASH
            return_form.sold_Q_CASH = return_form.return_Q_CASH
            return_form.sold_ONE_CASH = return_form.return_ONE_CASH
            return_form.sold_TWO_CASH = return_form.return_TWO_CASH
            return_form.sold_Total_CASH = return_form.return_Total_CASH
            return_form.is_return_finance = True  # Set is_return_finance to True
            return_form.save()
        

            sales_person = return_form.sales.SalesPerson
            sales_person.is_cleared = True
            sales_person.save()  # Save the changes to the SalesPerson
            serializer = InventoryReturnFormSerializer(return_form, context={'request': request})
            return Response(serializer.data)
    
    except InventoryReturnForm.DoesNotExist:
        return Response(status=404)



@api_view(['PUT'])
def undo_inventory_return(request, pk):
    try:
        return_form = InventoryReturnForm.objects.get(_id=pk)
        data = request.data
        return_form.issues = data.get('issues', '')
        return_form.CSI_CSRI_Number = ''  # Assign an empty string instead of None
        return_form.Bank_Name = None
        return_form.Amount = None
        return_form.Bank_reference_Number = None
        return_form.is_pending = False
        return_form.is_clear = False
        return_form.payment = None
        return_form.Deposit_Date = None
        return_form.sold_Qp = None
        return_form.sold_Hp = None
        return_form.sold_ONEp = None
        return_form.sold_TWOp = None
        return_form.sold_Totalp = None
        return_form.sold_H_CASH = None
        return_form.sold_Q_CASH = None
        return_form.sold_ONE_CASH = None
        return_form.sold_TWO_CASH = None
        return_form.sold_Total_CASH = None
        return_form.is_return_finance = False
        return_form.is_financed_approve  = False
        return_form.save()

        sales_person = return_form.sales.SalesPerson
        sales_person.is_cleared = False
        sales_person.save()

        serializer = InventoryReturnFormSerializer(return_form, context={'request': request})
        return Response(serializer.data)
    
    except InventoryReturnForm.DoesNotExist:
        return Response(status=404)
    




@api_view(['GET']) #
def aadd_finance_inventory_retrieve_all(request):
    try:
        sales_order_finished = AADDSalesOrder.objects.filter(inventory_check=True, is_financed_approve = False)
        inventory_return_finished = InventoryReturnForm.objects.filter(is_clear=True,is_financed_approve=False )
        
        sales_order_finished_ids = set(sales_order_finished.values_list('_id', flat=True))
        inventory_return_finished_ids = set(inventory_return_finished.values_list('sales_id', flat=True))  # Assuming 'sales_id' refers to the related AADDSalesOrder's _id
        
        common_ids = sales_order_finished_ids.intersection(inventory_return_finished_ids)
        
        sales_order_to_return = sales_order_finished.filter(_id__in=common_ids)
        inventory_return_to_return = inventory_return_finished.filter(sales_id__in=common_ids)
        
        serializer_sales_order = AADDSalesOrderSerializer(sales_order_to_return, many=True, context={'request': request})
        serializer_inventory_return = InventoryReturnFormSerializer(inventory_return_to_return, many=True, context={'request': request})
        
        return Response({
            'sales_orders': serializer_sales_order.data,
            'inventory_return_forms': serializer_inventory_return.data
        })
    except (AADDSalesOrder.DoesNotExist, InventoryReturnForm.DoesNotExist):
        return Response(status=404)

@api_view(['PUT'])
def update_aadd_finance_inventory_retrieve_all(request, pk):
        return_form = AADDSalesOrder.objects.get(_id=pk)    
        return_form.is_financed_approve = True        
        return_form.save()
        salesperson = return_form.SalesPerson
        if salesperson:
            salesperson.is_state = False
            salesperson.save()
            serializer = AADDSalesOrderSerializer(return_form, context={'request': request})
            return Response(serializer.data)
   

@api_view(['PUT'])
def AADD_finance_inventory_return(request, pk):
    try:
        data = request.data
        sales_order = InventoryReturnForm.objects.get(_id=pk)
        sales_order.inventory_file = data['issue']
        sales_order.is_clear = False      
        sales_order.save()
        serializer = InventoryReturnFormSerializer(sales_order, context={'request': request})
        return Response(serializer.data)
    except InventoryReturnForm.DoesNotExist:
        return Response(status=404)
    
    
@api_view(['GET'])
def clear_inventory_return(request):
    return_list = AADDSalesOrder.objects.filter(is_return=True,is_financed_approve = True)
    inventory_return_list = InventoryReturnForm.objects.filter(is_clear=False, is_financed_approve = True)    
    serializer = AADDSalesOrderSerializer(return_list, many=True, context={'request': request})
    inventory_return_serializer = InventoryReturnFormSerializer(inventory_return_list, many=True, context={'request': request})
    
    return Response({
         'sales_orders': serializer.data,
        'inventory_return_forms': inventory_return_serializer.data
    })






@api_view(['PUT'])
def Update_AADDSales_Order(request,pk):
    data = request.data 
    sales_order = AADDSalesOrder.objects.get(_id=pk)
    sales_order.Qp=data['Qp']
    sales_order.Hp=data['Hp']
    sales_order.ONEp=data['ONEp']
    sales_order.TWOp=data['TWOp']
    sales_order.Totalp=data['Totalp']
    sales_order.Q_CASH=data['Q_CASH']
    sales_order.H_CASH=data['H_CASH']
    sales_order.ONE_CASH=data['ONE_CASH']
    sales_order.TWO_CASH=data['TWO_CASH']
    sales_order.Total_CASH=data['Total_CASH']
    sales_order.payment=request.FILES.get('payment')
   
    sales_order.sdm_returned = False
    sales_order.save()
    serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
    return Response(serializer.data) 


@api_view(['GET'])
def ALL_AADS(request):
    sales_order = AADDSalesOrder.objects.all()
    serializer = AADDSalesOrderSerializer(sales_order,many=True,  context={'request': request})
    return Response(serializer.data)




@api_view(['POST'])
def Reload_AADDSales_Order(request, pk):
    data = request.data
    sales_order = AADDSalesOrder.objects.get(_id=pk)
    sales = AADSalesOrderReload.objects.create(
    order = sales_order,
    Qp = data['Qpp'],
    Hp = data['Hpp'],
    ONEp = data['ONEpp'],
    TWOp = data['TWOpp'],
    Totalp =data['Totalpp'],
    Q_CASH =data['Q_Total'],
    H_CASH =data['H_Total'],
    ONE_CASH =data['ONE_Total'],
    TWO_CASH = data['TWO_Total'],
    Total_CASH =data['Total_CASH'],
    )
    serializer =  AADSalesOrderReloadSerializer(sales, context={'request': request})
    return Response(serializer.data)

import logging
logger = logging.getLogger(__name__)

@api_view(['PUT'])
def Update_Reload_AADDSales_Order(request, pk):
    data = request.data
    try:
        # Get the AADDSalesOrder by primary key
        sales_order = AADDSalesOrder.objects.get(_id=pk)

        # Create or update AADSalesOrderReload instance
        reload_order, created = AADSalesOrderReload.objects.get_or_create(order=sales_order)
        reload_order.reload_recipient = data.get('reload_recipient', reload_order.reload_recipient)
        reload_order.inventory_ddo = data.get('reload_ddo', reload_order.inventory_ddo)
        reload_order.Qp = int(data.get('Qp', reload_order.Qp))
        reload_order.Hp = int(data.get('Hp', reload_order.Hp))
        reload_order.ONEp = int(data.get('ONEp', reload_order.ONEp))
        reload_order.TWOp = int(data.get('TWOp', reload_order.TWOp))
        reload_order.Totalp = int(data.get('Totalp', reload_order.Totalp))
        reload_order.Q_CASH = int(data.get('Q_CASH', reload_order.Q_CASH))
        reload_order.H_CASH = int(data.get('H_CASH', reload_order.H_CASH))
        reload_order.ONE_CASH = int(data.get('ONE_CASH', reload_order.ONE_CASH))
        reload_order.TWO_CASH = int(data.get('TWO_CASH', reload_order.TWO_CASH))
        reload_order.Total_CASH = int(data.get('Total_CASH', reload_order.Total_CASH))
        reload_order.save()

        # Fetch the warehouse stock
        try:
            warehouse_stock = WarehouseStock.objects.get(warehouse='AdissAbaba')
        except WarehouseStock.DoesNotExist:
            logger.error('Warehouse stock for AdissAbaba not found')
            return Response({'error': 'Warehouse stock for AdissAbaba not found'}, status=404)

        # Check if there's enough stock before deducting
        if (warehouse_stock.FG_Standardized_035ml < reload_order.Qp or
            warehouse_stock.FG_Standardized_06ml < reload_order.Hp or
            warehouse_stock.FG_Standardized_1L < reload_order.ONEp or
            warehouse_stock.FG_Standardized_2l < reload_order.TWOp):
            logger.error('Insufficient stock in warehouse')
            return Response({'error': 'Insufficient stock in warehouse'}, status=400)

        # Deduct from WarehouseStock based on reload_order quantities
        warehouse_stock.FG_Standardized_035ml -= reload_order.Qp
        warehouse_stock.FG_Standardized_06ml -= reload_order.Hp
        warehouse_stock.FG_Standardized_1L -= reload_order.ONEp
        warehouse_stock.FG_Standardized_2l -= reload_order.TWOp
        warehouse_stock.save()

        # Update the sales_order with the reloaded values
        sales_order.Qp += reload_order.Qp
        sales_order.Hp += reload_order.Hp
        sales_order.ONEp += reload_order.ONEp
        sales_order.TWOp += reload_order.TWOp
        sales_order.Totalp += reload_order.Totalp
        sales_order.Q_CASH += reload_order.Q_CASH
        sales_order.H_CASH += reload_order.H_CASH
        sales_order.ONE_CASH += reload_order.ONE_CASH
        sales_order.TWO_CASH += reload_order.TWO_CASH
        sales_order.Total_CASH += reload_order.Total_CASH
        sales_order.inventory_check = True
        
        # Save the updated sales order
        sales_order.save(update_fields=[
            'Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp',
            'Q_CASH', 'H_CASH', 'ONE_CASH', 'TWO_CASH', 'Total_CASH', 'inventory_check'
        ])

        # Serialize and return the updated reload order
        serializer = AADSalesOrderReloadSerializer(reload_order, context={'request': request})
        return Response(serializer.data)

    except AADDSalesOrder.DoesNotExist:
        logger.error('AADDSalesOrder not found')
        return Response({'error': 'AADDSalesOrder not found'}, status=404)
    except KeyError as e:
        logger.error(f'Missing field: {str(e)}')
        return Response({'error': f'Missing field: {str(e)}'}, status=400)
    except Exception as e:
        logger.error(f'Unexpected error: {str(e)}')
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def access_aadd(request):
    smd = AADDSalesOrder.objects.all()
    serializer =AADDSalesOrderSerializer(smd, many=True, context={'request': request})
    return Response(serializer.data)


    


@api_view(['GET'])
def retrieve_reject_aadd_sdm_view(request):
    sales_orders = AADDSalesOrder.objects.filter(sdm_returned=True, smd_approved=False)
    serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
    return Response(serializer.data)






@api_view(['GET'])
def finance_inventory_form(request):
    inventory_return_list = InventoryReturnForm.objects.filter(sales__finance_manager_approved=True, is_clear=False)
    inventory_return_serializer = InventoryReturnFormSerializer(inventory_return_list, many=True, context={'request': request})
    
    return Response({
        'inventory_return_forms': inventory_return_serializer.data
    })


    



       

@api_view(['GET'])
def finance_inventory_form_approve(request):
    return_list = AADDSalesOrder.objects.filter(finance_manager_approved=True)
    inventory_return_list = InventoryReturnForm.objects.exclude(is_clear=False)    
    serializer = AADDSalesOrderSerializer(return_list, many=True, context={'request': request})
    inventory_return_serializer = InventoryReturnFormSerializer(inventory_return_list, many=True, context={'request': request})
    
    return Response({
        'inventory_return_forms': inventory_return_serializer.data
    })



    


@api_view(['GET'])
def pending_inventory_return(request):
    pending = InventoryReturnForm.objects.filter(is_pending=True, is_clear=False)
    serializer = InventoryReturnFormSerializer(pending, many=True, context={'request': request})
    return Response(serializer.data)







@api_view(['PUT'])
def update_AADDSales_Order(request, salesorder_pk):
    try:
        sales_order = AADDSalesOrder.objects.get(pk=salesorder_pk)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    data = request.data 
    payment = request.FILES.get('payment')

    sales_order.sales_Route = data['Route']
    sales_order.Qp = data['Qp']
    sales_order.Hp = data['Hp']
    sales_order.ONEp = data['ONEp']
    sales_order.TWOp = data['TWOp']
    sales_order.Totalp = data['Totalp']
    sales_order.Q_CASH = data['Q_CASH']
    sales_order.H_CASH = data['H_CASH']
    sales_order.ONE_CASH = data['ONE_CASH']
    sales_order.TWO_CASH = data['TWO_CASH']
    sales_order.Total_CASH = data['Total_CASH']
    sales_order.TransportationFee = data['TransportationFee']

    if payment:
        sales_order.payment = payment

    sales_order.save()

    serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
    return Response(serializer.data)



import re
@api_view(['PUT'])
def update_pending_inventory_return(request, pk):
    try:
        data = request.data 
        return_form = InventoryReturnForm.objects.get(_id=pk) 
        return_form.ledger_CSI_CRSI_Number = data['ledger_CSI_CSRI_Number']
        return_form.ledger_Bank_Name = data['ledger_Bank_Name']
        return_form.ledger_Amount = data['ledger_Amount']
        return_form.ledger_Bank_reference_Number = data['ledger_Bank_Reference_Number']
        return_form.ledger_payment = data['ledger_payment']
        # Convert Deposit_Date to the correct format

        # Convert Deposit_Date to the correct format
        deposit_date_str = data['Deposit_Date']
        
        # Extract date and time components using regular expression
        match = re.search(r'(\w{3}) (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):(\d{2})', deposit_date_str)
        day = int(match.group(3))
        month = datetime.strptime(match.group(2), '%b').month
        year = int(match.group(4))
        hour = int(match.group(5))
        minute = int(match.group(6))
        second = int(match.group(7))
        
        deposit_date = datetime(year, month, day, hour, minute, second)
        deposit_date = deposit_date + timedelta(hours=3)  # Adjust for East Africa Time
        
        return_form.ledger_Deposit_Date = deposit_date.date().isoformat()
        return_form.is_clear = True  # Set is_return_finance to True
        return_form.save()
        
        serializer = InventoryReturnFormSerializer(return_form, context={'request': request})
        return Response(serializer.data)
    
    except InventoryReturnForm.DoesNotExist:
        return Response(status=404)
    





    

    