# PhytoGuard AI - Project Context (`contex.md`)

## 1. Project Overview
**PhytoGuard AI** is an autonomous drone-powered crop health and disease detection web platform. It enables growers, agronomists, and agricultural insurers to detect, analyze, and manage crop pathologies at the sub-millimeter leaf level using commercial drone imagery.

- **Website Name**: PhytoGuard AI
- **Brand Accent Rule**: In logos and brand headings, the letter **`G`** and the letters **`AI`** are styled in green (`#2f6f43` on light themes, `#6ed18c` on dark hero backgrounds): `Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span>`.
- **Primary Color Palette**:
  - Forest Green (`#2f6f43` / `#1f4f30`)
  - Warm Leaf Accents (`#6ed18c` / `#84c98b`)
  - Dark Slate / Off-Black (`#14211a` / `#000000`)
  - Warm Cream / Backgrounds (`#fbfbf9` / `#f6f7f2`)

---

## 2. Core Scope Boundaries (Strict Directives)

1. **Drone Imagery Exclusively**:
   - The platform strictly relies on **commercial drone imagery** (DJI Mavic 3 Enterprise, Mavic 3 Multispectral, DJI Agras, RTK base station grids).
   - **Zero satellite or mobile handheld photography**: All features, marketing, onboarding, and knowledge base guides must never include or mention satellite data or handheld phone scouting.
2. **Remote Repository**:
   - Primary remote: `origin/main` (`https://github.com/RrAdor/PhytoGuard-AI.git`).
3. **No "About" Link in Navigation**:
   - The "About" page/link has been permanently removed from the top navigation bar and footer.
   - The 5 top navigation items are strictly: `Dashboard`, `Main Crops`, `How It Works`, `Plans`, `Knowledge Base`.

---

## 3. Supported Crops & Diseases (6 Focus Crops)

The platform exclusively covers the following 6 crops and their verified pathologies:

1. **Wheat**:
   - Yellow Rust (*Puccinia striiformis*)
   - Powdery Mildew (*Blumeria graminis*)
   - Septoria Leaf Blotch (*Zymoseptoria tritici*)
   - Fusarium Head Blight (*Fusarium graminearum*)
2. **Tomatoes**:
   - Late Blight (*Phytophthora infestans*)
   - Early Blight (*Alternaria solani*)
   - Bacterial Spot (*Xanthomonas spp.*)
   - Tomato Mosaic Virus (ToMV)
3. **Soybeans**:
   - Soybean Rust (*Phakopsora pachyrhizi*)
   - Sudden Death Syndrome (SDS) (*Fusarium virguliforme*)
   - Brown Stem Rot (*Cadophora gregata*)
4. **Cucumbers**:
   - Downy Mildew (*Pseudoperonospora cubensis*)
   - Anthracnose (*Colletotrichum orbiculare*)
   - Angular Leaf Spot (*Pseudomonas syringae*)
5. **Potatoes**:
   - Early Blight (*Alternaria solani*)
   - Late Blight (*Phytophthora infestans*)
   - Colorado Potato Beetle
6. **Grapevines**:
   - Powdery Mildew (*Erysiphe necator*)
   - Downy Mildew (*Plasmopara viticola*)
   - Black Rot / Grey Spot (*Guignardia bidwellii*)

---

## 4. Technical Architecture

- **Stack**: Pure Vanilla JavaScript (ES Modules), HTML5, CSS3.
- **Build Tool**: Vite (`npm run dev`, `npm run build`).
- **Routing**: Lightweight client-side router (`navigate()`, `window.history.pushState`, `popstate` listener).
- **State & Storage**: Browser `localStorage` (`phyto_users`, `phyto_current_user`, `phytoguard_lang`).
- **Internationalization (i18n)**: Dedicated bilingual engine (`src/i18n.js`) with reactive language switcher (`.lang-selector`) supporting English (`EN`) and Bangla (`বাংলা`). Features localized route labels, dynamic Bengali numerals (`০-৯`), comprehensive dictionary for all views, and fallback font stacks (`Noto Sans Bengali`, `Kalpurush`, `SolaimanLipi`).

### Page Structure & Routes:
- `/` - Landing / Home page with drone hero, telemetry stats, and feature breakdowns.
- `/crops` - Main Crops catalog highlighting the 6 supported crops with quick filters.
- `/crops/:slug` - Dedicated high-fidelity pathology pages for each crop.
- `/how-it-works` - Step-by-step workflow (Flight Planning -> Autonomous Drone Capture -> Cloud Processing -> Actionable Prescription Maps).
- `/plans` - Pricing tiers (Grower, Agronomist Pro, Enterprise Fleet).
- `/knowledge-base` - Help Center with live search, 8 category hubs, and interactive article reader modals.
- `/dashboard` - Interactive agronomist dashboard with real-time field telemetry, drone flight logs, and leaf health heatmap.
- `/login` & `/signup` - Full authentication flow with persistent session storage, validation, and auto-redirect.
- `/free-demo` - Interactive demo request modal / page.

### Dashboard Architecture (Layman Reference):
- **Command Header Actions**: Top action buttons configured with `Export Report` (`.dash-export-btn`, white pill with download icon) on the left, followed by `+ Plan Drone Mission` (`.dash-flight-btn`, green pill) on the right, featuring the authentic Bangladeshi Taka symbol (`৳`) replacing the dollar icon.
- **Greeting Line**: Single-line welcome header displaying user name without wrapping or breaking across multiple lines.
- **Vital Signs (KPIs)**: Total monitored acreage (450 Ha), completed flights (28), active disease alerts (4), and overall leaf greenness/vigor (NDVI 0.82).
- **16:9 Drone Scan Coverage Heatmap**: Widescreen interactive field map visualizing exact drone flight paths, scanned vs. pending acreage (382.5 Ha / 450 Ha - 85%), camera footprint overlap density, NDVI vigor layer, and disease hotspot pins.
- **Sectors Panel**: Field-by-field breakdown for all 6 crops showing health percentage meters and identified leaf pathologies (e.g. Yellow Rust on Wheat, Late Blight on Tomatoes).
- **Fleet Panel**: Live battery, altitude, and flight state of active commercial drones (DJI Matrice 350 RTK, Mavic 3 Enterprise).

### Spatial & Layout System (Golden Ratio $\phi \approx 1.618$):
- Spacing progression: 8px (2xs), 13px (xs), 21px (sm), 34px (md), 55px (lg), 89px (xl).
- Generous breathing room across every section:
  - Major section separations: 55px to 89px margin/padding across all pages (Dashboard, Landing, Crops, How It Works, Plans, Knowledge Base).
  - Component/card grid gaps: 21px to 34px.
  - Card & panel inner paddings: 21px to 34px.
  - Item list rows: 21px gap with generous inner padding.

### Admin Architecture (Dedicated Demo Requests Command Center, Approval Workflow & Drone Photogrammetry):
- **Core Principle**:
  1. **User Dashboard Preservation**: Regular growers access their authentic, untouched dashboard (`dashboardPage()`) with 4 KPI cards, 16:9 Heatmap, 6 Monitored Crops with health progress bars, 2 Drone Fleet status cards, and Scouting Operations, with standard consumer navigation in header and footer.
  2. **Admin Segregation**: When logging in as System Administrator (`currentUser.role === 'admin'`), the admin does NOT see user dashboard data (no 6 crop rows, no drone fleet cards, no user heatmap).
  3. **Inbound Demo Requests & Drone Photogrammetry Dispatch**: The admin lands directly on the dedicated Admin Command Center (`adminDashboardPage()`).
- **Zero Consumer Navigation for Admin**:
  - The System Administrator does not need and does **NOT** see: `Dashboard`, `Main Crops`, `How It Works`, `Plans`, `Knowledge Base` in either the `<header>` or `<footer>`.
  - In `<header>`, the consumer navigation bar is replaced by a centered status badge: `🛡️ SYSTEM ADMINISTRATOR • DEMO REQUESTS & DRONE DISPATCH` with an animated pulsing dot.
  - The header brand logo and user avatar pill link directly to `/dashboard`.
  - In `<header>`, the admin profile button (`.admin-user-btn`) is styled with brand forest green (`#2f6f43`), high-contrast white text (`#ffffff`), translucent shield badge (`🛡️`), and full text visibility without truncation (`Admin: System Administrator`).
  - In `<footer>`, consumer marketing links are replaced by `🛡️ System Administrator Session Active` in a soft sage pill matching the site palette.
- **Admin Command Center Design System & Unified Color Palette**:
  - **Unified Page Container**: `max-width: 1280px;` matching the golden standard of the grower dashboard and feature pages.
  - **Atmospheric Aesthetics**: Light sage palette (`--paper: #f8faf4`, `--green: #2f6f43`, `--line: #dbe4d4`, `--ink: #14211a`) with frosted borders, 21px corner radii on cards, and soft ambient shadows (`0 4px 16px rgba(0, 0, 0, 0.02)`).
  - **Brand Header & Session Pills**: Header badge (`• SYSTEM ADMINISTRATOR • DEMO REQUESTS & DRONE DISPATCH`) and gateway pill styled with soft sage background (`#eaf5ee`), emerald border (`#c9e8d4`), and pulsing live radar dot (`#16a34a`).
  - **Harmonized KPI Cards**: Identical 21px border-radius, 16px icon wraps (`.metric-icon-wrap`), typography hierarchy (`.metric-label`, `.metric-value`, `.metric-sub`), and color accents (`text-green`, `text-amber`, `text-blue`).
  - **Pill Tab Controls & Search**: Filter tab switchers styled as a continuous soft pill bar with pill-shaped tabs and circular count badges (`#2f6f43` active background). Search bar styled as an organic pill input matching Knowledge Base search.
  - **Table Rows & Action Buttons**: Rows with hover lifts (`translateX(2px)` and `#f4f8f3`), crop pills in soft sage green, and actions (`Approve Request`, `+ Upload Drone Image`, `Inspect Rx`, `Re-upload`) formatted as single-line horizontal pill buttons (`border-radius: 999px; white-space: nowrap;`).
- **Admin Command Center Features**:
  - **Overview Top Bar**: `Users Demo Requests & <span class="dash-user-highlight">Drone Photogrammetry</span>` with session badge and subtitle.
  - **KPI Metrics Ribbon**:
    - `Users Demo Requests`: Total inbound farm applications received across all districts.
    - `Pending Approval`: Inbound requests awaiting administrator review.
    - `Approved Requests`: Requests cleared and ready for autonomous drone flight data ingestion.
    - `Hyperspectral Uploaded`: Commercial drone datasets processed with leaf-level pathology diagnoses and agronomist prescriptions.
  - **Filter Tabs & Real-Time Search**: Quick filtering by `All Requests`, `Pending Review`, `Approved`, and `Imagery Uploaded`, with instantaneous full-text search across name, email, company, district, and target crop.
  - **Demo Request Table & Two-Phase Lifecycle**:
    - **Precise Semantic Table Layout**: Each `<td>` maintains default `display: table-cell` with dedicated internal flex wrappers (`.req-id-wrap`, `.req-user-wrap`, `.req-loc-wrap`) and fixed column width assignments, guaranteeing 100% mathematical alignment between headings (`Request ID & Date`, `User / Farm Enterprise`, `District & Acreage`, `Target Crop`, `Status`, `Hyperspectral Dataset`, `Actions`) and row content.
    - **Step 1 - Review & Approval**: Pending requests feature a green `[ ✓ Approve Request ]` button (`.btn-approve-request`). Clicking updates status to `Approved` immediately and updates the hyperspectral column to `Ready for Drone Upload`.
    - **Step 2 - Drone Photogrammetry Upload**: Approved requests display a prominent `[ + Upload Drone Image ]` button (`.btn-upload-spectral`), opening the modal to attach calibrated commercial drone imagery (DJI Matrice 350 RTK, Mavic 3M, Resonon Pika, Agras T40) with sensor resolution, flight altitude, pathology diagnosis, and prescription.
    - **Step 3 - Multi-Band Inspection**: Uploaded requests feature `[ 👁️ Inspect Rx ]` (`.btn-inspect-spectral`) to launch the interactive multi-band viewer (RGB, NIR, NDVI, Thermal) and `[ 🔄 Re-upload ]`.
- **Grower Isolation**: Regular growers log into `/dashboard` and see strictly their own authentic dashboard with zero admin tables, zero admin banners, and zero drone upload controls.

### Auth & Login Architecture:
- **Role Switcher**: Segmented pill tabs (`🌱 Grower / Farm Login` vs `🛡️ Admin Portal`).
- **Farmer / Grower Login Title**: "Welcome" and subtitle "Please log in to your account" are centered horizontally in the exact middle of the form card (`display: flex; justify-content: center; align-items: center; text-align: center; margin: 0 auto;`).
- **Admin Login Title**: "Admin Gateway 🛡️" is strictly locked into a single line (`white-space: nowrap;`) with fluid typography (`clamp(1.45rem, 2.8vw, 1.85rem)`) and centered horizontally in the middle (`display: flex; justify-content: center; align-items: center;`).

### Landing Hero Section Video Architecture:
- **Cinematic 100% Full-Screen Hero**: `.landing-hero.has-video-bg` is styled to full viewport height (`min-height: 100vh; min-height: 100svh; height: 100vh; height: 100svh;`) with seamless full-bleed video coverage (`width: 100%; height: 100%; object-fit: cover; opacity: 0.88;`).
- **Continuous Uninterrupted Video Playback**: `<video id="hero-video" class="hero-video-bg" autoplay loop muted playsinline poster="/assets/dji-drone-hero.jpg" preload="auto">` with sources `/assets/hero-video.mp4` and `/assets/hero%20video.mp4` plays indefinitely in the background with zero pause buttons and automated resume listeners.
- **Dynamic 30fps Canvas Stream Fallback**: In restricted sandbox environments or offline contexts where external video streaming is unavailable, an HTML5 canvas animation generator automatically streams real-time autonomous drone RTK flight grids over the field image into `video.srcObject`, ensuring zero-blackout video playback.
- **Clean Foreground Presentation**: Glowing telemetry badge and pause toggle button removed for an immersive, cinematic hero experience highlighting the primary action ("Start free demo &rarr;").

### Supabase Integration & Backend Architecture:
- **Project Reference**: `eykcxrzxcawbwqqatzeo`
- **Supabase URL**: `https://eykcxrzxcawbwqqatzeo.supabase.co`
- **Client SDK**: `@supabase/supabase-js` v2.115.0 integrated via `src/supabase.js`.
- **Hybrid Authentication**:
  - Direct live authentication with Supabase Auth (`supabaseSignIn`, `supabaseSignUp`, `supabaseSignOut`).
  - Seamless offline/demo fallback to local seed accounts (`admin@phytoguard.ai`, `ador@phytoguard.ai`).
- **MCP Configuration**:
  - Global config registered in `~/.gemini/antigravity/mcp_config.json` and `~/.gemini/config/mcp_config.json`.
  - Installed skills: `supabase` & `supabase-postgres-best-practices`.
- **Database Schema (`supabase/schema.sql`)**:
  - `profiles`: Grower & admin user metadata.
  - `demo_requests`: Commercial drone trial requests from `/free-demo`.
  - `cnn_analysis_results`: Output of CNN model leaf pathology analysis (detected disease, confidence, severity, canopy %, agronomist prescription, spectral bands).
  - `drone_missions`: Drone fleet telemetry, battery, RTK positioning, and scanned acreage.
  - `monitored_crops`: Monitored sectors across the 6 supported crops.
- **CNN Model Inference Pipeline (`model_check_points/`)**:
  - **Source Checkpoints**: PyTorch checkpoints saved in `model_check_points/` (`best_model.pt` Epoch 6, `model_checkpoint.pt` Epoch 99, and `normalization_stats.npz` 125-band spectral statistics).
  - **Architecture**: 7-input-channel convolutional network with 3 Conv+BatchNorm+ReLU+MaxPool blocks, Global Average Pooling (128-d), and a 3-class linear classifier (95,683 parameters, ~380 KB).
  - **Spectral Channel Synthesis**: Synthesizes the 7 key agricultural spectral bands from drone imagery: Coastal Blue (450nm), Green (560nm), Red (660nm), RedEdge-1 (705nm), RedEdge-2 (740nm), NIR (840nm), and SWIR/Thermal Stress (940nm).
  - **Client-Side Browser Execution**: High-speed forward pass engine in `src/cnn-inference.js` with folded BatchNorm weights (`public/models/best_model_weights.json`) executing in ~15-45ms using `Float32Array`.
  - **Standalone Python CLI Tool**: `scripts/predict.py` executes direct forward passes using `best_model.pt` from the command line: `python3 scripts/predict.py <image_path> [--model <model.pt>] [--crop <crop>]`.
  - **Admin Photogrammetry Upload Integration**: Automatically triggered upon uploading commercial drone imagery from the Admin Dashboard modal (`#hyperspectral-upload-form`). Generates real pathology diagnosis, model confidence %, severity grading, affected canopy %, and precision prescription.
  - **Database Persistence**: Prediction results are immediately persisted into the `cnn_analysis_results` table in Supabase and mirrored to demo request telemetry.
- **Grower Dashboard Scan Lifecycle & 100x100 Result Box**:
  - **Non-Direct Notification Lifecycle**: The notification card on `/dashboard` is dynamic rather than static:
    - *Scanning In Progress State*: When a scan is requested and in progress (no results yet), it shows "AUTONOMOUS DRONE SCAN IN PROGRESS" with live RTK telemetry, animated 100x100 radar scanning chamber, sensor progress bar, and a `[ ⚡ Complete Scan & Process Results ]` CTA.
    - *Results Ready State*: When results are ready, it displays "AI DRONE SCANNING COMPLETED" with the **100x100 Result Box in a proper way**.
    - *Idle Standby State*: When no scan has been requested, it displays an invitation card to launch autonomous drone aerial scouting.
  - **Proper 100x100 Result Box (`.scan-box-100`)**:
    - Strictly sized to `100px × 100px`.
    - Features calibrated multispectral orthomosaic thumbnail, glowing emerald border, corner badge (`100×100`), bottom pathology status strip, and hover magnifying glass overlay.
    - Clicking the 100x100 box directly opens the Grower Multi-Band Inspect Rx Modal (`#user-viewer-modal`).
  - **Modal 100x100 ROI Specimen Box (`.modal-roi-100box`)**:
    - Inside `#user-viewer-modal`, features a 100x100 px high-resolution calibrated specimen ROI with sub-millimeter leaf lesion crosshairs.
  - **Interactive Controls**:
    - `[ ⚡ Complete Scan & Process Results ]`: Executes real PyTorch CNN forward pass via `predictDroneImageryWithCnn()`, attaches result, and transitions to the 100x100 result box.
    - `[ 🔄 New Scan ]`: Resets request back to scanning in progress.
  - **Bilingual Localization**: English and Bangla keys in `src/i18n.js` for all notification states, 100x100 badges, and action buttons.
