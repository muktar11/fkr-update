import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
const  Area1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const { route_pk, selectedValue } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/all_price/Area1/");
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
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "Q", headerName: "0.35ml", flex: 1, cellClassName: "name-column--cell" },
    { field: "H", headerName: "0.6ml", flex: 1, cellClassName: "name-column--cell" },
    { field: "ONE", headerName: "1L", flex: 1, cellClassName: "name-column--cell" },
    { field: "TWO", headerName: "2L", flex: 1, cellClassName: "name-column--cell" },
    { field: "TransportationFee", headerName: "TransportationFee/Km", flex: 1 },
    { field: "created_at", headerName: "Created At", flex: 1 },
    
  
  ];

  const getRowId = (row) => row._id;

  return (
    <Box m="20px">
      <Header
        title="Area1 Price Set"
        subtitle="List of Set Prices "
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

export default  Area1;