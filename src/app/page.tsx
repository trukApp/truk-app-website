"use client";

import React from "react";

import { Card, Grid, Typography, alpha } from "@mui/material";

import {
  Inventory2,
  ViewInAr,
  Route,
  Assignment,
  Gavel,
  MyLocation,
  Warehouse,
  LocalShipping,
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
    // {
    //   title: "Gate Operations",
    //   description: "Manage Yard Operations with Digital Gate Logbook",
    //   icon: <VerifiedUser sx={{ fontSize: 42 }} />,
    //   path: "/gate-operations",
    //   color: "#F08C24",
    // },
    {
      title: "Track Vehicles",
      description:
        "Monitor vehicle locations and shipment movements in real time",
      icon: <LocalShipping sx={{ fontSize: 42 }} />,
      path: "/vehicles-tracking",
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
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "85px" : "290px",
          padding: "16px",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
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
        </div>
        <Grid
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
              <Grid
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
              </Grid>
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
              <Grid
                mt={3}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",

                  px: 1.5,
                  py: 0.7,

                  borderRadius: "999px",

                  bgcolor: alpha(module.color, 0.12),

                  color: "#000000",

                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Open Module
              </Grid>
            </Card>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Home;
