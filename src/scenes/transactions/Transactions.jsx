import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";

const Transactions = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/");
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
    { field: "plate", headerName: "Plate", flex: 1 },
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
    { field: "Qp", headerName: "0.35ml", flex: 1 },
    { field: "Q_CASH", headerName: "0.35ml Birr", flex: 1 },
    { field: "Hp", headerName: "0.6ml", flex: 1 },
    { field: "H_CASH", headerName: "0.6ml Birr", flex: 1 },
    { field: "ONEp", headerName: "1L", flex: 1 },
    { field: "ONE_CASH", headerName: "1L Birr", flex: 1 },
    { field: "TWOp", headerName: "2L", flex: 1 },
    { field: "TWO_CASH", headerName: "2l Birr", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total Birr", flex: 1 },
    
  
  ];

  const getRowId = (row) => row._id;

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" Daily Transaction"
        subtitle="List of our Daily Orders "
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
    </Box>
  );
};
export default Transactions;



