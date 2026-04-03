/**
 * CSV Data Loader with fail-safe mechanisms
 * Handles parsing frozen CSV data and validation
 */

export interface CSVRecord {
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
 * Parse CSV text into array of records
 * Includes type conversion and validation
 */
function parseCSV(csvText: string): CSVRecord[] {
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    console.error('CSV parsing: Invalid CSV - too few lines');
    return [];
  }
  
  // Skip header line
  const records: CSVRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const fields = line.split(',');
    
    if (fields.length < 9) {
      console.warn(`CSV parsing: Skipping invalid row ${i + 1} - insufficient fields`);
      continue;
    }
    
    try {
      const lat = parseFloat(fields[3]);
      const lng = parseFloat(fields[4]);
      const actual_flow = parseFloat(fields[5]);
      const predicted_flow = parseFloat(fields[6]);
      const error_percentage = parseFloat(fields[7]);
      
      // Validate numeric conversions
      if (isNaN(lat) || isNaN(lng) || isNaN(actual_flow) || 
          isNaN(predicted_flow) || isNaN(error_percentage)) {
        console.warn(`CSV parsing: Skipping row ${i + 1} - invalid numeric values`);
        continue;
      }
      
      records.push({
        date: fields[0].trim(),
        catchment_id: fields[1].trim(),
        catchment_name: fields[2].trim(),
        lat,
        lng,
        actual_flow,
        predicted_flow,
        error_percentage,
        model_version: fields[8].trim(),
      });
    } catch (error) {
      console.warn(`CSV parsing: Error parsing row ${i + 1}:`, error);
      continue;
    }
  }
  
  return records;
}

/**
 * Load and parse frozen CSV data with fallback support
 */
export async function loadFrozenData(): Promise<CSVRecord[]> {
  try {
    const response = await fetch('/data/frozenData.csv');
    
    if (!response.ok) {
      console.error(`CSV loading failed: HTTP ${response.status} ${response.statusText}`);
      return [];
    }
    
    const csvText = await response.text();
    
    if (!csvText || csvText.length === 0) {
      console.error('CSV loading: Empty CSV file received');
      return [];
    }
    
    const records = parseCSV(csvText);
    
    if (records.length === 0) {
      console.error('CSV loading: No valid records parsed');
      return [];
    }
    
    console.log(`✅ CSV loaded successfully: ${records.length} records`);
    return records;
  } catch (error) {
    console.error('CSV loading error:', error);
    return [];
  }
}

/**
 * Get records for a specific date
 * Falls back to latest available date if exact date not found
 */
export function getRecordsForDate(
  records: CSVRecord[],
  targetDate?: string
): CSVRecord[] {
  if (records.length === 0) {
    console.warn('getRecordsForDate: No records available');
    return [];
  }
  
  // Use provided date or today's date
  const date = targetDate || new Date().toISOString().split('T')[0];
  
  // Try exact date match
  let dated = records.filter(r => r.date === date);
  
  if (dated.length > 0) {
    return dated;
  }
  
  // Fallback: Get all unique dates and use latest
  const uniqueDates = [...new Set(records.map(r => r.date))].sort().reverse();
  
  if (uniqueDates.length === 0) {
    console.warn('getRecordsForDate: No dates found in records');
    return [];
  }
  
  const latestDate = uniqueDates[0];
  console.log(`getRecordsForDate: Date ${date} not found, using latest: ${latestDate}`);
  
  dated = records.filter(r => r.date === latestDate);
  return dated;
}

/**
 * Get records for a specific catchment
 */
export function getRecordsByCatchment(
  records: CSVRecord[],
  catchmentId: string
): CSVRecord[] {
  return records.filter(r => r.catchment_id === catchmentId);
}

/**
 * Validate data consistency
 */
export function validateCSVData(records: CSVRecord[]): {
  valid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (records.length === 0) {
    warnings.push('No records found');
  }
  
  // Check for missing fields
  records.forEach((r, idx) => {
    if (!r.date) warnings.push(`Row ${idx}: Missing date`);
    if (!r.catchment_id) warnings.push(`Row ${idx}: Missing catchment_id`);
    if (!r.catchment_name) warnings.push(`Row ${idx}: Missing catchment_name`);
    if (isNaN(r.lat)) warnings.push(`Row ${idx}: Invalid lat`);
    if (isNaN(r.lng)) warnings.push(`Row ${idx}: Invalid lng`);
    if (isNaN(r.actual_flow)) warnings.push(`Row ${idx}: Invalid actual_flow`);
    if (isNaN(r.predicted_flow)) warnings.push(`Row ${idx}: Invalid predicted_flow`);
    if (isNaN(r.error_percentage)) warnings.push(`Row ${idx}: Invalid error_percentage`);
  });
  
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
