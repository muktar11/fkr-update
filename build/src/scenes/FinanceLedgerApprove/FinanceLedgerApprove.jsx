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

const FinanceLedgerApprove = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const colors = tokens(theme.palette.mode);
  const [selectedRow, setSelectedRow] = useState(null);
  const [CSI_CRSI_Number, setCSI_CRSI_Number] = useState("");
  const [Bank_Name, setBank_Name] = useState("");
  const [Amount, setAmount] = useState("");
  const [Bank_Reference_Number, setBank_Reference_Number] = useState("");
  const [financepayment_at, setfinancepayment_at] = useState(null);
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/ledger-deposit-approve-view");
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
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/ledger-deposit-approve-view");
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
    { field: "CSI_CSRI_Number", headerName: "CSI_CSRI_Number", flex: 1 },
    { field: "Bank_Name", headerName: "Bank_Name", flex: 1 },
    { field: "Bank_Reference_Number", headerName: "Bank_Reference_Number", flex: 1 },
    { field: "Branch_Name", headerName: "Branch_Name", flex: 1 },
    { field: "Narrative", headerName: "Narrative", flex: 1 },
    { field: "Deposit_Date", headerName: "Deposit Date", flex: 1 },
    { field: "Balance", headerName: "Balance", flex: 1 },
    // Add other fields as needed
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async () => {
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    if (selectedRow) {
      try {
      
  
        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/ledger-deposit-approve/${selectedRow._id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          }),
        });
        const data = await response.json();
        console.log("Customer approved successfully:", data);
        toast.success("Ledger Approved successfully");
        handleUpdateClick()
        handleCloseModal()
        // You can update the customerData state or perform any other action here
      } catch (error) {
        console.error("Error approving customer:", error);
        toast.error("Error approving Ledger");
      }
    }
  };


  
  const handleReject = async () => {
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    if (selectedRow) {
      try {
      
  
        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/ledger-deposit-reject/${selectedRow._id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          }),
        });
        const data = await response.json();
        console.log("Ledger Deposit Returned successfully:", data);
      toast.success("Ledger Deposit  Returned successfully");
      handleUpdateClick()
      handleCloseModal()
        // You can update the customerData state or perform any other action here
      } catch (error) {
        console.error("Error approving Sales Order:", error);
      toast.error("Error approving Ledger");
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
            <Header
      title="Finance Ledger"
      subtitle="finance ledger deposit"
    />
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
      title="Ledger Deposit"
      subtitle="Ledger Deposit that requires Approval"
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
          Payment
        </TableCell>
        
          <TableCell>    <a href={selectedRow.payment} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
        {selectedRow.payment}
      </a></TableCell>
        
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          Current Balance
        </TableCell>        
          <TableCell >{selectedRow.Balance}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
          Deposit Amount
        </TableCell>        
          <TableCell >{selectedRow.Deposit_Amount}</TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell component="th" scope="row">
        CSI CSRI Number
        </TableCell>     
          <TableCell>{selectedRow.CSI_CSRI_Number}</TableCell>      
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
          Bank Name
        </TableCell> 
          <TableCell>{selectedRow.Bank_Name}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
         Branch Name 
        </TableCell>       
          <TableCell>{selectedRow.Branch_Name}</TableCell>
      
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
        Narrative
        </TableCell>       
        <TableCell>{selectedRow.Narrative}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
        Bank Reference Number
        </TableCell>
        
          <TableCell>{selectedRow.Bank_Reference_Number}e</TableCell>
      </TableRow>


<TableRow>
<TableCell component="th" scope="row">
          Deposit Date
        </TableCell>
          <TableCell>{selectedRow.Deposit_Date}</TableCell>
</TableRow>



<TableRow>
<TableCell align="left">
      <Button
        key={selectedRow._id}
        variant="contained"
        color="primary"
        onClick={() => handleReject(selectedRow._id)}
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
  
export default FinanceLedgerApprove;
