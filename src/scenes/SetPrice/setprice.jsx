import React, { useState } from "react";
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SetPrice = () => {
const isNonMobile = useMediaQuery("(min-width:600px)");
const [loading, setLoading] = useState(false);

const formik = useFormik({
initialValues: {
salesRoute: "",
transportationFee: "",
q: "",
h: "",
one: "",
two: "",
},
validationSchema: yup.object({
salesRoute: yup.string().required("Required"),
transportationFee: yup.string().required("Required"),
q: yup.string().required("Required"),
h: yup.string().required("Required"),
one: yup.string().required("Required"),
two: yup.string().required("Required"),
}),
onSubmit: async (values) => {
setLoading(true);
try {
const response = await fetch(process.env.REACT_APP_API_URL+"/commerce/set-price/", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
sales_Route: values.salesRoute,
TransportationFee: values.transportationFee,
Q: values.q,
H: values.h,
ONE: values.one,
TWO: values.two,
}),
});

    if (response.ok) {
      console.log("Price set successfully");
      toast.success("Price set successfully");
    } else {
      console.log("Error setting price");
      toast.error("Error setting price");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    toast.error("An error occurred");
  }
  setLoading(false);
},
});

return (
<Box m="20px">
<Header title="Set Price" subtitle="Use the page below to set prices" />
<ToastContainer />
<form onSubmit={formik.handleSubmit}>
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
label="Sales Route"
onBlur={formik.handleBlur}
onChange={formik.handleChange}
value={formik.values.salesRoute}
name="salesRoute"
error={formik.touched.salesRoute && Boolean(formik.errors.salesRoute)}
helperText={formik.touched.salesRoute && formik.errors.salesRoute}
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
        label="0.35L"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.q}
        name="q"
        error={formik.touched.q && Boolean(formik.errors.q)}
        helperText={formik.touched.q && formik.errors.q}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="0.6L"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.h}
        name="h"
        error={formik.touched.h && Boolean(formik.errors.h)}
        helperText={formik.touched.h && formik.errors.h}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="1L"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.one}
        name="one"
        error={formik.touched.one && Boolean(formik.errors.one)}
        helperText={formik.touched.one && formik.errors.one}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="2L"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.two}
        name="two"
        error={formik.touched.two && Boolean(formik.errors.two)}
        helperText={formik.touched.two && formik.errors.two}
        sx={{ gridColumn: "span 1" }}
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Transportation Fee"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.transportationFee}
        name="transportationFee"
        error={formik.touched.transportationFee && Boolean(formik.errors.transportationFee)}
        helperText={formik.touched.transportationFee && formik.errors.transportationFee}
        sx={{ gridColumn: "span 1" }}
      />
    </Box>

    <Box display="flex" justifyContent="end" mt="20px">
      <Button type="submit" color="secondary" variant="contained" disabled={loading}>
        {loading ? "Setting price..." : "Set Price"}
      </Button>
    </Box>
  </form>
</Box>
);
};

export default SetPrice;