"use client";

import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { Vehicle } from "@/types/vehicle";

interface Props {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (vehicle: Vehicle | null) => void;
}

const getMarkerIcon = (vehicle: Vehicle, selectedVehicle: Vehicle | null) => {
  // Selected Vehicle
  if (selectedVehicle?.id === vehicle.id) {
    return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
  }

  switch (vehicle.status) {
    case "Moving":
      return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";

    case "Idle":
      return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    case "Stopped":
      return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

    default:
      return "http://maps.google.com/mapfiles/ms/icons/purple-dot.png";
  }
};

export default function MapMarkers({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}: Props) {
  // If no vehicle is selected, display all vehicles.
  const markers =
    selectedVehicle == null
      ? vehicles
      : vehicles.filter((vehicle) => vehicle.id === selectedVehicle.id);

  return (
    <>
      {markers.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={{
            lat: vehicle.latitude,
            lng: vehicle.longitude,
          }}
          icon={{
            url: getMarkerIcon(vehicle, selectedVehicle),
          }}
          animation={google.maps.Animation.DROP}
          onClick={() => onSelectVehicle(vehicle)}
        />
      ))}

      {selectedVehicle && (
        <InfoWindow
          position={{
            lat: selectedVehicle.latitude,
            lng: selectedVehicle.longitude,
          }}
          // onCloseClick={() => onSelectVehicle(selectedVehicle)}
          onCloseClick={() => onSelectVehicle(null)}
        >
          <div
            style={{
              minWidth: 260,
              maxWidth: 320,
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: 10,
                color: "#F08C24",
              }}
            >
              🚚 {selectedVehicle.vehicleNumber}
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td>
                    <strong>Driver</strong>
                  </td>
                  <td>{selectedVehicle.driverName}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Status</strong>
                  </td>
                  <td>{selectedVehicle.status}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Speed</strong>
                  </td>
                  <td>{selectedVehicle.speed} km/h</td>
                </tr>

                <tr>
                  <td>
                    <strong>Fuel</strong>
                  </td>
                  <td>{selectedVehicle.fuelLevel}%</td>
                </tr>

                <tr>
                  <td>
                    <strong>Engine</strong>
                  </td>
                  <td>{selectedVehicle.engineOn ? "ON" : "OFF"}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Location</strong>
                  </td>
                  <td>{selectedVehicle.location}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Updated</strong>
                  </td>
                  <td>{selectedVehicle.lastUpdated}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
