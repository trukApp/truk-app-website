"use client";

import { GridColDef } from "@mui/x-data-grid";

import { Vehicle } from "@/types/vehicle";

import VehicleAvatar from "./VehicleAvatar";
import EngineStatus from "./EngineStatus";
import LocationCell from "./LocationCell";
import IdleChip from "./IdleChip";
import StatusChip from "../StatusChip";
import VehicleActions from "./VehicleActions";

interface ColumnProps {
  onView: (vehicle: Vehicle) => void;
  onTrack: (vehicle: Vehicle) => void;
}

export const getVehicleColumns = ({
  onView,
  onTrack,
}: ColumnProps): GridColDef[] => [
  {
    field: "vehicleNumber",
    headerName: "Vehicle",
    minWidth: 190,
    flex: 1,
    sortable: true,

    renderCell: (params) => <VehicleAvatar vehicle={params.row as Vehicle} />,
  },

  {
    field: "status",
    headerName: "Status",
    minWidth: 120,

    renderCell: (params) => <StatusChip status={params.value} />,
  },

  {
    field: "speed",
    headerName: "Speed",
    minWidth: 100,

    renderCell: (params) => <strong>{params.value} km/h</strong>,
  },

  // {
  //   field: "fuelLevel",
  //   headerName: "Fuel",
  //   minWidth: 160,

  //   renderCell: (params) => <FuelProgress value={params.value} />,
  // },

  {
    field: "engineOn",
    headerName: "Engine",
    minWidth: 140,

    renderCell: (params) => <EngineStatus engineOn={params.value} />,
  },

  {
    field: "idleTime",
    headerName: "Idle Time",
    minWidth: 130,

    renderCell: (params) => <IdleChip idleTime={params.value} />,
  },

  {
    field: "todayDistance",
    headerName: "Distance",
    minWidth: 120,

    renderCell: (params) => <strong>{params.value} km</strong>,
  },

  {
    field: "location",
    headerName: "Current Location",
    minWidth: 260,
    flex: 1.5,

    renderCell: (params) => <LocationCell location={params.value} />,
  },

  {
    field: "lastUpdated",
    headerName: "Last Updated",
    minWidth: 140,

    renderCell: (params) => <span>{params.value}</span>,
  },

  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    minWidth: 150,

    // renderCell: (params) => (
    //   <VehicleActions vehicle={params.row as Vehicle} onView={onView} />
    // ),
    renderCell: (params) => (
      <VehicleActions
        vehicle={params.row as Vehicle}
        onView={onView}
        onTrack={onTrack}
      />
    ),
  },
];
