/*
  # RiverFlowAI Database Schema

  1. New Tables
    - `catchments`
      - `id` (text, primary key) - Catchment identifier (e.g., "5001", "5002")
      - `name` (text) - Catchment name (e.g., "Cauvery Basin")
      - `river_name` (text) - Associated river
      - `location` (text) - Geographic location
      - `latitude` (real) - Latitude coordinate
      - `longitude` (real) - Longitude coordinate
      - `area_sq_km` (real) - Catchment area in square kilometers
      - `created_at` (timestamptz) - Record creation timestamp

    - `predictions`
      - `id` (uuid, primary key) - Unique prediction identifier
      - `catchment_id` (text, foreign key) - Reference to catchments
      - `date` (date) - Prediction date
      - `actual_flow` (real) - Actual measured streamflow (m³/s)
      - `predicted_flow` (real) - AI-predicted streamflow (m³/s)
      - `error_percentage` (real) - Percentage error
      - `model_version` (text) - Model version used
      - `created_at` (timestamptz) - Record creation timestamp

    - `model_metrics`
      - `id` (uuid, primary key) - Unique metric identifier
      - `catchment_id` (text, foreign key) - Reference to catchments
      - `model_version` (text) - Model version
      - `nse` (real) - Nash-Sutcliffe Efficiency
      - `rmse` (real) - Root Mean Square Error
      - `mae` (real) - Mean Absolute Error
      - `peak_accuracy` (real) - Peak flow prediction accuracy (%)
      - `training_epochs` (integer) - Number of training epochs
      - `validation_loss` (real) - Final validation loss
      - `created_at` (timestamptz) - Record creation timestamp

    - `training_history`
      - `id` (uuid, primary key) - Unique history identifier
      - `model_version` (text) - Model version
      - `epoch` (integer) - Epoch number
      - `training_loss` (real) - Training loss value
      - `validation_loss` (real) - Validation loss value
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (suitable for dashboard/research tool)
    
  3. Sample Data
    - Insert sample catchments for Indian river basins
    - Insert sample predictions and metrics for demonstration
*/

-- Create catchments table
CREATE TABLE IF NOT EXISTS catchments (
  id text PRIMARY KEY,
  name text NOT NULL,
  river_name text NOT NULL,
  location text NOT NULL,
  latitude real NOT NULL,
  longitude real NOT NULL,
  area_sq_km real NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catchment_id text NOT NULL REFERENCES catchments(id),
  date date NOT NULL,
  actual_flow real NOT NULL,
  predicted_flow real NOT NULL,
  error_percentage real NOT NULL,
  model_version text NOT NULL DEFAULT 'PNP-LSTM-v1',
  created_at timestamptz DEFAULT now()
);

-- Create model_metrics table
CREATE TABLE IF NOT EXISTS model_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catchment_id text NOT NULL REFERENCES catchments(id),
  model_version text NOT NULL DEFAULT 'PNP-LSTM-v1',
  nse real NOT NULL,
  rmse real NOT NULL,
  mae real NOT NULL,
  peak_accuracy real NOT NULL,
  training_epochs integer NOT NULL DEFAULT 100,
  validation_loss real NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create training_history table
CREATE TABLE IF NOT EXISTS training_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version text NOT NULL DEFAULT 'PNP-LSTM-v1',
  epoch integer NOT NULL,
  training_loss real NOT NULL,
  validation_loss real NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE catchments ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (research/dashboard tool)
CREATE POLICY "Public read access for catchments"
  ON catchments FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for predictions"
  ON predictions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for model_metrics"
  ON model_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public read access for training_history"
  ON training_history FOR SELECT
  TO anon
  USING (true);

-- Insert sample catchment data
INSERT INTO catchments (id, name, river_name, location, latitude, longitude, area_sq_km) VALUES
  ('5001', 'Upper Cauvery Basin', 'Cauvery', 'Karnataka', 12.8406, 76.6394, 10619),
  ('5002', 'Middle Cauvery Basin', 'Cauvery', 'Karnataka/Tamil Nadu', 11.9416, 78.1219, 16282),
  ('5003', 'Lower Cauvery Basin', 'Cauvery', 'Tamil Nadu', 11.3510, 79.8214, 15742),
  ('5004', 'Upper Godavari Basin', 'Godavari', 'Maharashtra', 19.8762, 75.3433, 31200),
  ('5005', 'Lower Ganga Basin', 'Ganga', 'Bihar/West Bengal', 25.5941, 85.1376, 24500)
ON CONFLICT (id) DO NOTHING;

-- Insert sample model metrics
INSERT INTO model_metrics (catchment_id, model_version, nse, rmse, mae, peak_accuracy, training_epochs, validation_loss) VALUES
  ('5001', 'PNP-LSTM-v1', 0.89, 45.2, 32.5, 92.3, 150, 0.042),
  ('5002', 'PNP-LSTM-v1', 0.92, 38.7, 28.1, 94.7, 150, 0.038),
  ('5003', 'PNP-LSTM-v1', 0.87, 51.3, 39.2, 90.5, 150, 0.051),
  ('5004', 'PNP-LSTM-v1', 0.91, 42.9, 31.8, 93.2, 150, 0.041),
  ('5005', 'PNP-LSTM-v1', 0.88, 48.6, 35.7, 91.8, 150, 0.046)
ON CONFLICT DO NOTHING;

-- Insert sample training history (epochs 1-150 with decreasing loss)
DO $$
DECLARE
  epoch_num INTEGER;
BEGIN
  FOR epoch_num IN 1..150 LOOP
    INSERT INTO training_history (model_version, epoch, training_loss, validation_loss)
    VALUES (
      'PNP-LSTM-v1',
      epoch_num,
      0.8 * exp(-epoch_num / 30.0) + 0.03,
      0.85 * exp(-epoch_num / 30.0) + 0.04
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Insert sample predictions (last 365 days for catchment 5001)
DO $$
DECLARE
  day_num INTEGER;
BEGIN
  FOR day_num IN 1..365 LOOP
    INSERT INTO predictions (catchment_id, date, actual_flow, predicted_flow, error_percentage, model_version)
    VALUES (
      '5001',
      current_date - (365 - day_num),
      150 + 100 * sin(day_num * 0.017) + random() * 20,
      150 + 100 * sin(day_num * 0.017) + random() * 15,
      (random() - 0.5) * 10,
      'PNP-LSTM-v1'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Insert sample predictions for other catchments (last 180 days)
DO $$
DECLARE
  day_num INTEGER;
  catchment_id TEXT;
  base_flow REAL;
  amplitude REAL;
  noise REAL;
BEGIN
  FOR catchment_id, base_flow, amplitude, noise IN 
    VALUES 
      ('5002', 200, 120, 25),
      ('5003', 180, 110, 30),
      ('5004', 250, 150, 35),
      ('5005', 220, 140, 28)
  LOOP
    FOR day_num IN 1..180 LOOP
      INSERT INTO predictions (catchment_id, date, actual_flow, predicted_flow, error_percentage, model_version)
      VALUES (
        catchment_id,
        current_date - (180 - day_num),
        base_flow + amplitude * sin(day_num * 0.017) + random() * noise,
        base_flow + amplitude * sin(day_num * 0.017) + random() * (noise * 0.7),
        (random() - 0.5) * 8,
        'PNP-LSTM-v1'
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_predictions_catchment_date ON predictions(catchment_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_model_metrics_catchment ON model_metrics(catchment_id);
CREATE INDEX IF NOT EXISTS idx_training_history_epoch ON training_history(model_version, epoch);