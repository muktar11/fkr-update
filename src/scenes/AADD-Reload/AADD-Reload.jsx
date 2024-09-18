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
const AADDReload = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sdm_returned_issue, setsdm_returned_issue] = useState("");
  const [Q, setQ] = useState(0);
  const [H, setH] = useState(0);
  const [ONE, setONE] = useState(0);
  const [TWO, setTWO] = useState(0);
  const [Qpp, setQpp] = useState(0);
  const [Hpp, setHpp] = useState(0);
  const [ONEpp, setONEpp] = useState(0);
  const [TWOpp, setTWOpp] = useState(0);
  const [Totalpp, setTotalpp] = useState(0);
  const [Q_Total, setQ_Total] = useState(0);
  const [H_Total, setH_Total] = useState(0);
  const [ONE_Total, setONE_Total] = useState(0);
  const [TWO_Total, setTWO_Total] = useState(0);
  const [Total_CASH, setTotal_CASH] = useState(0);
  const [payment, setPayment] = useState(null);
  const [recipient, setrecipient] = useState("");
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [salesRoute, setSalesRoute] = useState(null);
  const [validationError, setValidationError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/access-inventory-list");
        const data = await response.json();
        setCustomerData(data);
        if (data && data.length > 0) {
            const salesRouteValue = data[0].sales_Route; // Assuming the Route value is in the first element of the array
            setSalesRoute(salesRouteValue);
          }
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
      if (data && data.length > 0) {
        const salesRouteValue = data[0].sales_Route; // Assuming the Route value is in the first element of the array
        setSalesRoute(salesRouteValue);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  useEffect(() => {
    if (salesRoute) {
      // Fetching Q, H, ONE, TWO values from API based on sales_route
      fetch(process.env.REACT_APP_API_URL+`/commerce/sort_price/${salesRoute}/`)
        .then((response) => response.json())
        .then((data) => {
          setQ(data.Q);
          setH(data.H);
          setONE(data.ONE);
          setTWO(data.TWO);
          // You can set TWO value here if needed
        })
        .catch((error) => console.log(error));
    }
  }, [salesRoute]);



  const handleQpChange = (event) => {
    const newQpp = parseInt(event.target.value);
    setQpp(newQpp);
    setQ_Total(newQpp * Q); // Calculating Q_CASH
    
    console.log('Q_CASH:', newQpp * Q);
    };
  
    const handleHpChange = (event) => {
      const newHpp = parseInt(event.target.value);
      setHpp(newHpp);
      setH_Total(newHpp * H); // Calculating H_CASH
      
      console.log('H_CASH:', newHpp * H);
      };
      
      const handleONEpChange = (event) => {
      const newONEpp = parseInt(event.target.value);
      setONEpp(newONEpp);
      setONE_Total(newONEpp * ONE); // Calculating ONE_CASH
      
      console.log('ONE_CASH:', newONEpp * ONE);
      };
      
      const handleTWOpChange = (event) => {
      const newTWOpp = parseInt(event.target.value);
      setTWOpp(newTWOpp);
      setTWO_Total(newTWOpp * TWO); // Calculating ONE_CASH
      console.log('TWO_CASH:', newTWOpp * TWO);
      };
      
    
      useEffect(() => {
        const calculateTotalpp = () => {
          if (selectedRow) {
            const { Qpp, Hpp, ONEpp, TWOpp } = selectedRow;
            const newTotalpp = Number(Qpp || 0) + Number(Hpp || 0) + Number(ONEpp || 0) + Number(TWOpp || 0);
            setTotalpp(newTotalpp);
          }
        };
      
        calculateTotalpp();
      }, [selectedRow, Qpp, Hpp, ONEpp, TWOpp]);
      
      useEffect(() => {
        const totalp = parseInt(Qpp || 0) + parseInt(Hpp || 0) + parseInt(ONEpp || 0) + parseInt(TWOpp || 0);
        setTotalpp(totalp || '');
      }, [Qpp, Hpp, ONEpp, TWOpp]);
      
      useEffect(() => {
        const totalcash = parseInt(Q_Total || 0) + parseInt(H_Total || 0) + parseInt(ONE_Total || 0) + parseInt(TWO_Total || 0);
        setTotal_CASH(totalcash || '');
      }, [Q_Total, H_Total, ONE_Total, TWO_Total]);




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

  const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/reload-AADD-SalesOrder/${id}/`, {
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
    Q_Total:Q_Total,
    H_Total:H_Total,
    ONE_Total:ONE_Total,
    TWO_Total:TWO_Total,
    Total_CASH:Total_CASH,
  
  }),
});
    const data = await response.json();
     // Handle successful response
     console.log("Return has successfully Registered:", data);
        toast.success("Return has successfully Registered");
        handleUpdateClick()
        handleCloseModal()
      } catch (error) {
     // Handle error
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
         title="AADS Sales Order Reload"
         subtitle="Order Detail that requires Reload"
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
      title="AADS Sales Order Reload"
      subtitle="Order Detail that requires Reload"
    />
  </div>
  <Table sx={{}} size="small" aria-label="a dense table">
      
  <TableHead>
    <TableRow>
    <Header
      title="Sales Order"
    />
    </TableRow>
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
    <Header
      title="Reload Order"
      subtitle="fill out the form to update the order"
    />
    </TableRow>

      <TableRow  display="column">
      <TableCell component="th" scope="row">
      0.35ml 
        </TableCell>
  <TableCell>
  <input
     
     value={Qpp} 
     onChange={handleQpChange}
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
  <TableCell>
  <input
     
     value={Q_Total} 

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
  0.6ml 
        </TableCell>
  <TableCell>
  <input
     
     value={Hpp} 
     onChange={handleHpChange}
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
  <TableCell>
  <input
     
     value={H_Total}
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

  

<TableRow  display="column">

<TableCell component="th" scope="row">
1L 
        </TableCell>
<TableCell>
    <input
      type="text"
      placeholder="1LQty"
      value={ONEpp}
      onChange={handleONEpChange}
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
     
     value={ONE_Total}
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
        2L
        </TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="2LQty"
      value={TWOpp}
      onChange={handleTWOpChange}
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
     
     value={TWO_Total}
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
          Total 
        </TableCell>
<TableCell>
    <input
      type="text"
      placeholder="Total Qty"
      value={Totalpp}
    
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
  <TableCell>
  <input
     
     value={Total_CASH}
     type="text"
     placeholder="Total Value"
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
        Reload
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

export default AADDReload;

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