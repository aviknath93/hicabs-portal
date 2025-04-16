import React, { useState } from "react";
import { Box, Button, Typography, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/store";
import useAlertStore from "../utils/alert-store";
import consts from "../utils/constants.json";
import InputText from "../components/shared/form-components/input-text";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const getIpAddress = useStore((state) => state.getIpAddress);
  const login = useStore((state) => state.login);
  const navigate = useNavigate();
  const navigateTo = useStore((state) => state.navigateTo);
  const { setAlert } = useAlertStore();

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email must be a valid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const userAgent = navigator.userAgent;
        const ipAddress = await getIpAddress();

        const response = await login({
          email: formData.email.trim(),
          password: formData.password.trim(),
          userAgent,
          ipAddress,
        });

        setAlert({ severity: "success", message: "Login successful!" });
        // Navigate to the dashboard or home page
        navigateTo(navigate, consts["paths"]["dashboard"]);
      } catch (error) {
        if (error.errors) {
          const errorMessage = error.errors.map(
            (err) =>
              `${err.field}: ${Object.values(err.constraints).join(", ")}`
          );
          setAlert({ severity: "error", message: errorMessage });
        } else {
          setAlert({ severity: "error", message: error.message });
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        px: 2, // Padding for small screens
      }}
    >
      <Box
        sx={{
          py: 5,
          px: 3,
          maxWidth: 600,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <InputText
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                hasError={!!errors.email}
                errorText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <InputText
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange("password")}
                hasError={!!errors.password}
                errorText={errors.password}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Grid>
            <Grid
              size={{ xs: 4, sm: 8, md: 12 }}
              sx={{ textAlign: "center", mt: 2 }}
            >
              <Typography>
                Do not have an account?{" "}
                <Link
                  component="button"
                  onClick={() =>
                    navigateTo(navigate, consts["paths"]["registration"])
                  }
                  underline="hover"
                >
                  Register now
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
