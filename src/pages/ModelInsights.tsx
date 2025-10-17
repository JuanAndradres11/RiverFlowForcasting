import { useState, useEffect } from 'react';
import { Brain, Layers, Zap, TrendingDown } from 'lucide-react';
import { Card } from '../components/Card';
import { supabase, TrainingHistory } from '../lib/supabase';

export function ModelInsights() {
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrainingHistory();
  }, []);

  const loadTrainingHistory = async () => {
    const { data } = await supabase
      .from('training_history')
      .select('*')
      .order('epoch', { ascending: true });

    if (data) {
      setTrainingHistory(data);
    }

    setLoading(false);
  };

  const getYPosition = (value: number, min: number, max: number) => {
    return 100 - ((value - min) / (max - min)) * 100;
  };

  const chartData = trainingHistory.length > 0 ? (() => {
    const allLosses = trainingHistory.flatMap(h => [h.training_loss, h.validation_loss]);
    const min = Math.min(...allLosses);
    const max = Math.max(...allLosses);

    return { min, max, data: trainingHistory };
  })() : { min: 0, max: 1, data: [] };

  const trainingPath = chartData.data.length > 0 ? chartData.data
    .map((point, i) => {
      const x = (i / (chartData.data.length - 1)) * 100;
      const y = getYPosition(point.training_loss, chartData.min, chartData.max);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') : '';

  const validationPath = chartData.data.length > 0 ? chartData.data
    .map((point, i) => {
      const x = (i / (chartData.data.length - 1)) * 100;
      const y = getYPosition(point.validation_loss, chartData.min, chartData.max);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') : '';

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Model Insights</h1>
          <p className="text-gray-600">Deep learning architecture and training performance</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Model Type</div>
                <div className="text-xl font-bold text-gray-900">PNP-LSTM Fusion</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="flex items-center gap-4">
              <div className="bg-teal-600 p-3 rounded-lg">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Architecture</div>
                <div className="text-xl font-bold text-gray-900">Multi-Layer Neural Net</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 p-3 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Training Status</div>
                <div className="text-xl font-bold text-gray-900">Converged</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Model Architecture Flow</h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
            <div className="flex-1 text-center">
              <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-blue-200">
                <div className="text-4xl mb-2">📊</div>
                <div className="font-bold text-gray-900 mb-1">Input Layer</div>
                <div className="text-sm text-gray-600">Climate & Hydrological Data</div>
                <div className="text-xs text-gray-500 mt-2">Temperature, Precipitation, Flow</div>
              </div>
            </div>

            <div className="hidden md:block text-3xl text-blue-400">→</div>

            <div className="flex-1 text-center">
              <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-teal-200">
                <div className="text-4xl mb-2">🧮</div>
                <div className="font-bold text-gray-900 mb-1">PNP Processing</div>
                <div className="text-sm text-gray-600">Physics-Guided Neural Network</div>
                <div className="text-xs text-gray-500 mt-2">Feature Engineering</div>
              </div>
            </div>

            <div className="hidden md:block text-3xl text-teal-400">→</div>

            <div className="flex-1 text-center">
              <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-green-200">
                <div className="text-4xl mb-2">🔄</div>
                <div className="font-bold text-gray-900 mb-1">LSTM Layer</div>
                <div className="text-sm text-gray-600">Temporal Sequence Learning</div>
                <div className="text-xs text-gray-500 mt-2">128 Hidden Units</div>
              </div>
            </div>

            <div className="hidden md:block text-3xl text-green-400">→</div>

            <div className="flex-1 text-center">
              <div className="bg-white shadow-lg rounded-xl p-6 border-2 border-amber-200">
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-bold text-gray-900 mb-1">Fusion Output</div>
                <div className="text-sm text-gray-600">Discharge Prediction</div>
                <div className="text-xs text-gray-500 mt-2">Streamflow (m³/s)</div>
              </div>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Training Performance</h2>

            <div className="flex gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-600"></div>
                <span className="text-sm text-gray-600">Training Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-teal-500"></div>
                <span className="text-sm text-gray-600">Validation Loss</span>
              </div>
            </div>

            <div className="relative flex gap-4">
              <div className="flex flex-col justify-between py-2 text-xs text-gray-600 w-12">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = chartData.min + (chartData.max - chartData.min) * (1 - i / 4);
                  return (
                    <span key={i} className="text-right">{value.toFixed(2)}</span>
                  );
                })}
              </div>

              <div className="flex-1">
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="w-full h-80 border border-gray-200 rounded-lg bg-white"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 25}
                      x2="100"
                      y2={i * 25}
                      stroke="#E5E7EB"
                      strokeWidth="0.2"
                    />
                  ))}

                  {trainingPath && (
                    <path
                      d={trainingPath}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}

                  {validationPath && (
                    <path
                      d={validationPath}
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>

                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Epoch 1</span>
                  <span>Epoch {Math.floor(trainingHistory.length / 2)}</span>
                  <span>Epoch {trainingHistory.length}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Final Training Loss</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {trainingHistory.length > 0 ? trainingHistory[trainingHistory.length - 1].training_loss.toFixed(4) : 'N/A'}
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium text-gray-700">Final Validation Loss</span>
                </div>
                <div className="text-2xl font-bold text-teal-600">
                  {trainingHistory.length > 0 ? trainingHistory[trainingHistory.length - 1].validation_loss.toFixed(4) : 'N/A'}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Total Epochs</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {trainingHistory.length}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Model Parameters</h3>
            <div className="space-y-3">
              {[
                { label: 'LSTM Units', value: '128' },
                { label: 'Dropout Rate', value: '0.2' },
                { label: 'Learning Rate', value: '0.001' },
                { label: 'Batch Size', value: '32' },
                { label: 'Optimizer', value: 'Adam' },
                { label: 'Loss Function', value: 'MSE' }
              ].map((param, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{param.label}</span>
                  <span className="font-semibold text-gray-900">{param.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Training Configuration</h3>
            <div className="space-y-3">
              {[
                { label: 'Early Stopping', value: 'Enabled' },
                { label: 'Patience', value: '10 epochs' },
                { label: 'Validation Split', value: '20%' },
                { label: 'Data Normalization', value: 'MinMax' },
                { label: 'Sequence Length', value: '30 days' },
                { label: 'Features', value: '12 variables' }
              ].map((config, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{config.label}</span>
                  <span className="font-semibold text-gray-900">{config.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
