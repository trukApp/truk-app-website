"use client"
import SettingsComponent from "@/Components/Settings/SettingsComponent";
import { RatingsAndReviews } from "@/Components/RatingsAndReview/RatingsAndReviews";
import TransportExecution from "@/Components/TransportExecution/TransportExecution";
import TransportManagement from "@/Components/TransportManagement/TransportManagement";
import TransportPlanning from "@/Components/TransportPlanning/TransportPlanning";
import { MapComponent } from "@/Components/MapComponent";
 



export default function Home() {
  return (
    <div>
     
      <SettingsComponent />
      <TransportManagement />
      <TransportPlanning />
      <TransportExecution />
      <RatingsAndReviews />
      {/* <MapComponent /> */}
    </div>
  );
}
