import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../utils/store";
import consts from "../utils/constants.json";
import useAlertStore from "../utils/alert-store";
import InputText from "../components/shared/form-components/input-text";

export default function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { setAlert } = useAlertStore();
  const navigate = useNavigate();
  const resetPassword = useStore((state) => state.resetPassword);
  const navigateTo = useStore((state) => state.navigateTo);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    }
    if (formData.newPassword.trim() !== formData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        await resetPassword(token, formData.newPassword.trim());
        setAlert({
          severity: "success",
          message: "Password reset successfully!",
        });
        navigateTo(navigate, consts["paths"]["login"]);
      } catch (error) {
        setAlert({ severity: "error", message: error.message });
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
        px: 2,
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
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid size={{ xs: 12 }}>
              <InputText
                fullWidth
                type="password"
                label="New Password"
                value={formData.newPassword}
                onChange={handleChange("newPassword")}
                hasError={!!errors.newPassword}
                errorText={errors.newPassword}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <InputText
                fullWidth
                type="password"
                label="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleChange("confirmNewPassword")}
                hasError={!!errors.confirmNewPassword}
                errorText={errors.confirmNewPassword}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Reset Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
