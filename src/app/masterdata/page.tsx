'use client';
import React, { useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Vehicles from "@/Components/Vehicles";
import Lanes from "@/Components/Lanes";
import Locations from "@/Components/Locations";
import PackagingInfo from "@/Components/PackagingInfo";

const MasterData: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Vehicles");

  const renderComponent = () => {
    switch (selectedOption) {
      case "Vehicles":
        return <Vehicles />;
      case "Lanes":
        return <Lanes />;
      case "Locations":
        return <Locations />;
      case "Packaging Info":
        return <PackagingInfo />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        // maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <FormControl fullWidth sx={{ marginBottom: "10px",width:'200px' , height:'40px' }}>
        {/* <InputLabel id="master-data-select-label">Select Option</InputLabel> */}
        <Select 
          labelId="master-data-select-label"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <MenuItem value="Vehicles">Vehicles</MenuItem>
          <MenuItem value="Lanes">Lanes</MenuItem>
          <MenuItem value="Locations">Locations</MenuItem>
          <MenuItem value="Packaging Info">Packaging Info</MenuItem>
        </Select>
      </FormControl>
      <Box>{renderComponent()}</Box>
    </Box>
  );
};

export default MasterData;
