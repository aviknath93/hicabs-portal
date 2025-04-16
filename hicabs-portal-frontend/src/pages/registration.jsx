import React, { useState } from "react";
import { Box, Button, Typography, Grid, Link } from "@mui/material";
import useStore from "../utils/store";
import consts from "../utils/constants.json";
import useAlertStore from "../utils/alert-store";
import { useNavigate } from "react-router-dom";
import CustomDialog from "../components/shared/ui-components/custom-dialog";
import InputNumber from "../components/shared/form-components/input-number";
import InputText from "../components/shared/form-components/input-text";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "vendor",
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const register = useStore((state) => state.register);
  const verifyEmail = useStore((state) => state.verifyEmail);
  const resendVerification = useStore((state) => state.resendVerification);
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
        setUserId(response.userId); // Assuming response contains userId
        setAlert({ severity: "success", message: "Registration successful!" });
        setIsDialogOpen(true);
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

  const handleOtpChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim()) {
      setAlert({ severity: "error", message: "OTP is required" });
      return;
    }

    try {
      await verifyEmail(userId, parseInt(otp.trim()));
      setAlert({
        severity: "success",
        message: "Email verified successfully!",
      });
      setIsDialogOpen(false);
      navigateTo(navigate, consts["paths"]["login"]);
    } catch (error) {
      setAlert({ severity: "error", message: error.message });
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerification(userId);
      setAlert({ severity: "success", message: "Verification email resent!" });
    } catch (error) {
      setAlert({ severity: "error", message: error.message });
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
              <InputText
                fullWidth
                label="Name"
                value={formData.name}
                onChange={handleChange("name")}
                hasError={!!errors.name}
                errorText={errors.name}
              />
            </Grid>
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
              <InputText
                fullWidth
                type="password"
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                hasError={!!errors.confirmPassword}
                errorText={errors.confirmPassword}
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

      <CustomDialog
        open={isDialogOpen}
        title="Verify Email"
        content={
          <Box>
            <InputNumber
              label="Enter OTP"
              value={otp}
              onChange={handleOtpChange}
              hasError={!otp.trim()}
              errorText={!otp.trim() ? "OTP is required" : ""}
            />
            <Link
              component="button"
              onClick={handleResendOtp}
              underline="hover"
            >
              Resend OTP
            </Link>
          </Box>
        }
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        email={formData.email}
      />
    </Box>
  );
}
