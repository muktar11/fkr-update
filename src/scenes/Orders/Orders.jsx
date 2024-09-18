import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/sdm-rejects/");
        const data = await response.json();
        setCustomerData(data);
        
        // Assign the value of salesRoute from the fetched data
        if (data && data.length > 0) {
          const salesRouteValue = data[0].sales_Route; // Assuming the Route value is in the first element of the array
          const selectCustomer = data[0]._id;
          setSelectedCustomer(selectCustomer)
          setSalesRoute(salesRouteValue);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    if (selectedCustomer) {
      // Fetching ledger balance from API based on selectedCustomerId
      fetch(process.env.REACT_APP_API_URL+`/commerce/ledger-deposit-view/${selectedCustomer}`)
        .then((response) => response.json())
        .then((data) => setLedgerBalance(data.Balance)) // Update here
        .catch((error) => console.log(error));
        
    }
  }, [selectedCustomer]);

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/sdm-rejects/");
      const data = await response.json();
      setCustomerData(data);
      
      // Assign the value of salesRoute from the fetched data
      if (data && data.length > 0) {
        const salesRouteValue = data[0].sales_Route; // Assuming the Route value is in the first element of the array
        setSalesRoute(salesRouteValue);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  


  
  
  useEffect(() => {
    if (salesRoute) {
      // Fetching Q, H, ONE, TWO values from API based on sales_route
      fetch(process.env.REACT_APP_API_URL+`/commerce/sort_price/${salesRoute}/`)
        .then((response) => response.json())
        .then((data) => {
          setQ(data.Q);
          setH(data.H);
          setONE(data.ONE);
          setTWO(data.TWO);
          // You can set TWO value here if needed
        })
        .catch((error) => console.log(error));
    }
  }, [salesRoute]);

  
const handleQpChange = (event) => {
  const newQp = parseInt(event.target.value);
  setQp(newQp);
  setQ_Total(newQp * Q); // Calculating Q_CASH
  
  console.log('Q_CASH:', newQp * Q);
  };

  const handleHpChange = (event) => {
    const newHp = parseInt(event.target.value);
    setHp(newHp);
    setH_Total(newHp * H); // Calculating H_CASH
    
    console.log('H_CASH:', newHp * H);
    };
    
    const handleONEpChange = (event) => {
    const newONEp = parseInt(event.target.value);
    setONEp(newONEp);
    setONE_Total(newONEp * ONE); // Calculating ONE_CASH
    
    console.log('ONE_CASH:', newONEp * ONE);
    };
    
    const handleTWOpChange = (event) => {
    const newTWOp = parseInt(event.target.value);
    setTWOp(newTWOp);
    setTWO_Total(newTWOp * TWO); // Calculating ONE_CASH
    console.log('TWO_CASH:', newTWOp * TWO);
    };
    
  

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Customers Name", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
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


  useEffect(() => {
    const totalp = parseInt(Qp) + parseInt(Hp) + parseInt(ONEp) + parseInt(TWOp);
    setTotalp(totalp);
  }, [Qp, Hp, ONEp, TWOp]);

  useEffect(() => {
    const totalcash = parseInt(Q_Total) + parseInt(H_Total) + parseInt(ONE_Total) + parseInt(TWO_Total);
    setTotal_CASH(totalcash);
  }, [Q_Total, H_Total, ONE_Total, TWO_Total]);
  

  const handleApprove = async (id) => {
    // Add the uploaded payment file
    const formData = new FormData();
    formData.append('Qp', Qp);
    formData.append('Hp', Hp);
    formData.append('ONEp', ONEp);
    formData.append('TWOp', TWOp);
    formData.append('Totalp', Totalp);
    formData.append('Q_Total', Q_Total);
    formData.append('H_Total', H_Total);
    formData.append('ONE_Total', ONE_Total);
    formData.append('TWO_Total', TWO_Total);
    formData.append('Total_CASH', Total_CASH);
    formData.append('payment', payment);
    formData.append('sdm_returned', true);

    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/update/${id}/`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      console.log("Sales Order Returned successfully:", data);
      toast.success("Sales Order Returned successfully");
      handleUpdateClick()
      handleCloseModal()
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
    setPayment(file);
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
          SalesRoute
        </TableCell>
          <TableCell >{selectedRow.sales_Route}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      
      <TableRow>
        <TableCell component="th" scope="row">
          0.35ml
        </TableCell>
          <TableCell >{selectedRow.Qp}(Qty)</TableCell>
          <TableCell >{selectedRow.Q_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
          0.6ml
        </TableCell>
          <TableCell>{selectedRow.Hp}(Qty)</TableCell>
          <TableCell >{selectedRow.H_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
    
      <TableRow>
        <TableCell component="th" scope="row">
          1L
        </TableCell>

          <TableCell>{selectedRow.ONEp}(Qty)</TableCell>
          <TableCell>{selectedRow.ONE_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          2LQty
        </TableCell>

          <TableCell>{selectedRow.TWOp}(Qty)</TableCell>
          <TableCell>{selectedRow.TWO_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
   
      <TableRow>
        <TableCell component="th" scope="row">
          Total
        </TableCell>
        
          <TableCell>{selectedRow.Totalp}(Qty)</TableCell>
          <TableCell>{selectedRow.Total_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
    
      <TableRow>    
      <TableCell component="th" scope="row">
          Case:
        </TableCell>
          <TableCell>{selectedRow.sdm_returned_issue}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
              <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      
      <TableRow  display="column">
      <TableCell>0.35ml Qty</TableCell>
  <TableCell>
  <input
     
     value={Qp} 
     onChange={handleQpChange}
     type="text"
     placeholder="0.35ml"
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
 

  <TableCell>0.35 Total</TableCell>
  <TableCell>
    <input
     
      value={Q_Total} 
    
      type="number"
      placeholder="0.35ml Cash"
      
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
<TableCell>0.6ml Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="0.6mlQty"
      value={Hp}
      onChange={handleHpChange}
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
 
  <TableCell>0.6ml Total Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="0.6mlCash"
      value={H_Total}
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
  <TableCell>1L Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="1mlQty"
      value={ONEp}
      onChange={handleONEpChange}
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
  
  <TableCell>1L Total Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="1L Cash"
      value={ONE_Total}
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
<TableCell>2L Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="2LQty"
      value={TWOp}
      onChange={handleTWOpChange}
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

  <TableCell>2L Total Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="2L Cash"
      value={TWO_Total}
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
<TableCell>Transportation</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="Total Qty"
      value={Totalp}
      
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

  <TableCell>Ledger Balance</TableCell>
  <TableCell>
    <input
       type="text"
       id="ledgerBalance"
       placeholder="Ledger Balance"
       value={ledgerBalance}
       readOnly
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
<TableCell>Total Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="Total Qty"
      value={Totalp}
      
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

  <TableCell>Total Value Cash</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="Total Cash"
      value={Total_CASH}
     
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

<TableRow style={{dispaly:"flex", justifyContent:"space-between"}}>


<TableCell> <input
  type="file"
  id="Payment"
  style={{ display: "none" }}
  onChange={handlePaymentChange}
/> 

<label htmlFor="Payment">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  update payment
                </Button>
              </label>

 </TableCell>

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

export default Order;



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