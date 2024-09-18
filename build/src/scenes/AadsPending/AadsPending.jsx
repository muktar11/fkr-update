
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import useMediaQuery from "@mui/material/useMediaQuery";

const  AADSPending = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [CSI_CSRI_Number, setCSI_CSRI_Number] = useState("");
  const [BankName, setBankName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [validationError, setValidationError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/customerdebitforms/access");
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
    { field: "customer", headerName: "Customer", flex: 1 },
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
  const handleApprove = async (id) => {
    try {
      const formData = new FormData();
      formData.append("CSI_CSRI_Number", CSI_CSRI_Number);
      formData.append("Bank_Name", BankName);
      formData.append("Bank_Reference_Number", Bank_Reference_Number);
      formData.append("Amount", Amount);
      formData.append("Deposit_Date", Deposit_Date);
      formData.append("payment", payment);
      
      if (selectedRow) {
        if (CSI_CSRI_Number.trim() === '') {
          // CSI CSRI value is required, display an error message or perform any necessary action
          toast.error("CSI_CSRI_Number value is required");
          return;
        }
        if (BankName.trim() === '') {
          // BankName value is required, display an error message or perform any necessary action
          toast.error("BankName value is required");
          return;
        }
        if (Bank_Reference_Number.trim() === '') {
          // Bank_Reference_Number value is required, display an error message or perform any necessary action
          toast.error("Bank_Reference_Number value is required");
          return;
        }
        if (Amount.trim() === '') {
          // Amount value is required, display an error message or perform any necessary action
          toast.error("Amount value is required");
          return;
        }
        if (!formData.get("payment")) {
          // payment file is required, display an error message or perform any necessary action
          toast.error("payment file is required");
          return;
        }
    
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/update-pending-inventoy-return/${id}/`, 
        {
          method: "PUT",
          body: formData,
        } 
      );
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

  const handlePaymentChange = (event) => {
    const file = event.target.files[0];
    setPayment(file);
    };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };
  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" AADS Sales Verification"
        subtitle="List of orders that requires verification"
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
                <div style={{ textAlign: "center", padding: "10px" }}>
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
                      <TableCell>{selectedRow._i}</TableCell>
                    </TableRow>
                  </TableHead>
  
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>{selectedRow.customer}</TableCell>
                      <TableCell>{selectedRow._i}</TableCell>
                    </TableRow>
                  </TableHead>
  
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        SalesRoute
                      </TableCell>
                      <TableCell>{selectedRow.sales_Route}</TableCell>
                      <TableCell>{selectedRow._i}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        SalesPerson
                      </TableCell>
                      <TableCell>{selectedRow.Inventory}</TableCell>
                       <TableCell>{selectedRow._i}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        0.35ml
                      </TableCell>
                      <TableCell>{selectedRow.Qp}(Qty)</TableCell>
                      <TableCell>{selectedRow.Q_CASH}(Value)</TableCell>
                    </TableRow>
                   
                   
                    <TableRow>
                      <TableCell component="th" scope="row">
                        0.6ml
                      </TableCell>
                      <TableCell>{selectedRow.Hp}(Qty)</TableCell>
                      <TableCell>{selectedRow.H_CASH}(Value)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        1L
                      </TableCell>
                      <TableCell>{selectedRow.ONEp}(Qty)</TableCell>
                      <TableCell>{selectedRow.ONE_CASH}(Value)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        2L
                      </TableCell>
                      <TableCell>{selectedRow.TWOp}(Qty)</TableCell>
                      <TableCell>{selectedRow.TWO_CASH}(Value)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        Total
                      </TableCell>
                      <TableCell>{selectedRow.Totalp}(Qty)</TableCell>              
                      <TableCell>{selectedRow.Total_CASH}(Value)</TableCell>
                    </TableRow>
                    
                  <TableRow>
                      <TableCell component="th" scope="row">
                       Due Date
                      </TableCell>
                      <TableCell>{selectedRow.due_date}</TableCell>
                      <TableCell>{selectedRow._i}</TableCell>
                  </TableRow>

                  <TableRow>
                      <TableCell component="th" scope="row">
                       Issue Case 
                      </TableCell>
                      <TableCell>{selectedRow.issues}</TableCell>
                      <TableCell>{selectedRow._i}</TableCell>
                  </TableRow>

                  
                  <TableRow>
                    
<TableRow>  
<TableCell>CSI CSRI Number </TableCell>
<TableCell> <input
          type="Text"
          placeholder="CSI/CSRI Number"
          label="CSI/CSRI Number_Clear"
          value={CSI_CSRI_Number}
          onChange={(e) => setCSI_CSRI_Number(e.target.value)}
            style={{
              border: '1px solid black',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
      }}
    />  {validationError && (
      <span style={{ color: 'red' }}>CSI/CSRI Number_Clear value is required</span>
    )}  </TableCell>
       </TableRow>

                  
<TableRow>
    <TableCell>Bank Name </TableCell>
<TableCell> <input
          type="Text"
          placeholder="Bank Name"
          value={BankName}
          onChange={(e) => setBankName(e.target.value)}
            style={{
              border: '1px solid black',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
      }}
    /> </TableCell>
</TableRow>

<TableRow>  
<TableCell>Deposit Amount </TableCell>
<TableCell> <input
          type="Text"
          placeholder="Deposit Amount"
          value={Amount}
          onChange={(e) => setAmount(e.target.value)} 
            style={{
              border: '1px solid black',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
      }}
    />  {validationError && (
      <span style={{ color: 'red' }}>CSI/CSRI Number_Clear value is required</span>
    )} </TableCell>
       </TableRow>

                  
<TableRow>
    <TableCell>Bank Ref Name </TableCell>
<TableCell> <input
          type="Text"
          placeholder="Bank Ref Name"
          value={Bank_Reference_Number}
          onChange={(e) => setBankReferenceNumber(e.target.value)}
            style={{
              border: '1px solid black',
              padding: '8px',
              borderRadius: '4px',
              width: '100%',
              height: '100%',
      }}
    />  {validationError && (
      <span style={{ color: 'red' }}>CSI/CSRI Number_Clear value is required</span>
    )}  </TableCell>
</TableRow>



<TableRow>  
<TableCell>Deposit Date </TableCell>

<TableCell>
  <DatePicker
  label="Deposit Date"
    selected={Deposit_Date}
    onChange={(newValue) =>  setDeposit_Date(newValue)}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        margin="normal"
        InputProps={{
          style: {
            color: "black",
            paddingTop: "10px",
          },
        }}
        sx={{
          paddingTop: "10px",
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
    <TableCell>Attach payment  </TableCell>
<TableCell> <input
  type="file"
  id="Payment"
  style={{ display: "none" }}
  onChange={handlePaymentChange}
/> 

<label htmlFor="Payment">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  attach file inventory_recipant
                </Button>
              </label>

              {validationError && (
      <span style={{ color: 'red' }}>Pyament value is required</span>
    )} 
</TableCell>
</TableRow>



                  </TableRow>








                  <TableRow>
                      
                      <TableCell>
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
                          Approve
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

export default AADSPending;


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

const  AADSPending = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [salesPerson, setSalesPerson] = useState("");
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [CSI_CSRI_Number, setCSI_CSRI_Number] = useState("");
  const [BankName, setBankName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/commerce/customerdebitforms/access");
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
    { field: "customer", headerName: "Customer", flex: 1 },
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

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/commerce/update-pending-inventoy-return/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CSI_CSRI_Number: CSI_CSRI_Number,
          Bank_Name: BankName,
          Amount: Amount,
          Bank_Reference_Number: Bank_Reference_Number,
          Deposit_Date: Deposit_Date,
          payment: payment,
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
        title=" AADS Sales Verification"
        subtitle="List of orders that requires verification"
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
      <h2 style={{ fontSize: "24px", marginBottom: "10px" }}> AADD Sales Order</h2>
      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Sales Order</h3>
      
      <h2>Sales</h2>
      <p>Customer: {selectedRow.customer}</p>
      <p>SalesRoute: {selectedRow.sales_Route}</p>
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

    

    

      <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>Invoice and Deposit Description</h3>

<p>insert the remaining debit balance</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
    <input
      type="Text"
      placeholder="CSI/CSRI Number"
      label="CSI/CSRI Number"
      value={CSI_CSRI_Number}
      onChange={(e) => setCSI_CSRI_Number(e.target.value)}
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",       
        padding: "8px 12px",
        color: "black",
        width: "300px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="Text"
      placeholder="Bank Name"
      value={BankName}
      onChange={(e) => setBankName(e.target.value)}
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
  <div style={{ display: "flex", alignItems: "center" }}>
    <input
      type="Text"
      placeholder="Deposit Amount"
      value={Amount}
      onChange={(e) => setAmount(e.target.value)} 
      style={{
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "8px 12px",
        color: "black",
        width: "300px",
        height: "40px",
        marginRight: "10px",
      }}
    />
    <input
      type="Text"
      placeholder="Bank Ref Number"
      value={Bank_Reference_Number}
      onChange={(e) => setBankReferenceNumber(e.target.value)} 
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
      sx={{
      
        background: "grey",
        color: "black",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "& .MuiInputBase-root": {
          backgroundColor: "inherit",
        },
        "& .MuiInputBase-input": {
          padding: "8px 12px",
        },
      }}
    />
  )}
/>
<input
  type="file"
  id="file-upload"
  style={{ display: "none" }}
    onChange={(event) => {
      setPayment("payment", event.currentTarget.files[0]);
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
      Clear 
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

export default AADSPending; */