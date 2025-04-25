'use client';
import React, { useState } from 'react';
import {
    TextField,
    MenuItem,
    Box,
    Grid,
    Typography,
} from '@mui/material';
import CustomerForm from '@/Components/BusinessPartnersForms/CustomerForm';
import DriverForm from '@/Components/BusinessPartnersForms/DriverForm';
import SuppilerForm from '@/Components/BusinessPartnersForms/SuppilerForm';
import CarriersForm from '@/Components/BusinessPartnersForms/CarriersForm';
import { withAuthComponent } from '@/Components/WithAuthComponent';

const BusinessPartnersPage: React.FC = () => {
    const [businessPartnerType, setBusinessPartnerType] = useState('customers');
    const handleDropdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessPartnerType(event.target.value);
    };
    return (
        <Box
            sx={{ margin: { xs: "18px 3px", md: "10px 30px" } }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom color='primary'>
                    Business Partners Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Select and manage different types of business partners such as customers, vendors, carriers, and drivers. Each partner type has its own form for detailed information and setup.
                </Typography>
            </Box>
            <Grid container spacing={2} justifyContent="flex-end">
                <Grid item xs={12} md={3} >
                    <TextField
                        size="small"
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
                        {/* <MenuItem value="agents">Agents</MenuItem> */}
                        <MenuItem value="drivers">Drivers</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Grid container sx={{ marginTop: 2 }}>
                {/* Responsive rendering of forms */}
                <Grid item xs={12}  >
                    {businessPartnerType === 'customers' && <CustomerForm />}
                    {businessPartnerType === 'suppliers' && <SuppilerForm />}
                    {businessPartnerType === 'carriers' && <CarriersForm />}
                    {/* {businessPartnerType === 'agents' && <AgentForm />} */}
                    {businessPartnerType === 'drivers' && <DriverForm />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default withAuthComponent(BusinessPartnersPage);
