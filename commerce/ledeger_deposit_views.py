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
    AgentSalesPerfomanceMeasureSerializer,
    LedgerDepositSerializer
)
import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics
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
from datetime import datetime



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
        preexisting_balance = preexisting_ledger_entry.Balance if preexisting_ledger_entry else 0
        customer_id = preexisting_ledger_entry.customers_name_id if preexisting_ledger_entry else None
    except LedgerDeposit.DoesNotExist:
        preexisting_balance = 0
        customer_id = None

    unapproved_deposit_exists = LedgerDeposit.objects.filter(customers_name=customer, finance_approved=False, finance_returned=False).exists()
    if unapproved_deposit_exists:
        return Response({'error': 'Please approve your previous deposit by finance before making a new deposit.'}, status=status.HTTP_400_BAD_REQUEST)

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
        Balance=preexisting_balance,
        previous_balance=preexisting_balance  # Set the previous_balance to the latest balance
    )
    
    serializer = LedgerDepositSerialzier(ledger, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


from django.core.files.uploadedfile import SimpleUploadedFile
from json import loads
import logging

@api_view(['POST'])
def mobile_create_ledger_deposit(request, pk):
    try:        
        customer = WebCustomer.objects.get(_id=pk)
        # Access individual fields from request.POST
        bank_name = request.POST.get('Bank_Name', '')
        bank_ref_num = request.POST.get('Bank_Reference_Number', '')
        deposit_amount = request.POST.get('Deposit_Amount', 0)
        narrative = request.POST.get('Narrative', '')
        branch_name = request.POST.get('Branch_Name', '')
        deposit_date_str = request.POST.get('Deposit_Date', '')
        # Handle deposit date parsing
        try:
            deposit_date = datetime.strptime(deposit_date_str, '%m/%d/%Y').strftime('%Y-%m-%d')
        except ValueError:
            return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
        mobile_payment_file = request.FILES.get('file', None)
        # Check if Bank_Reference_Number exists
        if LedgerDeposit.objects.filter(Bank_Reference_Number=bank_ref_num).exists():
            return Response({'error': 'Bank reference number already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        # Get preexisting balance for the customer
        preexisting_balance = LedgerDeposit.objects.filter(customers_name=customer).aggregate(Sum('Deposit_Amount'))
        balance = preexisting_balance['Deposit_Amount__sum'] if preexisting_balance['Deposit_Amount__sum'] else 0

        # Create ledger deposit
        ledger = LedgerDeposit.objects.create(
            customers_name=customer,
            Bank_Name=bank_name,
            Deposit_Amount=deposit_amount,
            Narrative=narrative,
            Branch_Name=branch_name,
            Bank_Reference_Number=bank_ref_num,
            Deposit_Date=deposit_date,
            Balance=balance,
            is_mobile=True,
            created_at=datetime.now()
        )

        # Handle file upload
        if mobile_payment_file:
            ledger.mobile_payment = mobile_payment_file  # Simply assign the file directly
            ledger.save()
        # Serialize and return the response
        serializer = LedgerDepositSerialzier(ledger, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except WebCustomer.DoesNotExist:
        return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error for debugging
        print(f"Error occurred: {e}")
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



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
    ledger.finance_approved = True
    ledger.finance_returned = False
    ledger.Balance += int(ledger.Deposit_Amount)  # Add the deposit amount to the ledger balance
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
        ledger = LedgerDeposit.objects.filter(customers_name=customer).last()
        if ledger:
            serializer = LedgerDepositSerialzier(ledger, context={'request': request})
            return Response(serializer.data)
        else:
            return Response({'Balance': 0})
    except WebCustomer.DoesNotExist:
        return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
    except LedgerDeposit.DoesNotExist:
        return Response({'error': 'Ledger not found for the customer'}, status=status.HTTP_404_NOT_FOUND)
    


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
    

class LedgerDepositFilter(django_filters.FilterSet):
    customers_name = django_filters.CharFilter(field_name='customers_name__name', lookup_expr='icontains')
    Bank_Name = django_filters.CharFilter(field_name='Bank_Name', lookup_expr='icontains')
    Deposit_Amount = django_filters.NumberFilter(field_name='Deposit_Amount', lookup_expr='exact')
    Deposit_Date_Start = django_filters.DateFilter(field_name='Deposit_Date', lookup_expr='gte')
    Deposit_Date_End = django_filters.DateFilter(field_name='Deposit_Date', lookup_expr='lte')
    Balance = django_filters.NumberFilter(field_name='Balance', lookup_expr='exact')

    class Meta:
        model = LedgerDeposit
        fields = ['customers_name', 'Bank_Name', 'Deposit_Amount', 'Deposit_Date_Start', 'Deposit_Date_End', 'Balance']

import logging
logger = logging.getLogger(__name__)


class LedgerDepositListView(generics.ListAPIView):
    queryset = LedgerDeposit.objects.all()
    serializer_class = LedgerDepositSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = LedgerDepositFilter 

    def get_queryset(self):
        queryset = super().get_queryset()
        customers_name = self.request.query_params.get('customers_name')
        Bank_Name = self.request.query_params.get('Bank_Name')
        Deposit_Amount = self.request.query_params.get('Deposit_Amount')
        Deposit_Date_Start = self.request.query_params.get('Deposit_Date_Start')
        Deposit_Date_End = self.request.query_params.get('Deposit_Date_End')
        Balance = self.request.query_params.get('Balance')

        logger.debug(f'Filtering with: customers_name={customers_name}, Bank_Name={Bank_Name}, Deposit_Amount={Deposit_Amount}, Deposit_Date_Start={Deposit_Date_Start}, Deposit_Date_End={Deposit_Date_End}, Balance={Balance}')
        
        if customers_name:
            queryset = queryset.filter(customers_name__icontains=customers_name)
        if Bank_Name:
            queryset = queryset.filter(Bank_Name__icontains=Bank_Name)
        if Deposit_Amount:
            queryset = queryset.filter(Deposit_Amount=Deposit_Amount)
        if Deposit_Date_Start:
            queryset = queryset.filter(Deposit_Date__gte=Deposit_Date_Start)
        if Deposit_Date_End:
            queryset = queryset.filter(Deposit_Date__lte=Deposit_Date_End)
        if Balance:
            queryset = queryset.filter(Balance=Balance)

        logger.debug(f'Filtered queryset: {queryset}')
        return queryset 
    

@api_view(['GET'])
def LedgerDepositListView(request):
    customer_name = request.query_params.get('customer_name', '')
    Bank_Name = request.query_params.get('Bank_Name', '')
    start_Deposit_Date = request.query_params.get('start_Deposit_Date', None)
    end_Deposit_Date = request.query_params.get('end_Deposit_Date', None)

    # Initialize queryset
    queryset = LedgerDeposit.objects.all()

    # Apply filters if provided
    if customer_name:
        queryset = queryset.filter(customers_name__icontains=customer_name)  # Ensure customers_name is a field in LedgerDeposit

    if Bank_Name:
        queryset = queryset.filter(Bank_Name__icontains=Bank_Name)  # Ensure Bank_Name is a field in LedgerDeposit

    if start_Deposit_Date:
        try:
            start_Deposit_Date = datetime.strptime(start_Deposit_Date, '%Y-%m-%d').date()
            queryset = queryset.filter(Deposit_Date__gte=start_Deposit_Date)
        except ValueError:
            return Response({"error": "Invalid value for start_Deposit_Date"}, status=400)
    
    if end_Deposit_Date:
        try:
            end_Deposit_Date = datetime.strptime(end_Deposit_Date, '%Y-%m-%d').date()
            queryset = queryset.filter(Deposit_Date__lte=end_Deposit_Date)
        except ValueError:
            return Response({"error": "Invalid value for end_Deposit_Date"}, status=400)
    
    # Serialize the results
    serializer = LedgerDepositSerialzier(queryset, many=True)
    return Response(serializer.data)