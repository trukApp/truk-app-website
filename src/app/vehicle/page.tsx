"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Grid, Box, Typography, Checkbox, FormControlLabel, Button, Collapse, IconButton, Backdrop, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import {
    DataGridNoPagination,
    // DataGridComponent
} from "@/Components/GridComponent";
import {
    // GridPaginationModel,
    GridColDef
} from "@mui/x-data-grid";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useDeleteSingleVehicleMasterMutation, useEditSingleVehicleMasterMutation, useGetSingleVehicleMasterQuery, useGetVehicleMasterQuery, usePostSingleVehicleMasterMutation, } from "@/api/apiSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import MassUpload from "@/Components/MassUpload/MassUpload";
import DataGridSkeletonLoader from "@/Components/ReusableComponents/DataGridSkeletonLoader";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import { VehicleDetails } from "@/Components/MasterDataComponents/Vehicles";
import { withAuthComponent } from "@/Components/WithAuthComponent";
import { useQuery } from "@apollo/client";
import { GET_ALL_VEHICLES } from '@/api/graphqlApiSlice';
export interface TruckFormDetails {
    truckId: string;
    id: string;
    vehicleId: string;
    isAvailable: boolean;
    costing: string;
    insurance: string;
    registration: string;
    permit: string;
    vehicleNumber: string;
}
export interface TruckDetails {
    id: string;
    vehicle_ID: string;
    act_truk_ID: string;
    act_vehicle_num: string;
    available: number;
    costing: string;
    truk_id: string;
    vehicle_docs: {
        insurance: string;
        permit: string;
        registration: string
    }

}
const validationSchema = Yup.object({
    vehicleId: Yup.string().required("Vehicle id is required"),
    vehicleNumber: Yup.string().required("Vehicle number is required"),
    isAvailable: Yup.boolean(),
    costing: Yup.string().required("Cost is required"),
    insurance: Yup.string().required("Insurance is required"),
    registration: Yup.string().required("Registration number is required"),
    permit: Yup.string().required("Permit is required"),

});

const VehicleOnly: React.FC = () => {
    // const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10, });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [isEditing, setIsEditing] = useState(false);
    const [editRow, setEditRow] = useState<TruckFormDetails | null>(null);
    const { data, error, isLoading } = useGetSingleVehicleMasterQuery({
        // page: paginationModel.page + 1, limit: paginationModel.pageSize
    });
    const { data: vehiclesData, isLoading: isVehiclesLoading } = useGetVehicleMasterQuery({});
    const [postVehicle, { isLoading: postVehicleLoading }] = usePostSingleVehicleMasterMutation();
    const [editVehicle, { isLoading: editVehicleLoading }] = useEditSingleVehicleMasterMutation();
    const [deleteVehicle, { isLoading: deleteVehicleLoading }] = useDeleteSingleVehicleMasterMutation();
    console.log('all single vehs  :', data?.data)
    const getAllVehicles = vehiclesData?.vehicles

    if (error) {
        console.log("err in loading vehicles data :", error);
    }
    const vehiclesMaster = data?.data;
    // const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    //     setPaginationModel(newPaginationModel);
    // };

    // graphql API
    const { data: getSingleVehicleMaster, loading: getSingleVehicleMasterLoading, error:Error } = useQuery(GET_ALL_VEHICLES);
    const [showForm, setShowForm] = useState(false);
    const initialFormValues = {
        id: "",
        truckId: "",
        vehicleId: "",
        vehicleNumber: "",
        isAvailable: false,
        costing: "",
        insurance: "",
        registration: "",
        permit: "",
    };

    const [initialValues, setInitialValues] = useState(initialFormValues);
    useEffect(() => {
        if (editRow) {
            console.log('edit row :', editRow);
            setInitialValues({
                id: editRow?.id || "",
                truckId: editRow?.truckId || "",
                vehicleId: editRow?.vehicleId || "",
                vehicleNumber: editRow?.vehicleNumber || "",
                isAvailable: editRow?.isAvailable ?? false,
                costing: editRow?.costing || "",
                insurance: editRow?.insurance || "",
                registration: editRow?.registration || "",
                permit: editRow?.permit || "",
            });
        } else {
            setInitialValues({
                id: "",
                truckId: "",
                vehicleId: "",
                vehicleNumber: "",
                isAvailable: false,
                costing: "",
                insurance: "",
                registration: "",
                permit: "",
            });
        }
    }, [editRow]);


    const rows = vehiclesMaster?.map((vehicle: TruckDetails) => ({
        id: vehicle?.truk_id,
        truckId: vehicle?.act_truk_ID,
        vehicleId: vehicle?.vehicle_ID,
        vehicleNumber: vehicle?.act_vehicle_num,
        isAvailable: vehicle?.available,
        costing: vehicle?.costing,
        insurance: vehicle?.vehicle_docs?.insurance,
        registration: vehicle?.vehicle_docs?.registration,
        permit: vehicle?.vehicle_docs?.permit,
    }));

    const columns: GridColDef[] = [
        { field: "truckId", headerName: "Truck ID", width: 150 },
        { field: "vehicleId", headerName: "Vehicle Id", width: 150 },
        { field: "vehicleNumber", headerName: "Vehicle number", width: 150 },
        { field: "costing", headerName: "Costing", width: 150 },
        { field: "isAvailable", headerName: "Is available", width: 150 },
        { field: "insurance", headerName: "Insurance", width: 150 },
        { field: "registration", headerName: "Registration", width: 150 },
        { field: "permit", headerName: "Permit", width: 150 },
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
        values: TruckFormDetails,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            const body = {
                vehicles: [
                    {
                        vehicle_ID: values.vehicleId,
                        act_vehicle_num: values.vehicleNumber,
                        available: values.isAvailable,
                        costing: values.costing,
                        vehicle_docs: {
                            insurance: values.insurance,
                            registration: values.registration,
                            permit: values.permit
                        }
                    },
                ],
            };
            const editBody = {
                vehicle_ID: values.vehicleId,
                act_vehicle_num: values.vehicleNumber,
                available: values.isAvailable,
                costing: values.costing,
                vehicle_docs: {
                    insurance: values.insurance,
                    registration: values.registration,
                    permit: values.permit
                }
            }
            if (isEditing && editRow) {
                console.log('qwerty')
                const truckId = editRow.id;
                console.log("trucke id to edit :", truckId)
                const response = await editVehicle({
                    body: editBody,
                    truckId,
                }).unwrap();
                console.log("edit response :", response)
                if (response?.updated_record) {
                    setSnackbarMessage(`Vehicle ID ${response.updated_record} updated successfully!`);
                    resetForm();
                    setShowForm(false)
                    setIsEditing(false)
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                }

            } else {
                const response = await postVehicle(body).unwrap();
                console.log("post response :", response)
                if (response?.created_records) {
                    setSnackbarMessage(`Vehicle ID ${response.created_records[0]} created successfully!`);
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

    const handleEdit = (row: TruckFormDetails) => {
        setShowForm(true);
        setIsEditing(true);
        setEditRow(row);
    };
    const handleDelete = async (row: TruckDetails) => {
        const truckId = row?.id;
        if (!truckId) {
            console.error("Row ID is missing");
            setSnackbarMessage("Error: Vehicle ID is missing!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await deleteVehicle(truckId);
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
                            onClick={() => setShowForm((prev) => !prev)} 
                            style={{
                                textTransform: "capitalize",
                                textDecoration: "underline",
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                color: "inherit",
                                fontWeight: "bold"
                            }}
                        >
                            Create Vehicle
                            {showForm ? (
                                <KeyboardArrowUpIcon style={{ marginLeft: 4 }} />
                            ) : (
                                <KeyboardArrowDownIcon style={{ marginLeft: 4 }} />
                            )}
                        </Button>
                    </Box>
                    {/* <MassUpload arrayKey="vehicles" /> */}
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
                                resetForm
                            }) => (
                                <Form>
                                    <Grid>
                                        <Grid container spacing={2}>
                                            {isEditing &&
                                                <Grid item xs={12} sm={6} md={2.4}>
                                                    <TextField
                                                        fullWidth
                                                        label="Truck ID (Auto generated)"
                                                        name="truckId"
                                                        value={values.truckId}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        size="small"
                                                        disabled
                                                    />
                                                </Grid>}
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <FormControl
                                                    fullWidth
                                                    size="small"
                                                    error={touched.vehicleId && Boolean(errors.vehicleId)}
                                                >
                                                    <InputLabel>Vehicle ID</InputLabel>
                                                    <Select
                                                        label="Vehicle ID*"
                                                        name="vehicleId"
                                                        value={values.vehicleId}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        {isVehiclesLoading ? (
                                                            <MenuItem disabled>
                                                                <CircularProgress size={20} color="inherit" />
                                                                <span style={{ marginLeft: "10px" }}>Loading...</span>
                                                            </MenuItem>
                                                        ) : (
                                                            getAllVehicles?.map((vehicle: VehicleDetails) => (
                                                                <MenuItem key={vehicle?.vehicle_ID} value={String(vehicle.vehicle_ID)}>
                                                                    {/* <Tooltip
                                                                        title={`${vehicle?.avgCost}`}
                                                                        placement="right"
                                                                    >
                                                                        <span style={{ flex: 1 }}>{vehicle?.vehicle_ID}</span>
                                                                      </Tooltip> */}
                                                                    <span style={{ flex: 1 }}>{vehicle?.vehicle_ID}</span>
                                                                </MenuItem>
                                                            ))
                                                        )}
                                                    </Select>
                                                    {touched.vehicleId && errors.vehicleId && (
                                                        <FormHelperText>{errors.vehicleId}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <TextField
                                                    fullWidth
                                                    label="Vehicle Number*"
                                                    name="vehicleNumber"
                                                    value={values.vehicleNumber}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.vehicleNumber && Boolean(errors.vehicleNumber)}
                                                    helperText={touched.vehicleNumber && errors.vehicleNumber}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Cost (Rs.)"
                                                    name="costing" type='number'
                                                    value={values.costing}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.costing && Boolean(errors.costing)}
                                                    helperText={touched.costing && errors.costing}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2.4}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={values.isAvailable}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                setFieldValue("isAvailable", checked);
                                                            }}
                                                        />
                                                    }
                                                    label="Is vehicle available"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Typography variant="h6" mt={3} mb={1}>
                                            Vehicle documents
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={1.6}>
                                                <TextField
                                                    fullWidth
                                                    label="Insurance"
                                                    name="insurance"
                                                    value={values.insurance}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                        touched.insurance &&
                                                        Boolean(errors.insurance)
                                                    }
                                                    helperText={
                                                        touched.insurance && errors.insurance
                                                    }
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1.6}>
                                                <TextField
                                                    fullWidth
                                                    label="Registration number"
                                                    name="registration"
                                                    value={values.registration}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                        touched.registration &&
                                                        Boolean(errors.registration)
                                                    }
                                                    helperText={
                                                        touched.registration && errors.registration
                                                    }
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1.6}>
                                                <TextField
                                                    fullWidth
                                                    label="Permit"
                                                    name="permit"
                                                    value={values.permit}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={
                                                        touched.permit &&
                                                        Boolean(errors.permit)
                                                    }
                                                    helperText={
                                                        touched.permit && errors.permit
                                                    }
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>

                                        <Box mt={3} textAlign="center">
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
                                                {isEditing ? "Update vehicle" : "Create vehicle"}
                                            </Button>

                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    setInitialValues(initialFormValues);
                                                    setIsEditing(false);
                                                    setEditRow(null);
                                                    resetForm();
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
                    <DataGridNoPagination
                        columns={columns}
                        rows={rows}
                        isLoading={isLoading}
                    // activeEntity="vehicles" 
                    />
                )}
            </div>
        </>
    );
};

export default withAuthComponent(VehicleOnly);
