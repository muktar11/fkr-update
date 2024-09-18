import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
const InventoryStatus = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");
  const [Qpp, setQpp] = useState(0);
  const [Hpp, setHpp] = useState(0);
  const [ONEpp, setONEpp] = useState(0);
  const [TWOpp, setTWOpp] = useState(0);
  const [Totalpp, setTotalpp] = useState(0);
  const [recipient, setrecipient] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-inventory-list");
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-inventory-list");
      const data = await response.json();
      setCustomerData(data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };


  useEffect(() => {
    const calculateTotalpp = () => {
      if (selectedRow) {
        const { Qp, Hp, ONEp, TWOp } = selectedRow;
        const newTotalpp = Number(Qpp) + Number(Hpp) + Number(ONEpp) + Number(TWOpp);
        setTotalpp(newTotalpp);
      }
    };
  
    calculateTotalpp();
  }, [selectedRow, Qpp, Hpp, ONEpp, TWOpp]);


  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "SalesPerson", headerName: "SalesPerson", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "Plate_number", headerName: "Plate", flex: 1 },
    { field: "Qp", headerName: "Q", flex: 1 },
    { field: "Hp", headerName: "H", flex: 1 },
    { field: "ONEp", headerName: "ONE", flex: 1 },
    { field: "TWOp", headerName: "TWO", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {

        const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/create-inventory-form/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Qpp:Qpp,
            Hpp:Hpp,
            ONEpp:ONEpp,
            TWOpp:TWOpp,
            Totalpp:Totalpp,
            recipient,
          }),
        });
        const data = await response.json();
        console.log("Return has successfully Registered:", data);
        toast.success("Return has successfully Registered");
        handleUpdateClick()
        handleCloseModal()
        // You can update the customerData state or perform any other action here
    } catch (error) {
      console.error("Error approving Sales Order:", error);
      toast.error("Error approving Sales Order");
    }
  };
  const handleRowClick = (params) => {
    setSelectedRow(params.row);
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


  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" Inventory  Retrun"
        subtitle="List of orders that requires return data"
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
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",

    width: "60%",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    height:"600px",
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
        <TableCell >{selectedRow.Qp}(Qty)</TableCell>
          <TableCell >{selectedRow.Q_CASH}(Value)</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row">
          0.6ml
        </TableCell>
          <TableCell>{selectedRow.Hp}(Qty)</TableCell>
          <TableCell >{selectedRow.H_CASH}(Value)</TableCell>
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
        <TableCell component="th" scope="row">
        inventory recipant
        </TableCell>
        
          <TableCell>
            
            {selectedRow.inventory_recipant}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
             <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
        inventory recipant form
        </TableCell>
        
          <TableCell>
          <a href= {selectedRow.inventory_file} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
          {selectedRow.inventory_file}
  </a>
           </TableCell>
           <TableCell>{selectedRow.T}</TableCell>
           <TableCell>{selectedRow.T}</TableCell>
      </TableRow>


      <TableRow>
        <TableCell component="th" scope="row">
        inventory Reload
        </TableCell>
        
          <TableCell>
            
            {selectedRow.reload.reload_recipient}</TableCell>
            <TableCell>{selectedRow.T}</TableCell>
             <TableCell>{selectedRow.T}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
        inventory Reload form
        </TableCell>
        
          <TableCell>
          <a href= {selectedRow.inventory_file} style={{ color: 'yellow' }} target="_blank" rel="noopener noreferrer">
          {selectedRow.inventory_file}
  </a>
           </TableCell>
           <TableCell>{selectedRow.T}</TableCell>
           <TableCell>{selectedRow.T}</TableCell>
      </TableRow>


      <TableRow  display="column">
      <TableCell component="th" scope="row">
      0.35ml Qty
        </TableCell>
  <TableCell>
  <input
     
     value={Qpp} 
     onChange={(e) => setQpp(e.target.value)}
     type="text"
     placeholder="0.35ml"
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
<TableRow>
  <TableCell component="th" scope="row">
  0.6ml Qty
        </TableCell>
  <TableCell>
  <input
     
     value={Hpp} 
     onChange={(e) => setHpp(e.target.value)}
     type="text"
     placeholder="0.6ml"
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

<TableCell component="th" scope="row">
1L Qty
        </TableCell>
<TableCell>
    <input
      type="text"
      placeholder="1LQty"
      value={ONEpp}
      onChange={(e) => setONEpp(e.target.value)}
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
<TableRow>
<TableCell component="th" scope="row">
        2L Qty
        </TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="2LQty"
      value={TWOpp}
      onChange={(e) => setTWOpp(e.target.value)}
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

<TableRow>
<TableCell component="th" scope="row">
          Total Qty
        </TableCell>
<TableCell>
    <input
      type="text"
      placeholder="Total Qty"
      value={Totalpp}
      onChange={(e) => setTotalpp(e.target.value)}
      // Add your input field logic here
      style={{
        // Add your styling properties here
        border: '1px solid black',
        padding: '8px',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
      }}
      readOnly
     />
  </TableCell>
  </TableRow>

<TableRow>
  <TableCell component="th" scope="row">
          Recipant
        </TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="recipient"
      value={recipient}
      onChange={(e) => setrecipient(e.target.value)}
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
        Return
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

export default InventoryStatus;

/*
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";

const InventoryStatus = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Totalpp, setTotalpp] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/access-inventory-list");
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateTotalpp = () => {
      if (selectedRow) {
        const { Qpp, Hpp, ONEpp, TWOpp } = selectedRow;
        const newTotalpp = Number(Qpp) + Number(Hpp) + Number(ONEpp) + Number(TWOpp);
        setTotalpp(newTotalpp);
      }
    };
  
    calculateTotalpp();
  }, [selectedRow]);


  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "SalesPerson", headerName: "SalesPerson", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "Plate_number", headerName: "Plate", flex: 1 },
    { field: "Qp", headerName: "Q", flex: 1 },
    { field: "Hp", headerName: "H", flex: 1 },
    { field: "ONEp", headerName: "ONE", flex: 1 },
    { field: "TWOp", headerName: "TWO", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
  ];

  const getRowId = (row) => row._id;

  const handleApprove = async (id) => {
    try {
      if (selectedRow) {
        const { Qpp, Hpp, ONEpp, TWOpp } = selectedRow;
        const Totalpp = Number(Qpp) + Number(Hpp) + Number(ONEpp) + Number(TWOpp);
  
        const response = await fetch(`http://localhost:8000/commerce/create-inventory-form/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Qpp,
            Hpp,
            ONEpp,
            TWOpp,
            Totalpp,
            recipant: selectedRow.recipant,
          }),
        });
  
        const data = await response.json();
        console.log("Sales Order approved successfully:", data);
        toast.success("Sales Order Approved successfully");
        // You can update the customerData state or perform any other action here
      }
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
        title=" Inventory  Retrun"
        subtitle="List of orders that requires return data"
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
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "500px",
    width: "100%",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    overflow: "auto",
  }}
>
  {selectedRow && (
    <div>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>AADD Sales Order Return Form</h2>
      <p>ID: {selectedRow._id}</p>
      <p>SalesPerson: {selectedRow.SalesPerson}</p> 
      <p>0.35ml Qty: {selectedRow.Qp}</p>
      <p>0.6ml Qty: {selectedRow.Hp}</p>
      <p>1L Qty: {selectedRow.ONEp}</p>
      <p>2L Qty: {selectedRow.TWOp}</p>
      <p>TotalQty: {selectedRow.Totalp}</p>
      <p>0.35ml Birr: {selectedRow.Q_CASH}</p>
      <p>0.6ml Birr: {selectedRow.H_CASH}</p>
      <p>1L Birr: {selectedRow.ONE_CASH}</p>
      <p>2L Birr: {selectedRow.TWO_CASH}</p>
      <p>Total Birr: {selectedRow.Total_CASH}</p>
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Return Value</h2>



      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>

      <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="number"
      placeholder="0.35ml"
      value={selectedRow.Qpp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, Qpp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="0.6ml"
      value={selectedRow.Hpp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, Hpp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
    
    </div>
 
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="number"
      placeholder="1L"
      value={selectedRow.ONEpp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, ONEpp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        
        padding: "8px 12px",
        color: "black",
        width: "200px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="number"
      placeholder="2L"
      value={selectedRow.TWOpp} 
      onChange={(e) => setSelectedRow({ ...selectedRow, TWOpp: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
    
    </div>
  <div style={{ display: "flex", alignItems: "center",  marginTop:"10px"}}>
  <input
  type="number"
  placeholder="Total"
  value={Totalpp}
  onChange={(e) => setTotalpp(Number(e.target.value))}
  style={{
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "8px 12px",
    color: "black",
    width: "200px",
    height: "40px",
    marginRight: "10px",
  }}
  readOnly
/>
    <input
      type="Text"
      placeholder="recipant"
      value={selectedRow.recipant} 
      onChange={(e) => setSelectedRow({ ...selectedRow, recipant: e.target.value })} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
       
        padding: "8px 12px 10px 10px",
        color: "black",
        width: "200px",
        height: "40px",
      }}
    />
    
  </div>

  <div style={{ marginTop: "20px" }}>
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

export default InventoryStatus; */