"use client";

import React, { useState } from "react";

import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    ExpandLess,
    ExpandMore,
    Menu as MenuIcon,
    ChevronLeft,
    LocalShipping,
    Inventory2,
    Business,
    Storage,
    Storefront,
    Route,
    Gavel,
    Assignment,
    Warehouse,
    Engineering,
    TrackChanges,
    Analytics,
    AttachMoney,
    Settings,
    Notifications,
    Link,
    Build,
} from "@mui/icons-material";

import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "@/Components/context/SidebarContext";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { collapsed, setCollapsed } = useSidebar();
    const [openMenus, setOpenMenus] = useState({
        management: true,
        planning: true,
        execution: true,
        analytics: true,
        settings: true,
    });

    const toggleMenu = (menu: keyof typeof openMenus) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };
    const menuStyles = {
        color: "#d1d5db",
        borderRadius: "12px",
        mx: 1,
        mb: 1,
        minHeight: 50,

        "&:hover": {
            backgroundColor: "#1f2937",
            color: "#fff",
        },
    };

    const activeStyles = {
        backgroundColor: "#F08C24",
        color: "#fff",

        "& .MuiListItemIcon-root": {
            color: "#fff",
        },

        "&:hover": {
            backgroundColor: "#e57f16",
        },
    };
    const renderSubItem = (
        label: string,
        path: string,
        icon: React.ReactNode
    ) => (
        <Tooltip
            title={collapsed ? label : ""}
            placement="right"
        >
            <ListItemButton
                onClick={() => router.push(path)}
                sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: "10px",
                    pl: collapsed ? 0 : 3,
                    py: 1,

                    justifyContent: collapsed
                        ? "center"
                        : "flex-start",

                    ...(pathname === path
                        ? activeStyles
                        : {
                            color: "#cbd5e1",
                        }),

                    "&:hover": {
                        backgroundColor: "#1e293b",
                    },
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: collapsed ? 0 : 36,
                        color: "inherit",
                        justifyContent: "center",
                    }}
                >
                    {icon}
                </ListItemIcon>

                {!collapsed && (
                    <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: 500,
                        }}
                    />
                )}
            </ListItemButton>
        </Tooltip>
    );

    const renderMenu = ({
        keyName,
        title,
        icon,
        color,
        children,
    }: {
        keyName: keyof typeof openMenus;
        title: string;
        icon: React.ReactNode;
        color: string;
        children: React.ReactNode;
    }) => (
        <>
            <Tooltip
                title={collapsed ? title : ""}
                placement="right"
            >
                <ListItemButton
                    onClick={() => toggleMenu(keyName)}
                    sx={menuStyles}
                >
                    <ListItemIcon
                        sx={{
                            color,
                            minWidth: collapsed ? 0 : 40,
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </ListItemIcon>

                    {!collapsed && (
                        <>
                            <ListItemText
                                primary={title}
                                primaryTypographyProps={{
                                    fontWeight: 700,
                                    fontSize: 14,
                                }}
                            />

                            {openMenus[keyName] ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </>
                    )}
                </ListItemButton>
            </Tooltip>

            <Collapse
                in={
                    collapsed
                        ? false
                        : openMenus[keyName]
                }
            >
                <List disablePadding>
                    {children}
                </List>
            </Collapse>
        </>
    );

    return (
        <Box
            sx={{
                width: collapsed ? 80 : 290,
                height: "90vh",
                backgroundColor: "#0f172a",
                color: "#fff",
                position: "fixed",
                top: 64,
                left: 0,
                overflowY: "auto",
                transition: "all 0.3s ease",
                borderRight: "1px solid #1e293b",
                zIndex: 1200,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent={
                    collapsed
                        ? "center"
                        : "space-between"
                }
                px={2}
                py={2}
            >
                {!collapsed && (
                    <Typography
                        fontSize={18}
                        fontWeight={700}
                        color="#F08C24"
                    >
                        CONTROL TOWER
                    </Typography>
                )}

                <IconButton
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    sx={{
                        color: "#fff",
                        backgroundColor: "#1e293b",

                        "&:hover": {
                            backgroundColor: "#334155",
                        },
                    }}
                >
                    {collapsed ? (
                        <MenuIcon />
                    ) : (
                        <ChevronLeft />
                    )}
                </IconButton>
            </Box>

            <Divider
                sx={{
                    borderColor: "#1e293b",
                    mb: 1,
                }}
            />

            <List disablePadding>
                {renderMenu({
                    keyName: "management",
                    title: "Transport Management",
                    icon: <Inventory2 />,
                    color: "#F08C24",

                    children: (
                        <>
                            {renderSubItem(
                                "Create Package",
                                "/createpackage",
                                <Inventory2 fontSize="small" />
                            )}

                            {renderSubItem(
                                "Product Master",
                                "/productmaster",
                                <Storefront fontSize="small" />
                            )}

                            {renderSubItem(
                                "Business Partners",
                                "/businesspartners",
                                <Business fontSize="small" />
                            )}

                            {renderSubItem(
                                "Master Data",
                                "/masterdata",
                                <Storage fontSize="small" />
                            )}

                            {renderSubItem(
                                "Vehicle",
                                "/vehicle",
                                <LocalShipping fontSize="small" />
                            )}
                        </>
                    ),
                })}
                {renderMenu({
                    keyName: "planning",
                    title: "Transport Planning",
                    icon: <Route />,
                    color: "#F08C24",

                    children: (
                        <>
                            {renderSubItem(
                                "Order Planning",
                                "/createorder",
                                <Assignment fontSize="small" />
                            )}

                            {renderSubItem(
                                "Route Optimizer",
                                "/route-optimizer",
                                <Route fontSize="small" />
                            )}

                            {renderSubItem(
                                "Spot Auction",
                                "/spotauction",
                                <Gavel fontSize="small" />
                            )}
                        </>
                    ),
                })}
                {renderMenu({
                    keyName: "execution",
                    title: "Transport Execution",
                    icon: <Warehouse />,
                    color: "#F08C24",

                    children: (
                        <>
                            {renderSubItem(
                                "Order Overview",
                                "/order-overview",
                                <LocalShipping fontSize="small" />
                            )}

                            {renderSubItem(
                                "Dock Management",
                                "/dock-management",
                                <Warehouse fontSize="small" />
                            )}

                            {renderSubItem(
                                "Operations",
                                "/operations",
                                <Engineering fontSize="small" />
                            )}

                            {renderSubItem(
                                "Tracking",
                                "/tracking",
                                <TrackChanges fontSize="small" />
                            )}
                        </>
                    ),
                })}
                {renderMenu({
                    keyName: "analytics",
                    title: "Analytics",
                    icon: <Analytics />,
                    color: "#F08C24",

                    children: (
                        <>
                            {renderSubItem(
                                "KPI Dashboard",
                                "/kpi-dashboard",
                                <Analytics fontSize="small" />
                            )}

                            {renderSubItem(
                                "Cost Analysis",
                                "/cost-analysis",
                                <AttachMoney fontSize="small" />
                            )}
                        </>
                    ),
                })}
                {renderMenu({
                    keyName: "settings",
                    title: "Settings",
                    icon: <Settings />,
                    color: "#F08C24",

                    children: (
                        <>
                            {renderSubItem(
                                "User Settings",
                                "/user-settings",
                                <Settings fontSize="small" />
                            )}

                            {renderSubItem(
                                "Config Settings",
                                "/configsettings",
                                <Build fontSize="small" />
                            )}

                            {renderSubItem(
                                "Notifications",
                                "/notification-settings",
                                <Notifications fontSize="small" />
                            )}

                            {renderSubItem(
                                "Connections",
                                "/system-connections",
                                <Link fontSize="small" />
                            )}
                        </>
                    ),
                })}
            </List>
        </Box>
    );
};

export default Sidebar;