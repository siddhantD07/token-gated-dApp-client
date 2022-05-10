import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";
import Web3 from "web3";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { Typography } from "@mui/material";

const Form = () => {
  const [formResult, setFormResult] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      if (window.ethereum) {
        try {
          await window.ethereum.send("eth_requestAccounts");
          window.web3 = new Web3(window.ethereum);
          var accounts = await window.web3.eth.getAccounts();
          const message = await axios.get(BACKEND_URL + "/get-token");
          console.log(message.data);
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

            console.log(response);
            setFormResult(response.data);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  });

  return (
    <Box marginTop={5}>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="firstName"
          label="firstName"
          variant="outlined"
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          id="lastName"
          label="lastName"
          variant="outlined"
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          id="email"
          label="email"
          variant="outlined"
          onBlur={formik.handleBlur}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
      {formResult ? (
        <Typography variant="h3" component="h3">
          {formResult}
        </Typography>
      ) : null}
    </Box>
  );
};

export default Form;
