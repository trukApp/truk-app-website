import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
	Button,
	Box,
	Grid,
	Collapse,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	TextField,
	IconButton,
	Backdrop,
	CircularProgress,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { DataGridNoPagination } from "../GridComponent";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "./MasterData.module.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	useDeleteUomMasterMutation,
	useEditUomMasterMutation,
	useGetUomMasterQuery,
	usePostUomMasterMutation,
} from "@/api/apiSlice";
import DataGridSkeletonLoader from "../ReusableComponents/DataGridSkeletonLoader";
import SnackbarAlert from "../ReusableComponents/SnackbarAlerts";

interface FormValues {
	unitName: string;
	unitDescription: string;
	altUnit: string;
	altUnitDescription: string;
	id: string;
}
interface unitTypesBE {
	unit_name: string;
	unit_desc: string;
	alt_unit_name: string;
	alt_unit_desc: string;
	unit_id: string;
}

// Mapping for units and their alternate units
// const unitMappings: Record<string, string[]> = {
// 	// Weight Units
// 	Ton: ["Kilogram", "Gram", "Milligram"],
// 	Kilogram: ["Gram", "Milligram"],
// 	Gram: ["Milligram"],

// 	// Volume Units
// 	CubicKilometer: [
// 		"Cubic Meter",
// 		"Cubic Decimeter",
// 		"Cubic Centimeter",
// 		"Cubic Millimeter",
// 	],
// 	CubicMeter: ["Cubic Decimeter", "Cubic Centimeter", "Cubic Millimeter"],
// 	CubicDecimeter: ["Cubic Centimeter", "Cubic Millimeter"],
// 	CubicCentimeter: ["Cubic Millimeter"],
// 	CubicMillimeter: [],

// 	Liter: ["Millilitre"],

// 	Gallon: ["Liter", "Millilitre"],
// 	Quart: ["Liter", "Millilitre"],
// 	Pint: ["Liter", "Millilitre"],
// 	FluidOunce: ["Millilitre"],

// 	CubicFoot: ["Cubic Inch", "Cubic Centimeter"],
// 	CubicInch: ["Cubic Centimeter"],

// 	// Length Units
// 	Kilometer: ["Meter", "Decimeter", "Centimeter", "Millimeter"],
// 	Meter: ["Decimeter", "Centimeter", "Millimeter"],
// 	Decimeter: ["Centimeter", "Millimeter"],
// 	Centimeter: ["Millimeter", "Micrometer"],

// 	Mile: ["Kilometer", "Meter"],
// 	Yard: ["Meter", "Centimeter"],
// 	Foot: ["Inch", "Centimeter", "Millimeter"],
// 	Inch: ["Centimeter", "Millimeter"],

// 	// Time Units
// 	Hour: ["Minute", "Second"],
// 	Minute: ["Second"],
// 	Second: ["Millisecond"],
// 	Millisecond: ["Microsecond", "Nanosecond"],
// };

const unitMappings: Record<string, string[]> = {
	// Weight Units
	"ton": ["kg", "g", "mg"],  // Ton to Kilogram, Gram, Milligram
	"kg": ["g", "mg"],        // Kilogram to Gram, Milligram
	"g": ["mg"],              // Gram to Milligram

	// Volume Units
	"km^3": ["m^3", "dm^3", "cm^3", "mm^3"],  // Cubic Kilometer conversions
	"m^3": ["dm^3", "cm^3", "mm^3"],         // Cubic Meter conversions
	"dm^3": ["cm^3", "mm^3"],               // Cubic Decimeter conversions
	"cm^3": ["mm^3"],                      // Cubic Centimeter to Millimeter
	"mm^3": [],                            // Smallest unit

	"L": ["mL"],  // Liter to Millilitre
	"gal": ["L", "mL"],  // Gallon to Liter, Millilitre
	"qt": ["L", "mL"],   // Quart to Liter, Millilitre
	"pt": ["L", "mL"],   // Pint to Liter, Millilitre
	"fl oz": ["mL"],     // Fluid Ounce to Millilitre

	"ft^3": ["in^3", "cm^3"],  // Cubic Foot conversions
	"in^3": ["cm^3"],         // Cubic Inch to Centimeter

	// Length Units
	"km": ["m", "dm", "cm", "mm"],  // Kilometer to smaller units
	"m": ["dm", "cm", "mm"],        // Meter to smaller units
	"dm": ["cm", "mm"],             // Decimeter conversions
	"cm": ["mm", "µm"],             // Centimeter to Millimeter, Micrometer

	"mi": ["km", "m"],  // Mile conversions
	"yd": ["m", "cm"],  // Yard conversions
	"ft": ["in", "cm", "mm"],  // Foot conversions
	"in": ["cm", "mm"],        // Inch conversions

	// Time Units
	"h": ["min", "s"],     // Hour to Minutes, Seconds
	"min": ["s"],          // Minute to Seconds
	"s": ["ms"],           // Second to Millisecond
	"ms": ["µs", "ns"],    // Millisecond to Microsecond, Nanosecond
};



const UnitsOfMeasurement: React.FC = () => {
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
	const [showForm, setShowForm] = useState(false);
	const [altUnitOptions, setAltUnitOptions] = useState<string[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editRow, setEditRow] = useState<FormValues | null>(null);
	const { data, error, isLoading } = useGetUomMasterQuery([]);
	const [postUom, { isLoading: postUomLoading }] = usePostUomMasterMutation();
	const [editUom, { isLoading: editUomLoading }] = useEditUomMasterMutation();
	const [deleteUom, { isLoading: deleteUomLoading }] =
		useDeleteUomMasterMutation();

	if (error) {
		console.error("Error fetching uom:", error);
		// Handle the error case
	}
	const validationSchema = Yup.object({
		unitName: Yup.string().required("Unit Name is required"),
		unitDescription: Yup.string().required("Unit Description is required"),
		altUnit: Yup.string().required("Alt. Unit is required"),
		altUnitDescription: Yup.string().required(
			"Alt. Unit Description is required"
		),
	});

	const initialFormValues = {
		id: "",
		unitName: "",
		unitDescription: "",
		altUnit: "",
		altUnitDescription: "",
	};
	const [initialValues, setInitialValues] = useState(initialFormValues);
	useEffect(() => {
		if (editRow) {
			setInitialValues(() => ({
				id: "",
				unitName: editRow?.unitName,
				unitDescription: editRow?.unitDescription,
				altUnit: editRow?.altUnit,
				altUnitDescription: editRow.altUnitDescription,
			}));
			setAltUnitOptions(unitMappings[editRow.unitName] || []);
		}
	}, [editRow]);
	const handleUnitNameChange = (
		unitName: string,
		setFieldValue: (
			field: keyof FormValues,
			value: FormValues[keyof FormValues]
		) => void
	) => {
		setFieldValue("unitName", unitName);
		setAltUnitOptions(unitMappings[unitName] || []);
		setFieldValue("altUnit", "");
	};

	const handleSubmit = async (
		values: FormValues,
		{ resetForm }: { resetForm: () => void }
	) => {
		try {
			const body = {
				unit_name: values.unitName,
				unit_desc: values.unitDescription,
				alt_unit_name: values.altUnit,
				alt_unit_desc: values.altUnitDescription,
			};
			const editBody = {
				unit_name: values.unitName,
				unit_desc: values.unitDescription,
				alt_unit_name: values.altUnit,
				alt_unit_desc: values.altUnitDescription,
			};
			if (isEditing && editRow) {
				const uomId = editRow.id;
				const response = await editUom({ body: editBody, uomId }).unwrap();
				console.log("edit uom response is ", response);
				resetForm();
				setShowForm(false);
				setIsEditing(false);
				setInitialValues(initialFormValues);
				setSnackbarMessage("UOM updated successfully!");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			} else {
				const response = await postUom(body).unwrap();
				console.log("response in post uom :", response);
				resetForm();
				setShowForm(false);
				setIsEditing(false);
				setInitialValues(initialFormValues);
				setSnackbarMessage("UOM created successfully!");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("API Error:", error);
			setSnackbarMessage("Something went wrong! please try again.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
			resetForm();
			setShowForm(false);
			setIsEditing(false);
		}
	};
	const rows = data?.uomList.map((unit: unitTypesBE) => ({
		id: unit.unit_id,
		unitName: unit.unit_name,
		unitDescription: unit.unit_desc,
		altUnit: unit.alt_unit_name,
		altUnitDescription: unit.alt_unit_desc,
	}));

	const handleEdit = (row: FormValues) => {
		setShowForm(true);
		setIsEditing(true);
		setEditRow(row);
	};

	const handleDelete = async (row: FormValues) => {
		const uomId = row?.id;
		if (!uomId) {
			console.error("Row ID is missing");
			setSnackbarMessage("Error: UOM ID is missing!");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
			return;
		}

		const confirmed = window.confirm("Are you sure you want to delete this item?");
		if (!confirmed) {
			return;
		}

		try {
			const response = await deleteUom(uomId);
			console.log("Delete response:", response);

			// Show success snackbar
			setSnackbarMessage("UOM deleted successfully!");
			setSnackbarSeverity("success");
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error deleting uom:", error);

			// Show error snackbar
			setSnackbarMessage("Failed to delete UOM. Please try again.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};


	const columns: GridColDef[] = [
		{ field: "unitName", headerName: "Unit Name", width: 150 },
		{ field: "unitDescription", headerName: "Unit Description", width: 300 },
		{ field: "altUnit", headerName: "Alt. Unit", width: 150 },
		{
			field: "altUnitDescription",
			headerName: "Alt. Unit Description",
			width: 300,
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
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

	return (
		<Box p={3}>
			<Backdrop
				sx={{
					color: "#ffffff",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
				open={postUomLoading || editUomLoading || deleteUomLoading}
			>
				<CircularProgress color="inherit" />

			</Backdrop>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				severity={snackbarSeverity}
				onClose={() => setSnackbarOpen(false)}
			/>
			<Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
				<Button 
					onClick={() => setShowForm((prev) => !prev)}
					className={styles.createButton}
				>
					Create Unit
					{showForm ? (
						<KeyboardArrowUpIcon style={{ marginLeft: 8 }} />
					) : (
						<KeyboardArrowDownIcon style={{ marginLeft: 8 }} />
					)}
				</Button>
			</Box>

			<Collapse in={showForm}>
				<Box
					marginBottom={4}
					padding={4}
					border="1px solid #ccc"
					borderRadius={2}
				>
					<Formik
						initialValues={initialValues}
						enableReinitialize={true}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}

					>
						{({
							handleChange,
							handleBlur,
							setFieldValue,
							values,
							touched,
							errors,
							resetForm
						}) => (
							<Form>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={2.4}>
										<FormControl fullWidth size="small">
											<InputLabel>Unit Name*</InputLabel>
											<Select
												name="unitName"
												label="Unit Name*"
												value={values.unitName}
												onChange={(e) => {
													handleUnitNameChange(e.target.value, setFieldValue);
													handleChange(e);
												}}
												onBlur={handleBlur}
												error={touched.unitName && Boolean(errors.unitName)}
											>
												{Object.keys(unitMappings).map((unit) => (
													<MenuItem key={unit} value={unit}>
														{unit}
													</MenuItem>
												))}
											</Select>
											<Box sx={{ color: "red", fontSize: "12px" }}>
												<ErrorMessage name="unitName" />
											</Box>
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={6} md={2.4}>
										<TextField
											fullWidth
											size="small"
											label="Unit Description*"
											name="unitDescription"
											value={values.unitDescription}
											onChange={handleChange}
											onBlur={handleBlur}
											variant="outlined"
											error={
												touched.unitDescription &&
												Boolean(errors.unitDescription)
											}
											helperText={<ErrorMessage name="unitDescription" />}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={2.4}>
										<FormControl fullWidth size="small">
											<InputLabel>Alt. Unit*</InputLabel>
											<Select
												name="altUnit"
												label="Alt. Unit*"
												value={values.altUnit}
												onChange={handleChange}
												onBlur={handleBlur}
												error={touched.altUnit && Boolean(errors.altUnit)}
												disabled={altUnitOptions.length === 0}
											>
												{altUnitOptions.map((altUnit) => (
													<MenuItem key={altUnit} value={altUnit}>
														{altUnit}
													</MenuItem>
												))}
											</Select>
											<Box sx={{ color: "red", fontSize: "12px" }}>
												<ErrorMessage name="altUnit" />
											</Box>
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={6} md={2.4}>
										<TextField
											fullWidth
											size="small"
											label="Alt. Unit Description*"
											name="altUnitDescription"
											value={values.altUnitDescription}
											onChange={handleChange}
											onBlur={handleBlur}
											variant="outlined"
											error={
												touched.altUnitDescription &&
												Boolean(errors.altUnitDescription)
											}
											helperText={<ErrorMessage name="altUnitDescription" />}
										/>
									</Grid>
								</Grid>

								<Box
									display="flex"
									justifyContent="center"
									gap={2}
									style={{ marginTop: "20px" }}
								>
									<Button
										type="submit"
										variant="contained"
										sx={{
											backgroundColor: "#83214F",
											color: "#fff",
											"&:hover": {
												backgroundColor: "#fff",
												color: "#83214F"
											}
										}}
									>
										{isEditing ? "Update UOM" : "Create UOM"}
									</Button>

									<Button
										variant="outlined"
										color="secondary"
										onClick={() => {
											setInitialValues(initialFormValues);
											setIsEditing(false);
											setEditRow(null);
											resetForm()
										}}
										style={{ marginLeft: "10px" }}
									>
										Reset
									</Button>
								</Box>
							</Form>
						)}
					</Formik>
				</Box>
			</Collapse>
			<div style={{ marginTop: "40px" }}>
				{isLoading ? (
					<DataGridSkeletonLoader columns={columns} />
				) : (
					<DataGridNoPagination columns={columns} rows={rows} isLoading={isLoading} />
				)}
			</div>
		</Box>
	);
};

export default UnitsOfMeasurement;
