/*
  # Create packages and related tables

  1. New Tables
    - `packages`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `duration_days` (integer)
      - `destination` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `package_dates`
      - `id` (uuid, primary key)
      - `package_id` (uuid, foreign key)
      - `start_date` (date)
      - `end_date` (date)
      - `available_spots` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin writes
*/

-- Create packages table
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  duration_days integer NOT NULL CHECK (duration_days > 0),
  destination text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create package_dates table
CREATE TABLE package_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  available_spots integer NOT NULL CHECK (available_spots >= 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_dates ENABLE ROW LEVEL SECURITY;

-- Policies for packages
CREATE POLICY "Allow public read access"
  ON packages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated admin insert"
  ON packages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow authenticated admin update"
  ON packages
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policies for package_dates
CREATE POLICY "Allow public read access"
  ON package_dates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated admin insert"
  ON package_dates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow authenticated admin update"
  ON package_dates
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for packages
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE
  ON packages
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();