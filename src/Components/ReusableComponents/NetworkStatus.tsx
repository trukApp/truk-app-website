// components/NetworkStatusModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  zIndex: 2000
};

const NetworkStatusModal = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    updateOnlineStatus(); // Initial check

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <Modal open={!isOnline}>
      <Box sx={modalStyle}>
        <Typography variant="h6" color="error" align="center">
          No Internet Connection
        </Typography>
        <Typography variant="body2" align="center">
          Please check your network connection.
        </Typography>
      </Box>
    </Modal>
  );
};

export default NetworkStatusModal;
