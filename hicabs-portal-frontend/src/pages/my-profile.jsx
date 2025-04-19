import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import useStore from "../utils/store";
import useAlertStore from "../utils/alert-store";
import InputText from "../components/shared/form-components/input-text";

export default function MyProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    contactCountryCode: "",
    contact: "",
    profilePicture: null,
    email: "",
    userType: "",
    contactVerified: false,
  });
  const [errors, setErrors] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { setAlert } = useAlertStore();
  const getProfile = useStore((state) => state.getProfile);
  const updateProfile = useStore((state) => state.updateProfile);
  const uploadProfileImage = useStore((state) => state.uploadProfileImage);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile();
        setProfileData({
          name: data.user.name || "",
          bio: data.bio || "",
          contactCountryCode: "+" + data.contactCountryCode || "",
          contact: data.contact || "",
          profilePicture: data.profileImageUrl
            ? `${import.meta.env.VITE_HI_CABS_PORTAL_API_URL}${
                data.profileImageUrl
              }`
            : "/default_profile_image.jpg",
          email: data.user.email || "",
          userType: data.user.userType || "",
          contactVerified: data.contactVerified || false,
        });
      } catch (error) {
        setAlert({
          severity: "error",
          message: "Failed to load profile data.",
        });
      }
    };

    const fetchCountryCodes = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        setCountryCodes(
          countries.map(
            (country) =>
              country.idd.root +
              (country.idd.suffixes ? country.idd.suffixes[0] : "")
          )
        );
      } catch (error) {
        setAlert({
          severity: "error",
          message: "Failed to load country codes.",
        });
      }
    };

    fetchProfileData();
    fetchCountryCodes();
  }, [getProfile, setAlert]);

  const handleChange = (field) => (event) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
      ];
      if (!validTypes.includes(file.type)) {
        setAlert({
          severity: "error",
          message:
            "Only JPG, JPEG, PNG, WebP, or HEIC image files are allowed!",
        });
        return;
      }

      try {
        const response = await uploadProfileImage(file);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: `${import.meta.env.VITE_HI_CABS_PORTAL_API_URL}${
            response.profileImageUrl
          }`,
        }));
        setAlert({
          severity: "success",
          message: "Profile picture updated successfully!",
        });
      } catch (error) {
        setAlert({
          severity: "error",
          message: "Failed to update profile picture.",
        });
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (profileData.contact && !/^\d+$/.test(profileData.contact)) {
      newErrors.contact = "Contact must be a valid number";
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const dataToUpdate = { name: profileData.name };
      if (profileData.bio) dataToUpdate.bio = profileData.bio;
      if (profileData.contactCountryCode)
        dataToUpdate.contactCountryCode = profileData.contactCountryCode;
      if (profileData.contact) dataToUpdate.contact = profileData.contact;

      try {
        await updateProfile(dataToUpdate);
        await getProfile();
        setAlert({
          severity: "success",
          message: "Profile updated successfully!",
        });
        setIsEditing(false);
      } catch (error) {
        setAlert({ severity: "error", message: "Failed to update profile." });
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
        minHeight: "100vh",
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
          My Profile
        </Typography>
        {!isEditing ? (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <img
              src={profileData.profilePicture}
              alt="Profile"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                marginBottom: 16,
                objectFit: "cover",
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {profileData.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {profileData.email}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {profileData.userType}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Bio:</strong> {profileData.bio || "N/A"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ mr: 1 }}>
                <strong>Contact:</strong>{" "}
                {profileData.contactCountryCode + "-" + profileData.contact ||
                  "N/A"}
              </Typography>
              <Tooltip
                title={
                  profileData.contactVerified
                    ? "Contact Verified"
                    : "Contact Not Verified"
                }
                arrow
              >
                {profileData.contactVerified ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <ErrorIcon color="error" />
                )}
              </Tooltip>
            </Box>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid size={{ xs: 12 }} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <img
                    src={profileData.profilePicture}
                    alt="Profile"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      marginBottom: 16,
                    }}
                  />
                  <Button variant="contained" component="label">
                    Upload New Picture
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg, image/jpg, image/png, image/webp, image/heic"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputText
                  fullWidth
                  label="Name"
                  value={profileData.name}
                  onChange={handleChange("name")}
                  hasError={!!errors.name}
                  errorText={errors.name}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputText
                  fullWidth
                  label="Bio"
                  value={profileData.bio}
                  onChange={handleChange("bio")}
                  hasError={!!errors.bio}
                  errorText={errors.bio}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Contact Country Code</InputLabel>
                  <Select
                    value={profileData.contactCountryCode}
                    onChange={handleChange("contactCountryCode")}
                    label="Contact Country Code"
                  >
                    {countryCodes.map((code, index) => (
                      <MenuItem key={index} value={code}>
                        {code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <InputText
                  fullWidth
                  label="Contact"
                  value={profileData.contact}
                  onChange={handleChange("contact")}
                  hasError={!!errors.contact}
                  errorText={errors.contact}
                />
              </Grid>
              <Grid
                size={{ xs: 12 }}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Box>
  );
}
