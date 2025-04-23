'use client'
import { useState, useEffect } from 'react';
import { Box, TextField, Typography, CircularProgress, InputAdornment, IconButton, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import { CustomButtonFilled } from '@/Components/ReusableComponents/ButtonsComponent';
import * as Yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';

interface LoginValues {
  phone: string;
  password: string;
}
interface CarrierLoginValues {
  carrierId: string;
  carrierPassword: string;
}

const LoginPage: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
  const [callbackUrl, setCallbackUrl] = useState<string>('/');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCarrierLogin, setShowCarrierLogin] = useState(false);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callbackUrlFromQuery = urlParams.get('callbackUrl');
    if (callbackUrlFromQuery) {
      setCallbackUrl(callbackUrlFromQuery);
    }
  }, []);

  const validationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one digit")
      .matches(/[!@#$%^&*]/, "Must contain at least one special character (!@#$%^&*)")
      .required("Password is required"),
  });


  const handleLogin = async (values: { phone: string; password: string }, { setSubmitting, setFieldError }: FormikHelpers<LoginValues>) => {
    try {
      const result = await signIn("user-login", {
        redirect: false,
        phone: values.phone,
        password: values.password,
      });

      if (result?.error) {
        setSnackbarMessage(result?.error);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

      } else {
        window.location.href = callbackUrl;
        setSnackbarMessage("Login successful");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err)
      setFieldError("password", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
    const handleCarrierLogin = async (values: CarrierLoginValues) => {
    try {
      const result = await signIn("carrier-login", {
        redirect: false,
        carrierId: values.carrierId,
        carrierPassword: values.carrierPassword,
      });

      if (result?.error) {
        setSnackbarMessage(result?.error);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);

      } else {
        window.location.href = callbackUrl;
        setSnackbarMessage("Carrier Login successful");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.log(err)
    } 
  };
  return (
    <Grid sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      <Box display="flex" sx={{ height: "60vh" }}>
        <Box
          sx={{
            maxWidth: "400px",
            margin: "5px",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
            alignSelf: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }} align="center" marginBottom="10px" color="#F08C24">
            Login 
          </Typography>

          {!showCarrierLogin ? (
              <Formik
            initialValues={{ phone: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (

              <Form>
                <Field
                  as={TextField}
                  label="Phone number"
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  inputProps={{ maxLength: 10 }}
                />

                <Field
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid sx={{ textAlign: "center", marginTop: "10px" }}>
                  <CustomButtonFilled type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
                  </CustomButtonFilled>
                  </Grid>
                      <Typography
      variant="body2"
      align="center"
      sx={{ mt: 1}}
      onClick={() => setShowCarrierLogin(true)}
    >
                    {/* Login as Carrier */}
        Are you a carrier ? <span style={{cursor: 'pointer', color: '#F08C24', textDecoration:'underline'}}>Login as Carrier</span> 
    </Typography>
              </Form>
            )}
          </Formik>
          ) : (
              <>
              <Formik
      initialValues={{ carrierId: "", carrierPassword: "" }}
      validationSchema={Yup.object({
        carrierId: Yup.string().required("Carrier ID is required"),
        carrierPassword: Yup.string().required("Password is required"),
      })}
      onSubmit={handleCarrierLogin}
    >
      {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
        <Form>
          <Field
            as={TextField}
            label="Carrier ID"
            placeholder="Enter Carrier ID"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            name="carrierId"
            value={values.carrierId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.carrierId && Boolean(errors.carrierId)}
            helperText={touched.carrierId && errors.carrierId}
          />

          <Field
            as={TextField}
            label="Password"
            variant="outlined"
            fullWidth
            size="small"
            margin="normal"
            name="carrierPassword"
            type={showPassword ? "text" : "password"}
            value={values.carrierPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.carrierPassword && Boolean(errors.carrierPassword)}
            helperText={touched.carrierPassword && errors.carrierPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Grid sx={{ textAlign: "center", marginTop: "10px" }}>
            <CustomButtonFilled type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </CustomButtonFilled>
          </Grid>

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1,  }}
            onClick={() => setShowCarrierLogin(false)}
          >
          Go to <span style={{cursor: 'pointer', color: '#F08C24', textDecoration:'underline'}}>User Login</span> 
          </Typography>
        </Form>
      )}
                </Formik>
              </>
          )}
        

          {/* <Typography variant="body2" align="center" marginTop="10px">
            Don&apos;t have an account ? <a href="/signup" style={{ color: "#F08C24" }}>Sign up</a>
          </Typography> */}
        </Box>
      </Box>
    </Grid>
  );
};

export default LoginPage;
