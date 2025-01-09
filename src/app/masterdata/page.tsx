'use client';
import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Vehicles from "@/Components/MasterDataComponents/Vehicles";
import UnitsOfMeasurement from "@/Components/MasterDataComponents/UnitsOfMeasurement";
import Locations from "@/Components/MasterDataComponents/Locations";
import PackagingInfo from "@/Components/MasterDataComponents/PackagingInfo";
import Lanes from "@/Components/MasterDataComponents/Lanes";
// import VehicleGroup from "@/Components/MasterDataComponents/VehicleGroup";
import DeviceMaster from "@/Components/MasterDataComponents/DeviceMaster";

const MasterData: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("Locations");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const renderComponent = () => {
    switch (selectedTab) {
      case "Vehicles":
        return <Vehicles />;
      // case "Vehicle group":
      //   return <VehicleGroup />;
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

  return (
    <Box sx={{ margin: { xs: "0px", md: "0px 30px" } }}>
      {/* Tabs Menu */}
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          marginBottom: "10px",
          "& .MuiTabs-indicator": {
            backgroundColor: "#1976d2",
          },
        }}
      >
        <Tab value="Vehicles" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Vehicles" />
        {/* <Tab value="Vehicle group" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Vehicle Group" /> */}
        <Tab value="Device master"  sx={{textTransform:'capitalize',fontSize:'16px'}} label="Device Master" />
        <Tab value="Lanes" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Lanes" />
        <Tab value="Locations" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Locations" />
        <Tab value="Packaging Info" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Packaging Info" />
        <Tab value="Uom" sx={{textTransform:'capitalize',fontSize:'16px'}} label="Units of Measurement" />
      </Tabs>

      {/* Render Selected Component */}
      <Box>{renderComponent()}</Box>
    </Box>
  );
};

export default MasterData;
