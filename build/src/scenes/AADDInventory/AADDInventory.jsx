import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import CircularProgress from "@mui/material/CircularProgress";

const AADDInventoryReturn = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory_file, setinventory_file] = useState(null);
  const [inventory_recipient, setinventory_recipient] = useState("");

  const [reload_file, setreload_file] = useState(null);
  const [reload_recipient, setreload_recipient] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [validationError, setValidationError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/AADD-finance-manager-retrieve-view");
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
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/AADD-finance-manager-retrieve-view");
      const data = await response.json();
      setCustomerData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

 
  
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "SalesPerson", headerName: "Sales Person", flex: 1 },
    { field: "Plate_number", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "Qp", flex: 1 },  
    { field: "Q_CASH", headerName: "Qp", flex: 1 },    
    { field: "Hp", headerName: "Hp", flex: 1 },   
    { field: "H_CASH", headerName: "H_CASH", flex: 1 },
    { field: "ONEp", headerName: "ONEp", flex: 1 },   
    { field: "ONE_CASH", headerName: "ONE_CASH", flex: 1 },
    { field: "TWOp", headerName: "TWOp", flex: 1 },   
    { field: "TWO_CASH", headerName: "TWO_CASH", flex: 1 },  
    { field: "Totalp", headerName: "Total Qty", flex: 1 },   
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },  
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append("inventory_recipant", inventory_recipient);
      formData.append("inventory_file", inventory_file);

      if (selectedRow) {
        if (inventory_recipient.trim() === '') {
          // CSI CSRI value is required, display an error message or perform any necessary action
          toast.error("recipant value is required");
          return;
        }

        if (!formData.get("inventory_file")) {
          // Inventory file is required, display an error message or perform any necessary action
          toast.error("Inventory file is required");
          return;
        }

      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/AADD-finance-manager-approve-create/${id}/`, 
        {
          method: "PUT",
          body: formData,
        }
      )
      if (response.ok) {;
      const data = await response.json();
      console.log("Sales Order Has Successfully Loaded:", data);
      toast.success("Sales Order Has Successfully Loaded:");
      handleUpdateClick()
      handleCloseModal()
      // You can update the customerData state or perform any other action here
    } else  {
      throw new Error("Error approving Sales Order");
      toast.error("Error approving Sales Order");
    }
  } 
 } catch (error) {
    console.error("Error approving Sales Order:", error);
    toast.error("Error approving Sales Order");
  }
};



const handleReload = async (id) => {
  try {
    const formData = new FormData();
    formData.append("reload_file", reload_file);
    formData.append("reload_recipient", reload_recipient);

    if (selectedRow) {
      if (reload_recipient.trim() === '') {
        // CSI CSRI value is required, display an error message or perform any necessary action
        toast.error("recipant value is required");
        return;
      }

    const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/update-reload-AADD-SalesOrder/${id}/`, 
      {
        method: "PUT",
        body: formData,
      }
    )
    if (response.ok) {;
    const data = await response.json();
    console.log("Sales Order Has Successfully Loaded:", data);
    toast.success("Sales Order Has Successfully Loaded:");
    handleUpdateClick()
    handleCloseModal()
    // You can update the customerData state or perform any other action here
  } else  {
    throw new Error("Error approving Sales Order");
    toast.error("Error approving Sales Order");
  }
} 
} catch (error) {
  console.error("Error approving Sales Order:", error);
  toast.error("Error approving Sales Order");
}
};

  
 
  
  const rows = customerData.map((row) => ({
    _id: row._id,
    name: row.SalesPerson,
    salesRoute: row.SalesRoute,
    Plate: row.Plate_number,
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


  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    setinventory_file(file);
    };
  

    
  const handleReloadChange = (event) => {
    const file = event.target.files[0];
    setreload_file(file);
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
        title=" AADD Sales Order Inventory"
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
            <TableCell>SalesPerson</TableCell>   
            <TableCell>{selectedRow.SalesPerson}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell>Plate</TableCell> 
            <TableCell>{selectedRow.Plate_number}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              SalesRoute
            </TableCell>      
            <TableCell>{selectedRow.sales_Route}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              0.35ml
            </TableCell>
            <TableCell>{selectedRow.Qp}(Qty)</TableCell>
            <TableCell>{selectedRow.Q_CASH}(Value)</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              0.6ml
            </TableCell>
            <TableCell>{selectedRow.Hp}(Qty)</TableCell>
            <TableCell>{selectedRow.H_CASH}(Value)</TableCell>
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
            <TableCell>
              <input
                type="text"
                placeholder="Recipient Name"
                value={inventory_recipient}
                onChange={(e) => setinventory_recipient(e.target.value)} 
                style={{
                  border: '1px solid black',
                  padding: '8px',
                  borderRadius: '4px',
                  width: '100%',
                  height: '140%',
                }}
              />
               {validationError && (
      <span style={{ color: 'red' }}>Inventory Recipant value is required</span>
    )}
            </TableCell>  
            <TableCell>
              <input
                type="file"
                id="inventory_file"
                style={{ display: 'none' }}
                onChange={handleReloadChange}
              />
              <label htmlFor="inventory_file">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                >
                  Attach File
                </Button>
              </label>
            </TableCell>    


            <TableCell align="right">
            <Button
  key={selectedRow._id}
  variant="contained"
  color="primary"
  onClick={() => handleApprove(selectedRow._id)}
  disabled={selectedRow.reload.length >= 1}
  style={{
    borderRadius: "5px",
    backgroundColor: selectedRow.reload.length >= 1 ? "#ccc" : "#00BFFF",
    color: "white",
    border: "none",
    cursor: selectedRow.reload.length >= 1 ? "not-allowed" : "pointer",
    width: "100px",
    height: "40px",
    marginRight: "10px",
  }}
>
  Load
</Button>
        
      </TableCell>

          </TableRow>

          


          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>
                <Header
                  title="Reload Order"
                  subtitle="Orders that require reload"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          
          {selectedRow.reload.map((item, index) => (
  <React.Fragment key={index}>
    <TableRow>
      <TableCell>Id</TableCell>
      <TableCell>{item.order}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>0.35ml</TableCell>
      <TableCell>{item.Qp}(Qty)</TableCell>
      <TableCell>{item.Q_CASH}(Value)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>0.6ml</TableCell>
      <TableCell>{item.Hp}(Qty)</TableCell>
      <TableCell>{item.H_CASH}(Value)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>1L</TableCell>
      <TableCell>{item.ONEp}(Qty)</TableCell>
      <TableCell>{item.ONE_CASH}(Value)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>2L</TableCell>
      <TableCell>{item.TWOp}(Qty)</TableCell>
      <TableCell>{item.TWO_CASH}(Value)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell>{item.Totalp}(Qty)</TableCell>
      <TableCell>{item.Total_CASH}(Value)</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>
        <input
          type="text"
          placeholder="Recipient Name"
          value={reload_recipient}
          onChange={(e) => setreload_recipient(e.target.value)} 
          style={{
            border: '1px solid black',
            padding: '8px',
            borderRadius: '4px',
            width: '100%',
            height: '140%',
          }}
        />
      </TableCell>  
      <TableCell>
        <input
          type="file"
          id="reload_file"
          style={{ display: 'none' }}
          onChange={handlePaymentChange}
        />
        <label htmlFor="reload_file">
          <Button
            component="span"
            color="primary"
            variant="contained"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            Attach File
          </Button>
        </label>
      </TableCell>    

      

<TableCell align="right">
              <Button
            key={selectedRow._id}
            variant="contained"
            color="primary"
            onClick={() => handleReload(selectedRow._id)}
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
            Reload
          </Button>
        
      </TableCell>
    </TableRow>
  </React.Fragment>
))}
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

export default AADDInventoryReturn;
