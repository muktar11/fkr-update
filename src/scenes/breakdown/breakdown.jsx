
import React, { useMemo, useState } from "react";
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
import BreakDownPage from "../BreakDownPages/BreakDownPages";
const BreakDown = () => {
  const [startDate, setStartDate] = useState(new Date("2021-02-01"));
  const [endDate, setEndDate] = useState(new Date("2021-03-01"));
  const [selectedOption, setSelectedOption] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title=" SALES" subtitle="use the chart to get specific time frame" />
      <Box height="15vh" >
        

        <Box display="flex" justifyContent="flex-end" align-itmes="center">
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          To
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
         

        </Box>

        <Box display="flex" alignItems="center" >
          <Box>
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Select by Item</MenuItem>
              <MenuItem value="option1">0.35L</MenuItem>
              <MenuItem value="option2">0.6L</MenuItem>
              <MenuItem value="option2">1L</MenuItem>
              <MenuItem value="option3">2L</MenuItem>
            </Select>
          </Box>

          <Box marginLeft="5px" marginRight="5px">
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Select Area</MenuItem>
              <MenuItem value="option1">Area1</MenuItem>
              <MenuItem value="option2">Area1B</MenuItem>
              <MenuItem value="option2">Area2</MenuItem>
              <MenuItem value="option3">Area 3</MenuItem>
            </Select>
          </Box>

          <Box marginLeft="5px" marginRight="5px">
            <Select
              value={selectedOption}
              onChange={handleOptionChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Select Distributor</MenuItem>
              <MenuItem value="option1">SalesPerson</MenuItem>
              <MenuItem value="option2">SalesPerson2</MenuItem>
              <MenuItem value="option1">Agent1</MenuItem>
              <MenuItem value="option2">Agent2</MenuItem>
              <MenuItem value="option2">Agent3</MenuItem>
              <MenuItem value="option3">Agent4</MenuItem>
            </Select>
          </Box>
        </Box>
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

      <Box m="20px">
     <BreakDownPage />
    </Box>
    </Box>
  );
};

export default BreakDown;