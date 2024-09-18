import calendar
from django.forms import CharField
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
    WarehouseStock,
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
    AgentSalesPerfomanceMeasure,
    RawMaterialRequest
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
    RawMaterialRequestSerializer,
    AgentSalesPerfomanceMeasureSerializer,
    TransactionSerializer
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

     # Check if there's an existing sales order with finance_manager_approved=False

    ledger_balance = int(data['ledgerBalance'])
    total_cash = int(data['Total_CASH'])
   
    if ledger_balance < total_cash:
        print(ledger_balance)
        print(total_cash)
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
    
@api_view(['POST'])
def create_ledger_deposit(request, pk):
    try:
        customer = WebCustomer.objects.get(_id=pk)
    except WebCustomer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data 
    payment = request.FILES.get('payment')
    
    deposit_date_string = data['Deposit_Date'].split('(')[0].strip()  
    deposit_date = datetime.strptime(deposit_date_string, '%a %b %d %Y %H:%M:%S GMT%z').strftime('%Y-%m-%d')

    try:
        preexisting_ledger_entry = LedgerDeposit.objects.filter(customers_name=customer).last()
        if preexisting_ledger_entry and not preexisting_ledger_entry.finance_approved :
            return Response({'error': 'Existing ledger deposit exists for the customer but is not approved.'}, status=status.HTTP_400_BAD_REQUEST)
        preexisting_balance = preexisting_ledger_entry.Balance if preexisting_ledger_entry else 0
        customer_id = preexisting_ledger_entry.customers_name_id if preexisting_ledger_entry else None
    except LedgerDeposit.DoesNotExist:
        preexisting_balance = 0
        customer_id = None

    if 'Bank_Reference_Number' in data and LedgerDeposit.objects.filter(Bank_Reference_Number=data['Bank_Reference_Number']).exists():
        return Response({'error': 'Bank reference number already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    ledger = LedgerDeposit.objects.create(
        customers_name=customer, 
        Bank_Name=data['Bank_Name'],
        Deposit_Amount=data['Deposit_Amount'],
        Narrative=data['Narrative'],
        Branch_Name=data['Branch_Name'],
        Bank_Reference_Number=data['Bank_Reference_Number'],
        Deposit_Date=deposit_date,
        payment=payment,
        Balance=preexisting_balance
    )

    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)



from django.core.files.uploadedfile import SimpleUploadedFile
from json import loads

@api_view(['POST'])
def mobile_create_ledger_deposit(request, pk):
    customer = WebCustomer.objects.get(_id=pk) 
    
    data = loads(request.POST['data'])
    mobile_payment_file = request.FILES.get('file', None)

    
    # Remove the additional information from the date string
    deposit_date_string = data['Deposit_Date'].split('(')[0].strip()  
    deposit_date = datetime.strptime(deposit_date_string, '%m/%d/%Y').strftime('%Y-%m-%d')


    # Rest of the code remains the same...
  
    # Check if the Bank_Reference_Number already exists
    if LedgerDeposit.objects.filter(Bank_Reference_Number=data['Bank_Reference_Number']).exists():
        return Response({'error': 'Bank reference number already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the preexisting ledger balance registered under the customer
    preexisting_balance = LedgerDeposit.objects.filter(customers_name=customer).aggregate(Sum('Deposit_Amount'))
    balance = preexisting_balance['Deposit_Amount__sum'] if preexisting_balance['Deposit_Amount__sum'] else 0
    
    ledger = LedgerDeposit.objects.create(
        customers_name=customer, 
      
        Bank_Name=data['Bank_Name'],
        Deposit_Amount=data['Deposit_Amount'],
        Narrative=data['Narrative'],
        Branch_Name=data['Branch_Name'],
        Bank_Reference_Number=data['Bank_Reference_Number'],
        Deposit_Date=deposit_date,
        Balance=balance,  # Assign the preexisting ledger balance to the Balance field
        is_mobile=True, 
        supervisor_created_at = datetime.now()
    )

    if mobile_payment_file:
        ledger.mobile_payment = SimpleUploadedFile(mobile_payment_file.name, mobile_payment_file.read())
        ledger.save()
    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def update_ledger_deposit(request, pk):
    try:
        ledger = LedgerDeposit.objects.get(_id=pk)
    except LedgerDeposit.DoesNotExist:
        return Response({'error': 'Ledger deposit not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    data = request.data
    payment = request.FILES.get('payment')
    
    deposit_date_string = data['Deposit_Date']
    if deposit_date_string != 'null':
        deposit_date = datetime.strptime(deposit_date_string.split('(')[0].strip(), '%a %b %d %Y %H:%M:%S GMT%z').strftime('%Y-%m-%d')
    else:
        deposit_date = None
    
    # Check if the Bank_Reference_Number already exists (excluding the current ledger deposit)
    existing_ledger_deposits = LedgerDeposit.objects.exclude(_id=pk)
    if existing_ledger_deposits.filter(Bank_Reference_Number=data['Bank_Reference_Number']).exists():
        return Response({'error': 'Bank reference number already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Retrieve the preexisting ledger balance registered under the customer
    preexisting_balance = LedgerDeposit.objects.filter(customers_name=ledger.customers_name).aggregate(Sum('Deposit_Amount'))
    balance = preexisting_balance['Deposit_Amount__sum'] if preexisting_balance['Deposit_Amount__sum'] else 0
    
    # Update the ledger deposit with the new data
    ledger.customers_name = ledger.customers_name
    ledger.Bank_Name = data['Bank_Name']
    
    # Validate that the Deposit_Amount is not empty
    if data['Deposit_Amount']:
        ledger.Deposit_Amount = data['Deposit_Amount']
    else:
        return Response({'error': 'Deposit amount is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    ledger.Narrative = data['Narrative']
    ledger.Branch_Name = data['Branch_Name']
    ledger.Bank_Reference_Number = data['Bank_Reference_Number']
    ledger.Deposit_Date = deposit_date
    ledger.payment = payment
    ledger.Balance = balance  # Assign the preexisting
    ledger.finance_approved = False 
    ledger.finance_returned = False
    ledger.save()
    
    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def retireve_finance_ledger_view(request):
    ledger = LedgerDeposit.objects.filter(finance_approved=False, is_mobile=False, finance_returned=False)
    serializer = LedgerDepositSerialzier(ledger, many=True, context={'request':request})
    return Response(serializer.data)


@api_view(['POST'])  # Ensure the view allows POST requests
def ledger_deposit_approve_view(request):
    ledger = LedgerDeposit.objects.filter(finance_approved=False, is_mobile=False, finance_returned=False)
    serializer = LedgerDepositSerialzier(ledger, many=True, context={'request':request})
    return Response(serializer.data)


from django.db.models.signals import post_save
from django.dispatch import receiver
import requests


# Function to construct notification payload from a LedgerDeposit instance
def construct_notification_payload(ledger_deposit_instance):
    serializer = LedgerDepositSerialzier(ledger_deposit_instance, context={'request': None})
    return serializer.data

# Function to send notification via API
def send_notification_via_api(ledger_deposit_instance):
    # Construct notification payload using the created LedgerDeposit instance
    notification_payload = construct_notification_payload(ledger_deposit_instance)

    # Make an API call to send the notification
    # Replace 'YOUR_NOTIFICATION_API_ENDPOINT' with the actual endpoint URL
    api_endpoint = 'http://192.168.100.16:8000/commerce/'

    try:
        response = requests.post(api_endpoint, json=notification_payload)
        if response.status_code == 200:
            print("Notification sent successfully via API!")
        else:
            print("Failed to send notification via API.")
            # Handle the failure scenario if needed
    except requests.RequestException as e:
        print("Error sending notification via API:", e)
        # Handle exceptions or errors in sending the notification

# Signal to trigger the notification function on LedgerDeposit creation
@receiver(post_save, sender=LedgerDeposit)
def send_notification_on_ledger_creation(sender, instance, created, **kwargs):
    if created:
        send_notification_via_api(instance)

@api_view(['GET'])
def retireve_mobile_finance_ledger_view(request):
    ledger = LedgerDeposit.objects.filter(finance_approved=False, is_mobile=True, finance_returned=False)
    serializer = LedgerDepositSerialzier(ledger, many=True, context={'request':request})
    return Response(serializer.data)


@api_view(['GET'])
def returned_mobile_finance_ledger_view(request):
    ledger = LedgerDeposit.objects.filter(finance_approved=False, is_mobile=True, finance_returned=True)
    serializer = LedgerDepositSerialzier(ledger, many=True, context={'request':request})
    return Response(serializer.data)

@api_view(['PUT'])
def approve_ledger_request(request, pk):
    ledger = LedgerDeposit.objects.get(_id=pk)
    customer = ledger.customers_name
    latest_ledger = LedgerDeposit.objects.filter(customers_name=customer).order_by('-created_at').first()
    ledger.finance_approved = True
    ledger.finance_returned = False
    ledger.Balance += int(latest_ledger.Deposit_Amount)  # Add the deposit amount to the ledger balance
    ledger.save()
    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
def reject_ledger_request(request, pk):
    ledger = LedgerDeposit.objects.get(_id=pk)
    ledger.finance_approved = False 
    ledger.finance_returned = True 
    ledger.save()
    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def retireve_finance_ledger_rejected_view(request):
    ledger = LedgerDeposit.objects.filter(finance_approved=False, finance_returned=True)
    serializer = LedgerDepositSerialzier(ledger, many=True, context={'request':request})
    return Response(serializer.data)

@api_view(['GET'])
def retrieve_customer_ledger_balance(request, customer_id):
    try:
        customer = WebCustomer.objects.get(_id=customer_id, is_approved=True)
        latest_ledger_entry = LedgerDeposit.objects.filter(customers_name=customer).order_by('created_at').last()
        if latest_ledger_entry:
            serializer = LedgerDepositSerialzier(latest_ledger_entry, context={'request': request})
            return Response(serializer.data)
        else:
            return Response({'error': 'No ledger entries found for the customer'}, status=status.HTTP_404_NOT_FOUND)
    except WebCustomer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def retrieve_all_customers_ledger_balances(request):
    customers = WebCustomer.objects.filter(is_approved=True)
    ledger_balances = []
    for customer in customers:
        ledger = LedgerDeposit.objects.filter(customers_name=customer).last()
        if ledger:
            serializer = LedgerDepositSerialzier(ledger, context={'request': request})
            ledger_balances.append(serializer.data)
        # Skip customers without a ledger balance
        elif not ledger:
            continue
    return Response(ledger_balances)
    
@api_view(['GET'])
def retrieve_customer_ledger_history(request, customer_id):
    try:
        customer = WebCustomer.objects.get(_id=customer_id, is_approved=True)
        ledger_deposits = LedgerDeposit.objects.filter(customers_name=customer, finance_approved=True)
        sales_orders = SalesOrder.objects.filter(customers_name=customer)

        # Combine the ledger deposits and sales orders into a single array
        combined_data = list(ledger_deposits) + list(sales_orders)

        # Sort the combined_data by created_at timestamp
        combined_data.sort(key=lambda x: x.created_at, reverse=True)

        # Serialize the combined_data using CombinedDataSerializer
        serializer = CombinedDataSerializer(combined_data, many=True)

        # Return the serialized data
        return Response(serializer.data)
    except WebCustomer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

    
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
def sales_order_smd_view(request):
    try: 
        sales_orders = SalesOrder.objects.filter(sdm_approved=False, is_mobile_approved=True, sdm_returned=False)
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['GET'])
def sales_order_smd_view_AA(request):
    try: 
        # Filter SalesOrder objects based on the specified conditions
        aa_sales_orders = SalesOrder.objects.filter(
            sdm_approved=False,
            is_mobile_approved=True,
            sdm_returned=False,
            sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']
        )
        # Serialize the filtered SalesOrder objects
        serializer = SalesOrderSerializer(aa_sales_orders, many=True, context={'request': request})
        # Return the serialized data
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    

@api_view(['GET'])
def sales_order_smd_view_UPC(request):
    try: 
        # Filter SalesOrder objects based on the specified condition
        upc_sales_orders = SalesOrder.objects.filter(
            sdm_approved=False,
            is_mobile_approved=True,
            sdm_returned=False,
            sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket','Area8' ]
        )
        # Serialize the filtered SalesOrder objects
        serializer = SalesOrderSerializer(upc_sales_orders, many=True, context={'request': request})
        # Return the serialized data
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
        ledger_deposit.Balance -= int(sales_order.Grand_Total_CASH)
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
def aadd_finance_inventory_retrieve_all(request):
    try: 
        sales_order = AADDSalesOrder.objects.filter(inventory_check=True)
        serializer = AADDSalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist: 
        return Response(status=404) 


 

@api_view(['GET'])
def finance_manager_approve_retrieve_all(request):
    try: 
        sales_order = SalesOrder.objects.filter(finance_approved=True, inventory_check=False, is_loaded=True)
        serializer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist: 
        return Response(status=404) 
    
@api_view(['GET'])
def finance_manager_approve_retrieve_by_inventory(request, pk):
    try:
        # Assuming 'finance_approved', 'inventory_check', 'is_loaded' are fields in your SalesOrder model
        sales_order = SalesOrder.objects.filter(sales_Route=pk, finance_approved=True, inventory_check=False, is_loaded=True)        
        serializer = SalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

from django.db.models import Q
from django.db.models import Q

@api_view(['GET'])
def get_latest_raw(request):
    raw_material_request = RawMaterialRequest.objects.filter(recipant_store='AdissAbaba',is_FG_Standardized=True).order_by('-created_at').first()
    serializer = RawMaterialRequestSerializer(raw_material_request)  # Use RawMaterialRequestSerializer
    return Response(serializer.data)

@api_view(['PUT'])
def finance_inventory_create_AdissAbaba(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.inventory_recipant = data['inventory_recipant']
        sales_order.inventory_file = data['inventory_ddo']
        sales_order.inventory_check = True
        sales_order.inventorycreated_at = datetime.now()
        sales_order.inventorycreated_first_name = data["inventorycreated_first_name"]
        sales_order.inventorycreated_last_name = data["inventorycreated_last_name"]
        raw_material_request = RawMaterialRequest.objects.filter(recipant_store='AdissAbaba', is_FG_Standardized=True).order_by('-created_at').first()
        if raw_material_request is not None:
            raw_material_serializer = RawMaterialRequestSerializer(raw_material_request)
            print('raw', raw_material_serializer.data)
        else:
            print('No RawMaterialRequest found for the specified recipant_store')

        if raw_material_request is not None:
            # Deduct values from RawMaterialRequest
            raw_material_request.FG_Standardized_035ml -= sales_order.Qp
            raw_material_request.FG_Standardized_06ml -= sales_order.Hp
            raw_material_request.FG_Standardized_1L -= sales_order.ONEp
            raw_material_request.FG_Standardized_2l -= sales_order.TWOp
            raw_material_request.FG_Standardized_Total -= sales_order.Totalp
            raw_material_request.save()
            sales_order.save()
            # Serialize and return updated SalesOrder
            serializer = SalesOrderSerializer(sales_order)
            return Response(serializer.data)
        else:
            print('RawMaterialRequest not found for the specified recipant_store and supplier')
            return Response({'error': 'RawMaterialRequest not found for the specified recipant_store and supplier'}, status=404)
        
    except SalesOrder.DoesNotExist:
        return Response({'error': 'SalesOrder not found'}, status=404)
    


@api_view(['PUT'])
def finance_inventory_create_Agena(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.inventory_recipant = data['inventory_recipant']
        sales_order.inventory_file = data['inventory_ddo']
        sales_order.inventory_check = True
        sales_order.inventorycreated_at = datetime.now()
        sales_order.inventorycreated_first_name = data["inventorycreated_first_name"]
        sales_order.inventorycreated_last_name = data["inventorycreated_last_name"]
        sales = sales_order.Inventory
        raw_material_request = RawMaterialRequest.objects.filter(recipant_store='Agena').order_by('-created_at').first()
        print(raw_material_request)     
                # Check if RawMaterialRequest is found
        if raw_material_request is not None:
            # Deduct values from RawMaterialRequest
            raw_material_request.FG_Standardized_035ml -= sales_order.Qp
            raw_material_request.FG_Standardized_06ml -= sales_order.Hp
            raw_material_request.FG_Standardized_1L -= sales_order.ONEp
            raw_material_request.FG_Standardized_2l -= sales_order.TWOp
            raw_material_request.FG_Standardized_Total -= sales_order.Totalp
            raw_material_request.save()
            sales_order.save()
            # Serialize and return updated SalesOrder
            serializer = SalesOrderSerializer(sales_order)
            return Response(serializer.data)
        else:
            print('RawMaterialRequest not found for the specified recipant_store and supplier')
            return Response({'error': 'RawMaterialRequest not found for the specified recipant_store and supplier'}, status=404)
        
    except SalesOrder.DoesNotExist:
        return Response({'error': 'SalesOrder not found'}, status=404)




@api_view(['PUT'])
def finance_inventory_create_Wolkete(request, pk):
    try:
        data = request.data
        sales_order = SalesOrder.objects.get(_id=pk)
        sales_order.inventory_recipant = data['inventory_recipant']
        sales_order.inventory_file = data['inventory_ddo']
        sales_order.inventory_check = True
        sales_order.inventorycreated_at = datetime.now()
        sales_order.inventorycreated_first_name = data["inventorycreated_first_name"]
        sales_order.inventorycreated_last_name = data["inventorycreated_last_name"]
        raw_material_request = RawMaterialRequest.objects.filter(recipant_store='Wolkete').order_by('-created_at').first()
        print(raw_material_request)     
                # Check if RawMaterialRequest is found
        if raw_material_request is not None:
            # Deduct values from RawMaterialRequest
            raw_material_request.FG_Standardized_035ml -= sales_order.Qp
            raw_material_request.FG_Standardized_06ml -= sales_order.Hp
            raw_material_request.FG_Standardized_1L -= sales_order.ONEp
            raw_material_request.FG_Standardized_2l -= sales_order.TWOp
            raw_material_request.FG_Standardized_Total -= sales_order.Totalp
            raw_material_request.save()
            sales_order.save()
            # Serialize and return updated SalesOrder
            serializer = SalesOrderSerializer(sales_order)
            return Response(serializer.data)
        else:
            print('RawMaterialRequest not found for the specified recipant_store and supplier')
            return Response({'error': 'RawMaterialRequest not found for the specified recipant_store and supplier'}, status=404)
        
    except SalesOrder.DoesNotExist:
        return Response({'error': 'SalesOrder not found'}, status=404)



    
@api_view(['POST'])
def create_sales_person(request):
    serializer = SalesPersonSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
def sales_person_approve_view(request):  
    try: 
        sales_person = SalesPerson.objects.filter(is_approved=False)
        serializer = SalesPersonSerializer(sales_person, many=True , context={'request': request})
        return Response(serializer.data)
    except SalesPerson.DoesNotExist:
        return Response(status=404)
    

@api_view(['PUT'])
def approve_sales_person(request, pk):
    try: 
        sales_person = SalesPerson.objects.get(_id=pk)
        sales_person.is_approved = True 
        sales_person.save()
        serializer = SalesPersonSerializer(sales_person, context={'request': request})
        return Response(serializer.data)
    except SalesPerson.DoesNotExist:
        return Response(status=404)
    
@api_view(['GET'])
def retrieve_sales_person_all(request):
    salesperson = SalesPerson.objects.filter(is_approved=True)
    serializer = SalesPersonSerializer(salesperson, many=True, context={'request': request})
    return Response(serializer.data) 


@api_view(['GET'])
def retrieve_sales_person_id(request, pk):
    data  = request.data 
    salesPerson = SalesPerson.objects.get(_id=pk)
    serializer = SalesPersonSerializer(salesPerson, many=False, context={'request': request})
    return Response(serializer.data)






@api_view(['POST'])
def create_plate(request):
    serializer = PlateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['GET'])
def plates_approve_view(request):
    try: 
        plates = Plate.objects.filter(is_approved=False)
        serializer = PlateSerializer(plates, many=True, context={'request': request})
        return Response(serializer.data)
    except Plate.DoesNotExist:
        return Response(status=404)
    

@api_view(['PUT'])
def approve_plate(request, pk):
    try:
        plate = Plate.objects.get(_id=pk)
        plate.is_approved = True  # Set is_approved to True
        plate.save()
        serializer = PlateSerializer(plate, context={'request': request})
        return Response(serializer.data)
    except Plate.DoesNotExist:  # Corrected to catch Plate.DoesNotExist
        return Response(status=404)
    

@api_view(['GET'])
def retrieve_plate_all(request):
    plate = Plate.objects.all()
    serializer = PlateSerializer(plate, many=True, context={'request': request})
    return Response(serializer.data) 


@api_view(['GET'])
def retrieve_plate_id(request, pk):
    plate = Plate.objects.get(_id=pk)
    serializer = PlateSerializer(plate, many=False, context={'request': request})
    return Response(serializer.data) 






'''
class SetPriceCreateUpdateView(APIView):
    def post(self, request):
        sales_route = request.data.get('sales_Route')
        transportation_fee = request.data.get('TransportationFee')
        q = request.data.get('Q')
        h = request.data.get('H')
        one = request.data.get('ONE')
        two = request.data.get('TWO')
        
        try:
            set_price = SetPrice.objects.get(sales_Route=sales_route)
            set_price.TransportationFee = transportation_fee
            set_price.Q = q
            set_price.H = h
            set_price.ONE = one
            set_price.TWO = two
            set_price.save()
        except SetPrice.DoesNotExist:
            set_price = SetPrice(sales_Route=sales_route, TransportationFee=transportation_fee, Q=q, H=h, ONE=one, TWO=two)
            set_price.save()
        
        serializer = SetPriceSerializer(set_price)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
'''

'''
class SetPriceCreateUpdateView(APIView):
    def post(self, request):
        sales_route = request.data.get('sales_Route')
        transportation_fee = request.data.get('TransportationFee')
        q = request.data.get('Q')
        h = request.data.get('H')
        one = request.data.get('ONE')
        two = request.data.get('TWO')
        
        try:
            set_prices = SetPrice.objects.filter(sales_Route=sales_route).order_by('-created_at')
            if set_prices.exists():
                set_price = set_prices.first()
                set_price.pk = None  # Create a new instance with the same data
            else:
                set_price = SetPrice(sales_Route=sales_route)
            
            set_price.TransportationFee = transportation_fee
            set_price.Q = q
            set_price.H = h
            set_price.ONE = one
            set_price.TWO = two
            set_price.created_at = timezone.now()  # Set the current timestamp
            
            set_price.save()
        except SetPrice.DoesNotExist:
            set_price = SetPrice(sales_Route=sales_route, TransportationFee=transportation_fee, Q=q, H=h, ONE=one, TWO=two)
            set_price.save()
        
        serializer = SetPriceSerializer(set_price)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
'''

class SetPriceCreateUpdateView(APIView):
    def post(self, request):
        sales_route = request.data.get('sales_Route')
        warehouse = request.data.get('warehouse')
        transportation_fee = request.data.get('TransportationFee')
        q = request.data.get('Q')
        h = request.data.get('H')
        one = request.data.get('ONE')
        two = request.data.get('TWO')

        try:
            set_prices = SetPrice.objects.filter(sales_Route=sales_route, warehouse=warehouse).order_by('-created_at')
            if set_prices.exists():
                set_price = set_prices.first()
                set_price.pk = None  # Create a new instance with the same data
            else:
                set_price = SetPrice(sales_Route=sales_route, warehouse=warehouse)

            set_price.TransportationFee = transportation_fee
            set_price.Q = q
            set_price.H = h
            set_price.ONE = one
            set_price.TWO = two
            set_price.created_at = timezone.now()  # Set the current timestamp

            set_price.save()
        except SetPrice.DoesNotExist:
            set_price = SetPrice(
                sales_Route=sales_route,
                warehouse=warehouse,
                TransportationFee=transportation_fee,
                Q=q,
                H=h,
                ONE=one,
                TWO=two
            )
            set_price.save()

        serializer = SetPriceSerializer(set_price)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_latest_price(request, sales_Route=None, warehouse=None):
    if sales_Route and warehouse:
        set_price = SetPrice.objects.filter(sales_Route=sales_Route, warehouse=warehouse).order_by('-created_at').first()
    elif warehouse:
        set_price = SetPrice.objects.filter(warehouse=warehouse).order_by('-created_at').first()
    elif sales_Route:
        set_price = SetPrice.objects.filter(sales_Route=sales_Route).order_by('-created_at').first()
    else:
        return Response({'message': 'Please provide sales_Route or warehouse'}, status=400)

    if set_price:
        serializer = SetPriceSerializer(set_price)
        return Response(serializer.data)
    else:
        # Create a dictionary with zero values for each field
        zero_price = {
            'Q': 0,
            'H': 0,
            'ONE': 0,
            'TWO': 0
            # Add other fields and set their values to zero if needed
        }
        return Response(zero_price)

    
@api_view(['GET'])
def access_price_route(request, route_pk):
    salesRoute = SetPrice.objects.filter(sales_Route=route_pk).order_by('-created_at').first()
    serializer = SetPriceSerializer(salesRoute, context={'request': request})
    return Response(serializer.data)

#all price sorted by time
@api_view(['GET'])
def all_access_price_route(request, route_pk):
    salesRoute = SetPrice.objects.filter(sales_Route=route_pk).order_by('-created_at')
    serializer = SetPriceSerializer(salesRoute, many=True, context={'request': request})
    return Response(serializer.data)

#the latest price for each route with takeing the reoute parameters
@api_view(['GET'])
def access_latest_price(request):
    # Get the latest prices for each route and inventory combination using a subquery
    salesRoutes = SetPrice.objects.filter(
        created_at=Subquery(
            SetPrice.objects.filter(
                sales_Route=OuterRef('sales_Route'),
                warehouse=OuterRef('warehouse'),  # Assuming warehouse represents the inventory combination
            ).order_by('-created_at').values('created_at')[:1]
        )
    )

    serializer = SetPriceSerializer(salesRoutes, many=True, context={'request': request})
    return Response(serializer.data)
    
class SetPriceDetailView(APIView):
    def get(self, request, sales_route):
        try:
            set_price = SetPrice.objects.get(sales_Route=sales_route)
            serializer = SetPriceSerializer(set_price, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SetPrice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
   
@api_view(['GET'])
def retrieve_price_all(request):
    prices = SetPrice.objects.all()
    serializer = SetPriceSerializer(prices, many=True, context={'request': request})
    return Response(serializer.data)













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


@api_view(['GET'])
def aadd_finance_manager_invenroty_retrieve_warehouse(request, pk):
    try: 
        sales_order = AADDSalesOrder.objects.filter(inventory_check=False, finance_manager_approved=True)
        serializer = AADDSalesOrderSerializer(sales_order, many=True, context={'request': request})
        return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist: 
        return Response(status=404) 
    

@api_view(['PUT'])
def AADD_finance_inventory_create(request, pk):
    try:
        data = request.data
        sales_order = AADDSalesOrder.objects.get(_id=pk)
        sales_order.inventory_recipant = data['inventory_recipant']
        sales_order.inventory_ddo = data['inventory_ddo']
        sales_order.inventory_check = True   
        sales_order.save()
        raw_material_request = RawMaterialRequest.objects.filter(recipant_store='AdissAbaba').order_by('-created_at').first()
        if raw_material_request is not None:
            # Deduct values from RawMaterialRequest
        #    raw_material_request.FG_Standardized_035ml -= sales_order.Qp
        #    raw_material_request.FG_Standardized_06ml -= sales_order.Hp
        #    raw_material_request.FG_Standardized_1L -= sales_order.ONEp
        #    raw_material_request.FG_Standardized_2l -= sales_order.TWOp
        #    raw_material_request.FG_Standardized_Total -= sales_order.Totalp
        #    raw_material_request.save()
            sales_order.save()
            # Serialize and return updated SalesOrder
            serializer = AADDSalesOrderSerializer(sales_order, context={'request': request})
            return Response(serializer.data)
        else:
            print('RawMaterialRequest not found for the specified recipant_store and supplier')
            return Response({'error': 'RawMaterialRequest not found for the specified recipant_store and supplier'}, status=404) 
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def access_inventory_form(request):
    return_list = AADDSalesOrder.objects.filter(inventory_check = True , finance_manager_approved=True, is_return=False, SalesPerson__is_state=True)
    serializer = AADDSalesOrderSerializer(return_list, many=True, context={'request': request})
    return Response(serializer.data) 

@api_view(['POST'])
def create_inventory_return(request, pk):
    try:
        order = AADDSalesOrder.objects.get(_id=pk)
        data = request.data 
        sales = InventoryReturnForm.objects.create(
            sales=order, 
            Qp=data['Qpp'],
            Hp=data['Hpp'],
            ONEp=data['ONEpp'],
            TWOp=data['TWOpp'],
            Totalp=data['Totalpp'],
            recipient=data['recipient'],
            RCSNO=data['RCSNO'],
        )
        total_qpp = int(data['Qpp']) + int(data['Hpp']) + int(data['ONEpp']) + int(data['TWOpp'])
        raw_material_request = RawMaterialRequest.objects.filter(recipant_store='AdissAbaba', is_FG_Standardized=True).order_by('-created_at').first()
        if raw_material_request is not None:
            raw_material_serializer = RawMaterialRequestSerializer(raw_material_request)
            print('raw', raw_material_serializer.data)
        else:
            print('No RawMaterialRequest found for the specified recipant_store')

        if raw_material_request is not None:
            raw_material_request.FG_Standardized_035ml += int(data['Qpp'])
            raw_material_request.FG_Standardized_06ml += int(data['Hpp'])
            raw_material_request.FG_Standardized_1L += int(data['Qpp'])
            raw_material_request.FG_Standardized_2l += int(data['TWOpp'])
            raw_material_request.FG_Standardized_Total += total_qpp
            raw_material_request.save()
        # Update is_return field to True
            order.is_return = True
            order.save()
            serializer = InventoryReturnFormSerializer(sales, context={'request': request})
            return Response(serializer.data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)
    
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


 
@api_view(['GET'])
def finance_inventory_access(request):
    finance = SalesOrder.objects.filter(inventory_check=True,)
    serialzier = SalesOrderSerializer(finance, many=True, context={'request': request})
    return Response(serialzier.data)


@api_view(['POST'])
def create_customer_debit_form(request, inventory_id, customer_id):
    customer = WebCustomer.objects.get(_id=customer_id)
    inventory = InventoryReturnForm.objects.get(_id=inventory_id)
    data = request.data
    debit = CustomerDebitForm.objects.create(
        customer=customer,
        Inventory=inventory,
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
        issues=data['issues'],
        # Convert Deposit_Date to the correct format
        due_date=parser.isoparse(data['due_date']).date().strftime('%Y-%m-%d')
    )
   
    serializer = CustomerDebitFormSerializer(debit, context={'request': request})
    return Response(serializer.data)

from dateutil import parser as date_parser






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
            return_form.Bank_reference_Number = data['Bank_Reference_Number']
            return_form.issues = data.get('issues', '') 
            return_form.is_pending = bool(data.get('is_pending', False))
            return_form.is_clear = bool(data.get('is_clear', False))
            return_form.payment = request.FILES.get('payment')
        # Convert Deposit_Date to the correct format


            deposit_date_str = data['Deposit_Date']
            deposit_date_str = deposit_date_str.replace(" (East Africa Time)", "")
            deposit_date = datetime.strptime(deposit_date_str, '%a %b %d %Y %H:%M:%S GMT%z')
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
@api_view(['GET'])
def finance_customer_debt(request):
    customer = WebCustomer.objects.filter(is_credit=True, is_approved=True)
    serializer = WebCustomerSerializer(customer, many=True, context={'request': request})
    return Response(serializer.data)


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

@api_view(['PUT'])
def Update_Reload_AADDSales_Order(request, pk):
    data = request.data
    sales_order = AADDSalesOrder.objects.get(_id=pk)
    
    # Create or update AADSalesOrderReload instance
    reload_order, created = AADSalesOrderReload.objects.get_or_create(order=sales_order)
    reload_order.reload_recipient = data['reload_recipient']
    reload_order.inventory_ddo = data['reload_ddo']
    reload_order.save()
    # Update AADDSalesOrder fields
        # Update AADDSalesOrder fields
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
    sales_order.save(update_fields=['Qp', 'Hp', 'ONEp', 'TWOp', 'Totalp', 'Q_CASH', 'H_CASH', 'ONE_CASH', 'TWO_CASH', 'Total_CASH', 'inventory_check'])
    
    serializer = AADSalesOrderReloadSerializer(reload_order, context={'request': request})
    return Response(serializer.data)

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

@api_view(['GET'])
def get_state_salesPerson(request):
    sales = SalesPerson.objects.filter(is_state=True)
    serializer = SalesPersonSerializer(sales, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_inventory_return(request):
    return_form = InventoryReturnForm.objects.all()
    serializer = InventoryReturnFormSerializer(return_form, many=True, context={'request': request})
    return Response(serializer.data)




from dateutil import parser
from datetime import datetime
 
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
    




    
@api_view(['GET'])
def retrieve_sales_order_by_Daily(request):
    try:
        # Calculate the start and end time for the last 24 hours starting from 7 AM
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the last 24 hours
        sales_orders = SalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_by_daily_filter_by_customer(request, customer_id):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the current month and filtered by customer
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id
        ).all()
        
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }     
        return Response(response_data)   
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def retrieve_sales_order_by_daily_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the current month and filtered by SalesRoute
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }       
        return Response(response_data)    
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_by_daily_filter(request, customer_id, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        
        # Retrieve sales orders created within the current month and filtered by customer and sales route
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id,
            sales_Route=sales_route
        ).all()
        
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        
        return Response(response_data)
    
    except SalesOrder.DoesNotExist:
        return Response(status=404)      



@api_view(['GET'])
def retrieve_Direct_sales_order_by_Daily(request):
    try:
        # Calculate the start and end time for the last 24 hours starting from 7 AM
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the last 24 hours
        sales_orders = AADDSalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
        
@api_view(['GET'])
def retrieve_Direct_sales_order_by_daily_filter_by_salesPerson(request, sales_person_id):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the current month and filtered by customer
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            SalesPerson_id=sales_person_id
        ).all()
        
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_person_id': sales_person_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }     
        return Response(response_data)   
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_Direct_sales_order_by_daily_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        # Retrieve sales orders created within the current month and filtered by SalesRoute
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }       
        return Response(response_data)    
    except SalesOrder.DoesNotExist:
        return Response(status=404)
        


from datetime import datetime, timedelta


from dateutil import relativedelta
@api_view(['GET'])
def retrieve_sales_order_by_Monthly(request):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        
        # Retrieve sales orders created within the current month
        sales_orders = SalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }
        
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)







@api_view(['GET'])
def retrieve_sales_order_by_Monthly_filter_by_customer(request, customer_id):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        # Retrieve sales orders created within the current month and filtered by customer
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id
        ).all()

        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})

        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_by_Monthly_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        # Retrieve sales orders created within the current month and filtered by SalesRoute
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_Direct_sales_order_by_Monthly(request):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        # Retrieve sales orders created within the current month
        sales_orders = AADDSalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_Direct_sales_order_by_monthly_filter_by_salesPerson(request, sales_person_id):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        # Retrieve sales orders created within the current month and filtered by sales person
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            SalesPerson_id=sales_person_id
        ).all()

        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})

        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_person_id': sales_person_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_Direct_sales_order_by_monthly_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, 1)
        end_time = start_time + relativedelta.relativedelta(months=1)
        # Retrieve sales orders created within the current month and filtered by SalesRoute
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
@api_view(['GET'])

def retrieve_sales_order_by_Annual(request):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year
        sales_orders = SalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_by_Annual_filter_by_customer(request, customer_id):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year and filtered by customer
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id
        ).all()

        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})

        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_sales_order_by_Annual_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year and filtered by SalesRoute
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)




@api_view(['GET'])
def retrieve_Direct_sales_order_by_Annual(request):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year
        sales_orders = AADDSalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def retrieve_Direct_sales_order_by_Annual_filter_by_salesPerson(request, sales_person_id):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year and filtered by sales person
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            SalesPerson_id=sales_person_id
        ).all()

        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})

        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_person_id': sales_person_id,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_Direct_sales_order_by_Annual_filter_by_sales_route(request, sales_route):
    try:
        # Calculate the start and end time for the current year
        now = datetime.now()
        start_time = datetime(now.year, 1, 1, 0, 0, 0)
        end_time = datetime(now.year + 1, 1, 1, 0, 0, 0)
        # Retrieve sales orders created within the current year and filtered by SalesRoute
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)



    



@api_view(['GET'])
def retrieve_sales_order_by_TimeBreakDown_filter(request, customer_id, sales_route):
    try:
        # Calculate the start and end time for the current month
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        
        # Retrieve sales orders created within the current month and filtered by customer and sales route
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id,
            sales_Route=sales_route
        ).all()
        
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'sales_route': sales_route,
            'start_time': start_time,
            'end_time': end_time,
            'sales_orders': serializer.data
        }
        
        return Response(response_data)
    
    except SalesOrder.DoesNotExist:
        return Response(status=404)      



@api_view(['GET'])
def retrieve_sales_order_by_custom_date(request, start_date, end_date):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + relativedelta.relativedelta(days=1)  # Add one day to include the end date
        
        # Retrieve sales orders created within the specified time frame
        sales_orders = SalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }
        
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def retrieve_sales_order_by_custom_date_filter_by_customer(request,customer_id, start_date, end_date ):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + relativedelta.relativedelta(days=1)  # Add one day to include the end date
        
        # Retrieve sales orders created within the specified time frame and filtered by customer
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            customers_name_id=customer_id
        ).all()

        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})

        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'customer_id': customer_id,
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def retrieve_sales_order_by_custom_date_filter_by_sales_route(request,  sales_route, start_date, end_date):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + relativedelta.relativedelta(days=1)  # Add one day to include the end date
        
        # Retrieve sales orders created within the specified time frame and filtered by SalesRoute
        sales_orders = SalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        serializer = SalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except SalesOrder.DoesNotExist:
        return Response(status=404)
    
@api_view(['GET'])
def retrieve_Direct_sales_order_by_TimeBreakDown(request, start_date, end_date):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)  # Add one day to include the end date
        
        # Calculate the start and end time for the specified date range starting from 7 AM
        start_time = datetime(start_time.year, start_time.month, start_time.day, 7, 0, 0)
        end_time = datetime(end_time.year, end_time.month, end_time.day, 7, 0, 0)
        
        # Retrieve sales orders created within the specified date range
        sales_orders = AADDSalesOrder.objects.filter(created_at__gte=start_time, created_at__lt=end_time).all()
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }
        return Response(response_data)
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)
    
@api_view(['GET'])
def retrieve_Direct_sales_order_by_daily_filter_by_salesPerson(request, sales_person_id, start_date, end_date):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)  # Add one day to include the end date
        
        # Calculate the start and end time for the specified date range starting from 7 AM
        start_time = datetime(start_time.year, start_time.month, start_time.day, 7, 0, 0)
        end_time = datetime(end_time.year, end_time.month, end_time.day, 7, 0, 0)
        
        # Retrieve sales orders created within the specified date range and filtered by sales person
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            SalesPerson_id=sales_person_id
        ).all()
        
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_person_id': sales_person_id,
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }     
        return Response(response_data)   
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)


@api_view(['GET'])
def retrieve_TimeBreakDown_sales_order_by_filter_by_sales_route(request, sales_route, start_date, end_date):
    try:
        # Convert start_date and end_date strings to datetime objects
        start_time = datetime.strptime(start_date, "%Y-%m-%d")
        end_time = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)  # Add one day to include the end date
        
        # Calculate the start and end time for the specified date range starting from 7 AM
        start_time = datetime(start_time.year, start_time.month, start_time.day, 7, 0, 0)
        end_time = datetime(end_time.year, end_time.month, end_time.day, 7, 0, 0)
        
        # Retrieve sales orders created within the specified date range and filtered by sales route
        sales_orders = AADDSalesOrder.objects.filter(
            created_at__gte=start_time,
            created_at__lt=end_time,
            sales_Route=sales_route
        ).all()
        
        serializer = AADDSalesOrderSerializer(sales_orders, many=True, context={'request': request})        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'sales_route': sales_route,
            'start_time': start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'sales_orders': serializer.data
        }       
        return Response(response_data)    
    except AADDSalesOrder.DoesNotExist:
        return Response(status=404)



class SalesOrderTotalCashView(APIView):
    def get(self, request):
        total_cash_aad_sales_order = AADDSalesOrder.objects.aggregate(total_cash=Sum('Total_CASH'))['total_cash']
        sales_order = SalesOrder.objects.first()
        
        if sales_order is None:
            return Response({'error': 'No SalesOrder instance found'})
        
        total_cash_sales_order = sales_order.Total_CASH if hasattr(sales_order, 'Total_CASH') else 0
        total_cash_sum = (total_cash_aad_sales_order or 0) + total_cash_sales_order
        
        return Response({'total_cash_sum': total_cash_sum})
        
'''
@api_view(['GET'])
def retrieve_sales_order_by_customer_Daily(request, customer_id, item, cash):
    try:
        # Calculate the start and end time for the last 24 hours starting from 7 AM
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        if now.hour < 7:
            start_time -= timedelta(days=1)
        end_time = start_time + timedelta(days=1)
        
        # Retrieve the customer based on the provided customer_id
        customer = WebCustomer.objects.get(pk=customer_id)
        
        # Filter sales orders based on customer and created_at within the last 24 hours
        sales_orders = SalesOrder.objects.filter(customers_name=customer, created_at__gte=start_time, created_at__lt=end_time)
        
     # Filter sales orders based on the item parameter if provided
        if item:
            if item == 'Qp':
                sales_orders = sales_orders.filter(Qp__gt=0)
            elif item == 'Hp':
                sales_orders = sales_orders.filter(Hp__gt=0)
            elif item == 'ONEp':
                sales_orders = sales_orders.filter(ONEp__gt=0)
            elif item == 'TWOp':
                sales_orders = sales_orders.filter(TWOp__gt=0)
            elif item == 'TotalP':
                sales_orders = sales_orders.filter(TotalP__gt=0)

    # Filter sales orders based on the cash parameter if provided
        if cash:
            if cash == 'Q_CASH':
                sales_orders = sales_orders.filter(Q_CASH__isnull=False)
            elif cash == 'H_CASH':
                sales_orders = sales_orders.filter(H_CASH__isnull=False)
            elif cash == 'ONE_CASH':
                sales_orders = sales_orders.filter(ONE_CASH__isnull=False)
            elif cash == 'TWO_CASH':
                sales_orders = sales_orders.filter(TWO_CASH__isnull=False)
            elif cash == 'Total_CASH':
                sales_orders = sales_orders.filter(Total_CASH__isnull=False)
        
        # Calculate the total sales by item and cash item
        total_sales_by_item = {
            'Qp': sales_orders.aggregate(Sum('Qp'))['Qp__sum'] or 0,
            'Hp': sales_orders.aggregate(Sum('Hp'))['Hp__sum'] or 0,
            'ONEp': sales_orders.aggregate(Sum('ONEp'))['ONEp__sum'] or 0,
            'TWOp': sales_orders.aggregate(Sum('TWOp'))['TWOp__sum'] or 0,
            'Totalp': sales_orders.aggregate(Sum('Totalp'))['Totalp__sum'] or 0,
        }

        total_sales_by_cash = {
            'Q_CASH': sales_orders.aggregate(Sum('Q_CASH'))['Q_CASH__sum'] or 0,
            'H_CASH': sales_orders.aggregate(Sum('H_CASH'))['H_CASH__sum'] or 0,
            'ONE_CASH': sales_orders.aggregate(Sum('ONE_CASH'))['ONE_CASH__sum'] or 0,
            'TWO_CASH': sales_orders.aggregate(Sum('TWO_CASH'))['TWO_CASH__sum'] or 0,
            'Total_CASH': sales_orders.aggregate(Sum('Total_CASH'))['Total_CASH__sum'] or 0,
        }
        
        # Create a dictionary with the response data including the start and end timestamps
        response_data = {
            'start_time': start_time,
            'end_time': end_time,
            'total_sales_by_item': total_sales_by_item,
            'total_sales_by_cash': total_sales_by_cash,
            'sales_orders': SalesOrderSerializer(sales_orders, many=True, context={'request': request}).data
        }
        return Response(response_data)
    except (WebCustomer.DoesNotExist, SalesOrder.DoesNotExist):
        return Response(status=404)
'''

@api_view(['GET'])
def retrieve_sales_order_by_customer_Daily(request, customer_id=None, sales_route=None, qp=None, hp=None, onep=None, twop=None, q_cash=None, h_cash=None, one_cash=None, two_cash=None):
    try:
        # Filter sales orders based on the provided parameters
        sales_orders = SalesOrder.objects.all()
        if customer_id and customer_id != 'all':
            sales_orders = sales_orders.filter(customers_name=customer_id)
        if sales_route and sales_route != 'all':
            sales_orders = sales_orders.filter(sales_Route=sales_route)
        # Calculate the start and end time for the last 24 hours starting from 7 AM
        now = datetime.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        end_time = start_time + timedelta(hours=24)
        # Filter sales orders based on the created_at field within the last 24 hours
        sales_orders = sales_orders.filter(created_at__range=(start_time, end_time))
        # Create a dictionary to store the requested data
        data = {}
        # Add the requested fields to the data dictionary if they are set to true in the URL
        if qp == "true":
            data['qp'] = [order.Qp for order in sales_orders]or [0]
        if q_cash == "true":
            data['q_cash'] = [order.Q_CASH for order in sales_orders]or [0]
        if hp == "true":
            data['hp'] = [order.Hp for order in sales_orders]or [0]
        if h_cash == "true":
            data['h_cash'] = [order.H_CASH for order in sales_orders]or [0]
        if onep == "true":
            data['onep'] = [order.ONEp for order in sales_orders]or [0]
        if one_cash == "true":
            data['one_cash'] = [order.ONE_CASH for order in sales_orders]or [0]
        if twop == "true":
            data['twop'] = [order.TWOp for order in sales_orders]or [0]
        if two_cash == "true":
            data['two_cash'] = [order.TWO_CASH for order in sales_orders]or [0]

        # Add customer_id and sales_route to the data dictionary
        data['customer_id'] = customer_id
        data['sales_route'] = sales_route

        return Response(data)

    except (WebCustomer.DoesNotExist, SalesOrder.DoesNotExist):
        return Response(status=status.HTTP_404_NOT_FOUND)




@api_view(['GET'])
def retrieve_sales_order_by_sales_route(request):
    try:
        # Get all the unique sales routes
        sales_routes = [choice[0] for choice in AreaRoute]
        # Create a dictionary to store the requested data
        data = {}
        # Iterate over each sales route and get the values
        for route in sales_routes:
            sales_route_data = {}
            sales_orders = SalesOrder.objects.filter(sales_Route=route)
            sales_route_data['qp'] = [order.Qp for order in sales_orders] or [0]
            sales_route_data['q_cash'] = [order.Q_CASH for order in sales_orders] or [0]
            sales_route_data['hp'] = [order.Hp for order in sales_orders] or [0]
            sales_route_data['h_cash'] = [order.H_CASH for order in sales_orders] or [0]
            sales_route_data['onep'] = [order.ONEp for order in sales_orders] or [0]
            sales_route_data['one_cash'] = [order.ONE_CASH for order in sales_orders] or [0]
            sales_route_data['twop'] = [order.TWOp for order in sales_orders] or [0]
            sales_route_data['two_cash'] = [order.TWO_CASH for order in sales_orders] or [0]
            # Add the sales route data to the main data dictionary
            data[route] = sales_route_data

        return Response(data)

    except SalesOrder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

from django.db.models import Q, Sum, F, FloatField
from django.db.models.functions import Cast
from django.db.models.expressions import Value
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import SalesOrder, AADDSalesOrder

@api_view(['GET'])
def retrieve_sales_order_all_info(request):
    sales_order_total_cash = SalesOrder.objects.aggregate(total_cash=Sum(Cast(F('Total_CASH'), output_field=FloatField()))).get('total_cash', 0)

    aad_sales_order_total_cash = AADDSalesOrder.objects.aggregate(total_cash=Sum(Cast(F('Total_CASH'), output_field=FloatField()))).get('total_cash', 0)

    sales_order_total_cash = sales_order_total_cash if sales_order_total_cash is not None else 0
    aad_sales_order_total_cash = aad_sales_order_total_cash if aad_sales_order_total_cash is not None else 0

    sales_order_total_sum = sales_order_total_cash + aad_sales_order_total_cash if sales_order_total_cash is not None and aad_sales_order_total_cash is not None else 0


    sales_order_total_cash_percentage = (sales_order_total_cash / sales_order_total_sum) * 100 if sales_order_total_sum else 0
    sales_order_total_cash_percentage = round(sales_order_total_cash_percentage, 2)  # Round up to two decimal places
    sales_order_total_cash_percentage = f"{sales_order_total_cash_percentage}%"

    aad_sales_order_total_cash_percentage = (aad_sales_order_total_cash / sales_order_total_sum) * 100 if sales_order_total_sum else 0
    aad_sales_order_total_cash_percentage = round(aad_sales_order_total_cash_percentage, 2)  # Round up to two decimal places
    aad_sales_order_total_cash_percentage = f"{aad_sales_order_total_cash_percentage}%"


    aags_sales_order_total_cash = SalesOrder.objects.filter(
        Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']) 
    ).aggregate(total_cash=Sum(Cast(F('Total_CASH'), output_field=FloatField()))).get('total_cash', 0)

    upc_sales_order_total_cash = SalesOrder.objects.filter(
        Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8'])
    ).aggregate(total_cash=Sum(Cast(F('Total_CASH'), output_field=FloatField()))).get('total_cash', 0)

    aags_sales_order_rate = (aags_sales_order_total_cash / sales_order_total_cash) * 100 if sales_order_total_cash and aags_sales_order_total_cash else 0
    aags_sales_order_rate = round(aags_sales_order_rate, 2)  # Round up to two decimal places
    aags_sales_order_rate = f"{aags_sales_order_rate}%"

    upc_sales_order_rate = (upc_sales_order_total_cash / sales_order_total_cash) * 100 if sales_order_total_cash and upc_sales_order_total_cash else 0
    upc_sales_order_rate = round(upc_sales_order_rate, 2)  # Round up to two decimal places
    upc_sales_order_rate = f"{upc_sales_order_rate}%"
    
    formatted_sales_order_total_cash = f"{sales_order_total_cash:,}" if sales_order_total_cash is not None else "0"
    formatted_aad_sales_order_total_cash = f"{aad_sales_order_total_cash:,}" if aad_sales_order_total_cash is not None else "0"
    formatted_sales_order_total_sum = f"{sales_order_total_sum:,}" if sales_order_total_sum is not None else "0"
    formatted_aags_sales_order_total_cash = f"{aags_sales_order_total_cash:,}" if aags_sales_order_total_cash is not None else "0"
    formatted_upc_sales_order_total_cash = f"{upc_sales_order_total_cash:,}" if upc_sales_order_total_cash is not None else "0"

    return JsonResponse({
        'sales_order_total_sum': formatted_sales_order_total_sum,
        'sales_order_total_cash': formatted_sales_order_total_cash,
        'sales_order_total_cash_percentage': sales_order_total_cash_percentage,
        'aad_sales_order_total_cash': formatted_aad_sales_order_total_cash,
        'aad_sales_order_total_cash_percentage': aad_sales_order_total_cash_percentage,
        'aags_sales_order_total_cash': formatted_aags_sales_order_total_cash,
        'aags_sales_order_total_rate': aags_sales_order_rate,
        'upc_sales_order_total_cash': formatted_upc_sales_order_total_cash,
        'upc_sales_order_rate': upc_sales_order_rate
    })
 


@api_view(['GET'])
def retrieve_monthly_sales_target_for_customers(request):
    # Define all unique sales routes
    all_routes = [route[0] for route in AreaRoute]

    # Initialize an empty dictionary to store aggregated data for each route
    aggregated_data_by_route = {route: {'WebCustomer': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'},
                                        'SalesPerson': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'}} for route in all_routes}

    # Aggregate sales_target and total_sales for WebCustomer for each sales route
    for route in all_routes:
        # SalesOrder total sales aggregation for WebCustomer
        web_customer_sales_order_aggregate = SalesOrder.objects.filter(sales_Route=route, customers_name__sales_route=route).aggregate(
            total_sales_target=Sum(Cast('customers_name__sales_order__Totalp', IntegerField())),
            total_sales=Sum('Totalp')
        )
        total_web_customer_sales_target = web_customer_sales_order_aggregate.get('total_sales_target', ) or 0
        total_web_customer_sales = web_customer_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for WebCustomer
        percentage_completion_web_customer = 0
        if total_web_customer_sales_target > 0:
            percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

        aggregated_data_by_route[route]['WebCustomer']['sales_target'] = total_web_customer_sales_target
        aggregated_data_by_route[route]['WebCustomer']['total_sales'] = total_web_customer_sales
        aggregated_data_by_route[route]['WebCustomer']['percentage_completion'] = f'{percentage_completion_web_customer}%'

    # Aggregate sales_target and total_sales for SalesPerson for each sales route
    for route in all_routes:
        # AADDSalesOrder total sales aggregation for SalesPerson
        sales_person_sales_order_aggregate = AADDSalesOrder.objects.filter(sales_Route=route, SalesPerson__Route=route).aggregate(
            total_sales_target=Sum(Cast('Totalp', IntegerField())),
            total_sales=Sum('Totalp')
        )
        total_sales_person_sales_target = sales_person_sales_order_aggregate.get('total_sales_target', 0) or 0
        total_sales_person_sales = sales_person_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for SalesPerson
        percentage_completion_sales_person = 0
        if total_sales_person_sales_target > 0:
            percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

        aggregated_data_by_route[route]['SalesPerson']['sales_target'] = total_sales_person_sales_target
        aggregated_data_by_route[route]['SalesPerson']['total_sales'] = total_sales_person_sales
        aggregated_data_by_route[route]['SalesPerson']['percentage_completion'] = f'{percentage_completion_sales_person}%'

    # Calculate sales_target and total_sales for all WebCustomer instances
    web_customer_sales_target_aggregate = WebCustomer.objects.aggregate(
        total_sales_target=Sum(Cast('sales_target', IntegerField())),
        total_sales=Sum('sales_order__Totalp')
    )
    total_web_customer_sales_target = web_customer_sales_target_aggregate.get('total_sales_target', 0) or 0
    total_web_customer_sales = web_customer_sales_target_aggregate.get('total_sales', 0) or 0

    # Calculate percentage completion for WebCustomer
    percentage_completion_web_customer = 0
    if total_web_customer_sales_target > 0:
        percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

    # Calculate sales_target and total_sales for all SalesPerson instances
    sales_person_sales_target_aggregate = SalesPerson.objects.aggregate(
        total_sales_target=Sum(Cast('sales_target', IntegerField())),
        total_sales=Sum('aaddsalesorder__Totalp')
    )
    total_sales_person_sales_target = sales_person_sales_target_aggregate.get('total_sales_target', 0) or 0
    total_sales_person_sales = sales_person_sales_target_aggregate.get('total_sales', 0) or 0

    # Calculate percentage completion for SalesPerson
    percentage_completion_sales_person = 0
    if total_sales_person_sales_target > 0:
        percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

    # Prepare the aggregated data for all instances in a dictionary
    aggregated_data_all_instances = {
        'WebCustomer': {
            'sales_target': total_web_customer_sales_target,
            'total_sales': total_web_customer_sales,
            'percentage_completion': f'{percentage_completion_web_customer}%'
        },
        'SalesPerson': {
            'sales_target': total_sales_person_sales_target,
            'total_sales': total_sales_person_sales,
            'percentage_completion': f'{percentage_completion_sales_person}%'
        }
    }

    # Return JSON response with both aggregated data
    return JsonResponse({'aggregated_data_by_route': aggregated_data_by_route, 'aggregated_data_all_instances': aggregated_data_all_instances})


from django.db.models import Sum, F, FloatField

@api_view(['GET'])
def retrieve_monthly_sales_target_for_customers(request):
    # Define all unique sales routes
    all_routes = [route[0] for route in AreaRoute]

    # Initialize dictionaries to store aggregated data
    aggregated_data_by_route = {route: {'WebCustomer': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'},
                                        'SalesPerson': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'}} for route in all_routes}
    
    for route in all_routes:
        # SalesOrder total sales aggregation for WebCustomer
        web_customer_sales_order_aggregate = SalesOrder.objects.filter(sales_Route=route, customers_name__sales_route=route).annotate(
            numeric_sales_target=Cast('customers_name__sales_target', IntegerField())
        ).aggregate(
            total_sales_target=Sum('numeric_sales_target'),
            total_sales=Sum('Totalp')
        )
        total_web_customer_sales_target = web_customer_sales_order_aggregate.get('total_sales_target', 0) or 0
        total_web_customer_sales = web_customer_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for WebCustomer
        percentage_completion_web_customer = 0
        if total_web_customer_sales_target > 0:
            percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

        aggregated_data_by_route[route]['WebCustomer']['sales_target'] = total_web_customer_sales_target
        aggregated_data_by_route[route]['WebCustomer']['total_sales'] = total_web_customer_sales
        aggregated_data_by_route[route]['WebCustomer']['percentage_completion'] = f'{percentage_completion_web_customer}%'




    for route in all_routes:
        # AADDSalesOrder total sales aggregation for SalesPerson
        sales_person_sales_order_aggregate = AADDSalesOrder.objects.filter(sales_Route=route, SalesPerson__Route=route).annotate(
            numeric_sales_target=Cast('SalesPerson__sales_target', IntegerField())
        ).aggregate(
            total_sales_target=Sum('numeric_sales_target'),
            total_sales=Sum('Totalp')
        )
        total_sales_person_sales_target = sales_person_sales_order_aggregate.get('total_sales_target', 0) or 0
        total_sales_person_sales = sales_person_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for SalesPerson
        percentage_completion_sales_person = 0
        if total_sales_person_sales_target > 0:
            percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

        aggregated_data_by_route[route]['SalesPerson']['sales_target'] = total_sales_person_sales_target
        aggregated_data_by_route[route]['SalesPerson']['total_sales'] = total_sales_person_sales
        aggregated_data_by_route[route]['SalesPerson']['percentage_completion'] = f'{percentage_completion_sales_person}%'

    # Calculate overall sales_target and total_sales for all WebCustomer instances
        overall_web_customer_sales_target = WebCustomer.objects.aggregate(
        total_sales_target=Cast(Sum(Cast('sales_target', IntegerField())), output_field=IntegerField()),
        total_sales=Sum('sales_order__Totalp', output_field=IntegerField())
    )
    total_web_customer_sales_target = overall_web_customer_sales_target.get('total_sales_target', 0) or 0
    total_web_customer_sales = overall_web_customer_sales_target.get('total_sales', 0) or 0

    # Calculate overall percentage completion for WebCustomer
    overall_percentage_completion_web_customer = 0
    if total_web_customer_sales_target > 0:
        overall_percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

    # Calculate overall sales_target and total_sales for all SalesPerson instances
    overall_sales_person_sales_target = SalesPerson.objects.aggregate(
        total_sales_target=Cast(Sum(Cast('sales_target', IntegerField())), output_field=IntegerField()),
        total_sales=Sum('aaddsalesorder__Totalp', output_field=IntegerField())
    )
    total_sales_person_sales_target = overall_sales_person_sales_target.get('total_sales_target', 0) or 0
    total_sales_person_sales = overall_sales_person_sales_target.get('total_sales', 0) or 0

    # Calculate overall percentage completion for SalesPerson
    overall_percentage_completion_sales_person = 0
    if total_sales_person_sales_target > 0:
        overall_percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

    # Prepare aggregated data for all instances in a dictionary
    aggregated_data_all_instances = {
        'WebCustomer': {
            'sales_target': total_web_customer_sales_target,
            'total_sales': total_web_customer_sales,
            'percentage_completion': f'{overall_percentage_completion_web_customer}%'
        },
        'SalesPerson': {
            'sales_target': total_sales_person_sales_target,
            'total_sales': total_sales_person_sales,
            'percentage_completion': f'{overall_percentage_completion_sales_person}%'
        }
    }

    # Return JSON response with both aggregated data
    return JsonResponse({'aggregated_data_by_route': aggregated_data_by_route, 'aggregated_data_all_instances': aggregated_data_all_instances})




@api_view(['GET'])
def retrieve_monthly_sales_target_for_customers_data(request):
    # Define all unique sales routes
    all_routes = [route[0] for route in AreaRoute]

    # Initialize dictionaries to store aggregated data
    aggregated_data_by_route = {route: {'WebCustomer': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'},
                                        'SalesPerson': {'sales_target': 0, 'total_sales': 0, 'percentage_completion': '0%'}} for route in all_routes}
    
    for route in all_routes:
        # SalesOrder total sales aggregation for WebCustomer
        web_customer_sales_order_aggregate = SalesOrder.objects.filter(sales_Route=route, customers_name__sales_route=route).annotate(
            numeric_sales_target=Cast('customers_name__sales_target', IntegerField())
        ).aggregate(
            total_sales_target=Sum('numeric_sales_target'),
            total_sales=Sum('Totalp')
        )
        total_web_customer_sales_target = web_customer_sales_order_aggregate.get('total_sales_target', 0) or 0
        total_web_customer_sales = web_customer_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for WebCustomer
        percentage_completion_web_customer = 0
        if total_web_customer_sales_target > 0:
            percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

        aggregated_data_by_route[route]['WebCustomer']['sales_target'] = total_web_customer_sales_target
        aggregated_data_by_route[route]['WebCustomer']['total_sales'] = total_web_customer_sales




    for route in all_routes:
        # AADDSalesOrder total sales aggregation for SalesPerson
        sales_person_sales_order_aggregate = AADDSalesOrder.objects.filter(sales_Route=route, SalesPerson__Route=route).annotate(
            numeric_sales_target=Cast('SalesPerson__sales_target', IntegerField())
        ).aggregate(
            total_sales_target=Sum('numeric_sales_target'),
            total_sales=Sum('Totalp')
        )
        total_sales_person_sales_target = sales_person_sales_order_aggregate.get('total_sales_target', 0) or 0
        total_sales_person_sales = sales_person_sales_order_aggregate.get('total_sales', 0) or 0

        # Calculate percentage completion for SalesPerson
        percentage_completion_sales_person = 0
        if total_sales_person_sales_target > 0:
            percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

        aggregated_data_by_route[route]['SalesPerson']['sales_target'] = total_sales_person_sales_target
        aggregated_data_by_route[route]['SalesPerson']['total_sales'] = total_sales_person_sales
        aggregated_data_by_route[route]['SalesPerson']['percentage_completion'] = f'{percentage_completion_sales_person}%'

    # Calculate overall sales_target and total_sales for all WebCustomer instances
        overall_web_customer_sales_target = WebCustomer.objects.aggregate(
        total_sales_target=Cast(Sum(Cast('sales_target', IntegerField())), output_field=IntegerField()),
        total_sales=Sum('sales_order__Totalp', output_field=IntegerField())
    )
    total_web_customer_sales_target = overall_web_customer_sales_target.get('total_sales_target', 0) or 0
    total_web_customer_sales = overall_web_customer_sales_target.get('total_sales', 0) or 0

    # Calculate overall percentage completion for WebCustomer
    overall_percentage_completion_web_customer = 0
    if total_web_customer_sales_target > 0:
        overall_percentage_completion_web_customer = round((total_web_customer_sales / total_web_customer_sales_target) * 100, 2)

    # Calculate overall sales_target and total_sales for all SalesPerson instances
    overall_sales_person_sales_target = SalesPerson.objects.aggregate(
        total_sales_target=Cast(Sum(Cast('sales_target', IntegerField())), output_field=IntegerField()),
        total_sales=Sum('aaddsalesorder__Totalp', output_field=IntegerField())
    )
    total_sales_person_sales_target = overall_sales_person_sales_target.get('total_sales_target', 0) or 0
    total_sales_person_sales = overall_sales_person_sales_target.get('total_sales', 0) or 0

    # Calculate overall percentage completion for SalesPerson
    overall_percentage_completion_sales_person = 0
    if total_sales_person_sales_target > 0:
        overall_percentage_completion_sales_person = round((total_sales_person_sales / total_sales_person_sales_target) * 100, 2)

    # Prepare aggregated data for all instances in a dictionary
    aggregated_data_all_instances = {
        'WebCustomer': {
            'sales_target': total_web_customer_sales_target,
            'total_sales': total_web_customer_sales,
        },
        'SalesPerson': {
            'sales_target': total_sales_person_sales_target,
            'total_sales': total_sales_person_sales,
        }
    }

    # Return JSON response with both aggregated data
    return JsonResponse({'aggregated_data_by_route': aggregated_data_by_route, 'aggregated_data_all_instances': aggregated_data_all_instances})


from django.db.models import Min, Max

@api_view(['GET'])
def retrieve_sales_order_all_item_info(request, start_time=None, end_time=None):
    if start_time:
        start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%f%z")

    if end_time:
        end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%f%z")

    time_filter = {}

    if start_time and end_time:
        time_filter['created_at__gte'] = start_time
        time_filter['created_at__lte'] = end_time
    else:
        timestamps = SalesOrder.objects.aggregate(
            earliest_timestamp=Min('created_at'),
            latest_timestamp=Max('created_at')
        )
        start_time = timestamps['earliest_timestamp']
        end_time = timestamps['latest_timestamp']

        time_filter['created_at__gte'] = start_time
        time_filter['created_at__lte'] = end_time

    # Use the time_filter to fetch data based on time range
    if start_time is not None and end_time is not None:
        sales_orders = SalesOrder.objects.filter(**time_filter)
    
        # Rest of your code to aggregate data and form the response
        # ...

        sales_order_total_qty = SalesOrder.objects.aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
        aad_sales_order_total_qty = AADDSalesOrder.objects.aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        # Handling potential None values before addition
        sales_order_total_qty = sales_order_total_qty or 0
        aad_sales_order_total_qty = aad_sales_order_total_qty or 0

        sales_order_total_sum_qty = sales_order_total_qty + aad_sales_order_total_qty

        sales_order_total_qty_percentage = (sales_order_total_qty / sales_order_total_sum_qty) * 100 if sales_order_total_sum_qty else 0
        sales_order_total_qty_percentage = round(sales_order_total_qty_percentage, 2)
        sales_order_total_qty_percentage = f"{sales_order_total_qty_percentage}%"

        aad_sales_order_total_qty_percentage = (aad_sales_order_total_qty / sales_order_total_sum_qty) * 100 if sales_order_total_sum_qty else 0
        aad_sales_order_total_qty_percentage = round(aad_sales_order_total_qty_percentage, 2)
        aad_sales_order_total_qty_percentage = f"{aad_sales_order_total_qty_percentage}%"


        aags_sales_order_Qp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField()))['total_qty'] or 0


        aags_sales_order_Q_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField()))['total_qty'] or 0

        aags_sales_order_Hp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_H_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONEp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_ONE_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_TWO_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_TWOp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_total_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_total_cash = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)


        AREA1B_sales_order_Qp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField()))['total_qty'] or 0


        AREA1B_sales_order_Q_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField()))['total_qty'] or 0

        AREA1B_sales_order_Hp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        AREA1B_sales_order_H_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        AREA1B_sales_order_ONEp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        AREA1B_sales_order_ONE_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        AREA1B_sales_order_TWO_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area1B' ]), **time_filter
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        AREA1B_sales_order_TWOp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area1B' ]),  **time_filter
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)


        AREA1B_sales_order_total_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area1B' ]), **time_filter
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)


        AREA1B_sales_order_total_cash = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area1B' ]), **time_filter
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)





        Area2_sales_order_Qp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter  
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField()))['total_qty'] or 0


        Area2_sales_order_Q_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField()))['total_qty'] or 0

        Area2_sales_order_Hp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        Area2_sales_order_H_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter  
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        Area2_sales_order_ONEp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter  
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        Area2_sales_order_ONE_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter  
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        Area2_sales_order_TWO_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area2' ]),  **time_filter  
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        Area2_sales_order_TWOp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area2' ]),  **time_filter  
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)


        Area2_sales_order_total_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area2' ]),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)


        Area2_sales_order_total_cash = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area2' ]),  **time_filter
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)



        Area3_sales_order_Qp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter  
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField()))['total_qty'] or 0


        Area3_sales_order_Q_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField()))['total_qty'] or 0

        Area3_sales_order_Hp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter  
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        Area3_sales_order_H_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter 
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        Area3_sales_order_ONEp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter  
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        Area3_sales_order_ONE_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area3']),  **time_filter  
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        Area3_sales_order_TWO_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area3' ]),  **time_filter  
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        Area3_sales_order_TWOp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area2' ]),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)


        Area3_sales_order_total_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area3' ]),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)


        Area3_sales_order_total_cash = SalesOrder.objects.filter(
            Q(sales_Route__in=[ 'Area3' ]),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)





        upc_sales_order_Qp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter  
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_Q_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_Hp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_H_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_ONEp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_ONE_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter  
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_TWOp_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_TWO_CASH_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter  
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_total_qty = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        upc_sales_order_TOTAL_CASH = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)

        


        aags_sales_order_Qp_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_Q_CASH_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Hp_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_H_CASH_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter  
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_ONEp_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_ONE_CASH_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_TWOp_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_TWO_CASH_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_total_qty_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
        aags_sales_order_Total_CASH_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)






            
        aads_sales_order_Qp_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)


        aads_sales_order_Q_CASH_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)


        aads_sales_order_Hp_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        aads_sales_order_H_CASH_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)


        aads_sales_order_ONEp_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        aads_sales_order_ONE_CASH_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        aads_sales_order_TWOp_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        aads_sales_order_TWO_CASH_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        aads_sales_order_total_qty_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
        
        aads_sales_order_Total_CASH_AdissAbabaMarketDirectSales = AADDSalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarketDirectSales']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)





        aags_sales_order_Qp_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Q_CASH_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_Hp_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_H_CASH_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONEp_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONE_CASH_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_TWOp_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_TWO_CASH_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_qty_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Total_CASH_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)



        # Define filter conditions for SalesOrder and AADDSalesOrder
        sales_order_filter = Q(sales_Route__in=['AdissAbabaMarket2', 'AdissAbabaMarket', 'Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8']) & Q(**time_filter)
        aadd_sales_order_filter = Q(sales_Route__in=['AdissAbabaMarketDirectSales', 'Area1DirectSales'])& Q(**time_filter)


        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

        # Check if either variable is None and replace with 0
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0

        total_sales_order_Qp_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)

# Check if either variable is None and replace with 0
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0

        total_sales_order_Q_CASH_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty




        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)
        # Check if either variable is None and replace with 0
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_Hp_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_H_CASH_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_ONEp_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_ONE_CASH_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_TWO_CASH_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty


        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_TWOp_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_total_qty_AdissAbabaMarket2  = sales_order_total_qty + aadd_sales_order_total_qty

        sales_order_total_qty = SalesOrder.objects.filter(sales_order_filter).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)
        aadd_sales_order_total_qty = AADDSalesOrder.objects.filter(aadd_sales_order_filter).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)
        sales_order_total_qty = sales_order_total_qty if sales_order_total_qty is not None else 0
        aadd_sales_order_total_qty = aadd_sales_order_total_qty if aadd_sales_order_total_qty is not None else 0
        total_sales_order_Total_CASH_AdissAbabaMarket2 = sales_order_total_qty + aadd_sales_order_total_qty








        aags_sales_order_total_qty_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Total_CASH_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_Qp_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_Q_CASH_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Hp_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_H_CASH_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_ONEp_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONE_CASH_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)



        aags_sales_order_TWOp_Area1B = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_TWO_CASH_Area1B = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_total_qty_Area1B = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)






        aags_sales_order_total_qty_Area2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_cash_Area2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)





        aags_sales_order_Qp_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Q_CASH_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']),**time_filter
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_Hp_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_H_CASH_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_ONEp_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONE_CASH_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)



        aags_sales_order_TWOp_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        
        aags_sales_order_TWO_CASH_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']), **time_filter
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_qty_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']),  **time_filter
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)





        aags_sales_order_Qp_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_Q_CASH_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter
        ).aggregate(total_qty=Sum(F('Q_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_Hp_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']) ,  **time_filter
        ).aggregate(total_qty=Sum(F('Hp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_H_CASH_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('H_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_ONEp_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONEp'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_ONE_CASH_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('ONE_CASH'), output_field=FloatField())).get('total_qty', 0)

        
        aags_sales_order_TWOp_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWOp'), output_field=FloatField())).get('total_qty', 0)

        
        aags_sales_order_TWO_CASH_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('TWO_CASH'), output_field=FloatField())).get('total_qty', 0)
    
    
        aags_sales_order_total_qty_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_cash_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Total_CASH'), output_field=FloatField())).get('total_qty', 0)
    
    






        aags_sales_order_total_value_AdissAbabaMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)
        
        aags_sales_order_total_value_AdissAbabaMarket2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['AdissAbabaMarket2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_value_Area1 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_value_Area1B = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area1B']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)

        aags_sales_order_total_value_Area2 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area2']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_total_value_EastMarket = SalesOrder.objects.filter(
            Q(sales_Route__in=['EastMarket']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)


        aags_sales_order_total_value_Area8 = SalesOrder.objects.filter(
            Q(sales_Route__in=['Area8']),  **time_filter 
        ).aggregate(total_qty=Sum(F('Grand_Total_CASH'), output_field=FloatField())).get('total_qty', 0)

    

        aags_sales_order_rate = (aags_sales_order_total_qty / sales_order_total_qty) * 100 if sales_order_total_qty and aags_sales_order_total_qty else 0
        aags_sales_order_rate = round(aags_sales_order_rate, 2)
        aags_sales_order_rate = f"{aags_sales_order_rate}%"

        upc_sales_order_rate = (upc_sales_order_total_qty / sales_order_total_qty) * 100 if sales_order_total_qty and upc_sales_order_total_qty else 0
        upc_sales_order_rate = round(upc_sales_order_rate, 2)
        upc_sales_order_rate = f"{upc_sales_order_rate}%"

        sales_order_totals = {
            'sales_order_total_sum': sales_order_total_sum_qty,
            'sales_order_total_qty': sales_order_total_qty,
            'sales_order_total_qty_percentage': sales_order_total_qty_percentage,
            'aad_sales_order_total_qty': aad_sales_order_total_qty,
            'aad_sales_order_total_qty_percentage': aad_sales_order_total_qty_percentage,
            'aags_sales_order_total_qty': aags_sales_order_total_qty if aags_sales_order_total_qty else 0,
            'aags_sales_order_total_rate': aags_sales_order_rate,
            'upc_sales_order_total_qty': upc_sales_order_total_qty if upc_sales_order_total_qty else 0,
            'upc_sales_order_rate': upc_sales_order_rate if upc_sales_order_rate else 0,      
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }


        aags_sales_order_total = {
            '035mlQty':total_sales_order_Qp_AdissAbabaMarket2 if total_sales_order_Qp_AdissAbabaMarket2 else 0, 
            '035mlCash': total_sales_order_Q_CASH_AdissAbabaMarket2 if total_sales_order_Q_CASH_AdissAbabaMarket2  else 0, 
            '06mlQty':  total_sales_order_Hp_AdissAbabaMarket2 if total_sales_order_Hp_AdissAbabaMarket2 else 0, 
            '06mlCash': total_sales_order_H_CASH_AdissAbabaMarket2 if total_sales_order_H_CASH_AdissAbabaMarket2 else 0, 
            '1LQty':  total_sales_order_ONEp_AdissAbabaMarket2 if total_sales_order_ONEp_AdissAbabaMarket2 else 0, 
            '1LCash':  total_sales_order_ONE_CASH_AdissAbabaMarket2 if  total_sales_order_ONE_CASH_AdissAbabaMarket2 else 0, 
            '2LCash':  total_sales_order_TWO_CASH_AdissAbabaMarket2 if  total_sales_order_TWO_CASH_AdissAbabaMarket2 else 0, 
            '2LQty':  total_sales_order_TWOp_AdissAbabaMarket2 if  total_sales_order_TWOp_AdissAbabaMarket2 else 0, 
            'TotalQty': total_sales_order_total_qty_AdissAbabaMarket2 if total_sales_order_total_qty_AdissAbabaMarket2 else 0, 
            'TotalCash':  total_sales_order_Total_CASH_AdissAbabaMarket2 if total_sales_order_Total_CASH_AdissAbabaMarket2 else 0, 
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
            
        }
        sales_order_total_qty_area = {
            'sales_order_total_qty_AdissAbabaMarket': aags_sales_order_total_qty_AdissAbabaMarket if aags_sales_order_total_qty_AdissAbabaMarket else 0,
            'sales_order_total_qty_AdissAbabaMarket2': aags_sales_order_total_qty_AdissAbabaMarket2 if aags_sales_order_total_qty_AdissAbabaMarket2 else 0,
            'sales_order_total_qty_Area1': aags_sales_order_total_qty_Area1 if aags_sales_order_total_qty_Area1 else 0, 
            'sales_order_total_qty_Area1B':  aags_sales_order_total_qty_Area1B if aags_sales_order_total_qty_Area1B else 0, 
            'sales_order_total_qty_Area2': aags_sales_order_total_qty_Area2 if aags_sales_order_total_qty_Area1B else 0,
            'sales_order_total_qty_AdissAbabaMarket2': aags_sales_order_total_qty_AdissAbabaMarket2 if aags_sales_order_total_qty_AdissAbabaMarket2 else 0,
            'sales_order_total_qty_EastMarket':  aags_sales_order_total_qty_EastMarket if aags_sales_order_total_qty_EastMarket else 0,
            'sales_order_total_qty_Area8':  aags_sales_order_total_qty_Area8 if aags_sales_order_total_qty_Area8 else 0, 
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        aags_sales_order = {
            '035mlQty':aags_sales_order_Qp_qty if aags_sales_order_Qp_qty  else 0, 
            '035mlCash':aags_sales_order_Q_CASH_qty if aags_sales_order_Q_CASH_qty else 0, 
            '06mlQty':  aags_sales_order_Hp_qty  if aags_sales_order_Hp_qty else 0, 
            '06mlCash':  aags_sales_order_H_CASH_qty  if aags_sales_order_H_CASH_qty else 0, 
            '1LQty': aags_sales_order_ONEp_qty  if  aags_sales_order_ONEp_qty  else 0, 
            '1LCash': aags_sales_order_ONE_CASH_qty  if  aags_sales_order_ONE_CASH_qty else 0, 
            '2LCash': aags_sales_order_TWO_CASH_qty  if aags_sales_order_TWO_CASH_qty else 0, 
            '2LQty': aags_sales_order_TWOp_qty  if aags_sales_order_TWOp_qty else 0, 
            'TotalQty': aags_sales_order_total_qty if aags_sales_order_total_qty else 0, 
            'TotalCash': aags_sales_order_total_cash  if aags_sales_order_total_cash else 0, 
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
            
        }

        aads_sales_order = {
            '035mlQty': aads_sales_order_Qp_AdissAbabaMarketDirectSales if  aads_sales_order_Qp_AdissAbabaMarketDirectSales else 0, 
            '035mlCash': aads_sales_order_Q_CASH_AdissAbabaMarketDirectSales if  aads_sales_order_Q_CASH_AdissAbabaMarketDirectSales else 0, 
            '06mlQty':  aads_sales_order_Hp_AdissAbabaMarketDirectSales  if aads_sales_order_Hp_AdissAbabaMarketDirectSales  else 0, 
            '06mlCash':  aads_sales_order_H_CASH_AdissAbabaMarketDirectSales if  aads_sales_order_H_CASH_AdissAbabaMarketDirectSales else 0, 
            '1LQty': aads_sales_order_ONEp_AdissAbabaMarketDirectSales if aads_sales_order_ONEp_AdissAbabaMarketDirectSales else 0, 
            '1LCash':  aads_sales_order_ONE_CASH_AdissAbabaMarketDirectSales if   aads_sales_order_ONE_CASH_AdissAbabaMarketDirectSales else 0, 
            '2LCash': aads_sales_order_TWO_CASH_AdissAbabaMarketDirectSales  if aads_sales_order_TWO_CASH_AdissAbabaMarketDirectSales else 0, 
            '2LQty': aads_sales_order_TWOp_AdissAbabaMarketDirectSales if aads_sales_order_TWOp_AdissAbabaMarketDirectSales else 0, 
            'TotalQty': aads_sales_order_total_qty_AdissAbabaMarketDirectSales if  aads_sales_order_total_qty_AdissAbabaMarketDirectSales else 0,
            'TotalCash':  aads_sales_order_Total_CASH_AdissAbabaMarketDirectSales if  aads_sales_order_Total_CASH_AdissAbabaMarketDirectSales else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }
        
        upc_sales_order = {
            '035mlQty': upc_sales_order_Qp_qty if upc_sales_order_Qp_qty  else 0, 
            '035mlCash' :  upc_sales_order_Q_CASH_qty if  upc_sales_order_Q_CASH_qty else 0, 
            '06mlQty': upc_sales_order_Hp_qty  if upc_sales_order_Hp_qty  else 0, 
            '06mlCash':  upc_sales_order_H_CASH_qty if  upc_sales_order_H_CASH_qty else 0, 
            '1LQty':    upc_sales_order_ONEp_qty  if  upc_sales_order_ONEp_qty else 0, 
            '1LCash':  upc_sales_order_ONE_CASH_qty if  upc_sales_order_ONE_CASH_qty  else 0, 
            '2LCash': upc_sales_order_TWO_CASH_qty  if upc_sales_order_TWO_CASH_qty else 0, 
            'TotalCash':  upc_sales_order_TOTAL_CASH if  upc_sales_order_TOTAL_CASH else 0,
            'TotalQty': upc_sales_order_total_qty if upc_sales_order_total_qty else 0, 
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        AdissAbabaMarketSalesOrder = {
            '035mlQty':aags_sales_order_Qp_AdissAbabaMarket  if aags_sales_order_Qp_AdissAbabaMarket else 0, 
            '035mlCash': aags_sales_order_Q_CASH_AdissAbabaMarket  if  aags_sales_order_Q_CASH_AdissAbabaMarket else 0, 
            '06mlQty':  aags_sales_order_Hp_AdissAbabaMarket if  aags_sales_order_Hp_AdissAbabaMarket  else 0, 
            '06mlCash': aags_sales_order_H_CASH_AdissAbabaMarket  if aags_sales_order_H_CASH_AdissAbabaMarket   else 0, 
            '1LQty': aags_sales_order_ONEp_AdissAbabaMarket if aags_sales_order_ONEp_AdissAbabaMarket else 0, 
            '1LCash': aags_sales_order_ONE_CASH_AdissAbabaMarket if  aags_sales_order_ONE_CASH_AdissAbabaMarket  else 0, 
            '2LQty': aags_sales_order_TWOp_AdissAbabaMarket if aags_sales_order_TWOp_AdissAbabaMarket  else 0, 
            '2LCash': aags_sales_order_TWO_CASH_AdissAbabaMarket  if aags_sales_order_TWO_CASH_AdissAbabaMarket  else 0, 
            'TotalCash':  aags_sales_order_Total_CASH_AdissAbabaMarket  if  aags_sales_order_Total_CASH_AdissAbabaMarket  else 0,
            'TotalQty': aags_sales_order_total_qty_AdissAbabaMarket  if  aags_sales_order_total_qty_AdissAbabaMarket else 0, 
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }


        Area1BSalesOrder = {
            '035mlQty': AREA1B_sales_order_Qp_qty if AREA1B_sales_order_Qp_qty else 0, 
            '035mlCash':  AREA1B_sales_order_Q_CASH_qty if  AREA1B_sales_order_Q_CASH_qty else 0, 
            '06mlQty':  AREA1B_sales_order_Hp_qty if  AREA1B_sales_order_Hp_qty else 0, 
            '06mlCash':  AREA1B_sales_order_H_CASH_qty if  AREA1B_sales_order_H_CASH_qty else 0, 
            '1LQty':  AREA1B_sales_order_ONEp_qty if  AREA1B_sales_order_ONEp_qty else 0, 
            '1LCash':  AREA1B_sales_order_ONE_CASH_qty if  AREA1B_sales_order_ONE_CASH_qty else 0, 
            '2LQty':  AREA1B_sales_order_TWOp_qty if  AREA1B_sales_order_TWOp_qty else 0, 
            '2LCash':  AREA1B_sales_order_TWO_CASH_qty if  AREA1B_sales_order_TWO_CASH_qty else 0, 
            'TotalCash':  AREA1B_sales_order_total_cash if   AREA1B_sales_order_total_cash  else 0,
            'TotalQty': AREA1B_sales_order_total_qty if AREA1B_sales_order_total_qty else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        
        Area2SalesOrder = {
            '035mlQty': Area2_sales_order_Qp_qty if Area2_sales_order_Qp_qty else 0, 
            '035mlCash': Area2_sales_order_Q_CASH_qty  if   Area2_sales_order_Q_CASH_qty  else 0, 
            '06mlQty':  Area2_sales_order_Hp_qty if   Area2_sales_order_Hp_qty  else 0, 
            '06mlCash':  Area2_sales_order_H_CASH_qty if  Area2_sales_order_H_CASH_qty else 0, 
            '1LQty':  Area2_sales_order_ONEp_qty if  Area2_sales_order_ONEp_qty else 0, 
            '1LCash':  Area2_sales_order_ONE_CASH_qty if  Area2_sales_order_ONE_CASH_qty else 0, 
            '2LQty':  Area2_sales_order_TWOp_qty if  Area2_sales_order_TWOp_qty else 0, 
            '2LCash':  Area2_sales_order_TWO_CASH_qty if  Area2_sales_order_TWO_CASH_qty else 0, 
            'TotalCash':  Area2_sales_order_total_cash if   Area2_sales_order_total_cash  else 0,
            'TotalQty': Area2_sales_order_total_qty if Area2_sales_order_total_qty else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }


        Area3SalesOrder = {
            '035mlQty': Area3_sales_order_Qp_qty if Area3_sales_order_Qp_qty else 0, 
            '035mlCash': Area3_sales_order_Q_CASH_qty  if   Area3_sales_order_Q_CASH_qty  else 0, 
            '06mlQty':  Area3_sales_order_Hp_qty if   Area3_sales_order_Hp_qty  else 0, 
            '06mlCash':  Area3_sales_order_H_CASH_qty if  Area3_sales_order_H_CASH_qty else 0, 
            '1LQty':  Area3_sales_order_ONEp_qty if  Area3_sales_order_ONEp_qty else 0, 
            '1LCash':  Area3_sales_order_ONE_CASH_qty if  Area3_sales_order_ONE_CASH_qty else 0, 
            '2LQty':  Area3_sales_order_TWOp_qty if  Area3_sales_order_TWOp_qty else 0, 
            '2LCash':  Area3_sales_order_TWO_CASH_qty if  Area3_sales_order_TWO_CASH_qty else 0, 
            'TotalCash':  Area3_sales_order_total_cash if   Area3_sales_order_total_cash  else 0,
            'TotalQty': Area3_sales_order_total_qty if Area3_sales_order_total_qty else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        AdissAbabaMarket2SalesOrder = {          
            '035mlQty':    aags_sales_order_Qp_AdissAbabaMarket2  if  aags_sales_order_Qp_AdissAbabaMarket2  else 0, 
            '035mlCash': aags_sales_order_Q_CASH_AdissAbabaMarket2  if  aags_sales_order_Q_CASH_AdissAbabaMarket2 else 0, 
            '06mlQty':  aags_sales_order_Hp_AdissAbabaMarket2  if  aags_sales_order_Hp_AdissAbabaMarket2 else 0, 
            '06mlCash':  aags_sales_order_H_CASH_AdissAbabaMarket2  if  aags_sales_order_H_CASH_AdissAbabaMarket2 else 0, 
            '1LQty': aags_sales_order_ONEp_AdissAbabaMarket2  if  aags_sales_order_ONEp_AdissAbabaMarket2 else 0, 
            '1LCash':  aags_sales_order_ONE_CASH_AdissAbabaMarket2 if aags_sales_order_ONE_CASH_AdissAbabaMarket2  else 0, 
            '2LQty':   aags_sales_order_TWOp_AdissAbabaMarket2  if  aags_sales_order_TWOp_AdissAbabaMarket2 else 0, 
            '2LCash':  aags_sales_order_TWO_CASH_AdissAbabaMarket2  if aags_sales_order_TWO_CASH_AdissAbabaMarket2   else 0, 
            'sales_order_total_qty_AdissAbabaMarket2':   aags_sales_order_total_qty_AdissAbabaMarket2  if  aags_sales_order_total_qty_AdissAbabaMarket2  else 0, 
            'sales_order_Total_CASH_AdissAbabaMarket2 ': aags_sales_order_Total_CASH_AdissAbabaMarket2  if  aags_sales_order_Total_CASH_AdissAbabaMarket2  else 0, 
            'TotalCash':  aags_sales_order_Total_CASH_AdissAbabaMarket2  if  aags_sales_order_Total_CASH_AdissAbabaMarket2  else 0,
            'TotalQty':  aags_sales_order_total_qty_AdissAbabaMarket2 if   aags_sales_order_total_qty_AdissAbabaMarket2 else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        Area1SalesOrder = {
            '035mlQty':  aags_sales_order_Qp_Area1 if aags_sales_order_Qp_Area1 else 0, 
            '035mlCash': aags_sales_order_Q_CASH_Area1  if aags_sales_order_Q_CASH_Area1 else 0, 
            '06mlQty':    aags_sales_order_Hp_Area1  if aags_sales_order_Hp_Area1 else 0, 
            '06mlCash':   aags_sales_order_H_CASH_Area1  if aags_sales_order_H_CASH_Area1 else 0, 
            '1LQty':aags_sales_order_ONEp_Area1  if aags_sales_order_ONEp_Area1 else 0, 
            '1LCash': aags_sales_order_ONE_CASH_Area1  if aags_sales_order_ONE_CASH_Area1 else 0, 
            'TotalCash':  aags_sales_order_Total_CASH_AdissAbabaMarket2  if   aags_sales_order_Total_CASH_AdissAbabaMarket2 else 0,
            'TotalQty': aags_sales_order_total_qty_AdissAbabaMarket2 if aags_sales_order_total_qty_AdissAbabaMarket2 else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        EastMarkterSalesOrder = {
            '035mlQty':aags_sales_order_Qp_EastMarket  if aags_sales_order_Qp_EastMarket  else 0, 
            '035mlCash': aags_sales_order_Q_CASH_EastMarket if aags_sales_order_Q_CASH_EastMarket else 0, 
            '06mlQty': aags_sales_order_Hp_EastMarket  if  aags_sales_order_Hp_EastMarket  else 0, 
            '06mlCash': aags_sales_order_H_CASH_EastMarket  if aags_sales_order_H_CASH_EastMarket  else 0, 
            '1LQty': aags_sales_order_ONEp_EastMarket  if  aags_sales_order_ONEp_EastMarket  else 0, 
            '1LCash': aags_sales_order_ONE_CASH_EastMarket  if aags_sales_order_ONE_CASH_EastMarket  else 0, 
            '2LQty': aags_sales_order_TWOp_EastMarket  if  aags_sales_order_TWOp_EastMarket else 0, 
            '2LCash':   aags_sales_order_TWO_CASH_EastMarket  if aags_sales_order_TWO_CASH_EastMarket else 0, 
            'TotalCash':  aags_sales_order_Total_CASH_AdissAbabaMarket2  if   aags_sales_order_Total_CASH_AdissAbabaMarket2 else 0,
            'TotalQty': aags_sales_order_total_qty_AdissAbabaMarket2 if aags_sales_order_total_qty_AdissAbabaMarket2 else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
        }

        Area8SalesOrder = {
            '035mlQty': aags_sales_order_Qp_Area8  if  aags_sales_order_Qp_Area8 else 0, 
            '035mlCash': aags_sales_order_Q_CASH_Area8  if aags_sales_order_Q_CASH_Area8  else 0, 
            '06mlQty': aags_sales_order_Hp_Area8  if  aags_sales_order_Hp_Area8 else 0,  
            '06mlCash': aags_sales_order_H_CASH_Area8  if aags_sales_order_H_CASH_Area8 else 0, 
            '1LQty': aags_sales_order_ONEp_Area8  if aags_sales_order_ONEp_Area8 else 0, 
            '1LCash':  aags_sales_order_ONE_CASH_Area8  if  aags_sales_order_ONE_CASH_Area8 else 0, 
            '2LQty':  aags_sales_order_TWOp_Area8  if aags_sales_order_TWOp_Area8  else 0, 
            '2LCash': aags_sales_order_TWO_CASH_Area8  if aags_sales_order_TWO_CASH_Area8  else 0, 
            'TotalCash': aags_sales_order_total_cash_Area8 if  aags_sales_order_total_cash_Area8 else 0,
            'TotalQty':  aags_sales_order_total_qty_Area8  if  aags_sales_order_total_qty_Area8 else 0,
            'start_time': start_time.isoformat() if start_time else None,
            'end_time': end_time.isoformat() if end_time else None
            
        }
        # Define dictionaries with sales order data

    # ... (existing dictionary definitions)

        # Format numerical values with commas in dictionaries
        def format_values(dictionary):
            for key, value in dictionary.items():
                if isinstance(value, int) or isinstance(value, float):
                    dictionary[key] = f"{value:,}"  # Using f-string to add commas
            return dictionary

        # Applying formatting to all dictionaries
        formatted_aags_sales_order = format_values(aags_sales_order)
        formatted_aads_sales_order = format_values(aads_sales_order)
        formatted_upc_sales_order = format_values(upc_sales_order)
        formatted_AdissAbabaMarketSalesOrder = format_values(AdissAbabaMarketSalesOrder)
        formatted_AdissAbabaMarket2SalesOrder = format_values(AdissAbabaMarket2SalesOrder)
        formatted_Area1SalesOrder = format_values(Area1SalesOrder)
        formatted_EastMarkterSalesOrder = format_values(EastMarkterSalesOrder)
        formatted_Area1BSalesOrder = format_values(Area1BSalesOrder)
        formatted_Area2SalesOrder = format_values(Area2SalesOrder)
        formatted_Area3SalesOrder = format_values(Area3SalesOrder)
        formatted_Area8SalesOrder = format_values(Area8SalesOrder)
        formatted_aags_sales_order_total = format_values(aags_sales_order_total)

        # ... (remaining dictionaries)

        # Create a list with all formatted dictionaries
        response_data = [
            {'id': '1', 'name': "AdissAbabaAgent", 'value':  formatted_aags_sales_order},
            {'id': '2', 'name': "AdissAbabaDirectSales", 'value':  formatted_aads_sales_order},
            {'id': '3', 'name': "UpCountry", 'value':  formatted_upc_sales_order},
            {'id': '4', 'name': "AdissAbabaMarket", 'value': formatted_AdissAbabaMarketSalesOrder},
            {'id': '5', 'name': "AdissAbabaMarket2", 'value': formatted_AdissAbabaMarket2SalesOrder},
            {'id': '6', 'name': "Area1", 'value': formatted_Area1SalesOrder},
            {'id': '7', 'name': "EastMarket", 'value': formatted_EastMarkterSalesOrder},
            {'id': '8', 'name': "Area1B", 'value':  formatted_Area1BSalesOrder},
            {'id': '9', 'name': "Area2", 'value': formatted_Area2SalesOrder},
            {'id': '10', 'name': "Area3", 'value': formatted_Area3SalesOrder},
            {'id': '11', 'name': "Area8", 'value': formatted_Area8SalesOrder},
            {'id': '12', 'name': "Total", 'value': formatted_aags_sales_order_total},
            # Add other categories as needed...
        ]

        # Return the JsonResponse with the organized data
        return JsonResponse({'data': response_data})
    else:
        return Response({"error": "Invalid time range provided"}, status=status.HTTP_400_BAD_REQUEST)


from django.http import JsonResponse
import _json



@api_view(['GET'])
def retrieve_sales_order_all_item_info_test(request):
    # Get time input parameters (start_time and end_time) from the request's query parameters
    start_time_str = request.GET.get('start_time')
    end_time_str = request.GET.get('end_time')

    # Convert time input strings to datetime objects
    start_time = datetime.strptime(start_time_str, '%Y-%m-%dT%H:%M:%S') if start_time_str else None
    end_time = datetime.strptime(end_time_str, '%Y-%m-%dT%H:%M:%S') if end_time_str else None

    # Define the time filter for SalesOrder objects
    time_filter = Q()
    if start_time:
        time_filter &= Q(created_at__gte=start_time)
    if end_time:
        time_filter &= Q(created_at__lte=end_time)

    # Apply the time filter to SalesOrder queries for each field
    # Example for a single field, adjust similar to other fields as per your requirements
    aags_sales_order_Qp_AdissAbabaMarket2 = SalesOrder.objects.filter(
        Q(sales_Route__in=['AdissAbabaMarket2']) & time_filter
    ).aggregate(total_qty=Sum(F('Qp'), output_field=FloatField())).get('total_qty', 0)

    # Construct the response using the filtered data
    AdissAbabaMarket2SalesOrder = {
        # Include the filtered data for different fields based on the time range 
        '035mlQty':    aags_sales_order_Qp_AdissAbabaMarket2  if  aags_sales_order_Qp_AdissAbabaMarket2  else 0, 
        # ...
    }

    # Return the response as JSON
    return JsonResponse(AdissAbabaMarket2SalesOrder)




def get_sales_order_values_of_customers(request, start_time=None, end_time=None):
    try:
        if start_time:
            start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%f%z")

        if end_time:
            end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%f%z")

        time_filter = {}

        if start_time and end_time:
            time_filter['created_at__gte'] = start_time
            time_filter['created_at__lte'] = end_time
        else:
            timestamps = SalesOrder.objects.aggregate(
                earliest_timestamp=Min('created_at'),
                latest_timestamp=Max('created_at')
            )
            start_time = timestamps['earliest_timestamp']
            end_time = timestamps['latest_timestamp']

            time_filter['created_at__gte'] = start_time
            time_filter['created_at__lte'] = end_time

        all_customers = WebCustomer.objects.all()
        aggregated_values_for_all_customers = {}

        for customer in all_customers:
            sales_orders = SalesOrder.objects.filter(customers_name=customer, **time_filter)

            aggregated_values = sales_orders.aggregate(
                    total_qp=Sum('Qp'),
                    total_hp=Sum('Hp'),
                    total_onep=Sum('ONEp'),
                    total_twop=Sum('TWOp'),
                    total_q_unit=Sum('Q_Unit'),
                    total_h_unit=Sum('H_Unit'),
                    total_one_unit=Sum('ONE_Unit'),
                    total_two_unit=Sum('TWO_Unit'),
                    total_q_cash=Sum('Q_CASH'),
                    total_h_cash=Sum('H_CASH'),
                    total_one_cash=Sum('ONE_CASH'),
                    total_two_cash=Sum('TWO_CASH'),
                    total_total_cash=Sum('Total_CASH'),
                    total_total_p=Sum('Totalp'),
                    total_grand_total_cash=Sum('Grand_Total_CASH'),
                # Add other Sum aggregations for relevant fields
                    total_start_time=Min('created_at'),  # Start time for this customer
                    total_end_time=Max('created_at'), 
            )

            for key, value in aggregated_values.items():
                if value is None: 
                    aggregated_values[key] = 0

            # Extracting start and end time for this customer
            start_customer_time = aggregated_values.pop('total_start_time', None)
            end_customer_time = aggregated_values.pop('total_end_time', None)

            # Formatting times to ISO 8601 format if they exist
            formatted_start_time = start_customer_time.isoformat() if start_customer_time else None
            formatted_end_time = end_customer_time.isoformat() if end_customer_time else None

            aggregated_values['total_start_time'] = formatted_start_time
            aggregated_values['total_end_time'] = formatted_end_time

            customer_data = {
                'customer_id': customer._id, 
                'customer_name': customer.customer_name, 
                'aggregated_value': aggregated_values
            }

            aggregated_values_for_all_customers[customer._id] = customer_data

        return JsonResponse(aggregated_values_for_all_customers, safe=False)

    except Exception as e: 
        return JsonResponse({"error": str(e)}, status=500)


def get_sales_order_values_for_all_customers(request):
    try:
        all_customers = WebCustomer.objects.all()
        aggregated_values_for_all_customers = {}

        for customer in all_customers:
            sales_orders = SalesOrder.objects.filter(customers_name=customer)

            aggregated_values = sales_orders.aggregate(
                total_qp=Sum('Qp'),
                total_hp=Sum('Hp'),
                total_onep=Sum('ONEp'),
                total_twop=Sum('TWOp'),
                total_q_unit=Sum('Q_Unit'),
                total_h_unit=Sum('H_Unit'),
                total_one_unit=Sum('ONE_Unit'),
                total_two_unit=Sum('TWO_Unit'),
                total_totalp=Sum('Totalp'),
                total_q_cash=Sum('Q_CASH'),
                total_h_cash=Sum('H_CASH'),
                total_one_cash=Sum('ONE_CASH'),
                total_two_cash=Sum('TWO_CASH'),
                total_total_cash=Sum('Total_CASH'),
                total_grand_total_cash=Sum('Grand_Total_CASH')
            )

            # Replace None values with 0
            for key, value in aggregated_values.items():
                if value is None:
                    aggregated_values[key] = 0

            customer_data = {
                "customer_id": customer._id,
                "customer_name": customer.customer_name,
                "aggregated_values": aggregated_values
            }

            # Convert dictionary items to string with a comma at the end
            customer_string = str(customer._id) + ": " + str(customer_data) + ","
            aggregated_values_for_all_customers.update({customer.id: customer_string})

        # Remove the trailing comma
        aggregated_values_for_all_customers = (
            "{" + "".join(aggregated_values_for_all_customers.values())[:-1] + "}"
        )

        return JsonResponse(aggregated_values_for_all_customers, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



def get_sales_order_values_of_salesperson(request, start_time=None, end_time=None):
    try:
        if start_time:
            start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%S.%f%z")

        if end_time:
            end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%S.%f%z")

        time_filter = {}

        if start_time and end_time:
            time_filter['created_at__gte'] = start_time
            time_filter['created_at__lte'] = end_time
        else:
            timestamps = SalesOrder.objects.aggregate(
                earliest_timestamp=Min('created_at'),
                latest_timestamp=Max('created_at')
            )
            start_time = timestamps['earliest_timestamp']
            end_time = timestamps['latest_timestamp']

            time_filter['created_at__gte'] = start_time
            time_filter['created_at__lte'] = end_time

        all_customers = SalesPerson.objects.all()
        aggregated_values_for_all_salesPerson = {}

        for customer in all_customers:
            sales_orders = AADDSalesOrder.objects.filter(SalesPerson=customer, **time_filter)

            aggregated_values = sales_orders.aggregate(
                total_qp=Sum('Qp'),
                total_hp=Sum('Hp'),
                total_onep=Sum('ONEp'),
                total_twop=Sum('TWOp'),
             
                total_q_cash=Sum('Q_CASH'),
                total_h_cash=Sum('H_CASH'),
                total_one_cash=Sum('ONE_CASH'),
                total_two_cash=Sum('TWO_CASH'),
                total_total_cash=Sum('Total_CASH'),
                total_total_p=Sum('Totalp'),
                total_start_time=Min('created_at'),  # Start time for this customer
                total_end_time=Max('created_at'), 
                    
            )
            for key, value in aggregated_values.items():
                if value is None: 
                    aggregated_values[key] = 0

                     # Extracting start and end time for this customer
            start_customer_time = aggregated_values.pop('total_start_time', None)
            end_customer_time = aggregated_values.pop('total_end_time', None)

            # Formatting times to ISO 8601 format if they exist
            formatted_start_time = start_customer_time.isoformat() if start_customer_time else None
            formatted_end_time = end_customer_time.isoformat() if end_customer_time else None

            aggregated_values['total_start_time'] = formatted_start_time
            aggregated_values['total_end_time'] = formatted_end_time
            customer_data = {
                'customer_id': customer._id, 
                'customer_name': customer.sales_person , 
                'aggregated_value': aggregated_values
            }

            aggregated_values_for_all_salesPerson [customer._id] = customer_data
        return JsonResponse(aggregated_values_for_all_salesPerson, safe=False)
    except Exception as e: 
        return JsonResponse({"error": str(e)}, status=500)



from django.db.models import Sum, F, Value, IntegerField

def get_sales_target_by_route(request):
    try:
        # Get the aggregate sales_target for each sales route
        sales_target_by_route = SalesPerson.objects.filter(
            is_approved=True  # Assuming you want only approved salespersons
        ).annotate(
            numeric_sales_target=Cast('sales_target', IntegerField())
        ).values('Route').annotate(
            total_sales_target=Sum('numeric_sales_target')
        )

        # Prepare the data to be returned as JSON
        data = {
            item['Route']: item['total_sales_target'] 
            for item in sales_target_by_route
        }

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def calculate_completion_rate_by_route(request):
    # Fetching aggregated Totalp values for each AreaRoute
    aggregated_values = SalesOrder.objects.values('sales_Route').annotate(
        total_totalp=Cast(Sum('Totalp'), FloatField())
    )

    # Calculating total sales target for all AreaRoutes
    total_sales_target = sum(item['total_totalp'] for item in aggregated_values)

    # Calculating completion rate for each AreaRoute
    completion_rates = {}
    for item in aggregated_values:
        area_route = item['sales_Route']
        totalp = item['total_totalp']
        completion_rate = (totalp / total_sales_target) * 100 if total_sales_target else 0
        completion_rates[area_route] = completion_rate

    # Returning completion rates as JSON
    return JsonResponse(completion_rates)

# Usage:
    completion_rates_json = get_completion_rates()
    print(completion_rates_json)  # Output the JSON object containing completion rates



    
@api_view(['GET'])
def retrieve_sales_order_all_item_info_Dashboard(request):
    sales_order_total_qty = SalesOrder.objects.aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)
    aad_sales_order_total_qty = AADDSalesOrder.objects.aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

    # Handling potential None values before addition
    sales_order_total_qty = sales_order_total_qty or 0
    aad_sales_order_total_qty = aad_sales_order_total_qty or 0

    sales_order_total_sum_qty = sales_order_total_qty + aad_sales_order_total_qty

    sales_order_total_qty_percentage = (sales_order_total_qty / sales_order_total_sum_qty) * 100 if sales_order_total_sum_qty else 0
    sales_order_total_qty_percentage = round(sales_order_total_qty_percentage, 2)
    sales_order_total_qty_percentage = f"{sales_order_total_qty_percentage}%"

    aad_sales_order_total_qty_percentage = (aad_sales_order_total_qty / sales_order_total_sum_qty) * 100 if sales_order_total_sum_qty else 0
    aad_sales_order_total_qty_percentage = round(aad_sales_order_total_qty_percentage, 2)
    aad_sales_order_total_qty_percentage = f"{aad_sales_order_total_qty_percentage}%"

    aags_sales_order_total_qty = SalesOrder.objects.filter(
        Q(sales_Route__in=['AdissAbabaMarket', 'AdissAbabaMarket2']) 
    ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

    upc_sales_order_total_qty = SalesOrder.objects.filter(
        Q(sales_Route__in=['Area1', 'Area1B', 'Area2', 'Area3', 'EastMarket', 'Area8'])
    ).aggregate(total_qty=Sum(F('Totalp'), output_field=FloatField())).get('total_qty', 0)

    aags_sales_order_rate = (aags_sales_order_total_qty / sales_order_total_qty) * 100 if sales_order_total_qty and aags_sales_order_total_qty else 0
    aags_sales_order_rate = round(aags_sales_order_rate, 2)
    aags_sales_order_rate = f"{aags_sales_order_rate}%"

    upc_sales_order_rate = (upc_sales_order_total_qty / sales_order_total_qty) * 100 if sales_order_total_qty and upc_sales_order_total_qty else 0
    upc_sales_order_rate = round(upc_sales_order_rate, 2)
    upc_sales_order_rate = f"{upc_sales_order_rate}%"

    def format_numeric_value(value):
        # Check if the value is None or 0, and return 0 as string
        if value is None or value == 0:
            return '0'
        else:
            # Format the value with commas for thousands separator
            return f"{value:,.0f}"  # Change '.0f' to '.2f' for two decimal places

    # Construct the JSON response with formatted numeric values
    return JsonResponse({
        'sales_order_total_sum': format_numeric_value(sales_order_total_sum_qty),
        'sales_order_total_qty': format_numeric_value(sales_order_total_qty),
        'sales_order_total_qty_percentage': sales_order_total_qty_percentage,
        'aad_sales_order_total_qty': format_numeric_value(aad_sales_order_total_qty),
        'aad_sales_order_total_qty_percentage': aad_sales_order_total_qty_percentage,
        'aags_sales_order_total_qty': format_numeric_value(aags_sales_order_total_qty),
        'aags_sales_order_total_rate': aags_sales_order_rate,
        'upc_sales_order_total_qty': format_numeric_value(upc_sales_order_total_qty),
        'upc_sales_order_rate': upc_sales_order_rate
    })

from itertools import islice
from operator import attrgetter
from rest_framework.response import Response
from django.core.serializers import serialize
import json

@api_view(['GET'])
def recent_transaction(request):
    # Get the latest 10 orders from SalesOrder
    sales_orders = list(SalesOrder.objects.order_by('-_id')[:10])

    # Get the latest 10 orders from AADDSalesOrder
    aad_sales_orders = list(AADDSalesOrder.objects.order_by('-_id')[:10])

    # Combine the orders
    combined_orders = sorted(sales_orders + aad_sales_orders, key=attrgetter('_id'), reverse=True)

    # Extract the customer names and other fields from the orders and store them in a list
    result = []
    for order in islice(combined_orders, 10):
        order_data = {
            '_id': order._id,
            'customers_name': json.loads(serialize('json', [order.customers_name]))[0]['fields']['customer_name'] if hasattr(order, 'customers_name') else json.loads(serialize('json', [order.SalesPerson]))[0]['fields']['sales_person'],
            'sales_Route': order.sales_Route,
            'Qp': order.Qp,
            'Hp': order.Hp,
            'ONEp': order.ONEp,
            'TWOp': order.TWOp,
            'Totalp': order.Totalp,
            'Q_CASH': order.Q_CASH,
            'H_CASH': order.H_CASH,
            'ONE_CASH': order.ONE_CASH,
            'TWO_CASH': order.TWO_CASH,
            'Total_CASH': order.Total_CASH,
            'date': order.created_at.date(),  # Extract only the date part
        }
        result.append(order_data)

    # Return the list of order data wrapped in a Response object
    return Response(result)

@api_view(['GET'])
def retrieve_sales_order_by_market(request):
    try:
        # Get all the unique markets
        markets = SalesOrder.objects.values_list('sales_Route', flat=True).distinct()
        # Create a dictionary to store the requested data
        data = {}
        # Iterate over each market and get the values
        for market in markets:
            market_data = {}
            sales_orders = SalesOrder.objects.filter(Route=market)
            market_data['qp'] = [order.Qp for order in sales_orders]
            market_data['q_cash'] = [order.Q_CASH for order in sales_orders]
            market_data['hp'] = [order.Hp for order in sales_orders]
            market_data['h_cash'] = [order.H_CASH for order in sales_orders]
            market_data['onep'] = [order.ONEp for order in sales_orders]
            market_data['one_cash'] = [order.ONE_CASH for order in sales_orders]
            market_data['twop'] = [order.TWOp for order in sales_orders]
            market_data['two_cash'] = [order.TWO_CASH for order in sales_orders]
            # Add the market data to the main data dictionary
            data[market] = market_data

        return Response(data)

    except SalesOrder.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def pie_chart_data(request, data_type):
    if data_type == 'last-24-hours':
        sales_data = AADDSalesOrder.objects.filter(created_at__gte=datetime.now() - timedelta(hours=24))
    elif data_type == 'monthly':
        sales_data = AADDSalesOrder.objects.filter(created_at__year=datetime.now().year, created_at__month=datetime.now().month)
    elif data_type == 'annually':
        sales_data = AADDSalesOrder.objects.filter(created_at__year=datetime.now().year)
    else:
        return Response({'error': 'Invalid data type'}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = PieOrderSerializer(sales_data, many=True)
    data = serializer.data
    
    # Calculate the total values for each field
    total_values = {'Qp': 0, 'Hp': 0, 'ONEp': 0, 'TWOp': 0}
    for item in data:
        for field, value in item.items():
            if field in total_values and value:
                total_values[field] += value

    # Adjust the data structure to match the expected format
    pie_data = []
    for field, value in total_values.items():
        pie_data.append({
            'id': field,
            'label': field,
            'value': value,
            'color': f'hsl({hash(field) % 360}, 70%, 50%)',
        })

    return Response(pie_data)


class SalesOrderViewSet(viewsets.ModelViewSet):
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer

    def list(self, request, *args, **kwargs):
        # Get the current datetime
        current_datetime = datetime.now()

        # Calculate the datetime for the last 24 hours
        last_24_hours_datetime = current_datetime - timedelta(hours=24)

        # Filter SalesOrders created within the last 24 hours
        queryset = self.filter_queryset(self.get_queryset().filter(created_at__gte=last_24_hours_datetime))

        # Serialize the queryset
        serializer = self.get_serializer(queryset, many=True)

        # Generate LineChar data
        line_data = []
        for data in serializer.data:
            x_value = data['Totalp']
            y_value = data['created_at']
            line_data.append({'x': x_value, 'y': y_value})

        return Response(line_data)
AreaRoute = (
    ('Area1', 'Area1'),
    ('Area1B', 'Area1B'),
    ('Area2', 'Area2'),
    ('Area3', 'Area3'),
    ('EastMarket', 'EastMarket'),
    ('AdissAbabaMarket', 'AdissAbabaMarket'),
    ('AdissAbabaMarket2', 'AdissAbabaMarket2'),
    ('Area8', 'Area8'),
)

class SalesOrderLineChartView(APIView):
    def get(self, request, time_period, format=None):
        # Get the current datetime
        current_datetime = datetime.now()

        # Determine the start datetime based on the time_period parameter
        if time_period == 'last_24_hours':
            start_datetime = current_datetime - timedelta(hours=24)
        elif time_period == 'last_month':
            start_datetime = current_datetime - timedelta(days=30)
        elif time_period == 'annually':
            start_datetime = current_datetime - timedelta(days=365)
        else:
            return Response({'error': 'Invalid time_period parameter'}, status=400)

        # Filter SalesOrders based on the time_period
        sales_orders = SalesOrder.objects.filter(created_at__gte=start_datetime)

        # Generate LineChar data for each Area
        line_data = []
        for area, _ in AreaRoute:
            area_sales_orders = sales_orders.filter(sales_Route=area)
            area_data = self.get_line_chart_data(area_sales_orders, area)
            line_data.extend(area_data)

        return Response(line_data)

    def get_line_chart_data(self, sales_orders, area, request):
        serializer = LineOrderSerializer(sales_orders, many=True, context={'request': request})
        line_data = serializer.data
        for data in line_data:
            data['area'] = area
        return line_data






@api_view(['GET'])
def get_customer_debit_form(request):
    customer_debit_form = CustomerDebitForm.objects.filter(is_clear=False)
    serializer = CustomerDebitFormSerializer(customer_debit_form, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_pending_inventory_return(request, pk):
    try:
        data = request.data 
        return_form = CustomerDebitForm.objects.get(_id=pk) 
        return_form.CSI_CSRI_Number = data['CSI_CSRI_Number']
        return_form.Bank_Name = data['Bank_Name']
        return_form.Amount = data['Amount']
        return_form.Bank_reference_Number = data['Bank_Reference_Number']
        return_form.payment = request.FILES.get('payment') 
        # Convert Deposit_Date to the correct format

        deposit_date_str = data['Deposit_Date']
        deposit_date = datetime.strptime(deposit_date_str, '%a %b %d %Y %H:%M:%S GMT%z (%Z)')
        return_form.Deposit_Date = deposit_date.date().isoformat()
        return_form.is_clear = True  # Set is_return_finance to True
        return_form.save()
        
        serializer = CustomerDebitFormSerializer(return_form)
        return Response(serializer.data)
    
    except CustomerDebitForm.DoesNotExist:
        return Response(status=404)

@api_view(['GET'])
def calculate_salesperson_debt(request, salesperson_pk):
    salesperson = SalesPerson.objects.get(_id=salesperson_pk)

    # Get all sales made by the SalesPerson
    sales = AADDSalesOrder.objects.filter(SalesPerson=salesperson).values(
        'Plate_number__plate_no',
        'sales_Route',
        'Qp',
        'Hp',
        'ONEp',
        'TWOp',
        'Totalp',
        'Q_CASH',
        'H_CASH',
        'ONE_CASH',
        'TWO_CASH',
        'Total_CASH'
        '_id'
    )

    # Get all returns made by the SalesPerson
    returns = InventoryReturnForm.objects.filter(SalesPerson=salesperson).values(
        'Qp',
        'Hp',
        'ONEp',
        'TWOp',
        'Totalp',
        'recipant'
        '_id'
    )
    Qp =AADDSalesOrder.Object.filter(SalesPerson=salesperson).values('Qp')
    # Calculate the total sales
    total_sales = AADDSalesOrder.objects.filter(SalesPerson=salesperson).aggregate(
        total=Sum('Totalp'))['total']

    # Calculate the total returns
    total_returns = InventoryReturnForm.objects.filter(SalesPerson=salesperson).aggregate(
        total=Sum('Totalp'))['total']

    # Calculate the difference
    difference = total_sales - total_returns
    #find id 


    # Serialize the data
    serializer = SalespersonDebtSerializer({
        'Qp':Qp,
        'salesperson': salesperson.sales_person,
        'total_sales': total_sales,
        'total_returns': total_returns,
        'difference': difference,
        'sales': sales,
        'returns': returns
    })

    return Response(serializer.data) 



@api_view(['GET'])
def calculate_all_salespersons_debt(request):
    salespersons = SalesPerson.objects.all()

    salespersons_data = []

    for salesperson in salespersons:
        # Get all sales made by the SalesPerson
        sales = AADDSalesOrderSerializer(AADDSalesOrder.objects.filter(SalesPerson=salesperson), many=True).data

        returns = InventoryReturnFormSerializer(InventoryReturnForm.objects.filter(SalesPerson=salesperson), many=True).data

        # Check if any returns have is_pending=False
        if any(return_data['is_pending'] == True for return_data in returns):
            continue

        # Calculate the total sales
        total_sales_result = AADDSalesOrder.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_sales = total_sales_result['total'] if total_sales_result['total'] else 0  # Check if total_sales is None

        # Calculate the total returns
        total_returns_result = InventoryReturnForm.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_returns = total_returns_result['total'] if total_returns_result['total'] else 0  # Check if total_returns is None

        # Calculate the difference
        difference = total_sales - total_returns

        # Add salesperson data to the list
        if returns:
            _id = returns[0]['_id']
        else:
            _id = None

        # Add salesperson data to the list
        salespersons_data.append({
            'salesperson': salesperson.sales_person,
            'salesroute': salesperson.Route,
            'plate': [sale['Plate_number'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            'Q_CASH': [sale['Q_CASH'] for sale in sales],
            'H_CASH': [sale['H_CASH'] for sale in sales],
            'ONE_CASH': [sale['ONE_CASH'] for sale in sales],
            'TWO_CASH': [sale['TWO_CASH'] for sale in sales],
            'Total_CASH': [sale['Total_CASH'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            "_id": _id,  # Use the _id from the first return in the list
            'total_sales': total_sales,
            'total_returns': total_returns,
            'difference': difference,
            'sales': sales,
            'returns': returns
        })

    # Return the data
    return Response(salespersons_data)


@api_view(['GET'])
def calculate_all_salespersons_debt_pending(request):
    salespersons = SalesPerson.objects.all()

    salespersons_data = []

    for salesperson in salespersons:
        # Get all sales made by the SalesPerson
        sales = AADDSalesOrderSerializer(AADDSalesOrder.objects.filter(SalesPerson=salesperson), many=True).data

        returns = InventoryReturnFormSerializer(InventoryReturnForm.objects.filter(SalesPerson=salesperson, is_pending=True), many=True).data

        # Calculate the total sales
        total_sales_result = AADDSalesOrder.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_sales = total_sales_result['total'] if total_sales_result['total'] else 0  # Check if total_sales is None

        # Calculate the total returns
        total_returns_result = InventoryReturnForm.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_returns = total_returns_result['total'] if total_returns_result['total'] else 0  # Check if total_returns is None

        # Calculate the difference
        difference = total_sales - total_returns

        # Add salesperson data to the list
        if returns:
            _id = returns[0]['_id']
        else:
            _id = None

        # Add salesperson data to the list
        salespersons_data.append({
            'salesperson': salesperson.sales_person,
            'salesroute': salesperson.Route,
            'plate': [sale['Plate_number'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            'Q_CASH': [sale['Q_CASH'] for sale in sales],
            'H_CASH': [sale['H_CASH'] for sale in sales],
            'ONE_CASH': [sale['ONE_CASH'] for sale in sales],
            'TWO_CASH': [sale['TWO_CASH'] for sale in sales],
            'Total_CASH': [sale['Total_CASH'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            "_id": _id,  # Use the _id from the first return in the list
            'total_sales': total_sales,
            'total_returns': total_returns,
            'difference': difference,
            'sales': sales,
            'returns': returns
        })

    # Return the data
    return Response(salespersons_data)






@api_view(['GET'])
def calculate_all_salespersons_debt_clear(request):
    salespersons = SalesPerson.objects.all()

    salespersons_data = []

    for salesperson in salespersons:
        # Get all sales made by the SalesPerson
        sales = AADDSalesOrderSerializer(AADDSalesOrder.objects.filter(SalesPerson=salesperson), many=True).data

        returns = InventoryReturnFormSerializer(InventoryReturnForm.objects.filter(SalesPerson=salesperson, is_clear=True), many=True).data

        # Calculate the total sales
        total_sales_result = AADDSalesOrder.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_sales = total_sales_result['total'] if total_sales_result['total'] else 0  # Check if total_sales is None

        # Calculate the total returns
        total_returns_result = InventoryReturnForm.objects.filter(SalesPerson=salesperson).aggregate(
            total=Sum('Totalp'))
        total_returns = total_returns_result['total'] if total_returns_result['total'] else 0  # Check if total_returns is None

        # Calculate the difference
        difference = total_sales - total_returns

        # Add salesperson data to the list
        if returns:
            _id = returns[0]['_id']
        else:
            _id = None

        # Add salesperson data to the list
        salespersons_data.append({
            'salesperson': salesperson.sales_person,
            'salesroute': salesperson.Route,
            'plate': [sale['Plate_number'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            'Q_CASH': [sale['Q_CASH'] for sale in sales],
            'H_CASH': [sale['H_CASH'] for sale in sales],
            'ONE_CASH': [sale['ONE_CASH'] for sale in sales],
            'TWO_CASH': [sale['TWO_CASH'] for sale in sales],
            'Total_CASH': [sale['Total_CASH'] for sale in sales],
            'Qp': [sale['Qp'] for sale in sales],
            'Hp': [sale['Hp'] for sale in sales],
            'ONEp': [sale['ONEp'] for sale in sales],
            'TWOp': [sale['TWOp'] for sale in sales],
            'Totalp': [sale['Totalp'] for sale in sales],
            "_id": _id,  # Use the _id from the first return in the list
            'total_sales': total_sales,
            'total_returns': total_returns,
            'difference': difference,
            'sales': sales,
            'returns': returns
        })

    # Return the data
    return Response(salespersons_data)




@api_view(['GET'])
def calculate_salespersons_debt(request, salesperson_pk):
    salesperson = SalesPerson.objects.get(_id=salesperson_pk)

    # Get all sales made by the SalesPerson
    sales = AADDSalesOrder.objects.filter(SalesPerson=salesperson).values(
        'Plate_number__plate_no',
        'sales_Route',
        'Qp',
        'Hp',
        'ONEp',
        'TWOp',
        'Totalp',
        'Q_CASH',
        'H_CASH',
        'ONE_CASH',
        'TWO_CASH',
        'Total_CASH'
    )



    # Get all returns made by the SalesPerson
    returns = InventoryReturnForm.objects.filter(SalesPerson=salesperson).values(
        'Qp',
        'Hp',
        'ONEp',
        'TWOp',
        'Totalp',
        'recipant'
    )

    #access code 

   # Calculate the total sales
    total_sales = AADDSalesOrder.objects.filter(SalesPerson=salesperson).aggregate(
        total=Sum('Totalp'))['total']
    total_sales = total_sales if total_sales else 0  # Check if total_sales is None

# Calculate the total returns
    total_returns = InventoryReturnForm.objects.filter(SalesPerson=salesperson).aggregate(
        total=Sum('Totalp'))['total']
    total_returns = total_returns if total_returns else 0  # Check if total_returns is None

# Calculate the difference
    difference = total_sales - total_returns
    # Serialize the data
    serializer = SalespersonDebtSerializer({
        'salesperson': salesperson.sales_person,
     
        'total_sales': total_sales,
        'total_returns': total_returns,
        'difference': difference,
        'sales': sales,
        'returns': returns
    })

    return Response(serializer.data) 


from datetime import datetime



@api_view(['GET'])
def calculate_daily_sales_performance_by_id(request, customer_id):
    try:
        # Get the current date and time
        now = timezone.now()
        # Calculate the time 24 hours ago
        past_24_hours = now - timedelta(hours=24)
        # Fetch WebCustomers with their respective sales targets
        customer = WebCustomer.objects.get(_id=customer_id)
        # Collect sales performance data for the customer

        # Get sales orders for the customer within the past 24 hours
        sales_orders_24_hours = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__range=(past_24_hours, now)
        )

        # Get sales orders for the customer within the current month
        sales_orders_current_month = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__month=now.month,
            created_at__year=now.year
        )

        # Get sales orders for the customer within the current year
        sales_orders_current_year = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__year=now.year
        )

        # Calculate total_p for each time range
        total_p_24_hours = sales_orders_24_hours.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        total_p_current_month = sales_orders_current_month.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        total_p_current_year = sales_orders_current_year.aggregate(total_p=Sum('Totalp'))['total_p'] or 0

        # Calculate the sales targets for this customer
        sales_target = float(customer.sales_target) if customer.sales_target else 0

        # Calculate daily, monthly, and annual sales performance
        daily_sales_performance = (total_p_24_hours / sales_target) * 100 if sales_target != 0 else 0
        monthly_sales_performance = (total_p_current_month / sales_target) * 100 if sales_target != 0 else 0
        annual_sales_performance = (total_p_current_year / sales_target) * 100 if sales_target != 0 else 0

        # Create a dictionary with the sales performance data
        result = {
            "Customer ID": customer._id,
            "Daily Sales Performance": str(daily_sales_performance) + "%",
            "Monthly Sales Performance": str(monthly_sales_performance) + "%",
            "Annual Sales Performance": str(annual_sales_performance) + "%",
        }

        # Create an instance of AgentSalesPerfomanceMeasureSerializer with the result
        serializer = AgentSalesPerfomanceMeasureSerializer(data=result)
        serializer.is_valid(raise_exception=True)

        # Return the serialized data as a JSON response
        return Response(serializer.data)

    except WebCustomer.DoesNotExist:
        return Response({"error": "Customer does not exist"}, status=404)

@api_view(['GET'])
def calculate_sales_performance(request):
    # Get the current date and time
    now = timezone.now()
    # Calculate the time 24 hours ago
    past_24_hours = now - timedelta(hours=24)
    # Calculate the start and end date for the current month
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    end_of_month = start_of_month.replace(
        day=calendar.monthrange(now.year, now.month)[1],
        hour=23,
        minute=59,
        second=59,
        microsecond=999999
    )
    # Calculate the start and end date for the current year
    start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
    end_of_year = start_of_year.replace(
        month=12,
        day=calendar.monthrange(now.year, 12)[1],
        hour=23,
        minute=59,
        second=59,
        microsecond=999999
    )
    
    # Fetch WebCustomers with their respective sales targets
    customers = WebCustomer.objects.all()
    # Collect sales performance data for all customers
    sales_performance_data = []
    for customer in customers:
        # Get the sales orders for this customer within the past 24 hours
        sales_orders_24_hours = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__range=(past_24_hours, now)
        )
        # Get the sales orders for this customer within the current month
        sales_orders_current_month = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__range=(start_of_month, end_of_month)
        )
        # Get the sales orders for this customer within the current year
        sales_orders_current_year = SalesOrder.objects.filter(
            customers_name=customer,
            created_at__range=(start_of_year, end_of_year)
        )
        
        # Calculate the total cash for sales orders of this customer within the past 24 hours
        total_p_24_hours = sales_orders_24_hours.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        # Calculate the total cash for sales orders of this customer within the current month
        total_p_current_month = sales_orders_current_month.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        # Calculate the total cash for sales orders of this customer within the current year
        total_p_current_year = sales_orders_current_year.aggregate(total_p=Sum('Totalp'))['total_p'] or 0
        
        # Calculate the sales targets for this customer
        sales_target = float(customer.sales_target) if customer.sales_target else 0
        
        # Calculate daily, monthly, and annual sales performance
        daily_sales_performance = (total_p_24_hours / sales_target) * 100 if sales_target != 0 else 0
        monthly_sales_performance = (total_p_current_month / sales_target) /25  * 100 if sales_target != 0 else 0
        annual_sales_performance = (total_p_current_year / sales_target) /310 * 100 if sales_target != 0 else 0
        
        # Store the sales performance data for this customer
        result = {
          
            "Customer ID": customer._id,
            "Daily Sales Performance": str(daily_sales_performance) + "%",
            "Monthly Sales Performance": str(monthly_sales_performance) + "%",
            "Annual Sales Performance": str(annual_sales_performance) + "%",
        }
        sales_performance_data.append(result)
    
    # Return all the collected sales performance data as a JSON response
    return JsonResponse(sales_performance_data, safe=False)
    

class DailySalesPerformanceAchievementByCustomerView(APIView):
    def get(self, request, customer_id):
        try:
            # Filter AgentSalesPerfomanceMeasure instances for the given customer ID
            instances = AgentSalesPerfomanceMeasure.objects.filter(customer_id=customer_id)
        except AgentSalesPerfomanceMeasure.DoesNotExist:
            return Response({"error": "AgentSalesPerfomanceMeasure not found"}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)        
        if now.hour < 7:
            start_time -= timedelta(days=1)       
        end_time = start_time + timedelta(days=1)
        results = []
        for instance in instances:
            sales_in_24_hours = SalesOrder.objects.filter(customers_name=instances, created_at__range=(start_time, end_time))  
           
          
            total_sales_past_24_hours = sales_in_24_hours.aggregate(total_sales=Sum('Totalp'))['total_sales'] or 0
            print( total_sales_past_24_hours)        
            if instance.daily_sales_performance_qty_expectation != 0:
                print(instance.daily_sales_performance_qty_expectation)
                daily_sales_achievement = (total_sales_past_24_hours / instance.daily_sales_performance_qty_expectation) * 100
            else:
                daily_sales_achievement = 0
            # Update the instance field with the calculated achievement
            instance.daily_sales_performance_qty_achievement = daily_sales_achievement
            instance.save()
            serializer = AgentSalesPerfomanceMeasureSerializer(instance)
            results.append(serializer.data)
        return Response(results, status=status.HTTP_200_OK)


        
class DailySalesPerformanceAchievementForAllCustomers(APIView):
    def get(self, request):
        try:
            # Get all WebCustomer instances
            customers = WebCustomer.objects.all()
        except WebCustomer.DoesNotExist:
            return Response({"error": "WebCustomer not found"}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        start_time = datetime(now.year, now.month, now.day, 7, 0, 0)
        
        if now.hour < 7:
            start_time -= timedelta(days=1)
        
        end_time = start_time + timedelta(days=1)

        results = []
        for customer in customers:
            instances = AgentSalesPerfomanceMeasure.objects.filter(customer=customer)

            for instance in instances:
                sales_in_24_hours = SalesOrder.objects.filter(customers_name_id=customer, created_at__range=(start_time, end_time))
                
                total_sales_past_24_hours = sales_in_24_hours.aggregate(total_sales=Sum('Totalp'))['total_sales']
                
                print(total_sales_past_24_hours)
                if instance.daily_sales_performance_qty_expectation != 0:
                    daily_sales_achievement = (total_sales_past_24_hours / instance.daily_sales_performance_qty_expectation) * 100
                else:
                    daily_sales_achievement = 0

                # Update the instance field with the calculated achievement
                instance.daily_sales_performance_qty_achievement = daily_sales_achievement
                instance.save()

                serializer = AgentSalesPerfomanceMeasureSerializer(instance)
                results.append(serializer.data)

        return Response(results, status=status.HTTP_200_OK)



@api_view(['POST'])
def create_Raw_Material(request):
    # Create a mutable copy of the request data
    data = request.data.copy()
    
    # Define a list of fields that should allow empty strings
    fields_allow_empty_string = [
        'Preform_14gm', 'Preform_18gm', 'Preform_28gm', 'Preform_40gm',
        'Shrink_35gm', 'Shrink_38gm', 'Shrink_42gm', 'Shrink_48gm',
        'Label_035ml', 'Label_06ml', 'Label_1Lgm', 'Label_2L', 'Caps',
        'FG_Standardized_035ml','FG_Standardized_06ml','FG_Standardized_1l',
        'FG_Standardized_2l', 'FG_Standardized_Total', 'FG_Damaged_035ml',
        'FG_Damaged_06ml','FG_Damaged_1L','FG_Damaged_2l','FG_Damaged_Total',
    ]
    
    # Convert empty strings to None for numeric fields
    for field in fields_allow_empty_string:
        if field in data and data[field] == '':
            data[field] = None
    
    # Initialize boolean fields
    is_caps =  any(data.get(field) for field in ['Caps'])
    is_preform = any(data.get(field) for field in ['Preform_14gm', 'Preform_18gm', 'Preform_28gm', 'Preform_40gm'])
    is_shrink = any(data.get(field) for field in ['Shrink_35gm', 'Shrink_38gm', 'Shrink_42gm', 'Shrink_48gm'])
    is_label = any(data.get(field) for field in ['Label_035ml', 'Label_06ml', 'Label_1Lgm', 'Label_2L'])
    is_fg_standardized = any(data.get(field) for field in ['FG_Standardized_035ml', 'FG_Standardized_06ml', 'FG_Standardized_1l', 'FG_Standardized_2l', 'FG_Standardized_Total'])
    is_fg_damaged_total = any(data.get(field) for field in ['FG_Damaged_035ml', 'FG_Damaged_06ml', 'FG_Damaged_1L', 'FG_Damaged_2l', 'FG_Damaged_Total'])

    rawmaterial = RawMaterialRequest.objects.create(
        issue_store=data.get('issue_store'),
        recipant_store=data.get('recipant_store'),
        Preform_14gm=data.get('Preform_14gm'),
        Preform_18gm=data.get('Preform_18gm'),
        Preform_28gm=data.get('Preform_28gm'),
        Preform_40gm=data.get('Preform_40gm'),
        time=data.get('time'),
        Shrink_35gm=data.get('Shrink_35gm'),
        Shrink_38gm=data.get('Shrink_38gm'),
        Shrink_42gm=data.get('Shrink_42gm'),
        Shrink_48gm=data.get('Shrink_48gm'),
        Label_035ml=data.get('Label_035ml'),
        Label_06ml=data.get('Label_06ml'),
        Label_1Lgm=data.get('Label_1Lgm'),
        Label_2L=data.get('Label_2L'),
        FG_Standardized_035ml=data.get('FG_Standardized_035ml'),
        FG_Standardized_06ml=data.get('FG_Standardized_06ml'),
        FG_Standardized_1L=data.get('FG_Standardized_1l'),
        FG_Standardized_2l=data.get('FG_Standardized_2l'),
        FG_Standardized_Total=data.get('FG_Standardized_Total'),
        FG_Damaged_035ml=data.get('FG_Damaged_035ml'),
        FG_Damaged_06ml=data.get('FG_Damaged_06ml'),
        FG_Damaged_1L=data.get('FG_Damaged_1L'),
        FG_Damaged_2l=data.get('FG_Damaged_2l'),
        FG_Damaged_Total=data.get('FG_Damaged_Total'),
        Caps=data.get('Caps'),
        
        is_Caps=is_caps,
        is_Preform=is_preform,
        is_Shrink=is_shrink,
        is_Label=is_label,
        is_FG_Standardized=is_fg_standardized,
        is_FG_Damaged_Total=is_fg_damaged_total,
    )
    
    serializer = RawMaterialRequestSerializer(rawmaterial)
    return Response(serializer.data)

@api_view(['GET'])
def fetch_load_raw_material(request):
    raw = RawMaterialRequest.objects.filter(is_loaded=False, is_await=True)
    rawSerializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(rawSerializer.data)

@api_view(['PUT'])
def load_raw_material(request, pk):
    data = request.data 
    raw = RawMaterialRequest.objects.get(_id=pk)
    raw.Driver = data['Driver']
    raw.Plate = data['Plate']
    raw.is_loaded = True
    raw.save()
    serializer = RawMaterialRequestSerializer(raw, context={'request': request})
    return Response(serializer.data)



@api_view(['GET'])
def access_raw_material(request, pk):
    raw = RawMaterialRequest.objects.filter(recipant_store=pk, is_loaded=True, is_await=True)
    rawSerializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(rawSerializer.data)
    
@api_view(['GET'])
def all_access_raw_material(request):
    raw = RawMaterialRequest.objects.all()
    rawSerializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(rawSerializer.data)
    
@api_view(['GET'])
def aggregate_data_inventory(request):
    # List of fields you want to aggregate
    fields_to_aggregate = [
        'Preform_14gm', 'Preform_18gm', 'Preform_28gm', 'Preform_40gm',
        'Shrink_35gm', 'Shrink_38gm', 'Shrink_42gm', 'Shrink_48gm',
        'Label_035ml', 'Label_06ml', 'Label_1Lgm', 'Label_2L', 'Caps',
        'FG_Standardized_035ml', 'FG_Standardized_06ml', 'FG_Standardized_1L', 'FG_Standardized_2l',
        'FG_Damaged_035ml', 'FG_Damaged_06ml', 'FG_Damaged_1L', 'FG_Damaged_2l',
    ]
    # Get the choices from the warehouse field
    recipant_stores = [choice[0] for choice in RawMaterialRequest._meta.get_field('recipant_store').choices]
    # Dictionary to store aggregated values
    aggregated_values = {}
    # Dictionary to store total across all recipant stores
    total_values = {field: 0 for field in fields_to_aggregate}

    # Loop through each recipant_store
    for recipant_store in recipant_stores:
        # Filter RawMaterialRequest instances for the current recipant_store
        requests_for_recipant_store = RawMaterialRequest.objects.filter(recipant_store=recipant_store, is_accepted=True)
        # Initialize the dictionary for the current recipant_store
        aggregated_values[recipant_store] = {}
        # Loop through each field and calculate the sum
        for field in fields_to_aggregate:
            aggregated_value = requests_for_recipant_store.aggregate(Sum(field))[f'{field}__sum']
            aggregated_values[recipant_store][field] = aggregated_value
            # Add the value to the total
            total_values[field] += aggregated_value

    # Add the total values to the response
    aggregated_values['Total'] = total_values

    # Convert the dictionary to a JSON response
    json_response = JsonResponse(aggregated_values)

    # Return the JSON response
    return json_response



@api_view(['GET'])
def aggregate_data_inventory(request):
    # List of fields you want to aggregate
    fields_to_aggregate = [
        'Preform_14gm', 'Preform_18gm', 'Preform_28gm', 'Preform_40gm',
        'Shrink_35gm', 'Shrink_38gm', 'Shrink_42gm', 'Shrink_48gm',
        'Label_035ml', 'Label_06ml', 'Label_1Lgm', 'Label_2L', 'Caps',
        'FG_Standardized_035ml', 'FG_Standardized_06ml', 'FG_Standardized_1L', 'FG_Standardized_2l',
        'FG_Damaged_035ml', 'FG_Damaged_06ml', 'FG_Damaged_1L', 'FG_Damaged_2l',
    ]
    # Get the choices from the warehouse field
    recipant_stores = [choice[0] for choice in RawMaterialRequest._meta.get_field('recipant_store').choices]
    # Dictionary to store aggregated values
    aggregated_values = {}
    # Dictionary to store total across all recipant stores
    total_values = {field: 0 for field in fields_to_aggregate}

    # Loop through each recipant_store
    for recipant_store in recipant_stores:
        # Filter RawMaterialRequest instances for the current recipant_store
        requests_for_recipant_store = RawMaterialRequest.objects.filter(recipant_store=recipant_store, is_accepted=True)
        # Initialize the dictionary for the current recipant_store
        aggregated_values[recipant_store] = {}
        # Loop through each field and calculate the sum
        for field in fields_to_aggregate:
            aggregated_value = requests_for_recipant_store.aggregate(Sum(field))[f'{field}__sum']
            # Check if aggregated_value is None and replace it with 0
            aggregated_value = aggregated_value if aggregated_value is not None else 0
            aggregated_values[recipant_store][field] = aggregated_value
            # Add the value to the total
            total_values[field] += aggregated_value

    # Add the total values to the response
    aggregated_values['Total'] = total_values

    # Convert the dictionary to a JSON response
    json_response = JsonResponse(aggregated_values)

    # Return the JSON response
    return json_response


from django.db.models import Q
@api_view(['GET'])
def access_raw_material(request, pk):
    raw = RawMaterialRequest.objects.filter(Q(recipant_store=pk) & (Q(is_approved=False)),  is_loaded=True)
    raw_serializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(raw_serializer.data)
    
@api_view(['GET'])
def all_access_raw_material(request):
    raw = RawMaterialRequest.objects.all()
    rawSerializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(rawSerializer.data)


@api_view(['GET'])
def status_raw_material(request, pk):
    raw = RawMaterialRequest.objects.filter(issue_store=pk, is_accepted=False)
    rawSerializer = RawMaterialRequestSerializer(raw, many=True)
    return Response(rawSerializer.data)
    
@api_view(['PUT'])
def approve_raw_material(request, pk):
    data = request.data 
    raw = RawMaterialRequest.objects.get(_id=pk)
    raw.issue_store_file = data['issue_store_file']
    raw.is_await=False
    raw.is_approved=True
    raw.save()
    serializer = RawMaterialRequestSerializer(raw)
    return Response(serializer.data)
@api_view(['PUT'])
def accept_raw_material(request, pk):
    data = request.data
    raw = get_object_or_404(RawMaterialRequest, pk=pk)
    
    # Get or create issue store stock
    issue_store, created = WarehouseStock.objects.get_or_create(warehouse=raw.issue_store)
    # Get or create recipient store stock
    recipient_store, created = WarehouseStock.objects.get_or_create(warehouse=raw.recipant_store)
    
    fields_to_update = [
        'Caps', 'Preform_14gm', 'Preform_18gm', 'Preform_28gm', 'Preform_40gm',
        'Shrink_35gm', 'Shrink_38gm', 'Shrink_42gm', 'Shrink_48gm',
        'Label_035ml', 'Label_06ml', 'Label_1Lgm', 'Label_2L',
        'FG_Standardized_035ml', 'FG_Standardized_06ml', 'FG_Standardized_1L', 'FG_Standardized_2l',
        'FG_Damaged_035ml', 'FG_Damaged_06ml', 'FG_Damaged_1L', 'FG_Damaged_2l'
    ]
    
    for field in fields_to_update:
        issue_store_value = getattr(issue_store, field, 0)
        recipient_store_value = getattr(recipient_store, field, 0)
        transfer_value = getattr(raw, field, 0)
        
        if transfer_value:
            new_issue_store_value = issue_store_value + transfer_value
            setattr(issue_store, field, new_issue_store_value)
            
            new_recipient_store_value = recipient_store_value - transfer_value
            setattr(recipient_store, field, new_recipient_store_value)
    
    issue_store.save()
    recipient_store.save()
    
    raw.issue_store_file = data.get('issue_store_file', raw.issue_store_file)
    raw.recipant_store_file = data.get('recipant_store_file', raw.recipant_store_file)
    raw.is_accepted = True
    raw.is_ready = True
    raw.save()
    
    serializer = RawMaterialRequestSerializer(raw, context={'request': request})
    return Response(serializer.data)




@api_view(['PUT'])
def reject_raw_material(request, pk):
    raw = RawMaterialRequest.objects.get(_id=pk)
    raw.is_return=True 
    raw.is_await=False
    raw.save()
    serializer = RawMaterialRequestSerializer(raw)
    return Response(serializer.data)



from django.db.models import F, Value, CharField, IntegerField
from django.db.models import F, Value, CharField
from itertools import chain

class CombinedTransactionView(APIView):
    def get(self, request, *args, **kwargs):
        # Query LedgerDeposit
        ledger_deposits = LedgerDeposit.objects.annotate(
            transaction_ref=F('Bank_Reference_Number'),
            transaction_date=F('created_at'),
            transaction_amount=F('Deposit_Amount'),
            balance=F('Balance'),
            transaction_type=Value('Deposit', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Query SalesOrder
        sales_orders = SalesOrder.objects.annotate(
            transaction_ref=F('_id'),
            transaction_date=F('created_at'),
            transaction_amount=F('Total_CASH'),
            balance=F('Grand_Total_CASH'),
            transaction_type=Value('SalesOrder', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Query AADDSalesOrder
        aadd_sales_orders = AADDSalesOrder.objects.annotate(
            transaction_ref=F('_id'),
            transaction_date=F('created_at'),
            transaction_amount=F('Total_CASH'),
            balance=F('Total_CASH'),
            transaction_type=Value('AADDSalesOrder', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Combine the querysets and sort by date
        combined_transactions = sorted(
            chain(ledger_deposits, sales_orders, aadd_sales_orders),
            key=lambda x: x['transaction_date'],
            reverse=True
        )

        serializer = TransactionSerializer(combined_transactions, many=True)
        return Response(serializer.data)


from django.db.models import F, Value, CharField, Q
from itertools import chain
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime

class FilteredCombinedTransactionView(APIView):
    def get(self, request, *args, **kwargs):
        transaction_ref = request.GET.get('transaction_ref')
        transaction_id = request.GET.get('transaction_id')
        transaction_type = request.GET.get('transaction_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Convert dates to datetime objects if provided
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')

        # Query LedgerDeposit
        ledger_deposits = LedgerDeposit.objects.annotate(
            transaction_ref=F('Bank_Reference_Number'),
            transaction_date=F('created_at'),
            transaction_amount=F('Deposit_Amount'),
            balance=F('Balance'),
            transaction_type=Value('Deposit', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Query SalesOrder
        sales_orders = SalesOrder.objects.annotate(
            transaction_ref=F('_id'),
            transaction_date=F('created_at'),
            transaction_amount=F('Total_CASH'),
            balance=F('Totalp'),
            transaction_type=Value('SalesOrder', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Query AADDSalesOrder
        aadd_sales_orders = AADDSalesOrder.objects.annotate(
            transaction_ref=F('_id'),
            transaction_date=F('created_at'),
            transaction_amount=F('Total_CASH'),
            balance=F('Totalp'),
            transaction_type=Value('AADDSalesOrder', output_field=CharField()),
            transaction_id=F('_id')
        ).values('transaction_ref', 'transaction_date', 'transaction_amount', 'balance', 'transaction_type', 'transaction_id')

        # Combine the querysets
        combined_transactions = list(chain(ledger_deposits, sales_orders, aadd_sales_orders))

        # Apply filters
        if transaction_ref:
            combined_transactions = [t for t in combined_transactions if t['transaction_ref'] == transaction_ref]

        if transaction_id:
            combined_transactions = [
                t for t in combined_transactions if t['transaction_id'] == int(transaction_id)
            ]

        if transaction_type:
            combined_transactions = [t for t in combined_transactions if t['transaction_type'] == transaction_type]
        if start_date:
            combined_transactions = [t for t in combined_transactions if t['transaction_date'] >= start_date]
        if end_date:
            combined_transactions = [t for t in combined_transactions if t['transaction_date'] <= end_date]
        # Sort by date (optional, if you want to return the results sorted)
        combined_transactions = sorted(combined_transactions, key=lambda x: x['transaction_date'], reverse=True)
        serializer = TransactionSerializer(combined_transactions, many=True)
        return Response(serializer.data)
