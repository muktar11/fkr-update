import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody,Link, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CircularProgress from "@mui/material/CircularProgress";

const SMDPaymentApprovePage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const colors = tokens(theme.palette.mode);
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/smd-view");
        const data = await response.json();
        setCustomerData(data);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  
  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/smd-view");
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

  const handleApprove = async (id) => {
    try {
      const firstName = localStorage.getItem("first_name");
      const lastName = localStorage.getItem("last_name");
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/sdm-create/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdmcreated_first_name: firstName,
          sdmcreated_last_name: lastName,
        }),
      });
      const data = await response.json();
      console.log("Sales Order approved successfully:", data);
      toast.success("Sales Order Approved successfully");
      handleUpdateClick()
      handleCloseModal()
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/sdm-rejects/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdm_returned_issue: sdm_returned_issue,
        }),
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

  const handleCloseModal = () => {
    setSelectedRow(null);
    setRejectReason("");
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
          pagination
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage + 1)}
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
            background:"",
         
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            width: "60%",
            height:"80%",
            fontFamily: "Arial, sans-serif",
            color: "#333",      
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
        
          <TableCell>{selectedRow.ONEp}</TableCell>
        
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
          TotalCash
        </TableCell>
        
          <TableCell>{selectedRow.Total_CASH}</TableCell>
        
      </TableRow>
      <TableRow height="70px">
            <TableCell>
              <input
                type="text"
                placeholder="State an issue if there is any"
                value={sdm_returned_issue} 
                onChange={(e) => setsdm_returned_issue(e.target.value)} 
                // Add your input field logic here
                style={{
                  // Add your styling properties here
                  border: '1px solid black',
                  padding: '8px',
                  borderRadius: '4px',
                  width:"150%", 
                  height:"140%",
                }}
              />
            </TableCell>

            
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

export default SMDPaymentApprovePage;

/*
import React, { useEffect, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
const SMDPaymentApprovePage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/sales-order/smd-view");
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

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/sales-order/sdm-create/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Sales Order approved successfully:", data);
      toast.success("Sales Order Approved successfully");
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };

  const handledenie = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/sales-order/sdm-rejects/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdm_returned_issue: selectedRow.sdm_returned_issue,
        }),
      });
      const data = await response.json();
      console.log("Sales Order Returned successfully:", data);
      toast.success("Sales Order Returned successfully");
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
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
      
              <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="text"
      placeholder="state an issue if there is any "
      value={selectedRow.sdm_returned_issue} 
      onChange={(e) => setSelectedRow({ ...selectedRow, sdm_returned_issue: e.target.value })} 
      style={{
        borderRadius: "5px", 
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px",
        color: "black",
        width: "400px",
        height: "100px",
        marginRight: "10px",
      }}
    />
  </div>

              <div style={{display:"flex", flexDirection:"row" ,justifyContent:"space-between"}}>
              <div style={{ marginTop: "100px" }}>
    <button
      variant="contained"
      color="primary"
    
        onClick={() => handledenie(selectedRow._id)}
      style={{
        borderRadius: "5px",
        backgroundColor: "red",
        padding: "8px 12px",
        color: "white",
        border: "none",
        cursor: "pointer",
        width: "200px",
        height: "40px",
      }}
    >
      Return
    </button>
  </div>

  <div style={{ marginTop: "100px" }}>
    <button
      variant="contained"
      color="primary"
      onClick={() => handleApprove(selectedRow._id)}
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

export default SMDPaymentApprovePage;
*/