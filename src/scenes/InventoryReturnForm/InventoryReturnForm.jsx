import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const InventoryReturnForm = () => {
  const [salesPerson, setSalesPerson] = useState("");
  const [salesPersonList, setSalesPersonList] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    // Fetch sales person data from the API endpoint
    const fetchSalesPersonList = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/state-salesperson");
        if (response.ok) {
          const data = await response.json();
          setSalesPersonList(data);
        } else {
          console.log("Error fetching sales person list");
          toast.error("Error fetching sales person list");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchSalesPersonList();
  }, []);

 const handleFormSubmit = async (values) => {
  try {
    const selectedSalesPerson = salesPersonList.find(person => person.sales_person === values.salesPerson);
    const id = selectedSalesPerson._id;

    const response = await fetch(process.env.REACT_APP_API_URL+`/commerce/sales-person/create/${id}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Qp: values.Qp,
        Hp: values.Hp,
        ONEp: values.ONEp,
        TWOp: values.TWOp,
        Totalp: values.Totalp,
        recipant: values.recipant,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setSalesPerson(data);
      toast.success("Sales Person registered successfully");
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
      <Header title="Inventory return Form" subtitle="Use the page below to set return form for Sales" />
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
                select
                label="Sales Person"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.salesPerson}
                name="salesPerson"
                error={!!touched.salesPerson && !!errors.salesPerson}
                helperText={touched.salesPerson && errors.salesPerson}
                sx={{ gridColumn: "span 1" }}
              >
                {salesPersonList.map((person) => (
                  <MenuItem key={person._id} value={person.sales_person}>
                    {person.sales_person}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="0.35ml/Qty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Qp}
                name="Qp"
                error={!!touched.Qp && !!errors.Qp}
                helperText={touched.Qp && errors.Qp}
                sx={{ gridColumn: "span 1" }}
              />
                  <TextField
                fullWidth
                variant="filled"
                type="text"
                label="0.6ml/Qty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Hp}
                name="0.6"
                error={!!touched.Hp && !!errors.Hp}
                helperText={touched.Hp && errors.Hp}
                sx={{ gridColumn: "span 1" }}
              />
                  <TextField
                fullWidth
                variant="filled"
                type="text"
                label="1L/Qty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.ONEp}
                name="1L"
                error={!!touched.ONEp && !!errors.ONEp}
                helperText={touched.ONEp && errors.ONEp}
                sx={{ gridColumn: "span 1" }}
              />
                  <TextField
                fullWidth
                variant="filled"
                type="text"
                label="2L/Qty"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.TWOp}
                name="2L"
                error={!!touched.TWOp && !!errors.TWOp}
                helperText={touched.TWOp && errors.TWOp}
                sx={{ gridColumn: "span 1" }}
              />

<TextField
                fullWidth
                variant="filled"
                type="text"
                label="Totalp"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.Totalp}
                name="Totalp"
                error={!!touched.Totalp && !!errors.Totalp}
                helperText={touched.Totalp && errors.Totalp}
                sx={{ gridColumn: "span 1" }}
              />

<TextField
                fullWidth
                variant="filled"
                type="text"
                label="recipant"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.recipant}
                name="recipant"
                error={!!touched.recipant && !!errors.recipant}
                helperText={touched.recipant && errors.recipant}
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

export default InventoryReturnForm;