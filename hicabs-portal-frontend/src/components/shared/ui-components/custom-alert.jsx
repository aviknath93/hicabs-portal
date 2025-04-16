// custom-alert.jsx
import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import "animate.css";

const CustomAlert = ({ severity, message, timeout = 5000, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate__animated animate__fadeInRight"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Alert
        variant="filled"
        severity={severity}
        onClose={() => setOpen(false)}
      >
        {Array.isArray(message) ? (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {message.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        ) : (
          message
        )}
      </Alert>
    </div>
  );
};

export default CustomAlert;
