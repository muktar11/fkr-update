import { useEffect, useState } from "react";
import { Box, Button,MenuItem,Select, TextField } from "@mui/material";
import { Formik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const id = localStorage.getItem("id");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/staff/profile/${id}/`, {
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data[0]);
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };


  const handleFormSubmit = async (values) => {
    try {
      const token = localStorage.getItem("accessToken");
      const id =localStorage.getItem("id");
      const response = await fetch(process.env.REACT_APP_API_URL+`/api/update/staff/profile/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (response.ok) {
        // Profile update successful
        console.log("Profile updated:", values);
        toast.success("Profile updated successfully");
        fetchProfile()
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };




  return (
    <Box m="20px">
      <h1>Profile</h1>
      {profile ? (
        <Box display="flex" flexDirection="column">
          <img src={profile.image} alt="Profile" width="200" />
          <p>Email: {profile.email}</p>
          <p>First Name: {profile.first_name}</p>
          <p>Last Name: {profile.last_name}</p>
          <p>Role: {profile.role}</p>
        </Box>
      ) : (
        <p>Loading profile...</p>
      )}
      <h1>Update your Profile</h1>
      {profile && (
        <Formik
          initialValues={{
        
          }}
          onSubmit={handleFormSubmit}
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
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                name="first_name"
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.last_name}
                name="last_name"
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
              />
                <input
                type="file"
                accept=".doc,.docx,.pdf"
                onChange={(event) => {
                  setFieldValue("file", event.currentTarget.files[0]);
                }}
                style={{ display: "none" }}
                id="file"
              />
              <label htmlFor="file">
                <Button
                  component="span"
                  color="primary"
                  variant="contained"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  Please attach Image
                </Button>
              </label>


<TextField
                fullWidth
                variant="filled"
                type="text"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password2}
                name="password2"
                sx={{ gridColumn: "span 2" }}
              />
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Update Profile
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      )}
      <ToastContainer />
    </Box>
  );
};

export default Profile;