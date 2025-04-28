'use client'
import React, { useState } from "react";
import { TextField, Button, IconButton, InputAdornment, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Profile = () => {
  const initialProfileData = {
    firstName: "Teja",
    lastName: "Bandaru",
    phoneNumber: "1111111111",
    email: "teja@gamil.com",
    password: "PASSWORD",
    profileImage: "/TLogo.png",
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(profileData);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setTempData((prev) => ({
            ...prev,
            profileImage: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle Cancel button click
  const handleCancelClick = () => {
    setTempData(profileData); // Reset to original data
    setIsEditing(false);
  };

  // Handle Save button click
  const handleSaveClick = () => {
    setProfileData(tempData); 
    setIsEditing(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* <h1>Profile</h1> */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <IconButton >
            <Avatar sx={{width:'120px',height:'120px',padding:'25px',backgroundColor:'#FCF0DE'}} src={tempData.profileImage} />
          </IconButton>
          {isEditing && (
            <IconButton
              component="label"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            >
              <EditIcon />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </IconButton>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "400px", width: "100%" }}>
        <TextField
          label="First Name"
          name="firstName"
          value={tempData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={tempData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={tempData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Email"
          name="email"
          value={tempData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
        />
        <TextField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={tempData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!isEditing}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {!isEditing ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Edit
          </Button>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
