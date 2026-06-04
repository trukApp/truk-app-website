"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Grid,
  Button,
  useTheme,
  useMediaQuery,
  // Box,
} from "@mui/material";
import Image from "next/image";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null,
  );
  const [anchorElHamburger, setAnchorElHamburger] =
    useState<null | HTMLElement>(null);
  const router = useRouter();
  const currentPath = usePathname();
  // const { data: session } = useSession();
  const { data: session, status } = useSession();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = {
    name: session?.user?.name || "Truk App User",
    profileImage: session?.user?.image || "/TLogo.png",
  };
  const isAuthPage = currentPath === "/login";

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleHamburgerMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElHamburger(event.currentTarget);
  };

  const handleHamburgerMenuClose = () => {
    setAnchorElHamburger(null);
  };
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.error]);
  if (status === "loading") return null;
  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.clear();
      await signOut({ callbackUrl: "/login" });
    }
  };

  const handleNavigationToHomePage = () => {
    router.push("/");
  };
  return (
    <Grid>
      {/* <AppBar position="fixed" sx={{ backgroundColor: 'whitesmoke' }}> */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          zIndex: 1300,
        }}
      >
        <Toolbar>
          <Grid
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={handleNavigationToHomePage}
          >
            <Image
              src="/TrukAppLogo.png"
              alt="Logo"
              width={125}
              height={43}
              unoptimized
            />
          </Grid>

          {!isAuthPage && status === "unauthenticated" ? (
            <>
              <Button color="inherit" href="/login">
                Login
              </Button>
            </>
          ) : (
            session && (
              <Grid>
                {/* Desktop View */}
                {!isMobile && (
                  <div className="hidden md:flex space-x-4">
                    {/* <IconButton
                      sx={{
                        color: currentPath === "/" ? "#F08C24" : "inherit",
                        fontWeight: "bold",
                      }}
                      href="/"
                    >
                      <HomeIcon style={{ marginRight: "5px" }} />
                      <p style={{ fontSize: "14px" }}>Home</p>
                    </IconButton>

                    <IconButton
                      sx={{
                        color: currentPath === "/createorder" ? "#F08C24" : "inherit",
                        fontWeight: "bold",
                      }}
                      href="/createorder"
                    >
                      <LocalShippingIcon style={{ marginRight: "5px" }} />
                      <p style={{ fontSize: "14px" }}>Create Order</p>
                    </IconButton>

                    <IconButton
                      sx={{
                        color: currentPath === "/createpackage" ? "#F08C24" : "inherit",
                        fontWeight: "bold",
                      }}
                      href="/createpackage"
                    >
                      <InventoryIcon style={{ marginRight: "5px" }} />
                      <p style={{ fontSize: "14px" }}>Create Package</p>
                    </IconButton> */}

                    {/* <IconButton onClick={handleProfileMenuOpen}>
                      {user.profileImage ? (
                        <Avatar src={user.profileImage} sx={{ p: '6px', backgroundColor: '#FCF0DE' }} />
                      ) : (
                        <Avatar>{user.name[0]}</Avatar>
                      )}
                    </IconButton> */}
                    <Grid
                      display="flex"
                      alignItems="center"
                      gap={1.2}
                      sx={{
                        cursor: "pointer",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "12px",

                        "&:hover": {
                          backgroundColor: "#f3f4f6",
                        },
                      }}
                      onClick={handleProfileMenuOpen}
                    >
                      {/* USER NAME */}
                      <Grid textAlign="right">
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "#111827",
                            lineHeight: 1.2,
                          }}
                        >
                          {user.name}
                        </div>

                        <div
                          style={{
                            fontSize: "11px",
                            color: "#6b7280",
                          }}
                        >
                          Administrator
                        </div>
                      </Grid>

                      {/* PROFILE IMAGE */}
                      {user.profileImage ? (
                        <Avatar
                          src={user.profileImage}
                          sx={{
                            width: 38,
                            height: 38,
                            p: "6px",
                            backgroundColor: "#FCF0DE",
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                          }}
                        >
                          {user.name[0]}
                        </Avatar>
                      )}
                    </Grid>
                  </div>
                )}

                {/* Mobile View */}
                {isMobile && (
                  <div className="flex md:hidden">
                    <IconButton
                      color="inherit"
                      edge="end"
                      onClick={handleHamburgerMenuOpen}
                    >
                      <MenuIcon />
                    </IconButton>
                    <IconButton onClick={handleProfileMenuOpen}>
                      {user.profileImage ? (
                        <Avatar src={user.profileImage} />
                      ) : (
                        <Avatar>{user.name[0]}</Avatar>
                      )}
                    </IconButton>
                  </div>
                )}

                {/* Profile Menu */}
                <Menu
                  anchorEl={anchorElProfile}
                  open={Boolean(anchorElProfile)}
                  onClose={handleProfileMenuClose}
                >
                  <MenuItem
                    onClick={handleProfileMenuClose}
                    component="a"
                    href="/profile"
                  >
                    <PersonIcon style={{ marginRight: "10px" }} />
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon style={{ marginRight: "10px" }} />
                    Logout
                  </MenuItem>
                </Menu>
                {/* Hamburger Menu */}
                <Menu
                  anchorEl={anchorElHamburger}
                  open={Boolean(anchorElHamburger)}
                  onClose={handleHamburgerMenuClose}
                >
                  <MenuItem
                    onClick={handleHamburgerMenuClose}
                    component="a"
                    href="/"
                    selected={currentPath === "/"}
                  >
                    <HomeIcon style={{ marginRight: "10px" }} />
                    Home
                  </MenuItem>
                  <MenuItem
                    onClick={handleHamburgerMenuClose}
                    component="a"
                    href="/createorder"
                    selected={currentPath === "/createorder"}
                  >
                    <LocalShippingIcon style={{ marginRight: "10px" }} />
                    Create Order
                  </MenuItem>
                  <MenuItem
                    onClick={handleHamburgerMenuClose}
                    component="a"
                    href="/createpackage"
                    selected={currentPath === "/createpackage"}
                  >
                    <InventoryIcon style={{ marginRight: "10px" }} />
                    Create Package
                  </MenuItem>
                </Menu>
              </Grid>
            )
          )}
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Header;
