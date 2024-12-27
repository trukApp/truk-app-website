'use client';
import React, { useState } from 'react';
import {
    TextField,
    MenuItem,
    Box,
    Grid,
} from '@mui/material';
import CustomerForm from '@/Components/BusinessPartnersForms/CustomerForm';
import DriverForm from '@/Components/BusinessPartnersForms/DriverForm';
import SuppilerForm from '@/Components/BusinessPartnersForms/SuppilerForm';
import CarriersForm from '@/Components/BusinessPartnersForms/CarriersForm';
import AgentForm from '@/Components/BusinessPartnersForms/AgentForm';
import styles from './businessPartners.module.css';

const BusinessPartnersPage: React.FC = () => {
    const [businessPartnerType, setBusinessPartnerType] = useState('customers');

    const handleDropdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessPartnerType(event.target.value);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <div className={styles.dropDownContainer}>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            select
                            label="Business Partner Type"
                            name="businessPartnerType"
                            value={businessPartnerType}
                            onChange={handleDropdownChange}
                        >
                            <MenuItem value="customers">Customers</MenuItem>
                            <MenuItem value="suppliers">Vendors</MenuItem>
                            <MenuItem value="carriers">Carriers</MenuItem>
                            <MenuItem value="agents">Agents</MenuItem>
                            <MenuItem value="drivers">Drivers</MenuItem>
                        </TextField>
                    </Grid>
                </div>
            </Grid>
            <Grid container className={styles.businessPartnerContainer}>
                {businessPartnerType === 'customers' && <CustomerForm />}
                {businessPartnerType === 'suppliers' && <SuppilerForm />}
                {businessPartnerType === 'carriers' && <CarriersForm />}
                {businessPartnerType === 'agents' && <AgentForm />}
                {businessPartnerType === 'drivers' && <DriverForm />}
            </Grid>
        </Box>
    );
};

export default BusinessPartnersPage;
