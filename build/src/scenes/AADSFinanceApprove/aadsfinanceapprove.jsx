import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import useMediaQuery from "@mui/material/useMediaQuery";



const AADSFinanceApprove = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [CSI_CSRI_Number, setCSI_CSRI_Number] = useState("");
  const [BankName, setBankName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");

  const [CSI_CSRI_Number_Clear, setCSI_CSRI_Number_Clear] = useState("");
  const [BankName_Clear, setBankName_Clear] = useState("");
  const [Amount_Clear, setAmount_Clear] = useState("");
  const [Bank_Reference_Number_Clear, setBankReferenceNumber_Clear] = useState("");
  const [Deposit_Date_Clear, setDeposit_Date_Clear] = useState("");
  const [payment_Clear, setPayment_Clear] = useState("");

  const [is_pending, setis_pending] = useState("");
  const [is_clear, setis_clear] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomers] = useState('');
  const [Qp, setQp] = useState(0);
  const [Hp, setHp] = useState(0);
  const [ONEp, setONEp] = useState(0);
  const [TWOp, setTWOp] = useState(0);
  const [Q_CASH, setQ_CASH] = useState(0);
  const [H_CASH, setH_CASH] = useState(0);
  const [ONE_CASH, setONE_CASH] = useState(0);
  const [TWO_CASH, setTWO_CASH] = useState(0);
  const [Totalp, setTotalp] = useState(0);
  const [TotalCash, setTotalCash] = useState(0);
  const [due_date, setdue_date] = useState("");
  const [issues, setissues] = useState("");
  const [recipient, setrecipient] = useState("");

  useEffect(() => {
    // Fetching customer data from API
    fetch(process.env.REACT_APP_API_URL+'/commerce/access-inventory-customer-list')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/finance-manager-inventory-list-approve");
        
        const data = await response.json();
        setCustomerData(data.sales_orders); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);


  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/finance-manager-inventory-list-approve");
      const data = await response.json();
      setCustomerData(data);

    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };


  const sales_orders = customerData || [];
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "SalesPerson", headerName: "Sales Person", flex: 1 },
    { field: "Plate_number", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "Qp", flex: 1 },
    { field: "Hp", headerName: "Hp", flex: 1 },
    { field: "ONEp", headerName: "ONEp", flex: 1 },
    { field: "TWOp", headerName: "TWOp", flex: 1 },
    { field: "Totalp", headerName: "Totalp", flex: 1 },
  ];

  const getRowId = (row) => row._id;


  const handleDebit = async (id) => {
    try {
  
    const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/undo-inventory-return/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issues: issues,
        }),
      });
      const data = await response.json();
      console.log("Sales Order approved successfully:", data);
      toast.success("Order has been sent to Finance!");
      handleUpdateClick()
      handleCloseModal()
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error sending order to Pending:", error);
      toast.error("Error sending order to Finance");
    }
  };

  // Assuming there is only one inventory_return_form in the sales_order
  const handleApprove = async (id) => {
    console.log(id);
    try {
      const inventoryReturnFormId = sales_orders[0]?.inventory_return_forms?.[0]?._id;
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/update_aadd_finance_inventory_retrieve_all/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Sales Order approved successfully:", data);
        toast.success("Sales Order Approved successfully");
        handleUpdateClick()
        handleCloseModal()
        // You can update the customerData state or perform any other action here
      } else {
        console.error("Error approving Sales Order:", data.error);
        toast.error("Error approving Sales Order: " + data.error);
      }
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };

const handleRowClick = (params) => {
  setSelectedRow(params.row);
};

const handleCustomerChange = (event) => {
  setSelectedCustomers(event.target.value);
};

const handleIsPendingChange = (event) => {
  if (event.target.checked) {
    setis_pending(true);
    setis_clear(false);
  } else {
    setis_pending(false);
  }
};

const handleIsClearChange = (event) => {
  if (event.target.checked) {
    setis_clear(true);
    setis_pending(false);
  } else {
    setis_clear(false);
  }
};

const handleCloseModal = () => {
  setSelectedRow(null);
};

const noPending = selectedRow?.inventory_return_forms?.[0]?.no_pending || 0;
const repetitionArray = Array.from({ length: parseInt(noPending) }, (_, i) => i);

const deduction = selectedRow?.inventory_return_forms?.[0]?.deductions[0];
let allDeductionsClear = true;

// Check if any deduction is not clear
selectedRow?.inventory_return_forms?.[0]?.deductions.forEach((deduction) => {
  if (!deduction.is_clear) {
    allDeductionsClear = false;
  }
});

return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" AADS Sales Verification"
        subtitle="List of orders that requires verification"
      /> 
      <Box
        m=" 0 0 0"
        height="100vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            height: "10vh",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: colors.greenAccent[200] + " !important",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100] + " !important",
          },
        }}
      >

        <DataGrid
          rows={sales_orders}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
          pagination
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onRowClick={handleRowClick}
        />
      </Box>
      <Modal open={selectedRow !== null} onClose={handleCloseModal}>
      <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",        
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

    width: "60%",
    Maxwidth: "800px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    height:"600px",
    overflow: "auto",
  }}
>
  {selectedRow && (
    <div>
  <TableContainer component={Paper}>
  <div style={{ textAlign: 'center', padding: '10px' }}>
    <Header
      title="AADD Sales Order Verification"
      subtitle="Order Detail that requires Approval"
    />
  </div>
  <Table sx={{}} size="small" aria-label="a dense table">
  <TableHead>
  <Header
      title="Sales Order"
    />
    <TableRow>
    <TableCell>SalesPerson</TableCell>
    <TableCell>{selectedRow.SalesPerson}</TableCell>
    <TableCell>{selectedRow._number}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>Plate</TableCell>
    <TableCell>{selectedRow.Plate_number}</TableCell>
    <TableCell>{selectedRow._number}</TableCell>

  </TableRow>

  <TableRow>
    <TableCell>SalesRoute</TableCell>
    <TableCell>{selectedRow.sales_Route}</TableCell>
    <TableCell>{selectedRow._number}</TableCell>
  </TableRow>

  <TableRow>
    <TableCell>035ml</TableCell>
    <TableCell>{selectedRow.Qp}(Qty)</TableCell>
    <TableCell>{selectedRow.Q_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>0.6ml </TableCell>
    <TableCell>{selectedRow.Hp}(Qty)</TableCell>
    <TableCell>{selectedRow.H_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>1L</TableCell>
    <TableCell>{selectedRow.ONEp}(Qty)</TableCell>
    <TableCell>{selectedRow.ONE_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>2L </TableCell>
    <TableCell>{selectedRow.TWOp}(Qty)</TableCell>
     <TableCell>{selectedRow.TWO_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Total</TableCell>
    <TableCell>{selectedRow.Totalp}(Qty)</TableCell>
    <TableCell>{selectedRow.Total_CASH}(Value)</TableCell>
  </TableRow>


  <Header
      title="Sales Return"
    />
  <TableRow>
    <TableCell>035ml Qty (Sales Return)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Qp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Q_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>0.6ml Qty (Sales Return)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Hp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.H_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>1L Qty (Sales Return)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.ONEp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.ONE_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>2L Qty (Sales Return)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.TWOp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.TWO_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Total (Sales Return)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Totalp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Total_CASH}(Value)</TableCell>
  </TableRow>
 
  

  <Header
      title="SalesPerson Sales"
    />
    <TableRow>
    <TableCell>035ml(Sales Person)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_Qp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_Q_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>0.6ml  (Sales Person)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_Hp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_H_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>1L(Sales Person)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_ONEp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_ONE_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>2L (Sales Person)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_TWOp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_TWO_CASH}(Value)</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Total (Sales Person)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_Totalp}(Qty)</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.sold_Total_CASH}(Value)</TableCell>
  </TableRow>
  

  <TableRow>
    <TableCell>Payment</TableCell>
    <TableCell>
    <a href={selectedRow?.inventory_return_forms?.[0]?.payment} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
        {selectedRow?.inventory_return_forms?.[0]?.payment}
      </a>
    </TableCell>
  </TableRow>


  <TableRow>
    <TableCell>CSI/CSRI Number</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Number}</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Num}</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Amount</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Amount}</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Num}</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Bank Reference Number </TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Bank_reference_Number}</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Num}</TableCell>
  </TableRow>
  <TableRow>
    <TableCell>Deposit Date</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.Deposit_Date}</TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Num}</TableCell>
  </TableRow>

  
  <React.Fragment> 
    {selectedRow?.inventory_return_forms?.[0]?.deductions.map((deduction) => (
      <React.Fragment key={deduction._id}>
        <Header title="Customer Purchase Information" />
        <TableRow>
          <TableCell>Customer</TableCell>
          <TableCell>{deduction.customer}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SalesPerson</TableCell>
          <TableCell>{deduction.Inventory}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>SalesRoute</TableCell>
          <TableCell>{deduction.sales_Route}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tin Number</TableCell>
          <TableCell>{deduction.tin_numbers}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Registration Number</TableCell>
          <TableCell>{deduction.reg_numbers}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Due Date</TableCell>
          <TableCell>{deduction.due_date}</TableCell>
          <TableCell>{deduction.custom}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>0.35ml</TableCell>
          <TableCell>{deduction.Qp}(Qty)</TableCell>
          <TableCell>{deduction.Q_CASH}(Value)</TableCell>
          
        </TableRow>
        <TableRow>
          <TableCell>0.6ml</TableCell>
          <TableCell>{deduction.Hp}(Qty)</TableCell>
          <TableCell>{deduction.H_CASH}(Value)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>1L</TableCell>
          <TableCell>{deduction.ONEp}(Qty)</TableCell>
          <TableCell>{deduction.ONE_CASH}(Value)</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2L</TableCell>
          <TableCell>{deduction.TWOp}(Qty)</TableCell>
          <TableCell>{deduction.TWO_CASH}(Value)</TableCell>
        </TableRow>
        <TableRow>
    <TableCell>Payment</TableCell>
    <TableCell>
    <a href=  {deduction.payment} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
        {deduction.payment}
      </a>
  
      
    </TableCell>
    <TableCell>{selectedRow?.inventory_return_forms?.[0]?.CSI_CSRI_Num}</TableCell>
  </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{deduction.Totalp}(Qty)</TableCell>
          <TableCell>{deduction.Total_CASH}(Value)</TableCell>
        </TableRow>
      
        <TableRow>
          <TableCell>Is Clear</TableCell>
          <TableCell>{deduction.Total_CAH}</TableCell>
          <TableCell>
    {deduction.is_clear ? (
      <button style={{  borderRadius: "5px",
      backgroundColor: "Green",
      color: "white",
      border: "none",
      cursor: "pointer",
      width: "100px",
      height: "30px",
      marginLeft: "10px", }}>Clear</button>
    ) : (
      <button style={{  borderRadius: "5px",
      backgroundColor: "red",
      color: "white",
      border: "none",
      cursor: "pointer",
      width: "100px",
      height: "30px",
      marginLeft: "10px", }}>Pending</button>
    )}
  </TableCell>
        </TableRow>
        
        {/* Add more table rows as needed */}
      </React.Fragment>
    ))}
  </React.Fragment>


  <TableCell>
    <input
      type="text"
      placeholder="issue"
      value={issues}
      onChange={(e) => setissues(e.target.value)}
      // Add your input field logic here
      style={{
        // Add your styling properties here
        border: '1px solid black',
        padding: '8px',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
      }}
    
    />
  </TableCell>


<TableRow>
  <TableCell align="left">
      <Button
        key={selectedRow._id}
        variant="contained"
        color="primary"
        onClick={() => handleDebit(selectedRow._id)}
        style={{
          borderRadius: "5px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100px",
          height: "40px",
          marginLeft: "10px",
        }}
      >
        Return
      </Button>
    
  </TableCell>
  
  <TableCell align="right">
  <Button
  key={selectedRow._id}
  variant="contained"
  color="primary"
  onClick={() => handleApprove(selectedRow._id)}
  style={{
    borderRadius: "5px",
    backgroundColor: allDeductionsClear ? "#00BFFF" : "gray",
    color: "white",
    border: "none",
    cursor: allDeductionsClear ? "pointer" : "not-allowed",
    width: "100px",
    height: "40px",
    marginRight: "10px",
  }}
  disabled={!allDeductionsClear} // Disable the button if any deduction is not clear
>
  Clear
</Button>
  </TableCell>
</TableRow> 
</TableHead>
  </Table>
  </TableContainer>
  
      
    </div>
  )}
</Box>
      </Modal>
    </Box>
  );
};

export default AADSFinanceApprove;

/*
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import useMediaQuery from "@mui/material/useMediaQuery";



const MobileInventoryVerificationPage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [CSI_CSRI_Number, setCSI_CSRI_Number] = useState("");
  const [BankName, setBankName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");

  const [CSI_CSRI_Number_Clear, setCSI_CSRI_Number_Clear] = useState("");
  const [BankName_Clear, setBankName_Clear] = useState("");
  const [Amount_Clear, setAmount_Clear] = useState("");
  const [Bank_Reference_Number_Clear, setBankReferenceNumber_Clear] = useState("");
  const [Deposit_Date_Clear, setDeposit_Date_Clear] = useState("");
  const [payment_Clear, setPayment_Clear] = useState("");

  const [is_pending, setis_pending] = useState("");
  const [is_clear, setis_clear] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomers] = useState('');
  const [Qp, setQp] = useState(0);
  const [Hp, setHp] = useState(0);
  const [ONEp, setONEp] = useState(0);
  const [TWOp, setTWOp] = useState(0);
  const [Q_CASH, setQ_CASH] = useState(0);
  const [H_CASH, setH_CASH] = useState(0);
  const [ONE_CASH, setONE_CASH] = useState(0);
  const [TWO_CASH, setTWO_CASH] = useState(0);
  const [Totalp, setTotalp] = useState(0);
  const [TotalCash, setTotalCash] = useState(0);
  const [due_date, setdue_date] = useState("");
  const [issues, setissues] = useState("");

  useEffect(() => {
    // Fetching customer data from API
    fetch('http://localhost:8000/commerce/access-inventory-customer-list')
      .then((response) => response.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/finance-inventory-list");
        const data = await response.json();
        setCustomerData(data.inventory_return_forms); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  const inventoryReturnForms = customerData || [];
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "sales_person", headerName: "Sales Person", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    { field: "Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "Qp", flex: 1 },
    { field: "sales_Total_CASH", headerName: "Sales Total Cash", flex: 1 },
    { field: "return_Qp", headerName: "Difference Qp", flex: 1 },
    { field: "return_Hp", headerName: "Difference Hp", flex: 1 },
    { field: "return_ONEp", headerName: "Difference ONEp", flex: 1 },
    { field: "return_TWOp", headerName: "Difference TWOp", flex: 1 },
    { field: "return_QCASH", headerName: "Difference Q Cash", flex: 1 },
    { field: "return_HCASH", headerName: "Difference H Cash", flex: 1 },
    { field: "return_ONECASH", headerName: "Difference ONE Cash", flex: 1 },
    { field: "return_TWOCASH", headerName: "Difference TWO Cash", flex: 1 },
    { field: "TotalDifferenceCash", headerName: "Total Difference Cash", flex: 1 },
    { field: "TotalSales", headerName: "Total Sales", flex: 1 },
    { field: "TotalReturns", headerName: "Total Returns", flex: 1 },
    { field: "TotalDifferenceQty", headerName: "Total Difference Qty", flex: 1 },
  ];

  const getRowId = (row) => row._id;

  const handleDebit = async (id) => {
    try {
      const selectedCustomerData = customers.find((customer) => customer.customer_name === selectedCustomer);
      const response = await fetch(`http://localhost:8000/commerce/customerdebitforms/${id}/${selectedCustomerData._id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Qp: Qp,
          Hp: Hp,
          ONEp: ONEp,
          TWOp: TWOp,
          Totalp: Totalp,
          Q_CASH: Q_CASH,
          H_CASH: H_CASH,
          ONE_CASH: ONE_CASH,
          TWO_CASH: TWO_CASH,
          Total_CASH: TotalCash,
          due_date: due_date,
          issues: issues,
        }),
      });
      const data = await response.json();
      console.log("Sales Order approved successfully:", data);
      toast.success("Order has been sent to Pending!");
     
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error sending order to Pending:", error);
      toast.error("Error sending order to Pending");
    }
  };
  const handleClear = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/update-inventory-return/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CSI_CSRI_Number: CSI_CSRI_Number,
          Bank_Name: BankName,
          Amount: Amount,
          Bank_Reference_Number: Bank_Reference_Number,
          Deposit_Date: Deposit_Date,
          payment: payment,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Sales Order approved successfully:", data);
        toast.success("Sales Order Approved successfully");
        // You can update the customerData state or perform any other action here
      } else {
        console.error("Error approving Sales Order:", data.error);
        toast.error("Error approving Sales Order: " + data.error);
      }
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCustomerChange = (event) => {
    setSelectedCustomers(event.target.value);
  };

  const handleIsPendingChange = (event) => {
    if (event.target.checked) {
      setis_pending(true);
      setis_clear(false);
    } else {
      setis_pending(false);
    }
  };

  const handleIsClearChange = (event) => {
    if (event.target.checked) {
      setis_clear(true);
      setis_pending(false);
    } else {
      setis_clear(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" AADS Sales Verification"
        subtitle="List of orders that requires verification"
      /> 
      <Box
        m=" 0 0 0"
        height="100vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            height: "10vh",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: colors.greenAccent[200] + " !important",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.grey[100] + " !important",
          },
        }}
      >

        <DataGrid
          rows={inventoryReturnForms}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
          pagination
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onRowClick={handleRowClick}
        />
      </Box>
      <Modal open={selectedRow !== null} onClose={handleCloseModal}>
      <Box
  sx={{
    position: "absolute",
    top: "50%",
    left: "50%",
    height: "600px",
    display:"flex",
    flexDirection: "column",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "1000px",
    width: "100%",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    overflow: "auto",
  }}
>
  {selectedRow && (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}> AADD Sales Order</h2>
      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order</h3>
      <p>ID: {selectedRow._id}</p>
      <p>SalesPerson: {selectedRow.sales_person}</p>
      <p>Plate Number: {selectedRow.plate}</p>
      <p>SalesRoute: {selectedRow.Route}</p>
      <p>035ml Qty: {selectedRow.sales_Qp}</p>
      <p>0.6ml Qty: {selectedRow.sales_Hp}</p>
      <p>1L Qty: {selectedRow.sales_ONEp}</p>
      <p>2L Qty: {selectedRow.sales_TWOp}</p>
      <p>Total Qty: {selectedRow.sales_Totalp}</p>
      <p>035ml Birr: {selectedRow.sales_Q_CASH}</p>
      <p>0.6ml Birr: {selectedRow.sales_H_CASH}</p>
      <p>1L Birr: {selectedRow.sales_ONE_CASH}</p>
      <p>2L Birr: {selectedRow.sales_TWO_CASH}</p>
      <p>Total Birr: {selectedRow.sales_Total_CASH}</p>


      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Return</h3>
    
      <p>035ml Qty: {selectedRow.Qp}</p>
      <p>0.6ml Qty: {selectedRow.Hp}</p>
      <p>1L Qty: {selectedRow.ONEp}</p>
      <p>2L Qty: {selectedRow.TWOp}</p>
      <p>Total Qty: {selectedRow.Totalp}</p>
      <p>035ml Birr: {selectedRow.Qp_price}</p>
      <p>0.6ml Birr: {selectedRow.Hp_price}</p>
      <p>1L Birr: {selectedRow.ONEp_price}</p>
      <p>2L Birr: {selectedRow.TWOp_price}</p>
      <p>Total Birr: {selectedRow.Total_price}</p>

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sold</h3>
      <p>035ml Qty difference: {selectedRow.return_Qp}</p>
      <p>0.6ml Qty difference: {selectedRow.return_Hp}</p>
      <p>1L Qty difference: {selectedRow.return_ONEp}</p>
      <p>2L Qty difference: {selectedRow.return_TWOp}</p>
     
      <p>035ml Birr difference: {selectedRow.return_Q_CASH}</p>
      <p>0.6ml Birr difference: {selectedRow.return_H_CASH}</p>
      <p>1L Birr difference: {selectedRow.return_ONE_CASH}</p>
      <p>2L Birr difference: {selectedRow.return_TWO_CASH}</p>

      <p>Total Qty difference: {selectedRow.return_Totalp}</p>
      <p>Total Birr difference: {selectedRow.return_Total_CASH}</p>



      
       

     

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Process Sales Order</h3>



      <div style={{ display: "flex",   marginLeft: "2rem",alignItems: "center", position:"center", marginTop:"10px"}}> 

  
<label style={{marginLeft:"10px", marginLeft:"200px" ,alignItems: "center"}}>
<h4>IsPending</h4>
</label>
<input
type="checkbox"
style={{
  borderRadius: "5px",
  padding: "8px 12px",
  color: "white",
  border: "none",
  cursor: "pointer",
}}
checked={is_pending}
onChange={handleIsPendingChange}
/>

<label style={{alignItems: "center", marginLeft:"50px" }}>
<h4>IsClear</h4>
</label>
<input
type="checkbox"
style={{
  borderRadius: "5px",
  padding: "8px 12px",
  color: "white",
  border: "none",
  cursor: "pointer",
}}
checked={is_clear}
onChange={handleIsClearChange}
/>


</div>

{is_clear && (
      <div style={{ display: "flex", flexDirection: "column"}}>
        <div style={{ display: "flex", marginBottom: "10px", justifyContent:"space-between"  }}>
           

        <input
          type="Text"
          placeholder="CSI/CSRI Number"
          label="CSI/CSRI Number_Clear"
          value={CSI_CSRI_Number}
          onChange={(e) => setCSI_CSRI_Number(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "25%",
            height:"40px",
            maxWidth:"30%",
            width: "25%",
        minWidth:"25%",
        display: "block",
        marginLeft: "2rem",
        marginRight: "2rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
    <input
      type="Text"
      placeholder="Bank Name"
      value={BankName}
      onChange={(e) => setBankName(e.target.value)}
      style={{
        color: "#333",
        margin:" 0 auto",
        padding: "0.3rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "0.1rem solid #333", // Add border property here
        borderRadius: "5px",
        height:"40px",
        width: "25%",
        maxWidth:"25%",
        minWidth:"25%",
        display: "block",
       
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
      <input
      type="Text"
      placeholder="Deposit Amount"
      value={Amount}
      onChange={(e) => setAmount(e.target.value)} 
      style={{
        color: "#333",
        color: "#333",
        margin:" 0 auto",
        padding: "0.3rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "0.1rem solid #333", // Add border property here
        borderRadius: "5px",
        width: "25%",
        height:"40px",
        maxWidth:"25%",
        width: "25%",
        minWidth:"25%",
        display: "block",
        marginLeft: "2rem",
        marginRight: "2rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>
  <div style={{ display: "flex", justifyContent:"space-between" }}>
  
    <input
      type="Text"
      placeholder="Bank Ref Number"
      value={Bank_Reference_Number}
      onChange={(e) => setBankReferenceNumber(e.target.value)} 
      style={{
        color: "#333",
        margin:" 0 auto",
        padding: "0.3rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "0.1rem solid #333", // Add border property here
        borderRadius: "5px",
        width: "25%",
        height:"40px",
        maxWidth:"25%",
        width: "25%",
        minWidth:"20%",
        display: "block",
        marginLeft: "2rem",
        
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<DatePicker
  label="Deposit Date"
  placeholderText="Deposit Date"
  value={Deposit_Date}
  onChange={(newValue) => setDeposit_Date(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      margin="normal"
      InputProps={{
        style: {
          color: "black", // Change the font color to black
          marginRight: "2rem",
         
        },
      }}
      sx={{
        
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "& .MuiInputBase-root": {
          backgroundColor: "inherit",
        },
        "& .MuiInputBase-input": {
          padding: "10px 12px",
        },
      }}
    />
  )}
/> 
<button
  variant="contained"
  color="primary"
  style={{
    borderRadius: "5px",
    backgroundColor: "#00BFFF",
    padding: "8px 12px",
    marginRight: "2rem",
    color: "white",
    border: "0.1rem solid #333", // Add border property here
    borderRadius: "5px",
    cursor: "pointer",
    border: "0.1rem solid #333", // Add border property here
    borderRadius: "5px",
    width: "25%",
    height:"40px",
    maxWidth:"25%",
    width: "25%",
    marginLeft: "6rem",
    minWidth:"20%",
    display: "block",
    borderbottom: "0.3rem solid transparent",
    transition: "all 0.3s",
  }}
  onClick={() => {
    document.getElementById("file-upload").click();
  }}
>
  Attach Payment
</button>
<input
  type="file"
  id="file-upload"
  style={{ 
    display:"none"
   }}
    onChange={(event) => {
      setPayment("payment", event.currentTarget.files[0]);
    // Handle the uploaded file here
  }}
/>

    
  </div>

  <div style={{ display: "flex", marginTop:"30px", justifyContent: "flex-end" }}>
  <button
    variant="contained"
    color="primary"
    style={{
      borderRadius: "5px",
      backgroundColor: "#002244",
      padding: "8px 12px",
      color: "white",
      border: "0.1rem solid #333",
      cursor: "pointer",
      width: "25%",
      height: "40px",
      marginLeft: "2rem",
      maxWidth: "25%",
      minWidth: "20%",
      borderBottom: "0.3rem solid transparent",
      transition: "all 0.3s",
    }}
    onClick={() => handleClear(selectedRow._id)}
  >
    Process
  </button>
</div>




</div>
 )}    





 
{is_pending && (
      <div style={{ display: "flex", flexDirection: "column", marginTop: "10px"}}>
        <div style={{ display: "flex", marginBottom: "10px", justifyContent:"space-between"  }}>
            <select
              id="plate"
              value={selectedCustomer}
              onChange={handleCustomerChange}
              style={{
                color: "#333",
                margin:" 0 auto",
                padding: "0.7rem 2rem",
                backgroundColor: "rgb(255, 255, 255)",
                border: "0.1rem solid #333", // Add border property here
                borderRadius: "5px",
                width: "25%",
                maxWidth:"25%",
                height:"40px",
                width: "25%",
                minWidth:"20%",
                display: "block",
                marginLeft: "2rem",
                marginRight: "2rem",
                borderbottom: "0.3rem solid transparent",
                transition: "all 0.3s",
              }}
            >
              <option value="">-- Select Customer --</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer.customer_name}>
                  {customer.customer_name}
                </option>
              ))}
            </select>

        <input
          type="Text"
          placeholder="0.35mlQty"
          label="Qp"
          value={Qp}
          oChnange={(e) => setQp(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="0.35ml Cash"
          label="Q_CASH"
          value={Q_CASH}
          onChange={(e) => setQ_CASH(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="0.6mlQty"
          label="Hp"
          value={Hp}
          onChange={(e) => setHp(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="0.6ml Cash"
          label="H_CASH"
          value={H_CASH}
          onChange={(e) => setH_CASH(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

  </div>
  <div style={{ display: "flex", justifyContent:"space-between" }}>
  <input
          type="Text"
          placeholder="1LQty"
          label="ONEp"
          value={ONEp}
          onChange={(e) => setONEp(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
        <input
          type="Text"
          placeholder="1L Cash"
          label="ONE_CASH"
          value={ONE_CASH}
          onChange={(e) => setONE_CASH(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="2L Qty"
          label="TWOp"
          value={TWOp}
          onChange={(e) => setTWOp(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="2L Cash"
          label="TWO_CASH"
          value={TWO_CASH}
          onChange={(e) => setTWO_CASH(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

<input
          type="Text"
          placeholder="Total Qty"
          label="Totalp"
          value={Totalp}
          onChange={(e) => setTotalp(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
    <input
          type="Text"
          placeholder="Total Cash"
          label="TotalCash"
          value={TotalCash}
          onChange={(e) => setTotalCash(e.target.value)}
            style={{
            color: "#333",
            margin:" 0 auto",
            padding: "0.3rem 2rem",
            backgroundColor: "rgb(255, 255, 255)",
            border: "0.1rem solid #333", // Add border property here
            borderRadius: "5px",
            width: "15%",
            height:"40px",
            maxWidth:"15%",
            width: "15%",
     
        display: "block",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />

    
  </div>



<div style={{ marginBottom: "10px" }}> 
  <label style={{marginLeft:"10px"}}> 
  <h4> State an Issue if there is any ...</h4></label>
    <input
      type="Text"
      value={issues}
      onChange={(e) => setissues(e.target.value)} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",       
        padding: "8px 12px",
        color: "black",
        width: "700px",
        height: "100px",
        marginRight: "10px",
      }}
    />

    
<DatePicker
  label="Due Date"
  placeholderText="Due Date"
  value={due_date}
  onChange={(newValue) => setdue_date(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      margin="normal"
      InputProps={{
        style: {
          color: "black", // Change the font color to black
          marginLeft: "2rem",
        },
      }}
      sx={{
    
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "& .MuiInputBase-root": {
          backgroundColor: "inherit",
        },
        "& .MuiInputBase-input": {
          padding: "10px 12px",
        },
      }}
    />
  )}
/>
  
  </div>
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
  <button
    variant="contained"
    color="primary"
    style={{
      borderRadius: "5px",
      backgroundColor: "#002244",
      padding: "8px 12px",
      color: "white",
      border: "0.1rem solid #333",
      cursor: "pointer",
      width: "25%",
      height: "40px",
      maxWidth: "25%",
      minWidth: "20%",
      borderBottom: "0.3rem solid transparent",
      transition: "all 0.3s",
    }}
    onClick={() => handleDebit(selectedRow._id)}
  >
    Process
  </button>
</div>




</div>
 )}    
    </div>
  )}
</Box>
      </Modal>
    </Box>
  );
};

export default MobileInventoryVerificationPage;

*/