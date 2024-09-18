import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "@mui/material/useMediaQuery";

const Payment = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [recipient, setRecipient] = useState("");
  const [paymentFile, setPaymentFile] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("payment", paymentFile);
      formData.append("recipient", recipient);
      formData.append("sales", selectedOrder);

      const response = await axios.post(
        process.env.REACT_APP_API_URL+`/commerce/${selectedOrder}/make-payment/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Payment successful");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("Payment failed");
    }
  };

  const handleFileInputChange = (event) => {
    setPaymentFile(event.currentTarget.files[0]);
  };

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL+"/commerce/sales-access"
        );
        setSalesOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSalesOrders();
  }, []);

  const handleOrderChange = (e) => {
    setSelectedOrder(e.target.value);
  };

  return (
    <Box m="20px">
      <Typography variant="h2" gutterBottom>
        Make Payment
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            select
            fullWidth
            variant="filled"
            label="Sales Order"
            value={selectedOrder}
            onChange={handleOrderChange}
            error={selectedOrder === ""}
            helperText={
              selectedOrder === "" && "Please select a sales order"
            }
          >
            <MenuItem value="">Select a sales order</MenuItem>
            {salesOrders.map((order) => (
              <MenuItem key={order._id} value={order._id}>
                {order.customer_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={recipient === ""}
            helperText={recipient === "" && "Recipient is required"}
          />
          <input
            type="file"
            accept=".doc,.docx,.pdf"
            onChange={(event) => {
              setPaymentFile(event.currentTarget.files[0]);
            }}
            style={{ display: "none" }}
            id="paymentFile"
          />
          <label htmlFor="paymentFile">
            <Button
              component="span"
              color="primary"
              variant="contained"
              style={{ backgroundColor: "#4CAF50", color: "white" }}
            >
              Upload Payment
            </Button>
          </label>

          <Button type="submit" color="secondary" variant="contained">
            Make Payment
          </Button>
        </Box>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default Payment;