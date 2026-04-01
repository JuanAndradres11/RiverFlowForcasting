import MapView from "../components/MapView";
import ErrorBoundary from "../components/ErrorBoundary";

export default function CatchmentMapPage() {
  return (
    <div className="p-6 space-y-6">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Catchment Map</h1>
        <p className="text-slate-500">
          Visualize river basin, catchment regions, and forecast distribution
        </p>
      </div>

      {/* MAP CARD */}
      <div className="bg-white rounded-xl shadow p-4 space-y-4">
        <h2 className="text-lg font-semibold">Cauvery Basin Overview</h2>

        <ErrorBoundary>
          <MapView />
        </ErrorBoundary>

        {/* fallback description */}
        <p className="text-sm text-slate-500">
          The map displays the Cauvery river basin along with key catchment regions.
          Select a catchment to view forecast data and hydrological insights.
        </p>
      </div>

      {/* INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Total Catchments</h3>
          <p className="text-xl font-bold">26</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Active Predictions</h3>
          <p className="text-xl font-bold">~150</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm text-slate-500">Last Updated</h3>
          <p className="text-xl font-bold">Today</p>
        </div>

      </div>

      {/* SELECTED CATCHMENT PANEL */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold">Catchment Details</h2>
        <p className="text-slate-500 text-sm">
          Click on a catchment in the map to view detailed prediction metrics,
          including discharge, error %, and historical comparison.
        </p>
      </div>

    </div>
  );
}