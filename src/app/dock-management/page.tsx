"use client";
import { useGetDockMasterQuery } from "@/api/apiSlice";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import React, { useEffect, useState } from "react";

const DockManagement: React.FC = () => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		"success" | "error" | "warning" | "info"
	>("success");
	const {
		data: dockRequests,
		isLoading: docksLoading,
		error: dockReqsErr,
	} = useGetDockMasterQuery({});
	useEffect(() => {
		if (dockRequests) {
			console.log("dockreqs :", dockRequests.data);
		}
	}, [dockRequests]);
	if (dockReqsErr) {
		console.log("docks err:", dockReqsErr);
		setSnackbarMessage("Error");
		setSnackbarSeverity("error");
		setSnackbarOpen(true);
	}

	return (
		<>
			<Backdrop
				open={docksLoading}
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>
			<Grid>
				<Typography>Dock</Typography>
			</Grid>
		</>
	);
};

export default DockManagement;
