import { create } from "zustand";
import RequestAPI from "./request-api";

const useStore = create((set) => ({
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
  navigateTo: (navigate, path) => {
    navigate(path);
  },
}));

// Expose the store globally for debugging purposes
window.store = useStore;

export default useStore;
