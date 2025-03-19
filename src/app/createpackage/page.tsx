'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stepper, Step, StepLabel, Grid, useMediaQuery, useTheme, Box, Typography, Dialog, DialogTitle, DialogActions, Button, DialogContent, Backdrop, CircularProgress } from '@mui/material';
import ShipFrom from '@/Components/CreatePackageTabs/CreatePackageShipFrom';
import ShipTo from '@/Components/CreatePackageTabs/CreatePackageShipTo';
import AdditionalInformation from '@/Components/CreatePackageTabs/AddtionalInformation';
import TaxInfo from '@/Components/CreatePackageTabs/CreatePackageTax';
import PickupDropoff from '@/Components/CreatePackageTabs/PickUpAndDropOffDetails';
import PackageDetails from '@/Components/CreatePackageTabs/PackageDetailsTab';
import BillTo from '@/Components/CreatePackageTabs/CreatePackageBillTo';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';
import { RootState, useAppSelector } from '@/store';
import { resetCompletedSteps, setCompletedState, setPackageAddtionalInfo, setPackageBillTo, setPackagePickAndDropTimings, setPackageShipFrom, setPackageShipTo, setPackageTax, setProductsList } from '@/store/authSlice';
import { useRouter } from "next/navigation";
import { useCreatePackageForOrderMutation } from '@/api/apiSlice';
import { StepIconProps } from "@mui/material/StepIcon";
import { withAuthComponent } from '@/Components/WithAuthComponent';

const steps = ['Ship From', 'Ship To', 'Package Details', 'Bill To', 'Additional Info', 'Pickup/Drop off', 'Tax Info'];

const CreatePackage = () => {
    const dispatch = useDispatch()
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const completedSteps = useSelector((state: RootState) => state.auth.completedState);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>("success");
    const [activeStep, setActiveStep] = useState(0);
    const packageTaxFromRedux = useAppSelector((state) => state.auth.packageTax)
    const packageAddtionalInfoFromRedux = useAppSelector((state) => state.auth.packageAdditionalInfo);
    const billToReduxValues = useAppSelector((state) => state.auth.packageBillTo);
    const shipFromReduxValues = useAppSelector((state) => state.auth.packageShipFrom);
    const shipToReduxValues = useAppSelector((state) => state.auth.packageShipTo);
    const productListFromRedux = useAppSelector((state) => state.auth.packagesDetails);
    const packagePickUpAndDropTimingsFromRedux = useAppSelector((state) => state.auth.packagePickAndDropTimings);
    const [createPackageOrder, { isLoading: isPackageCreating }] = useCreatePackageForOrderMutation()
    console.log("shipFromReduxValues: ", shipFromReduxValues)
    console.log("shipToReduxValues: ", shipToReduxValues)
    console.log("productListFromRedux: ", productListFromRedux)
    console.log("shipToReduxValues: ", shipToReduxValues)
    console.log("packageAddtionalInfoFromRedux: ", packageAddtionalInfoFromRedux)
    console.log("packagePickUpAndDropTimingsFromRedux: ", packagePickUpAndDropTimingsFromRedux)
    console.log("packageTaxFromRedux: ", packageTaxFromRedux)

    const CustomStepIcon = (props: StepIconProps) => {
        const { active, completed, icon } = props;
        return (
            <Box
                sx={{
                    width: 25,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: completed
                        ? "#83214F"
                        : active
                            ? "#83214F"
                            : "#ccc",
                    color: 'white',
                    fontWeight: "bold",
                }}
            >
                {completed ? (
                    <Typography variant="body2" sx={{ fontSize: 15, fontWeight: "bold" }}>
                        ✔
                    </Typography>
                ) : (
                    <Typography variant="body2">{icon}</Typography>
                )}
            </Box>
        );
    };
    const handleNext = () => {
        dispatch(setCompletedState(activeStep));
        const nextStep = completedSteps.findIndex(step => !step);
        setActiveStep(nextStep !== -1 ? nextStep : activeStep + 1);
    };

    const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

    const handleStepClick = (stepIndex: number) => {
        setActiveStep(stepIndex);
    };

    const handleCreateAnother = () => {
        setModalOpen(false);
        setActiveStep(0)
    };
    const handleGoToOrder = () => {
        console.log('moving to create order')
        setModalOpen(false);
        setActiveStep(0)
        router.push("/createorder");
    };
    useEffect(() => {
        if (completedSteps.length > 0 && completedSteps.length <= 6) {
            const firstUnfilledIndex = completedSteps.findIndex(step => !step);
            setActiveStep(firstUnfilledIndex !== -1 ? firstUnfilledIndex : completedSteps.length);
            if (firstUnfilledIndex !== -1) {
                setSnackbarMessage("Some steps are unfilled! Navigating to first unfilled step...");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
                setActiveStep(firstUnfilledIndex);
                return;
            }
        }
    }, [completedSteps]);

    const handleSubmit = async () => {
        const firstUnfilledIndex = completedSteps.findIndex((step) => !step);
        console.log("firstunfilled ", firstUnfilledIndex)
        if (firstUnfilledIndex !== -1) {
            setSnackbarMessage("Some steps are unfilled! Navigating to first unfilled step...");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            setActiveStep(firstUnfilledIndex);
            return;
        } else {
            try {
                const shipFromLocationId = shipFromReduxValues?.locationId.split(",")[0]
                const shipToLocationId = shipToReduxValues?.locationId.split(",")[0]
                const billToLocationId = billToReduxValues?.locationId.split(",")[0]
                const createPackageBody = {
                    packages: [
                        {
                            ship_from: shipFromLocationId,
                            ship_to: shipToLocationId,
                            product_ID: productListFromRedux.map((product) => ({
                                prod_ID: product.productId,
                                quantity: product.quantity,
                                package_info: product?.packagingType
                            })),
                            package_info: productListFromRedux[0]?.packagingType,
                            bill_to: billToLocationId,
                            return_label: packageAddtionalInfoFromRedux?.returnLabel ? 1 : 0,
                            additional_info: {
                                reference_id: packageAddtionalInfoFromRedux?.referenceId,
                                invoice: packageAddtionalInfoFromRedux?.invoiceNumber,
                                department: packageAddtionalInfoFromRedux?.department,
                                attachment: packageAddtionalInfoFromRedux?.file,
                                po_number: packageAddtionalInfoFromRedux?.poNumber,
                                sales_order_number: packageAddtionalInfoFromRedux?.salesOrderNumber,
                            },
                            pickup_date_time: packagePickUpAndDropTimingsFromRedux?.pickupDateTime,
                            dropoff_date_time: packagePickUpAndDropTimingsFromRedux?.dropoffDateTime,
                            tax_info: {
                                tax_rate: packageTaxFromRedux?.taxRate,
                                sender_gst: packageTaxFromRedux?.senderGSTN,
                                receiver_gst: packageTaxFromRedux?.receiverGSTN,
                                carrier_gst: packageTaxFromRedux?.carrierGSTN,
                                self_transport: packageTaxFromRedux?.isSelfTransport,
                            },
                        },
                    ],

                }

                console.log("createPackageBody: ", createPackageBody)
                const response = await createPackageOrder(createPackageBody).unwrap();
                if (response) {
                    dispatch(resetCompletedSteps())
                    setModalOpen(true)
                    setSnackbarMessage(`Package ID ${response?.created_records[0]} created successfully!`);
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    dispatch(setPackageShipFrom(null));
                    dispatch(setPackageShipTo(null));
                    dispatch(setPackageBillTo(null));
                    dispatch(setPackageTax(null))
                    dispatch(setPackageAddtionalInfo(null));
                    dispatch(setProductsList([]));
                    dispatch(setPackagePickAndDropTimings(null))
                    setActiveStep(0)
                }
            }
            catch (error) {
                console.log("err :", error)
                setSnackbarMessage("Something went wrong! please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }


    };
    if (isPackageCreating) {
        console.log('creating')
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
                        <Typography>Your package has been created successfully. What would you like to do next?</Typography>
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
            <Box sx={{ overflowX: isMobile ? "auto" : "visible", padding: "10px" }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel sx={{
                        flexWrap: "nowrap",
                        '& .MuiStepConnector-line': {
                            borderWidth: '1px'
                        },
                    }}
                >
                    {steps.map((label, index) => (
                        <Step key={index} completed={!!completedSteps[index]}>
                            <StepLabel StepIconComponent={CustomStepIcon} onClick={() => handleStepClick(index)} sx={{ cursor: "pointer" }}>
                                <Typography sx={{ fontSize: "14px", color: activeStep === index ? "#83214F" : "#333", fontWeight: activeStep === index ? "bold" : "400", whiteSpace: "nowrap" }}>
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

            </Box>

            {/* Form Content */}
            <Grid container spacing={2} sx={{ padding: isMobile ? '10px' : '20px' }}>
                {activeStep === 0 && <ShipFrom onNext={() => handleNext()} />}
                {activeStep === 1 && <ShipTo onNext={() => handleNext()} onBack={handleBack} />}
                {activeStep === 2 && <PackageDetails onNext={() => handleNext()} onBack={handleBack} />}
                {activeStep === 3 && <BillTo onNext={() => handleNext()} onBack={handleBack} />}
                {activeStep === 4 && <AdditionalInformation onNext={() => handleNext()} onBack={handleBack} />}
                {activeStep === 5 && <PickupDropoff onNext={() => handleNext()} onBack={handleBack} />}
                {activeStep === 6 && <TaxInfo onSubmit={handleSubmit} onBack={handleBack} />}
            </Grid>
        </div>
    );
};

export default withAuthComponent(CreatePackage);
