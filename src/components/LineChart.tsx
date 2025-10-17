import { useMemo } from 'react';

interface DataPoint {
  date: string;
  actual: number;
  predicted: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
}

export function LineChart({ data, title }: LineChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return { min: 0, max: 100, points: [] };

    const allValues = data.flatMap(d => [d.actual, d.predicted]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min;
    const padding = range * 0.1;

    return {
      min: min - padding,
      max: max + padding,
      points: data
    };
  }, [data]);

  const getYPosition = (value: number) => {
    const { min, max } = chartData;
    return 100 - ((value - min) / (max - min)) * 100;
  };

  const actualPath = useMemo(() => {
    if (!chartData.points.length) return '';

    return chartData.points
      .map((point, i) => {
        const x = (i / (chartData.points.length - 1)) * 100;
        const y = getYPosition(point.actual);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [chartData]);

  const predictedPath = useMemo(() => {
    if (!chartData.points.length) return '';

    return chartData.points
      .map((point, i) => {
        const x = (i / (chartData.points.length - 1)) * 100;
        const y = getYPosition(point.predicted);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [chartData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = chartData.min + (chartData.max - chartData.min) * (i / (tickCount - 1));
    return Math.round(value);
  }).reverse();

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div className="flex gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-600"></div>
          <span className="text-sm text-gray-600">Actual Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-teal-500 border-2 border-teal-500"></div>
          <span className="text-sm text-gray-600">Predicted Flow</span>
        </div>
      </div>

      <div className="relative flex gap-4">
        <div className="flex flex-col justify-between py-2 text-xs text-gray-600 w-12">
          {yTicks.map((tick, i) => (
            <span key={i} className="text-right">{tick}</span>
          ))}
        </div>

        <div className="flex-1">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-64 border border-gray-200 rounded-lg bg-gradient-to-b from-blue-50/30 to-white"
          >
            <defs>
              <linearGradient id="actualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

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

            {actualPath && (
              <>
                <path
                  d={`${actualPath} L 100 100 L 0 100 Z`}
                  fill="url(#actualGradient)"
                />
                <path
                  d={actualPath}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}

            {predictedPath && (
              <path
                d={predictedPath}
                fill="none"
                stroke="#14B8A6"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          <div className="flex justify-between mt-2 text-xs text-gray-600">
            {data.length > 0 && (
              <>
                <span>{formatDate(data[0].date)}</span>
                <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>
                <span>{formatDate(data[data.length - 1].date)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-gray-500">
        Streamflow (m³/s)
      </div>
    </div>
  );
}
