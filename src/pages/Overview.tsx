import { useState, useEffect } from 'react';
import { Activity, TrendingUp, AlertCircle, Target } from 'lucide-react';
import { Card } from '../components/Card';
import { MetricCard } from '../components/MetricCard';
import { LineChart } from '../components/LineChart';
import { supabase, Catchment, Prediction, ModelMetrics } from '../lib/supabase';

export function Overview() {
  const [catchments, setCatchments] = useState<Catchment[]>([]);
  const [selectedCatchment, setSelectedCatchment] = useState<string>('5001');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<number>(90);

  useEffect(() => {
    loadCatchments();
  }, []);

  useEffect(() => {
    if (selectedCatchment) {
      loadData();
    }
  }, [selectedCatchment, dateRange]);

  const loadCatchments = async () => {
    const { data } = await supabase
      .from('catchments')
      .select('*')
      .order('id');

    if (data) {
      setCatchments(data);
    }
  };

  const loadData = async () => {
    setLoading(true);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const [predictionsRes, metricsRes] = await Promise.all([
      supabase
        .from('predictions')
        .select('*')
        .eq('catchment_id', selectedCatchment)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true }),
      supabase
        .from('model_metrics')
        .select('*')
        .eq('catchment_id', selectedCatchment)
        .maybeSingle()
    ]);

    if (predictionsRes.data) {
      setPredictions(predictionsRes.data);
    }

    if (metricsRes.data) {
      setMetrics(metricsRes.data);
    }

    setLoading(false);
  };

  const chartData = predictions.map(p => ({
    date: p.date,
    actual: p.actual_flow,
    predicted: p.predicted_flow
  }));

  const selectedCatchmentData = catchments.find(c => c.id === selectedCatchment);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time streamflow predictions and model performance</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Catchment
              </label>
              <select
                value={selectedCatchment}
                onChange={(e) => setSelectedCatchment(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {catchments.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.river_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="w-full md:w-60 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
                <option value={180}>Last 180 Days</option>
                <option value={365}>Last Year</option>
              </select>
            </div>
          </div>

          {selectedCatchmentData && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>{' '}
                  <span className="font-medium text-gray-900">{selectedCatchmentData.location}</span>
                </div>
                <div>
                  <span className="text-gray-600">Area:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {selectedCatchmentData.area_sq_km.toLocaleString()} km²
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Coordinates:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {selectedCatchmentData.latitude.toFixed(4)}°, {selectedCatchmentData.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="NSE Score"
                value={metrics?.nse.toFixed(3) || 'N/A'}
                subtitle="Nash-Sutcliffe Efficiency"
                icon={Activity}
                color="blue"
                trend="up"
                trendValue="High accuracy"
              />
              <MetricCard
                title="RMSE"
                value={metrics?.rmse.toFixed(1) || 'N/A'}
                subtitle="Root Mean Square Error"
                icon={AlertCircle}
                color="teal"
              />
              <MetricCard
                title="MAE"
                value={metrics?.mae.toFixed(1) || 'N/A'}
                subtitle="Mean Absolute Error"
                icon={TrendingUp}
                color="green"
              />
              <MetricCard
                title="Peak Accuracy"
                value={`${metrics?.peak_accuracy.toFixed(1)}%` || 'N/A'}
                subtitle="Peak Flow Prediction"
                icon={Target}
                color="amber"
                trend="up"
                trendValue="Excellent"
              />
            </div>

            <Card className="mb-8">
              <LineChart
                data={chartData}
                title="Actual vs Predicted Streamflow"
              />
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Predictions</h3>
                <div className="space-y-3">
                  {predictions.slice(-5).reverse().map((pred, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(pred.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Error: {Math.abs(pred.error_percentage).toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {pred.predicted_flow.toFixed(1)} m³/s
                        </div>
                        <div className="text-xs text-gray-500">
                          vs {pred.actual_flow.toFixed(1)} actual
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Information</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Model Architecture</div>
                    <div className="font-semibold text-gray-900">{metrics?.model_version || 'PNP-LSTM-v1'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Training Epochs</div>
                      <div className="text-lg font-bold text-gray-900">{metrics?.training_epochs || 150}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Validation Loss</div>
                      <div className="text-lg font-bold text-gray-900">{metrics?.validation_loss.toFixed(4) || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
