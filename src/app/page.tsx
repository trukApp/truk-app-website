"use client"
import SettingsComponent from "@/Components/Settings/SettingsComponent";
import RatingsAndReviews from "@/Components/RatingsAndReview/RatingsAndReviews";
import TransportExecution from "@/Components/TransportExecution/TransportExecution";
import TransportManagement from "@/Components/TransportManagement/TransportManagement";
import TransportPlanning from "@/Components/TransportPlanning/TransportPlanning";
import { Grid } from '@mui/material';




export default function Home() {
  return (
    <Grid sx={{marginLeft:{xs:0,md:'30px'}}}>
      
      <SettingsComponent />
      <TransportManagement />
      <TransportPlanning />
      <TransportExecution />
      <RatingsAndReviews />
      {/* <MapComponent /> */}
    </Grid>
  );
}
