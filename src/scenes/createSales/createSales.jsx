import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
const CreateSalesPerson = () => {
  const initialFormValues = {
    salesPerson: "",
    phone: "",
    salesRoute: "",
    sales_target:"",
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [salesPerson, setSalesPerson] = useState(null);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/sales-person/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sales_person: values.salesPerson,
          phone: values.phone,
          Route: values.salesRoute,
          sales_target: values.sales_target,
          is_approved: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSalesPerson(data);
        toast.success("Sales Person registered successfully");
        setFormValues(initialFormValues); // Reset form values to null
      } else {
        console.log("Error registering sales person");
        toast.error("Error registering sales person");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  
  return (
    <Box m="20px">
      <Header title="Register Sales Person" subtitle="Use the page below to set prices" />
      <ToastContainer />
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
        }) => (
          <form onSubmit={handleSubmit}>
            {/* form fields */}
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
                label="Sales Person"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salesPerson}
                name="salesPerson"
                error={!!touched.salesPerson && !!errors.salesPerson}
                helperText={touched.salesPerson && errors.salesPerson}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                select
                label="Sales Route"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salesRoute}
                name="salesRoute"
                error={!!touched.salesRoute && !!errors.salesRoute}
                helperText={touched.salesRoute && errors.salesRoute}
                sx={{ gridColumn: "span 1" }}
              >
                <MenuItem value="Area1">Area 1</MenuItem>
                <MenuItem value="Area1B">Area 1B</MenuItem>
                <MenuItem value="Area2">Area 2</MenuItem>
                <MenuItem value="Area3">Area 3</MenuItem>
                <MenuItem value="EastMarket">EastMarket</MenuItem>
                <MenuItem value="AdissAbabaMarket">AdissAbabaMarket</MenuItem>
                <MenuItem value="AdissAbabaMarket2">AdissAbabaMarket2</MenuItem>
                <MenuItem value="Area8">Area8</MenuItem>
                <MenuItem value="Area1DirectSales">Area1DirectSales</MenuItem>
                <MenuItem value="AdissAbabaMarketDirectSales">AdissAbabaMarketDirectSales</MenuItem>

               
              </TextField>

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
                sx={{ gridColumn: "span 1" }}
              />
            </Box>

            {/* submit button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// validation schema
const checkoutSchema = yup.object().shape({
  salesPerson: yup.string().required("Required"),
  salesRoute: yup.string().required("Required"),
});

// initial form values
const initialValues = {
  salesPerson: "",
  salesRoute: "",
};

export default CreateSalesPerson;