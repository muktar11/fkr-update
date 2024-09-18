import React, { useEffect, useState } from "react";
import { Box, useTheme, Select, MenuItem, Button, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Header from "../../components/Header";
import { ResponsiveLine } from "@nivo/line";
/* import { useGetSalesQuery } from "state/api"; */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PieChart from "../../components/PieChart";
import PieChartValue from "../../components/PieChartValue";
import Pie from "../pie";
import LineChart from "../../components/LineChart";
import Transactions from "../transactions/Transactions"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";
import DailyTransactions from "../DailyTransaction/DailyTransactions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DailyPage from "../Dailypage/Dailypage"
const Daily = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };  




const [customerData, setCustomerData] = useState([]);
const [page, setPage] = useState(1);
const [Bank_Reference_Number, setBankReferenceNumber] = useState("");
const [Deposit_Date, setDeposit_Date] = useState("");
const [payment, setPayment] = useState("");

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


const handleRowClick = (params) => {
  setSelectedRow(params.row);
};

const handleCloseModal = () => {
  setSelectedRow(null);
};
function printInvoice(){
  window.print();
}

useEffect(() => {
  document.body.style.overflow = 'hidden'; // Hide scrollbars on the body element
  return () => {
    document.body.style.overflow = 'auto'; // Restore scrollbars when component unmounts
  };
}, []);

  return (
    <Box maxheight="100vh" overflow="hidden">
      <Header title="DAILY SALES" subtitle="Chart of daily sales" />

      <Box display="flex" alignItems="center"  overflow="hidden">
        <Box m="10px">
          <Header title="SKU" subtitle="" />
          <Box height="35vh" width="30vw">
            <PieChart />
          </Box>
        </Box>

        <Box m="20px">
          <Header title="Market Area" subtitle="" />
          <Box height="30vh" width="40vw">
            <LineChart />
          </Box>
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box m="20px">
          <Header title="SKU VALUE" subtitle="" />
          <Box height="35vh" width="30vw">
            <PieChartValue/>
          </Box>
        </Box>
        <Box m="20px">
          <Header title="Market Area Value" subtitle="" />
          <Box height="30vh" width="40vw">
            <LineChart />
          </Box>
        </Box>
      </Box>
     
    <Box  overflow="hidden">
     
      <DailyPage />
       
      </Box> 
    </Box>
    
  );
};

export default Daily;