// Utility to expand frozen dataset to 37 days
import { Catchment } from "../data/cauveryData";

const CATCHMENTS: Catchment[] = [
  { id: "akkihebbal", name: "Akkihebbal", lat: 12.6028, lng: 76.4008 },
  { id: "alandurai", name: "Alandurai", lat: 10.9519, lng: 76.7853 },
  { id: "annavasal", name: "Annavasal", lat: 10.975, lng: 79.7539 },
  { id: "balasamudram", name: "Balasamudram", lat: 10.4256, lng: 77.5394 },
  { id: "belur", name: "Belur", lat: 13.1689, lng: 75.8725 },
  { id: "bendrahalli", name: "Bendrahalli", lat: 12.1536, lng: 77.08 },
  { id: "bettadamane", name: "Bettadamane", lat: 13.0692, lng: 75.6794 },
  { id: "biligundulu", name: "Biligundulu", lat: 12.1822, lng: 77.7239 },
  { id: "chikkamalur", name: "Chikkamalur", lat: 12.6525, lng: 77.1847 },
  { id: "chikkarasinakere", name: "Chikkarasinakere", lat: 12.51, lng: 77.0367 },
  { id: "chunchunkatte", name: "Chunchunkatte", lat: 12.5094, lng: 76.3011 },
  { id: "elunuthimangalam", name: "Elunuthimangalam", lat: 11.0317, lng: 77.8875 },
  { id: "gandhavayal", name: "Gandhavayal", lat: 11.3742, lng: 76.9922 },
  { id: "gopurajapuram", name: "Gopurajapuram", lat: 10.8514, lng: 79.8 },
  { id: "hogenakkal", name: "Hogenakkal", lat: 12.1211, lng: 77.7819 },
  { id: "hommaragalli", name: "Hommaragalli", lat: 12.1144, lng: 76.4633 },
  { id: "jannapura", name: "Jannapura", lat: 13.0569, lng: 75.9617 },
  { id: "km_vadi", name: "K.M. Vadi", lat: 12.3461, lng: 76.2878 },
  { id: "kodumudi", name: "Kodumudi", lat: 11.0811, lng: 77.8903 },
  { id: "kokkedoddy", name: "Kokkedoddy", lat: 12.2961, lng: 77.4403 },
  { id: "kollegal", name: "Kollegal", lat: 12.1892, lng: 77.1 },
  { id: "kottathara", name: "Kottathara", lat: 11.1231, lng: 76.6794 },
  { id: "kudige", name: "Kudige", lat: 12.5025, lng: 75.9611 },
  { id: "kudlur", name: "Kudlur", lat: 11.8406, lng: 77.4628 },
  { id: "kukkalthurai", name: "Kukkalthurai", lat: 11.4856, lng: 76.8325 },
  { id: "lakshmananpatty", name: "Lakshmananpatty", lat: 10.4981, lng: 77.9458 },
  { id: "mh_halli", name: "M.H. Halli", lat: 12.8189, lng: 76.1333 },
  { id: "menangudi", name: "Menangudi", lat: 10.9489, lng: 79.7039 },
  { id: "musiri", name: "Musiri", lat: 10.9433, lng: 78.435 },
  { id: "muthankera", name: "Muthankera", lat: 11.8083, lng: 76.0839 },
  { id: "nallamaranpatty", name: "Nallamaranpatty", lat: 10.8808, lng: 77.9847 },
  { id: "nallathur", name: "Nallathur", lat: 11.0022, lng: 79.7503 },
  { id: "napoklu", name: "Napoklu", lat: 12.3142, lng: 75.6983 },
  { id: "nellithurai", name: "Nellithurai", lat: 11.2878, lng: 76.8911 },
  { id: "odandhurai", name: "Odandhurai", lat: 11.3217, lng: 76.8928 },
  { id: "peralam", name: "Peralam", lat: 10.9664, lng: 79.6614 },
  { id: "porakudi", name: "Porakudi", lat: 10.9039, lng: 79.7072 },
  { id: "pudunagara", name: "Pudunagara", lat: 12.07, lng: 77.41 },
  { id: "sakleshpur", name: "Sakleshpur", lat: 12.9436, lng: 75.7936 },
  { id: "savandapur", name: "Savandapur", lat: 11.5214, lng: 77.51 },
  { id: "sevanur", name: "Sevanur", lat: 11.5519, lng: 77.7319 }
];

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

function generateDeterministicFlowSeries(catchmentId: string, daysSinceStart: number): number[] {
  // Deterministic sine-wave based flow generation (no randomness)
  const baseFlows: Record<string, number> = {
    // High-flow catchments
    hogenakkal: 700,
    musiri: 640,
    peralam: 620,
    porakudi: 630,
    annavasal: 600,
    nallathur: 590,
    biligundulu: 660,
    // Medium-flow catchments
    akkihebbal: 620,
    kodumudi: 580,
    sevanur: 560,
    savandapur: 560,
    elunuthimangalam: 560,
    // Lower-flow catchments
    belur: 320,
    bettadamane: 370,
    kudige: 430,
    // Default
    default: 500,
  };

  const baseFlow = baseFlows[catchmentId] || baseFlows.default;
  const amplitude = baseFlow * 0.3;
  
  // Sine wave with +30% variance over 7 days
  const cycle = (daysSinceStart % 7) / 7;
  const variance = amplitude * Math.sin(cycle * Math.PI * 2);
  return [baseFlow + variance];
}

export function generateExpandedCSV(days: number = 37): string {
  const lines: string[] = ["date,catchment_id,catchment_name,lat,lng,actual_flow,predicted_flow,error_percentage,model_version"];
  
  const startDate = new Date("2024-12-30");
  
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + dayOffset);
    const dateStr = currentDate.toISOString().split("T")[0];
    
    for (const catchment of CATCHMENTS) {
      const flows = generateDeterministicFlowSeries(catchment.id, dayOffset);
      const actualFlow = flows[0];
      
      // Predict with small variance
      const predictionError = Math.sin(dayOffset * 0.5) * 2; // -2 to +2
      const predictedFlow = actualFlow + predictionError;
      
      // Error percentage: 90% normal (~0.5%), 10% high (~5%)
      const isHighError = Math.floor(dayOffset * 37 + Math.abs(catchment.id.charCodeAt(0))) % 10 === 9;
      const errorPct = isHighError ? 5.0 : 0.5;
      
      lines.push([
        dateStr,
        catchment.id,
        catchment.name,
        catchment.lat.toFixed(4),
        catchment.lng.toFixed(4),
        actualFlow.toFixed(2),
        predictedFlow.toFixed(2),
        (isHighError ? -errorPct : errorPct).toFixed(2),
        "v1"
      ].join(","));
    }
  }
  
  return lines.join("\n");
}

// Call this to print CSV to console
console.log(generateExpandedCSV(37));
