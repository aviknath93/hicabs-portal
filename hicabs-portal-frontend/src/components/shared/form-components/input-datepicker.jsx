import React from "react";
import PropTypes from "prop-types";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function InputDatepicker({
  label,
  value,
  onChange,
  hasError = false, // Default value set here
  errorText = "", // Default value set here
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        slotProps={{
          textField: {
            fullWidth: true,
            variant: "outlined",
            error: hasError,
            helperText: hasError ? errorText : "",
          },
        }}
      />
    </LocalizationProvider>
  );
}

InputDatepicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  errorText: PropTypes.string,
};

export default InputDatepicker;
