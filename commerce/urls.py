from django.urls import path

from . import sales_order_views
from . import views
from .views import SalesOrderTotalCashView
from . import ledeger_deposit_views
from . import aadd_sales_order_view
from . import sales_report_view
urlpatterns = [
    path('sales-order/create/<str:pk>/', sales_order_views.create_sales_order),
    path('remote-sales-order/create/<str:pk>/<str:pks>/', sales_order_views.create_remote_sales_order),
    path('remote-sales-order/update/<str:pk>/', sales_order_views.update_remote_sales_order),
    path('remote-sales-order/reject/<str:pk>/', sales_order_views.reject_remote_sales_order),
    path('sales-order-remote-view', sales_order_views.sales_order_remote_view),
    path('remote-sales-order-approve-view/<str:pk>/', sales_order_views.remote_sales_order_approve_create_view),
    path('rejected-remote-sales-order-view', sales_order_views.sales_order_remote_rejected_view),
    path('retrieve-remote-sales-order-view-by-supervisor/<str:pk>/', sales_order_views.retrieve_remote_sales_order_by_supervisor),

    path('sales-order/update/<str:pk>/', sales_order_views.update_sales_order),
    path('sales-order/<int:pk>/', sales_order_views.retrieve_sales_order_by_id),
    path('sales-order/<int:pk>/', sales_order_views.retrieve_sales_order_by_id),
    path('sales-order/', sales_order_views.retrieve_sales_order_all),
   
    path('sales-order/smd-view_aa', sales_order_views.sales_order_smd_view_aa),
    path('sales-order/smd-view_upc', sales_order_views.sales_order_smd_view_upc),
    path('sales-order/sdm-create/<str:pk>/', sales_order_views.sdm_approve_create_view),
    path('sales-order/sdm-approve/<int:pk>/', sales_order_views.sdm_approve_retrieve_view_by_id),
    path('sales-order/sdm-approve/', sales_order_views.sdm_approve_retrieve_all),
    path('sales-order-status-view/<int:pk>/', sales_order_views.sales_order_status_view),
    path('ledger-deposit/<str:pk>/', ledeger_deposit_views.create_ledger_deposit),
    path('ledger-deposit/approve/notify', ledeger_deposit_views.ledger_deposit_approve_view),
   
    path('mobile-ledger-deposit/<str:pk>/', ledeger_deposit_views.mobile_create_ledger_deposit),
   
    path('update-ledger-deposit/<str:pk>/', ledeger_deposit_views.update_ledger_deposit),
    path('ledger-deposit-approve-view', ledeger_deposit_views.retireve_finance_ledger_view),
    path('mobile-ledger-deposit-approve-view', ledeger_deposit_views.retireve_mobile_finance_ledger_view),
    path('return-mobile-ledger-deposit-approve-view', ledeger_deposit_views.returned_mobile_finance_ledger_view),
    path('ledger-deposit-rejected-view', ledeger_deposit_views.retireve_finance_ledger_rejected_view),
    path('ledger-deposit-approve/<str:pk>/', ledeger_deposit_views.approve_ledger_request),
    path('ledger-deposit-reject/<str:pk>/', ledeger_deposit_views.reject_ledger_request),
    path('ledger-deposit-view/<str:customer_id>/', ledeger_deposit_views.retrieve_customer_ledger_balance),
    path('ledger-deposit-history-view/<str:customer_id>/', ledeger_deposit_views.retrieve_customer_ledger_history),
    path('ledger-deposit-view/', ledeger_deposit_views.retrieve_all_customers_ledger_balances),
    path('ledger-deposits/filter/', ledeger_deposit_views.LedgerDepositListView, name='ledger-deposit-filter'),
    
  
    path('filtered-combined-sales-orders/', sales_report_view.FilteredCombinedSalesOrderView.as_view(), name='filtered-combined-sales-orders'),
    path('filtered-agent-sales-orders/', sales_report_view.FilteredSalesOrderView.as_view(), name='filtered-combined-sales-orders'),
    path('filtered-aads-sales-orders/', sales_report_view.FilteredAADSSalesOrderView.as_view(), name='filtered-combined-sales-orders'),
    path('raw-material-data/', sales_report_view.RawMaterialListView.as_view(), name='raw-material-request-list'),
    path('raw-material-requests-filter/', sales_report_view.RawMaterialRequestListView.as_view(), name='raw-material-request-list'),
    path('warehouse-stocks-data/', sales_report_view.WarehouseStockListView.as_view(), name='warehouse-stocks'),

    path('sales-order/sdm-rejects/', sales_order_views.retrieve_reject_sdm_view),
    path('sales-order/sdm-rejects/<str:pk>/', sales_order_views.sdm_approve_reject_view),
    path('sales-order/finance-rejects/<str:pk>/', sales_order_views.finance_approve_reject_view),


    path('sales-order/finance-view', sales_order_views.sales_order_finance_view),
    path('sales-order/finance-create/<str:pk>/', sales_order_views.finance_approve_create_view),
    path('sales-order/finance-approve/<int:pk>/', sales_order_views.finance_approve_retrieve_view_by_id),
    path('sales-order/finance-approve/', sales_order_views.finance_approve_retrieve_all),
    path('sales-order/finance-manager-view', sales_order_views.sales_order_finance_manager_view),
    path('sales-order/finance-manager-create/<str:pk>/', sales_order_views.finance_manager_approve_create_view),
    path('sales-order/finance-manager-approve/<int:pk>/', sales_order_views.finance_manager_approve_retrieve_by_id),
    path('sales-order/finance-manager-approve/', sales_order_views.finance_manager_approve_retrieve_all),
    path('access-finance-inventory-list', sales_order_views.finance_manager_approve_retrieve_all),
    path('access-finance-inventory-list/aa/', sales_order_views.finance_manager_retrieve_aa),
    path('access-finance-inventory-list/upc/', sales_order_views.finance_manager_retrieve_upc),
    path('create-finance-inventory-form/<str:pk>/', sales_order_views.finance_inventory_create),  
    path('AADD-finance-manager-logistics-view', sales_order_views.access_logistic_aadd_view),
    path('AADD-finance-manager-logistics-create/<str:pk>/', sales_order_views.create_logisitc_aadd_view),
    path('create-finance-inventory-form-AdissAbaba/<str:pk>/', sales_order_views.finance_inventory_create_AdissAbaba), 
    path('create-finance-inventory-form-Agena/<str:pk>/', sales_order_views.finance_inventory_create_Agena), 
  #  path('create-finance-inventory-form-Wolkete/<str:pk>/', sales_order_views.finance_inventory_create_Wolkete),  
 ##   path('get-inventory-return', aadd_sales_order_view.get_inventory_return),  

    path('sales-person/create/', views.create_sales_person),
    path('sales-person/approve/<str:pk>/', views.approve_sales_person),
    path('sales-person-retrieve/', views.retrieve_sales_person_all),
    path('sales-person-retrieve-id', views.retrieve_sales_person_id),
    path('sales-person-view/', views.sales_person_approve_view),

    path('plate/create/', views.create_plate),
    path('plate/approve/<str:pk>/', views.approve_plate),
    path('plate-retrieve/', views.retrieve_plate_all),
    path('plate-retrieve-id', views.retrieve_plate_id),
    path('plate-view', views.plates_approve_view),

    path('set-price/', views.SetPriceCreateUpdateView.as_view(), name='set-price'),
    path('setprice/<str:sales_route>/', views.SetPriceDetailView.as_view(), name='setprice-detail'),
    path('sort_price/<str:route_pk>/', views.access_price_route, name="sort-price"),
    path('all_price/<str:route_pk>/', views.all_access_price_route, name="all-sort-price"),
    path('latest-price-view/', views.access_latest_price, name='access-set-price-access'),
    path('set-price-view/', views.retrieve_price_all, name='set-price-access'),

   
    path('sales-order-retrieve-daily', views.retrieve_sales_order_by_Daily),
    path('sales-order-retrieve-monthly', views.retrieve_sales_order_by_Monthly),
    path('sales-order-retrieve-customer-daily/<int:customer_id>/<str:item>/<str:cash>/', views.retrieve_sales_order_by_customer_Daily),

    path('sales-order-retrieve-customer-daily/<str:customer_id>/<str:sales_route>/<str:qp>/<str:hp>/<str:onep>/<str:twop>/<str:q_cash>/<str:h_cash>/<str:one_cash>/<str:two_cash>/', views.retrieve_sales_order_by_customer_Daily),
    path('sales-order-by-sales-route/', views.retrieve_sales_order_by_sales_route, name='sales_order_by_sales_route'),
    path('sales-order-by-sales-market/', views.retrieve_sales_order_by_market, name='sales_order_by_sales_route'),
    path('sales-order-by-sales-info/', views.retrieve_sales_order_all_info, name='sales_order_by_sales_info'),
    path('sales-order-by-sales-info-Dashboard/', views.retrieve_sales_order_all_item_info_Dashboard, name='sales_order_by_sales_info'),
    path('sales-order-by-sales-item-info/', views.retrieve_sales_order_all_item_info, name='sales_order_by_sales_item_info'),
    path('sales-order-recent-transaction', views.recent_transaction ), 
   
    

    path('sales-order/daily/', views.retrieve_sales_order_by_Daily, name='retrieve_sales_order_by_customer_daily'),
    path('sales-orders/daily/<int:customer_id>/', views.retrieve_sales_order_by_daily_filter_by_customer),
    path('sales-orders/daily/<str:sales_route>/', views.retrieve_sales_order_by_daily_filter_by_sales_route),
    path('sales-order/<str:customer_id>/<str:sales_route>/', views.retrieve_sales_order_by_daily_filter, name='retrieve_sales_order_by_daily_filter'),
    path('AADD-sales-order/daily/', views.retrieve_Direct_sales_order_by_Daily, name='retrieve_sales_order_by_customer_daily'),
    path('AADD-sales-orders/<int:sales_person_id>/', views.retrieve_Direct_sales_order_by_daily_filter_by_salesPerson, name='sales_orders_by_sales_person'),
    path('AADD-sales-order/daily/<str:sales_route>/', views.retrieve_Direct_sales_order_by_daily_filter_by_sales_route, name='retrieve_aaddsales_order_by_route_daily'),
    
    path('add_total_cash/', SalesOrderTotalCashView.as_view(), name='add_total_cash'),
    path('sales-order/monthly/', views.retrieve_sales_order_by_Monthly, name='retrieve_sales_order_by_customer_daily'),
    path('sales-orders/monthly/<int:customer_id>/', views.retrieve_sales_order_by_Monthly_filter_by_customer),
    path('sales-orders/monthly/<str:sales_route>/', views.retrieve_sales_order_by_Monthly_filter_by_sales_route),
    path('AADD-sales-order/monthly/', views.retrieve_Direct_sales_order_by_Monthly, name='retrieve_sales_order_by_customer_daily'),
    path('AADD-sales-orders/monthly/<int:sales_person_id>/', views.retrieve_Direct_sales_order_by_monthly_filter_by_salesPerson, name='sales_orders_by_sales_person'),
    path('AADD-sales-order/monthly/<str:sales_route>/', views.retrieve_Direct_sales_order_by_monthly_filter_by_sales_route, name='retrieve_aaddsales_order_by_route_daily'),

    path('sales-order/annual/', views.retrieve_sales_order_by_Annual, name='retrieve_sales_order_by_customer_daily'),
    path('sales-orders/annual/<int:customer_id>/', views.retrieve_sales_order_by_Annual_filter_by_customer),
    path('sales-orders/annual/<str:sales_route>/', views.retrieve_sales_order_by_Annual_filter_by_sales_route),
    path('AADD-sales-order/annual/', views.retrieve_Direct_sales_order_by_Annual, name='retrieve_sales_order_by_customer_daily'),
    path('AADD-sales-orders/annual/<int:sales_person_id>/', views.retrieve_Direct_sales_order_by_Annual_filter_by_salesPerson, name='sales_orders_by_sales_person'),
    path('AADD-sales-order/annual/<str:sales_route>/', views.retrieve_Direct_sales_order_by_Annual_filter_by_sales_route, name='retrieve_aaddsales_order_by_route_daily'),

    path('sales-order/timeframe/<str:start_date>/<str:end_date>/', views.retrieve_sales_order_by_custom_date, name='retrieve_sales_order_by_customer_daily'),
    path('sales-orders/timeframe/<int:customer_id>/<str:start_date>/<str:end_date>/', views.retrieve_sales_order_by_custom_date_filter_by_customer),
    path('sales-orders/timeframe/<str:sales_route>/<str:start_date>/<str:end_date>/', views. retrieve_sales_order_by_custom_date_filter_by_sales_route),
    path('AADD-sales-order/timeframe/<str:start_date>/<str:end_date>/', views.retrieve_Direct_sales_order_by_TimeBreakDown, name='retrieve_sales_order_by_customer_daily'),
    path('AADD-sales-orders/timeframe/<int:sales_person_id>/<str:start_date>/<str:end_date>/', views.retrieve_Direct_sales_order_by_daily_filter_by_salesPerson, name='sales_orders_by_sales_person'),
    path('AADD-sales-order/timeframe/<str:sales_route>/<str:start_date>/<str:end_date>/', views.retrieve_TimeBreakDown_sales_order_by_filter_by_sales_route, name='retrieve_aaddsales_order_by_route_daily'),


    path('sales-order/daily/<str:customer_id>/<str:sales_route>/', views.retrieve_sales_order_by_Daily, name='retrieve_sales_order_by_customer_daily'),
    #create direct sales 
    path('create-AADDSales_Order/<int:salesperson_pk>/<int:plate_pk>/', aadd_sales_order_view.create_AADDSales_Order, name="create_AADDSales_Order"),
    #view direct sales
    path('smd-approve/aadd', aadd_sales_order_view.smd_approve_view_AADD),
    #approve smd approve
    path('smd-approve/AADD/<int:pk>/', aadd_sales_order_view.smd_approve_AADD, name="smd_approve_AADD"),
    # reject sdm approve
    path('sdm-approve-addd-reject-view/<int:pk>/', aadd_sales_order_view.sdm_approve_aadd_reject_view),
    # retrieve all reject sdm approve views
    path('smd-approve_view_AADD', aadd_sales_order_view.smd_approve_view_AADD),
    #retrieve finance smd views
    path('fm_approve_view', aadd_sales_order_view.fm_approve_view_AADD),
    # finance approve 
    path('fm_approve/<int:pk>/', aadd_sales_order_view.fm_approve_AADD),
    #Inventory view AADD
    path('AADD-finance-manager-retrieve-view', aadd_sales_order_view.aadd_finance_manager_invenroty_retrieve_all),
    # inventory AADD Approve 
    path('AADD-finance-manager-approve-create/<str:pk>/', aadd_sales_order_view.AADD_finance_inventory_create),
    # inventory AADD retrieve
    path('access-inventory-list', aadd_sales_order_view.access_inventory_form),
    #inventory AADD Create
    path('create-inventory-form/<str:pk>/', aadd_sales_order_view.create_inventory_return),
     path('api/orders/<int:pk>/undo-inventory-return/', aadd_sales_order_view.undo_inventory_return, name='undo-inventory-return'),
    #Reload salesOrder
    path('all-aads-sales', aadd_sales_order_view.ALL_AADS, name='reload_aadds_order'),
    path('reload-AADD-SalesOrder/<int:pk>/', aadd_sales_order_view.Reload_AADDSales_Order, name='reload_aadds_order'),
    path('update-reload-AADD-SalesOrder/<int:pk>/', aadd_sales_order_view.Update_Reload_AADDSales_Order, name='reload_aadds_order'),
    # AADD Finance verification view 

##    path('finance-inventory-lists', sales_order_views.finance_inventory_access),
    # create pending for customer
    path('customerdebitforms/<int:inventory_id>/<int:customer_id>/', views.create_customer_debit_form, name='create-customer-debit-form'),
    # update inventory return
    path('update-inventory-return/<str:pk>/', aadd_sales_order_view.update_inventory_return),
    # update inventory return
    path('undo-inventory-return/<int:pk>/', aadd_sales_order_view.undo_inventory_returns),
    #  inventory view
    path('customerdebitforms/access', views.get_customer_debit_form, name='get-customer-debit-form'),
    # pending inventory pay 
    path('update-pending-inventoy-return/<str:pk>/', views.update_pending_inventory_return),
    # finance AADS Approve
     path('access-inventory-customer-list', views.finance_customer_debt),
    # create AADS SUMMARY 
    path('finance-manager-inventory-list-approve', views.aadd_finance_inventory_retrieve_all),

    path('finance-manager-inventory-list-return/<str:pk>/', aadd_sales_order_view.AADD_finance_inventory_return),
    # CLEAR AADS SUMMARY RETRIEVE
    path('clear-inventory-return', aadd_sales_order_view.clear_inventory_return),

    path('update_AADDSales_Order/<int:salesperson_pk>/<int:plate_pk>/', aadd_sales_order_view.Update_AADDSales_Order, name="update_AADDSales_Order"),
    path('update-aadd-sales-order/<int:pk>/', aadd_sales_order_view.Update_AADDSales_Order),
    path('retireve-reject-add_sdm_view', aadd_sales_order_view.retrieve_reject_aadd_sdm_view),
    path('sdm-approve-addd-reject-view/<int:pk>/', aadd_sales_order_view.sdm_approve_aadd_reject_view), 
    path('smd-access', aadd_sales_order_view.access_aadd), 

    path('update_aadd_finance_inventory_retrieve_all/<str:pk>/', aadd_sales_order_view.update_aadd_finance_inventory_retrieve_all),
  
    path('AADD-finance-manager-approve-retrieve', aadd_sales_order_view.aadd_finance_inventory_retrieve_all),
   
    path('state-salesperson', views.get_state_salesPerson),
    path('calculate-salesperson-debt/<int:salesperson_pk>/', views.calculate_salesperson_debt, name='calculate_salesperson_debt'),
    path('calculate-all-salespersons-debt/', views.calculate_all_salespersons_debt, name='calculate_all_salespersons_debt'),
    path('calculate-all-salespersons-debt-pending/', views.calculate_all_salespersons_debt_pending, name='calculate_all_salespersons_debt'),
    path('calculate-all-salespersons-debt-clear/', views.calculate_all_salespersons_debt_pending, name='calculate_all_salespersons_debt'),
    path('calculate-salespersons-debt/', views.calculate_salespersons_debt, name='calculate_salespersons_debt'),
    path('pending-inventory-return', aadd_sales_order_view.pending_inventory_return),
    path('finance-inventory-lists', sales_order_views.finance_inventory_access),
    path('finance-inventory-list-approve', aadd_sales_order_view.finance_inventory_form_approve), 
    path('access-inventory-customer-list', views.finance_customer_debt),
   
    

   
    path('pending-inventory-return', views.pending_inventory_return),
    path('finance-inventory-list', views.finance_inventory_form),
    path('finance-inventory-list-approve', views.finance_inventory_form_approve), 
    path('access-inventory-customer-list', views.finance_customer_debt),
   
    

    path('chart-data/<str:data_type>/', views.pie_chart_data, name='chart-data'),
    path('sales-order-line-chart/<str:time_period>/', views.SalesOrderLineChartView.as_view(), name='sales-order-line-chart'),
    path('get-latest-price/<str:sales_Route>/<str:warehouse>/', views.get_latest_price, name='get-latest-price'),
    path('get-latest-price/<str:sales_Route>/', views.get_latest_price, name='get-latest-price-by-sales-route'),
    path('get-latest-price/', views.get_latest_price, name='get-latest-price-no-params'),  # Endpoint for handling no params

    path('agent_sales_performance/<int:customer_id>/', views.calculate_daily_sales_performance_by_id, name='agent-sales-performance-detail'),
    path('all-agent_sales_performance/', views.calculate_sales_performance, name='agents-sales-performance-details'),
    # Add other URLs if needed

  #create direct sales 
    path("create-rawmtaerial/", views.create_Raw_Material, name="create-raw"),
    path("fetch-rawmtaerial/", views.fetch_load_raw_material, name="create-raw"),
    path("load-rawmtaerial/<str:pk>/", views.load_raw_material, name="create-raw"),
    path("access-rawmtaerial/<str:pk>/", views.access_raw_material, name="access-raw"),
    path("status-rawmtaerial/<str:pk>/", views.status_raw_material, name="status-raw"),
    path("approve-rawmtaerial/<int:pk>/", views.approve_raw_material, name="approve-raw"),
    path("accepted-rawmtaerial/<int:pk>/", views.accept_raw_material, name="approve-raw"),
    path("reject-rawmtaerial/<int:pk>/", views.approve_raw_material, name="approve-raw"),
    path("data-rawmtaerial/", views.aggregate_data_inventory, name="approve-raw"),

    path('combined-transactions/', views.CombinedTransactionView.as_view(), name='combined-transactions'),
    path('combined-transactions/filter/', views.FilteredCombinedTransactionView.as_view(), name='combined-trasaction-filter'),

    # Add other URLs if needed
]

