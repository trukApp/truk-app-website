"use client"

import React, { useEffect, useRef } from "react";
import { addClusterMarkers } from "./markers/addClusterMarkers";

const DEFAULT_CENTER = { lat: 28.4595, lng: 77.0266 };
const DEFAULT_ZOOM = 7;

export const GoogleMaps = ({
    locations,
}: {
    locations: ReadonlyArray<google.maps.LatLngLiteral>;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    console.log("locations: ", locations)
    useEffect(() => {
        if (ref.current) {
            const map = new window.google.maps.Map(ref.current, {
                center: DEFAULT_CENTER,
                zoom: DEFAULT_ZOOM,
            });

            addClusterMarkers({ locations, map });
        }
    }, [ref, locations]);

    return (
        <div ref={ref} style={{ width: "100%", height: "700px" }} />
    );
};