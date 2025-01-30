import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api";

interface Route {
    start: string;
    end: string;
}

interface Props {
    routes: Route[];
}

const GoogleMapComponent: React.FC<Props> = ({ routes }) => {
    const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);

    useEffect(() => {
        const fetchCoordinates = async () => {
            const updatedPath = await Promise.all(
                routes.map(async (route) => {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                            route.start
                        )}&key=AIzaSyDCTGRoG47Nns0-9dKVHWDYwnL18andg7c`
                    );
                    const data = await response.json();
                    return data.results[0]?.geometry.location;
                })
            );
            setPath(updatedPath.filter((p) => p));
        };

        if (routes.length) {
            fetchCoordinates();
        }
    }, [routes]);

    return (
        <LoadScript googleMapsApiKey="AIzaSyDCTGRoG47Nns0-9dKVHWDYwnL18andg7c">
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "500px" }}
                center={path[0] || { lat: 20.5937, lng: 78.9629 }} // Default: India
                zoom={6}
            >
                {path.length > 1 && (
                    <Polyline path={path} options={{ strokeColor: "#FF0000", strokeWeight: 4 }} />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
