import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";



const CreatePlate = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [plate, setPlate] = useState(null);

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/plate/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plate_no: values.plateNo,
          drivers_name: values.driversName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlate(data);
        toast.success("Plate created successfully");
      } else {
        console.log("Error creating plate");
        toast.error("Error creating plate");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <Box m="20px">
       <Header title="Create Plate" subtitle="Use the page below to create a new plate" />
      <Box
        m=" 0 0 0"
        height="100vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
            height: "10vh", // Set the desired height for the customer_name field
        
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            height: "10vh", // Set the desired height for the customer_name field
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
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
            <Box display="grid" gap="30px">
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Plate Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.plateNo}
                name="plateNo"
                error={!!touched.plateNo && !!errors.plateNo}
                helperText={touched.plateNo && errors.plateNo}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Driver's Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.driversName}
                name="driversName"
                error={!!touched.driversName && !!errors.driversName}
                helperText={touched.driversName && errors.driversName}
              />
            </Box>

            {/* submit button */}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create Plate
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* Plate output */}
      {plate && (
        <Box mt="20px">
          <p>Plate created successfully:</p>
          <p>Plate No: {plate.plate_no}</p>
          <p>Driver's Name: {plate.drivers_name}</p>
          <p>Is Approved: {plate.is_approved ? "Yes" : "No"}</p>
        </Box>
      )}
    </Box>
    </Box>
    
  );
};

// validation schema
const checkoutSchema = yup.object().shape({
  plateNo: yup.string().required("Required"),
  driversName: yup.string().required("Required"),
});

// initial form values
const initialValues = {
  plateNo: "",
  driversName: "",
};

export default CreatePlate;