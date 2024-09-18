import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const  SalesPersonApprove = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-person-view/`);
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
    { field: "sales_person", headerName: "Sales Person", flex: 1, cellClassName: "name-column--cell" },
    { field: "phone", headerName: "phone", flex: 1 },
    { field: "Route", headerName: "Route", flex: 1 },
    { field: "sales_target", headerName: "Sales Target", flex: 1 },
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
     
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-person/approve/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
       
      });
      if (response.ok) {
        console.log("Sales person approved successfully");
        toast.success("Sales person approved successfully");
        handleUpdateClick()
        // You can update the sales person's status in the state or perform any other action here
      } else {
        console.error("Failed to approve sales person");
        toast.error("Failed to approve sales person");
      }
    } catch (error) {
      console.error("Error approving sales person:", error);
      toast.error("Error approving sales person");
    }
  };

  const handleUpdateClick = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-person/approve/${id}/`);
      const data = await response.json();
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Customers Approve"
        subtitle="List of Customers that require Approval"
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

export default SalesPersonApprove;