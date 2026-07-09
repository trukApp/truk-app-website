"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Vehicle } from "@/types/vehicle";
import TableToolbar from "./TableToolbar";
import VehicleDrawer from "../VehicleDrawer";
import { getVehicleColumns } from "./columns";
import VehicleGeoFenceDialog from "../VehicleGeoFenceDialog";
// interface Props {
//   vehicles: Vehicle[];
// }
interface Props {
  vehicles: Vehicle[];
  onTrackVehicle: (vehicle: Vehicle) => void;
}

export default function VehicleTable({ vehicles, onTrackVehicle }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [geoFenceOpen, setGeoFenceOpen] = useState(false);
  const openGeoFence = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setGeoFenceOpen(true);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDrawerOpen(true);
  };
  const closeGeoFence = () => {
    setGeoFenceOpen(false);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.driverName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" ? true : vehicle.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, status]);

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          mt: 3,
        }}
      >
        <CardContent>
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
          />
          <DataGrid
            autoHeight
            rows={filteredVehicles}
            // columns={getVehicleColumns({
            //   onView: openDrawer,
            //   onTrack: onTrackVehicle,
            // })}
            columns={getVehicleColumns({
              onView: openDrawer,
              onTrack: onTrackVehicle,
              onGeoFence: openGeoFence,
            })}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              mt: 2,
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#F8FAFC",
                fontWeight: 700,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#FFF7ED",
              },
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        </CardContent>
      </Card>

      <VehicleDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        vehicle={selectedVehicle}
      />

      <VehicleGeoFenceDialog
        open={geoFenceOpen}
        onClose={closeGeoFence}
        vehicle={selectedVehicle}
      />
    </>
  );
}
