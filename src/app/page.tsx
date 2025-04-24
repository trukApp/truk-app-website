"use client"
import SettingsComponent from "@/Components/Settings/SettingsComponent";
import RatingsAndReviews from "@/Components/RatingsAndReview/RatingsAndReviews";
import TransportExecution from "@/Components/TransportExecution/TransportExecution";
import TransportManagement from "@/Components/TransportManagement/TransportManagement";
import TransportPlanning from "@/Components/TransportPlanning/TransportPlanning";
import { Grid } from '@mui/material';
import { useDispatch } from "react-redux";
import { useGetUomMasterQuery } from "@/api/apiSlice";
import { useEffect } from "react";
import { setUnitsofMeasurement } from "@/store/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { data: uom, error: uomErr } = useGetUomMasterQuery([])
  if (uomErr) {
    console.log("uom err:", uomErr)
  }
  useEffect(() => {
    if (uom && uom.uomList) {
      const unitsofMeasure = uom.uomList.map((item: { unit_name: string }) => item.unit_name);
      dispatch(setUnitsofMeasurement(unitsofMeasure));
    }

    if (uomErr) {
      console.error("uom error:", uomErr);
    }
  }, [uom, uomErr, dispatch]);

  return (
    <Grid sx={{ marginLeft: { xs: 0, md: '30px' }, marginTop: '30px' }}>
      <TransportManagement />
      <TransportPlanning />
      <TransportExecution />
      <RatingsAndReviews />
      <SettingsComponent />
    </Grid>
  );
}

export default Home

// "use client"
// import { Grid } from '@mui/material';
// import { useDispatch } from "react-redux";
// import { useGetUomMasterQuery } from "@/api/apiSlice";
// import { useEffect } from "react";
// import { setUnitsofMeasurement } from "@/store/authSlice";
// import LandingPage from "./landingpage/page";

// const Home = () => {
//   const dispatch = useDispatch();
//   const { data: uom, error: uomErr } = useGetUomMasterQuery([])
//   if (uomErr) {
//     console.log("uom err:", uomErr)
//   }
//   useEffect(() => {
//     if (uom && uom.uomList) {
//       const unitsofMeasure = uom.uomList.map((item: { unit_name: string }) => item.unit_name);
//       dispatch(setUnitsofMeasurement(unitsofMeasure));
//     }

//     if (uomErr) {
//       console.error("uom error:", uomErr);
//     }
//   }, [uom, uomErr, dispatch]);

//   return (
//     <Grid >
//       <LandingPage/>
//     </Grid>
//   );
// }

// export default Home



