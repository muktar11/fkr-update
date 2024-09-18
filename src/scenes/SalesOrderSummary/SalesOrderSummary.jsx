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

const SalesOrderSummary = () => {
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
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/finance-inventory-lists");
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
    { field: "customers_name", headerName: "Customers Name", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
    { field: "sales_Route", headerName: "Route", flex: 1 },
    { field: "Qp", headerName: "0.35mlQ", flex: 1 },  
    { field: "Q_CASH", headerName: "O.35mlVal", flex: 1 },    
    { field: "Hp", headerName: "0.6mlQ", flex: 1 },   
    { field: "H_CASH", headerName: "0.6mlVal", flex: 1 },
    { field: "ONEp", headerName: "1L Q", flex: 1 },   
    { field: "ONE_CASH", headerName: "1L Val", flex: 1 },
    { field: "TWOp", headerName: "2L Q", flex: 1 },   
    { field: "TWO_CASH", headerName: "2L Val", flex: 1 },  
    { field: "created_at", headerName: "Date", flex: 1 },
  ];

  const getRowId = (row) => row._id;

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
  };
  function printInvoice(){
    window.print();
}

  return (
    <Box m="20px">
      <ToastContainer />
      <Header
        title=" Sales Order Summary"
        subtitle="List of orders"
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
    height: "100%", // A4 height
    width: "105%", // A4 width
    display: "flex",
    flexDirection: "column",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
  
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    maxWidth: "800px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    overflow: "auto",
  }}
>
  {selectedRow && (
    <div style={{margRight:"10px", padding:"10px", paddingLeft:"10px"}}>
      <button type = "button" class = "invoice-btn" onClick={printInvoice} style={{right:10, position:"absolute"}}>
                                <span>
                                    <i class="fa-solid fa-print"></i>
                                </span>
                                <span>Print</span>
                            </button>  
      <div className="header" style={{padding:"10px", justifyContent:"space-between", display:"flex", height:"100px", background:"#ffff"}}>
        
        <img style={{width:"100px",height:"100px"}} src="data:image/png;base64,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" alt="" />
        <h1>Ok Bottling and Beverage S.C</h1><h2>Invoice Id: 00{selectedRow._id}</h2> 

       
      </div>

   
         
<div className="pack" style={{ display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
    <div className="billing" style={{maxHeight:"160px", display:"flex", flexDirection:"column", marginBottom:"10px"}}>
        <h3>Customer Information</h3>
        <h8>Customers Name: {selectedRow.customers_name}</h8>
        <h8>Tin number: {selectedRow.tin_numbers}</h8>
        <h8>Registeration number: {selectedRow.reg_numbers}</h8>
        <h8>Area:  {selectedRow.sales_Route} </h8>
        <h8>Sales Route:  {selectedRow.Route} </h8>
        <h8>Inventory:  {selectedRow.Inventory} </h8>
        <h8>Plate Number: {selectedRow.plate}</h8>
        <h8>recipient: {selectedRow.inventory_recipant}</h8>
       
      </div>

      <div className="billing" style={{maxHeight:"160px", display:"flex", flexDirection:"column", marginBottom:"10px"}}>
        <h3>Billing Information</h3>
        <h8>Ledger Balance: {selectedRow.LedgerBalance}</h8>
        <h8>Invoice Number:  {selectedRow.CSI_CRSI_Number} </h8>
        
      </div>

</div>
      <div className="body-title" style={{ textAlign: "center", marginTop:"50px"  }}>
        <h2> Sales Order Summary</h2>
      </div>


      <div class="table-container" style={{ display:"table", width:"100%", marginTop:"10px" }}>
    <div class="table-row table-header" style={{display: "table-row" }}>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>No</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black", width: "60%" }}>Item</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>Unit Price</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>Total Price</div>
    </div>
    <div class="table-row" style={{ display:"table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black" }}>1</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>035mlQty</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.Qp}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.Q_unit}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.Q_CASH}</div>
    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>2</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>0.6mlQty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>{selectedRow.Hp}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.H_unit}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.H_CASH}</div>
    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>3</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>1LQty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>{selectedRow.ONEp}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.ONE_unit}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.ONE_CASH}</div>

    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>4</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>2LQty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}> {selectedRow.TWOp}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.TWO_unit}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}> {selectedRow.TWO_CASH}</div>
   
    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px"}}></div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px"}}></div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px"}}> </div>
      <div class="table-cell" style={{ display: "table-cell", paddingTop: "8px"}}></div>
      <div class="table-cell" style={{ display: "table-cell", paddingTop: "8px"}}>Total Item:{selectedRow.Totalp}</div>
    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px"}}></div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px"}}></div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px"}}> </div>
      <div class="table-cell" style={{ display: "table-cell", padding: ""}}> </div>
      <div class="table-cell" style={{ display: "table-cell", padding: ""}}>TotalCash:{selectedRow.Total_CASH}</div> 
    </div>
</div>
<div className="body-title" style={{ textAlign: "center", marginTop:"50px"  }}>
        <h2> Sales Order Process Summary</h2>
      </div>


      <div class="table-container" style={{ display:"table", width:"100%", marginTop:"10px" }}>
    <div class="table-row table-header" style={{display: "table-row" }}>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>No</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black", width: "20%" }}>Position</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black", width: "40%" }}>Title</div>
      <div class="table-cell" style={{display: "table-cell", padding: "8px", border:"1px solid black" }}>Execution Time</div>
    </div>
    <div class="table-row" style={{ display:"table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black" }}>1</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>SDM</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.financecreated_first_name} {selectedRow.financecreated_last_name}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.sdmcreated_at}</div>
    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>2</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>Finance</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.financecreated_first_name} {selectedRow.financecreated_last_name}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.financecreated_at}</div>
    </div>
   
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>3</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>Logisitcs</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.logisitcmanagercreated_first_name} {selectedRow.logisitcmanagercreated_last_name}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.logisitcmanagercreated_at}</div>

    </div>
    <div class="table-row" style={{ display: "table-row"}}>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>4</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>Inventory</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}> {selectedRow.inventorycreated_first_name} {selectedRow.inventorycreated_last_name}</div>
      <div class="table-cell" style={{ display: "table-cell", padding: "8px", border:"1px solid black"}}>{selectedRow.inventorycreated_at}</div>
   
    </div>
    
</div>
<div>

<h8>
  Order Recipient: <a href={selectedRow.inventory_file} style={{ color: 'blue', marginRight: "10px" }} target="_blank" rel="noopener noreferrer">
    {selectedRow.inventory_file}
  </a>
</h8>
      <label style={{ display: 'block',  position:'absolute', right: 0, marginTop:"100px",position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '-5px',
            width: '20%',
            height: '1px',
            backgroundColor: 'black',
          }}
        ></span>
        Authorized Signature:
      </label>
    </div>

    </div>
  )}
</Box>
      </Modal>
    </Box>
  );
};

export default SalesOrderSummary;