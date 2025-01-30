import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { addSingleMarkers } from "./addSingleMarkers";

export const addClusterMarkers = ({
  locations,
  map,
}: {
  locations: ReadonlyArray<google.maps.LatLngLiteral>;
  map: google.maps.Map | null | undefined;
}) => {
  // Ensure the map is not null/undefined before proceeding
  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  // Ensure locations are valid and not empty
  if (!locations || locations.length === 0) {
    console.error("No valid locations provided.");
    return;
  }

  // Add markers
  const markers = addSingleMarkers({ locations, map });

  if (!markers || markers.length === 0) {
    console.error("No markers added.");
    return;
  }

  // Initialize the MarkerClusterer with the correct algorithm
  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({
      radius: 350, // You can adjust the cluster radius according to your needs
    }),
  });
};
