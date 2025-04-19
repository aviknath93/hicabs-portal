import { create } from "zustand";
import RequestAPI from "./request-api";

const useStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  setAuthentication: (token) => {
    localStorage.setItem("token", token);
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
  },
  getIpAddress: async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await RequestAPI("users/register", "POST", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  login: async (userData) => {
    try {
      const response = await RequestAPI("auth/login", "POST", userData);
      return response;
    } catch (error) {
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
      throw error;
    }
  },
  navigateTo: (navigate, path) => {
    navigate(path);
  },
}));

// Expose the store globally for debugging purposes
// @ts-ignore
window.store = useStore;

export default useStore;
