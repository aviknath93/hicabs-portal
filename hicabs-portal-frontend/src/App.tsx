// App.jsx
import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import consts from "./utils/constants.json";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./pages/login";
import Registration from "./pages/registration";
import Dashboard from "./pages/dashboard";
;

function App() {
  return (
    <>
      <CssBaseline />
        <Routes>
          <Route path={consts["paths"]["login"]} element={<Login />} />
          <Route path={consts["paths"]["registration"]} element={<Registration />} />
          <Route path={consts["paths"]["dashboard"]} element={<Dashboard />} />
        </Routes>
    </>
  );
}

export default App;
