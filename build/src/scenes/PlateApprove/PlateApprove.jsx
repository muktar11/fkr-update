import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlateApprove = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/commerce/plate-view');
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, [page]);

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "plate_no", headerName: "Plate Number", flex: 2, cellClassName: "name-column--cell" },
    { field: "drivers_name", headerName: "Drivers Name", flex: 2 },
    { field: "is_approved", headerName: "Status", flex: 1, renderCell: (params) => (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleApprove(params.row._id)}
      >
        Approve
      </Button>
    ) },
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/plate/approve/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("Customer approved successfully:", data);
      toast.success("Plate Approved successfully");
      handleUpdateClick()
      // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving customer:", error);
      toast.error("Error approving customer");
    }
  };


  
  const handleUpdateClick = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/plate/approve/${id}/`);
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Plate Approve"
        subtitle="List of Plate that require Approval"
      /> 
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
            height: "10vh", // Set the desired height for the customer_name field
        
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            height: "10vh", // Set the desired height for the customer_name field
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
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
        />
      </Box>
    </Box>
  );
};

export default PlateApprove;