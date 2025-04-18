import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export default function InputSelect({
  label,
  value,
  onChange,
  options,
  hasError,
  errorText,
  ...props
}) {
  return (
    <FormControl fullWidth variant="outlined" error={hasError} {...props}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {hasError && (
        <FormHelperText style={{ color: "red" }}>{errorText}</FormHelperText>
      )}
    </FormControl>
  );
}

InputSelect.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
};
