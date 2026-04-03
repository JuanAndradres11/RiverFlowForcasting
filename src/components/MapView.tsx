"use client";

import { catchments, dams } from "../data/mapData";
import { loadFrozenData, getRecordsForDate, CSVRecord } from "../utils/csvLoader";
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
  const [csvData, setCSVData] = useState<CSVRecord[]>([]);
  const [todayCSVData, setTodayCSVData] = useState<CSVRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  // 🚀 Load river GeoJSON
  useEffect(() => {
    fetch("src/data/cauvery_clean.geojson")
      .then((res) => res.json())
      .then(setRiverData)
      .catch(console.error);
  }, []);

  // 📊 Load CSV data
  useEffect(() => {
    const initCSV = async () => {
      setLoading(true);
      try {
        const records = await loadFrozenData();
        setCSVData(records);

        if (records.length > 0) {
          // Get today's date in format YYYY-MM-DD
          const today = new Date().toISOString().split("T")[0];

          // Get records for today, with fallback to latest date
          const todayRecords = getRecordsForDate(records, today);
          setTodayCSVData(todayRecords);

          console.log(`📍 Map: Using ${todayRecords.length} records for ${today}`);
        }
      } catch (error) {
        console.error("Failed to load CSV for map:", error);
      } finally {
        setLoading(false);
      }
    };

    initCSV();
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

  // ✅ FILTER DATA FOR DISPLAY
  // Use CSV data if available, otherwise use mapData
  const displayCatchments =
    todayCSVData.length > 0 ? todayCSVData : catchments.map((c) => ({
      catchment_id: c.id,
      catchment_name: c.name,
      lat: c.lat,
      lng: c.lng,
      actual_flow: 0,
      predicted_flow: 0,
      error_percentage: 0,
    } as any));

  const visibleCatchmentData = selectedId
    ? displayCatchments.filter((c: any) => c.catchment_id === selectedId)
    : displayCatchments;

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
          visibleCatchmentData.map((c: any) => {
            // Handle both CSV and mapData structures
            const catchmentId = c.catchment_id || c.id;
            const isSelected = selectedId === catchmentId;

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
                key={catchmentId}
                position={[c.lat, c.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelect(catchmentId),
                }}
                ref={(ref) => {
                  if (ref && isSelected) {
                    setTimeout(() => ref.openPopup(), 100);
                  }
                }}
              >
                <Popup>
                  <strong>{c.catchment_name || c.name}</strong> <br />
                  📍 {c.lat.toFixed(4)}, {c.lng.toFixed(4)} <br />
                  💧 Actual: {c.actual_flow?.toFixed(1) || c.prediction || '—'} m³/s <br />
                  🔮 Predicted: {c.predicted_flow?.toFixed(1) || '—'} m³/s <br />
                  ⚠️ Error: {c.error_percentage?.toFixed(2) || '—'}% <br />
                  🌊 {getFlowLabel(c.predicted_flow || c.actual_flow || 0)}
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