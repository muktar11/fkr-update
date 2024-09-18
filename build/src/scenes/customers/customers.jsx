import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
const Customers = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/api/webcustomer/approve/list/");
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
    { field: "customer_name", headerName: "Customer Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "sales_route", headerName: "Sales Route", flex: 0.5 },
    { field: "tin_number", headerName: "TIN Number", flex: 1 },
    {
      field: "tin_number_doc_url",
      headerName: "Tin Number Doc",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "business_license_no", headerName: "Business License", headerName: "License Number", flex: 0.8 }, // Modified line
    {
      field: "business_license_no_doc_url",
      headerName: "Business License",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
  
    { field: "business_registration_no", headerName: "Business Registration Number", flex: 1.5 },
    {
      field: "business_registration_no_doc_url",
      headerName: "Business Registration",
      flex: 1,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          {params.value}
        </a>
      ),
    },
    { field: "sales_target", headerName: "Sales Target", flex: 1 },
    { field: "ledger", headerName: "ledger", flex: 1 },
    { field: "tin_number_doc", headerName: "TIN Number_DOC", flex: 1 },
    { field: "is_approved", headerName:"Status", flex: 1, renderCell: (params) => (
      <Button
        variant="contained"
        sx={{ color: "black", backgroundColor:"lightgrey"}}
      >
        Approved
      </Button>
    ) },
  ];

  const getRowId = (row) => row._id;

  
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
      <Header
        title="Customers Approve"
        subtitle="List of Registerd Customers "
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
      <TableCell>Customer Name</TableCell>   
        <TableCell>{selectedRow.customer_name}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
         <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
  </TableHead>
  <TableHead>
    <TableRow>
      <TableCell>Email</TableCell> 
        <TableCell>{selectedRow.email}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
                   <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

  </TableHead>
  <TableHead>
    <TableRow>
      <TableCell>Phone</TableCell> 
        <TableCell>{selectedRow.phone}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
                   <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

  </TableHead>

  <TableHead>
    <TableRow>
      <TableCell>Contact Information</TableCell> 
        <TableCell>{selectedRow.contact_information}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
                   <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

  </TableHead>

  <TableBody>
    <TableRow>
      <TableCell component="th" scope="row">
        SalesRoute
      </TableCell>      
        <TableCell>{selectedRow.sales_route}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
         <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
        Tin number 
      </TableCell>
      <TableCell >{selectedRow.tin_number}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
        Tin number file
      </TableCell>
      
        <TableCell ><a href={selectedRow.tin_number_doc_url} style={{ color: 'yellow', marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
        {selectedRow.tin_number_doc_url}
  </a></TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

    <TableRow>
      <TableCell component="th" scope="row">
        Business Liscense number 
      </TableCell>
      <TableCell >{selectedRow.tin_number}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
      Business Liscense  file
      </TableCell>
      <TableCell ><a href={selectedRow.business_license_no_doc} style={{ color: 'yellow', marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
      {selectedRow.business_license_no_doc}
  </a></TableCell>

        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>


    <TableRow>
      <TableCell component="th" scope="row">
      Business Registeration  number 
      </TableCell>
      <TableCell >{selectedRow.tin_number}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell component="th" scope="row">
      Business Registeration file
      </TableCell>
      <TableCell ><a href={selectedRow.business_registration_no_doc} style={{ color: 'yellow', marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
      {selectedRow.business_registration_no_doc}
  </a></TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>
    

    <TableRow>
      <TableCell component="th" scope="row">
      Sales Target
      </TableCell>
      <TableCell >{selectedRow.sales_target}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

    <TableRow>
      <TableCell component="th" scope="row">
      Gps Coordinates 
      </TableCell>
      <TableCell >{selectedRow.gps_coordinates}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
    </TableRow>

    <TableRow>
      <TableCell component="th" scope="row">
      Ledger 
      </TableCell>
      <TableCell >{selectedRow.ledger}</TableCell>
        <TableCell >{selectedRow.Q_CASH}</TableCell>
        <TableCell>{selectedRow.T}</TableCell>
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

export default Customers;