'use client';
import React, { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, DialogActions, DialogContent, Dialog, DialogTitle, Backdrop, CircularProgress, StepIconProps, Box } from '@mui/material';
import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
import TrucksTable, { Truck } from '@/Components/CreateOrderTables/TrucksTable';
import RootOptimization, { RootOptimizationType } from '@/Components/CreateOrderTables/RootOptimization';
import LoadOptimization from '@/Components/CreateOrderTables/LoadOptimization';
import { useAppDispatch, useAppSelector } from '@/store';
import styles from './createorder.module.css';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { useGetAllPackagesForOrderQuery, useSelectTheProductsMutation, useConfomOrderMutation } from '@/api/apiSlice';
import ReviewCreateOrder from '@/Components/CreateOrderTables/ReviewOrder';
import SnackbarAlert from '@/Components/ReusableComponents/SnackbarAlerts';
import { CustomButtonFilled, CustomButtonOutlined } from '@/Components/ReusableComponents/ButtonsComponent';
import { setSelectedPackages, setSelectedTrucks } from '@/store/authSlice';
import { useMediaQuery, useTheme } from '@mui/material';

interface ConfirmPayload {
    message?: string;
    totalCost?: number;
    allocations?: [];
    unallocatedPackages?: [];
}

const CreateOrder: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useAppDispatch();
    // const selectedRoutes = useSelector((state: RootState) => state.auth.selectedRoutes);
    // console.log('selectedRoutes create order pagetsx: ', selectedRoutes);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [activeStep, setActiveStep] = useState(0);
    const [selectTheTrucks, { error: packageSelectErr, isLoading: truckSelectionLoading }] = useSelectTheProductsMutation();
    const [createOrder, { error: createOrderError, isLoading: confirmOrderLoading }] = useConfomOrderMutation();
    const [selectTrucks, setSelectTrucks] = useState<Truck[]>([]);
    const [conformOrderPayload, setConformOrderPayload] = useState<ConfirmPayload>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [noVechilePopup, setNoVechilePopup] = useState(false);
    const filters = useAppSelector((state) => state.auth.filters);

    useEffect(() => {
        if (packageSelectErr) {
            console.log('packageSelectErr:', packageSelectErr);
            if ("data" in packageSelectErr && packageSelectErr.data && typeof packageSelectErr.data === "object") {
                const errorMessage = (packageSelectErr.data as { error?: string }).error;

                if (errorMessage === "All packages must have the same pickup_date (ignoring time).") {
                    setSnackbarMessage("All packages must have the same pickup date.");
                } else {
                    setSnackbarMessage("Please select the packages of the same SHIP FROM location.");
                }
            } else {
                setSnackbarMessage("An unexpected error occurred.");
            }
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
        }
    }, [packageSelectErr])

    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);


    const { data: packagesData, error: allProductsFectchingError, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
    if (allProductsFectchingError) {
    }

    const allPackagesData = packagesData?.packages || [];
    const steps = ['Select Packages', 'Vehicle Optimization', 'Route Optimization', 'Load Optimization', 'Review Order'];


    const handleCreateOrder = async () => {
        const createOrderBody = {
            scenario_label: conformOrderPayload?.message,
            total_cost: conformOrderPayload?.totalCost,
            allocations: conformOrderPayload?.allocations,
            unallocated_packages: conformOrderPayload?.unallocatedPackages,
            created_at: new Date().toISOString().split("T")[0],
        }
        console.log(createOrderBody)
        setModalOpen(false);
        try {
            const response = await createOrder(createOrderBody).unwrap();
            if (response) {
                const orderIds = response.created_orders.map((order: { order_ID: string }) => order.order_ID).join(', ');
                setSnackbarMessage(`Order ID(s) ${orderIds} created successfully!`);
                // setSnackbarMessage(`Order ID ${response?.order_ID} created successfully!`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setActiveStep(0)
                dispatch(setSelectedPackages([]));
                dispatch(setSelectedTrucks([]));
            }

        } catch (error: unknown) {
            console.log("Getting error while creating the order: ", createOrderError);
            console.log("Getting error while creating the order from catch block: ", error);

            if (
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "message" in error.data &&
                typeof error.data.message === "string"
            ) {
                if (error.data.message === "Some packages are already confirmed in an existing order.") {
                    setSnackbarMessage(`Some packages are already confirmed in an existing order, Please check`);
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            }
        }

    };

    const handleSelectTruck = async () => {
        if (activeStep === 0) {
            const packagesIDArray = selectedPackages.map((item) => item.pack_ID);
            const body = {
                packages: packagesIDArray,
                filters
            };

            const response = await selectTheTrucks(body).unwrap();
            if (response) {
                if (response?.message === "No suitable vehicles found for these package(s). Possibly special conditions or capacity mismatch.") {
                    console.log("I am wrong")
                    setNoVechilePopup(true)
                } else {
                    setConformOrderPayload(response)
                    console.log('response: ', response)
                    setSelectTrucks(response?.allocations);
                    setActiveStep((prev) => prev + 1);
                }

            }
        } else {
            // setSelectTrucks([response?.allocations]);
            setActiveStep((prev) => prev + 1);
        }
    };
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
                    <Typography variant="body2" >{icon}</Typography>
                )}
            </Box>
        );
    };

    return (
        <div>
            <Backdrop
                sx={{
                    color: "#ffffff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={confirmOrderLoading || truckSelectionLoading}
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
                    <DialogTitle>Proceed for order </DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to create the order ?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setModalOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <CustomButtonFilled onClick={handleCreateOrder}>Confirm</CustomButtonFilled>
                    </DialogActions>
                </Dialog>
            )}


            {noVechilePopup && (
                <Dialog open={noVechilePopup} onClose={() => setNoVechilePopup(false)} >
                    <DialogTitle sx={{ color: 'red' }}>Alert !!!</DialogTitle>
                    <DialogContent>
                        <Typography>Currently, there are no vehicles to send these packages </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setNoVechilePopup(false)} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {/* <Stepper  activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper> */}
            <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "visible", padding: "10px" }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                        flexWrap: "nowrap",
                        '& .MuiStepConnector-line': {
                            borderWidth: '1px'
                        },
                    }}
                >
                    {steps.map((label, index) => (
                        <Step key={index} >
                            <StepLabel StepIconComponent={CustomStepIcon}  >
                                <Typography
                                    sx={{
                                        fontSize: "14px",
                                        color: activeStep === index ? "#83214F" : "#333",
                                        fontWeight: activeStep === index ? "bold" : "400",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>


            <div>
                {activeStep === 0 && (
                    <div>
                        <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>Select packages</Typography>
                        <PackagesTable allPackagesData={allPackagesData} isPackagesLoading={isPackagesLoading} />

                    </div>
                )}

                {activeStep === 1 && (
                    <div>
                        <TrucksTable trucks={selectTrucks} />
                    </div>
                )}

                {activeStep === 2 && (
                    <div>
                        <RootOptimization rootOptimization={selectTrucks as unknown as RootOptimizationType[]} />
                    </div>
                )}

                {activeStep === 3 && (
                    <div>
                        <LoadOptimization trucks={selectTrucks} />
                    </div>
                )}

                {activeStep === 4 && (
                    <div>
                        <ReviewCreateOrder trucks={selectTrucks} />
                    </div>
                )}
            </div>
            <div className={styles.buttonsContainer}>
                {activeStep === 0 ? null : (
                    <CustomButtonOutlined onClick={() => setActiveStep((prev) => prev - 1)} >Back</CustomButtonOutlined>
                )}
                {activeStep === 4 ? (
                    <CustomButtonFilled onClick={() => setModalOpen(true)}>Submit</CustomButtonFilled>
                ) : (
                    <CustomButtonFilled onClick={() => handleSelectTruck()}>Next</CustomButtonFilled>
                )}
            </div>

        </div>
    );
};

export default withAuthComponent(CreateOrder);

