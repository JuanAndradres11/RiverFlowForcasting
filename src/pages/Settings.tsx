import { Settings as SettingsIcon, Database, Gauge, Bell } from 'lucide-react';
import { Card } from '../components/Card';

export function Settings() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your RiverFlowAI dashboard preferences</p>
        </div>

        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Data Configuration</h2>
              <p className="text-sm text-gray-600">Manage data sources and refresh settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Auto-refresh Data</div>
                <div className="text-sm text-gray-600">Automatically update predictions every 5 minutes</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Cache Predictions</div>
                <div className="text-sm text-gray-600">Store predictions locally for faster loading</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Gauge className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Display Preferences</h2>
              <p className="text-sm text-gray-600">Customize chart and table display options</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">
                Default Time Range
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Last 30 Days</option>
                <option selected>Last 90 Days</option>
                <option>Last 180 Days</option>
                <option>Last Year</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">
                Chart Style
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option selected>Line Chart</option>
                <option>Area Chart</option>
                <option>Bar Chart</option>
              </select>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block font-medium text-gray-900 mb-2">
                Decimal Precision
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>1 decimal place</option>
                <option selected>2 decimal places</option>
                <option>3 decimal places</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <Bell className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600">Configure alerts and notification preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">High Error Alerts</div>
                <div className="text-sm text-gray-600">Notify when prediction error exceeds 10%</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Peak Flow Warnings</div>
                <div className="text-sm text-gray-600">Alert when predicted flow exceeds threshold</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">RiverFlowAI v1.0</h3>
              <p className="text-sm text-blue-100">PNP-LSTM Deep Learning Model</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Last Updated</div>
              <div className="font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
