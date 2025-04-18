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
      </Routes>
    </>
  );
}

export default App;
