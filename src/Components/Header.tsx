
// "use client";

// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeIcon from "@mui/icons-material/Home";
// import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";

// const Header = () => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const router = useRouter();
//     const currentPath = window.location.pathname
//     console.log("current path :", currentPath)

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const user = {
//     name: "Teja Bandaru", // Replace with actual user data
//     profileImage: "https://static.vecteezy.com/system/resources/previews/024/237/864/non_2x/big-set-of-yellow-emoji-funny-emoticons-faces-with-facial-expressions-vector.jpg",
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("");
//     };
//     const handleLogout = async () => {
//             const isConfirmed = window.confirm("Are you sure you want to log out?");
//             if (isConfirmed) {
//                 await signOut({ redirect: false });
//                 router.push("/login");
//             }
//         };

//   return (
//       <AppBar position="fixed"
//           color='info'
//         //   sx={{ backgroundColor: "#4CAF50" }}
//       >
//       <Toolbar>
//         {/* Logo */}
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//           Truck app
//         </Typography>

//          <div className="hidden md:flex space-x-4">
//           <IconButton
//             color={currentPath === "/" ? "secondary" : "inherit"}
//             href="/"
//           >
//             <HomeIcon  style={{ marginRight:"5px" }}/> <p style={{ fontSize: "14px" }}>Home</p>
//           </IconButton>
//           <IconButton
//             color={currentPath === "/createorder" ? "secondary" : "inherit"}
//             href="/createorder"
//           >
//             <LocalShippingIcon style={{ marginRight:"5px" }} /> <p style={{ fontSize: "14px" }}>Create order</p>
//           </IconButton>
//           <IconButton
//             color={currentPath === "/createpackage" ? "secondary" : "inherit"}
//             href="/createpackage"
//           >
//             <InventoryIcon style={{ marginRight:"5px" }} />
//             <p style={{ fontSize: "14px" }}>Create package</p>
//                   </IconButton>

//           <IconButton color="inherit" href="/profile">
//             {user.profileImage ? (
//               <Avatar   src={user.profileImage} />
//             ) : (
//                 //   <Avatar>{getInitials(user.name)}</Avatar>
//                   <Avatar>{user.name[0]}</Avatar>
//                       )}

//           </IconButton>
//         </div>


//         <IconButton
//           color="inherit"
//           edge="end"
//           onClick={handleMenuOpen}
//           sx={{ display: { md: "none" } }}
//         >
//           <MenuIcon style={{ marginRight:"5px" }} />
//         </IconButton>

//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//         >
//           <MenuItem
//             onClick={handleMenuClose}
//             component="a"
//             href="/"
//             selected={currentPath === "/"}
//           >
//             <HomeIcon  style={{ marginRight:"5px" }}/> <p style={{ fontSize: "14px" }}>Home</p>
//           </MenuItem>
//           <MenuItem
//             onClick={handleMenuClose}
//             component="a"
//             href="/createorder"
//             selected={currentPath === "/createorder"}
//           >
//         <LocalShippingIcon style={{ marginRight:"5px" }} /> <p style={{ fontSize: "14px" }}>Create order</p>
//           </MenuItem>
//           <MenuItem
//             onClick={handleMenuClose}
//             component="a"
//             href="/createpackage"
//             selected={currentPath === "/createpackage"}
//           >
//                         <InventoryIcon style={{ marginRight:"5px" }} />
//             <p style={{ fontSize: "14px" }}>Create package</p>
//           </MenuItem>
//           <MenuItem
//             onClick={handleMenuClose}
//             component="a"
//             href="/profile"
//             selected={currentPath === "/profile"}
//           >
//                      {user.profileImage ? (
//               <Avatar style={{width:'22px',height:'22px',marginRight:'8px'}} src={user.profileImage} />
//             ) : (
//                 //   <Avatar>{getInitials(user.name)}</Avatar>
//                   <Avatar style={{width:'22px',height:'22px',marginRight:"8px"}}>{user.name[0]}</Avatar>
//             )}    <p style={{ fontSize: "14px" }}>Profile</p>
//                   </MenuItem>
//         <MenuItem onClick={handleLogout}>
//         <LogoutIcon style={{ marginRight:"5px" }} />
//         <p style={{ fontSize: "14px" }}>Logout</p>
//         </MenuItem>

//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;


"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  PrivacyTip as PrivacyTipIcon,
  Gavel as GavelIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Header = () => {
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [anchorElHamburger, setAnchorElHamburger] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  const user = {
    name: "Teja Bandaru", // Replace with actual user data
    profileImage: "https://static.vecteezy.com/system/resources/previews/024/237/864/non_2x/big-set-of-yellow-emoji-funny-emoticons-faces-with-facial-expressions-vector.jpg",
  };

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

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      await signOut({ redirect: false });
      router.push("/login");
    }
  };

  return (
    <AppBar position="fixed"
      color="info"
    >
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Truk App
        </Typography>

        {/* Desktop View */}
        <div className="hidden md:flex space-x-4">
          <IconButton
            color={currentPath === "/" ? "secondary" : "inherit"}
            href="/"
          >
            <HomeIcon style={{ marginRight: "5px" }} />
            <p style={{ fontSize: "14px" }}>Home</p>
          </IconButton>
          <IconButton
            color={currentPath === "/createorder" ? "secondary" : "inherit"}
            href="/createorder"
          >
            <LocalShippingIcon style={{ marginRight: "5px" }} />
            <p style={{ fontSize: "14px" }}>Create Order</p>
          </IconButton>
          <IconButton
            color={currentPath === "/createpackage" ? "secondary" : "inherit"}
            href="/createpackage"
          >
            <InventoryIcon style={{ marginRight: "5px" }} />
            <p style={{ fontSize: "14px" }}>Create Package</p>
          </IconButton>
          <IconButton onClick={handleProfileMenuOpen}>
            {user.profileImage ? (
              <Avatar src={user.profileImage} />
            ) : (
              <Avatar>{user.name[0]}</Avatar>
            )}
          </IconButton>
        </div>

        {/* Mobile View */}
        <div className="flex md:hidden">


          {/* Hamburger Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleHamburgerMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Profile Avatar */}
          <IconButton onClick={handleProfileMenuOpen}>
            {user.profileImage ? (
              <Avatar src={user.profileImage} />
            ) : (
              <Avatar>{user.name[0]}</Avatar>
            )}
          </IconButton>
        </div>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorElProfile}
          open={Boolean(anchorElProfile)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleProfileMenuClose} component="a" href='/profile'>
            <PersonIcon style={{ marginRight: "10px" }} />
            My Profile
          </MenuItem>
          {/* <MenuItem onClick={handleProfileMenuClose}>
            <GavelIcon style={{ marginRight: "10px" }} />
            Terms and Conditions
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <PrivacyTipIcon style={{ marginRight: "10px" }} />
            Privacy
          </MenuItem> */}
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
