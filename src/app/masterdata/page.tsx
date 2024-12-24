'use client';
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Vehicles from "@/Components/Vehicles";
import Lanes from "@/Components/Lanes";
import Locations from "@/Components/Locations";
import PackagingInfo from "@/Components/PackagingInfo";
import UnitsOfMeasurement from "@/Components/UnitsOfMeasurement";
import Resources from "@/Components/Resources";

const MasterData: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Vehicles");

  const renderComponent = () => {
    switch (selectedOption) {
      case "Resources":
        return <Resources />;
      case "Vehicles":
        return <Vehicles />;
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
  { label: "Resources", value: "Resources" },
    { label: "Vehicles", value: "Vehicles" },
    { label: "Lanes", value: "Lanes" },
    { label: "Locations", value: "Locations" },
    { label: "Packaging Info", value: "Packaging Info" },
    { label: "Uom", value: "Uom" },
  ];

  return (
    <Box
      sx={{
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Tile Menu */}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        {tiles.map((tile) => (
          <Box
            key={tile.value}
            onClick={() => setSelectedOption(tile.value)}
            sx={{
              cursor: "pointer",
              padding: "10px 20px",
              backgroundColor: selectedOption === tile.value ? "#1976d2" : "#e0e0e0",
              color: selectedOption === tile.value ? "#fff" : "#000",
              borderRadius: "4px",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography>{tile.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Render Selected Component */}
      <Box>{renderComponent()}</Box>
    </Box>
  );
};

export default MasterData;
