import { create } from "zustand";
import RequestAPI from "./request-api";

const useStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem("auth_token"),

  setAuthentication: (token) => {
    localStorage.setItem("auth_token", token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ isAuthenticated: false });
  },

  getIpAddress: async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await RequestAPI("users/register", "POST", userData);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await RequestAPI("auth/login", "POST", userData);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  verifyEmail: async (userId, otp) => {
    try {
      const response = await RequestAPI(
        `users/verify-email/${userId}`,
        "POST",
        { otp }
      );
      return response;
    } catch (error) {
      console.error("Email verification failed:", error);
      throw error;
    }
  },

  resendVerification: async (userId) => {
    try {
      const response = await RequestAPI(
        `users/resend-verification/${userId}`,
        "POST"
      );
      return response;
    } catch (error) {
      console.error("Resend verification failed:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await RequestAPI("users/forgot-password", "POST", {
        email,
      });
      return response;
    } catch (error) {
      console.error("Forgot password request failed:", error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await RequestAPI("users/reset-password", "POST", {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  },

  changePassword: async (oldPassword, newPassword, confirmNewPassword) => {
    try {
      const response = await RequestAPI("passwords/change-password", "PUT", {
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      return response;
    } catch (error) {
      console.error("Change password failed:", error);
      throw error;
    }
  },

  profileData: {
    name: "",
    bio: "",
    contactCountryCode: "",
    contact: "",
    profilePicture: "",
  },

  getProfile: async () => {
    try {
      const response = await RequestAPI("profiles/me", "GET");
      set({
        profileData: {
          name: response.user.name || "",
          bio: response.bio || "",
          contactCountryCode: "+" + response.contactCountryCode || "",
          contact: response.contact || "",
          profilePicture: response.profileImageUrl
            ? `${import.meta.env.VITE_HI_CABS_PORTAL_API_URL}${
                response.profileImageUrl
              }`
            : "/default_profile_image.jpg",
        },
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      throw new Error("Failed to fetch profile data");
    }
  },

  updateProfile: async (profileDetails) => {
    try {
      await RequestAPI("profiles/update-details", "PUT", profileDetails);
    } catch (error) {
      console.error("Failed to update profile details:", error);
      throw new Error("Failed to update profile details");
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await RequestAPI(
        "profiles/upload-image",
        "PUT",
        formData
      );

      set((state) => ({
        profileData: {
          ...state.profileData,
          profilePicture: `${import.meta.env.VITE_HI_CABS_PORTAL_API_URL}${
            response.profileImageUrl
          }`,
        },
      }));

      return response;
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      throw new Error("Failed to upload profile image");
    }
  },

  navigateTo: (navigate, path) => {
    navigate(path);
  },
}));

export default useStore;
