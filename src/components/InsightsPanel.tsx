"use client";
import { catchments, dams } from "../data/mapData";

type Catchment = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  prediction: number;
};

type Dam = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
};



function getFlowLabel(flow: number) {
  if (flow > 80) return "High Flow";
  if (flow > 50) return "Moderate Flow";
  return "Low Flow";
}

export default function InsightsPanel({
  mode,
  setMode,
  selectedId,
  onSelect,
}: {
  mode: "catchments" | "dams";
  setMode: (m: "catchments" | "dams") => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const data = mode === "catchments" ? catchments : dams;

  const filtered = selectedId
    ? data.filter((d) => d.id === selectedId)
    : data;

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">

      {/* 🔘 Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setMode("catchments")}
          className={`px-3 py-1 rounded ${
            mode === "catchments" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Catchments
        </button>

        <button
          onClick={() => setMode("dams")}
          className={`px-3 py-1 rounded ${
            mode === "dams" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Dams
        </button>
      </div>

      {/* 📊 TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Lat/Lng</th>

              {mode === "catchments" && (
                <>
                  <th className="text-left p-2">Prediction</th>
                  <th className="text-left p-2">Status</th>
                </>
              )}

              {mode === "dams" && (
                <th className="text-left p-2">Description</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filtered.map((item: any) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`cursor-pointer border-b hover:bg-gray-50 ${
                  selectedId === item.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.lat}, {item.lng}</td>

                {mode === "catchments" && (
                  <>
                    <td className="p-2">{item.prediction} m³/s</td>
                    <td className="p-2">
                      {getFlowLabel(item.prediction)}
                    </td>
                  </>
                )}

                {mode === "dams" && (
                  <td className="p-2">{item.description}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}