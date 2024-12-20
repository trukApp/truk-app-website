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
  const markers = addSingleMarkers({ locations, map });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({
      radius: 350, // You can adjust the cluster radius acc. to your needs
    }),
  });
};
