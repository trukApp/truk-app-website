"use client";
import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Vehicles from "@/Components/MasterDataComponents/Vehicles";
import UnitsOfMeasurement from "@/Components/MasterDataComponents/UnitsOfMeasurement";
import Locations from "@/Components/MasterDataComponents/Locations";
import PackagingInfo from "@/Components/MasterDataComponents/PackagingInfo";
import Lanes from "@/Components/MasterDataComponents/Lanes";
import DeviceMaster from "@/Components/MasterDataComponents/DeviceMaster";
import { withAuthComponent } from "@/Components/WithAuthComponent";
import DockForm from "@/Components/MasterDataComponents/Dock";

const MasterData: React.FC = () => {
	const [selectedTab, setSelectedTab] = useState<string>("Vehicles");

	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setSelectedTab(newValue);
	};

	const renderComponent = () => {
		switch (selectedTab) {
			// case "Vehicles":
			// 	return <Vehicles />;
			// case "Device master":
			// 	return <DeviceMaster />;
			// case "Lanes":
			// 	return <Lanes />;
			case "Locations":
				return <Locations />;
			case "Packaging Info":
				return <PackagingInfo />;
			case "Uom":
				return <UnitsOfMeasurement />;
			// case "Dock":
			// 	return <DockForm />;
			default:
				return null;
		}
	};

	return (
		<Box sx={{ margin: { xs: "0px", md: "0px 30px" } }}>
			<Box sx={{ mb: 3, mt: 2 }}>
				<Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
					Master Data Management
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Manage Foundational Data Such as Vehicles, Devices, Lanes, Locations,
					Packaging Info, and Units of Measurement. This Information is
					Essential for Smooth Operations Across your Logistics and Transport
					Workflows.
				</Typography>
			</Box>
			{/* Tabs Menu */}
			<Tabs
				value={selectedTab}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="auto"
				sx={{
					marginBottom: "10px",
					"& .MuiTabs-indicator": {
						backgroundColor: "#F08C24",
					},
				}}
			>
				{/* <Tab
					value="Vehicles"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Resources"
				/> */}
				{/* <Tab
					value="Device master"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Device Master"
				/> */}
				{/* <Tab
					value="Lanes"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Lanes"
				/> */}
				<Tab
					value="Locations"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Locations"
				/>
				<Tab
					value="Packaging Info"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Packaging Info"
				/>
				<Tab
					value="Uom"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Units of Measurement"
				/>
				{/* <Tab
					value="Dock"
					sx={{ textTransform: "capitalize", fontSize: "16px" }}
					label="Dock"
				/> */}
			</Tabs>

			{/* Render Selected Component */}
			<Box>{renderComponent()}</Box>
		</Box>
	);
};

export default withAuthComponent(MasterData);
