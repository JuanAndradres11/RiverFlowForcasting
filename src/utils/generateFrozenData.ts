/**
 * Generates frozen, deterministic data for CSV export
 * No randomness - uses sine waves and fixed patterns
 */

interface CatchmentData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  baseFlow: number;
}

interface HistoryRecord {
  date: string;
  catchment_id: string;
  catchment_name: string;
  lat: number;
  lng: number;
  actual_flow: number;
  predicted_flow: number;
  error_percentage: number;
  model_version: string;
}

/**
 * Deterministic date generation (no randomness)
 */
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const now = new Date('2025-01-05'); // Fixed reference date
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * Deterministic flow series using sine wave pattern
 * No randomness - reproduces identical values every time
 */
function generateDeterministicFlowSeries(
  baseFlow: number,
  catchmentId: string,
  days: number
): number[] {
  const data: number[] = [];
  
  // Use catchmentId as seed variation to get different patterns per catchment
  const seedVal = catchmentId.charCodeAt(0) % 10;
  
  for (let i = 0; i < days; i++) {
    // Sine wave pattern: base + amplitude * sin(phase)
    const amplitude = baseFlow * 0.25;
    const phase = ((i / days) * 4 * Math.PI) + (seedVal * 0.5);
    const sineComponent = Math.sin(phase) * amplitude;
    
    // Add deterministic "trend": slight increase
    const trendComponent = (i / days) * baseFlow * 0.1;
    
    // Combine: base + sine + trend
    let value = baseFlow + sineComponent + trendComponent;
    
    // Clamp to realistic range
    value = Math.max(120, Math.min(value, 1800));
    
    // 2 peak days at fixed positions (day 10 and day 25)
    if (i === 10 || i === 25) {
      value = value * 1.5; // 50% increase on peak days
    }
    
    data.push(Number(value.toFixed(1)));
  }
  
  return data;
}

/**
 * Deterministic error calculation
 * 90% of time: 3-8% error
 * 10% of time: 8-10% error
 */
function generateDeterministicError(
  actualFlow: number,
  recordIndex: number,
): number {
  // Use recordIndex to deterministically pick error pattern
  const isPeakError = recordIndex % 10 === 0; // 10% of records have higher error
  
  if (isPeakError) {
    // Rare high error: 8-10%
    const baseError = 8 + ((recordIndex % 2) * 2);
    return Number(((recordIndex % 2 === 0 ? baseError : -baseError)).toFixed(2));
  } else {
    // Normal error: 3-8%
    const baseError = 3 + ((recordIndex % 5) * 1);
    return Number(((recordIndex % 2 === 0 ? baseError : -baseError)).toFixed(2));
  }
}

/**
 * Generate complete frozen dataset
 */
export function generateFrozenDataset(
  catchmentsData: CatchmentData[],
  days: number = 37
): HistoryRecord[] {
  const dates = generateDates(days);
  const records: HistoryRecord[] = [];
  let recordIndex = 0;
  
  catchmentsData.forEach((catchment) => {
    const flowSeries = generateDeterministicFlowSeries(
      catchment.baseFlow,
      catchment.id,
      days
    );
    
    flowSeries.forEach((actualFlow, dayIndex) => {
      const errorPercent = generateDeterministicError(actualFlow, recordIndex);
      const predictedFlow = actualFlow * (1 - errorPercent / 100);
      
      records.push({
        date: dates[dayIndex],
        catchment_id: catchment.id,
        catchment_name: catchment.name,
        lat: catchment.lat,
        lng: catchment.lng,
        actual_flow: Number(actualFlow.toFixed(2)),
        predicted_flow: Number(predictedFlow.toFixed(2)),
        error_percentage: errorPercent,
        model_version: 'v1',
      });
      
      recordIndex++;
    });
  });
  
  return records;
}

/**
 * Convert records to CSV string
 */
export function recordsToCSV(records: HistoryRecord[]): string {
  const headers = [
    'date',
    'catchment_id',
    'catchment_name',
    'lat',
    'lng',
    'actual_flow',
    'predicted_flow',
    'error_percentage',
    'model_version',
  ];
  
  const rows = records.map((r) => [
    r.date,
    r.catchment_id,
    r.catchment_name,
    r.lat.toFixed(4),
    r.lng.toFixed(4),
    r.actual_flow.toFixed(2),
    r.predicted_flow.toFixed(2),
    r.error_percentage.toFixed(2),
    r.model_version,
  ]);
  
  const csvLines = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ];
  
  return csvLines.join('\n');
}
