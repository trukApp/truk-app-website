'use client';
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Container,
} from "@mui/material";

const CreateTruck = () => {
    // Formik validation schema
    const validationSchema = Yup.object({
        ownerName: Yup.string().required("Truck owner name is required"),
        truckNumber: Yup.string().required("Truck number is required"),
        height: Yup.number().required("Height is required").positive("Height must be positive"),
        width: Yup.number().required("Width is required").positive("Width must be positive"),
        length: Yup.number().required("Length is required").positive("Length must be positive"),
        volume: Yup.number().required("Volume is required").positive("Volume must be positive"),
        capacity: Yup.number().required("Capacity is required").positive("Capacity must be positive"),
        usage: Yup.string().required("Usage is required"),
    });

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            ownerName: "",
            truckNumber: "",
            height: "",
            width: "",
            length: "",
            volume: "",
            capacity: "",
            usage: "Limited",
        },
        validationSchema,
        onSubmit: (values) => {
            console.log("Form Values", values);
        },
    });

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" gutterBottom>
                Create Truck
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="ownerName"
                            name="ownerName"
                            label="Truck Owner Name"
                            value={formik.values.ownerName}
                            onChange={formik.handleChange}
                            error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                            helperText={formik.touched.ownerName && formik.errors.ownerName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="truckNumber"
                            name="truckNumber"
                            label="Truck Number"
                            value={formik.values.truckNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.truckNumber && Boolean(formik.errors.truckNumber)}
                            helperText={formik.touched.truckNumber && formik.errors.truckNumber}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            id="height"
                            name="height"
                            label="Truck Height"
                            type="number"
                            value={formik.values.height}
                            onChange={formik.handleChange}
                            error={formik.touched.height && Boolean(formik.errors.height)}
                            helperText={formik.touched.height && formik.errors.height}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            id="width"
                            name="width"
                            label="Truck Width"
                            type="number"
                            value={formik.values.width}
                            onChange={formik.handleChange}
                            error={formik.touched.width && Boolean(formik.errors.width)}
                            helperText={formik.touched.width && formik.errors.width}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            id="length"
                            name="length"
                            label="Truck Length"
                            type="number"
                            value={formik.values.length}
                            onChange={formik.handleChange}
                            error={formik.touched.length && Boolean(formik.errors.length)}
                            helperText={formik.touched.length && formik.errors.length}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="volume"
                            name="volume"
                            label="Truck Volume"
                            type="number"
                            value={formik.values.volume}
                            onChange={formik.handleChange}
                            error={formik.touched.volume && Boolean(formik.errors.volume)}
                            helperText={formik.touched.volume && formik.errors.volume}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="capacity"
                            name="capacity"
                            label="Truck Capacity"
                            type="number"
                            value={formik.values.capacity}
                            onChange={formik.handleChange}
                            error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                            helperText={formik.touched.capacity && formik.errors.capacity}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="usage"
                            name="usage"
                            label="Usage"
                            select
                            value={formik.values.usage}
                            onChange={formik.handleChange}
                            error={formik.touched.usage && Boolean(formik.errors.usage)}
                            helperText={formik.touched.usage && formik.errors.usage}
                        >
                            <MenuItem value="Limited">Limited</MenuItem>
                            <MenuItem value="Unlimited">Unlimited</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            color="primary"
                            variant="contained"
                            fullWidth
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CreateTruck;
