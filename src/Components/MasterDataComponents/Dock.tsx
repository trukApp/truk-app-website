import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./MasterData.module.css";
import {
	TextField,
	Button,
	Grid,
	Checkbox,
	FormControlLabel,
	FormHelperText,
	Box,
	CircularProgress,
	Paper,
	List,
	ListItem,
	Tooltip,
	Backdrop,
	IconButton,
	Popover,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
	useDeleteDockMasterMutation,
	useEditDockMasterMutation,
	useGetCarrierMasterQuery,
	useGetDockMasterQuery,
	useGetFilteredLocationsQuery,
	useGetLocationMasterQuery,
	usePostDockMasterMutation,
} from "@/api/apiSlice";
import { Location } from "./Locations";
import { CustomButtonFilled } from "../ReusableComponents/ButtonsComponent";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";
import { Collapse } from "@mui/material";
import DataGridSkeletonLoader from "../ReusableComponents/DataGridSkeletonLoader";
import { DataGridComponent } from "../GridComponent";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { CarrierFormBE } from "../BusinessPartnersForms/CarriersForm";

interface DockFormValues {
	loc_ID: string;
	dock_ID: string;
	locationId: string;
	dock_name: string;
	dock_timings: string;
	dock_availability: boolean;
	default_carriers: string | string[];
}

const DockForm = () => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
		page: 0,
		pageSize: 10,
	});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		"success" | "error" | "warning" | "info"
	>("success");
	const [showForm, setShowForm] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editRow, setEditRow] = useState<DockFormValues | null>(null);
	const { data, error, isLoading, refetch } = useGetDockMasterQuery({
		page: paginationModel.page + 1,
		limit: paginationModel.pageSize,
	});

	const [postDock, { isLoading: postDockLoading, isSuccess: postSuccess }] =
		usePostDockMasterMutation();
	const [editDock, { isLoading: editDockLoading, isSuccess: editSuccess }] =
		useEditDockMasterMutation();
	const [
		deleteDock,
		{ isLoading: deleteDockLoading, isSuccess: deleteSuccess },
	] = useDeleteDockMasterMutation();
	const { data: carriersData, isLoading: isCarrierLoading } =
		useGetCarrierMasterQuery({});
	// const getAllCarriers =carriersData?.carriers.length > 0 ? carriersData?.carriers : [];
	const getAllCarriers = carriersData?.carriers?.length
		? carriersData.carriers.filter(
				(carrier: CarrierFormBE) => carrier.contract === 1
		  )
		: [];
	const { data: locationsData } = useGetLocationMasterQuery({});
	const getAllLocations =
		locationsData?.locations.length > 0 ? locationsData?.locations : [];
	const [searchKey, setSearchKey] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const { data: filteredLocations, isLoading: filteredLocationLoading } =
		useGetFilteredLocationsQuery(searchKey?.length >= 3 ? searchKey : null, {
			skip: searchKey?.length < 3,
		});
	const displayLocations = searchKey
		? filteredLocations?.results || []
		: getAllLocations;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [fromTime, setFromTime] = useState<Dayjs | null>(dayjs());
	const [toTime, setToTime] = useState<Dayjs | null>(dayjs());

	const parseTimesFromValue = (value: string) => {
		const parts = value.split(" - ");
		if (parts.length === 2) {
			const parsedFrom = dayjs(parts[0], "hh:mm A");
			const parsedTo = dayjs(parts[1], "hh:mm A");
			if (parsedFrom.isValid() && parsedTo.isValid()) {
				setFromTime(parsedFrom);
				setToTime(parsedTo);
			}
		}
	};
	console.log("data doc", data?.docks);
	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		const currentValue = formik.values.dock_timings || "";
		parseTimesFromValue(currentValue);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const updateDockTimings = (from: Dayjs | null, to: Dayjs | null) => {
		if (from && to) {
			const formatted = `${from.format("hh:mm A")} - ${to.format("hh:mm A")}`;
			formik.setFieldValue("dock_timings", formatted);
		}
	};
	const getLocationDetails = (loc_ID: string) => {
		console.log("locid:", loc_ID);
		const location = getAllLocations?.find(
			(loc: Location) => loc.loc_ID === loc_ID
		);
		if (!location) return "Location details not available";
		const details = [
			location.loc_ID,
			location.loc_desc,
			location.city,
			location.state,
			location.pincode,
		].filter(Boolean);

		return details.length > 0
			? details.join(", ")
			: "Location details not available";
	};

	const handleFormSubmit = async (values: DockFormValues) => {
		try {
			const body = {
				docks: [
					{
						loc_ID: values.locationId,
						dock_name: values.dock_name,
						dock_timings: values.dock_timings,
						dock_availability: values.dock_availability,
						default_carriers: values.default_carriers,
					},
				],
			};

			console.log("body   :", body);
			if (isEditing && editRow) {
				const dock_ID = editRow.dock_ID;
				const editBody = {
					loc_ID: values.locationId,
					dock_ID: dock_ID,
					dock_name: values.dock_name,
					dock_timings: values.dock_timings,
					dock_availability: values.dock_availability,
					default_carriers: values.default_carriers,
				};
				// console.log("edit body:", editBody, dock_ID);
				const response = await editDock({ body: editBody, dock_ID }).unwrap();
				if (response?.dock_ID) {
					setSnackbarMessage(`Dock ID ${dock_ID} updated successfully!`);
					formik.resetForm();
					setIsEditing(false);
					setSnackbarSeverity("success");
					setSnackbarOpen(true);
					setSearchKey("");
					setShowForm(false);
				}
			} else {
				const response = await postDock(body).unwrap();
				if (response?.created_records) {
					setSnackbarMessage(
						`Dock ID ${response.created_records[0]} created successfully!`
					);
					formik.resetForm();
					setSnackbarSeverity("success");
					setSnackbarOpen(true);
					setSearchKey("");
					setShowForm(false);
				}
			}
		} catch (error) {
			console.error("API Error:", error);
			setSnackbarMessage("Something went wrong! please try again.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};
	const initialValues: DockFormValues = {
		loc_ID: "",
		dock_ID: "",
		locationId: "",
		dock_name: "",
		dock_timings: "",
		dock_availability: true,
		default_carriers: [],
	};
	const formik = useFormik<DockFormValues>({
		initialValues: initialValues,
		validationSchema: Yup.object({
			locationId: Yup.string().required("Location ID is required"),
			dock_name: Yup.string().required("Dock name is required"),
			dock_timings: Yup.string().required("Dock timings are required"),
			dock_availability: Yup.boolean().required(),
			default_carriers: Yup.array()
				.of(Yup.string().required())
				.min(1, "Please select at least one Carrier ID")
				.required("Carrier ID is required"),
		}),
		onSubmit: handleFormSubmit,
	});

	useEffect(() => {
		if (postSuccess || editSuccess || deleteSuccess) {
			refetch();
		}
	}, [postSuccess, editSuccess, deleteSuccess, refetch]);

	if (error) {
		console.error("Error fetching devices:", error);
	}
	const handlePaginationModelChange = (
		newPaginationModel: GridPaginationModel
	) => {
		setPaginationModel(newPaginationModel);
	};

	const handleEdit = (row: DockFormValues) => {
		setShowForm(true);
		setIsEditing(true);
		setEditRow(row);
	};

	const handleDelete = async (row: DockFormValues) => {
		const dockId = row?.dock_ID;
		if (!dockId) {
			console.error("Row ID is missing");
			setSnackbarMessage("Error: Dock ID is missing!");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
			return;
		}

		const confirmed = window.confirm(
			"Are you sure you want to delete this item?"
		);
		if (!confirmed) {
			return;
		}

		try {
			const response = await deleteDock(dockId);
			console.log("response delete dock :", response);
			if (response?.data?.deleted_record) {
				setSnackbarMessage(
					`Dock ID ${response?.data.deleted_record} deleted successfully!`
				);
				setSnackbarSeverity("info");
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("Error deleting dock:", error);
			setSnackbarMessage("Failed to delete dock. Please try again.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	useEffect(() => {
		if (editRow) {
			console.log("edit row:", editRow);
			const locId = editRow?.locationId
				? editRow.locationId.split(", ")[0] ?? ""
				: "";
			setSearchKey(editRow?.locationId);
			formik.setValues({
				dock_ID: editRow?.dock_ID,
				locationId: locId,
				dock_name: editRow.dock_name || "",
				dock_timings: editRow.dock_timings || "",
				dock_availability: Boolean(editRow.dock_availability),
				loc_ID: locId,
				// default_carriers: editRow.default_carriers,
				default_carriers:
					typeof editRow.default_carriers === "string"
						? editRow.default_carriers.split(",").map((id) => id.trim())
						: [],
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editRow]);

	const columns: GridColDef[] = [
		{ field: "dock_ID", headerName: "Dock Code", width: 150 },
		{ field: "dock_name", headerName: "Dock Name", width: 150 },
		{ field: "dock_timings", headerName: "Dock Timings", width: 200 },
		{
			field: "dock_availability",
			headerName: "Available",
			width: 130,
			renderCell: (params) => (params.value ? "Yes" : "No"),
		},
		{ field: "default_carriers", headerName: "Dock Carriers", width: 250 },
		{ field: "loc_ID", headerName: "Location ID", width: 350 },
		{
			field: "actions",
			headerName: "Actions",
			width: 200,
			renderCell: (params) => (
				<div>
					<IconButton color="primary" onClick={() => handleEdit(params.row)}>
						<EditIcon />
					</IconButton>
					<IconButton color="error" onClick={() => handleDelete(params.row)}>
						<DeleteIcon />
					</IconButton>
				</div>
			),
		},
	];

	const rows = data?.docks?.map((item: DockFormValues) => ({
		id: item.dock_ID,
		dock_ID: item.dock_ID,
		loc_ID: getLocationDetails(item.loc_ID),
		locationId: getLocationDetails(item.loc_ID),
		dock_name: item.dock_name,
		dock_timings: item.dock_timings,
		dock_availability: item.dock_availability,
		default_carriers: Array.isArray(item.default_carriers)
			? item.default_carriers.join(", ")
			: item.default_carriers,
	}));

	return (
		<>
			<Backdrop
				sx={{
					color: "#ffffff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={
					postDockLoading ||
					editDockLoading ||
					deleteDockLoading ||
					isLoading ||
					isCarrierLoading
				}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>
			<Box display="flex" justifyContent="flex-end">
				<Button
					onClick={() => setShowForm((prev) => !prev)}
					className={styles.createButton}
				>
					Create Dock
					{showForm ? (
						<KeyboardArrowUpIcon style={{ marginLeft: 4 }} />
					) : (
						<KeyboardArrowDownIcon style={{ marginLeft: 4 }} />
					)}
				</Button>
				{/* <MassUpload arrayKey="devices" /> */}
			</Box>
			<Collapse in={showForm}>
				<Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{isEditing && (
							<Grid item xs={12} sm={6} md={2.4}>
								<TextField
									fullWidth
									size="small"
									id="dock_ID"
									name="dock_ID"
									label="Dock ID (Auto Generated)"
									value={formik.values.dock_ID}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									disabled
								/>
							</Grid>
						)}
						<Grid item xs={12} md={2.4}>
							<TextField
								fullWidth
								name="locationId"
								size="small"
								label="Location ID"
								onFocus={() => {
									if (!searchKey) {
										setSearchKey(formik.values?.locationId || "");
										setShowSuggestions(true);
									}
								}}
								onChange={(e) => {
									setSearchKey(e.target.value);
									setShowSuggestions(true);
								}}
								value={searchKey}
								error={
									formik.touched.locationId && Boolean(formik.errors.locationId)
								}
								helperText={
									formik.touched?.locationId &&
									typeof formik.errors?.locationId === "string"
										? formik.errors.locationId
										: ""
								}
								InputProps={{
									endAdornment: filteredLocationLoading ? (
										<CircularProgress size={20} />
									) : null,
								}}
							/>
							<div ref={wrapperRef}>
								{showSuggestions && displayLocations?.length > 0 && (
									<Paper
										style={{
											maxHeight: 200,
											overflowY: "auto",
											position: "absolute",
											zIndex: 10,
											width: "18%",
										}}
									>
										<List>
											{displayLocations.map((location: Location) => (
												<ListItem
													key={location.loc_ID}
													component="li"
													onClick={() => {
														setShowSuggestions(false);
														const selectedDisplay = `${location.loc_ID},${location?.loc_desc}, ${location.city}, ${location.state}, ${location.pincode}`;
														setSearchKey(selectedDisplay);
														formik.setFieldValue("locationId", location.loc_ID);
													}}
													sx={{ cursor: "pointer" }}
												>
													<Tooltip
														title={`${location.loc_desc}, ${location.address_1}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
														placement="right"
													>
														<span style={{ fontSize: "14px" }}>
															{location.loc_ID}, {location.loc_desc},{" "}
															{location.city}, {location.state},{" "}
															{location.pincode}
														</span>
													</Tooltip>
												</ListItem>
											))}
										</List>
									</Paper>
								)}
							</div>
						</Grid>

						<Grid item xs={12} md={2.4}>
							<TextField
								fullWidth
								label="Dock Name"
								name="dock_name"
								size="small"
								value={formik.values.dock_name}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.dock_name && Boolean(formik.errors.dock_name)
								}
								helperText={formik.touched.dock_name && formik.errors.dock_name}
							/>
						</Grid>

						{/* <Grid item xs={12} md={3}>
          <TextField
            fullWidth size='small'
            label="Dock Timings"
            name="dock_timings"
            value={formik.values.dock_timings}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.dock_timings && Boolean(formik.errors.dock_timings)}
            helperText={formik.touched.dock_timings && formik.errors.dock_timings}
            
          />
        </Grid> */}
						<Grid item xs={12} md={2.4}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<TextField
									fullWidth
									size="small"
									label="Dock Timings"
									name="dock_timings"
									value={formik.values.dock_timings}
									onClick={handleOpen}
									onBlur={formik.handleBlur}
									error={
										formik.touched.dock_timings &&
										Boolean(formik.errors.dock_timings)
									}
									helperText={
										formik.touched.dock_timings && formik.errors.dock_timings
									}
								/>

								<Popover
									open={Boolean(anchorEl)}
									anchorEl={anchorEl}
									onClose={handleClose}
									anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
								>
									<Box p={2} display="flex" flexDirection="column" gap={2}>
										<TimePicker
											label="From Time"
											value={fromTime}
											onChange={(newValue) => {
												setFromTime(newValue);
												updateDockTimings(newValue, toTime);
											}}
											ampm
											slotProps={{
												textField: { size: "small" },
											}}
											minutesStep={1}
										/>
										<TimePicker
											label="To Time"
											value={toTime}
											onChange={(newValue) => {
												setToTime(newValue);
												updateDockTimings(fromTime, newValue);
											}}
											ampm
											minutesStep={1}
											slotProps={{
												textField: { size: "small" },
											}}
										/>
									</Box>
								</Popover>
							</LocalizationProvider>
						</Grid>

						<Grid item xs={12} sm={6} md={2.4}>
							<FormControl
								fullWidth
								size="small"
								error={
									formik.touched.default_carriers &&
									Boolean(formik.errors.default_carriers)
								}
							>
								<InputLabel>Carrier IDs</InputLabel>
								<Select
									fullWidth
									multiple
									label="Carrier ID"
									name="default_carriers"
									value={formik.values.default_carriers}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
								>
									{isCarrierLoading ? (
										<MenuItem disabled>
											<CircularProgress size={20} color="inherit" />
											<span style={{ marginLeft: "10px" }}>Loading...</span>
										</MenuItem>
									) : (
										getAllCarriers?.map((carrier: CarrierFormBE) => (
											<MenuItem
												key={carrier?.carrier_ID}
												value={String(carrier.carrier_ID)}
											>
												<Tooltip
													title={`${carrier?.carrier_name}, ${carrier?.carrier_address}`}
													placement="right"
													arrow
												>
													<Typography noWrap>
														{carrier?.carrier_name}, {carrier?.carrier_address},{" "}
														{carrier?.carrier_ID}
													</Typography>
												</Tooltip>
											</MenuItem>
										))
									)}
								</Select>
								{formik.touched.default_carriers &&
									formik.errors.default_carriers && (
										<FormHelperText>
											{formik.errors.default_carriers}
										</FormHelperText>
									)}
							</FormControl>
						</Grid>
						<Grid item xs={12} md={2.4}>
							<FormControlLabel
								control={
									<Checkbox
										size="small"
										name="dock_availability"
										checked={formik.values.dock_availability}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								}
								label="Is Dock Available?"
							/>
						</Grid>
						{formik.touched.dock_availability &&
							formik.errors.dock_availability && (
								<Grid item xs={12} md={12}>
									<FormHelperText error>
										{formik.errors.dock_availability}
									</FormHelperText>
								</Grid>
							)}
					</Grid>
					<Box mt={3} textAlign="center">
						<CustomButtonFilled>
							{isEditing ? "Update dock" : "Create dock"}
						</CustomButtonFilled>
						<Button
							variant="outlined"
							color="secondary"
							onClick={() => {
								formik.resetForm();
								setIsEditing(false);
								setEditRow(null);
								setSearchKey("");
							}}
							style={{ marginLeft: "10px" }}
						>
							Reset
						</Button>
					</Box>
				</Box>
			</Collapse>
			<div style={{ marginTop: "40px" }}>
				{isLoading ? (
					<DataGridSkeletonLoader columns={columns} />
				) : (
					<DataGridComponent
						columns={columns}
						rows={rows}
						isLoading={isLoading}
						paginationModel={paginationModel}
						activeEntity="devices"
						onPaginationModelChange={handlePaginationModelChange}
					/>
				)}
			</div>
		</>
	);
};

export default DockForm;
