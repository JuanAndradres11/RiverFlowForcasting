import MapView from "../components/MapView";
import ErrorBoundary from "../components/ErrorBoundary";
import CatchmentTabs from "../components/CatchmentTabs";
import InsightsPanel from "../components/InsightsPanel";
import { useState, useEffect } from "react";

export default function CatchmentMapPage() {
  const [mode, setMode] = useState<"catchments" | "dams">("catchments");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [mode]);
  return (
    <div className="p-6 space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Catchment Map</h1>
        <p className="text-slate-500">
          Visualize Cauvery basin, monitor catchments, and explore hydrological data
        </p>
      </div>

      {/* 🔹 MAIN GRID (MAP + TABS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🗺️ MAP SECTION */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="text-lg font-semibold">Cauvery Basin Overview</h2>

          <ErrorBoundary>
            <div className="h-[500px]">
              <MapView
                mode={mode}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>
          </ErrorBoundary>

          <p className="text-sm text-slate-500">
            Explore the Cauvery river basin. Toggle layers to view dams and catchments.
          </p>
        </div>

        {/* 📊 TABS PANEL */}
        <div className="bg-white rounded-xl shadow p-4">
          <CatchmentTabs />
        </div>

      </div>

      {/* 🔹 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Total Catchments</h3>
          <p className="text-xl font-bold">26</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Monitoring Stations</h3>
          <p className="text-xl font-bold">44</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Last Updated</h3>
          <p className="text-xl font-bold">Today</p>
        </div>

      </div>

      {/* 🔹 INFO PANEL */}
      <InsightsPanel
        mode={mode}
        setMode={setMode}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

    </div>
  );
}