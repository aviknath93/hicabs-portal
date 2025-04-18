import React, { useState } from "react";
import { Box, Button, Typography, Grid, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/store";
import useAlertStore from "../utils/alert-store";
import consts from "../utils/constants.json";
import InputText from "../components/shared/form-components/input-text";
import InputNumber from "../components/shared/form-components/input-number";
import CustomDialog from "../components/shared/ui-components/custom-dialog";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [userId, setUserId] = useState(null);

  const getIpAddress = useStore((state) => state.getIpAddress);
  const login = useStore((state) => state.login);
  const setAuthentication = useStore((state) => state.setAuthentication);
  const verifyEmail = useStore((state) => state.verifyEmail);
  const forgotPassword = useStore((state) => state.forgotPassword);
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
        setAuthentication(response);
        setAlert({ severity: "success", message: "Login successful!" });
        navigateTo(navigate, consts["paths"]["dashboard"]);
      } catch (error) {
        if (error.errors) {
          const notVerifiedError = error.errors.find(
            (err) => err.constraints.notVerified
          );
          if (notVerifiedError) {
            setUserId(error.userId);
            setIsOtpDialogOpen(true);
          } else {
            const errorMessage = error.errors.map(
              (err) =>
                `${err.field}: ${Object.values(err.constraints).join(", ")}`
            );
            setAlert({ severity: "error", message: errorMessage });
          }
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
      setIsOtpDialogOpen(false);
    } catch (error) {
      setAlert({ severity: "error", message: error.message });
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerification(userId);
      setAlert({ severity: "success", message: "OTP resent successfully!" });
    } catch (error) {
      setAlert({ severity: "error", message: error.message });
    }
  };

  const handleForgotPasswordSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !forgotPasswordEmail.trim() ||
      !emailRegex.test(forgotPasswordEmail.trim())
    ) {
      setAlert({
        severity: "error",
        message: "Please enter a valid email address",
      });
      return;
    }

    try {
      await forgotPassword(forgotPasswordEmail.trim());
      setAlert({ severity: "success", message: "Password reset email sent!" });
      setIsForgotPasswordDialogOpen(false);
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
              <Typography sx={{ mt: 1 }}>
                <Link
                  component="button"
                  onClick={() => setIsForgotPasswordDialogOpen(true)}
                  underline="hover"
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>

      <CustomDialog
        open={isOtpDialogOpen}
        title="Verify Email"
        contextText="An OTP has been sent to the given email address"
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
        onClose={() => setIsOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
      />

      <CustomDialog
        open={isForgotPasswordDialogOpen}
        title="Forgot Password"
        content={
          <Box>
            <InputText
              fullWidth
              label="Email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              hasError={!forgotPasswordEmail.trim()}
              errorText={!forgotPasswordEmail.trim() ? "Email is required" : ""}
            />
          </Box>
        }
        onClose={() => setIsForgotPasswordDialogOpen(false)}
        onSubmit={handleForgotPasswordSubmit}
      />
    </Box>
  );
}
