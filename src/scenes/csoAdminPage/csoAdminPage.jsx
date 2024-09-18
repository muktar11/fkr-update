import React, { useState, useEffect } from "react";
import {
Box,
Button,
TextField,
Modal,
Typography,
Checkbox,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
firstName: "",
contact: "",
};

const checkoutSchema = yup.object().shape({
firstName: yup.string().required("Name is required"),
contact: yup.string().required("Orders Purchased is required"),
});

const CSOPaymentProcess = () => {
const isNonMobile = useMediaQuery("(min-width:600px)");
const [paymentOptions, setPaymentOptions] = useState([]);
const [isProcessed, setIsProcessed] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedOption, setSelectedOption] = useState(null);

useEffect(() => {
const fetchPaymentOptions = async () => {
try {
const response = await axios.get(
  process.env.REACT_APP_API_URL+"/commerce/make-payment/access"
);
setPaymentOptions(response.data);
} catch (error) {
console.error(error);
}
};

fetchPaymentOptions();
}, []);

const handleFormSubmit = async (values, { resetForm }) => {
try {
const selectedPaymentOption = paymentOptions.find(
(option) => option.payment === values.contact
);

  if (!selectedPaymentOption) {
    console.error("Selected payment option not found");
    return;
  }

  const payload = {
    name: values.firstName,
    OrdersPurchased: {
      payment: selectedPaymentOption.payment,
      recipient: selectedPaymentOption.recipant,
      salesorder: selectedPaymentOption.salesorder,
    },
    is_processed: true,
  };

  await axios.post(
    process.env.REACT_APP_API_URL+`/commerce/admin/${selectedPaymentOption._id}/cso-admin`,
    payload
  );

  resetForm();

  toast.success("Payment processed successfully!");
} catch (error) {
  console.error(error);
  toast.success("Payment processed successfully!");
}
};

const handleCheckboxChange = (event) => {
setIsProcessed(event.target.checked);
};

const handleTransferOrder = (handleSubmit) => {
handleSubmit();
toast.success("Order transferred successfully!");
};

const handleOpenModal = () => {
setIsModalOpen(true);
};

const handleCloseModal = () => {
if (selectedOption !== null) {
setSelectedOption(null);
} else {
setIsModalOpen(false);
}
};

const handleOptionClick = (option) => {
setSelectedOption(option);
};

const handleApproval = async (option) => {
try {
const payload = {
approval: true,
};

  await axios.post(
    process.env.REACT_APP_API_URL+`/commerce/admin/${option._id}/approve`,
    payload
  );

  toast.success("Approval sent successfully!");
} catch (error) {
  console.error(error);
  toast.success("Approval sent successfully!");
}
};

return (
<Box m="20px">
<Header
title="CSO Admin"
subtitle="Fill the form below to process payment"
/>
<ToastContainer />

  <Formik
    onSubmit={handleFormSubmit}
    initialValues={initialValues}
    validationSchema={checkoutSchema}
    render={({
      values,
      errors,
      touched,
      handleBlur,
      handleChange,
      handleSubmit,
      resetForm,
    }) => (
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
            fullWidth
            variant="filled"
            type="text"
            label="Customer Name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.firstName}
            name="firstName"
            error={!!touched.firstName && !!errors.firstName}
            helperText={touched.firstName && errors.firstName}
            sx={{ gridColumn: "span 2" }}
          />

          <Button
            variant="outlined"
            onClick={handleOpenModal}
            sx={{
              gridColumn: "span 4",
              color: "white",
              width: "300px",
              backgroundColor: "#4CAF50", // Light green shade
              "&:hover": {
                backgroundColor: "#45A049", // Darker shade on hover
              },
            }}
          >
            Select Orders Purchased
          </Button>

          <Box
            gridColumn="span 4"
            display="flex"
            alignItems="center"
          >
            <Checkbox
              checked={isProcessed}
              onChange={handleCheckboxChange}
            />
            <Box ml={2}>Is Processed</Box>
          </Box>

          <Box
            display="flex"
            justifyContent="end"
            mt="20px"
            style={{ margin: "10px" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleTransferOrder(handleSubmit)}
              type="submit"
            >
              Transfer Order
            </Button>
          </Box>
        </Box>
      </form>
    )}
  />

  <Modal open={isModalOpen} onClose={handleCloseModal}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        height: 1000,
        bgcolor: "white",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        overflow: "hidden",
        borderRadius: "12px",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        mb={2}
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          fontSize: "1.5rem",
          textAlign: "center",
        }}
      >
        Select Orders Purchased
      </Typography>
      {paymentOptions.map((option) => (
  <Box key={option.payment} mb={2}>
    <Box
      display="flex"
      alignItems="center"
      
      sx={{ gap: 2 }}
    >
      <Button
        onClick={() => handleOptionClick(option)}
        sx={{
          backgroundColor: "grey",
          width: "400px",
          height: "40px",
          color: "white",
          "&:hover": {
            backgroundColor: "#FF7043",
          },
        }}
      >
        {option.payment}
      </Button>
      <Button
        onClick={() => handleApproval(option)}
        sx={{
          backgroundColor: "green",
          width: "100px",
          "&:hover": {
            backgroundColor: "#4CAF50",
          },
        }}
      >
        Approve
      </Button>
    </Box>
  </Box>
))}
      <Box sx={{ marginTop: "auto", textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCloseModal}
          sx={{
            marginTop: "20px",
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  </Modal>

  <Modal open={selectedOption !== null} onClose={handleCloseModal}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 600,
        bgcolor: "white",
        border: "2px solid #000",
        borderRadius: 12,
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        p: 4,
        overflow: "hidden",
      }}
    >
      {selectedOption && (
        <>
          <Typography
            variant="h6"
            component="h2"
            mb={2}
            sx={{
              fontWeight: "bold",
              color: "grey",
              fontSize: "1.5rem",
              textAlign: "center",
            }}
          >
            Order
          </Typography>
          <Box>
            <Typography
              variant="body1"
              mb={2}
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Payment: {selectedOption.payment}
            </Typography>
            <Typography
              variant="body1"
              mb={2}
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Recipient: {selectedOption.recipant}
            </Typography>
            <Typography
              variant="body1"
              mb={2}
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "12px",
                fontWeight: "600",
                color: "black",
              }}
            >
              Sales Order: {selectedOption.salesorder}
            </Typography>
          </Box>
          <Box sx={{ marginTop: "auto", textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              sx={{
                marginTop: "20px",
              }}
            >
              Close
            </Button>
          </Box>
        </>
      )}
    </Box>
  </Modal>
</Box>
);
};

export default CSOPaymentProcess;