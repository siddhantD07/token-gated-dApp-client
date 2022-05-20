import { useFormik } from "formik";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Web3 from "web3";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    neutral: {
      main: "#e82771",
      contrastText: "#ffff",
    },
  },
  components: {
    MuiTextField: {
      variants: [
        {
          props: { variant: "filled" },
          style: {
            borderRadius: "10px",
          },
        },
      ],
    },
  },
});

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const Form = () => {
  const [formResult, setFormResult] = useState(null);
  const [submitPressed, setSubmitPressed] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      homeAddress: "",
      city: "",
      country: "",
      stateProvince: "",
      postalCode: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(100, "Must be 100 characters or less")
        .required("Required"),
      email: Yup.string()
        .email("Invalid email address")
        .max(100, "Must be 100 characters or less")
        .required("Required"),
      phone: Yup.string()
        .matches(phoneRegExp, "Invalid Phone Number")
        .required("Required"),
      homeAddress: Yup.string()
        .max(250, "Word limit reached")
        .required("Required"),
      city: Yup.string().max(100, "Word limit reached").required("Required"),
      country: Yup.string().max(100, "Word limit reached").required("Required"),
      stateProvince: Yup.string()
        .max(100, "Word limit reached")
        .required("Required"),
      postalCode: Yup.string().max(15, "Invalid").required("Required"),
    }),
    onSubmit: async (values) => {
      if (window.ethereum) {
        setSubmitPressed(1);
        try {
          await window.ethereum.send("eth_requestAccounts");
          window.web3 = new Web3(window.ethereum);
          var accounts = await window.web3.eth.getAccounts();
          const message = await axios.get(BACKEND_URL + "/get-token");
          if (accounts[0]) {
            var signature = await window.web3.eth.personal.sign(
              message.data,
              accounts[0]
            );

            var allData = {
              values: values,
              message: message.data,
              signature: signature,
            };
            const response = await axios.post(
              BACKEND_URL + "/verify-ownership",
              allData
            );
            console.log(response.data);
            setFormResult("Form Submitted Successfully");
          }
        } catch (error) {
          // console.log(error.response.data);
          setFormResult("Error! Your form could not be Submitted");
        }
        setSubmitPressed(0);
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: 350,
          margin: "auto",
          marginTop: "2%",
        }}
      >
        {formResult ? (
          <Grid item xs={12}>
            <Typography variant="h4" component="h4" sx={{ color: "White" }}>
              {formResult}
            </Typography>
          </Grid>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              spacing={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                      ? formik.errors.firstName
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={
                    formik.touched.lastName && formik.errors.lastName
                      ? formik.errors.lastName
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="email"
                  label="Email"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email && formik.errors.email
                      ? formik.errors.email
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="phone"
                  label="Phone"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={
                    formik.touched.phone && formik.errors.phone
                      ? formik.errors.phone
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="homeAddress"
                  label="Home Address"
                  variant="filled"
                  rows={2}
                  onBlur={formik.handleBlur}
                  value={formik.values.homeAddress}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.homeAddress &&
                    Boolean(formik.errors.homeAddress)
                  }
                  helperText={
                    formik.touched.homeAddress && formik.errors.homeAddress
                      ? formik.errors.homeAddress
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="city"
                  label="City"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={
                    formik.touched.city && formik.errors.city
                      ? formik.errors.city
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="country"
                  label="Country"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={
                    formik.touched.country && formik.errors.country
                      ? formik.errors.country
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="stateProvince"
                  label="State/Province"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.stateProvince}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.stateProvince &&
                    Boolean(formik.errors.stateProvince)
                  }
                  helperText={
                    formik.touched.stateProvince && formik.errors.stateProvince
                      ? formik.errors.stateProvince
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="postalCode"
                  label="Postal Code"
                  variant="filled"
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.postalCode &&
                    Boolean(formik.errors.postalCode)
                  }
                  helperText={
                    formik.touched.postalCode && formik.errors.postalCode
                      ? formik.errors.postalCode
                      : " "
                  }
                />
              </Grid>
              <Grid item xs={12}>
                {submitPressed ? (
                  submitPressed === 1 ? (
                    <CircularProgress color="neutral" />
                  ) : null
                ) : (
                  <Button
                    variant="contained"
                    type="submit"
                    color="neutral"
                    sx={{
                      marginBottom: "10%",
                    }}
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Form;
