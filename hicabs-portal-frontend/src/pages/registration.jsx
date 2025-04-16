import React, { useState } from "react";
import { Box, Button, Typography, Grid, TextField, Link } from "@mui/material";
import useStore from "../utils/store";
import consts from "../utils/constants.json";
import useAlertStore from "../utils/alert-store";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "vendor",
  });

  const [errors, setErrors] = useState({});
  const register = useStore((state) => state.register);
  const navigate = useNavigate();
  const navigateTo = useStore((state) => state.navigateTo);
  const { setAlert } = useAlertStore();

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email must be a valid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password.trim())) {
      newErrors.password =
        "Password must contain upper, lower case letters and a number";
    }
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          confirmPassword: formData.confirmPassword.trim(),
          userType: formData.userType.trim(),
        });
        setAlert({ severity: "success", message: "Registration successful!" });
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
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </Grid>
            <Grid
              size={{ xs: 4, sm: 8, md: 12 }}
              sx={{ textAlign: "center", mt: 2 }}
            >
              <Typography>
                Already have an account?{" "}
                <Link
                  component="button"
                  onClick={() => navigateTo(navigate, consts["paths"]["login"])}
                  underline="hover"
                >
                  Login
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
