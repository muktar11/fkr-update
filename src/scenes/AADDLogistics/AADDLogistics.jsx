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

const  AADDLogisticsSummary = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory, setinventory] = useState("Addis Ababa")
  const [plate_no, setplate_no] = useState("");
  const [Driver, setDriver] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/AADD-finance-manager-logistics-view");
        const data = await response.json();
        setCustomerData(data); // Update the state with the fetched data
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/AADD-finance-manager-logistics-view");
      const data = await response.json();
      setCustomerData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  

 
  
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Customer", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "0.35ml", flex: 1 },  
    { field: "Q_CASH", headerName: "1L", flex: 1 },    
    { field: "Hp", headerName: "0.6ml CASH", flex: 1 },   
    { field: "H_CASH", headerName: "0.6ml CASH", flex: 1 },
    { field: "ONEp", headerName: "1L", flex: 1 },   
    { field: "ONE_CASH", headerName: "1L CASH", flex: 1 },
    { field: "TWOp", headerName: "2L", flex: 1 },   
    { field: "TWO_CASH", headerName: "2L", flex: 1 },  
    { field: "Totalp", headerName: "TotalQty", flex: 1 },  
    { field: "Total_CASH", headerName: "TotalCash", flex: 1 },  
];


  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const firstName = localStorage.getItem("first_name");
      const lastName = localStorage.getItem("last_name");
      if (selectedRow) {
        if (inventory.trim() === '') {
          // Inventory value is required, display an error message or perform any necessary action
          toast.error("Inventory value is required");
          return;
        }
        if (plate_no.trim() === '') {
          // Plate number value is required, display an error message or perform any necessary action
          toast.error("Plate number value is required");
          return;
        }
        if (Driver.trim() === '') {
          // Driver value is required, display an error message or perform any necessary action
          toast.error("Driver value is required");
          return;
        }
  
        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/AADD-finance-manager-logistics-create/${id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logisitcmanagercreated_first_name: firstName,
            logisitcmanagercreated_last_name: lastName,
            inventory: inventory,
            plate_no: plate_no,
            Driver: Driver,
          }),
        });
        const data = await response.json();
        console.log("Sales Order Sent to Inventory:", data);
        toast.success("Sales Order Sent to Inventory");
        handleUpdateClick();
        handleCloseModal();
        // You can update the customerData state or perform any other action here
      }
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
        title=" Sales Order Logistics"
        subtitle="List of orders that requires logistics"
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

                
                                      
<TableRow  display="column">
  <TableCell>
    <select
      type="text"
      placeholder="inventory"
      value={inventory}
      onChange={(e) => setinventory(e.target.value)}
      // Add your input field logic here
      style={{
        // Add your styling properties here
        border: '1px solid black',
        padding: '8px',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
      }}
    >
      {validationError && (
      <span style={{ color: 'red' }}>Inventory value is required</span>
    )}
  <option value="AdissAbaba">Addis Ababa</option>
<option value="Agena">Agena</option>
<option value="Wolketie">Wolketie</option>
    </select>
  </TableCell>

  <TableCell>
    <input
      type="text"
      value={plate_no}
      onChange={(e) => setplate_no(e.target.value)}
      placeholder="Plate"
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
      <span style={{ color: 'red' }}>Plate number is required</span>
    )}
  </TableCell>

</TableRow>
<TableRow  display="column">
 
  <TableCell>
    <input
      type="text"
      value={Driver}
      onChange={(e) => setDriver(e.target.value)}
      placeholder="Drivers Name"
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
  {validationError && (
      <span style={{ color: 'red' }}>Driver is required</span>
    )}
                     
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
  )}
</Box>
      </Modal>
    </Box>
  );
};

export default AADDLogisticsSummary;


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

const  AADDLogisticsSummary = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory, setinventory] = useState("");
  const [plate_no, setplate_no] = useState("");
  const [Driver, setDriver] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/AADD-finance-manager-logistics-view");
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
    { field: "customers_name", headerName: "Customer", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "0.35ml", flex: 1 },  
    { field: "Q_CASH", headerName: "1L", flex: 1 },    
    { field: "Hp", headerName: "0.6ml CASH", flex: 1 },   
    { field: "H_CASH", headerName: "0.6ml CASH", flex: 1 },
    { field: "ONEp", headerName: "1L", flex: 1 },   
    { field: "ONE_CASH", headerName: "1L CASH", flex: 1 },
    { field: "TWOp", headerName: "2L", flex: 1 },   
    { field: "TWO_CASH", headerName: "2L", flex: 1 },  
    { field: "Totalp", headerName: "TotalQty", flex: 1 },  
    { field: "Total_CASH", headerName: "TotalCash", flex: 1 },  
];


  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/AADD-finance-manager-logistics-create/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventory: inventory,
          plate_no: plate_no,
          Driver: Driver,
       
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
        title=" Sales Order Logistics"
        subtitle="List of orders that requires logistics"
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
      <p>SalesPerson: {selectedRow.SalesPerson}</p>
      <p>Plate: {selectedRow.plate}</p>
      <p>Sales_Route: {selectedRow.sales_Route}</p>
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



     

      

      
       

     

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Process Sales Order Logistics</h3>


      <div style={{ display: "flex", flexDirection: "column",  }}>
  
  <div style={{ display: "flex", justifyContent:"space-between"}}>
  <select
value={inventory}
onChange={(e) => setinventory(e.target.value)}
style={{
borderRadius: "5px",
boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
padding: "8px 12px 10px 10px",
color: "black",
width: "300px",
height: "40px",
}}
>
<option value="AA">Addis Ababa</option>
<option value="Agena">Agena</option>
<option value="Wolketie">Wolketie</option>
</select>

<input
type="Text"
placeholder="Plate Number"
value={plate_no}
onChange={(e) => setplate_no(e.target.value)}
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


  <div style={{ display: "flex", alignItems: "center",  justifyContent:"space-between", marginTop:"10px"}}>



  <input
type="Text"
placeholder="Drivers Name"
value={Driver}
onChange={(e) => setDriver(e.target.value)}
style={{
borderRadius: "5px",
boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
padding: "8px 12px 10px 10px",
color: "black",
width: "300px",
height: "40px",
}}
/>
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

export default AADDLogisticsSummary;

*/