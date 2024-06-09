import { useState, useEffect } from "react";
import { Box, Button, Snackbar, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../users/Header";
import { getUser } from "../../../hooks/user.actions";
import axiosService from "../../../helpers/axios";
import { SnackbarContent } from "@mui/material";

const user = getUser();



const checkoutSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  // contact: yup
  // .string()
  // .matches(phoneRegExp, "Phone number is not valid")
  // .required("required"),
});

const ProfileForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

const getInitialValues = () => {
    const user = getUser();
    return {
      first_name: user ? user.first_name : "",
      last_name: user ? user.last_name : "",
      username: user ? user.username : "",
      email: user ? user.email : "",
    };
  };

  const [initialValues, setInitialValues] = useState(getInitialValues());

  useEffect(() => {
    const handleStorageChange = () => {
      setInitialValues(getInitialValues());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = async (values, { setSubmitting, setValues }) => {
    try {
      const response = await axiosService.patch(
        `/user/${user.id}/`, // Replace with your API endpoint
        values // Send updated user data
      );

      console.log(response.data); // Log response data if successful

      // Retrieve the current user object from local storage
      const auth = JSON.parse(localStorage.getItem("auth"));

      if (auth) {
        // Update the user object within the auth object
        const updatedAuth = { ...auth, user: { ...auth.user, ...values } };

        // Update local storage with the updated auth object
        localStorage.setItem("auth", JSON.stringify(updatedAuth));

        // Update the initial values in the form
        setInitialValues(updatedAuth.user);
        setValues(updatedAuth.user);
      }
     // Update Formik's initial values and current values
      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

    

    } catch (error) {
        let errorMessage = "An unexpected error occurred.";
        if (error.response) {
          // Backend responded with an error
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data) {
            // Try to get the first error message if it's an object of errors
            const data = error.response.data;
            errorMessage = data[Object.keys(data)[0]] || errorMessage;
          }
        } else if (error.message) {
          // General error message
          errorMessage = error.message;
        }
    
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Profile"  />

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
          isSubmitting, // This is used to show a loading indicator while the form is being submitted
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
                label="Last Name"
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
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              {/* <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              /> */}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Update Profile"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000} // Adjust the duration as needed
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          sx={{
            backgroundColor:
              snackbarSeverity === "success" ? "#4caf50" : "#f44336",
            width: "100%",
            top: 0,
            position: "fixed",
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Box>
  );
};

export default ProfileForm;
