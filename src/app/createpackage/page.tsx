'use client';
interface PackageDetailsItem {
    productId: string;
    productName: string;
    hsnCode: string;
    rfid: string;
    dimensions: string;
    quantity: string;
    weight: string;
    packagingType: string;
}

export interface AdditionalInfo {
    eWayBillFile: File | string | null;
    referenceId: string;       // Order Reference Number (optional)
    invoiceNumber: string;     // Mandatory
    poNumber: string;
    salesOrderNumber: string;
    department: string;
    deliveryType: string;      // Mandatory: master data delivery types
    deliveryMode: string;      // Mandatory: Road/Rail/Air/Sea/Multi Modal
    stnDoNumber?: string;      // Optional
    valueOfGoods: number;      // Mandatory
    eWayBillNumber?: string;   // Mandatory if valueOfGoods >= 50000, optional otherwise
    returnLabel: boolean;
    file: File | string | null;
}


interface PickupDropoff {
    pickupDateTime: string;
    dropoffDateTime: string;
    notes: string;
}

interface LocationInfo {
    locationId: string;
    locationDescription: string;
    contactPerson: string;
    phoneNumber: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    saveAsNewLocationId: boolean;
    saveAsDefaultShipFromLocation: boolean;
    latitude: string;
    longitude: string;
    timeZone: string;
    locationType: string;
    glnCode: string;
    iataCode: string;
}

export interface CreatePackageFormValues {
    shipFrom: LocationInfo;
    shipTo: LocationInfo & { destination_radius: string; destination_radius_unit: string };
    billTo: LocationInfo;
    packageDetails: PackageDetailsItem[];
    additionalInfo: AdditionalInfo;
    pickupDropoff: PickupDropoff;
}


import React, { useState } from 'react';
import { useMediaQuery, useTheme, Box, Typography, Dialog, DialogTitle, DialogActions, Button, DialogContent, Backdrop, CircularProgress, Grid } from '@mui/material';
import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
// import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';
import { useRouter } from "next/navigation";
import { useCreatePackageForOrderMutation } from '@/api/apiSlice';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { Form, Formik, FormikHelpers } from 'formik';
import { createPackageValidationSchema } from '@/Components/CreatePackageTabs/ValidationSchema';

const CreatePackage = () => {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>("success");
    const [createPackageOrder, { isLoading: isPackageCreating }] = useCreatePackageForOrderMutation()

    const handleCreateAnother = () => {
        setModalOpen(false);
        // router.push("/createpackage");
        router.refresh();
    };
    const handleGoToOrder = () => {
        setModalOpen(false);
        router.push("/createorder");
    };


    const handleSubmit = async (values: CreatePackageFormValues, formikHelpers: FormikHelpers<CreatePackageFormValues>) => {
        console.log("Submitting eWayBillFile field:", values.additionalInfo.eWayBillFile);
        console.log("Submitting file field:", values.additionalInfo.file);

        const errors = await formikHelpers.validateForm();
        console.log('Validation errors before submit:', errors);

        // If errors exist, optionally prevent submission
        if (Object.keys(errors).length > 0) {
            console.warn('Form validation failed. Fix errors before submitting.');
            return;
        }
        try {
            const shipFromLocationId = values?.shipFrom?.locationId.split(",")[0]
            const shipToLocationId = values?.shipTo?.locationId.split(",")[0]
            const billToLocationId = values?.billTo?.locationId.split(",")[0]
            const createPackageBody = {
                packages: [
                    {
                        ship_from: shipFromLocationId,
                        ship_to: shipToLocationId,
                        destination_radius: `${values?.shipTo?.destination_radius}${values?.shipTo?.destination_radius_unit}`,
                        product_ID: values?.packageDetails?.map((product) => ({
                            prod_ID: product.productId,
                            quantity: product.quantity,
                            package_info: product?.packagingType
                        })),
                        package_info: values?.packageDetails[0].packagingType,
                        bill_to: billToLocationId,
                        return_label: values.additionalInfo?.returnLabel ? 1 : 0,
                        additional_info: {
                            reference_id: values.additionalInfo?.referenceId,
                            invoice: values.additionalInfo?.invoiceNumber,
                            department: values.additionalInfo?.department,
                            attachment: values.additionalInfo?.file,
                            po_number: values.additionalInfo?.poNumber,
                            sales_order_number: values.additionalInfo?.salesOrderNumber,
                            return_label: values.additionalInfo?.returnLabel,
                            delivery_type: values?.additionalInfo?.deliveryType,
                            delivery_mode: values?.additionalInfo?.deliveryMode,
                            value_of_goods: values?.additionalInfo?.valueOfGoods,
                            eWay_bill_file: values?.additionalInfo?.eWayBillFile,
                            stn_Do_number: values?.additionalInfo?.stnDoNumber,
                        },
                        pickup_date_time: values.pickupDropoff?.pickupDateTime,
                        dropoff_date_time: values.pickupDropoff?.dropoffDateTime,
                    },
                ],

            }
            console.log("createPackageBody: ", createPackageBody)
            const response = await createPackageOrder(createPackageBody).unwrap();
            if (response) {
                setModalOpen(true)
                setSnackbarMessage(`Package ID ${response?.created_records[0]} created successfully!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }
        }
        catch (error) {
            console.log("err :", error)
            if (typeof error === "object" && error !== null) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const msg = (error as any).data?.message || (error as any).message || "";
                if (typeof msg === "string" && msg.startsWith("All products in a package must have the same stacking factor")) {
                    setSnackbarMessage("Products must have the same stacking factor.");
                } else {
                    setSnackbarMessage("Something went wrong! Please try again.");
                }
            } else {
                setSnackbarMessage("Something went wrong! Please try again.");
            }
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }


    };


    const shipFromInitialValues = {
        locationId: '',
        locationDescription: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: false,
        latitude: '',
        longitude: '',
        timeZone: '',
        glnCode: '',
        iataCode: '',
        locationType: ''
    }

    const shipToInitialValues = {
        locationId: '',
        locationDescription: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: false,
        latitude: '',
        longitude: '',
        timeZone: '',
        glnCode: '',
        iataCode: '',
        locationType: '',
        destination_radius: '0',
        destination_radius_unit: 'm',
    }

    const shipBillToInitialValues = {
        locationId: '',
        locationDescription: '',
        contactPerson: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        saveAsNewLocationId: false,
        saveAsDefaultShipFromLocation: false,
        latitude: '',
        longitude: '',
        timeZone: '',
        glnCode: '',
        iataCode: '',
        locationType: ''
    }

    const packageDetailsInitialValues = [
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
    ];

    const additionalInfoInitialValues = {
        referenceId: '',
        invoiceNumber: '',
        poNumber: '',
        salesOrderNumber: '',
        department: '',
        returnLabel: false,
        file: null,
        deliveryType: '',        // Add this default as empty string
        deliveryMode: '',
        valueOfGoods: 0,
        eWayBillFile: null,
        stnDoNumber: '',
    }

    const pickupDropofInitialValues = {
        pickupDateTime: '',
        dropoffDateTime: '',
        notes: '',
    }



    return (
        <div>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isPackageCreating}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <SnackbarAlert
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
            {modalOpen && (
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)} >
                    <DialogTitle>Package Created Successfully</DialogTitle>
                    <DialogContent>
                        <Typography>Your Package Has Been Created Successfully. What Would You Like to do Next?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleCreateAnother} color="primary">
                            Create Another Package
                        </Button>
                        <Button variant="outlined" onClick={handleGoToOrder} color="secondary">
                            Go to Create Order
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Box sx={{ px: isMobile ? 2 : 4, pb: 1 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    Create a Package
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Fill out the Following Steps to Successfully Create a Package With all Relevant Shipping, Billing, and Tax Details.
                </Typography>
            </Box>


            {/* Form Content */}
            <Formik<CreatePackageFormValues>
                initialValues={{
                    shipFrom: shipFromInitialValues,
                    shipTo: shipToInitialValues,
                    packageDetails: packageDetailsInitialValues,
                    billTo: shipBillToInitialValues,
                    additionalInfo: additionalInfoInitialValues,
                    pickupDropoff: pickupDropofInitialValues,
                }}
                onSubmit={handleSubmit}
                validationSchema={createPackageValidationSchema}
            >
                <Form>
                    <ShipFrom />
                    <ShipTo />
                    <BillTo />
                    <PackageDetails />
                    <AdditionalInformation />
                    <PickupDropoff />
                    {/* <button type="submit">Submit Package</button> */}
                    <Grid item sx={{ textAlign: 'center', mb: 4, mt: 5 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                margin: '10px',
                                backgroundColor: "#F08C24",
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "#fff",
                                    color: "#F08C24",
                                },
                                padding: '10px 20px',
                                fontSize: '16px',
                            }}
                        >
                            Create Package
                        </Button>
                    </Grid>
                </Form>
            </Formik>

        </div>
    );
};

export default withAuthComponent(CreatePackage);