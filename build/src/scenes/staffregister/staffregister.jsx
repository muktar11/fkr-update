import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, Checkbox, FormControlLabel, TextField, Select, MenuItem } from "@mui/material";

const StaffRegister = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [RegisterError, setRegisterError] = useState("");

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
    
      formData.append("email", values.email);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("role", values.role);
      formData.append("image", values.image);
      formData.append("password", values.password);
      formData.append("password2", values.password2);
    

      const response = await fetch(process.env.REACT_APP_API_URL+"/api/staff/register/", {
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

  return (
    <Box m="20px">
      <Header
        title="Staff Registration Form"
        subtitle="Use the form below to register a customer"
      />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
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
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                error={!!touched.first_name && !!errors.first_name}
                helperText={touched.first_name && errors.first_name}
                sx={{ gridColumn: "span 2" }}
              />

<TextField
                fullWidth
                variant="filled"
                type="text"
                label="last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                error={!!touched.last_name && !!errors.last_name}
                helperText={touched.last_name && errors.last_name}
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



<TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />


<TextField
                fullWidth
                variant="filled"
                type="password"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password2}
                name="password2"
                error={!!touched.password2 && !!errors.password2}
                helperText={touched.password2 && errors.password2}
                sx={{ gridColumn: "span 2" }}
              />


<Select
  fullWidth
  variant="filled"
  label="Role"
  onBlur={handleBlur}
  onChange={handleChange}
  value={values.role}
  name="role"
  error={!!touched.role && !!errors.role}
  helperText={touched.role && errors.role}
  sx={{ gridColumn: "span 2" }}
>
  
  <MenuItem value="">Select Sales Route</MenuItem>
  <MenuItem value="CSO">CSO</MenuItem>
  <MenuItem value="SDM">SDM</MenuItem>
  <MenuItem value="FM">FM</MenuItem>
  <MenuItem value="FINANCE">FINANCE</MenuItem>
  <MenuItem value="LOGISTIC">LOGISTIC</MenuItem>
  <MenuItem value="GM">GM</MenuItem>
  <MenuItem value="Clerk">Clerk</MenuItem>
  <MenuItem value="superAdmin">superAdmin</MenuItem>
  <MenuItem value="Inventory">  Inventory</MenuItem>
</Select>

             


              <label htmlFor="file">
<Button
component="span"
color="primary"
variant="contained"
style={{ backgroundColor: "#4CAF50", color: "white" }}>

Please Upload Image
</Button>
<input
id="file"
type="file"
style={{ display: "none" }}
onChange={(event) => {
setFieldValue("file", event.currentTarget.files[0]);
}}
/>
</label>



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
  first_name: yup.string().required("Required"),
  last_name: yup.string().required("Required"),
  email: yup.string().required("Required"),
  role: yup.string().required("Required"),
  image: yup.string().required("Required"),
  password: yup.string().required("Required"),
  password2: yup.string().required("Required"),
});

// Initial form values
const initialValues = {
  customer_name: "",
  last_name: "",
  email: "",
  role: "",
  image: "",
  password: "",
  password2: "",
};

export default  StaffRegister;