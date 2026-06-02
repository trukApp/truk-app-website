// // "use client";

// // import { Box } from "@mui/material";
// // import Sidebar from '../Components/Sidebar';
// // import SettingsComponent from "@/Components/Settings/SettingsComponent";
// // import RatingsAndReviews from "@/Components/RatingsAndReview/RatingsAndReviews";
// // import TransportExecution from "@/Components/TransportExecution/TransportExecution";
// // import TransportManagement from "@/Components/TransportManagement/TransportManagement";
// // import TransportPlanning from "@/Components/TransportPlanning/TransportPlanning";

// // const Home = () => {
// // 	return (
// // 		<Box sx={{ display: "flex" }}>
// // 			<Sidebar />

// // 			<Box
// // 				sx={{
// // 					flex: 1,
// // 					ml: "290px",
// // 					mt: "70px",
// // 					p: 3,
// // 					bgcolor: "#f9fafb",
// // 					minHeight: "100vh",
// // 				}}
// // 			>
// // 				<TransportManagement />
// // 				<TransportPlanning />
// // 				<TransportExecution />
// // 				<RatingsAndReviews />
// // 				<SettingsComponent />
// // 			</Box>
// // 		</Box>
// // 	);
// // };

// // export default Home;

// "use client";

// import React from "react";

// import {
// 	Box,
// 	Card,
// 	Typography,
// 	useTheme,
// 	alpha,
// } from "@mui/material";

// import {
// 	Inventory2,
// 	ViewInAr,
// 	Route,
// 	Assignment,
// 	Gavel,
// 	MyLocation,
// 	Warehouse,
// 	VerifiedUser,
// 	Analytics,
// } from "@mui/icons-material";

// import { useRouter } from "next/navigation";
// import Sidebar from "../Components/Sidebar";

// const Home = () => {
// 	const router = useRouter();
// 	const theme = useTheme();

// 	const modules = [
// 		{
// 			title: "Create Package",
// 			description: "Mass upload option to be provided",
// 			icon: <Inventory2 sx={{ fontSize: 42 }} />,
// 			path: "/createpackage",
// 			color: "#2563eb",
// 		},
// 		{
// 			title: "Load Optimizer",
// 			description:
// 				"Load multiple packages and optimize truck loading",
// 			icon: <ViewInAr sx={{ fontSize: 42 }} />,
// 			path: "/load-optimizer",
// 			color: "#7c3aed",
// 		},
// 		{
// 			title: "Route Optimizer",
// 			description:
// 				"Select packages and optimize delivery routes",
// 			icon: <Route sx={{ fontSize: 42 }} />,
// 			path: "/route-optimizer",
// 			color: "#0f766e",
// 		},
// 		{
// 			title: "Order Manager",
// 			description:
// 				"Optimized and saved loads are created as orders",
// 			icon: <Assignment sx={{ fontSize: 42 }} />,
// 			path: "/order-overview",
// 			color: "#ea580c",
// 		},
// 		{
// 			title: "Spot Market",
// 			description:
// 				"Select orders and bid in open market",
// 			icon: <Gavel sx={{ fontSize: 42 }} />,
// 			path: "/spotauction",
// 			color: "#dc2626",
// 		},
// 		{
// 			title: "Track Order",
// 			description: "Live order tracking dashboard",
// 			icon: <MyLocation sx={{ fontSize: 42 }} />,
// 			path: "/tracking",
// 			color: "#16a34a",
// 		},
// 		{
// 			title: "Dock Manager",
// 			description: "Book docks and manage dock operations",
// 			icon: <Warehouse sx={{ fontSize: 42 }} />,
// 			path: "/dock-management",
// 			color: "#0891b2",
// 		},
// 		{
// 			title: "Gate Operations",
// 			description:
// 				"Verify documents and approve dock appointments",
// 			icon: <VerifiedUser sx={{ fontSize: 42 }} />,
// 			path: "/gate-operations",
// 			color: "#9333ea",
// 		},
// 		{
// 			title: "KPI Dashboard",
// 			description: "Graphs, KPIs and analytics",
// 			icon: <Analytics sx={{ fontSize: 42 }} />,
// 			path: "/kpi-dashboard",
// 			color: "#ca8a04",
// 		},
// 	];

// 	return (
// 		<Box sx={{ display: "flex" }}>
// 			<Sidebar />

// 			<Box
// 				sx={{
// 					flex: 1,
// 					ml: {
// 						xs: "80px",
// 						md: "290px",
// 					},
// 					mt: "70px",
// 					p: 3,
// 					bgcolor: "#f9fafb",
// 					minHeight: "100vh",
// 					transition: "all 0.3s ease",
// 				}}
// 			>
// 				<Typography
// 					variant="h4"
// 					fontWeight={700}
// 					mb={1}
// 					color="#111827"
// 				>
// 					AI Logistics Control Tower
// 				</Typography>

// 				<Typography
// 					fontSize={15}
// 					color="#6b7280"
// 					mb={4}
// 				>
// 					Centralized transport planning, execution and optimization
// 				</Typography>

// 				<Box
// 					sx={{
// 						display: "grid",
// 						gridTemplateColumns: {
// 							xs: "1fr",
// 							sm: "repeat(2, 1fr)",
// 							lg: "repeat(3, 1fr)",
// 						},
// 						gap: 3,
// 					}}
// 				>
// 					{modules.map((module, index) => (
// 						<Card
// 							key={index}
// 							onClick={() => router.push(module.path)}
// 							sx={{
// 								p: 3,
// 								borderRadius: 4,
// 								cursor: "pointer",
// 								border: "1px solid #e5e7eb",
// 								boxShadow:
// 									"0 4px 14px rgba(0,0,0,0.05)",
// 								transition: "all 0.25s ease",

// 								"&:hover": {
// 									transform: "translateY(-6px)",
// 									boxShadow:
// 										"0 10px 25px rgba(0,0,0,0.12)",
// 								},
// 							}}
// 						>
// 							<Box
// 								sx={{
// 									width: 70,
// 									height: 70,
// 									borderRadius: 3,
// 									display: "flex",
// 									alignItems: "center",
// 									justifyContent: "center",
// 									bgcolor: alpha(module.color, 0.12),
// 									color: module.color,
// 									mb: 2,
// 								}}
// 							>
// 								{module.icon}
// 							</Box>

// 							<Typography
// 								fontWeight={700}
// 								fontSize={20}
// 								color="#111827"
// 								mb={1}
// 							>
// 								{module.title}
// 							</Typography>

// 							<Typography
// 								fontSize={14}
// 								color="#6b7280"
// 								lineHeight={1.7}
// 							>
// 								{module.description}
// 							</Typography>
// 						</Card>
// 					))}
// 				</Box>
// 			</Box>
// 		</Box>
// 	);
// };

// export default Home;

"use client";

import React from "react";

import { Box, Card, Typography, alpha } from "@mui/material";

import {
  Inventory2,
  ViewInAr,
  Route,
  Assignment,
  Gavel,
  MyLocation,
  Warehouse,
  VerifiedUser,
  Analytics,
} from "@mui/icons-material";

import { useRouter } from "next/navigation";
import Sidebar from "../Components/Sidebar";
// import { useSidebar } from "@/context/SidebarContext";
import { useSidebar } from "@/Components/context/SidebarContext";

const Home = () => {
  const router = useRouter();
  const { collapsed } = useSidebar();

  const modules = [
    {
      title: "Create Package",
      description: "Create Transport Packages for Freight Planning",
      icon: <Inventory2 sx={{ fontSize: 42 }} />,
      path: "/createpackage",
      color: "#F08C24",
    },
    {
      title: "Load Optimizer",
      description: "Intelligent Load Building to Maximize Capacity Utilization",
      icon: <ViewInAr sx={{ fontSize: 42 }} />,
      path: "/load-optimizer",
      color: "#F08C24",
    },
    {
      title: "Route Optimizer",
      description: "Dynamic Route Optimization to Improve Efficiency",
      icon: <Route sx={{ fontSize: 42 }} />,
      path: "/route-optimizer",
      color: "#F08C24",
    },
    {
      title: "Order Manager",
      description: "Manage & Optimize Freight Orders",
      icon: <Assignment sx={{ fontSize: 42 }} />,
      path: "/order-overview",
      color: "#F08C24",
    },
    {
      title: "Spot Auction",
      description: "Dynamic Freight Procurement via bidding",
      icon: <Gavel sx={{ fontSize: 42 }} />,
      path: "/spotauction",
      color: "#F08C24",
    },
    {
      title: "Logistics Control Tower",
      description: "AI Powered Tracking Dashboard",
      icon: <MyLocation sx={{ fontSize: 42 }} />,
      path: "/tracking",
      color: "#F08C24",
    },
    {
      title: "Dock Manager",
      description: "Colloborate Dock Appoinments with Carriers",
      icon: <Warehouse sx={{ fontSize: 42 }} />,
      path: "/dock-management",
      color: "#F08C24",
    },
    {
      title: "Gate Operations",
      description: "Manage Yard Operations with Digital Gate Logbook",
      icon: <VerifiedUser sx={{ fontSize: 42 }} />,
      path: "/gate-operations",
      color: "#F08C24",
    },
    {
      title: "KPIs & Reporting",
      description: "Advanced Freight Analytics Dashboard",
      icon: <Analytics sx={{ fontSize: 42 }} />,
      path: "/kpi-dashboard",
      color: "#F08C24",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          ml: {
            xs: "85px",
            md: collapsed ? "85px" : "290px",
          },

          // mt: "70px",
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          bgcolor: "#f8fafc",
          minHeight: "100vh",

          transition: "all 0.3s ease",
        }}
      >
        <Box mb={5}>
          <Typography
            variant="h4"
            fontWeight={800}
            color="#111827"
            sx={{
              fontSize: {
                xs: "20px",
                md: "25px",
              },
            }}
          >
            AI Logistics Control Tower
          </Typography>

          <Typography
            fontSize={15}
            color="#6b7280"
            mt={1}
            maxWidth="850px"
            lineHeight={1.8}
          >
            Centralized transport planning, optimization, tracking and dock
            execution system powered by AI and real-time analytics.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },

            gap: 3,
            alignItems: "stretch",
          }}
        >
          {modules.map((module, index) => (
            <Card
              key={index}
              onClick={() => router.push(module.path)}
              sx={{
                p: 2,
                borderRadius: "22px",
                cursor: "pointer",
                border: "1px solid #e5e7eb",
                background:
                  "linear-gradient(to bottom right, #ffffff, #f8fafc)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                transition: "all 0.28s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(module.color, 0.12),
                  color: module.color,
                  mb: 3,
                }}
              >
                {module.icon}
              </Box>
              <Typography
                fontWeight={800}
                fontSize={18}
                color="#111827"
                mb={1.2}
              >
                {module.title}
              </Typography>
              <Typography
                fontSize={12}
                color="#6b7280"
                lineHeight={1.8}
                sx={{
                  flexGrow: 1,
                }}
              >
                {module.description}
              </Typography>
              <Box
                mt={3}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",

                  px: 1.5,
                  py: 0.7,

                  borderRadius: "999px",

                  bgcolor: alpha(module.color, 0.12),

                  color: module.color,

                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Open Module
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
