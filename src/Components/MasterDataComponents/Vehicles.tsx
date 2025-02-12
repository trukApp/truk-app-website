"use client";

import React, { useEffect, useState } from "react";
import { Formik, Form,FormikProps } from "formik";
import * as Yup from "yup";
import {
	TextField,
	Grid,
	Box,
	Typography,
	Checkbox,
	FormControlLabel,
	MenuItem,
	Button,
	Collapse,
	IconButton,
	FormHelperText,
	Select,
	FormControl,
	InputLabel,
	SelectChangeEvent,
	Backdrop,
	CircularProgress,
	Tooltip,
} from "@mui/material";
import { DataGridComponent } from "../GridComponent";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "./MasterData.module.css";
import {
	useDeleteVehicleMasterMutation,
	useEditVehicleMasterMutation,
	useGetLocationMasterQuery,
	useGetVehicleMasterQuery,
	usePostVehicleMasterMutation,
} from "@/api/apiSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MassUpload from "../MassUpload/MassUpload";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import DataGridSkeletonLoader from "../ReusableComponents/DataGridSkeletonLoader";
import { Location } from "./Locations";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";

export interface VehicleFormValues {
	vehicleId: string;
	id: string;
	locationId: string;
	timeZone: string;
	unlimitedUsage: boolean;
	individualResources: string;
	validityFrom: string;
	validityTo: string;
	vehicleType: string;
	vehicleGroup: string;
	ownership: string;
	payloadWeight: string;
	payloadWeightUnits: string;

	cubicCapacity: string;
	cubicCapacityUnits: string;

	interiorLength: string;
	interiorLengthUnits: string;

	interiorWidth: string;
	interiorWidthUnits: string;

	interiorHeight: string;
	interiorHeightUnits: string;

	tareWeight: string;
	tareWeightUnits: string;

	maxGrossWeight: string;
	maxGrossWeightUnits: string;

	tareVolume: string;
	tareVolumeUnits: string;

	maxLength: string;
	maxLengthUnits: string;

	maxWidth: string;
	maxWidthUnits: string;

	maxHeight: string;
	maxHeightUnits: string;

	platformHeight: string;
	platformHeightUnits: string;

	topDeckHeight: string;
	topDeckHeightUnits: string;

	doorWidth: string;
	doorWidthUnits: string;

	doorHeight: string;
	doorHeightUnits: string;

	doorLength: string;
	doorLengthUnits: string;

	avgCost: string;
	downtimeStart: string;
	downtimeEnd: string;
	downtimeLocation: string;
	downtimeDescription: string;
	downtimeReason: string;
}

interface AdditionalDetails {
	cost_per_ton: string;
}

interface Capacity {
	cubic_capacity_unit: string;
	payload_weight_unit: string;
	cubic_capacity: string;
	interior_height: string;
	interior_length: string;
	interior_width: string;
	payload_weight: string;
}

interface Downtimes {
	downtime_desc: string;
	downtime_starts_from: string;
	downtime_ends_from: string;
	downtime_location: string;
	reason: string;
}

interface PhysicalProperties {
	max_gross_weight: string;
	max_height: string;
	max_length: string;
	max_width: string;
	tare_volume: string;
	tare_weight: string;
}

interface TransportationDetails {
	ownership: string;
	validity_from: string;
	validity_to: string;
	vehicle_group: string;
	vehicle_type: string;
}

export interface VehicleDetails {
	time_zone: string;
	id: string;
	additional_details: AdditionalDetails;
	capacity: Capacity;
	city: string;
	country: string;
	downtimes: Downtimes;
	gln_code: string;
	iata_code: string;
	individual_resource: string;
	latitude: string;
	loc_ID: string;
	loc_desc: string;
	loc_type: string;
	location_id: number;
	longitude: string;
	physical_properties: PhysicalProperties;
	pincode: string;
	state: string;
	timeZone: string;
	transportation_details: TransportationDetails;
	unlimited_usage: number;
	veh_id: number;
	vehicle_ID: string;
	platformHeight: string;
	topDeckHeight: string;
	doorWidth: string;
	doorHeight: string;
	doorLength: string;
	avgCost: string;
}

const downtimeReasons = ["Maintenance", "Breakdown", "Inspection", "Other"];

const validationSchema = Yup.object({
	locationId: Yup.string().required("Location ID is required"),
	timeZone: Yup.string().required("Time Zone is required"),
  unlimitedUsage: Yup.boolean(),
  individualResources: Yup.number()
    .typeError("Must be a number")
    .when("unlimitedUsage", {
      is: false,
      then: (schema) => schema.required("Individual Resources is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
	validityFrom: Yup.string().required("Validity start date is required"),
	validityTo: Yup.string().required("Validity end date is required"),
	vehicleType: Yup.string().required("Vehicle Type is required"),
	vehicleGroup: Yup.string().required("Vehicle Group is required"),
	ownership: Yup.string().required("Ownership is required"),
	payloadWeight: Yup.number().required("Payload Weight is required"),
	cubicCapacity: Yup.number().required("Cubic Capacity is required"),
	interiorLength: Yup.number().required("Interior Length is required"),
	interiorWidth: Yup.number().required("Interior Width is required"),
	interiorHeight: Yup.number().required("Interior Height is required"),
	tareWeight: Yup.number().required("Tare Weight is required"),
	maxGrossWeight: Yup.number().required("Max Gross Weight is required"),
	tareVolume: Yup.number().required("Tare Volume is required"),
	maxLength: Yup.number().required("Max Length is required"),
	maxWidth: Yup.number().required("Max Width is required"),
	maxHeight: Yup.number().required("Max Height is required"),
	// platformHeight: Yup.number(),
	// topDeckHeight: Yup.number(),
	// doorWidth: Yup.number(),
	// doorHeight: Yup.number(),
	// doorLength: Yup.number(),
	avgCost: Yup.number()
		.typeError("Average cost must be a number")
		.required("Average cost of transportation is required"),
	downtimeStart: Yup.string().required("Downtime Start is required"),
	downtimeEnd: Yup.string().required("Downtime End is required"),
	downtimeLocation: Yup.string().required("Downtime Location is required"),
	downtimeDescription: Yup.string().required("Description is required"),
	downtimeReason: Yup.string().required("Reason is required"),
});

const VehicleForm: React.FC = () => {
	const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0,pageSize: 10,});
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
	const [isEditing, setIsEditing] = useState(false);
	const [editRow, setEditRow] = useState<VehicleFormValues | null>(null);
	const { data, error ,isLoading } = useGetVehicleMasterQuery({page: paginationModel.page + 1, limit: paginationModel.pageSize});
	const [postVehicle, { isLoading: postVehicleLoading }] = usePostVehicleMasterMutation();
	const [editVehicle, { isLoading: editVehicleLoading }] = useEditVehicleMasterMutation();
	const [deleteVehicle, { isLoading: deleteVehicleLoading }] = useDeleteVehicleMasterMutation();
	if (error) {
		console.log("err in loading vehicles data :", error);
	}
	const { data: locationsData, isLoading:isLocationLoading } = useGetLocationMasterQuery({});
	const getAllLocations =
		locationsData?.locations.length > 0 ? locationsData?.locations : [];
	const vehiclesMaster = data?.vehicles;
	console.log("all vehicles :", vehiclesMaster);
	const unitsofMeasurement = useSelector(
		(state: RootState) => state.auth.unitsofMeasurement
	);
	const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel);
    };
	const [showForm, setShowForm] = useState(false);
	const initialFormValues = {
		id: "",
		vehicleId: "",
		locationId: "",
		timeZone: "",
		unlimitedUsage: false,
		individualResources: "",
		validityFrom: "",
		validityTo: "",
		vehicleType: "",
		vehicleGroup: "",
		ownership: "",
		payloadWeight: "",
		payloadWeightUnits: unitsofMeasurement[0],
		cubicCapacity: "",
		cubicCapacityUnits: unitsofMeasurement[0],
		interiorLength: "",
		interiorLengthUnits: unitsofMeasurement[0],
		interiorWidth: "",
		interiorWidthUnits: unitsofMeasurement[0],
		interiorHeight: "",
		interiorHeightUnits: unitsofMeasurement[0],
		tareWeight: "",
		tareWeightUnits: unitsofMeasurement[0],
		maxGrossWeight: "",
		maxGrossWeightUnits: unitsofMeasurement[0],
		tareVolume: "",
		tareVolumeUnits: unitsofMeasurement[0],
		maxLength: "",
		maxLengthUnits: unitsofMeasurement[0],
		maxWidth: "",
		maxWidthUnits: unitsofMeasurement[0],
		maxHeight: "",
		maxHeightUnits: unitsofMeasurement[0],
		platformHeight: "",
		platformHeightUnits: unitsofMeasurement[0],
		topDeckHeight: "",
		topDeckHeightUnits: unitsofMeasurement[0],
		doorWidth: "",
		doorWidthUnits: unitsofMeasurement[0],
		doorHeight: "",
		doorHeightUnits: unitsofMeasurement[0],
		doorLength: "",
		doorLengthUnits: unitsofMeasurement[0],
		avgCost: "",
		downtimeStart: "",
		downtimeEnd: "",
		downtimeLocation: "",
		downtimeDescription: "",
		downtimeReason: "",
	};

	const [initialValues, setInitialValues] = useState(initialFormValues);
	useEffect(() => {
		console.log("edit row iii: ", editRow);
		if (editRow) {
			const editPayloadWeight = editRow.payloadWeight.split(" ");
			const editCubicCapacity = editRow?.cubicCapacity.split(" ");
			const editInteriorLength = editRow.interiorLength.split(" ");
			const editInteriorWidth = editRow.interiorWidth.split(" ");
			const editInteriorHeight = editRow.interiorHeight.split(" ");
			const editTareWeight = editRow.tareWeight.split(" ");
			const editMaxGrossWeight = editRow.maxGrossWeight.split(" ");
			const editTareVolume = editRow.tareVolume.split(" ");
			const editMaxLength = editRow.maxLength.split(" ");
			const editMaxWidth = editRow.maxWidth.split(" ");
			const editMaxHeight = editRow.maxHeight.split(" ");

			setInitialValues(() => ({
				id: "",
				vehicleId: editRow?.vehicleId,
				locationId: editRow?.locationId,
				timeZone: editRow?.timeZone,
				unlimitedUsage: editRow.unlimitedUsage,
				individualResources: editRow.individualResources,
				validityFrom: editRow.validityFrom,
				validityTo: editRow.validityTo,
				vehicleType: editRow.vehicleType,
				vehicleGroup: editRow.vehicleGroup,
				ownership: editRow.ownership,
				payloadWeight: editPayloadWeight[0],
				payloadWeightUnits: editPayloadWeight[1],
				cubicCapacity: editCubicCapacity[0],
				cubicCapacityUnits: editCubicCapacity[1],
				interiorLength: editInteriorLength[0],
				interiorLengthUnits: editInteriorLength[1],
				interiorWidth: editInteriorWidth[0],
				interiorWidthUnits: editInteriorWidth[1],
				interiorHeight: editInteriorHeight[0],
				interiorHeightUnits: editInteriorHeight[1],
				tareWeight: editTareWeight[0],
				tareWeightUnits: editTareWeight[1],
				maxGrossWeight: editMaxGrossWeight[0],
				maxGrossWeightUnits: editMaxGrossWeight[1],
				tareVolume: editTareVolume[0],
				tareVolumeUnits: editTareVolume[1],
				maxLength: editMaxLength[0],
				maxLengthUnits: editMaxLength[1],
				maxWidth: editMaxWidth[0],
				maxWidthUnits: editMaxWidth[1],
				maxHeight: editMaxHeight[0],
				maxHeightUnits: editMaxHeight[1],
				platformHeight: editRow.platformHeight,
				platformHeightUnits: editRow.platformHeightUnits,
				topDeckHeight: editRow.topDeckHeight,
				topDeckHeightUnits: editRow.topDeckHeightUnits,
				doorWidth: editRow.doorWidth,
				doorWidthUnits: editRow.doorWidthUnits,
				doorHeight: editRow.doorHeight,
				doorHeightUnits: editRow.doorHeightUnits,
				doorLength: editRow.doorLength,
				doorLengthUnits: editRow.doorLengthUnits,
				avgCost: editRow.avgCost,
				downtimeStart: editRow.downtimeStart,
				downtimeEnd: editRow.downtimeEnd,
				downtimeLocation: editRow.downtimeLocation,
				downtimeDescription: editRow.downtimeDescription,
				downtimeReason: editRow.downtimeReason,
			}));
		}
	}, [editRow]);

	const rows = vehiclesMaster?.map((vehicle: VehicleDetails) => ({
		id: vehicle?.veh_id,
		vehicleId: vehicle.vehicle_ID,
		locationId: vehicle.loc_ID,
		timeZone: vehicle.time_zone,
		unlimitedUsage: vehicle?.unlimited_usage,
		individualResources: vehicle.individual_resource,
		validityFrom: vehicle.transportation_details.validity_from,
		validityTo: vehicle.transportation_details.validity_to,
		vehicleType: vehicle.transportation_details.vehicle_type,
		vehicleGroup: vehicle.transportation_details.vehicle_group,
		ownership: vehicle.transportation_details.ownership,

		payloadWeight: `${vehicle?.capacity?.payload_weight} ${vehicle?.capacity?.payload_weight_unit}`,
		cubicCapacity: `${vehicle?.capacity?.cubic_capacity} ${vehicle?.capacity?.cubic_capacity_unit}`,
		interiorLength: vehicle?.capacity?.interior_length,
		interiorWidth: vehicle?.capacity?.interior_width,
		interiorHeight: vehicle?.capacity?.interior_height,

		tareWeight: vehicle?.physical_properties?.tare_weight,
		maxGrossWeight: vehicle?.physical_properties?.max_gross_weight,
		tareVolume: vehicle?.physical_properties?.tare_volume,
		maxLength: vehicle?.physical_properties?.max_length,
		maxWidth: vehicle?.physical_properties?.max_width,
		maxHeight: vehicle?.physical_properties?.max_height,

		platformHeight: vehicle.platformHeight,
		topDeckHeight: vehicle.topDeckHeight,
		doorWidth: vehicle.doorWidth,
		doorHeight: vehicle.doorHeight,
		doorLength: vehicle.doorLength,

		avgCost: vehicle.additional_details.cost_per_ton,

		downtimeStart: vehicle?.downtimes?.downtime_starts_from,
		downtimeEnd: vehicle?.downtimes?.downtime_ends_from,
		downtimeLocation: vehicle?.downtimes?.downtime_location,
		downtimeDescription: vehicle?.downtimes?.downtime_desc,
		downtimeReason: vehicle?.downtimes?.reason,
	}));

	const columns: GridColDef[] = [
		{ field: "vehicleId", headerName: "Vehicle ID", width: 150 },
		{ field: "locationId", headerName: "Location ID", width: 150 },
		{ field: "timeZone", headerName: "Time Zone", width: 150 },
		{
			field: "unlimitedUsage",
			headerName: "Unlimited Usage",
			width: 150,
			type: "boolean",
		},
		{
			field: "individualResources",
			headerName: "Individual Resources",
			width: 200,
		},
		{ field: "validityFrom", headerName: "Validity From", width: 150 },
		{ field: "validityTo", headerName: "Validity To", width: 150 },
		{ field: "vehicleType", headerName: "Vehicle Type", width: 150 },
		{ field: "vehicleGroup", headerName: "Vehicle Group", width: 150 },
		{ field: "ownership", headerName: "Ownership", width: 150 },
		{ field: "payloadWeight", headerName: "Payload Weight", width: 150 },
		{ field: "cubicCapacity", headerName: "Cubic Capacity", width: 150 },
		{ field: "interiorLength", headerName: "Interior Length", width: 150 },
		{ field: "interiorWidth", headerName: "Interior Width", width: 150 },
		{ field: "interiorHeight", headerName: "Interior Height", width: 150 },
		{ field: "tareWeight", headerName: "Tare Weight", width: 150 },
		{ field: "maxGrossWeight", headerName: "Max Gross Weight", width: 150 },
		{ field: "tareVolume", headerName: "Tare Volume", width: 150 },
		{ field: "maxLength", headerName: "Max Length", width: 150 },
		{ field: "maxWidth", headerName: "Max Width", width: 150 },
		{ field: "maxHeight", headerName: "Max Height", width: 150 },
		// { field: "platformHeight", headerName: "Platform Height", width: 150 },
		// { field: "topDeckHeight", headerName: "Top Deck Height", width: 150 },
		// { field: "doorWidth", headerName: "Door Width", width: 150 },
		// { field: "doorHeight", headerName: "Door Height", width: 150 },
		// { field: "doorLength", headerName: "Door Length", width: 150 },
		{ field: "downtimeStart", headerName: "Downtime Start", width: 150 },
		{ field: "downtimeEnd", headerName: "Downtime End", width: 150 },
		{ field: "downtimeLocation", headerName: "Downtime Location", width: 200 },
		{
			field: "downtimeDescription",
			headerName: "Downtime Description",
			width: 250,
		},
		{ field: "downtimeReason", headerName: "Downtime Reason", width: 200 },
		{ field: "avgCost", headerName: "Average Cost", width: 150 },
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

	const handleSubmit = async (
		values: VehicleFormValues,
		{ resetForm }: { resetForm: () => void }
	) => {
		console.log("Form submitted with values:", values);

		try {
			const body = {
				vehicles: [
					{
						loc_ID: values.locationId,
						unlimited_usage: `${values.unlimitedUsage ? 1 : 0}` ,
						individual_resource: values.individualResources,
						transportation_details: {
							validity_from: values.validityFrom,
							validity_to: values.validityTo,
							vehicle_type: values.vehicleType,
							vehicle_group: values.vehicleGroup,
							ownership: values.ownership,
						},
						capacity: {
							payload_weight: values.payloadWeight,
							cubic_capacity: values.cubicCapacity,
							payload_weight_unit: values.payloadWeightUnits,
							cubic_capacity_unit: values.cubicCapacityUnits,
							interior_length: `${values.interiorLength} ${values.interiorLengthUnits}`,
							interior_width: `${values.interiorWidth} ${values.interiorWidthUnits}`,
							interior_height: `${values.interiorHeight} ${values.interiorHeightUnits}`,
						},
						physical_properties: {
							tare_weight: `${values.tareWeight} ${values.tareWeightUnits}`,
							max_gross_weight: `${values.maxGrossWeight} ${values.maxGrossWeightUnits}`,
							tare_volume: `${values.tareVolume} ${values.tareVolumeUnits}`,
							max_length: `${values.maxLength} ${values.maxLengthUnits}`,
							max_width: `${values.maxWidth} ${values.maxWidthUnits}`,
							max_height: `${values.maxHeight} ${values.maxHeightUnits}`,
						},
						downtimes: {
							downtime_starts_from: values.downtimeStart,
							downtime_ends_from: values.downtimeEnd,
							downtime_location: values.downtimeLocation,
							downtime_desc: values.downtimeDescription,
							reason: values.downtimeReason,
						},
						vehicle_group: {
							vehicle_group_desc: values.vehicleGroup,
							vehicle_type: values.vehicleType,
						},
						additional_details: {
							cost_per_ton: values.avgCost,
						},
					},
				],
			};
			const editBody = {
				loc_ID: values.locationId,
				unlimited_usage: `${values.unlimitedUsage ? 1 : 0}`,
				individual_resource: values.individualResources,
				transportation_details: {
					validity_from: values.validityFrom,
					validity_to: values.validityTo,
					vehicle_type: values.vehicleType,
					vehicle_group: values.vehicleGroup,
					ownership: values.ownership,
				},
				capacity: {
					payload_weight: values.payloadWeight,
					cubic_capacity: values.cubicCapacity,
					payload_weight_unit: values.payloadWeightUnits,
					cubic_capacity_unit: values.cubicCapacityUnits,
					interior_length: `${values.interiorLength} ${values.interiorLengthUnits}`,
					interior_width: `${values.interiorWidth} ${values.interiorWidthUnits}`,
					interior_height: `${values.interiorHeight} ${values.interiorHeightUnits}`,
				},
				physical_properties: {
					tare_weight: `${values.tareWeight} ${values.tareWeightUnits}`,
					max_gross_weight: `${values.maxGrossWeight} ${values.maxGrossWeightUnits}`,
					tare_volume: `${values.tareVolume} ${values.tareVolumeUnits}`,
					max_length: `${values.maxLength} ${values.maxLengthUnits}`,
					max_width: `${values.maxWidth} ${values.maxWidthUnits}`,
					max_height: `${values.maxHeight} ${values.maxHeightUnits}`,
				},
				downtimes: {
					downtime_starts_from: values.downtimeStart,
					downtime_ends_from: values.downtimeEnd,
					downtime_location: values.downtimeLocation,
					downtime_desc: values.downtimeDescription,
					reason: values.downtimeReason,
				},
				vehicle_group: {
					vehicle_group_desc: values.vehicleGroup,
					vehicle_type: values.vehicleType,
				},
				additional_details: {
					cost_per_ton: values.avgCost,
				},
			};
			if (isEditing && editRow) {
				console.log("edit body is :", editBody);
				const vehicleId = editRow.id;
				console.log("vehicle id :", vehicleId);
				const response = await editVehicle({
					body: editBody,
					vehicleId,
				}).unwrap();
				console.log("edit response is ", response);
				 if (response?.updated_record) {
                  setSnackbarMessage(`Vehicle ID ${response.updated_record} updated successfully!`);
                  resetForm();
                  setShowForm(false)
                  setIsEditing(false)
                  setSnackbarSeverity("success");
                  setSnackbarOpen(true);
                }

			} else {
				console.log("post create vehicle ", body);
				const response = await postVehicle(body).unwrap();
				console.log("response in post vehicle:", response);
				if (response?.created_records) {
                    setSnackbarMessage(`Device ID ${response.created_records[0]} created successfully!`);
                     resetForm();
                setShowForm(false)
                setIsEditing(false)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                  }
				 
			}
		} catch (error) {
			console.error("API Error:", error);
			setSnackbarMessage("Something went wrong! please try again");
            setSnackbarSeverity("error");
			setSnackbarOpen(true);
			setShowForm(false);
			resetForm();
			setIsEditing(false)
		}
	};

	const handleEdit = (row: VehicleFormValues) => {
		console.log("Edit row:", row);
		setShowForm(true);
		setIsEditing(true);
		setEditRow(row);
	};
	const handleDelete = async (row: VehicleDetails) => {
  const vehicleId = row?.id;
  if (!vehicleId) {
    console.error("Row ID is missing");
    setSnackbarMessage("Error: Vehicle ID is missing!");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
  if (!confirmed) {
    console.log("Delete canceled by user.");
    return;
  }

  try {
    const response = await deleteVehicle(vehicleId);
    console.log("Delete response:", response);
if (response.data.deleted_record) {
          setSnackbarMessage(`Vehicle ID ${response.data.deleted_record} deleted successfully!`);
          setSnackbarSeverity("info");
          setSnackbarOpen(true);
      }
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    setSnackbarMessage("Failed to delete vehicle. Please try again.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};

  	const handleLocationChange = (
		event: SelectChangeEvent<string>,
		setFieldValue: FormikProps<{ locationId: string; timeZone: string }>['setFieldValue']
		) => {
		const selectedLocation = event.target.value;
		setFieldValue('locationId', selectedLocation);
		const matchedLocation = getAllLocations?.find((loc: Location) => loc.loc_ID === selectedLocation);
		setFieldValue("timeZone", matchedLocation ? matchedLocation?.time_zone : "");
	};

	return (
		<>
			<Backdrop
				sx={{
					color: "#ffffff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={postVehicleLoading || editVehicleLoading || deleteVehicleLoading}
			>
				<CircularProgress color="inherit" />
				     
			</Backdrop>
			<SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

			<Box>
				<Typography
					align="center"
					sx={{ fontWeight: "bold", fontSize: { xs: "20px", md: "24px" } }}
					gutterBottom
				>
					Vehicle master
				</Typography>
				<Box display="flex" justifyContent="flex-end">
					<Box>
						<Button
							variant="contained"
							onClick={() => setShowForm((prev) => !prev)}
							className={styles.createButton}
						>
							Create Vehicle
							{showForm ? (
								<KeyboardArrowUpIcon style={{ marginLeft: 4 }} />
							) : (
								<KeyboardArrowDownIcon style={{ marginLeft: 4 }} />
							)}
						</Button>
					</Box>
					<MassUpload arrayKey="vehicles" />
				</Box>
				<Collapse in={showForm}>
					<Box
						marginBottom={4}
						padding={2}
						border="1px solid #ccc"
						borderRadius={2}
					>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							enableReinitialize={true}
							onSubmit={handleSubmit}
						>
							{({
								values,
								errors,
								touched,
								handleChange,
								handleBlur,
								setFieldValue,
							}) => (
								<Form>
									<Grid>
										{/* General Data */}
										<Typography variant="h6" mt={1} mb={1}>
											1. General Data
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													label="Vehicle ID (Auto generated)"
													name="vehicleId"
													value={values.vehicleId}
													onChange={handleChange}
													onBlur={handleBlur}
													size="small"
													disabled
												/>
											</Grid>
												<Grid item xs={12} sm={6} md={2.4}>
																<FormControl fullWidth size="small" error={touched.locationId && Boolean(errors.locationId)}>
																<InputLabel>Location ID</InputLabel>
																<Select
																label="Location ID"
																name="locations"
																value={values.locationId || ''}
																onChange={(event) => handleLocationChange(event, setFieldValue)}
																onBlur={handleBlur}
																>
							{isLocationLoading ? (
								<MenuItem disabled>
								  <CircularProgress size={20} color="inherit" />
								  <span style={{ marginLeft: "10px" }}>Loading...</span>
								</MenuItem>
							  ) : (
								getAllLocations?.map((location: Location) => (
								  <MenuItem key={location.loc_ID} value={String(location.loc_ID)}>
									<Tooltip
									  title={`${location.address_1}, ${location.address_2}, ${location.city}, ${location.state}, ${location.country}, ${location.pincode}`}
									  placement="right"
									>
									  <span style={{ flex: 1 }}>{location.loc_ID}</span>
									</Tooltip>
								  </MenuItem>
								))
							  )}
													</Select>
																{touched.locationId && errors.locationId && (
													<FormHelperText>{errors.locationId}</FormHelperText>
													)}
												</FormControl>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													disabled
													label="Time Zone"
													name="timeZone"
													value={values.timeZone}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.timeZone && Boolean(errors.timeZone)}
													helperText={touched.timeZone && errors.timeZone}
													size="small"
												/>
											</Grid>
											{/* <Grid item xs={12}>
												<FormControlLabel
													control={
														<Checkbox
															checked={values.unlimitedUsage}
															onChange={(e) =>
																handleChange({
																	target: {
																		name: "unlimitedUsage",
																		value: e.target.checked,
																	},
																})
															}
														/>
													}
													label="Unlimited Usage"
												/>
											</Grid>
											{!values.unlimitedUsage && (
												<Grid item xs={12} sm={6} md={2.4}>
													<TextField
														fullWidth
														label="Individual Resources"
														name="individualResources"
														type="number"
														value={values.individualResources}
														onChange={handleChange}
														onBlur={handleBlur}
														size="small"
													/>
												</Grid>
											)} */}
								<Grid item xs={12}>
									<FormControlLabel
									control={
    <Checkbox
      checked={values.unlimitedUsage}
      onChange={(e) => {
        const checked = e.target.checked;
        setFieldValue("unlimitedUsage", checked);
        if (checked) {
          setFieldValue("individualResources", ""); // Ensures controlled input
        }
      }}
    />
  }
  label="Unlimited Usage"
												/>
								</Grid>

								{!values.unlimitedUsage && (
								<Grid item xs={12} sm={6} md={2.4}>
									<TextField
									fullWidth
									label="Individual Resources"
									name="individualResources"
									type="number"
									value={values.individualResources ?? ""} // Ensures controlled component
									onChange={handleChange}
									onBlur={handleBlur}
									size="small"
									error={touched.individualResources && Boolean(errors.individualResources)}
									helperText={touched.individualResources && errors.individualResources}
									/>
								</Grid>
								)}


										</Grid>

										{/* Transportation Details */}
										<Typography variant="h6" mt={3} mb={1}>
											2. Transportation Details
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													size="small"
													label="Validity From"
													name="validityFrom"
													type="date"
													value={
														values.validityFrom
															? values.validityFrom
																	.split("-")
																	.reverse()
																	.join("-")
															: ""
													}
													onChange={(e) => {
														const selectedDate = e.target.value;
														const formattedDate = selectedDate
															.split("-")
															.reverse()
															.join("-");
														handleChange({
															target: {
																name: "validityFrom",
																value: formattedDate,
															},
														});
													}}
													onBlur={handleBlur}
													error={
														touched.validityFrom &&
														Boolean(errors.validityFrom)
													}
													helperText={
														touched.validityFrom && errors.validityFrom
													}
													InputLabelProps={{ shrink: true }}
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													size="small"
													label="Validity To"
													name="validityTo"
													type="date"
													value={
														values.validityTo
															? values.validityTo
																	.split("-")
																	.reverse()
																	.join("-")
															: ""
													}
													onChange={(e) => {
														const selectedDate = e.target.value;
														const formattedDate = selectedDate
															.split("-")
															.reverse()
															.join("-");
														handleChange({
															target: {
																name: "validityTo",
																value: formattedDate,
															},
														});
													}}
													onBlur={handleBlur}
													error={
														touched.validityTo &&
														Boolean(errors.validityTo)
													}
													helperText={
														touched.validityTo && errors.validityTo
													}
													InputLabelProps={{ shrink: true }}
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													select
													fullWidth
													label="Vehicle Type"
													name="vehicleType"
													value={values.vehicleType}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.vehicleType && Boolean(errors.vehicleType)
													}
													helperText={touched.vehicleType && errors.vehicleType}
													size="small"
												>
													<MenuItem value="Truck">Van</MenuItem>
													<MenuItem value="Truck">Truck</MenuItem>
													<MenuItem value="Trailer">Trailer</MenuItem>
													<MenuItem value="Container">Container</MenuItem>
												</TextField>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													label="Vehicle Group"
													name="vehicleGroup"
													value={values.vehicleGroup}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.vehicleGroup && Boolean(errors.vehicleGroup)
													}
													helperText={
														touched.vehicleGroup && errors.vehicleGroup
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													select
													fullWidth
													label="Ownership"
													name="ownership"
													value={values.ownership}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.ownership && Boolean(errors.ownership)}
													helperText={touched.ownership && errors.ownership}
													size="small"
												>
													<MenuItem value="Self">Self</MenuItem>
													<MenuItem value="Carrier">Carrier</MenuItem>
												</TextField>
											</Grid>
										</Grid>

										{/* Capacity */}
										<Typography variant="h6" mt={3} mb={1}>
											3. Capacity
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Payload Weight"
													name="payloadWeight"
													type="number"
													value={values.payloadWeight}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.payloadWeight &&
														Boolean(errors.payloadWeight)
													}
													helperText={
														touched.payloadWeight && errors.payloadWeight
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													name="payloadWeightUnits"
													select
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.payloadWeightUnits}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Cubic Capacity */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Cubic Capacity"
													name="cubicCapacity"
													type="number"
													value={values.cubicCapacity}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.cubicCapacity &&
														Boolean(errors.cubicCapacity)
													}
													helperText={
														touched.cubicCapacity && errors.cubicCapacity
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													name="cubicCapacityUnits"
													value={values.cubicCapacityUnits}
													onChange={handleChange}
													onBlur={handleBlur}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Interior Length */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Interior Length"
													name="interiorLength"
													type="number"
													value={values.interiorLength}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.interiorLength &&
														Boolean(errors.interiorLength)
													}
													helperText={
														touched.interiorLength && errors.interiorLength
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="interiorLengthUnits"
													value={values.interiorLengthUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Interior Width */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Interior Width"
													name="interiorWidth"
													type="number"
													value={values.interiorWidth}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.interiorWidth &&
														Boolean(errors.interiorWidth)
													}
													helperText={
														touched.interiorWidth && errors.interiorWidth
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="interiorWidthUnits"
													value={values.interiorWidthUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Interior Height */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Interior Height"
													name="interiorHeight"
													type="number"
													value={values.interiorHeight}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.interiorHeight &&
														Boolean(errors.interiorHeight)
													}
													helperText={
														touched.interiorHeight && errors.interiorHeight
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="interiorHeightUnits"
													value={values.interiorHeightUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>
										</Grid>

										{/* Physical Properties */}
										<Typography variant="h6" mt={3} mb={1}>
											4. Physical Properties
										</Typography>
										<Grid container spacing={2}>
											{/* Max. Gross Weight */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Max. Gross Weight"
													name="maxGrossWeight"
													type="number"
													value={values.maxGrossWeight}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.maxGrossWeight &&
														Boolean(errors.maxGrossWeight)
													}
													helperText={
														touched.maxGrossWeight && errors.maxGrossWeight
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="maxGrossWeightUnits"
													value={values.maxGrossWeightUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Tare Weight */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Tare Weight"
													name="tareWeight"
													type="number"
													value={values.tareWeight}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.tareWeight && Boolean(errors.tareWeight)
													}
													helperText={touched.tareWeight && errors.tareWeight}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="tareWeightUnits"
													value={values.tareWeightUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Tare Volume */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Tare Volume"
													name="tareVolume"
													type="number"
													value={values.tareVolume}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.tareVolume && Boolean(errors.tareVolume)
													}
													helperText={touched.tareVolume && errors.tareVolume}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="tareVolumeUnits"
													value={values.tareVolumeUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Max. Length */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Max. Length"
													name="maxLength"
													type="number"
													value={values.maxLength}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.maxLength && Boolean(errors.maxLength)}
													helperText={touched.maxLength && errors.maxLength}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="maxLengthUnits"
													value={values.maxLengthUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Max. Width */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Max. Width"
													name="maxWidth"
													type="number"
													value={values.maxWidth}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.maxWidth && Boolean(errors.maxWidth)}
													helperText={touched.maxWidth && errors.maxWidth}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="maxWidthUnits"
													value={values.maxWidthUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>

											{/* Max. Height */}
											<Grid item xs={12} sm={6} md={1.6}>
												<TextField
													fullWidth
													label="Max. Height"
													name="maxHeight"
													type="number"
													value={values.maxHeight}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.maxHeight && Boolean(errors.maxHeight)}
													helperText={touched.maxHeight && errors.maxHeight}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={0.8}>
												<TextField
													fullWidth
													select
													onBlur={handleBlur}
													name="maxHeightUnits"
													value={values.maxHeightUnits || ""}
													onChange={handleChange}
													size="small"
												>
													{unitsofMeasurement.map((unit) => (
														<MenuItem key={unit} value={unit}>
															{unit}
														</MenuItem>
													))}
												</TextField>
											</Grid>
										</Grid>

										{/* Downtimes */}
										<Typography variant="h6" mt={3} mb={1}>
											5. Downtimes
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													size="small"
													label="Start From"
													name="downtimeStart"
													type="date"
													value={
														values.downtimeStart
															? values.downtimeStart
																	.split("-")
																	.reverse()
																	.join("-")
															: ""
													}
													onChange={(e) => {
														const selectedDate = e.target.value;
														const formattedDate = selectedDate
															.split("-")
															.reverse()
															.join("-");
														handleChange({
															target: {
																name: "downtimeStart",
																value: formattedDate,
															},
														});
													}}
													onBlur={handleBlur}
													error={
														touched.downtimeStart &&
														Boolean(errors.downtimeStart)
													}
													helperText={
														touched.downtimeStart && errors.downtimeStart
													}
													InputLabelProps={{ shrink: true }}
												/>
											</Grid>

												<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													size="small"
													label="Ends at"
													name="downtimeEnd"
													type="date"
													value={
														values.downtimeEnd
															? values.downtimeEnd
																	.split("-")
																	.reverse()
																	.join("-")
															: ""
													}
													onChange={(e) => {
														const selectedDate = e.target.value;
														const formattedDate = selectedDate
															.split("-")
															.reverse()
															.join("-");
														handleChange({
															target: {
																name: "downtimeEnd",
																value: formattedDate,
															},
														});
													}}
													onBlur={handleBlur}
													error={
														touched.downtimeEnd &&
														Boolean(errors.downtimeEnd)
													}
													helperText={
														touched.downtimeEnd && errors.downtimeEnd
													}
													InputLabelProps={{ shrink: true }}
												/>
											</Grid>

											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													label="Location"
													name="downtimeLocation"
													value={values.downtimeLocation}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.downtimeLocation &&
														Boolean(errors.downtimeLocation)
													}
													helperText={
														touched.downtimeLocation && errors.downtimeLocation
													}
													size="small"
												/>
											</Grid>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													label="Description"
													name="downtimeDescription"
													value={values.downtimeDescription}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.downtimeDescription &&
														Boolean(errors.downtimeDescription)
													}
													helperText={
														touched.downtimeDescription &&
														errors.downtimeDescription
													}
													size="small"
												/>
											</Grid>

											{/* Reason */}
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													select
													label="Reason"
													name="downtimeReason"
													value={values.downtimeReason}
													onChange={handleChange}
													onBlur={handleBlur}
													error={
														touched.downtimeReason &&
														Boolean(errors.downtimeReason)
													}
													helperText={
														touched.downtimeReason && errors.downtimeReason
													}
													size="small"
												>
													{downtimeReasons.map((reason) => (
														<MenuItem key={reason} value={reason}>
															{reason}
														</MenuItem>
													))}
												</TextField>
											</Grid>
										</Grid>

										{/* Additional Details */}
										<Typography variant="h5" mt={3}>
											6. Additional Details
										</Typography>
										<Grid container spacing={2}>
											<Grid item xs={12} sm={6} md={2.4}>
												<TextField
													fullWidth
													label="Avg. Cost of Transportation (Price Per Ton)"
													name="avgCost"
													type="number"
													value={values.avgCost}
													onChange={handleChange}
													onBlur={handleBlur}
													error={touched.avgCost && Boolean(errors.avgCost)}
													helperText={touched.avgCost && errors.avgCost}
													size="small"
												/>
											</Grid>
										</Grid>

										<Box mt={3} textAlign="center">
											<Button variant="contained" color="primary" type="submit">
												{isEditing ? "Update vehicle" : "Create vehicle"}
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												onClick={() => {
													setInitialValues(initialFormValues);
													setIsEditing(false);
													setEditRow(null);
												}}
												style={{ marginLeft: "10px" }}
											>
												Reset
											</Button>
										</Box>
									</Grid>
								</Form>
							)}
						</Formik>
					</Box>
				</Collapse>
			</Box>

			{/* Data grid */}
			<div style={{ marginTop: "40px" }}>
				{isLoading ? (
					<DataGridSkeletonLoader columns={columns} />
				) : (
						<DataGridComponent
							columns={columns}
							rows={rows}
							isLoading={isLoading}
							paginationModel={paginationModel}
							activeEntity="vehicles"
							onPaginationModelChange={handlePaginationModelChange}
						/>
				)}
			</div>
		</>
	);
};

export default VehicleForm;
