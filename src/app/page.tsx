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
import { useQuery } from '@apollo/client';
import { GET_UOM } from '@/api/graphqlApiSlice';
import { useAppSelector } from "@/store";
export default function Home() {
  const dispatch = useDispatch();
  // const { data: uom, error: uomErr } = useGetUomMasterQuery([])
  // console.log(uom)
  // if (uomErr) {
  //   console.log("uom err:", uomErr)
  // }


  const { loading, error, data } = useQuery(GET_UOM);
  useEffect(() => {
    if (data && data.allUOM) {
      const unitsofMeasure = data.allUOM.map((item: { unit_name: string }) => item.unit_name);
      dispatch(setUnitsofMeasurement(unitsofMeasure));
    }

    if (error) {
      console.error("uom error:", error);
    }
  }, [data, error, dispatch]);
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error:  {error.message}</p>;
  return (
    <Grid sx={{ marginLeft: { xs: 0, md: '30px' }, marginTop: '30px' }}>
      <SettingsComponent />
      <TransportManagement />
      <TransportPlanning />
      <TransportExecution />
      <RatingsAndReviews />
    </Grid>
  );
}

// export default withAuthComponent(Home)

