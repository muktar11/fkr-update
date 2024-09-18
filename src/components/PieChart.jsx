import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";


const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customerData, setCustomerData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true); // State for showing/hiding the loading animation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-order-retrieve-customer-daily/all/all/true/true/true/true/false/false/false/false/");
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, [page]);

  
  const mockPieData = [
    {
      id: "0.35ml",
      label: "0.35ml",
      value: customerData.qp && customerData.qp[0] ? customerData.qp[0] : 0,
      color: "hsl(104, 70%, 50%)",
    },
    {
      id: "0.6ml",
      label: "0.6ml",
      value: customerData.hp && customerData.hp[0] ? customerData.hp[0] : 0,
      color: "hsl(162, 70%, 50%)",
    },
    {
      id: "1L",
      label: "1L",
      value: customerData.onep && customerData.onep[0] ? customerData.onep[0] : 0,
      color: "hsl(229, 70%, 50%)",
    },
    {
      id: "2L",
      label: "2L",
      value: customerData.twop && customerData.twop[0] ? customerData.twop[0] : 0,
      color: "hsl(344, 70%, 50%)",
    },
  ];

  return (
    <ResponsivePie
      data={mockPieData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={0.4}
      arcLabelsSkipAngle={7}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;