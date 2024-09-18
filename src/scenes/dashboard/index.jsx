import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import React, { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusAlertIcon from '@mui/icons-material/BusAlert';
import FlagIcon from '@mui/icons-material/Flag';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [customerssData, setCustomerssData] = useState([]);
  const [customersssData, setCustomersssData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  const [page, setPage] = useState(1);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/commerce/sales-order-by-sales-info/");
        const data = await response.json();
        setCustomerData(data); // Map the fetched data to an object
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false); // Set loading state to false if there's an error
      }
    };
  
    fetchData();
  }, [page]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order-recent-transaction");
        const datas = await response.json();
        setCustomersData(datas); // Map the fetched data to an object
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false); // Set loading state to false if there's an error
      }
    };
  
    fetchData();
  }, [page]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/add_total_cash/");
        const datas = await response.json();
        setCustomersssData(datas); // Map the fetched data to an object
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false); // Set loading state to false if there's an error
      }
    };
  
    fetchData();
  }, [page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order-by-sales-item-info/");
        const data = await response.json();
        setCustomerssData(data); // Map the fetched data to an object
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setLoading(false); // Set loading state to false if there's an error
      }
    };
  
    fetchData();
  }, [page]);


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
        
            title={customerData.sales_order_total_cash}
            subtitle="AADS"
            progress="0.75"
            increase={customerData.sales_order_total_cash_percentage}
            icon={
              <BusAlertIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={customerData.aags_sales_order_total_cash}
            subtitle=" AA Agent Sales"
            progress="0.50"
            increase={customerData.aags_sales_order_total_rate}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
                 title={customerData.upc_sales_order_total_cash}
            subtitle="UPC"
            progress="0.30"
            increase={customerData.upc_sales_order_rate}
            icon={
              <FlagIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={customerData.sales_order_total_sum}
            subtitle="Grand Total"
            progress="1"
            increase={customerData.sales_order_total_sum}
            icon={
              <ShoppingCartIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}> Total Sales in ETB </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>${customersssData.total_cash_sum}</Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon       sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
        <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  borderBottom={`4px solid ${colors.primary[500]}`}
  colors={colors.grey[100]}
  p="15px"
>
  <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
    Recent Transactions 
  </Typography>
</Box>
{customersData.map((transaction, i) => (
  <Box
    key={`${transaction._id}-${i}`}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        {transaction._id}
      </Typography>
      <Typography color={colors.grey[100]}>
        {transaction.customers_name}
      </Typography>
    </Box>
    <Box color={colors.grey[100]}>{transaction.date}</Box>
    <Box
      backgroundColor={colors.greenAccent[500]}
      p="5px 10px"
      borderRadius="4px"
    >
      {transaction.Totalp}Qty
    </Box>

    <Box
      backgroundColor={colors.greenAccent[500]}
      p="5px 10px"
      borderRadius="4px"
    >
      {transaction.Total_CASH}Birr
    </Box>
  </Box>
))}
</Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            AADS SKU Share
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
               <StatBox
        
        title={customerssData.aad_sales_order_total_qty}
        subtitle="AADS"
        progress="0.75"
        increase={customerssData.aad_sales_order_total_qty_percentage}
        icon={
          <BusAlertIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              ${customerssData.aad_sales_order_total_qty} revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Agent Sales SKU Share
          </Typography> 
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
                <StatBox
        
        title={customerssData.sales_order_total_qty}
        subtitle="AADS"
        progress="0.75"
        increase={customerssData.sales_order_total_qty_percentage}
        icon={
          <PersonAddIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />

            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              ${customerssData.sales_order_total_qty} revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            UPC SKU Share
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
                <StatBox
        
        title={customerssData.upc_sales_order_total_qty}
        subtitle="AADS"
        progress="0.75"
        increase={customerssData.upc_sales_order_rate}
        icon={
          <FlagIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              ${customerssData.upc_sales_order_total_qty} revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Total SKU Share
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
                <StatBox
        
        title={customerssData.sales_order_total_sum}
        subtitle="AADS"
        progress="0.75"
        increase="100%"
        icon={
          <ShoppingCartIcon
            sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
          />
        }
      />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              ${customerssData.sales_order_total_sum} revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Performance
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
