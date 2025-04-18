import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CustomDialog({
  open,
  onClose,
  onSubmit,
  title = "Dialog Title",
  contextText = "",
  content,
  maxWidth = "sm",
  fullWidth = true,
}) {
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{contextText}</DialogContentText>
        <Box sx={{ mt: 2 }}>{content}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
