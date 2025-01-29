// 'use client';
// import React, { useState } from 'react';
// import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
// import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
// import TrucksTable from '@/Components/CreateOrderTables/TrucksTable';
// import { useAppSelector } from '@/store';
// import styles from './createorder.module.css'
// import { MapComponent } from '@/Components/MapComponent';
// import Header from '@/Components/Header';
// import { useGetAllProductsQuery, useSelectTheProductsMutation } from '@/api/apiSlice';
// import { withAuthComponent } from '@/Components/WithAuthComponent';

// const CreateOrder: React.FC = () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const selectedPackages = useAppSelector(
//         (state) => state.auth.selectedPackages || []
//     );
//     const selectedTrucks = useAppSelector(
//         (state) => state.auth.selectedTrucks || []
//     );

//     const [selectTheTrucks] = useSelectTheProductsMutation();

//     console.log("selectedPackages: ", selectedPackages)

//     const { data: productsData, error: allProductsFectchingError } = useGetAllProductsQuery([])

//     if (allProductsFectchingError) {
//         console.log("Getting the error while fetching all products: ", allProductsFectchingError)
//     }
//     const allProductsData = productsData?.products || [];

//     console.log("productsData: ", allProductsData)

// const trucks = [
//     {
//         id: 1,
//         ownerName: "John Trucking Co.",
//         truckNumber: "TX1234",
//         truckName: "TX1234 Model X",
//         height: "3.5m",
//         width: "2.5m",
//         length: "8m",
//         volume: "70m³",
//         capacity: "15 tons",
//         usage: "Limited",
//     },
//     {
//         id: 2,
//         ownerName: "Blue Line Logistics",
//         truckNumber: "BL5678",
//         truckName: "BL5678 Model Y",
//         height: "3.2m",
//         width: "2.4m",
//         length: "7.5m",
//         volume: "60m³",
//         capacity: "12 tons",
//         usage: "Limited",
//     },
//     {
//         id: 3,
//         ownerName: "Green Haulage",
//         truckNumber: "GH9012",
//         truckName: "GH9012 Model Z",
//         height: "4m",
//         width: "2.6m",
//         length: "9m",
//         volume: "85m³",
//         capacity: "20 tons",
//         usage: "Limited",
//     },
//     {
//         id: 4,
//         ownerName: "Express Movers",
//         truckNumber: "EM3456",
//         truckName: "EM3456 Model A",
//         height: "3.8m",
//         width: "2.5m",
//         length: "8.5m",
//         volume: "75m³",
//         capacity: "18 tons",
//         usage: "Limited",
//     },
//     {
//         id: 5,
//         ownerName: "Rapid Freight",
//         truckNumber: "RF7890",
//         truckName: "RF7890 Model B",
//         height: "3.6m",
//         width: "2.5m",
//         length: "8.2m",
//         volume: "72m³",
//         capacity: "16 tons",
//         usage: "Limited",
//     },
//     {
//         id: 6,
//         ownerName: "Swift Carriers",
//         truckNumber: "SC1235",
//         truckName: "SC1235 Model C",
//         height: "3.7m",
//         width: "2.4m",
//         length: "8.8m",
//         volume: "78m³",
//         capacity: "17 tons",
//         usage: "Limited",
//     },
//     {
//         id: 7,
//         ownerName: "Prime Transport",
//         truckNumber: "PT5679",
//         truckName: "PT5679 Model D",
//         height: "3.9m",
//         width: "2.5m",
//         length: "9.5m",
//         volume: "90m³",
//         capacity: "22 tons",
//         usage: "Limited",
//     },
//     {
//         id: 8,
//         ownerName: "Elite Freight",
//         truckNumber: "EF8901",
//         truckName: "EF8901 Model E",
//         height: "3.4m",
//         width: "2.6m",
//         length: "7.8m",
//         volume: "68m³",
//         capacity: "14 tons",
//         usage: "Limited",
//     },
//     {
//         id: 9,
//         ownerName: "Pioneer Haulage",
//         truckNumber: "PH2345",
//         truckName: "PH2345 Model F",
//         height: "3.3m",
//         width: "2.5m",
//         length: "8m",
//         volume: "70m³",
//         capacity: "15 tons",
//         usage: "Limited",
//     },
//     {
//         id: 10,
//         ownerName: "Cargo Pros",
//         truckNumber: "CP6789",
//         truckName: "CP6789 Model G",
//         height: "4.1m",
//         width: "2.7m",
//         length: "9.2m",
//         volume: "92m³",
//         capacity: "24 tons",
//         usage: "Limited",
//     },
// ];

//     const steps = ['Select Packages', 'Select Truck', 'Review Order'];

//     const handleCreateOrder = () => {
//         console.log("Final Packages are: ", selectedPackages)
//         console.log("Final Trucks Selections are: ", selectedTrucks)
//     }

//     const handleSelectTruck = async () => {
//         if (activeStep === 0) {
//             const body = {
//                 source: "LOC000018",
//                 products: [
//                     {
//                         product_ID: "PROD000003",
//                         quantity: 100,
//                         destination: "LOC000018"
//                     },
//                     {
//                         product_ID: "PROD000005",
//                         quantity: 50,
//                         destination: "LOC000018"
//                     }
//                 ]
//             }
//             console.log('qwerty: ', body)
// const response = await selectTheTrucks(body).unwrap();
// if (response) {
//     console.log('API Response:', response);
//     setActiveStep((prev) => prev + 1)
// }
//         } else {
//             setActiveStep((prev) => prev + 1)
//         }

//     }

//     console.log(activeStep)

//     return (
//         <div>
//             <Header />
//             <Stepper activeStep={activeStep} alternativeLabel>
//                 {steps.map((label) => (
//                     <Step key={label}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                 ))}
//             </Stepper>

//             <div>
//                 {activeStep === 0 && (
//                     <div>
//                         <Typography variant="h6">Select Packages</Typography>
//                         {/* <PackagesTable packages={packages} /> */}
//                         <PackagesTable allProductsData={allProductsData} />
//                     </div>
//                 )}

//                 {activeStep === 1 && (
//                     <div>
//                         <Typography variant="h6">Select Truck</Typography>
//                         <TrucksTable trucks={trucks} />
//                         <MapComponent />
//                     </div>
//                 )}

//                 {activeStep === 2 && (
//                     <div>
//                         <Typography variant="h6">Review Your Order</Typography>
//                         <div>
//                             <strong>Selected Packages:</strong>
//                             {selectedPackages.map((pkg, index: number) => (
//                                 <div key={index}>{pkg.productName}</div>
//                             ))}
//                         </div>

//                         <div >
//                             <strong>Selected Truck:</strong>
//                             {selectedTrucks.map((pkg, index: number) => (
//                                 <div key={index}>{pkg.truckNumber}</div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className={styles.buttonsContainer}>
//                     <Button
//                         className={styles.backButton}
//                         disabled={activeStep === 0}
//                         onClick={() => setActiveStep((prev) => prev - 1)}
//                     >
//                         Back
//                     </Button>
//                     {activeStep === 2 ? (
//                         <Button
//                             className={styles.nextButton}
//                             onClick={handleCreateOrder}
//                         >
//                             Submit
//                         </Button>
//                     ) : (
//                         <Button
//                             className={styles.nextButton}
//                             onClick={handleSelectTruck}
//                         >
//                             Next
//                         </Button>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// };

// export default withAuthComponent(CreateOrder)




'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
import TrucksTable from '@/Components/CreateOrderTables/TrucksTable';
import { useAppSelector } from '@/store';
import styles from './createorder.module.css';
import { MapComponent } from '@/Components/MapComponent';
import Header from '@/Components/Header';
import { withAuthComponent } from '@/Components/WithAuthComponent';
import { useGetAllProductsQuery, useSelectTheProductsMutation } from '@/api/apiSlice';
import { Product } from '../productmaster/page';

type ProductDetail = {
    product_ID: string;
    quantity: number;
    destination: string;
};


const CreateOrder: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Product[]>([]);
    const [selectTheTrucks] = useSelectTheProductsMutation();
    const [selectTrucks, setSelectTrucks] = useState([])
    // const [rootOptimization, setRouteOptimazition] = useState([])
    const sourceLocation = useAppSelector((state) => state.auth.createOrderDesination);
    console.log("sourceLocation: ", sourceLocation)

    const [updatedQuantities, setUpdatedQuantities] = useState<number[]>([]);

    const selectedPackages = useAppSelector((state) => state.auth.selectedPackages || []);
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);


    const { data: productsData, error: allProductsFectchingError,isLoading:isProductLoading } = useGetAllProductsQuery([]);
    if (allProductsFectchingError) {
    }
    const allProductsData = productsData?.products || [];

    // const trucks = [
    //     {
    //         id: 1,
    //         ownerName: "John Trucking Co.",
    //         truckNumber: "TX1234",
    //         truckName: "TX1234 Model X",
    //         height: "3.5m",
    //         width: "2.5m",
    //         length: "8m",
    //         volume: "70m³",
    //         capacity: "15 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 2,
    //         ownerName: "Blue Line Logistics",
    //         truckNumber: "BL5678",
    //         truckName: "BL5678 Model Y",
    //         height: "3.2m",
    //         width: "2.4m",
    //         length: "7.5m",
    //         volume: "60m³",
    //         capacity: "12 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 3,
    //         ownerName: "Green Haulage",
    //         truckNumber: "GH9012",
    //         truckName: "GH9012 Model Z",
    //         height: "4m",
    //         width: "2.6m",
    //         length: "9m",
    //         volume: "85m³",
    //         capacity: "20 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 4,
    //         ownerName: "Express Movers",
    //         truckNumber: "EM3456",
    //         truckName: "EM3456 Model A",
    //         height: "3.8m",
    //         width: "2.5m",
    //         length: "8.5m",
    //         volume: "75m³",
    //         capacity: "18 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 5,
    //         ownerName: "Rapid Freight",
    //         truckNumber: "RF7890",
    //         truckName: "RF7890 Model B",
    //         height: "3.6m",
    //         width: "2.5m",
    //         length: "8.2m",
    //         volume: "72m³",
    //         capacity: "16 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 6,
    //         ownerName: "Swift Carriers",
    //         truckNumber: "SC1235",
    //         truckName: "SC1235 Model C",
    //         height: "3.7m",
    //         width: "2.4m",
    //         length: "8.8m",
    //         volume: "78m³",
    //         capacity: "17 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 7,
    //         ownerName: "Prime Transport",
    //         truckNumber: "PT5679",
    //         truckName: "PT5679 Model D",
    //         height: "3.9m",
    //         width: "2.5m",
    //         length: "9.5m",
    //         volume: "90m³",
    //         capacity: "22 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 8,
    //         ownerName: "Elite Freight",
    //         truckNumber: "EF8901",
    //         truckName: "EF8901 Model E",
    //         height: "3.4m",
    //         width: "2.6m",
    //         length: "7.8m",
    //         volume: "68m³",
    //         capacity: "14 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 9,
    //         ownerName: "Pioneer Haulage",
    //         truckNumber: "PH2345",
    //         truckName: "PH2345 Model F",
    //         height: "3.3m",
    //         width: "2.5m",
    //         length: "8m",
    //         volume: "70m³",
    //         capacity: "15 tons",
    //         usage: "Limited",
    //     },
    //     {
    //         id: 10,
    //         ownerName: "Cargo Pros",
    //         truckNumber: "CP6789",
    //         truckName: "CP6789 Model G",
    //         height: "4.1m",
    //         width: "2.7m",
    //         length: "9.2m",
    //         volume: "92m³",
    //         capacity: "24 tons",
    //         usage: "Limited",
    //     },
    // ];

    const steps = ['Select Packages', 'Select Truck', 'Review Order'];

    const formatPackageData = () => {
        const productDetails = selectedPackage.reduce<ProductDetail[]>((acc, pkg: Product) => {
            const productID = pkg.product_ID;
            const destination = pkg.packaging_type[0]?.location; // Ensure packaging_type has location

            const quantity = updatedQuantities[selectedPackage.indexOf(pkg)] || pkg.quantity; // Use updated quantity

            acc.push({
                product_ID: productID,
                quantity: quantity,
                destination: destination
            });

            return acc;
        }, []);

        return productDetails;
    };

    const handleCreateOrder = () => {
        console.log("Final Packages are: ", selectedPackages);
        console.log("Final Trucks Selections are: ", selectedTrucks);
        // Call the API to create the order here
    };

    const handleSelectTruck = async () => {
        if (activeStep === 0) {
            setSelectedPackage(selectedPackages as Product[]);
            setOpenDialog(true);
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleUpdateQuantity = (index: number, quantity: number) => {
        const updated = [...updatedQuantities];
        updated[index] = quantity;
        setUpdatedQuantities(updated);
    };

    const handleContinue = async () => {
        const formattedData = await formatPackageData();
        console.log("Formatted Package Data: ", formattedData);
        const body = {
            source: sourceLocation,
            products: formattedData
        }
        const response = await selectTheTrucks(body).unwrap();
        if (response) {
            setSelectTrucks(response?.allocations)
            // setRouteOptimazition(response?.routes)
            console.log('API Response:', response);
            setOpenDialog(false);
            console.log("body: ", body)
            setActiveStep((prev) => prev + 1)
        }
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    return (
        <div>
            <Header />
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
                        <PackagesTable allProductsData={allProductsData} isProductsLoading={isProductLoading} />

                    </div>
                )}

                {activeStep === 1 && (
                    <div>
                        <Typography variant="h6">Select Truck</Typography>
                        <TrucksTable trucks={selectTrucks} />
                        <MapComponent />
                    </div>
                )}

                {activeStep === 2 && (
                    <div>
                        <Typography variant="h6">Review Your Order</Typography>
                        <div>
                            <strong>Selected Packages:</strong>
                            {selectedPackages.map((pkg, index: number) => (
                                <div key={index}>{pkg.productName}</div>
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

                <div className={styles.buttonsContainer}>
                    <Button
                        className={styles.backButton}
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                    >
                        Back
                    </Button>
                    {activeStep === 2 ? (
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

            {/* Modal for quantity adjustment */}
            <Dialog open={openDialog} onClose={handleCancel} fullWidth maxWidth="sm">
                <DialogTitle>Adjust Quantities</DialogTitle>
                <DialogContent>
                    {selectedPackage.map((pkg, index) => (
                        <div key={index}>
                            <Typography variant="body1" style={{ fontWeight: 'bold', color: '#000000' }}>{pkg.product_name}</Typography>
                            <Typography variant="body2">Location ID: {pkg.loc_ID}</Typography>
                            <TextField
                                label="Quantity"
                                type="number"
                                value={updatedQuantities[index] || pkg.quantity}
                                onChange={(e) => handleUpdateQuantity(index, Math.max(1, parseInt(e.target.value)))}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                    },
                                }}
                            />
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCancel} color="primary">
                        Cancel
                    </Button> */}
                    <Button
                        variant='contained' color='error'
                        // className={styles.nextButton}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained' color='primary'
                        // className={styles.nextButton}
                        onClick={handleContinue}
                    >
                        Continue
                    </Button>
                    {/* <Button onClick={handleContinue} color="primary">
                        Continue
                    </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default withAuthComponent(CreateOrder);
