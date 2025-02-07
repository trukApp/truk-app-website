import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  onClose: () => void;
}

const SnackbarAlert: React.FC<SnackbarAlertProps> = ({
  open,
  message,
  severity = "info",
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
