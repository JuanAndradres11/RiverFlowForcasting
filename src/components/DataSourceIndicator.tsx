/**
 * Data Source Indicator Component
 * Shows whether data is loaded from CSV (frozen) or fallback (dynamic)
 */
import { AlertCircle, CheckCircle } from 'lucide-react';

interface DataSourceIndicatorProps {
  isCSV: boolean;
  recordCount?: number;
  dataDate?: string;
}

export function DataSourceIndicator({
  isCSV,
  recordCount,
  dataDate,
}: DataSourceIndicatorProps) {
  if (isCSV) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <CheckCircle className="w-3 h-3" />
        <span>Frozen Data {dataDate && `(${dataDate})`}</span>
        {recordCount && <span className="ml-1">· {recordCount} records</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
      <AlertCircle className="w-3 h-3" />
      <span>Using Fallback Data</span>
    </div>
  );
}

/**
 * Fail-Safe Alert Component
 * Displays if CSV loading failed with helpful message
 */
export function FailSafeAlert() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <div>
        <p className="font-medium">Using fallback data</p>
        <p className="text-xs text-amber-700 mt-1">
          CSV data unavailable. App is using backup data store. Data is still consistent and reproducible.
        </p>
      </div>
    </div>
  );
}

/**
 * Data Load Error Component
 * Shows detailed error information for debugging
 */
export interface DataLoadErrorProps {
  error: string;
  retryFn?: () => void;
}

export function DataLoadError({ error, retryFn }: DataLoadErrorProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-medium text-red-800">Data Load Error</p>
        <p className="text-xs text-red-700 mt-1 font-mono break-all">{error}</p>
      </div>
      {retryFn && (
        <button
          onClick={retryFn}
          className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex-shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
}
