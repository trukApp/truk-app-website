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
import { DataGridComponent } from "../GridComponent";
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
import DataGridSkeletonLoader from "../LoaderComponent/DataGridSkeletonLoader";

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
const unitMappings: Record<string, string[]> = {
	// Weight Units
	Ton: ["Kilogram", "Gram", "Milligram"],
	Kilogram: ["Gram", "Milligram"],
	Gram: ["Milligram"],

	// Volume Units
	CubicKilometer: [
		"Cubic Meter",
		"Cubic Decimeter",
		"Cubic Centimeter",
		"Cubic Millimeter",
	],
	CubicMeter: ["Cubic Decimeter", "Cubic Centimeter", "Cubic Millimeter"],
	CubicDecimeter: ["Cubic Centimeter", "Cubic Millimeter"],
	CubicCentimeter: ["Cubic Millimeter"],
	CubicMillimeter: [],

	Liter: ["Millilitre"],

	Gallon: ["Liter", "Millilitre"],
	Quart: ["Liter", "Millilitre"],
	Pint: ["Liter", "Millilitre"],
	FluidOunce: ["Millilitre"],

	CubicFoot: ["Cubic Inch", "Cubic Centimeter"],
	CubicInch: ["Cubic Centimeter"],

	// Length Units
	Kilometer: ["Meter", "Decimeter", "Centimeter", "Millimeter"],
	Meter: ["Decimeter", "Centimeter", "Millimeter"],
	Decimeter: ["Centimeter", "Millimeter"],
	Centimeter: ["Millimeter", "Micrometer"],

	Mile: ["Kilometer", "Meter"],
	Yard: ["Meter", "Centimeter"],
	Foot: ["Inch", "Centimeter", "Millimeter"],
	Inch: ["Centimeter", "Millimeter"],

	// Time Units
	Hour: ["Minute", "Second"],
	Minute: ["Second"],
	Second: ["Millisecond"],
	Millisecond: ["Microsecond", "Nanosecond"],
};

const UnitsOfMeasurement: React.FC = () => {
	const [showForm, setShowForm] = useState(false);
	const [altUnitOptions, setAltUnitOptions] = useState<string[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editRow, setEditRow] = useState<FormValues | null>(null);
	const { data, error, isLoading } = useGetUomMasterQuery([]);
	const [postUom, { isLoading: postUomLoading }] = usePostUomMasterMutation();
	const [editUom, { isLoading: editUomLoading }] = useEditUomMasterMutation();
	const [deleteUom, { isLoading: deleteUomLoading }] =
		useDeleteUomMasterMutation();
	console.log("all uom :", data);
	if (isLoading) {
		console.log("Loading uom...");
	}

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
			console.log("uom body: ", body);
			if (isEditing && editRow) {
				console.log("edit uom body is :", editBody);
				const uomId = editRow.id;
				const response = await editUom({ body: editBody, uomId }).unwrap();
				console.log("edit uom response is ", response);
				resetForm();
				setShowForm(false);
				setIsEditing(false);
				setInitialValues(initialFormValues);
			} else {
				console.log("post create uom :", body);
				const response = await postUom(body).unwrap();
				console.log("response in post uom :", response);
				resetForm();
				setShowForm(false);
				setIsEditing(false);
				setInitialValues(initialFormValues);
			}
		} catch (error) {
			console.error("API Error:", error);
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
		console.log("Edit row:", row);
		setShowForm(true);
		setIsEditing(true);
		setEditRow(row);
	};

	const handleDelete = async (row: FormValues) => {
		const uomId = row?.id;
		if (!uomId) {
			console.error("Row ID is missing");
			return;
		}
		const confirmed = window.confirm(
			"Are you sure you want to delete this item?"
		);
		if (!confirmed) {
			console.log("Delete canceled by user.");
			return;
		}

		try {
			const response = await deleteUom(uomId);
			console.log("Delete response:", response);
		} catch (error) {
			console.error("Error deleting uom:", error);
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
			<Box display="flex" justifyContent="flex-end" marginBottom={3} gap={2}>
				<Button
					variant="contained"
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
									<Button type="submit" variant="contained" color="primary">
										{isEditing ? "Update UOM" : "Create UOM"}
									</Button>
									<Button
										variant="contained"
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
							</Form>
						)}
					</Formik>
				</Box>
			</Collapse>
			<div style={{ marginTop: "40px" }}>
				{isLoading ? (
					<DataGridSkeletonLoader columns={columns} />
				) : (
					<DataGridComponent
						columns={columns}
						rows={rows}
						isLoading={false}
						pageSizeOptions={[10, 20, 30]}
						initialPageSize={10}
					/>
				)}
			</div>
		</Box>
	);
};

export default UnitsOfMeasurement;
