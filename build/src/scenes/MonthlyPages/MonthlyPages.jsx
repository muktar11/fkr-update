import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Select, MenuItem,  Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import useMediaQuery from "@mui/material/useMediaQuery";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import  { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

const MonthlyPage = () => {
  const theme = useTheme();
  const [customerData, setCustomerData] = useState([]);
  const [salesPersonData, setSalesPersonData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
  const [Deposit_Date, setDeposit_Date] = useState("");
  const [payment, setPayment] = useState("");
  const [inventory_file, setinventory_file] = useState("");
  const [inventory_recipant, setinventory_recipant] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [age, setAge] = React.useState('');
  const [area, setArea] = useState("");
  const [Directarea, setDirectArea] = useState("");

  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [plateOptions, setPlateOptions] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");




  const handleSwitchChange = (event) => {
    setIsSwitchOn(event.target.checked);
    
    if (!event.target.checked) {
      handleAADDSalesChanges(event);
    }
  };

useEffect(() => {
  // Fetching customer data from API
  fetch(process.env.REACT_APP_API_URL+'/api/webcustomer/approve/list/')
  .then((response) => response.json())
  .then((data) => setCustomers(data))
  .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Fetching salesPerson data from API
    fetch(process.env.REACT_APP_API_URL+'/commerce/sales-person-retrieve/')
      .then((response) => response.json())
      .then((data) => setSalesPersons(data))
      .catch((error) => console.log(error));
  }, []);
  
  useEffect(() => {
    // Fetching plate options from API
    fetch(process.env.REACT_APP_API_URL+'/commerce/plate-retrieve/')
      .then((response) => response.json())
      .then((data) => setPlateOptions(data))
      .catch((error) => console.log(error));
  }, []);
  
const label = { inputProps: { 'aria-label': 'Switch demo' } };
  
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order/monthly/");
        const data = await response.json();
        setCustomerData(data.sales_orders); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleSwitchsChange = (event) => {
    setIsSwitchOn(event.target.checked);
    
    if (!event.target.checked) {
      handleAADDSalesChanges(event);
    }
  };
  

  const handleAADDSalesChanges = async (event) => {
    const selectedArea = event.target.value;
    setArea(selectedArea);
  
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/AADD-sales-order/daily/`);
      const data = await response.json();
      setSalesPersonData(data.sales_orders);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };


  const handleAreaChanges = async (event) => {
    const selectedArea = event.target.value;
    setArea(selectedArea);
  
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+ `/commerce/sales-orders/monthly/${selectedArea}`);
      const data = await response.json();
      setCustomerData(data.sales_orders);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };


  const handleDirectAreaChanges = async (event) => {
    const selectedArea = event.target.value;
    setDirectArea(selectedArea);
  
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+ `/commerce/AADD-sales-orders/monthly/${selectedArea}`);
      const data = await response.json();
      setSalesPersonData(data.sales_orders);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };



  const handleCustomerChanges = async (event) => {
    const selectedCustomer = event.target.value;
    setSelectedCustomer(selectedCustomer); // Set as the selected customer
  
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + `/commerce/sales-orders/monthly/${selectedCustomer}`);
      const data = await response.json();
      setCustomerData(data.sales_orders);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const handleSalesPersonChanges = async (event) => {
    const selectedSalesPerson = event.target.value;
    setSelectedSalesPerson(selectedSalesPerson);
  
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + `/commerce/AADD-sales-orders/monthly/${selectedSalesPerson}`);
      const data = await response.json();
      setSalesPersonData(data.sales_orders);
    } catch (error) {
      console.error("Error fetching salesperson data:", error);
    }
  };
  
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

 
  
  const columns = [
    { field: "_id", headerName: "ID", flex: 0.5 },
    { field: "customers_name", headerName: "Customers Name", flex: 1 },
    { field: "plate", headerName: "Plate", flex: 1 },
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

  function printInvoice(){
    window.print();
}

const pageLimit = 10; // Set your desired page limit
const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
const startIndex = (currentPage - 1) * pageLimit;
const endIndex = Math.min(startIndex + pageLimit, customerData.length);
const endsIndex = Math.min(startIndex + pageLimit, salesPersonData.length);

// Get the items for the current page
const itemsForCurrentPage = customerData.slice(startIndex, endIndex);
const itemssForCurrentPage = salesPersonData.slice(startIndex, endsIndex);


const goToNextPage = () => {
  setCurrentPage(currentPage + 1);
};



const goToPreviousPage = () => {
  setCurrentPage(currentPage - 1);
};

  return (
<Box sx={{paddingLeft:"10px", paddingRight:"10px"}}>


   
   
    <Box display={"flex"} justifyContent= "space-between" alignItems={"center"}>
    <Header title="Monthly SALES"/>

   </Box>

   <FormGroup>
      <FormControlLabel
        control={<Switch checked={isSwitchOn} onChange={handleSwitchChange} color="secondary" />}
        label={isSwitchOn ? 'Agent' : 'AADS'}
      />
    </FormGroup>
   {isSwitchOn ? (



<Box height="15vh">
  <Header  subtitle="Chart of Monthly sales by Customer" />

    <Box display="flex" alignItems="center">




      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="area-label">Select Area</InputLabel>
        <Select
          labelId="area-label"
          id="area-select"          
          label="Select Area"
           value={area}
          onChange={handleAreaChanges}
         
        >
      <MenuItem value="All"><em>All</em></MenuItem>
      <MenuItem value="Area1">Area1</MenuItem>
      <MenuItem value="Area1B">Area1B</MenuItem>
      <MenuItem value="Area2">Area2</MenuItem>
      <MenuItem value="Area3">Area3</MenuItem>
      <MenuItem value="EastMarket">EastMarket</MenuItem>
      <MenuItem value="AdissAbabaMarket">AdissAbabaMarket</MenuItem>
      <MenuItem value="AdissAbabaMarket2">AdissAbabaMarket2</MenuItem>
      <MenuItem value="Area8">Area8</MenuItem>
        </Select>
      </FormControl>
  

      <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
      <InputLabel id="distributor-label">Select Distributor</InputLabel>
      <Select
        labelId="distributor-label"
        id="distributor-select"
        label="Select Distributor"
        value={selectedCustomer}
        onChange={handleCustomerChanges}
      >
        {customers.map((customer) => (
          <MenuItem key={customer._id} value={customer._id}>
            {customer.customer_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    </Box>
  </Box>

) : (
  <Box height="15vh">
  <Header  subtitle="Chart of Monthly sales by SalesPerson" />
  <Box display="flex" alignItems="center">
  
  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="area-label">Select Area</InputLabel>
      <Select
        labelId="area-label"
        id="area-select"         
        label="Select Area"
        value={Directarea}
        onChange={handleDirectAreaChanges }
      >
        <MenuItem value="All">
          <em>All</em>
        </MenuItem>
        <MenuItem value="Area1DirectSales">Area1DirectSales</MenuItem>
        <MenuItem value="AdissAbabaMarketDirectSales">AdissAbabaMarketDirectSales</MenuItem>
      </Select>
    </FormControl>

   
  <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
    <InputLabel id="distributor-label">Select Distributor</InputLabel>
    <Select
      labelId="distributor-label"
      id="distributor-select"
      label="Select Distributor"
      value={selectedSalesPerson}
      onChange={handleSalesPersonChanges}
    >
       <MenuItem value="">
                  <em>Select SalesPerson</em>
                  </MenuItem>
      {salesPersons.map((salesPerson) => (
        <MenuItem key={salesPerson._id} value={salesPerson._id}>
          {salesPerson.sales_person}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

   
  </Box>
</Box>


)}

  
  
    <Box m="20px"    
 
 boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
 color="#333"
 fontFamily="Arial, sans-serif"
 fontSize="14px"
 fontWeight="500"
 backgroundColor="#fff"
 width="367mm"
 height="210mm"
overflow="hidden">
   
   
      <div style={{margRight:"10px", padding:"10px", paddingLeft:"5px", paddingRight:"5px"}}>
     

     
      <div className="header" style={{padding:"4px", justifyContent:"space-between", display:"flex", height:"100px", background:"#ffff"}}>
        

        <h1>Ok Bottling and Beverage S.C</h1>

      
      </div>

   
    
      <div className="body-title" style={{ textAlign: "center", marginTop:"5px"  }}>
        <h2> Monthly AdissAbaba and UPC SalesReport</h2>
      </div>


      <div class="table-container" style={{ display:"table", width:"100%", marginTop:"10px" }}>
    




  {isSwitchOn ? (
 <div class="table-container" style={{ display:"table", width:"100%", marginTop:"10px" }}>
    <div class="table-row table-header" style={{display: "table-row" }}>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"1%" }}>No</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"5%" }}>Agent</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"5%" }}>Area</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "5%" }}>Sales Route</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "5%" }}>Plate Number</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%"  }}>0.35ml Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%"  }}>0.6ml Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%"  }}>1L Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%"  }}>2L Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>0.35ml UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>0.6ml UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>1L UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>2L UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>0.35ml Value</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>0.6ml Value</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>1Lt Value</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width: "2%" }}>2Lt Value</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"3%" }}>Total Price</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"3%" }}>Total Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"3%"}}>Perfor
      mance</div>
      <div class="table-cell" style={{display: "table-cell", padding: "2px", border:"1px solid black", width:"3%"}}>Execution  Time</div>
    </div>
    {itemsForCurrentPage.map((order, index) => (
       <div className="table-row" style={{ display: "table-row" }} key={order._id}>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "1%" }}>{index + 1}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "5%" }}>{order.customers_name}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "5%" }}>{order.sales_Route}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "5%" }}>{order.Route}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "5%" }}>{order.plate}</div>
     
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Qp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Hp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.ONEp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.TWOp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Q_unit}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.H_unit}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.ONE_unit}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.TWO_unit}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Q_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.H_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.ONE_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.TWO_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Total_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.Totalp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.performance}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "2px", border: "1px solid black", width: "2%" }}>{order.executionTime}</div>
     </div>
    ))}
  </div>
) : (
  <div>
  <div class="table-container" style={{ display:"table", width:"100%", marginTop:"10px" }}>
    <div class="table-row table-header" style={{display: "table-row" }}>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"1%" }}>No</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"%" }}>SalesPerson</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"5%" }}>Area</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "5%" }}>Plate Number</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%"  }}>0.35ml Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%"  }}>0.6ml Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%"  }}>1L Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%"  }}>2L Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>0.35ml UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>0.6ml UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>1L UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>2L UP</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>0.35ml Cash</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>0.6ml Cash</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>1L Cash</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width: "2%" }}>2L Cash</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"3%" }}>Total Price</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"3%" }}>Total Qty</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"3%"}}>Performance</div>
      <div class="table-cell" style={{display: "table-cell", padding: "5px", border:"1px solid black", width:"3%"}}>Execution Time</div>
    </div>
    {itemssForCurrentPage.map((order, index) => (
       <div className="table-row" style={{ display: "table-row" }} key={order._id}>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "1%" }}>{index + 1}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "5%" }}>{order.SalesPerson}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "5%" }}>{order.sales_Route}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "5%" }}>{order.Plate_number}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.Qp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.Hp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.ONEp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.TWOp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}> {order.inventory_return_forms?.[0]?.sales?.sales_Route_price?.Q}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.inventory_return_forms?.[0]?.sales?.sales_Route_price?.H}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.inventory_return_forms?.[0]?.sales?.sales_Route_price?.ONE}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.inventory_return_forms?.[0]?.sales?.sales_Route_price?.TWO}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.Q_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.H_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.ONE_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.TWO_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.Total_CASH}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.Totalp}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.performance}</div>
       <div className="table-cell" style={{ display: "table-cell", padding: "5px", border: "1px solid black", width: "2%" }}>{order.executionTime}</div>
     </div>
    ))}
  </div>
  </div>
)}
<div style={{ display:"table", width:"100%", paddingTop:"10%"}}>
{currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}>Previous Page</button>}
  <button onClick={goToNextPage}>Next Page ({currentPage + 1})</button>
</div>


</div>

<div>

<h8>

</h8>

    </div>

    </div>
    
    
    </Box>

</Box>
  );
};

export default MonthlyPage;