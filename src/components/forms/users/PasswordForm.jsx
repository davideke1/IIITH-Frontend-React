import { useState } from "react";
import { Box, Button, TextField, Snackbar } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../users/Header";

import { useNavigate } from "react-router-dom";
import { SnackbarContent } from '@mui/material';
import axiosService from "../../../helpers/axios";

const initialValues = {
  oldpassword: "",
  newpassword: "",
  confirmnewpassword: "",
};

const checkoutSchema = yup.object().shape({
  oldpassword: yup.string().required("Required"),
  newpassword: yup.string().required("Required"),
  confirmnewpassword: yup
    .string()
    .oneOf([yup.ref("newpassword"), null], "Passwords must match")
    .required("Required"),
});

const PasswordForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axiosService.post("/password-change/", values);
      console.log(response.data);
      setSnackbarMessage(response.data.detail);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      resetForm();
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000); // Navigate to dashboard after 5 seconds
    } catch (error) {
      console.error(error);
      setSnackbarMessage(error.response.data.error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Password Change" />

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
          isSubmitting,
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
                label="Old Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.oldpassword}
                name="oldpassword"
                error={!!touched.oldpassword && !!errors.oldpassword}
                helperText={touched.oldpassword && errors.oldpassword}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="New Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.newpassword}
                name="newpassword"
                error={!!touched.newpassword && !!errors.newpassword}
                helperText={touched.newpassword && errors.newpassword}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Confirm New Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmnewpassword}
                name="confirmnewpassword"
                error={
                  !!touched.confirmnewpassword &&
                  !!errors.confirmnewpassword
                }
                helperText={
                  touched.confirmnewpassword && errors.confirmnewpassword
                }
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Change Password"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={5000} // Adjust the duration as needed
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <SnackbarContent
    sx={{
      backgroundColor:
        snackbarSeverity === "success" ? "#4caf50" : "#f44336",
      width: '100%',
      top: 0,
      position: 'fixed',
    }}
    message={snackbarMessage}
  />
</Snackbar>

    </Box>
  );
};

export default PasswordForm;
