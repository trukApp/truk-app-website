'use client';
import React, { useState } from 'react';
import { Tabs, Tab, Box, Grid } from '@mui/material';
import GeneralData from '@/Components/GeneralData/GeneralData';
import BusinessPartnerDetails from '@/Components/BusinessPartnerDetails/BusinessPartnerDetails';
import DeliveryDetails from '@/Components/DeliveryDetails/DeliveryDetails';
import Notes from '@/Components/Notes/Notes';
import Attachments from '@/Components/Attachments/Attachments';
import Statuses from '@/Components/Statuses/Statuses';
import DocumentFlow from '@/Components/DocumentFlow/DocumentFlow';
import ExecutionFlow from '@/Components/ExecutionFlow/ExecutionFlow';


// Define the type for tabs
type TabIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const PackageOverview: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<TabIndex>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: TabIndex) => {
        setSelectedTab(newValue);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0:
                return <GeneralData />;
            case 1:
                return <BusinessPartnerDetails />;
            case 2:
                return <DeliveryDetails />;
            case 3:
                return <Notes />;
            case 4:
                return <Attachments />;
            case 5:
                return <Statuses />;
            case 6:
                return <DocumentFlow />;
            case 7:
                return <ExecutionFlow />;
            default:
                return <div>Tab not found</div>;
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Tabs */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Create Package Tabs"
            >
                <Tab label="General Data" />
                <Tab label="Business Partner Details" />
                <Tab label="Delivery Details" />
                <Tab label="Notes" />
                <Tab label="Attachments" />
                <Tab label="Statuses" />
                <Tab label="Document Flow" />
                <Tab label="Execution Flow" />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {renderTabContent()}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default PackageOverview;
