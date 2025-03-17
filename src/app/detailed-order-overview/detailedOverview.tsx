'use client';
import React from "react";
import { useGetOrderByIdQuery } from "@/api/apiSlice";
import { Backdrop, CircularProgress, Grid, Paper, Typography, Box } from "@mui/material";
import Allocations from "@/Components/OrderOverViewAllocations/Allocations";
import { useSearchParams } from 'next/navigation';

const OrderDetailedOverview: React.FC = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_ID') || '';
    const { data: order, isLoading } = useGetOrderByIdQuery({ orderId });
    const orderData = order?.order;
    const allocatedPackageDetails = order?.allocated_packages_details
    // console.log("orderData: ", orderData);
    console.log("allocatedPackageDetails: ", allocatedPackageDetails)

    return (
        <Box sx={{ p: {xs:0.2 , md:3} }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            {orderData && (
                <Paper sx={{ p: 3, mb: 3, }}> 
                    <Typography variant="h6" gutterBottom sx={{ color: "#83214F", fontWeight: 'bold' }}>
                        Order Details
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: {xs:0.2 , md:2} }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{fontSize:{xs:'15px', md:'17px'}}}>Order ID: <strong>{orderData.order_ID}</strong></Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{fontSize:{xs:'15px', md:'17px'}}}>Scenario:  <strong>{orderData.scenario_label}</strong> </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{fontSize:{xs:'15px', md:'17px'}}}>Total Cost: <strong>₹{orderData.total_cost}</strong> </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{fontSize:{xs:'15px', md:'17px'}}}>Created at:  <strong>{new Date(orderData.created_at).toLocaleString()}</strong></Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {orderData?.allocations && <Allocations allocations={orderData.allocations} orderId={orderData.order_ID} allocatedPackageDetails={allocatedPackageDetails} />}
        </Box>
    );
};

export default OrderDetailedOverview;
