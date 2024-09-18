from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters import rest_framework as filters
from .models import RawMaterialRequest, SalesOrder, AADDSalesOrder, WarehouseStock
from serializer.serializers import RawMaterialRequestSerializer, SalesOrderSerializer, AADDSalesOrderSerializer, WarehouseStocksSerializer
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

class FilteredCombinedSalesOrderView(APIView):
    def get(self, request, *args, **kwargs):
        customer_name = request.query_params.get('customer_name', None)
        salesperson = request.query_params.get('salesperson', None)
        totalp = request.query_params.get('totalp', None)
        total_cash = request.query_params.get('total_cash', None)
        sales_route = request.query_params.get('sales_route', None)

        # Initialize filters
        sales_order_filter = Q()
        aadd_sales_order_filter = Q()

        # Apply filters based on parameters
        if customer_name:
            sales_order_filter &= Q(customers_name__customer_name__icontains=customer_name)

        if salesperson:
            aadd_sales_order_filter &= Q(SalesPerson__sales_person__icontains=salesperson)  # Adjust 'name' to the correct field name

        if sales_route:
            sales_order_filter &= Q(sales_Route__icontains=sales_route)
            aadd_sales_order_filter &= Q(sales_Route__icontains=sales_route)

        if sales_route:
            sales_order_filter &= Q(sales_Route__icontains=sales_route)
            aadd_sales_order_filter &= Q(sales_Route__icontains=sales_route)

        if totalp:
            try:
                totalp = float(totalp)
                sales_order_filter &= Q(Totalp=totalp)
                aadd_sales_order_filter &= Q(Totalp=totalp)
            except ValueError:
                print("Invalid value for totalp. It should be a number.")

        if total_cash:
            try:
                total_cash = float(total_cash)
                sales_order_filter &= Q(Total_CASH=total_cash)
                aadd_sales_order_filter &= Q(Total_CASH=total_cash)
            except ValueError:
                print("Invalid value for total_cash. It should be a number.")

        
        # Query SalesOrder and AADDSalesOrder based on the provided parameters
        sales_orders = SalesOrder.objects.filter(sales_order_filter) if customer_name else SalesOrder.objects.none()
        aadd_sales_orders = AADDSalesOrder.objects.filter(aadd_sales_order_filter) if salesperson else AADDSalesOrder.objects.none()

        # Serialize results
        sales_order_serializer = SalesOrderSerializer(sales_orders, many=True)
        aadd_sales_order_serializer = AADDSalesOrderSerializer(aadd_sales_orders, many=True)

        # Combine results
        combined_results = {
            'sales_orders': sales_order_serializer.data,
            'aadd_sales_orders': aadd_sales_order_serializer.data
        }

        return Response(combined_results, status=status.HTTP_200_OK)
    
from datetime import datetime


class FilteredSalesOrderView(APIView):
    def get(self, request, *args, **kwargs):
        customer_name = request.query_params.get('customer_name', None)
        sales_route = request.query_params.get('sales_route', None)
        totalp = request.query_params.get('Totalp', None)
        total_cash = request.query_params.get('Total_CASH', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        filters = Q()
        
        if customer_name:
            filters &= Q(customers_name__customer_name__icontains=customer_name)
        if sales_route:
            filters &= Q(sales_Route__icontains=sales_route)
        if totalp:
            filters &= Q(Totalp=totalp)
        if total_cash:
            filters &= Q(Total_CASH=total_cash)
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            filters &= Q(created_at__gte=start_date)
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            filters &= Q(created_at__lte=end_date)
        
        sales_orders = SalesOrder.objects.filter(filters)
        serializer = SalesOrderSerializer(sales_orders, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)    


class FilteredAADSSalesOrderView(APIView):
    def get(self, request, *args, **kwargs):
        SalesPerson = request.query_params.get('SalesPerson', None)
        Plate_number = request.query_params.get('Plate_number', None)
        sales_route = request.query_params.get('sales_route', None)
        totalp = request.query_params.get('Totalp', None)
        total_cash = request.query_params.get('Total_CASH', None)
        start_date = request.query_params.get('start_date', None)
        end_date = request.query_params.get('end_date', None)

        filters = Q()
        
        if SalesPerson:
            filters &= Q(SalesPerson__sales_person__icontains=SalesPerson)
        if Plate_number:
            filters &= Q(Plate_number__plate_no__icontains=Plate_number)
        if sales_route:
            filters &= Q(sales_Route__icontains=sales_route)
        if totalp:
            filters &= Q(Totalp=totalp)
        if total_cash:
            filters &= Q(Total_CASH=total_cash)
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            filters &= Q(created_at__gte=start_date)
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
            filters &= Q(created_at__lte=end_date)
        
        sales_orders = AADDSalesOrder.objects.filter(filters)
        serializer = AADDSalesOrderSerializer(sales_orders, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)



class RawMaterialListView(generics.ListAPIView):
    queryset = RawMaterialRequest.objects.filter(is_accepted=True)
    serializer_class = RawMaterialRequestSerializer
    ordering_fields = ['created_at']

class RawMaterialRequestFilter(filters.FilterSet):
    issue_store = filters.CharFilter(field_name='issue_store', lookup_expr='exact')
    recipant_store = filters.CharFilter(field_name='recipant_store', lookup_expr='exact')
    is_Preform = filters.BooleanFilter(field_name='is_Preform', lookup_expr='exact')
    is_Shrink = filters.BooleanFilter(field_name='is_Shrink', lookup_expr='exact')
    is_Label = filters.BooleanFilter(field_name='is_Label', lookup_expr='exact')
    is_Caps = filters.BooleanFilter(field_name='is_Caps', lookup_expr='exact')
    is_FG_Standardized = filters.BooleanFilter(field_name='is_FG_Standardized', lookup_expr='exact')
    is_FG_Damaged_Total = filters.BooleanFilter(field_name='is_FG_Damaged_Total', lookup_expr='exact')
    start_date = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = RawMaterialRequest
        fields = [
            'issue_store',
            'recipant_store',
            'is_Preform',
            'is_Shrink',
            'is_Label',
            'is_Caps',
            'is_FG_Standardized',
            'is_FG_Damaged_Total',
            'start_date',
            'end_date',
        ]

class RawMaterialRequestListView(generics.ListAPIView):
    queryset = RawMaterialRequest.objects.filter(is_accepted=True)
    serializer_class = RawMaterialRequestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RawMaterialRequestFilter



    
class WarehouseStockListView(APIView):
    def get(self, request, *args, **kwargs):
        stocks = WarehouseStock.objects.all()
        serializer = WarehouseStocksSerializer(stocks, many=True)
        
        # Create a dictionary to store the response data
        response_data = {}
        
        # Iterate through the serialized data and structure it
        for stock in serializer.data:
            warehouse_name = stock.pop('warehouse')
            response_data[warehouse_name] = stock
        
        # Add the total calculations
        total = {
            "Preform_14gm": sum(stock['Preform_14gm'] for stock in response_data.values()),
            "Preform_18gm": sum(stock['Preform_18gm'] for stock in response_data.values()),
            "Preform_28gm": sum(stock['Preform_28gm'] for stock in response_data.values()),
            "Preform_40gm": sum(stock['Preform_40gm'] for stock in response_data.values()),
            "Shrink_35gm": sum(stock['Shrink_35gm'] for stock in response_data.values()),
            "Shrink_38gm": sum(stock['Shrink_38gm'] for stock in response_data.values()),
            "Shrink_42gm": sum(stock['Shrink_42gm'] for stock in response_data.values()),
            "Shrink_48gm": sum(stock['Shrink_48gm'] for stock in response_data.values()),
            "Label_035ml": sum(stock['Label_035ml'] for stock in response_data.values()),
            "Label_06ml": sum(stock['Label_06ml'] for stock in response_data.values()),
            "Label_1Lgm": sum(stock['Label_1Lgm'] for stock in response_data.values()),
            "Label_2L": sum(stock['Label_2L'] for stock in response_data.values()),
            "Caps": sum(stock['Caps'] for stock in response_data.values()),
            "FG_Standardized_035ml": sum(stock['FG_Standardized_035ml'] for stock in response_data.values()),
            "FG_Standardized_06ml": sum(stock['FG_Standardized_06ml'] for stock in response_data.values()),
            "FG_Standardized_1L": sum(stock['FG_Standardized_1L'] for stock in response_data.values()),
            "FG_Standardized_2l": sum(stock['FG_Standardized_2l'] for stock in response_data.values()),
            "FG_Damaged_035ml": sum(stock['FG_Damaged_035ml'] for stock in response_data.values()),
            "FG_Damaged_06ml": sum(stock['FG_Damaged_06ml'] for stock in response_data.values()),
            "FG_Damaged_1L": sum(stock['FG_Damaged_1L'] for stock in response_data.values()),
            "FG_Damaged_2l": sum(stock['FG_Damaged_2l'] for stock in response_data.values())
        }
        
        response_data["Total"] = total
        
        return Response(response_data, status=status.HTTP_200_OK)