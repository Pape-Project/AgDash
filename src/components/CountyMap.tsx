// src/components/CountyMap.tsx
import { MapContainer, TileLayer } from "react-leaflet";

export function CountyMap() {
  return (
    <MapContainer
      center={[44, -120]} // roughly Oregon
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
    </MapContainer>
  );
}
