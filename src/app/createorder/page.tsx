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


const CreateOrder: React.FC = () => {
    const dispatch = useAppDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("success");
    const [activeStep, setActiveStep] = useState(0);
    const [selectTheTrucks, { error: packageSelectErr, isLoading: truckSelectionLoading }] = useSelectTheProductsMutation();
    const [createOrder, { error: createOrderError, isLoading: confirmOrderLoading }] = useConfomOrderMutation();
    const [selectTrucks, setSelectTrucks] = useState<Truck[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [noVechilePopup, setNoVechilePopup] = useState(false);
    const filters = useAppSelector((state) => state.auth.filters);

    useEffect(() => {
        if (packageSelectErr) {
            setSnackbarMessage(`Please select the packages of same SHIP FROM location`);
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
        }
    }, [packageSelectErr])

    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);


    const { data: packagesData, error: allProductsFectchingError, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
    if (allProductsFectchingError) {
    }

    const allPackagesData = packagesData?.packages || [];
    const steps = ['Select Packages', 'Vehicle Optimization', 'Route Optimization', 'Load Optimization', 'Review Order'];


    const handleCreateOrder = async () => {
        const selectedOrderType = selectedTrucks[0]
        const createOrderBody = {
            scenario_label: selectedOrderType?.label,
            total_cost: selectedOrderType?.totalCost,
            allocations: selectedOrderType?.allocations,
            unallocated_packages: selectedOrderType?.unallocatedPackages
        }
        setModalOpen(false);
        try {
            const response = await createOrder(createOrderBody).unwrap();
            if (response) {
                console.log("response: ", response)
                setSnackbarMessage(`Order ID ${response?.order_ID} created successfully!`);
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
                let transportCounter = 1;
                const updatedScenarioCost = {
                    ...response.scenarioCost,
                    allocations: response.scenarioCost.allocations.map((vehicle: Truck) => ({
                        ...vehicle,
                        transportNumber: `Vehicle ${transportCounter++}`
                    }))
                };

                transportCounter = 1;
                const updatedScenarioEta = {
                    ...response.scenarioEta,
                    allocations: response.scenarioEta.allocations.map((vehicle: Truck) => ({
                        ...vehicle,
                        transportNumber: `Vehicle ${transportCounter++}`
                    }))
                };

                if (updatedScenarioCost?.totalCost === 0 && updatedScenarioEta?.totalCost === 0) {
                    console.log('There is no vehicle for selected package or packages')
                    setNoVechilePopup(true)
                } else {
                    setSelectTrucks([updatedScenarioCost, updatedScenarioEta]);
                    setActiveStep((prev) => prev + 1);
                }
            }
        } else {
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
                <Typography variant="body2">{icon}</Typography>
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
            <Stepper  activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <div>
                {activeStep === 0 && (
                    <div>
                        <Typography variant="h6">Select Packages</Typography>
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
                        <RootOptimization rootOptimization={selectedTrucks as unknown as RootOptimizationType[]} />
                    </div>
                )}

                {activeStep === 3 && (
                    <div>
                        <LoadOptimization />
                    </div>
                )}

                {activeStep === 4 && (
                    <div>
                        <ReviewCreateOrder />
                    </div>
                )}
            </div>
            <div className={styles.buttonsContainer}>
                <CustomButtonOutlined onClick={() => setActiveStep((prev) => prev - 1)} >Back</CustomButtonOutlined>
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

