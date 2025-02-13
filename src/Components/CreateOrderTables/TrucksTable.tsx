import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Checkbox } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store";
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
    window.scrollTo(0, 0)
    const dispatch = useAppDispatch();
    const selectedTrucks = useAppSelector((state) => state.auth.selectedTrucks || []);
    const toggleExpandRow = (label: string) => {
        setExpandedRow(expandedRow === label ? null : label);
    };

    const handleSelectTruck = (truck: Truck) => {
        const isSelected = selectedTruck?.label === truck.label;
        const newSelectedTruck = isSelected ? null : truck;
        setSelectedTruck(newSelectedTruck);
        dispatch(setSelectedTrucks(newSelectedTruck ? [newSelectedTruck] : []));
    };

    const columns: GridColDef[] = [
        {
            field: "select",
            headerName: "Select",
            width: 80,
            renderCell: (params) =>
                !params.row.isAllocation && (
                    <Checkbox
                        checked={selectedTrucks[0]?.label === params.row.label}
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
        { field: "unallocatedPackages", headerName: "UnLocated Packages", width: 180 },

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
            // label: truck.label,
            // totalCost: truck.totalCost,
            // unallocatedPackages: truck.unallocatedPackages,
            // isAllocation: false,
            ...truck
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
                getRowClassName={(params) => (params.row.isAllocation ? "child-row" : "")}
            />
        </Box>
    );
};

export default TrucksTable;
