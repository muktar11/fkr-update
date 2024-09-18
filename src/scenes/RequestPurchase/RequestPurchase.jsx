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

const  RequestPurchase = () => {
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
  const [Delivery_Date, setDelivery_Date] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"commerce/AADD-finance-manager-logistics-view");
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
      const firstName = localStorage.getItem("first_name");
      const lastName = localStorage.getItem("last_name");
      const response = await fetch(process.env.REACT_APP_API_URL+`commerce/AADD-finance-manager-logistics-create/${id}/`, {
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
      console.log("Sales Order approved successfully:", data);
      toast.success("Sales Order Approved successfully");
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
        title="Purchase Request"
        subtitle="Monthly RAW Material Requirement Planning FORM"
      /> 
      
     
      <Box

>

    <div>
    <TableContainer component={Paper}>
  <div style={{ textAlign: "center", padding: "10px" }}>
  
  </div>
  <Table size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Date</TableCell>
        <TableCell>Deposit Date</TableCell>
        <TableCell>Delivery required by date</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>
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
                    marginRight: "2rem",
                  },
                }}
                sx={{      
                  borderRadius: "5px",
                  margin:" 0 auto",
                  padding: "0.3rem 2rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        </TableCell>
        <TableCell>
          <DatePicker
            label="Delivery Date"
            placeholderText="Delivery Date"
            value={Delivery_Date}
            onChange={(newValue) => setDelivery_Date(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                InputProps={{
                  style: {
                    color: "black", // Change the font color to black
                    marginRight: "2rem",
                  },
                }}
                sx={{      
                  borderRadius: "5px",
                  margin:" 0 auto",
                  padding: "0.3rem 2rem",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>


                   
                 
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
                         marginTop:"20px",
                         marginRight: "10px",
                       }}
                     >
                       Approve
                     </Button>
                 
                 
    </div>
</Box>
     
    </Box>
  );
};

export default RequestPurchase;

