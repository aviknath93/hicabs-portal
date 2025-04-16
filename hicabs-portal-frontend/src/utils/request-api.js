import axios from "axios";

// Function to retrieve the backend URL from Vite environment variables
const getBackendUrl = () => {
  return import.meta.env.VITE_HI_CABS_PORTAL_API_URL;
};

// Function to retrieve the access token from local storage
const getAccessToken = () => {
  return localStorage.getItem("auth_token");
};

// Function to get IP address
const getIpAddress = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

// Helper function to make API calls
const RequestAPI = async (endpoint, method = "POST", payload) => {
  const backendUrl = getBackendUrl();
  console.log("backendUrl", backendUrl);
  const accessToken = getAccessToken();

  if (!backendUrl) {
    throw new Error("Backend URL is not defined in environment variables");
  }

  const url = `${backendUrl}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `${accessToken}`;
  }

  try {
    const ip = await getIpAddress();
    if (ip) {
      headers["X-Forwarded-For"] = ip; // Set IP address in the headers
    }
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }

  const config = {
    method: method,
    url: url,
    headers: headers,
  };

  if (payload instanceof FormData) {
    // For file uploads, use multipart/form-data
    config.data = payload;
    delete headers["Content-Type"]; // Let the browser set the content type, including the boundary
  } else {
    config.data = payload;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error making API call:", error);
    // Return the error response or message
    if (error.response) {
      return Promise.reject(error.response.data);
    } else {
      return Promise.reject({ message: error.message });
    }
  }
};

export default RequestAPI;
