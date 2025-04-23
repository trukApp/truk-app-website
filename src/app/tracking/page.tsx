// import React from 'react'

// const TrackingOrder = () => {
//     return (
//         <div>
//             <h1>
//                 THis is tracking Page
//             </h1>
//         </div>
//     )
// }

// export default TrackingOrder



'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GridColDef, DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, IconButton, Backdrop, CircularProgress } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useGetAllOrdersQuery } from '@/api/apiSlice';
import moment from 'moment';

interface Route {
    start: { address: string; latitude: number; longitude: number };
    end: { address: string; latitude: number; longitude: number };
    distance: string;
    duration: string;
}

interface Allocation {
    vehicle_ID: string;
    route: Route[];
    leftoverVolume: number;
    leftoverWeight: number;
    occupiedVolume: number;
    occupiedWeight: number;
    totalVolumeCapacity: number;
    totalWeightCapacity: number;
}

export interface Order {
    updated_at: string;
    created_at: string;
    unallocated_packages: string[];
    ord_id: number;
    order_ID: string;
    scenario_label: string;
    total_cost: string;
    allocations: Allocation[];
    order_status: string
}


const TrackingOrder: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});
    console.log('order :', allOrders)
    const router = useRouter();
    const ordersData = allOrders?.orders || [];
    const getAllTrackingOrders = ordersData.filter((eachOrder: Order) => {
        return eachOrder?.order_status === 'self assigned' || eachOrder?.order_status === 'finished'
    })


    if (error) {
        return <Typography color="error">Failed to load data. Try after sometime.</Typography>;
    }



    const handleViewOrder = (orderId: string) => {
        setLoading(true)
        router.push(`/detailed-order-overview?order_ID=${orderId}&from=tracking`);
    };

    const ordersColumns: GridColDef[] = [
        { field: 'order_ID', headerName: 'Order ID', width: 150 },
        { field: 'scenario_label', headerName: 'Scenario', width: 150 },
        { field: 'total_cost', headerName: 'Total Cost', width: 150 },
        { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
        { field: 'created_at', headerName: 'Created At', width: 200 },
        { field: 'order_status', headerName: 'Order status', width: 200 },
        {
            field: 'view',
            headerName: 'View',
            width: 100,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => handleViewOrder(params.row.order_ID)} sx={{ color: "#F08C24" }}>
                    <Visibility />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', marginTop: 2 }}>
            <Backdrop
                open={loading || isLoading}
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 600 }}>
                Orders List
            </Typography>
            <DataGrid
                rows={getAllTrackingOrders.map((order: Order) => ({
                    id: order.ord_id,
                    order_ID: order?.order_ID,
                    scenario_label: order?.scenario_label,
                    total_cost: order?.total_cost,
                    unallocated_packages: order?.unallocated_packages?.join(', ') || 'None',
                    order_status: order?.order_status,
                    created_at: moment(new Date(order?.created_at).toLocaleString()).format("DD MMM YYYY, hh:mm A"),


                }))}
                columns={ordersColumns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[10, 20, 30]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
            />
        </Box>
    );
};

export default TrackingOrder;
