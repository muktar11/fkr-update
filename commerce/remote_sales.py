



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





