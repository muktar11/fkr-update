import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DatePicker from "react-datepicker";
import Header from "../../components/Header";
import CircularProgress from "@mui/material/CircularProgress";

const SalesOrderVerificationPage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [selectedRow, setSelectedRow] = useState(null);
  const [CSI_CRSI_Number, setCSI_CRSI_Number] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [validationError, setValidationError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/finance-view");
        const data = await response.json();
        setCustomerData(data);
         setLoading(false); 
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/finance-view");
      const data = await response.json();
      setCustomerData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Customers Name", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "LedgerBalance", headerName: "LedgerBalance", flex: 1 },
    { field: "Qp", headerName: "Q", flex: 1 },
    { field: "Q_CASH", headerName: "Q CASH", flex: 1 },
    { field: "Hp", headerName: "H", flex: 1 },
    { field: "H_CASH", headerName: "H CASH", flex: 1 },
    { field: "ONEp", headerName: "ONE", flex: 1 },
    { field: "ONE_CASH", headerName: "ONE CASH", flex: 1 },
    { field: "TWOp", headerName: "TWO", flex: 1 },
    { field: "TWO_CASH", headerName: "TWO CASH", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    // Add other fields as needed
  ];

  const getRowId = (row) => row._id;
  const handleApprove = async () => {
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    if (selectedRow) {
      try {
        if (CSI_CRSI_Number.trim() === '') {
          // CSI CSRI value is required, display an error message or perform any necessary action
          toast.error("CSI CSRI value is required");
          return;
        }
        
        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/finance-create/${selectedRow._id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            financecreated_first_name: firstName,
            financecreated_last_name: lastName,
            CSI_CRSI_NUMBER: CSI_CRSI_Number,
          }),
        });
        const data = await response.json();
        console.log("Customer approved successfully:", data);
        toast.success("Sales Order Has been sent to Logistics");
        handleUpdateClick();
        handleCloseModal();
        // You can update the customerData state or perform any other action here
      } catch (error) {
        console.error("Error approving customer:", error);
        toast.error("Error approving customer");
      }
    }
  };


  


  const rows = customerData.map((row) => ({
    _id: row._id,
    name: row.customers_name,
    salesRoute: row.sales_Route,
    Plate: row.plate,
    Qp: row.Qp,
    Q_CASH: row.Q_CASH,
    Hp: row.Hp,
    H_CASH: row.H_CASH,
    ONEp: row.ONEp,
    ONE_CASH: row.ONE_CASH,
    TWOp: row.TWOp,
    TWO_CASH: row.TWO_CASH,
    Totalp: row.Totalp,
    Total_CASH: row.Total_CASH,
  }));


  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const handleSave = () => {
    if (selectedRow) {
      handleApprove(selectedRow._id);
    }
  };

 
    return (
      <Box m="20px">
        <ToastContainer />
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
              {loading ? (
          // Show loading animation if loading is true
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={customerData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            pageSize={10}
            onRowClick={handleRowClick}
          />
          )}
        </Box>
        <Modal open={selectedRow !== null} onClose={handleCloseModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",

      borderRadius: "15px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      width: "60%",
      height:"80%",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      overflow: "auto" // Add t
    }}
  >
    {selectedRow && (
      <div>
    
<TableContainer component={Paper}>
<div style={{ textAlign: 'center', padding: '10px' }}>
    <Header
      title="Sales Order"
      subtitle="Order Detail that requires Approval"
    />
  </div>
  <Table sx={{}} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Customer</TableCell>
        
          <TableCell>{selectedRow.customers_name}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
          SalesRoute
        </TableCell>
        
          <TableCell>{selectedRow.sales_Route}</TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
        LedgerBalance
        </TableCell>
        <TableCell>{selectedRow.LedgerBalance}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.35mlQty (q)
        </TableCell>
        
          <TableCell>{selectedRow.Qp}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.35mlCash
        </TableCell>
        
          <TableCell>{selectedRow.Q_CASH}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.6mlQty (q)
        </TableCell>
        
          <TableCell>{selectedRow.Hp}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.6mlCash
        </TableCell>

          <TableCell>{selectedRow.H_CASH}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          1LQty (q)
        </TableCell>
        
          <TableCell >{selectedRow.ONEp}</TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          1LCash  
        </TableCell>
          <TableCell>{selectedRow.ONE_CASH}</TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          2LQty (q)
        </TableCell>
      
          <TableCell>{selectedRow.TWOp}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          2LCash
        </TableCell>
        
          <TableCell>{selectedRow.TWO_CASH}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          TotalQty (q)
        </TableCell>
      
          <TableCell>{selectedRow.Totalp}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Total Cash (q)
        </TableCell>
      
          <TableCell>{selectedRow.Total_CASH}</TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Issue case from SMD 
        </TableCell>

          <TableCell>{selectedRow.sdm_returned_issue}</TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell component="th" scope="row">
          Issue Case from Finance
        </TableCell>

          <TableCell>{selectedRow.finance_returned_issue}</TableCell>
      </TableRow>
      
      <TableRow  display="column">
      <TableCell component="th" scope="row">
      Invoice Number
        </TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="Invoice Number"
      value={CSI_CRSI_Number}
      onChange={(e) => setCSI_CRSI_Number(e.target.value)}
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
       {validationError && (
      <span style={{ color: 'red' }}>CSI CSRI value is required</span>
    )}
  </TableCell>
  </TableRow>
  

<TableRow>
  
  <TableCell align="right">
      <Button
        key={selectedRow._id}
        variant="contained"
        color="primary"
        onClick={() => handleApprove(selectedRow._id)}
        style={{
          borderRadius: "5px",
          backgroundColor: "#00BFFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100px",
          height: "40px",
          marginRight: "10px",
        }}
      >
        Approve
      </Button>
  </TableCell>
</TableRow> 
    </TableBody>    
  </Table>
</TableContainer>

      </div>
    )}
  </Box>
</Modal>
      </Box>
    );
  };
  
  export default SalesOrderVerificationPage;

/*
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField,} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DatePicker from "react-datepicker";

const SalesOrderVerificationPage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [selectedRow, setSelectedRow] = useState(null);
  const [CSI_CRSI_Number, setCSI_CRSI_Number] = useState("");
  const [BankName, setBankName] = useState("");
  const [Amount, setAmount] = useState("");
  const [BankReferenceNumber, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/sales-order/finance-view");
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Customers Name", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "Qp", headerName: "Q", flex: 1 },
    { field: "Q_CASH", headerName: "Q CASH", flex: 1 },
    { field: "Hp", headerName: "H", flex: 1 },
    { field: "H_CASH", headerName: "H CASH", flex: 1 },
    { field: "ONEp", headerName: "ONE", flex: 1 },
    { field: "ONE_CASH", headerName: "ONE CASH", flex: 1 },
    { field: "TWOp", headerName: "TWO", flex: 1 },
    { field: "TWO_CASH", headerName: "TWO CASH", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    // Add other fields as needed
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/sales-order/finance-create/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CSI_CSRI_NUMBER: CSI_CRSI_Number,
          Bank_Name: BankName,
          Amount: Amount,
          Bank_Refernce_Number: BankReferenceNumber,
          Deposit_Date: Deposit_Date,
        }),
      });
      const data = await response.json();
      console.log("Customer approved successfully:", data);
      toast.success("Sales Order Verification successfully");
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving customer:", error);
      toast.error("Error approving customer");
    }
  };


  


  const rows = customerData.map((row) => ({
    _id: row._id,
    name: row.customers_name,
    salesRoute: row.sales_Route,
    Plate: row.plate,
    Qp: row.Qp,
    Q_CASH: row.Q_CASH,
    Hp: row.Hp,
    H_CASH: row.H_CASH,
    ONEp: row.ONEp,
    ONE_CASH: row.ONE_CASH,
    TWOp: row.TWOp,
    TWO_CASH: row.TWO_CASH,
    Totalp: row.Totalp,
    Total_CASH: row.Total_CASH,
  }));

  
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  const handleSave = () => {
    if (selectedRow) {
      handleApprove(selectedRow._id);
    }
  };

 
    return (
      <Box m="20px">
        <ToastContainer />
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
            rows={customerData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            pageSize={10}
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
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      maxWidth: "500px",
      width: "100%",
      fontFamily: "Arial, sans-serif",
      color: "#333",
      overflow: "auto" // Add t
    }}
  >
    {selectedRow && (
      <div>
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order</h2>
        <p>ID: {selectedRow._id}</p>
        <p>Customers Name: {selectedRow.customers_name}</p>
              <p>Sales Route: {selectedRow.sales_Route}</p>
              <p>Plate: {selectedRow.plate}</p>
              <p>0.35ml Value: {selectedRow.Qp}</p>
              <p>0.35ml Cash: {selectedRow.Q_CASH}</p>
              <p>0.6ml Value: {selectedRow.Hp}</p>
              <p>0.6ml Cash: {selectedRow.H_CASH}</p>
              <p>1L Value: {selectedRow.ONEp}</p>
              <p>1L Cash: {selectedRow.ONE_CASH}</p>
              <p>2L Value: {selectedRow.TWOp}</p>
              <p>2L Cash: {selectedRow.TWO_CASH}</p>
              <p>Total Value: {selectedRow.Totalp}</p>
              <p>Total Cash: {selectedRow.Total_CASH}</p>
              <p>
                Payment:{" "}
                <a href={selectedRow.payment_url} target="_blank" rel="noopener noreferrer">
                  {selectedRow.payment_url}
                </a>
              </p>
       
       <label> <h8>CSI/CRSI Number</h8></label>
          <TextField
         
          value={CSI_CRSI_Number}
          onChange={(e) => setCSI_CRSI_Number(e.target.value)}
          fullWidth
          variant="filled"
          margin="normal"
          InputProps={{
            style: {
              color: "black", // Change the font color to black
            },
          }}
          sx={{
        
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(10, 10, 10, 10)",
            "& .MuiInputBase-root": {
              backgroundColor: "inherit",
            },
            "& .MuiInputBase-input": {
              padding: "10px 12px",
            },
          }}
        />
               <label> <h8>Bank Name</h8></label>
        <TextField
          label="Bank Name"
          value={BankName}
          onChange={(e) => setBankName(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              color: "black", // Change the font color to black
            },
          }}
          sx={{
        
            borderRadius: "5px",
            boxShadow: "2px 2px 4px rgba(30, 30, 30, 30)",
            "& .MuiInputBase-root": {
              backgroundColor: "inherit",
            },
            "& .MuiInputBase-input": {
              padding: "10px 12px",
            },
          }}
        />
               <label> <h8>Demosit Amount</h8></label>
        <TextField
          label="Deposit Amount"
          value={Amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              color: "black", // Change the font color to black
            },
          }}
          sx={{
        
            borderRadius: "5px",
            boxShadow: "2px 2px 4px rgba(30, 30, 30, 30)",
            "& .MuiInputBase-root": {
              backgroundColor: "inherit",
            },
            "& .MuiInputBase-input": {
              padding: "10px 12px",
            },
          }}
        />
      
<label> <h8>Bank Ref Number</h8></label>
        <TextField
          label="Bank Reference Number"
          placeholder="Bank Refernce Number"
          value={BankReferenceNumber}
          onChange={(e) => setBankReferenceNumber(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: {
              color: "black", // Change the font color to black
            },
          }}
          sx={{
        
            borderRadius: "5px",
            boxShadow: "2px 2px 4px rgba(30, 30, 30, 30)",
            "& .MuiInputBase-root": {
              backgroundColor: "inherit",
            },
            "& .MuiInputBase-input": {
              padding: "10px 12px",
            },
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
          paddingTop:"10px"
        },
      }}
      sx={{
        paddingTop:"10px",
        borderRadius: "5px",
        boxShadow: "2px 2px 4px rgba(30, 30, 30, 30)",
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
  
        <Button sx={{marginTop:"100px",  position:"right"}} variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
    )}
  </Box>
</Modal>
      </Box>
    );
  };
  
  export default SalesOrderVerificationPage;
*/