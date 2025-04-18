import React, { createContext, useContext, useState } from "react";
import useStore from "./store";

const defaultAuthContext = {
  isAuthenticated: false,
  logout: () => {},
};

const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const { isAuthenticated, logout } = useStore();

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
