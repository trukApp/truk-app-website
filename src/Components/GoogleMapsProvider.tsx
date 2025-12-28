"use client";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries: ("places")[] = ["places"];
const MAP_ID = "google-maps-api";

export const useGoogleMaps = () => {
    const { isLoaded } = useJsApiLoader({
        id: MAP_ID,
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        libraries,
    });
    return isLoaded;
};
