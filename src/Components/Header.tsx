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
import { signOut, useSession } from "next-auth/react"; // 👈 include useSession

const Header = () => {
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [anchorElHamburger, setAnchorElHamburger] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const currentPath = usePathname();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = {
    name: session?.user?.name || "Teja Bandaru",
    profileImage: session?.user?.image || "/TLogo.png",
  };

  const isAuthPage = currentPath === "/login" || currentPath === "/signup";

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
      console.warn("Session expired. Redirecting to login.");
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);
  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      await signOut({ redirect: false });
      localStorage.clear();
      setAnchorElProfile(null);
      router.push("/login");
    }
  };

  const handleNavigationToHomePage = () => {
    router.push("/");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'whitesmoke' }}>
        <Toolbar>
          <Grid sx={{ flexGrow: 1, cursor: "pointer" }} onClick={handleNavigationToHomePage}>
            <Image
              src="/TrukAppLogo.png"
              alt="Logo"
              width={125}
              height={43}
              unoptimized
            />
          </Grid>

          {isAuthPage || !session ? (
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
                    <IconButton
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
                    </IconButton>

                    <IconButton onClick={handleProfileMenuOpen}>
                      {user.profileImage ? (
                        <Avatar src={user.profileImage}  sx={{ p: '6px', backgroundColor:'#FCF0DE' }} />
                      ) : (
                        <Avatar>{user.name[0]}</Avatar>
                      )}
                    </IconButton>
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
                  <MenuItem onClick={handleProfileMenuClose} component="a" href="/profile">
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
    </>

  );

};

export default Header;
