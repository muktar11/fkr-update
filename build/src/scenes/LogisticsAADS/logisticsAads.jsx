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

const AADSLogistics = () => {
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
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-finance-inventory-list");
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
    { field: "customers_name", headerName: "Sales Person", flex: 1 },
    { field: "payment", headerName: "Plate", flex: 1 },
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

  


  const rows = customerData.map((row) => ({
    _id: row._id,
    name: row.customers_name,
    salesRoute: row.sales_Route,
    Plate: row.plate,
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
        title=" Sales Order Inventory"
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
        <TableCell>Customer</TableCell>
        {rows.map((row) => (
          <TableCell key={row.name}>{row.name}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell component="th" scope="row">
          SalesRoute
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.salesRoute}>{row.salesRoute}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.35mlQty (q)
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.Qp}>{row.Qp}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.35mlCash
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.Q_CASH}>{row.Q_CASH}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.6mlQty (q)
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.Hp}>{row.Hp}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.6mlCash
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.H_CASH}>{row.H_CASH}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          1LQty (q)
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.ONEp}>{row.ONEp}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          1LCash  
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.ONE_CASH}>{row.ONE_CASH}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          2LQty (q)
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.TWOp}>{row.TWOp}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          2LCash
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.TWO_CASH}>{row.TWO_CASH}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          TotalQty (q)
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.Totalp}>{row.Totalp}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          TotalCash
        </TableCell>
        {rows.map((row) => (
          <TableCell key={row.Total_CASH}>{row.Total_CASH}</TableCell>
        ))}
      </TableRow>
      <TableRow  display="column">
  <TableCell>
    <input
      type="text"
      placeholder="CSI/CRI Number"
      value={CSI_CRSI_Number}
      onChange={(e) => setCSI_CRSI_Number(e.target.value)}
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

  <TableCell>
    <input
      type="text"
      value={BankName}
      onChange={(e) => setBankName(e.target.value)}
      placeholder="Bank Name"
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

</TableRow>

<TableRow  display="column">
  <TableCell>
    <input
      type="text"
      placeholder="Deposit Amount"
      value={Amount}
      onChange={(e) => setAmount(e.target.value)}
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

  <TableCell>
    <input
      type="text"
      value={BankReferenceNumber}
      onChange={(e) => setBankReferenceNumber(e.target.value)}
      placeholder="Bank Reference Number"
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

 

  

  

</TableRow>


<TableRow  display="center">
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
          paddingTop:"10px"
        },
      }}
      sx={{
        paddingTop:"10px",
        borderRadius: "5px",
        boxShadow: "2px 2px 4px rgba(30, 30, 30, 30)",
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

<TableRow>
  <TableCell align="left">
    {rows.map((row) => (
      <Button
        key={row._id}
        variant="contained"
        color="primary"
        onClick={() => handleReject(row)}
        style={{
          borderRadius: "5px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100px",
          height: "40px",
          marginLeft: "10px",
        }}
      >
        Return
      </Button>
    ))}
  </TableCell>
  <TableCell align="right">
    {rows.map((row) => (
      <Button
        key={row._id}
        variant="contained"
        color="primary"
        onClick={() => handleApprove(row._id)}
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
    ))}
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

export default AADSLogistics;

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

const AADSLogistics = () => {
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
        const response = await fetch("http://localhost:8000/commerce/access-finance-inventory-list");
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
    { field: "customers_name", headerName: "Sales Person", flex: 1 },
    { field: "payment", headerName: "Plate", flex: 1 },
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
      const response = await fetch(`http://localhost:8000/commerce/create-finance-inventory-form/${id}/`, {
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
        title=" Sales Order Inventory"
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

      <p>CSI/CSRI Number: {selectedRow.Total_CASH}</p>
      <p>Bank Name: {selectedRow.Bank_Name}</p>
      <p>Amount: {selectedRow.Amount}</p>
      <p>Bank Refernce Number: {selectedRow.Bank_Reference_Number}</p>
      <p>Deposit Date: {selectedRow.Deposit_Date}</p>

     

      

      
       

     

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Process Sales Order Logistics</h3>


      <div style={{ display: "flex", flexDirection: "column", }}>
  
  <div style={{ display: "flex" }}>
    <input
      type="Text"
      placeholder="recipant Name"
      value={inventory_recipant}
      onChange={(e) => setinventory_recipant(e.target.value)} 
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
  <div style={{ display: "flex", alignItems: "center",  marginTop:"10px"}}>

<input
  type="file"
  id="file-upload"
  style={{ display: "none" }}
    onChange={(event) => {
      setinventory_file("inventory_file", event.currentTarget.files[0]);
    // Handle the uploaded file here
  }}
/>

<button
  variant="contained"
  color="primary"
  style={{
    borderRadius: "5px",
    backgroundColor: "#00BFFF",
    padding: "8px 12px",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginLeft: "50px",
    width: "200px",
    height: "40px",
  }}
  onClick={() => {
    document.getElementById("file-upload").click();
  }}
>
  Attach Payment
</button>
    
  </div>



  <div style={{ marginTop: "100px" }}>
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

export default AADSLogistics;
*/