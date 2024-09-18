import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
const ReturnDeposit = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const [selectCustomer, setSelectCustomer] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  const [Q, setQ] = useState(0);
  const [H, setH] = useState(0);
  const [ONE, setONE] = useState(0);
  const [TWO, setTWO] = useState(0);
  const [Qp, setQp] = useState(0);
  const [Hp, setHp] = useState(0);
  const [ONEp, setONEp] = useState(0);
  const [TWOp, setTWOp] = useState(0);
  const [Totalp, setTotalp] = useState(0);
  const [Q_Total, setQ_Total] = useState(0);
  const [H_Total, setH_Total] = useState(0);
  const [ONE_Total, setONE_Total] = useState(0);
  const [TWO_Total, setTWO_Total] = useState(0);
  const [Total_CASH, setTotal_CASH] = useState(0);
  const [payment, setPayment] = useState(null);
  const [salesRoute, setSalesRoute] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [ledgerBalance, setLedgerBalance] = useState('');
  const [TransportationFee, setTransportationFee] = useState('');
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");

  
  const[CSI_CSRI_Number, setCSI_CSRI_Number]= useState('');
  const[Bank_Name, setBank_Name]= useState('');
  const[Bank_Reference_Number, setBank_Reference_Number]= useState('');
  const[Deposit_Amount, setDeposit_Amount]= useState('');
  const [Deposit_Date, setDeposit_Date] = useState(null);
  const[Branch_Name, setBranch_Name] = useState('');
  const [Narrative, setNarrative] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/commerce/ledger-deposit-rejected-view`);
        const data = await response.json();
        setCustomerData(data);
  
        // Assign the value of customer_id from the fetched data
        if (data && data.length > 0) {
          const selectCustomer = data[0].customer_id;
          setSelectCustomer(selectCustomer);
          // Save the value of customer_id to a variable (e.g., selectedCustomerID)
          const selectedCustomerID = selectCustomer;
          console.log('selectedCustomerId', selectedCustomerID)
  
          // Fetching ledger balance from API based on selectCustomer
          fetch(`${process.env.REACT_APP_API_URL}/commerce/ledger-deposit-view/${selectCustomer}`)
            .then((response) => response.json())
            .then((data) => setLedgerBalance(data.Balance))
            .catch((error) => console.log(error));
  
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);


  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/ledger-deposit-rejected-view");
      const data = await response.json();
      setCustomerData(data);     
      // Assign the value of salesRoute from the fetched data
      if (data && data.length > 0) {        
        const selectCustomer = data[0]._id;
        setSelectedCustomer(selectCustomer)
      }
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
  const handleApprove = async (selectCustomer) => {
    // Add the uploaded payment file
    const formData = new FormData();
    formData.append('payment', payment);
    formData.append('CSI_CSRI_Number', CSI_CSRI_Number);
    formData.append('Bank_Name', Bank_Name);
    formData.append('Bank_Reference_Number', Bank_Reference_Number);
    formData.append('Deposit_Amount', Deposit_Amount);
    formData.append('Deposit_Date', Deposit_Date);
    formData.append('Narrative', Narrative);
    formData.append('Branch_Name', Branch_Name);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/commerce/update-ledger-deposit/${selectCustomer}/`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      console.log("Ledger Deposit Returned successfully:", data);
      toast.success("Ledger Deposit Returned successfully");
      handleUpdateClick();
      handleCloseModal();
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Ledger Deposit Returned:", error);
      toast.error("Error approving Ledger Deposit");
    }
  };
  
  const handleRowClick = (params) => {
    const selectCustomer = params.row.customer_id; // Get the value of customer_id from the clicked row
    setSelectedRow(params.row);
    setSelectedCustomer(selectCustomer); // Set the selected customer using setSelectedCustomer
  };
  
  const handleCloseModal = () => {
    setSelectedRow(null);
    setSelectedCustomer(null); // Reset the selected customer when closing the modal
  };


  
  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    setPayment(file);
  };


  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="Deposit Return"
        subtitle="List of ledger Deposit returns"
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
          rows={customerData}
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
            fontFamily: "Arial, sans-serif",
            color: "#333",
            height:"80%",
            overflow: "auto",
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
                    <TableCell>Id</TableCell>
                      <TableCell>{selectedRow._id}</TableCell>
                      <TableCell>{selectedRow.T}</TableCell>
                      <TableCell>{selectedRow.T}</TableCell>
                    </TableRow>
                  </TableHead>
  
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>{selectedRow.customers_name}</TableCell>
                      <TableCell>{selectedRow.T}</TableCell>
                          <TableCell>{selectedRow.T}</TableCell>
                    </TableRow>
                  </TableHead>
                 
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
        CSI_CSRI_Number
        </TableCell>
          <TableCell >{selectedRow.CSI_CSRI_Number}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      
      <TableRow>
        <TableCell component="th" scope="row">
        Bank_Name
        </TableCell>
          <TableCell >{selectedRow.Bank_Name}</TableCell>
          <TableCell >{selectedRow.Q_CASH}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
        Bank_Reference_Number
        </TableCell>
          <TableCell>{selectedRow.Bank_Reference_Number}</TableCell>
          <TableCell >{selectedRow.Bank_Reference_Numbr}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
    
      <TableRow>
        <TableCell component="th" scope="row">
        Branch_Name
        </TableCell>

          <TableCell>{selectedRow.Branch_Name}</TableCell>
          <TableCell>{selectedRow.ONE_CASH}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
        Narrative
        </TableCell>

          <TableCell>{selectedRow.Narrative}</TableCell>
          <TableCell>{selectedRow.TWO_CASH}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
   
      <TableRow>
        <TableCell component="th" scope="row">
        Deposit_Date
        </TableCell>
        
          <TableCell>{selectedRow.Deposit_Date}</TableCell>
          <TableCell>{selectedRow.Total_CASH}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
    
      <TableRow>    
      <TableCell component="th" scope="row">
      Balance
        </TableCell>
          <TableCell>{selectedRow.Balance}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
              <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      
      <TableRow  display="column">
     
  <TableCell>
  <input
     
        type="text"
        id="CSI_CSRI_Number"
        placeholder="CSI/CSRI Number"
        value={CSI_CSRI_Number}
        onChange={(e) => setCSI_CSRI_Number(e.target.value)}
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
  </TableRow>

<TableRow  display="column">
  <TableCell>
    <input
     type="text"
     id="Bank_Name"
     placeholder="Bank Name"
     value={Bank_Name}
     onChange={(e) => setBank_Name(e.target.value)}
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

</TableRow>

<TableRow  display="column">

  <TableCell>
    <input
      type="text"
      id="Bank_Reference_Number"
      value={Bank_Reference_Number}
      onChange={(e) => setBank_Reference_Number(e.target.value)}
      placeholder="Bank Reference Number"
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
  </TableRow>

<TableRow  display="column">
  <TableCell>
    <input
     type="text"
     id="Deposit_Amount"
     value={Deposit_Amount}
     onChange={(e) => setDeposit_Amount(e.target.value)}
     placeholder="Deposit Amount"
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

 
  </TableRow>
  

  <TableRow  display="column">
  
  <TableCell>
    <input
     type="text"
     id="Branch_Name"
     value={Branch_Name}
     onChange={(e) => setBranch_Name(e.target.value)}
     placeholder="Branch Name"
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
  </TableRow>

<TableRow  display="column">
  <TableCell>
    <input
       type="text"
       id="Narrative"
       value={Narrative}
       onChange={(e) => setNarrative(e.target.value)}
       placeholder="Narrative"
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
</TableRow>


<TableRow  display="column">
<TableCell>
<input
  type="text"
  id="ledgerBalance"
  placeholder="Ledger Balance"
  value={ledgerBalance}
  readOnly
  style={{
    margin:" 0 auto",
    padding: "0.7rem 2rem",
    backgroundColor: "rgb(255, 255, 255)",
    border: "none",
    width: "100%",
          maxWidth:"100%",   
          minWidth:"30%",
    display: "block",
    borderbottom: "0.3rem solid transparent",
    transition: "all 0.3s",
  }}
/>
</TableCell>
</TableRow>


     



<div style={{display: "flex", Width:"800px", marginLeft:"3rem", justifyContent:"space-between", alignItems:"center", padding:'20px'}}>

<DatePicker
  label="Deposit Date"
  placeholderText='Deposit Date'
    selected={Deposit_Date}
    onChange={(newValue) =>  setDeposit_Date(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        margin="normal"
        InputProps={{
          style: {
            color: "black",
            paddingTop: "10px",
          },
        }}
        sx={{
          paddingTop: "10px",
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



<input
  type="file"
  id="payment"
  onChange={handlePaymentChange}
  style={{ display: 'none' }}
/>

<Button
  component="span"
  color="secondary"
  variant="contained"
  style={{ width: '150px',  padding:"5px" }}
  onClick={() => {
    document.getElementById('payment').click();
  }}
>
  Attach your payment
</Button>
     
<TableCell align="right">
                        <Button
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
                          Update
                        </Button>
                      </TableCell>
</div>
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

export default ReturnDeposit;



/*
import React, { useEffect, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
const Order = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const [paymentFile, setPaymentFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/sales-order/sdm-rejects/");
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
    {
      field: "payment_url",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "Qp", headerName: "0.35ml ", flex: 1 },
    { field: "Q_CASH", headerName: "0.35ml CASH", flex: 1 },
    { field: "Hp", headerName: "0.6ml", flex: 1 },
    { field: "H_CASH", headerName: "0.6ml CASH", flex: 1 },
    { field: "ONEp", headerName: "1L", flex: 1 },
    { field: "ONE_CASH", headerName: "1L CASH", flex: 1 },
    { field: "TWOp", headerName: "2L", flex: 1 },
    { field: "TWO_CASH", headerName: "2L CASH", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
  ];

  const getRowId = (row) => row._id;


  const handledenie = async (id) => {
    try {
      const formData = new FormData();
      formData.append("Qp", selectedRow.Qp);
      formData.append("Hp", selectedRow.Hp);
      formData.append("ONEp", selectedRow.ONEp);
      formData.append("TWOp", selectedRow.TWOp);
      formData.append("Totalp", selectedRow.Totalp);
      formData.append("Q_CASH", selectedRow.Q_CASH);
      formData.append("H_CASH", selectedRow.H_CASH);
      formData.append("ONE_CASH", selectedRow.TWO_CASH);
      formData.append("TWO_CASH", selectedRow.Total_CASH);
      formData.append("Total_CASH", selectedRow.Total_CASH);
      formData.append("payment", paymentFile); // Add the uploaded payment file
  
      const response = await fetch(`http://localhost:8000/commerce/sales-order/update/${id}/`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      console.log("Sales Order Updated successfully:", data);
      toast.success("Sales Order Updated successfully");
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  
  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    setPaymentFile(file);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" Sales Approve"
        subtitle="List of Orders that requires Approval"
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
          rows={customerData}
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
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            maxWidth: "500px",
            width: "100%",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            height: "600px",
            overflow: "auto",
          }}
        >
          {selectedRow && (
            <div>
              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order</h2>
              <p>ID: {selectedRow._id}</p>
              <p>Customers Name: {selectedRow.customers_name}</p>
              <p>Sales Route: {selectedRow.sales_Route}</p>
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
            
              <p>Issue: {selectedRow.sdm_returned_issue}</p>

              <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Update Sales Order</h2>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}> 
           
    <input
      type="number"
      placeholder="0.35ml"
      value={selectedRow.Qp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, Qp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="0.35ml Cash"
      value={selectedRow.Q_CASH} 
      onChange={(e) => setSelectedRow({ ...selectedRow,  Q_CASH: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
     
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
  </div>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="number"
      placeholder="0.6ml"
      value={selectedRow.Hp} 
      onChange={(e) => setSelectedRow({ ...selectedRow,  Hp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="0.6ml Cash"
      value={selectedRow.Hp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, H_CASH: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
     
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
  </div>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="number"
      placeholder="1L"
      value={selectedRow.ONEp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, ONEp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="1L Cash"
      value={selectedRow.TWOp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, TWOp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
     
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
  </div>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="number"
      placeholder="2L"
      value={selectedRow.TWO_CASH} 
      onChange={(e) => setSelectedRow({ ...selectedRow, TWO_CASH: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="2L Cash"
      value={selectedRow.Hp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, Hp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
     
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
  </div>


              <div style={{display:"flex", flexDirection:"row" ,justifyContent:"space-between"}}>
              <div style={{ marginTop: "100px" }}>
              <input
  type="file"
  id="payment"
  onChange={handlePaymentChange}
  style={{ display: 'none' }}
/>

<Button
  component="span"
  color="secondary"
  variant="contained"
  style={{ width: '150px', padding:"5px" }}
  onClick={() => {
    document.getElementById('payment').click();
  }}
>
  Attach your payment
</Button>
     
  </div>

  <div style={{ marginTop: "100px" }}>
    <button
      variant="contained"
      color="primary"
      onClick={() => handledenie(selectedRow._id)}
      style={{
        borderRadius: "5px",
        backgroundColor: "#00BFFF",
        padding: "8px 12px",
        color: "white",
        border: "none",
        cursor: "pointer",
        width: "200px",
        height: "40px",
      }}
    >
      Submit
    </button>
  </div>

              </div>

            </div>
            
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Order; */