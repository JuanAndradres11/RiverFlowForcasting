import { useState, useEffect } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { supabase, Catchment, Prediction } from '../lib/supabase';

export function CatchmentForecast() {
  const [catchments, setCatchments] = useState<Catchment[]>([]);
  const [selectedCatchment, setSelectedCatchment] = useState<string>('all');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'error_percentage'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [selectedCatchment]);

  useEffect(() => {
    filterAndSortPredictions();
  }, [predictions, searchTerm, sortField, sortOrder]);

  const loadData = async () => {
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

    let query = supabase
      .from('predictions')
      .select('*');

    if (selectedCatchment !== 'all') {
      query = query.eq('catchment_id', selectedCatchment);
    }

    const { data } = await query
      .order('date', { ascending: false })
      .limit(500);

    if (data) {
      setPredictions(data);
    }

    setLoading(false);
  };

  const filterAndSortPredictions = () => {
    let filtered = [...predictions];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.catchment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.date.includes(searchTerm)
      );
    }

    filtered.sort((a, b) => {
      let aVal: number | string = sortField === 'date' ? a.date : Math.abs(a.error_percentage);
      let bVal: number | string = sortField === 'date' ? b.date : Math.abs(b.error_percentage);

      if (sortField === 'date') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredPredictions(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Catchment ID', 'Actual Flow (m³/s)', 'Predicted Flow (m³/s)', 'Error (%)', 'Model Version'];
    const rows = filteredPredictions.map(p => [
      p.date,
      p.catchment_id,
      p.actual_flow.toFixed(2),
      p.predicted_flow.toFixed(2),
      p.error_percentage.toFixed(2),
      p.model_version
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `riverflow_predictions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCatchmentName = (id: string) => {
    const catchment = catchments.find(c => c.id === id);
    return catchment ? catchment.name : id;
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catchment-Wise Forecast</h1>
          <p className="text-gray-600">Detailed prediction data across all monitored catchments</p>
        </div>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Catchment
              </label>
              <select
                value={selectedCatchment}
                onChange={(e) => setSelectedCatchment(e.target.value)}
                className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Catchments</option>
                {catchments.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by date or catchment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as 'date' | 'error_percentage')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="error_percentage">Error %</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <Button onClick={exportToCSV} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Card>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Prediction Records ({filteredPredictions.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Catchment
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actual Flow
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Predicted Flow
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Error %
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPredictions.slice(0, 100).map((pred) => {
                    const errorAbs = Math.abs(pred.error_percentage);
                    const errorColor = errorAbs < 5 ? 'text-green-600' :
                                       errorAbs < 10 ? 'text-amber-600' :
                                       'text-red-600';

                    return (
                      <tr key={pred.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(pred.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900">{pred.catchment_id}</div>
                          <div className="text-xs text-gray-500">{getCatchmentName(pred.catchment_id)}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {pred.actual_flow.toFixed(1)} m³/s
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">
                          {pred.predicted_flow.toFixed(1)} m³/s
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-medium ${errorColor}`}>
                          {pred.error_percentage > 0 ? '+' : ''}{pred.error_percentage.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            errorAbs < 5 ? 'bg-green-100 text-green-800' :
                            errorAbs < 10 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {errorAbs < 5 ? 'Excellent' :
                             errorAbs < 10 ? 'Good' :
                             'Fair'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPredictions.length > 100 && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing first 100 of {filteredPredictions.length} records
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
