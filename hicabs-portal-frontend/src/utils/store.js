import { create } from "zustand";
import RequestAPI from "./request-api";

const useStore = create((set) => ({
  registerUser: async (userData) => {
    try {
      const response = await RequestAPI("users/register", "POST", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
}));

// Expose the store globally for debugging purposes
window.store = useStore;

export default useStore;
