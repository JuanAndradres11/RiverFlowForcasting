import { BarChart3, Globe, Brain, TrendingUp, Settings, Activity } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'catchment', label: 'Catchment-Wise Forecast', icon: Globe },
    { id: 'model', label: 'Model Insights', icon: Brain },
    { id: 'trends', label: 'Historical Trends', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0 shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-2 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">RiverFlowAI</h2>
            <p className="text-xs text-slate-400">ML Forecasting</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 shadow-lg'
                      : 'hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Model Version</p>
          <p className="text-sm font-semibold">PNP-LSTM v1.0</p>
        </div>
      </div>
    </aside>
  );
}
