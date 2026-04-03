"use client";

import { catchments, dams } from "../data/mapData";
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const cauveryBounds: [[number, number], [number, number]] = [
  [10.15, 75.45],
  [13.5, 79.9],
];

// 🌊 Flow label
function getFlowLabel(flow: number) {
  if (flow > 80) return "High Flow";
  if (flow > 50) return "Moderate Flow";
  return "Low Flow";
}

export default function MapView({ mode, selectedId, onSelect }: any) {
  const [riverData, setRiverData] = useState<any>(null);
  const mapRef = useRef<any>(null);

  // 🚀 Load river
  useEffect(() => {
    fetch("src/data/cauvery_clean.geojson")
      .then((res) => res.json())
      .then(setRiverData)
      .catch(console.error);
  }, []);

  // 🎯 Zoom to selected
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;

    const data = mode === "catchments" ? catchments : dams;
    const selected = data.find((d) => d.id === selectedId);

    if (selected) {
      mapRef.current.flyTo([selected.lat, selected.lng], 9);
    }
  }, [selectedId, mode]);

  // ✅ FILTER DATA (THIS FIXES YOUR MAIN ISSUE)
  const visibleCatchments = selectedId
    ? catchments.filter((c) => c.id === selectedId)
    : catchments;

  const visibleDams = selectedId
    ? dams.filter((d) => d.id === selectedId)
    : dams;

  return (
    <div>
      <MapContainer
        whenCreated={(map) => (mapRef.current = map)}
        bounds={cauveryBounds}
        maxBounds={cauveryBounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
        maxZoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🌊 River */}
        {riverData && (
          <GeoJSON
            data={riverData}
            style={{
              color: "#00bfff",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}

        {/* 📍 Catchments */}
        {mode === "catchments" &&
          visibleCatchments.map((c) => {
            const isSelected = selectedId === c.id;

            const icon = L.divIcon({
              className: "",
              html: `<div style="
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div class="marker-dot ${isSelected ? "selected" : ""}"></div>
              </div>`,
            });

            return (
              <Marker
                key={c.id}
                position={[c.lat, c.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelect(c.id),
                }}
                ref={(ref) => {
                  if (ref && isSelected) {
                    setTimeout(() => ref.openPopup(), 100);
                  }
                }}
              >
                <Popup>
                  <strong>{c.name}</strong> <br />
                  📍 {c.lat}, {c.lng} <br />
                  🌊 {c.prediction} m³/s <br />
                  ⚠️ {getFlowLabel(c.prediction)}
                </Popup>
              </Marker>
            );
          })}

        {/* 🏗️ Dams */}
        {mode === "dams" &&
          visibleDams.map((d) => {
            const isSelected = selectedId === d.id;

            const icon = L.divIcon({
              className: "",
              html: `<div style="
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div class="marker-dot ${isSelected ? "selected" : ""}"></div>
              </div>`,
            });

            return (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelect(d.id),
                }}
                ref={(ref) => {
                  if (ref && isSelected) {
                    setTimeout(() => ref.openPopup(), 100);
                  }
                }}
              >
                <Popup>
                  <strong>{d.name}</strong> <br />
                  📍 {d.lat}, {d.lng} <br />
                  🚧 {d.description}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}