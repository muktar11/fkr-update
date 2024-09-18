import React, {useEffect, useMemo, useState } from "react";
import { Box, useTheme, Select, MenuItem, Button, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Header from "../../components/Header";
import { ResponsiveLine } from "@nivo/line";
/* import { useGetSalesQuery } from "state/api"; */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PieChart from "../../components/PieChart";
import LineChart from "../../components/LineChart";
import Transactions from "../transactions/Transactions"
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { tokens } from "../../theme";
import OverviewPage from "../OverviewPages/OverviewPages"
const Overview = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const [selectedOption, setSelectedOption] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Hide scrollbars on the body element
    return () => {
      document.body.style.overflow = 'auto'; // Restore scrollbars when component unmounts
    };
  }, []);

  return (
    <Box>
      <Box display={"flex"} justifyContent= "space-between" alignItems={"center"}>
      <Header title="Annually SALES" subtitle="Chart of annual sales" />
    
      </Box>
     
        
   

      <Box display="flex" alignItems="center">
        <Box m="20px">
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

    <Box>
    <OverviewPage />
    </Box>
    </Box>
  );
};

export default Overview;