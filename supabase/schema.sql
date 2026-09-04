-- ==============================================================================
-- PhytoGuard AI - Complete Supabase Database Schema
-- Project Reference: eykcxrzxcawbwqqatzeo
-- Includes: Profiles, Demo Requests, CNN Analysis Results, Drone Fleet, Crops
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table (Growers & System Administrators)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null,
  first_name text,
  last_name text,
  phone text,
  district text default 'Rangpur',
  role text check (role in ('admin', 'grower')) default 'grower',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 2. Demo Requests Table (Grower Inbound Requests from /free-demo)
-- ------------------------------------------------------------------------------
create table if not exists public.demo_requests (
  id uuid primary key default uuid_generate_v4(),
  request_id text unique not null,
  user_name text not null,
  user_email text not null,
  user_phone text,
  company text,
  district text not null,
  acreage numeric not null default 150,
  crop text not null,
  status text check (status in ('Pending Review', 'Approved', 'Imagery Uploaded')) default 'Pending Review' not null,
  dataset_count integer default 0 not null,
  sensor_model text default 'DJI Matrice 350 RTK',
  gsd text default '0.82 cm/px',
  altitude text default '65 m AGL',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. CNN Analysis Results Table (CNN Model Outcomes for Leaf Pathology)
-- ------------------------------------------------------------------------------
create table if not exists public.cnn_analysis_results (
  id uuid primary key default uuid_generate_v4(),
  request_id text references public.demo_requests(request_id) on delete cascade not null,
  image_url text default '/assets/thumb-early-blight.jpg',
  crop text not null,
  detected_pathology text not null,
  scientific_name text,
  confidence numeric not null default 95.5,
  severity text check (severity in ('Low', 'Moderate', 'Severe', 'Optimal')) default 'Moderate' not null,
  affected_canopy_pct numeric not null default 18.5,
  recommended_treatment text not null,
  prescription_details jsonb default '{}'::jsonb,
  spectral_bands jsonb default '["RGB True Color", "NIR False Color", "NDVI Canopy Health", "Thermal Stress"]'::jsonb,
  model_version text default 'Phyto-CNN-ResNet50-v2.4',
  analyzed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. Drone Fleet Telemetry Table (Autonomous Drones)
-- ------------------------------------------------------------------------------
create table if not exists public.drone_missions (
  id uuid primary key default uuid_generate_v4(),
  drone_model text not null,
  callsign text not null,
  status text check (status in ('In-Flight', 'Standby', 'Maintenance')) default 'Standby' not null,
  mission_name text not null,
  battery_pct integer default 85 not null,
  area_scanned_ha numeric default 382.5 not null,
  total_area_ha numeric default 450.0 not null,
  coverage_pct numeric default 85.0 not null,
  rtk_fix text default 'Fixed RTK (±1.5cm)' not null,
  altitude_m integer default 65 not null,
  speed_ms numeric default 12.4 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. Monitored Crops Table (Farm Sectors)
-- ------------------------------------------------------------------------------
create table if not exists public.monitored_crops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  crop_key text not null,
  acreage text not null,
  health_score integer not null,
  status text not null,
  status_type text check (status_type in ('success', 'warning', 'danger', 'info')) default 'success' not null,
  last_flight text not null,
  order_index integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- Row Level Security (RLS) Configuration
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.demo_requests enable row level security;
alter table public.cnn_analysis_results enable row level security;
alter table public.drone_missions enable row level security;
alter table public.monitored_crops enable row level security;

-- Policies: Allow read & write for anon and authenticated (idempotent)
drop policy if exists "Allow all read profiles" on public.profiles;
drop policy if exists "Allow all write profiles" on public.profiles;
create policy "Allow all read profiles" on public.profiles for select to anon, authenticated using (true);
create policy "Allow all write profiles" on public.profiles for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all read demo_requests" on public.demo_requests;
drop policy if exists "Allow all write demo_requests" on public.demo_requests;
create policy "Allow all read demo_requests" on public.demo_requests for select to anon, authenticated using (true);
create policy "Allow all write demo_requests" on public.demo_requests for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all read cnn_analysis_results" on public.cnn_analysis_results;
drop policy if exists "Allow all write cnn_analysis_results" on public.cnn_analysis_results;
create policy "Allow all read cnn_analysis_results" on public.cnn_analysis_results for select to anon, authenticated using (true);
create policy "Allow all write cnn_analysis_results" on public.cnn_analysis_results for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all read drone_missions" on public.drone_missions;
drop policy if exists "Allow all write drone_missions" on public.drone_missions;
create policy "Allow all read drone_missions" on public.drone_missions for select to anon, authenticated using (true);
create policy "Allow all write drone_missions" on public.drone_missions for all to anon, authenticated using (true) with check (true);

drop policy if exists "Allow all read monitored_crops" on public.monitored_crops;
drop policy if exists "Allow all write monitored_crops" on public.monitored_crops;
create policy "Allow all read monitored_crops" on public.monitored_crops for select to anon, authenticated using (true);
create policy "Allow all write monitored_crops" on public.monitored_crops for all to anon, authenticated using (true) with check (true);

-- ------------------------------------------------------------------------------
-- Seed Initial Demo Data
-- ------------------------------------------------------------------------------
insert into public.demo_requests (request_id, user_name, user_email, user_phone, company, district, acreage, crop, status, dataset_count, sensor_model, gsd, altitude, notes)
values
  ('REQ-2026-081', 'Ador', 'ador@phytoguard.ai', '+880 1711-445566', 'Chowdhury Agro-Tech Ltd', 'Dinajpur', 280, 'Wheat', 'Approved', 1, 'DJI Matrice 350 RTK / MicaSense RedEdge-P', '0.65 cm/px', '60 m AGL', 'Early rust signs detected in quadrant B-4'),
  ('REQ-2026-082', 'Rafiqul Islam', 'rafiqul@dinajpur-farms.bd', '+880 1722-556677', 'North Bengal Seed Co.', 'Rangpur', 195, 'Tomatoes', 'Imagery Uploaded', 1, 'DJI Mavic 3 Multispectral (M3M)', '0.82 cm/px', '65 m AGL', 'Late Blight suspicion on leaf undersides'),
  ('REQ-2026-083', 'Tariqul Hasan', 'tariqul@bogra-green.com', '+880 1733-667788', 'Bogra Agronomics Enterprise', 'Bogra', 340, 'Soybeans', 'Approved', 1, 'Resonon Pika Hyperspectral Sensor', '0.45 cm/px', '50 m AGL', 'Canopy vigor index dropping in Sector 3'),
  ('REQ-2026-084', 'Nazrul Ahmed', 'nazrul@rajshahi-orchards.net', '+880 1744-778899', 'Padma Delta Growers', 'Rajshahi', 410, 'Cucumbers', 'Pending Review', 0, 'DJI Matrice 350 RTK', '0.70 cm/px', '70 m AGL', 'Requesting multi-band flight grid for powdery mildew check')
on conflict (request_id) do nothing;

insert into public.cnn_analysis_results (request_id, image_url, crop, detected_pathology, scientific_name, confidence, severity, affected_canopy_pct, recommended_treatment, model_version)
values
  ('REQ-2026-081', '/assets/thumb-brown-spot.jpg', 'Wheat', 'Yellow Rust', 'Puccinia striiformis', 97.4, 'Moderate', 14.2, 'Targeted fungicide spray (Tebuconazole / Propiconazole) with DJI Agras T40 within 48h.', 'Phyto-CNN-ResNet50-v2.4'),
  ('REQ-2026-082', '/assets/thumb-late-blight.jpg', 'Tomatoes', 'Late Blight', 'Phytophthora infestans', 98.6, 'Severe', 24.8, 'Copper hydroxide fungicide application; isolate row 12-18 and restrict overhead irrigation.', 'Phyto-CNN-ResNet50-v2.4'),
  ('REQ-2026-083', '/assets/thumb-early-blight.jpg', 'Soybeans', 'Soybean Rust', 'Phakopsora pachyrhizi', 94.2, 'Low', 6.8, 'Preventative strobilurin application; schedule follow-up autonomous drone scan in 5 days.', 'Phyto-CNN-ResNet50-v2.4')
on conflict do nothing;

insert into public.drone_missions (drone_model, callsign, status, mission_name, battery_pct, area_scanned_ha, total_area_ha, coverage_pct, rtk_fix, altitude_m, speed_ms)
values
  ('DJI Matrice 350 RTK', 'MATRICE-ALPHA', 'In-Flight', 'Sector 4 Autonomous Pathology Grid', 88, 382.5, 450.0, 85.0, 'Fixed RTK (±1.5cm)', 65, 12.4),
  ('DJI Mavic 3 Enterprise', 'MAVIC-BRAVO', 'Standby', 'Sub-millimeter Spot Inspection', 100, 0.0, 450.0, 0.0, 'Fixed RTK (±1.5cm)', 0, 0.0)
on conflict do nothing;

insert into public.monitored_crops (name, crop_key, acreage, health_score, status, status_type, last_flight, order_index)
values
  ('Wheat (Triticum aestivum)', 'wheat', '120 Ha', 86, 'Yellow Rust Alert', 'warning', '14 mins ago', 1),
  ('Tomatoes (Solanum lycopersicum)', 'tomatoes', '85 Ha', 78, 'Late Blight Detected', 'danger', '42 mins ago', 2),
  ('Soybeans (Glycine max)', 'soybeans', '95 Ha', 95, 'Optimal Canopy Vigor', 'success', '1 hr ago', 3),
  ('Cucumbers (Cucumis sativus)', 'cucumbers', '40 Ha', 81, 'Downy Mildew Risk', 'warning', '2 hrs ago', 4),
  ('Potatoes (Solanum tuberosum)', 'potatoes', '65 Ha', 84, 'Early Blight Monitored', 'info', '3 hrs ago', 5),
  ('Grapevines (Vitis vinifera)', 'grapevines', '45 Ha', 93, 'Healthy Canopy', 'success', '4 hrs ago', 6)
on conflict do nothing;

