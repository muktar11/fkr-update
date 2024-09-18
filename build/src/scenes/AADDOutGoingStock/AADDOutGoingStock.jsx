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

const AADDOutGoingStock = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory_file, setinventory_file] = useState("");
  const [inventory_recipant, setinventory_recipant] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/AADD-finance-manager-retrieve-view");
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
      const response = await fetch(`http://localhost:8000/commerce/AADD-finance-manager-approve-create/${id}/`, {
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
        title=" AADD OutGoing Sales Order"
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
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
           
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        
            width: "60%",
            fontFamily: "Arial, sans-serif",
            color: "#333",
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
                <TableCell>SalesPerson</TableCell>   
                  <TableCell>{selectedRow.SalesPerson}</TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>Plate</TableCell> 
                  <TableCell>{selectedRow.Plate_number}</TableCell>
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
                    <TableCell>
                      <input
                        type="text"
                        placeholder="recipant Name"
                        value={inventory_recipant}
                        onChange={(e) => setinventory_recipant(e.target.value)} 
                        // Add your input field logic here
                        style={{
                          // Add your styling properties here
                          border: '1px solid black',
                          padding: '8px',
                          borderRadius: '4px',
                          width:"100%", 
                          height:"140%",
                        }}
                      />
                    </TableCell>  

                      <TableCell>
                    <input
                      type="file"
                      id="file-upload"
                     
                      onChange={(event) => {
                      setinventory_file("inventory_file", event.currentTarget.files[0]);
                      // Handle the uploaded file here
                  }}
                  />
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

export default AADDOutGoingStock;
