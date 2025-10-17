import { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../components/Card';
import { LineChart } from '../components/LineChart';
import { supabase, Catchment, Prediction } from '../lib/supabase';

export function HistoricalTrends() {
  const [catchments, setCatchments] = useState<Catchment[]>([]);
  const [selectedCatchments, setSelectedCatchments] = useState<string[]>(['5001']);
  const [predictions, setPredictions] = useState<{ [key: string]: Prediction[] }>({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<number>(180);

  useEffect(() => {
    loadCatchments();
  }, []);

  useEffect(() => {
    if (selectedCatchments.length > 0) {
      loadPredictions();
    }
  }, [selectedCatchments, dateRange]);

  const loadCatchments = async () => {
    const { data } = await supabase
      .from('catchments')
      .select('*')
      .order('id');

    if (data) {
      setCatchments(data);
    }
  };

  const loadPredictions = async () => {
    setLoading(true);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const predictionsData: { [key: string]: Prediction[] } = {};

    for (const catchmentId of selectedCatchments) {
      const { data } = await supabase
        .from('predictions')
        .select('*')
        .eq('catchment_id', catchmentId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (data) {
        predictionsData[catchmentId] = data;
      }
    }

    setPredictions(predictionsData);
    setLoading(false);
  };

  const toggleCatchment = (catchmentId: string) => {
    setSelectedCatchments(prev =>
      prev.includes(catchmentId)
        ? prev.filter(id => id !== catchmentId)
        : [...prev, catchmentId]
    );
  };

  const getChartData = (catchmentId: string) => {
    const data = predictions[catchmentId] || [];
    return data.map(p => ({
      date: p.date,
      actual: p.actual_flow,
      predicted: p.predicted_flow
    }));
  };

  const calculateStats = (catchmentId: string) => {
    const data = predictions[catchmentId] || [];
    if (data.length === 0) return null;

    const errors = data.map(p => Math.abs(p.error_percentage));
    const avgError = errors.reduce((a, b) => a + b, 0) / errors.length;
    const maxError = Math.max(...errors);
    const minError = Math.min(...errors);

    const avgActual = data.reduce((a, b) => a + b.actual_flow, 0) / data.length;
    const avgPredicted = data.reduce((a, b) => a + b.predicted_flow, 0) / data.length;

    return {
      avgError: avgError.toFixed(2),
      maxError: maxError.toFixed(2),
      minError: minError.toFixed(2),
      avgActual: avgActual.toFixed(1),
      avgPredicted: avgPredicted.toFixed(1),
      dataPoints: data.length
    };
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historical Trends</h1>
          <p className="text-gray-600">Comparative analysis across catchments and time periods</p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Time Period
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full md:w-60 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
                <option value={180}>Last 6 Months</option>
                <option value={365}>Last Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Select Catchments to Compare
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {catchments.map(catchment => (
                <button
                  key={catchment.id}
                  onClick={() => toggleCatchment(catchment.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedCatchments.includes(catchment.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{catchment.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{catchment.river_name}</div>
                      <div className="text-xs text-gray-500 mt-1">{catchment.location}</div>
                    </div>
                    {selectedCatchments.includes(catchment.id) && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedCatchments.map(catchmentId => {
              const catchment = catchments.find(c => c.id === catchmentId);
              const chartData = getChartData(catchmentId);
              const stats = calculateStats(catchmentId);

              if (!catchment || !stats) return null;

              return (
                <Card key={catchmentId}>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{catchment.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {catchment.river_name} - {catchment.location}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Avg Actual Flow</div>
                      <div className="text-xl font-bold text-blue-600">{stats.avgActual} m³/s</div>
                    </div>
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Avg Predicted Flow</div>
                      <div className="text-xl font-bold text-teal-600">{stats.avgPredicted} m³/s</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Avg Error</div>
                      <div className="text-xl font-bold text-green-600">{stats.avgError}%</div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Data Points</div>
                      <div className="text-xl font-bold text-amber-600">{stats.dataPoints}</div>
                    </div>
                  </div>

                  <LineChart data={chartData} />

                  <div className="mt-6 grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Min Error</span>
                      <span className="font-semibold text-gray-900">{stats.minError}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Max Error</span>
                      <span className="font-semibold text-gray-900">{stats.maxError}%</span>
                    </div>
                  </div>
                </Card>
              );
            })}

            {selectedCatchments.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Catchments Selected
                  </h3>
                  <p className="text-gray-600">
                    Please select at least one catchment to view historical trends
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
