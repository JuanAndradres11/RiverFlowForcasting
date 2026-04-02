"use client";

import { useState, useEffect } from "react";
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

// Fix marker icon issue
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 🌍 Cauvery bounds
const cauveryBounds: [[number, number], [number, number]] = [
  [10.15, 75.45],
  [13.5, 79.9],
];

// 📍 Catchments
const catchments = [
  { id: 1, name: "Upper Cauvery", coords: [12.2, 76.0] },
  { id: 2, name: "Kabini Basin", coords: [11.9, 76.2] },
  { id: 3, name: "Hemavathi", coords: [12.0, 76.4] },
  { id: 4, name: "Lower Basin", coords: [10.8, 78.8] },
];

// 🏗️ Dams
const dams = [
  { id: 1, name: "Krishna Raja Sagara", coords: [12.42, 76.57] },
  { id: 2, name: "Mettur Dam", coords: [11.8, 77.8] },
];

export default function MapView() {
  const [showCatchments, setShowCatchments] = useState(true);
  const [showDams, setShowDams] = useState(false);
  const [riverData, setRiverData] = useState<any>(null);

  // 🚀 Load GeoJSON
  useEffect(() => {
    fetch("src/data/cauvery_clean.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ River loaded:", data);
        setRiverData(data);
      })
      .catch((err) => {
        console.error("❌ Failed to load GeoJSON:", err);
      });
  }, []);

  return (
    <div className="space-y-3">

      {/* 🔘 Controls */}
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showCatchments}
            onChange={() => setShowCatchments(!showCatchments)}
          />
          Catchments
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDams}
            onChange={() => setShowDams(!showDams)}
          />
          Dams
        </label>
      </div>

      {/* 🗺️ Map */}
      <MapContainer
        bounds={cauveryBounds}
        maxBounds={cauveryBounds}
        maxBoundsViscosity={1.0}
        minZoom={6}
        maxZoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🌊 REAL River */}
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
        {showCatchments &&
          catchments.map((c) => (
            <Marker key={c.id} position={c.coords as [number, number]}>
              <Popup>
                <strong>{c.name}</strong>
              </Popup>
            </Marker>
          ))}

        {/* 🏗️ Dams */}
        {showDams &&
          dams.map((d) => (
            <Marker key={d.id} position={d.coords as [number, number]}>
              <Popup>
                <strong>{d.name}</strong>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}