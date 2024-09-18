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
import CircularProgress from "@mui/material/CircularProgress";
const InventoryReturn = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [inventory_file, setinventory_file] = useState(null);
  const [inventory_recipant, setinventory_recipant] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [validationError, setValidationError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-finance-inventory-list");
        const data = await response.json();
        setCustomerData(data); // Update the state with the fetched data
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);


  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-finance-inventory-list");
      const data = await response.json();
      setCustomerData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
 
  
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Sales Person", flex: 1 },
  
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "Qp", flex: 1 },  
    { field: "Q_CASH", headerName: "Qp", flex: 1 },    
    { field: "Hp", headerName: "Hp", flex: 1 },   
    { field: "H_CASH", headerName: "H_CASH", flex: 1 },
    { field: "ONEp", headerName: "ONEp", flex: 1 },   
    { field: "ONE_CASH", headerName: "ONE_CASH", flex: 1 },
    { field: "TWOp", headerName: "TWOp", flex: 1 },   
    { field: "TWO_CASH", headerName: "TWO_CASH", flex: 1 },  
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
  
    try {
      const formData = new FormData();
      formData.append("inventorycreated_first_name", firstName);
      formData.append("inventorycreated_last_name", lastName);
      formData.append("inventory_recipant", inventory_recipant);
      formData.append("inventory_file", inventory_file);
  
      if (selectedRow) {
        if (inventory_recipant.trim() === '') {
          // CSI CSRI value is required, display an error message or perform any necessary action
          toast.error("recipant value is required");
          return;
        }
        if (!formData.get("inventory_file")) {
          // Inventory file is required, display an error message or perform any necessary action
          toast.error("Inventory file is required");
          return;
        }
    
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/commerce/create-finance-inventory-form/${id}/`,
          {
            method: "PUT",
            body: formData,
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          console.log("Sales Order approved successfully:", data);
          toast.success("Sales Order Approved successfully");
          // You can update the customerData state or perform any other action here
          handleUpdateClick();
          handleCloseModal();
        } else {
          throw new Error("Error approving Sales Order");
        }
      }
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };

  
  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    setinventory_file(file);
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
        title=" Sales Order Inventory"
        subtitle="List of orders that requires Inventory Verification"
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
                       Inventory
                      </TableCell>
                      <TableCell>{selectedRow.Inventory}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Plate
                      </TableCell>
                      <TableCell>{selectedRow.plate}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Driver
                      </TableCell>
                      <TableCell>{selectedRow.Driver}</TableCell>
                  </TableRow>                        
<TableRow  >
<TableCell>
              <input
                type="text"
                placeholder="Inventory Recipant Name"
                value={inventory_recipant} 
                onChange={(e) => setinventory_recipant(e.target.value)} 
                // Add your input field logic here
                style={{
                  // Add your styling properties here
                  border: '1px solid black',
                  padding: '8px',
                  borderRadius: '4px',
              
                  height:"140%",
                }}
              />
               {validationError && (
      <span style={{ color: 'red' }}>Inventory Recipant value is required</span>
    )}
            </TableCell>

  <TableCell>

  <input
  type="file"
  style={{ display: "none" }}
  id="inventory_file"

  onChange={handlePaymentChange}
/>
              <label htmlFor="inventory_file">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  attach file inventory_recipant
                </Button>
              </label>

    
  </TableCell>


                     
                    
                    </TableRow>
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

export default InventoryReturn;

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

const InventoryReturn = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory_file, setinventory_file] = useState("");
  const [inventory_recipant, setinventory_recipant] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/access-finance-inventory-list");
        const data = await response.json();
        setCustomerData(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);

 
  
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Sales Person", flex: 1 },
    { field: "payment", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "Qp", flex: 1 },  
    { field: "Q_CASH", headerName: "Qp", flex: 1 },    
    { field: "Hp", headerName: "Hp", flex: 1 },   
    { field: "H_CASH", headerName: "H_CASH", flex: 1 },
    { field: "ONEp", headerName: "ONEp", flex: 1 },   
    { field: "ONE_CASH", headerName: "ONE_CASH", flex: 1 },
    { field: "TWOp", headerName: "TWOp", flex: 1 },   
    { field: "TWO_CASH", headerName: "TWO_CASH", flex: 1 },  
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/create-finance-inventory-form/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory_recipant: inventory_recipant,
          inventory_file: inventory_file,
       
        }),
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
        title=" Sales Order Inventory"
        subtitle="List of orders that requires Inventory Verification"
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
    height: "600px",
    display:"flex",
    flexDirection: "column",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "800px",
    width: "100%",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    overflow: "auto",
  }}
>
  {selectedRow && (
    <div>
      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order</h3>
      <p>ID: {selectedRow._id}</p>
      <p>Customer's Name: {selectedRow.sales_person}</p>
      <p>payment: {selectedRow.plate}</p>
      <p>SalesRoute: {selectedRow.Route}</p>
      <p>035ml Qty: {selectedRow.Qp}</p>
      <p>0.6ml Qty: {selectedRow.Hp}</p>
      <p>1L Qty: {selectedRow.ONEp}</p>
      <p>2L Qty: {selectedRow.TWOp}</p>
      <p>Total Qty: {selectedRow.Totalp}</p>
      <p>035ml Birr: {selectedRow.Q_CASH}</p>
      <p>0.6ml Birr: {selectedRow.H_CASH}</p>
      <p>1L Birr: {selectedRow.ONE_CASH}</p>
      <p>2L Birr: {selectedRow.TWO_CASH}</p>
      <p>Total Birr: {selectedRow.Total_CASH}</p>

      <p>CSI/CSRI Number: {selectedRow.Total_CASH}</p>
      <p>Bank Name: {selectedRow.Bank_Name}</p>
      <p>Amount: {selectedRow.Amount}</p>
      <p>Bank Refernce Number: {selectedRow.Bank_Reference_Number}</p>
      <p>Deposit Date: {selectedRow.Deposit_Date}</p>

     

      

      
       

     

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Process Sales Order </h3>


      <div style={{ display: "flex", flexDirection: "column", }}>
  
  <div style={{ display: "flex" }}>
    <input
      type="Text"
      placeholder="recipant Name"
      value={inventory_recipant}
      onChange={(e) => setinventory_recipant(e.target.value)} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "300px",
        height: "40px",
      }}
    />    
  </div>
  <div style={{ display: "flex", alignItems: "center",  marginTop:"10px"}}>

<input
  type="file"
  id="file-upload"
  style={{ display: "none" }}
    onChange={(event) => {
      setinventory_file("inventory_file", event.currentTarget.files[0]);
    // Handle the uploaded file here
  }}
/>

<button
  variant="contained"
  color="primary"
  style={{
    borderRadius: "5px",
    backgroundColor: "#00BFFF",
    padding: "8px 12px",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginLeft: "50px",
    width: "200px",
    height: "40px",
  }}
  onClick={() => {
    document.getElementById("file-upload").click();
  }}
>
  Attach
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

export default InventoryReturn; */