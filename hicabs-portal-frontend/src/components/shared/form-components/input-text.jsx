import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export default function InputText({
  label,
  value,
  onChange,
  hasError,
  errorText,
  ...props
}) {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      error={hasError}
      helperText={
        hasError ? <span style={{ color: "red" }}>{errorText}</span> : ""
      }
      fullWidth
      {...props}
    />
  );
}

InputText.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
};
