import { MapContainer, TileLayer } from "react-leaflet";

const cauveryBounds: [[number, number], [number, number]] = [
  [10.15, 75.45], // SW
  [13.5, 79.9],   // NE
];

export default function MapView() {
  return (
    <MapContainer
  bounds={cauveryBounds}
  maxBounds={cauveryBounds}
  maxBoundsViscosity={1.0}
  minZoom={6}
  maxZoom={12}
  style={{ height: "500px", width: "100%" }}
>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  );
}