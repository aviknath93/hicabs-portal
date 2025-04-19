import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import useStore from "../utils/store";
import useAlertStore from "../utils/alert-store";
import InputText from "../components/shared/form-components/input-text";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const { setAlert } = useAlertStore();
  const changePassword = useStore((state) => state.changePassword);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }
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
        await changePassword(
          formData.oldPassword.trim(),
          formData.newPassword.trim(),
          formData.confirmNewPassword.trim()
        );
        setAlert({
          severity: "success",
          message: "Password changed successfully!",
        });
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
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
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
          Change Password
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
                label="Old Password"
                value={formData.oldPassword}
                onChange={handleChange("oldPassword")}
                hasError={!!errors.oldPassword}
                errorText={errors.oldPassword}
              />
            </Grid>
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
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
