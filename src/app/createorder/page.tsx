'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
import TrucksTable from '@/Components/CreateOrderTables/TrucksTable';
import RootOptimization from '@/Components/CreateOrderTables/RootOptimization';
import LoadOptimization from '@/Components/CreateOrderTables/LoadOptimization';
import { useAppSelector } from '@/store';
import styles from './createorder.module.css';
// import { MapComponent } from '@/Components/MapComponent';
// import Header from '@/Components/Header';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { useGetAllPackagesForOrderQuery, useSelectTheProductsMutation } from '@/api/apiSlice';



const CreateOrder: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectTheTrucks] = useSelectTheProductsMutation();
    const [selectTrucks, setSelectTrucks] = useState([])
    const [rootOptimization, setRouteOptimazition] = useState([])
    const sourceLocation = useAppSelector((state) => state.auth.createOrderDesination);
    console.log("sourceLocation: ", sourceLocation)
    console.log(rootOptimization)



    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    console.log("selectedPackages: ", selectedPackages)

    const { data: packagesData, error: allProductsFectchingError, isLoading: isPackagesLoading } = useGetAllPackagesForOrderQuery([]);
    if (allProductsFectchingError) {
    }
    const allPackagesData = packagesData?.packages || [];

    const steps = ['Select Packages', 'Truck Selection', 'Route Optimization', 'Load Optimization', 'Review Order'];


    const handleCreateOrder = () => {
        console.log("Final Packages are: ", selectedPackages);
        console.log("Final Trucks Selections are: ", selectedTrucks);
    };

    const handleSelectTruck = async () => {
        if (activeStep === 0) {
            console.log("next button is clicked")
            const packagesIDArray = selectedPackages.map((item) => item.pack_ID);
            const body = {
                packages: packagesIDArray
            }
            console.log(packagesIDArray);
            const response = await selectTheTrucks(body).unwrap();
            if (response) {
                console.log('API Response:', response);
                setSelectTrucks(response?.allocations)
                setRouteOptimazition(response?.routes)
                setActiveStep((prev) => prev + 1)
            }

        } else {
            setActiveStep((prev) => prev + 1);
        }
    };



    return (
        <div>
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
                        <RootOptimization rootOptimization={rootOptimization} />
                    </div>
                )}

                {activeStep === 3 && (
                    <div>
                        <LoadOptimization />
                    </div>
                )}

                {activeStep === 4 && (
                    <div>
                        <Typography variant="h6">Review Your Order</Typography>
                        <div>
                            <strong>Selected Packages:</strong>
                            {selectedPackages.map((pkg, index: number) => (
                                <div key={index}>{pkg.pac_id}</div>
                            ))}
                        </div>

                        <div>
                            <strong>Selected Truck:</strong>
                            {selectedTrucks.map((pkg, index: number) => (
                                <div key={index}>{pkg.truckNumber}</div>
                            ))}
                        </div>
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
                        onClick={handleCreateOrder}
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

