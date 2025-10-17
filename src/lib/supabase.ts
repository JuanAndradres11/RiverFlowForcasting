import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Catchment = {
  id: string;
  name: string;
  river_name: string;
  location: string;
  latitude: number;
  longitude: number;
  area_sq_km: number;
  created_at: string;
};

export type Prediction = {
  id: string;
  catchment_id: string;
  date: string;
  actual_flow: number;
  predicted_flow: number;
  error_percentage: number;
  model_version: string;
  created_at: string;
};

export type ModelMetrics = {
  id: string;
  catchment_id: string;
  model_version: string;
  nse: number;
  rmse: number;
  mae: number;
  peak_accuracy: number;
  training_epochs: number;
  validation_loss: number;
  created_at: string;
};

export type TrainingHistory = {
  id: string;
  model_version: string;
  epoch: number;
  training_loss: number;
  validation_loss: number;
  created_at: string;
};
