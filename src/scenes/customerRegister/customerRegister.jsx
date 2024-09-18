import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Checkbox, FormControlLabel, TextField, Select, MenuItem } from "@mui/material";
import { styled } from '@mui/system';


const CustomerRegister = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [RegisterError, setRegisterError] = useState("");
  const [isCredit, setIsCredit] = useState(false);



  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("tin_number_doc", values.tin_number_doc);
      formData.append("business_license_no_doc", values.business_license_no_doc);
      formData.append("business_registration_no_doc", values.business_registration_no_doc);
      formData.append("email", values.email);
      formData.append("customer_name", values.customer_name);
      formData.append("sales_route", values.sales_route);
      formData.append("tin_number", values.tin_number);
      formData.append("business_license_no", values.business_license_no);
      formData.append("business_registration_no", values.business_registration_no);
      formData.append("sales_target", values.sales_target);
      formData.append("gps_coordinates", values.gps_coordinates);
      formData.append("phone", values.gps_coordinates);
      const isCredit = values.is_credit === true ? "true" : "false";
      const creditLimit = values.credit_limit ? parseInt(values.credit_limit) : 0;
      formData.append("is_credit", isCredit);
      formData.append("credit_limit", creditLimit);
      formData.append("contact_information", values.contact_information);
  

      const response = await fetch(process.env.REACT_APP_API_URL+"/api/webcustomer/register/", {
        method: "POST",
        body: formData,
      });

   
      if (response.ok) {
        console.log("Registration successful");
        toast.success("Registration successful");
      } else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  const GreenCheckbox = styled(Checkbox)(({ theme }) => ({
    color: 'green',
    '&.Mui-checked': {
      color: 'green',
    },
  }));

  const handlechange = (event) => {
    setIsCredit(event.target.checked);
  };
  return (
    <Box m="20px">
      <Header
        title="Customer Registration Form"
        subtitle="Use the form below to register a customer"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
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
                value={values.customer_name}
                name="customer_name"
                error={!!touched.customer_name && !!errors.customer_name}
                helperText={touched.customer_name && errors.customer_name}
                sx={{ gridColumn: "span 2" }}
              />

<TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Phone}
                name="Phone"
                error={!!touched.Phone && !!errors.Phone}
                helperText={touched.Phone && errors.Phone}
                sx={{ gridColumn: "span 2" }}
              />


<TextField
                fullWidth
                variant="filled"
                type="text"
                label="contact_information"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact_information}
                name="contact_information"
                error={!!touched.Phone && !!errors.contact_information}
                helperText={touched.Phone && errors.contact_information }
                sx={{ gridColumn: "span 2" }}
              />

<TextField
                fullWidth
                variant="filled"
                type="text"
                label="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
<Select
  fullWidth
  variant="filled"
  label="Sales Route"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.sales_route}
  name="sales_route"
  error={!!touched.sales_route && !!errors.sales_route}
  helperText={touched.sales_route && errors.sales_route}
  sx={{ gridColumn: "span 2" }}
>
  <MenuItem value="">Select Sales Route</MenuItem>
  <MenuItem value="Area1">Area1</MenuItem>
  <MenuItem value="Area1B">Area1B</MenuItem>
  <MenuItem value="Area2">Area2</MenuItem>
  <MenuItem value="Area3">Area3</MenuItem>
  <MenuItem value="EastMarket">EastMarket</MenuItem>
  <MenuItem value="AdissAbabaMarket">AdissAbabaMarket</MenuItem>
  <MenuItem value="AdissAbabaMarket2">AdissAbabaMarket2</MenuItem>
  <MenuItem value="Area8">Area8</MenuItem>
</Select>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="GPS Coordinates"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.gps_coordinates}
                name="gps_coordinates"
                error={!!touched.gps_coordinates && !!errors.gps_coordinates}
                helperText={touched.gps_coordinates && errors.gps_coordinates}
                sx={{ gridColumn: "span 2" }}
              />
         

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Tin Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tin_number}
                name="tin_number"
                error={!!touched.tin_number && !!errors.tin_number}
                helperText={touched.tin_number && errors.tin_number}
                sx={{ gridColumn: "span 2" }}
              />

              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(event) => {
                  setFieldValue("tin_number_doc", event.currentTarget.files[0]);
                }}
                style={{ display: "none" }}
                id="tin_number_doc"
              />
              <label htmlFor="tin_number_doc">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  Please Upload Tin Number Document below
                </Button>
              </label>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Business License No"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.business_license_no}
                name="business_license_no"
                error={!!touched.business_license_no && !!errors.business_license_no}
                helperText={touched.business_license_no && errors.business_license_no}
                sx={{ gridColumn: "span 2" }}
              />

              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(event) => {
                  setFieldValue("business_license_no_doc", event.currentTarget.files[0]);
                }}
                style={{ display: "none" }}
                id="business_license_no_doc"
              />
              <label htmlFor="business_license_no_doc">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                 Please Upload Business License Document
                </Button>
              </label>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Business Registration No"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.business_registration_no}
                name="business_registration_no"
                error={!!touched.business_registration_no && !!errors.business_registration_no}
                helperText={touched.business_registration_no && errors.business_registration_no}
                sx={{ gridColumn: "span 2" }}
              />

              <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(event) => {
                  setFieldValue("business_registration_no_doc", event.currentTarget.files[0]);
                }}
                style={{ display: "none" }}
                id="business_registration_no_doc"
              />
              <label htmlFor="business_registration_no_doc">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                 Please Upload Business Registration Document
                </Button>
              </label>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Sales Target"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.sales_target}
                name="sales_target"
                error={!!touched.sales_target && !!errors.sales_target}
                helperText={touched.sales_target && errors.sales_target}
                sx={{ gridColumn: "span 2" }}
              />

<FormControlLabel
  control={
    <GreenCheckbox
      checked={values.is_credit}
      onChange={handlechange}
      name="is_credit"
    />
  }
  label="Is Credit"
/>


<TextField
                fullWidth
                variant="filled"
                type="text"
                label="credit_limit"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.credit_limit}
                name="credit_limit"
                error={!!touched.credit_limit && !!errors.credit_limit}
                helperText={touched.credit_limit && errors.credit_limit}
                sx={{ gridColumn: "span 2" }}
              />


              </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <ToastContainer />
    </Box>
  );
};

// Validation schema
const checkoutSchema = yup.object().shape({
  customer_name: yup.string().required("Required"),
  email: yup.string().required("Required"),
  contact_information: yup.string().required("Required"),
  sales_route: yup.string().required("Required"),
  tin_number: yup.string().required("Required"),
  business_license_no: yup.string().required("Required"),
  business_registration_no: yup.string().required("Required"),
  sales_target: yup.string().required("Required"),
  gps_coordinates: yup.string().required("Required"),
  tin_number_doc: yup.mixed().required("Required"),
  business_license_no_doc: yup.mixed().required("Required"),
  business_registration_no_doc: yup.mixed().required("Required"),
});

// Initial form values
const initialValues = {
  customer_name: "",
  email: "",
  sales_route: "",
  contact_information: "",
  tin_number: "",
  business_license_no: "",
  business_registration_no: "",
  sales_target: "",
  gps_coordinates: "",
  tin_number_doc: null,
  business_license_no_doc: null,
  business_registration_no_doc: null,
};

export default CustomerRegister;