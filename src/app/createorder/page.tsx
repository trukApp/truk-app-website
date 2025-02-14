'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, DialogActions, DialogContent, Dialog, DialogTitle } from '@mui/material';
import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
import TrucksTable, { Truck } from '@/Components/CreateOrderTables/TrucksTable';
import RootOptimization, { RootOptimizationType } from '@/Components/CreateOrderTables/RootOptimization';
import LoadOptimization from '@/Components/CreateOrderTables/LoadOptimization';
import { useAppSelector } from '@/store';
import styles from './createorder.module.css';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { useGetAllPackagesForOrderQuery, useSelectTheProductsMutation } from '@/api/apiSlice';
import ReviewCreateOrder from '@/Components/CreateOrderTables/ReviewOrder';

const CreateOrder: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectTheTrucks] = useSelectTheProductsMutation();
    const [selectTrucks, setSelectTrucks] = useState<Truck[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const filters = useAppSelector((state) => state.auth.filters);


    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);

    const { data: packagesData, error: allProductsFectchingError, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
    if (allProductsFectchingError) {
    }
    const allPackagesData = packagesData?.packages || [];

    const steps = ['Select Packages', 'Truck Selection', 'Route Optimization', 'Load Optimization', 'Review Order'];


    const handleCreateOrder = () => {
        console.log(selectedPackages);

    };

    const handleSelectTruck = async () => {
        if (activeStep === 0) {
            const packagesIDArray = selectedPackages.map((item) => item.pack_ID);
            const body = {
                packages: packagesIDArray,
                filters
            }
            const response = await selectTheTrucks(body).unwrap();
            if (response) {
                setSelectTrucks([response?.scenarioCost, response?.scenarioEta])
                setActiveStep((prev) => prev + 1)
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };



    return (
        <div>
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
                        <Button variant="outlined" onClick={handleCreateOrder} color="primary">
                            Create order
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
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
                <Button
                    className={styles.backButton}
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => prev - 1)}
                >
                    Back
                </Button>
                {activeStep === 4 ? (
                    <Button
                        variant='contained' color='primary'
                        className={styles.nextButton}
                        onClick={() => setModalOpen(true)}
                    >
                        Submit
                    </Button>
                ) : (
                    <Button
                        variant='contained' color='primary'
                        // className={styles.nextButton}
                        onClick={handleSelectTruck}
                    >
                        Next
                    </Button>
                )}
            </div>

        </div>
    );
};

export default withAuthComponent(CreateOrder);

