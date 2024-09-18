import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CircularProgress from "@mui/material/CircularProgress";
const AADDOrder = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const [paymentFile, setPaymentFile] = useState(null);
  const [Q, setQ] = useState(0);
  const [H, setH] = useState(0);
  const [ONE, setONE] = useState(0);
  const [TWO, setTWO] = useState(0);
  const [Qp, setQp] = useState(0);
  const [Hp, setHp] = useState(0);
  const [ONEp, setONEp] = useState(0);
  const [TWOp, setTWOp] = useState(0);
  const [Q_CASH, setQ_CASH] = useState(0);
  const [H_CASH, setH_CASH] = useState(0);
  const [ONE_CASH, setONE_CASH] = useState(0);
  const [TWO_CASH, setTWO_CASH] = useState(0);
  const [Totalp, setTotalp] = useState(0);
  const [salesRoute, setSalesRoute] = useState(null);
  const [Total_CASH, setTotal_CASH] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/retireve-reject-add_sdm_view");
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

  
  useEffect(() => {
    if (salesRoute) {
      // Fetching Q, H, ONE, TWO values from API based on sales_route
      fetch(process.env.REACT_APP_API_URL+`/commerce/sort_price/${salesRoute}/`)
        .then((response) => response.json())
        .then((data) => {
          setQ(data.Q);
          console.log(setQ)
          setH(data.H);
          console.log(setH)
          setONE(data.ONE);
          console.log(setONE)
          setTWO(data.TWO);
          console.log(setTWO)
          // You can set TWO value here if needed
        })
        .catch((error) => console.log(error));
    }
  }, [salesRoute]);


  const handleUpdateClick = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/sdm-rejects/");
      const data = await response.json();
      setCustomerData(data);
      
      // Assign the value of salesRoute from the fetched data
      if (data && data.length > 0) {
        const salesRouteValue = data[0].sales_Route;
        console.log(salesRouteValue) // Assuming the Route value is in the first element of the array
        setSalesRoute(salesRouteValue);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  
const handleQpChange = (event) => {
  const newQp = parseInt(event.target.value);
  setQp(newQp);
  setQ_CASH(newQp * Q); // Calculating Q_CASH
  
  console.log('Q_CASH:', newQp * Q);
  };

  const handleHpChange = (event) => {
    const newHp = parseInt(event.target.value);
    setHp(newHp);
    setH_CASH(newHp * H); // Calculating H_CASH
    
    console.log('H_CASH:', newHp * H);
    };
    
    const handleONEpChange = (event) => {
    const newONEp = parseInt(event.target.value);
    setONEp(newONEp);
    setONE_CASH(newONEp * ONE); // Calculating ONE_CASH
    
    console.log('ONE_CASH:', newONEp * ONE);
    };
    
    const handleTWOpChange = (event) => {
    const newTWOp = parseInt(event.target.value);
    setTWOp(newTWOp);
    setTWO_CASH(newTWOp * TWO); // Calculating ONE_CASH
    console.log('TWO_CASH:', newTWOp * TWO);
    };

  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "SalesPerson", headerName: "SalesPerson", flex: 1 },
    { field: "sales_Route", headerName: "Sales Route", flex: 1 },
    { field: "Qp", headerName: "0.35ml ", flex: 1 },
    { field: "Q_CASH", headerName: "0.35ml CASH", flex: 1 },
    { field: "Hp", headerName: "0.6ml", flex: 1 },
    { field: "H_CASH", headerName: "0.6ml CASH", flex: 1 },
    { field: "ONEp", headerName: "1L", flex: 1 },
    { field: "ONE_CASH", headerName: "1L CASH", flex: 1 },
    { field: "TWOp", headerName: "2L", flex: 1 },
    { field: "TWO_CASH", headerName: "2L CASH", flex: 1 },
    { field: "Totalp", headerName: "Total", flex: 1 },
    { field: "Total_CASH", headerName: "Total CASH", flex: 1 },
    
  ];

  const getRowId = (row) => row._id;

  useEffect(() => {
    const totalp = parseInt(Qp) + parseInt(Hp) + parseInt(ONEp) + parseInt(TWOp);
    setTotalp(totalp);
  }, [Qp, Hp, ONEp, TWOp]);
  
  useEffect(() => {
    const totalCash = parseInt(Q_CASH) + parseInt(H_CASH) + parseInt(ONE_CASH) + parseInt(TWO_CASH);
    setTotal_CASH(totalCash);
  }, [Q_CASH, H_CASH, ONE_CASH, TWO_CASH]);
  

  const handleApprove = async (id) => {
    // Add the uploaded payment file
    console.log("Qp value before conversion:", Qp);
    const parsedQp = parseInt(Qp);
    console.log("Qp value after conversion:", Qp);
    const parsedHp = parseInt(Hp);
    const parsedONEp = parseInt(ONEp);
    const parsedTWOp = parseInt(TWOp);
    const parsedQ_CASH = parseInt(Q_CASH);
    const parsedH_CASH = parseInt(H_CASH);
    const parsedONE_CASH = parseInt(ONE_CASH);
    const parsedTWO_CASH = parseInt(TWO_CASH);
    const parsedTotal_CASH = parseInt(Total_CASH);
    const parsedTotalp = parseInt(Totalp);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/update-aadd-sales-order/${id}/`, {
        method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Qp: parsedQp,
        Hp: parsedHp,
        ONEp: parsedONEp,
        TWOp: parsedTWOp,
        Q_CASH: parsedQ_CASH,
        H_CASH: parsedH_CASH,
        ONE_CASH: parsedONE_CASH,
        TWO_CASH: parsedTWO_CASH,
        Total_CASH: parsedTotal_CASH,
        Totalp: parsedTotalp,
        sdm_returned:true,
        }),
      });
      const data = await response.json();
      console.log("Sales Order Returned successfully:", data);
      toast.success("Sales Order Returned successfully");
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



  const handleCloseModal = () => {
    setSelectedRow(null);
  };

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title="AADD Sales Orders"
        subtitle="List of AADD Orders that requires Approval"
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
            height:"80%",
            overflow: "auto",
          }}
        >
          {selectedRow && (
            <div>
             
<TableContainer component={Paper}>
<div style={{ textAlign: 'center', padding: '10px' }}>
    <Header
      title="AADD Sales Order"
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
          <TableCell >{selectedRow.sales_Route}</TableCell>
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
          Case:
        </TableCell>
          <TableCell>{selectedRow.sdm_returned_issue}</TableCell>
          <TableCell>{selectedRow.T}</TableCell>
              <TableCell>{selectedRow.T}</TableCell>
      </TableRow>
      
      <TableRow  display="column">
      <TableCell>0.35ml Qty</TableCell>
  <TableCell>
  <input
     
     value={Qp} 
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
  <TableCell>0.35 Value</TableCell>
  <TableCell>
    <input
     
      value={Q_CASH} 
      type="number"
      placeholder="0.35ml Cash"
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
<TableCell>0.6ml Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="0.6mlQty"
      value={Hp}
      onChange={handleHpChange}
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
  <TableCell>0.6ml Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="0.6mlCash"
      value={H_CASH}
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
  <TableCell>1L Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="1mlQty"
      value={ONEp}
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
  <TableCell>1L Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="1L Cash"
      value={ONE_CASH}
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
<TableCell>2L Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="2LQty"
      value={TWOp}
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
  <TableCell>2L Value</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="2L Cash"
      value={TWO_CASH}
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
<TableCell>Total Qty</TableCell>
  <TableCell>
    <input
      type="text"
      placeholder="Total Qty"
      value={Totalp}
      
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
  <TableCell>Total Cash</TableCell>
  <TableCell>
    <input
      type="number"
      placeholder="Total Cash"
      value={Total_CASH}
     
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
        Update
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

export default AADDOrder;
