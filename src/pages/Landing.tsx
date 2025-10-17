import { Activity, Droplets, TrendingUp, Brain, ArrowRight, Waves } from 'lucide-react';
import { Button } from '../components/Button';

interface LandingProps {
  onStartForecasting: () => void;
}

export function Landing({ onStartForecasting }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RiverFlowAI</h1>
              <p className="text-xs text-gray-600">Deep Learning Forecasting</p>
            </div>
          </div>
          <Button onClick={onStartForecasting} size="sm">
            Dashboard
          </Button>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="w-4 h-4" />
              <span>PNP + LSTM Fusion Network</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Driven River Discharge
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Prediction System
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Climate-aware water resource management powered by deep learning.
              Accurate streamflow forecasting for Indian river catchments including
              Cauvery, Godavari, and Ganga basins.
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={onStartForecasting} size="lg" className="group">
                Start Forecasting
                <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Droplets className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Accurate Predictions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Achieve NSE values up to 0.92 with our advanced PNP-LSTM fusion
                network trained on historical hydrological data.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="bg-teal-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor streamflow trends with interactive visualizations and
                performance metrics including RMSE and MAE.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Waves className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Multiple Catchments
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cover major Indian river basins with catchment-specific models
                optimized for regional hydrological patterns.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 text-white text-center">
              <div>
                <div className="text-4xl font-bold mb-2">0.92</div>
                <div className="text-blue-100">Peak NSE Score</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5+</div>
                <div className="text-blue-100">River Catchments</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">94.7%</div>
                <div className="text-blue-100">Peak Accuracy</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">365</div>
                <div className="text-blue-100">Days Forecast</div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Our deep learning pipeline processes climate and hydrological data
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Data Collection', desc: 'Historical streamflow and climate variables' },
              { step: '2', title: 'PNP Processing', desc: 'Physics-guided neural preprocessing' },
              { step: '3', title: 'LSTM Modeling', desc: 'Temporal sequence learning' },
              { step: '4', title: 'Fusion Output', desc: 'Combined discharge predictions' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
                  <div className="bg-gradient-to-br from-blue-600 to-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-4">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold">RiverFlowAI</div>
                <div className="text-sm text-slate-400">Hydrological Forecasting</div>
              </div>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 RiverFlowAI. For research and water management.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
