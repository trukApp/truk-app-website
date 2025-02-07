import React from "react";
import { Formik, Form, Field, FieldArray, FieldProps } from "formik";
import * as Yup from "yup";
import { Button, Grid, TextField } from "@mui/material";

interface PackageDetails {
    productId: string;
    productName: string;
    hsnCode: string;
    rfid: string;
    dimensions: string;
    quantity: string;
    weight: string;
    packagingType: string;
}

interface FormValues {
    packageDetails: PackageDetails[];
}

// Initial values
const initialValues: FormValues = {
    packageDetails: [
        {
            productId: "",
            productName: "",
            hsnCode: "",
            rfid: "",
            dimensions: "",
            quantity: "",
            weight: "",
            packagingType: "",
        },
    ],
};

// Validation schema
const validationSchema = Yup.object().shape({
    packageDetails: Yup.array().of(
        Yup.object().shape({
            productId: Yup.string().required("Required"),
            productName: Yup.string().required("Required"),
            hsnCode: Yup.string().required("Required"),
            rfid: Yup.string().required("Required"),
            dimensions: Yup.string().required("Required"),
            quantity: Yup.string().required("Required"),
            weight: Yup.string().required("Required"),
            packagingType: Yup.string().required("Required"),
        })
    ),
});

const handleFormSubmit = (values:FormValues) => {
    console.log("form submitted values :", values )
}

const PackageForm: React.FC = () => {
    return (
        <Grid>
            <Formik<FormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmit}
        >
            {({ values, handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <FieldArray name="packageDetails">
                        {({ push, remove }) => (
                            <>
                                {values.packageDetails.map((_, index) => (
                                    <Grid container spacing={2} key={index}>
                                        {Object.keys(initialValues.packageDetails[0]).map((fieldName) => (
                                            <Grid item xs={12} md={2.4} key={fieldName}>
                                                <Field name={`packageDetails.${index}.${fieldName}`}>
                                                    {({ field, meta }: FieldProps) => (
                                                        <TextField
                                                            {...field}
                                                            label={fieldName.replace(/([A-Z])/g, " $1").trim()} // Format label
                                                            fullWidth
                                                            size="small"
                                                            error={meta.touched && Boolean(meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                        />
                                                    )}
                                                </Field>
                                            </Grid>
                                        ))}

                                        {/* Remove Button */}
                                        {values.packageDetails.length > 1 && (
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="outlined" size='small'
                                                    color="secondary"
                                                    onClick={() => remove(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}

                                {/* Add One More Button */}
                                <Grid item xs={12} style={{ marginTop: 10 }}>
                                    <Button
                                        variant="contained"
                                        color="primary" size='small'
                                        onClick={() =>
                                            push({
                                                productId: "",
                                                productName: "",
                                                hsnCode: "",
                                                rfid: "",
                                                dimensions: "",
                                                quantity: "",
                                                weight: "",
                                                packagingType: "",
                                            })
                                        }
                                    >
                                        Add One More
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </FieldArray>

                    {/* Submit Button */}
                    <Grid item xs={12} style={{ marginTop: 10 }}>
                        <Button type="submit" size='small' variant="contained" color="success">
                            Next
                        </Button>
                    </Grid>
                </Form>
            )}
            </Formik>
        </Grid>
    );
};

export default PackageForm;
