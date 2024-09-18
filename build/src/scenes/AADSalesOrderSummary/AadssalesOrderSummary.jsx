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

const  AADDSalesOrderSummary = () => {
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
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/AADD-finance-manager-approve-retrieve");
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
    { field: "SalesPerson", headerName: "SalesPersonName", flex: 1 },
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
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/create-finance-inventory-form/${id}/`, {
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
        title=" AADD Sales Order Summary"
        subtitle="List of orders "
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
      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order Summary</h3>
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


     
    </div>
  )}
</Box>
      </Modal>
    </Box>
  );
};

export default AADDSalesOrderSummary;