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
    console.log("orderData: ", orderData);

    return (
        <Box sx={{ p: 3 }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            {orderData && (
                <Paper sx={{ p: 3, mb: 3, }}>
                    <Typography variant="h6" gutterBottom sx={{ color: "#83214F", fontWeight: 'bold' }}>
                        Order Details
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Order ID: <strong>{orderData.order_ID}</strong></Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Scenario:  <strong>{orderData.scenario_label}</strong> </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Total Cost: <strong>₹{orderData.total_cost}</strong> </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Created (Date & Time):  <strong>{new Date(orderData.created_at).toLocaleString()}</strong></Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <Typography variant="body1">Updated (Date & Time):  <strong>{new Date(orderData.updated_at).toLocaleString()}</strong></Typography>
                        </Grid> */}
                    </Grid>
                </Paper>
            )}

            {orderData?.allocations && <Allocations allocations={orderData.allocations} />}
        </Box>
    );
};

export default OrderDetailedOverview;
