// import React, { useState } from 'react';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { Box, IconButton, Typography } from '@mui/material';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';

// interface Allocation {
//     vehicle_ID: string;
//     totalWeightCapacity: number;
//     totalVolumeCapacity: number;
//     leftoverWeight: number;
//     leftoverVolume: number;
// }

// interface Truck {
//     label: string;
//     totalCost: number;
//     allocations: Allocation[];
//     unallocatedPackages: string[];
// }

// interface TrucksTableProps {
//     trucks: Truck[];
// }

// const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
//     const [expandedRow, setExpandedRow] = useState<string | null>(null);

//     const toggleExpandRow = (label: string) => {
//         setExpandedRow(expandedRow === label ? null : label);
//     };

//     const columns: GridColDef[] = [
//         {
//             field: 'label',
//             headerName: 'Label',
//             width: 250,
//             renderCell: (params) => (
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={() => toggleExpandRow(params.row.label)}>
//                     {/* Show expand/collapse button only for trucks, not for allocations */}
//                     {params.value}
//                     {!params.row.isAllocation && (
//                         <IconButton size="small" >
//                             {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
//                         </IconButton>
//                     )}
//                 </Box>
//             ),
//         },
//         { field: 'totalCost', headerName: 'Total Cost', width: 180 },
//         {
//             field: 'unallocatedPackages',
//             headerName: 'Unallocated Packages',
//             width: 250,
//             renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value || 'N/A',
//         },
//     ];

//     const rows = trucks.flatMap((truck) => [
//         { id: truck.label, ...truck, isAllocation: false }, // Parent row (Truck)
//         ...(expandedRow === truck.label
//             ? truck.allocations.map((allocation) => ({
//                 id: `${truck.label}-${allocation.vehicle_ID}`,
//                 label: `🚛 Vehicle ID: ${allocation.vehicle_ID}`,
//                 totalCost: `Weight: ${allocation.totalWeightCapacity} kg`,
//                 unallocatedPackages: `Volume: ${allocation.totalVolumeCapacity} m³`,
//                 isAllocation: true, // Flag to differentiate rows
//             }))
//             : []),
//     ]);

//     return (
//         <Box sx={{ height: 500, width: '100%' }}>
//             <Typography variant="h6">Suggested Trucks</Typography>
//             <DataGrid
//                 rows={rows}
//                 columns={columns}
//                 getRowId={(row) => row.id}
//                 hideFooter
//                 // disableSelectionOnClick
//                 sx={{
//                     '& .MuiDataGrid-row': {
//                         '&.Mui-selected': { backgroundColor: 'transparent !important' },
//                     },
//                 }}
//                 getRowClassName={(params) => (params.row.isAllocation ? 'child-row' : '')} // Style child rows differently
//             />
//         </Box>
//     );
// };

// export default TrucksTable;



import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Checkbox } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAppDispatch } from "@/store";
import { setSelectedTrucks } from "@/store/authSlice";

export interface Allocation {
    vehicle_ID: string;
    totalWeightCapacity: number;
    totalVolumeCapacity: number;
    leftoverWeight: number;
    leftoverVolume: number;
    cost: number
}

export interface Truck {
    label: string;
    totalCost: number;
    allocations: Allocation[];
    unallocatedPackages: string[];
}

interface TrucksTableProps {
    trucks: Truck[];
}

const TrucksTable: React.FC<TrucksTableProps> = ({ trucks }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
    const dispatch = useAppDispatch();

    const toggleExpandRow = (label: string) => {
        setExpandedRow(expandedRow === label ? null : label);
    };

    const handleSelectTruck = (truck: Truck) => {
        const isSelected = selectedTruck?.label === truck.label;
        const newSelectedTruck = isSelected ? null : truck; // Toggle selection

        setSelectedTruck(newSelectedTruck);
        dispatch(setSelectedTrucks(newSelectedTruck ? [newSelectedTruck] : []));
    };

    // const columns: GridColDef[] = [
    //     {
    //         field: "select",
    //         headerName: "Select",
    //         width: 80,
    //         renderCell: (params) => (
    //             <Checkbox
    //                 checked={selectedTruck?.label === params.row.label}
    //                 onChange={() => handleSelectTruck(params.row)}
    //                 disabled={params.row.isAllocation} // Disable for allocation rows
    //             />
    //         ),
    //     },
    //     {
    //         field: "label",
    //         headerName: "Label",
    //         width: 250,
    //         renderCell: (params) => (
    //             <Box
    //                 sx={{ display: "flex", alignItems: "center", gap: 1 }}
    //                 onClick={() => toggleExpandRow(params.row.label)}
    //             >
    //                 {params.value}
    //                 {!params.row.isAllocation && (
    //                     <IconButton size="small">
    //                         {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
    //                     </IconButton>
    //                 )}
    //             </Box>
    //         ),
    //     },
    //     { field: "totalCost", headerName: "Total Cost", width: 180 },
    //     {
    //         field: "unallocatedPackages",
    //         headerName: "Unallocated Packages",
    //         width: 250,
    //         renderCell: (params) =>
    //             Array.isArray(params.value) ? params.value.join(", ") : params.value || "N/A",
    //     },
    // ];

    // const rows = trucks.flatMap((truck) => [
    //     { id: truck.label, ...truck, isAllocation: false }, // Parent row (Truck)
    //     ...(expandedRow === truck.label
    //         ? [
    //             {
    //                 id: `${truck.label}-header`,
    //                 label: "🚛 Vehicle Allocations",
    //                 totalCost: "Weight Capacity",
    //                 unallocatedPackages: "Volume Capacity",
    //                 isAllocation: "header",
    //             }, // Header row for allocation details
    //             ...truck.allocations.map((allocation) => ({
    //                 id: `${truck.label}-${allocation.vehicle_ID}`,
    //                 label: `Vehicle ID: ${allocation.vehicle_ID}`,
    //                 totalCost: `${allocation.totalWeightCapacity} kg`,
    //                 unallocatedPackages: `${allocation.totalVolumeCapacity} m³`,
    //                 isAllocation: true,
    //             })),
    //         ]
    //         : []
    //     ),
    // ]);

    // const columns: GridColDef[] = [
    //     {
    //         field: "select",
    //         headerName: "Select",
    //         width: 80,
    //         renderCell: (params) => (
    //             <Checkbox
    //                 checked={selectedTruck?.label === params.row.label}
    //                 onChange={() => handleSelectTruck(params.row)}
    //                 disabled={params.row.isAllocation} // Disable for allocation rows
    //             />
    //         ),
    //     },
    //     {
    //         field: "label",
    //         headerName: "Label",
    //         width: 250,
    //         renderCell: (params) => (
    //             <Box
    //                 sx={{ display: "flex", alignItems: "center", gap: 1 }}
    //                 onClick={() => toggleExpandRow(params.row.label)}
    //             >
    //                 {params.value}
    //                 {!params.row.isAllocation && (
    //                     <IconButton size="small">
    //                         {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
    //                     </IconButton>
    //                 )}
    //             </Box>
    //         ),
    //     },
    //     { field: "totalCost", headerName: "Total Weight Capacity", width: 180 },
    //     { field: "unallocatedPackages", headerName: "Total Volume Capacity", width: 180 },
    //     { field: "cost", headerName: "Cost", width: 120 },
    //     { field: "leftoverWeight", headerName: "Leftover Weight", width: 150 },
    //     { field: "leftoverVolume", headerName: "Leftover Volume", width: 150 },
    // ];

    // const rows = trucks.flatMap((truck) => [
    //     { id: truck.label, ...truck, isAllocation: false }, // Parent row (Truck)
    //     ...(expandedRow === truck.label
    //         ? [
    //             {
    //                 id: `${truck.label}-header`,
    //                 label: "🚛 Vehicle Allocations",
    //                 totalCost: "Weight Capacity",
    //                 unallocatedPackages: "Volume Capacity",
    //                 cost: "Cost",
    //                 leftoverWeight: "Leftover Weight",
    //                 leftoverVolume: "Leftover Volume",
    //                 isAllocation: "header",
    //             }, // Header row for allocation details
    //             ...truck.allocations.map((allocation) => ({
    //                 id: `${truck.label}-${allocation.vehicle_ID}`,
    //                 label: `Vehicle ID: ${allocation.vehicle_ID}`,
    //                 totalCost: `${allocation.totalWeightCapacity} kg`,
    //                 unallocatedPackages: `${allocation.totalVolumeCapacity} m³`,
    //                 cost: `${allocation.cost}`,
    //                 leftoverWeight: `${allocation.leftoverWeight} kg`,
    //                 leftoverVolume: `${allocation.leftoverVolume} m³`,
    //                 isAllocation: true,
    //             })),
    //         ]
    //         : []
    //     ),
    // ]);

    const columns: GridColDef[] = [
        {
            field: "select",
            headerName: "Select",
            width: 80,
            renderCell: (params) =>
                !params.row.isAllocation && ( // Show only for parent rows
                    <Checkbox
                        checked={selectedTruck?.label === params.row.label}
                        onChange={() => handleSelectTruck(params.row)}
                    />
                ),
        },
        {
            field: "label",
            headerName: "Label",
            width: 250,
            renderCell: (params) => (
                <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    onClick={() => toggleExpandRow(params.row.label)}
                >
                    {params.value}
                    {!params.row.isAllocation && (
                        <IconButton size="small">
                            {expandedRow === params.row.label ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    )}
                </Box>
            ),
        },
        { field: "totalCost", headerName: "Total Weight Capacity", width: 180 },
        { field: "unallocatedPackages", headerName: "Total Volume Capacity", width: 180 },

        // Hide cost-related headers in parent rows
        {
            field: "cost",
            headerName: expandedRow ? "Cost" : "", // Show header only when expanded
            width: 120,
            renderCell: (params) => (params.row.isAllocation ? params.value : ""),
        },
        {
            field: "leftoverWeight",
            headerName: expandedRow ? "Leftover Weight" : "", // Show header only when expanded
            width: 150,
            renderCell: (params) => (params.row.isAllocation ? `${params.value} kg` : ""),
        },
        {
            field: "leftoverVolume",
            headerName: expandedRow ? "Leftover Volume" : "", // Show header only when expanded
            width: 150,
            renderCell: (params) => (params.row.isAllocation ? `${params.value} m³` : ""),
        },
    ];


    const rows = trucks.flatMap((truck) => [
        {
            id: truck.label,
            label: truck.label,
            totalCost: truck.totalCost,
            unallocatedPackages: truck.unallocatedPackages, // Display as a comma-separated list
            isAllocation: false, // Parent row
        },
        ...(expandedRow === truck.label
            ? [
                {
                    id: `${truck.label}-header`,
                    label: "🚛 Vehicle Allocations",
                    totalCost: "Total Weight Capacity",
                    unallocatedPackages: "Total Volume Capacity",
                    cost: "Cost",
                    leftoverWeight: "Leftover Weight",
                    leftoverVolume: "Leftover Volume",
                    isAllocation: "header",
                }, // Header row for allocation details
                ...truck.allocations.map((allocation) => ({
                    id: `${truck.label}-${allocation.vehicle_ID}`,
                    label: `Vehicle ID: ${allocation.vehicle_ID}`,
                    totalCost: `${allocation.totalWeightCapacity} kg`,
                    unallocatedPackages: `${allocation.totalVolumeCapacity} m³`,
                    cost: allocation.cost,
                    leftoverWeight: allocation.leftoverWeight,
                    leftoverVolume: allocation.leftoverVolume,
                    isAllocation: true,
                })),
            ]
            : []
        ),
    ]);


    return (
        <Box sx={{ height: 500, width: "100%" }}>
            <Typography variant="h6">Suggested Trucks</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                hideFooter
                sx={{
                    "& .MuiDataGrid-row": {
                        "&.Mui-selected": { backgroundColor: "transparent !important" },
                    },
                }}
                getRowClassName={(params) => (params.row.isAllocation ? "child-row" : "")} // Style child rows differently
            />
        </Box>
    );
};

export default TrucksTable;
