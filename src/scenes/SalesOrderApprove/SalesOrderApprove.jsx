import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";

const SalesOrderApprovePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [payment, setPayment] = useState("");
  const [inventory, setinventory] = useState("");
  const [plate_no, setplate_no] = useState("");
  const [Driver, setDriver] = useState("");
  const [finance_returned_issue, setfinance_returned_issue] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/finance-manager-view");
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
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/finance-manager-view");
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
    {
      field: "payment",
      headerName: "Payment",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "Qp", headerName: "Qp", flex: 1 },
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
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const firstName = localStorage.getItem("first_name");
      const lastName = localStorage.getItem("last_name");
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/finance-manager-create/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          financemanagercreated_first_name: firstName,
          financemanagercreated_last_name: lastName,
        }),
      });
      const data = await response.json();
      console.log("Customer approved successfully:", data);
      toast.success("Sales Order Has been sent to Logisitics");
      handleUpdateClick()
      handleCloseModal()
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving customer:", error);
      toast.error("Error approving order");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/finance-rejects/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finance_returned_issue: finance_returned_issue,
        }),
      });
      const data = await response.json();
      console.log("Sales Order Returned successfully:", data);
      toast.success("Sales Order Returned successfully");
      // You can update the customerData state or perform any other action here
      handleUpdateClick()
      handleCloseModal()
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
      <Header title="Sales Order Approve" subtitle="List of Sales Orders that require Verification" />
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
          pagination
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage + 1)}
          onRowClick={handleRowClick}
        />
        )}
      </Box>
      {selectedRow && (
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
            <div>
              <TableContainer component={Paper}>
                <div style={{ textAlign: "center", padding: "10px" }}>
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
                    </TableRow>
                  </TableHead>
  
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>{selectedRow.customers_name}</TableCell>
                    </TableRow>
                  </TableHead>
  

                  <TableRow>
        <TableCell component="th" scope="row">
          Payment
        </TableCell>
        
          <TableCell>    <a href={selectedRow.payment} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
        {selectedRow.payment}
      </a></TableCell>
        
      </TableRow> 
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        SalesRoute
                      </TableCell>
                      <TableCell>{selectedRow.sales_Route}</TableCell>
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

                  <TableRow>
                      <TableCell component="th" scope="row">
                       CSI_CRSI_Number
                      </TableCell>
                      <TableCell>{selectedRow.CSI_CRSI_Number}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Bank Name
                      </TableCell>
                      <TableCell>{selectedRow.Bank_Name}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Amount
                      </TableCell>
                      <TableCell>{selectedRow.Amount}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Bank Reference Number 
                      </TableCell>
                      <TableCell>{selectedRow.Bank_Reference_Number}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Deposit Date
                      </TableCell>
                      <TableCell>{selectedRow.financepayment_at}</TableCell>
                  </TableRow>



                      <TableRow height="70px">
                      <TableRow>
                      <TableCell component="th" scope="row">
                       Issue case
                      </TableCell>
                      <TableCell>
              <input
                type="text"
                placeholder="State an issue if there is any"
                value={finance_returned_issue} 
                onChange={(e) => setfinance_returned_issue(e.target.value)} 
                // Add your input field logic here
                style={{
                  // Add your styling properties here
                  border: '1px solid black',
                  padding: '8px',
                  borderRadius: '4px',
                  width:"250%", 
                }}
              />
            </TableCell>
        </TableRow>
                      <TableRow height="70px">
            
          </TableRow>
                    </TableRow>
  
                    <TableRow>
                      <TableCell align="left">
                        <Button
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
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default SalesOrderApprovePage;


/*import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesOrderApprovePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [csiCrsiNumber, setCsiCrsiNumber] = useState("");
  const [bankName, setBankName] = useState(null);
  const [amount, setAmount] = useState(null);
  const [bankReferenceNumber, setBankReferenceNumber] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/sales-order/finance-manager-view");
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
    { field: "Q", headerName: "Q", flex: 1 },
    { field: "Q_CASH", headerName: "Q CASH", flex: 1 },
    { field: "H", headerName: "H", flex: 1 },
    { field: "H_CASH", headerName: "H CASH", flex: 1 },
    { field: "ONE", headerName: "ONE", flex: 1 },
    { field: "ONE_CASH", headerName: "ONE CASH", flex: 1 },
    { field: "TWO", headerName: "TWO", flex: 1 },
    { field: "TWO_CASH", headerName: "TWO CASH", flex: 1 },
    { field: "Total", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    {
      field: "sdm_approved",
      headerName: "Approved",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApprove(params.row._id)}
        >
          Approved
        </Button>
      ),
    },
    {
      field: "finance_approved",
      headerName: "Finance Approve",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleApprove(params.row._id)}
        >
          Approve
        </Button>
      ),
    },
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/sales-order/finance-manager-create/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Customer approved successfully:", data);
      toast.success("Sales Order Has been sent to Logisitics");
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving customer:", error);
      toast.error("Error approving order");
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
      <Header title="Sales Order Approve" subtitle="List of Sales Orders that require Verification" />
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
        <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order Summary</h2>
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
              <p>Deposit Date: {selectedRow.Deposit_Date}</p>
              <p>Bank Refernce Number: {selectedRow.Bank_Reference_Number}</p>
              <p>CSI_CSRI_NUMBER: {selectedRow.CSI_CRSI_Number}</p>  
              <p> Bank_Name: {selectedRow.Bank_Name}</p>
              <p> Amount: {selectedRow.Amount}</p>
              <p> Deposit_Date: {selectedRow.Deposit_Date}</p>

         
         
         
         
      
       
        
        </div>
        )}
      </Box>
    </Modal>
     
          
           
        </Box>
      );
    };
    
    export default SalesOrderApprovePage; */