"use client";
import {
	useEditAllocateDockToCarrierMutation,
	useGetDockRequestsQuery,
	useGetDocksByLocationIdQuery,
	useGetOrderByIdQuery,
} from "@/api/apiSlice";
import { CustomButtonFilled } from "@/Components/ReusableComponents/ButtonsComponent";
import DataGridSkeletonLoader from "@/Components/ReusableComponents/DataGridSkeletonLoader";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import {
	Backdrop,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,

	// Backdrop,
	// CircularProgress,
	Grid,
	MenuItem,
	TextField,
	// Toolbar,
	Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

export interface DockRequest {
	ca_id: number;
	cas_ID: string;
	order_ID: string;
	req_sent_to: string[];
	confirmed_to: string;

	assigned_time: string;
	assignment_status: string;
	confirmed_time: string;
	device_ID: string;
	dock_allocated: string | null;
	dock_allocation_status: string;
	dock_time_requested: string;

	driver_data: {
		c_driver_name: string;
		c_driver_number: string;
		c_driver_license: string;
	};

	assignment_cost: {
		cost: string;
		total_weight: string | null;
		total_distance: string;
		cost_criteria_considered: string;
	};

	vehicle_num: string;
}
interface DockDetails {
	dk_id: number;
	dock_ID: string;
	loc_ID: string;
	dock_name: string;
	dock_timings: string;
	dock_availability: number;
	default_carriers: string[];
	location_id: number;
	loc_desc: string;
	longitude: string;
	latitude: string;
	time_zone: string;
	city: string;
	state: string;
	country: string;
	pincode: string;
	loc_type: string;
	gln_code: string;
	iata_code: string;
	address_1: string;
	address_2: string;
	contact_name: string;
	contact_phone_number: string;
	contact_email: string;
	def_ship_from: string | null;
	def_ship_to: string | null;
	def_bill_to: string | null;
}

const DockManagement: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [orderId, setOrderId] = useState("");
	const [locationId, setLocationId] = useState("");
	const [carrierAssignId, setCarrierAssignId] = useState("");
	const [rowDetails, setRowDetails] = useState<DockRequest | null>(null);
	const [docks, setDocks] = useState<DockDetails[]>([]);
	const [selectedDockId, setSelectedDockId] = useState("");
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		"success" | "error" | "warning" | "info"
	>("success");
	const [dockAllocate, { isLoading: isAllocating }] =
		useEditAllocateDockToCarrierMutation();
	const { data: order, isFetching } = useGetOrderByIdQuery(
		{ orderId },
		{ skip: !orderId }
	);

	useEffect(() => {
		if (order?.order) {
			setLocationId(order?.order?.start_loc_ID);
		}
	}, [order?.order]);

	const {
		data: dockRequests,
		isLoading: docksLoading,
		error: dockReqsErr,
	} = useGetDockRequestsQuery({
		page: paginationModel.page + 1,
		limit: paginationModel.pageSize,
	});
	const { data: dockById, isLoading: dockLoading } =
		useGetDocksByLocationIdQuery({ loc_ID: locationId });
	useEffect(() => {
		if (dockById) {
			console.log("dock is :", dockById);
			setDocks(dockById?.dock_details);
		}
	}, [dockById]);
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
	const handleOpenModal = (row: DockRequest) => {
		console.log("hi", row);
		setOpen(true);
		setRowDetails(row);
		setOrderId(row.order_ID);
		setCarrierAssignId(row.cas_ID);
	};
	const columns: GridColDef[] = [
		{ field: "cas_ID", headerName: "Assignment ID", width: 150 },
		{ field: "confirmed_to", headerName: "Carrier confirmed", width: 150 },
		{ field: "order_ID", headerName: "Order ID", width: 150 },
		{ field: "vehicle_num", headerName: "Vehicle No.", width: 150 },
		{ field: "assigned_time", headerName: "Assigned Time", width: 180 },
		{
			field: "dock_time_requested",
			headerName: "Dock Requested At",
			width: 180,
		},
		{ field: "dock_allocation_status", headerName: "Dock Status", width: 150 },
		{ field: "driver_name", headerName: "Driver Name", width: 150 },
		{ field: "driver_number", headerName: "Driver Number", width: 150 },
		{ field: "driver_license", headerName: "Driver License", width: 180 },
		{ field: "cost", headerName: "Cost", width: 120 },
		{ field: "total_distance", headerName: "Distance (km)", width: 130 },
		{ field: "total_weight", headerName: "Weight", width: 120 },
		{ field: "cost_criteria", headerName: "Cost Criteria", width: 140 },
		// { field: "confirmed_time", headerName: "Confirmed Time", width: 180 },
		{ field: "device_ID", headerName: "Device ID", width: 150 },
		// { field: "ca_id", headerName: "Carrier Assignment ID", width: 180 },
		// { field: "dock_allocated", headerName: "Dock Allocated", width: 150 },
		{
			field: "allocate",
			headerName: "Action",
			width: 150,
			renderCell: (params) => (
				<CustomButtonFilled
					variant="outlined"
					color="primary"
					onClick={() => handleOpenModal(params.row)}
				>
					Allocate
				</CustomButtonFilled>
			),
			sortable: false,
			filterable: false,
		},
	];
	const rows = dockRequests?.data?.map((item: DockRequest, index: number) => ({
		id: index,
		cas_ID: item.cas_ID,
		confirmed_to: item.confirmed_to,
		order_ID: item.order_ID,
		vehicle_num: item.vehicle_num,
		assigned_time: item.assigned_time,
		dock_time_requested: item.dock_time_requested,
		dock_allocation_status: item.dock_allocation_status,
		driver_name: item.driver_data?.c_driver_name,
		driver_number: item.driver_data?.c_driver_number,
		driver_license: item.driver_data?.c_driver_license,
		cost: item.assignment_cost?.cost,
		total_weight: item.assignment_cost?.total_weight,
		total_distance: item.assignment_cost?.total_distance,
		cost_criteria_considered: item.assignment_cost?.cost_criteria_considered,
		// confirmed_time: item.confirmed_time,
		device_ID: item.device_ID,
		// req_sent_to: item.req_sent_to.join(", "),
		dock_allocated: item.dock_allocated,
		ca_id: item.ca_id,
	}));

	const handlePaginationModelChange = (
		newPaginationModel: GridPaginationModel
	) => {
		setPaginationModel(newPaginationModel);
	};
	const handleSubmit = async () => {
		if (!selectedDockId || !carrierAssignId) return;
		try {
			const body = {
				cas_ID: carrierAssignId,
				dock_ID: selectedDockId,
			};
			console.log("assign body:", body);
			const response = await dockAllocate(body).unwrap();
			if (
				response.message === "Dock allocated successfully and carrier notified."
			) {
				console.log("edit response :", response);
				setSnackbarMessage(
					`Dock allocated successfully and carrier ${rowDetails?.confirmed_to} will be notified.`
				);
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
				setOpen(false);
			}
		} catch (err) {
			console.error("Dock allocation failed", err);
			setOpen(false);
		}
	};

	return (
		<>
			<Backdrop
				sx={{
					color: "#ffffff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={dockLoading || isFetching}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
				}}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>Allocate Dock to Carrier</DialogTitle>
				<DialogContent>
					<TextField
						select
						fullWidth
						size="small"
						label="Select Dock"
						value={selectedDockId}
						onChange={(e) => setSelectedDockId(e.target.value)}
						margin="normal"
					>
						{docks.map((dock) => (
							<MenuItem key={dock.dk_id} value={dock.dock_ID}>
								{dock.dock_ID}, {dock?.dock_name}, {dock.loc_ID},{" "}
								{dock.loc_type}
							</MenuItem>
						))}
					</TextField>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Cancel</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						disabled={!selectedDockId || isAllocating}
					>
						{isAllocating ? "Submitting..." : "Submit"}
					</Button>
				</DialogActions>
			</Dialog>
			<Grid sx={{ marginTop: "15px" }}>
				<Typography variant="h5" color="primary" sx={{ fontWeight: "bold" }}>
					Dock management
				</Typography>

				<div style={{ marginTop: "10px" }}>
					{docksLoading ? (
						<DataGridSkeletonLoader columns={columns} />
					) : (
						<DataGrid
							columns={columns}
							rows={rows}
							paginationModel={paginationModel}
							onPaginationModelChange={handlePaginationModelChange}
						/>
					)}
				</div>
			</Grid>
		</>
	);
};

export default DockManagement;
