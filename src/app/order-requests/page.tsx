'use client';
import React, { useState } from 'react';
import { useGetCarrierAssignmentReqQuery } from '@/api/apiSlice';
import { Visibility } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  CircularProgress,
  Typography,
  Chip, 
  IconButton,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';


interface CarrierAssignment {
  cas_ID: string;
  order_ID: string;
  assignment_status: string;
  scenario_label: string;
  assigned_time: string;
  confirmed_time?: string;
  allocated_vehicles?: string[]; // or a more specific type if available
  allocated_packages?: string[]; // or a more specific type if available
  start_loc_ID: string;
  end_loc_ID: string;
  assignment_cost?: {
    total_distance?: string;
    cost_criteria_considered?: string;
    // total_weight?: string;
  };
  confirmed_to?: string;
  created_at: string;
  updated_at: string;
}


const OrderRequests: React.FC = () => {
    const router = useRouter();
     const [loading, setLoading] = useState(false)
  const carrier_ID = 'CR000008';
  const { data: carrierAssignments, isLoading: carrLoading } =
    useGetCarrierAssignmentReqQuery({ carrier_ID });

  const assignments = carrierAssignments?.assignments || [];

  const handleNavigateToOrder = (orderId: string) => {
        setLoading(true)
        router.push(`/detailed-carrier-overview?order_ID=${orderId}&from=${carrier_ID}`);
    }
  const columns: GridColDef[] = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'cas_ID', headerName: 'Assignment ID', width: 160 },
    { field: 'order_ID', headerName: 'Order ID', width: 130 },
    { field: 'assignment_status', headerName: 'Status', width: 130, renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'Confirmed'
              ? 'success'
              : params.value === 'Rejected'
              ? 'error'
              : 'warning'
          }
          size="small"
        />
      ),
    },
    { field: 'scenario_label', headerName: 'Scenario', width: 180 },
    { field: 'assigned_time', headerName: 'Assigned Time', width: 180 },
    { field: 'confirmed_time', headerName: 'Confirmed Time', width: 180 },
    {
      field: 'allocated_vehicles',
      headerName: 'Vehicles',
      width: 180,
      renderCell: (params) =>
        params.value?.map((v: string, idx: number) => (
          <Chip key={idx} label={v} size="small" sx={{ mr: 0.5 }} />
        )),
    },
    {
      field: 'allocated_packages',
      headerName: 'Packages',
      width: 180,
      renderCell: (params) =>
        params.value?.map((p: string, idx: number) => (
          <Chip key={idx} label={p} size="small" sx={{ mr: 0.5 }} />
        )),
    },
    { field: 'start_loc_ID', headerName: 'Start Location', width: 150 },
    { field: 'end_loc_ID', headerName: 'End Location', width: 150 }, 
    { field: 'total_distance', headerName: 'Distance (km)', width: 130 }, 
    { field: 'confirmed_to', headerName: 'Confirmed To', width: 130 },
    { field: 'created_at', headerName: 'Created At', width: 210 },
      { field: 'updated_at', headerName: 'Updated At', width: 210 },
        {
          field: 'view',
          headerName: 'View',
          width: 100,
          sortable: false,
          renderCell: (params: GridRenderCellParams) => (
            <IconButton onClick={() => handleNavigateToOrder(params.row.order_ID)} sx={{ color: "#83214F" }}>
              <Visibility />
            </IconButton>
          ),
        },
  ];

  const rows = assignments.map((a: CarrierAssignment, idx: number) => ({
    id: idx + 1,
    cas_ID: a.cas_ID,
    order_ID: a.order_ID,
    assignment_status: a.assignment_status,
    scenario_label: a.scenario_label,
    assigned_time: a.assigned_time,
    confirmed_time: a.confirmed_time || '—',
    allocated_vehicles: a.allocated_vehicles || [],
    allocated_packages: a.allocated_packages || [],
    start_loc_ID: a.start_loc_ID,
    end_loc_ID: a.end_loc_ID, 
    total_distance: a.assignment_cost?.total_distance || 'N/A',
    // total_weight: a.assignment_cost?.total_weight || 'N/A',
    cost_criteria_considered: a.assignment_cost?.cost_criteria_considered || 'N/A',
    confirmed_to: a.confirmed_to || '—',
    created_at: a.created_at,
    updated_at: a.updated_at,
  }));

  return (
    <>
      <Backdrop
        open={carrLoading || loading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box p={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          📦 Carrier Assignment Requests
        </Typography>

        <Box sx={{ height: 650, mt: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // pageSize={10}
            // rowsPerPageOptions={[5, 10, 20]}
            loading={carrLoading}
            // disableSelectionOnClick
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                wordBreak: 'break-word',
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default OrderRequests;
