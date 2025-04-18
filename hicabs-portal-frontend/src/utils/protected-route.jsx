import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth-context";
import consts from "./constants.json";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={consts["paths"]["login"]} replace />
  );
};

export default ProtectedRoute;
