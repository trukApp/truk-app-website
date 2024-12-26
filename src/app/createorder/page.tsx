'use client';
import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import PackagesTable from '@/Components/CreateOrderTables/PackagesTable';
import TrucksTable from '@/Components/CreateOrderTables/TrucksTable';
import { useAppSelector } from '@/store';
import styles from './createorder.module.css'
import { MapComponent } from '@/Components/MapComponent';
// import { withAuthComponent } from '@/Components/WithAuthComponent';
import Header from '@/Components/Header';

const CreateOrder: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const selectedPackages = useAppSelector(
        (state) => state.auth.selectedPackages || []
    );
    const selectedTrucks = useAppSelector(
        (state) => state.auth.selectedTrucks || []
    );
    const packages = [
        {
            id: 1,
            packageName: 'Sample Package 1',
            weight: '5kg',
            length: '20cm',
            width: '15cm',
            volume: '3000cm³',
            senderName: 'John Doe',
            senderAddress: '123 Main Street, Springfield',
            senderPincode: '123456',
            senderState: 'Illinois',
            senderCountry: 'USA',
            senderPhone: '+1 555-123-4567',
            receiverName: 'Jane Smith',
            receiverAddress: '456 Elm Street, Riverside',
            receiverPincode: '654321',
            receiverState: 'California',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-987-6543',
        },
        {
            id: 2,
            packageName: 'Sample Package 2',
            weight: '3kg',
            length: '30cm',
            width: '25cm',
            volume: '4000cm³',
            senderName: 'Alice Johnson',
            senderAddress: '789 Oak Street, Metropolis',
            senderPincode: '789123',
            senderState: 'New York',
            senderCountry: 'USA',
            senderPhone: '+1 555-111-2222',
            receiverName: 'Bob Brown',
            receiverAddress: '101 Pine Street, Gotham',
            receiverPincode: '321987',
            receiverState: 'New Jersey',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-333-4444',
        },
        {
            id: 3,
            packageName: 'Sample Package 3',
            weight: '2kg',
            length: '25cm',
            width: '20cm',
            volume: '2000cm³',
            senderName: 'Charlie White',
            senderAddress: '55 Maple Avenue, Oceanview',
            senderPincode: '456789',
            senderState: 'Florida',
            senderCountry: 'USA',
            senderPhone: '+1 555-555-6666',
            receiverName: 'Daisy Green',
            receiverAddress: '77 Birch Lane, Hilltop',
            receiverPincode: '654987',
            receiverState: 'Texas',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-777-8888',
        },
        {
            id: 4,
            packageName: 'Sample Package 4',
            weight: '6kg',
            length: '40cm',
            width: '30cm',
            volume: '7000cm³',
            senderName: 'Eve Black',
            senderAddress: '101 Redwood Drive, Lakeside',
            senderPincode: '123789',
            senderState: 'Georgia',
            senderCountry: 'USA',
            senderPhone: '+1 555-999-0000',
            receiverName: 'Frank Blue',
            receiverAddress: '202 Cedar Street, Mountainview',
            receiverPincode: '789654',
            receiverState: 'Nevada',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-121-2323',
        },
        {
            id: 5,
            packageName: 'Sample Package 5',
            weight: '4kg',
            length: '22cm',
            width: '18cm',
            volume: '2500cm³',
            senderName: 'Grace Yellow',
            senderAddress: '303 Willow Court, Riverbend',
            senderPincode: '987123',
            senderState: 'Michigan',
            senderCountry: 'USA',
            senderPhone: '+1 555-343-4545',
            receiverName: 'Henry Purple',
            receiverAddress: '404 Palm Boulevard, Sunfield',
            receiverPincode: '123987',
            receiverState: 'Arizona',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-565-6767',
        },
        {
            id: 6,
            packageName: 'Sample Package 6',
            weight: '7kg',
            length: '35cm',
            width: '25cm',
            volume: '6000cm³',
            senderName: 'Ivy Pink',
            senderAddress: '505 Spruce Lane, Meadows',
            senderPincode: '321123',
            senderState: 'Indiana',
            senderCountry: 'USA',
            senderPhone: '+1 555-787-8989',
            receiverName: 'Jack Gray',
            receiverAddress: '606 Aspen Avenue, Seaview',
            receiverPincode: '789321',
            receiverState: 'Oregon',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-909-1010',
        },
        {
            id: 7,
            packageName: 'Sample Package 7',
            weight: '3.5kg',
            length: '28cm',
            width: '22cm',
            volume: '3500cm³',
            senderName: 'Kate Red',
            senderAddress: '707 Elmwood Drive, Bayside',
            senderPincode: '456123',
            senderState: 'Massachusetts',
            senderCountry: 'USA',
            senderPhone: '+1 555-212-3232',
            receiverName: 'Leo Orange',
            receiverAddress: '808 Oakridge Road, Harborview',
            receiverPincode: '987654',
            receiverState: 'Maryland',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-434-5454',
        },
        {
            id: 8,
            packageName: 'Sample Package 8',
            weight: '8kg',
            length: '50cm',
            width: '35cm',
            volume: '8000cm³',
            senderName: 'Mia Brown',
            senderAddress: '909 Pine Grove, Valley',
            senderPincode: '654321',
            senderState: 'Virginia',
            senderCountry: 'USA',
            senderPhone: '+1 555-656-7676',
            receiverName: 'Noah White',
            receiverAddress: '1010 Cherry Hill, Ridgeview',
            receiverPincode: '321654',
            receiverState: 'Kentucky',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-878-9898',
        },
        {
            id: 9,
            packageName: 'Sample Package 9',
            weight: '2.5kg',
            length: '15cm',
            width: '12cm',
            volume: '1800cm³',
            senderName: 'Olivia Green',
            senderAddress: '111 Willowbrook Road, Timberland',
            senderPincode: '987321',
            senderState: 'North Carolina',
            senderCountry: 'USA',
            senderPhone: '+1 555-909-1111',
            receiverName: 'Peter Blue',
            receiverAddress: '1212 Birchwood Avenue, Mountain Ridge',
            receiverPincode: '654123',
            receiverState: 'South Carolina',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-232-3434',
        },
        {
            id: 10,
            packageName: 'Sample Package 10',
            weight: '4.5kg',
            length: '25cm',
            width: '20cm',
            volume: '3000cm³',
            senderName: 'Quinn Black',
            senderAddress: '1313 Redwood Circle, Plains',
            senderPincode: '321789',
            senderState: 'Colorado',
            senderCountry: 'USA',
            senderPhone: '+1 555-454-5656',
            receiverName: 'Rachel Yellow',
            receiverAddress: '1414 Maple Grove, Summit',
            receiverPincode: '123654',
            receiverState: 'Wyoming',
            receiverCountry: 'USA',
            receiverPhone: '+1 555-676-7878',
        },
    ];
    const trucks = [
        {
            id: 1,
            ownerName: "John Trucking Co.",
            truckNumber: "TX1234",
            truckName: "TX1234 Model X",
            height: "3.5m",
            width: "2.5m",
            length: "8m",
            volume: "70m³",
            capacity: "15 tons",
            usage: "Limited",
        },
        {
            id: 2,
            ownerName: "Blue Line Logistics",
            truckNumber: "BL5678",
            truckName: "BL5678 Model Y",
            height: "3.2m",
            width: "2.4m",
            length: "7.5m",
            volume: "60m³",
            capacity: "12 tons",
            usage: "Limited",
        },
        {
            id: 3,
            ownerName: "Green Haulage",
            truckNumber: "GH9012",
            truckName: "GH9012 Model Z",
            height: "4m",
            width: "2.6m",
            length: "9m",
            volume: "85m³",
            capacity: "20 tons",
            usage: "Limited",
        },
        {
            id: 4,
            ownerName: "Express Movers",
            truckNumber: "EM3456",
            truckName: "EM3456 Model A",
            height: "3.8m",
            width: "2.5m",
            length: "8.5m",
            volume: "75m³",
            capacity: "18 tons",
            usage: "Limited",
        },
        {
            id: 5,
            ownerName: "Rapid Freight",
            truckNumber: "RF7890",
            truckName: "RF7890 Model B",
            height: "3.6m",
            width: "2.5m",
            length: "8.2m",
            volume: "72m³",
            capacity: "16 tons",
            usage: "Limited",
        },
        {
            id: 6,
            ownerName: "Swift Carriers",
            truckNumber: "SC1235",
            truckName: "SC1235 Model C",
            height: "3.7m",
            width: "2.4m",
            length: "8.8m",
            volume: "78m³",
            capacity: "17 tons",
            usage: "Limited",
        },
        {
            id: 7,
            ownerName: "Prime Transport",
            truckNumber: "PT5679",
            truckName: "PT5679 Model D",
            height: "3.9m",
            width: "2.5m",
            length: "9.5m",
            volume: "90m³",
            capacity: "22 tons",
            usage: "Limited",
        },
        {
            id: 8,
            ownerName: "Elite Freight",
            truckNumber: "EF8901",
            truckName: "EF8901 Model E",
            height: "3.4m",
            width: "2.6m",
            length: "7.8m",
            volume: "68m³",
            capacity: "14 tons",
            usage: "Limited",
        },
        {
            id: 9,
            ownerName: "Pioneer Haulage",
            truckNumber: "PH2345",
            truckName: "PH2345 Model F",
            height: "3.3m",
            width: "2.5m",
            length: "8m",
            volume: "70m³",
            capacity: "15 tons",
            usage: "Limited",
        },
        {
            id: 10,
            ownerName: "Cargo Pros",
            truckNumber: "CP6789",
            truckName: "CP6789 Model G",
            height: "4.1m",
            width: "2.7m",
            length: "9.2m",
            volume: "92m³",
            capacity: "24 tons",
            usage: "Limited",
        },
    ];

    const steps = ['Select Packages', 'Select Truck', 'Review Order'];

    const handleCreateOrder = () => {
        console.log("Final Packages are: ", selectedPackages)
        console.log("Final Trucks Selections are: ", selectedTrucks)
    }
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
                        <PackagesTable packages={packages} />
                    </div>
                )}

                {activeStep === 1 && (
                    <div>
                        <Typography variant="h6">Select Truck</Typography>
                        <TrucksTable trucks={trucks} />
                        <MapComponent />
                    </div>
                )}

                {activeStep === 2 && (
                    <div>
                        <Typography variant="h6">Review Your Order</Typography>
                        <div>
                            <strong>Selected Packages:</strong>
                            {selectedPackages.map((pkg, index: number) => (
                                <div key={index}>{pkg.packageName}</div>
                            ))}
                        </div>

                        <div >
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
                            className={styles.nextButton}
                            onClick={handleCreateOrder}
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            className={styles.nextButton}
                            onClick={() => setActiveStep((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CreateOrder

