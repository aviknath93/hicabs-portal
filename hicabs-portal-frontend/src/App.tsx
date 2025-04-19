// App.jsx
import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import consts from "./utils/constants.json";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
import CustomAlert from "./components/shared/ui-components/custom-alert";
import useAlertStore from "./utils/alert-store";
import ProtectedRoute from "./utils/protected-route";
import Layout from "./components/core/layout";
import DriverManagement from "./pages/driver-management";
import MyBookings from "./pages/my-bookings";
import AllBookings from "./pages/all-bookings";
import ResetPassword from "./pages/reset-password";
import ChangePassword from "./pages/change-password";
import MyProfile from "./pages/my-profile";

function App() {
  const { alert, clearAlert } = useAlertStore();
  return (
    <>
      {alert && (
        <CustomAlert
          severity={alert.severity}
          message={alert.message}
          timeout={5000}
          onClose={clearAlert}
        />
      )}
      <CssBaseline />
      <Routes>
        <Route path={consts["paths"]["login"]} element={<Login />} />
        <Route
          path={consts["paths"]["registration"]}
          element={<Registration />}
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path={consts["paths"]["dashboard"]}
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={consts["paths"]["my-profile"]}
          element={
            <ProtectedRoute>
              <Layout>
                <MyProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={consts["paths"]["change-password"]}
          element={
            <ProtectedRoute>
              <Layout>
                <ChangePassword />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={consts["paths"]["driver-management"]}
          element={
            <ProtectedRoute>
              <Layout>
                <DriverManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={consts["paths"]["all-bookings"]}
          element={
            <ProtectedRoute>
              <Layout>
                <AllBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path={consts["paths"]["my-bookings"]}
          element={
            <ProtectedRoute>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
