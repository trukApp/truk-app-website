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

interface Pack {
  pack_ID: string
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
  unallocated_packages: Pack[];
  ord_id: number;
  order_ID: string;
  scenario_label: string;
  total_cost: string;
  allocations: Allocation[];
  order_status: string
}


const OrdersGrid: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { data: allOrders, error, isLoading } = useGetAllOrdersQuery({});

  const router = useRouter();



  if (error) {
    return <Typography color="error">Failed to load data. Try after sometime.</Typography>;
  }

  const ordersData = allOrders?.orders || [];
  const handleViewOrder = (orderId: string) => {
    setLoading(true)
    router.push(`/detailed-order-overview?order_ID=${orderId}&from=order-overview`);
  };

  const statusColors: Record<string, string> = {
    "assignment pending": "#FF9800", // orange
    "carrier assignment": "#2196F3", // blue
    "self assigned": "#4CAF50", // green
    "open bidding": "#9C27B0", // purple
  };

  const toPascalCase = (str: string) =>
    str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");


  // const ordersColumns: GridColDef[] = [
  //   { field: 'order_ID', headerName: 'Order ID', width: 150 },
  //   { field: 'scenario_label', headerName: 'Scenario', width: 150 },
  //   { field: 'total_cost', headerName: 'Total Cost', width: 150 },
  //   { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
  //   { field: 'created_at', headerName: 'Created At', width: 200 },
  //   { field: 'order_status', headerName: 'Order status', width: 200 },
  //   {
  //     field: 'view',
  //     headerName: 'View',
  //     width: 100,
  //     sortable: false,
  //     renderCell: (params: GridRenderCellParams) => (
  //       <IconButton onClick={() => handleViewOrder(params.row.order_ID)} sx={{ color: "#F08C24" }}>
  //         <Visibility />
  //       </IconButton>
  //     ),
  //   },
  // ];

  const ordersColumns: GridColDef[] = [
    { field: 'order_ID', headerName: 'Order ID', width: 150 },
    { field: 'scenario_label', headerName: 'Scenario', width: 150 },
    { field: 'total_cost', headerName: 'Total Cost', width: 150 },
    { field: 'unallocated_packages', headerName: 'Unallocated Packages', width: 250 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    {
      field: 'order_status',
      headerName: 'Order Status',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value || "";
        const pascalStatus = toPascalCase(status);
        return (
          <Typography
            sx={{
              fontWeight: 500,
              color: statusColors[status.toLowerCase()] || "#000",
              // textAlign: 'center',
              marginTop: 1.6,
            }}
          >
            {pascalStatus}
          </Typography>
        );
      },
    },
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
      <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
        Order Overview
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Review and Manage All Aspects of Your Order Including General Data, Partner Details, Delivery Information,
        Attachments, Statuses, and Flows. Navigate Through Each tab to see or Update Relevant Order Details.
      </Typography>
      <DataGrid
        rows={ordersData.map((order: Order) => (
          {
            id: order.ord_id,
            order_ID: order?.order_ID,
            scenario_label: order?.scenario_label,
            // total_cost: order?.total_cost,
            total_cost: parseFloat(order?.total_cost || '0').toFixed(2),
            unallocated_packages: order?.unallocated_packages?.map((pkg: Pack) => pkg.pack_ID).join(', ') || 'None',
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

export default OrdersGrid;
