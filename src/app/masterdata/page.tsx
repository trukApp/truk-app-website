'use client';
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Vehicles from "@/Components/MasterDataComponents/Vehicles";
import UnitsOfMeasurement from "@/Components/MasterDataComponents/UnitsOfMeasurement";
import Locations from "@/Components/MasterDataComponents/Locations";
import PackagingInfo from "@/Components/MasterDataComponents/PackagingInfo";
import Lanes from "@/Components/MasterDataComponents/Lanes";
import VehicleGroup from "@/Components/MasterDataComponents/VehicleGroup";
import DeviceMaster from "@/Components/MasterDataComponents/DeviceMaster";


const MasterData: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Vehicles");

  const renderComponent = () => {
    switch (selectedOption) {
      case "Vehicles":
        return <Vehicles />;
      case "Vehicle group":
        return <VehicleGroup />;
      case "Device master":
        return <DeviceMaster />;
      case "Lanes":
        return <Lanes />;
      case "Locations":
        return <Locations />;
      case "Packaging Info":
        return <PackagingInfo />;
      case "Uom":
        return <UnitsOfMeasurement />;
      default:
        return null;
    }
  };

  const tiles = [
    { label: "Vehicles", value: "Vehicles" },
    { label: "Vehicle group", value: "Vehicle group" },
    { label: "Device master", value: "Device master" },
    { label: "Lanes", value: "Lanes" },
    { label: "Locations", value: "Locations" },
    { label: "Packaging Info", value: "Packaging Info" },
    { label: "Uom", value: "Uom" },
  ];

  return (
    <Box
      sx={{
        margin: {xs:'0px',md:'0px 30px'},
      }}
    >
      {/* Tile Menu */}
      <Box
         sx={{
          display: "flex",
          gap: "10px",
          marginBottom: "10px",
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "10px",
          "&::-webkit-scrollbar": {
            height: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
        }}
      >
        {tiles.map((tile) => (
          <Box
            key={tile.value}
            onClick={() => setSelectedOption(tile.value)}
            sx={{
              cursor: "pointer",
              padding: { xs: "6px 16px", sm: "6px 18px",md: "6px 20px",},
              backgroundColor: selectedOption === tile.value ? "#1976d2" : "#e0e0e0",
              color: selectedOption === tile.value ? "#fff" : "#000",
              borderRadius: "4px",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography sx={{fontSize:{xs:'14px',sm:'15px',md:'16px'}}}>{tile.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Render Selected Component */}
      <Box>{renderComponent()}</Box>
    </Box>
  );
};

export default MasterData;
