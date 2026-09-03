export const cropList = [
  {
    slug: 'wheat',
    emoji: '🌾',
    name: 'Wheat',
    shortName: 'Wheat',
    diseaseType: 'Fungal',
    diseases: ['Yellow Rust', 'Powdery Mildew', 'Septoria', 'Fusarium Head Blight'],
    summary: 'Detect Yellow Rust, Powdery Mildew, Septoria, and Fusarium Head Blight across tiller to grain fill.',
    headline: 'Protect grain yields from rust, mildew, and head blight.',
    accent: '#d4a838',
    image: '/assets/crop-wheat.jpg',
    products: ['stand-count', 'pest-disease', 'canopy', 'orthomosaic'],
  },
  {
    slug: 'tomato',
    emoji: '🍅',
    name: 'Tomatoes',
    shortName: 'Tomatoes',
    diseaseType: 'Fungal, Bacterial, Viral',
    diseases: ['Late Blight', 'Early Blight', 'Bacterial Spot', 'Tomato Mosaic Virus'],
    summary: 'Catch Late Blight, Early Blight, Bacterial Spot, and Tomato Mosaic Virus at the leaf level before spread.',
    headline: 'Leaf-level vigilance for processing and fresh.',
    accent: '#d95f4f',
    image: '/assets/crop-tomato.jpg',
    products: ['stand-count', 'pest-disease', 'canopy', 'orthomosaic', 'fruit-readiness'],
  },
  {
    slug: 'soybeans',
    emoji: '🫘',
    name: 'Soybeans',
    shortName: 'Soybeans',
    diseaseType: 'Fungal, Soil-borne',
    diseases: ['Soybean Rust', 'Sudden Death Syndrome (SDS)', 'Brown Stem Rot'],
    summary: 'Spot Soybean Rust, Sudden Death Syndrome (SDS), and Brown Stem Rot early to protect yield.',
    headline: 'Catch rust, SDS, and stem rot early.',
    accent: '#8d6d4c',
    image: '/assets/crop-soybeans.jpg',
    products: ['pest-disease', 'canopy', 'orthomosaic'],
  },
  {
    slug: 'cucumber',
    emoji: '🥒',
    name: 'Cucumbers',
    shortName: 'Cucumbers',
    diseaseType: 'Fungal, Bacterial',
    diseases: ['Downy Mildew', 'Anthracnose', 'Angular Leaf Spot'],
    summary: 'Identify Downy Mildew, Anthracnose, and Angular Leaf Spot across greenhouse and open fields.',
    headline: 'Protect foliage and fruit from mildew to anthracnose.',
    accent: '#438e51',
    image: '/assets/crop-cucumber.jpg',
    products: ['stand-count', 'pest-disease', 'canopy', 'orthomosaic'],
  },
  {
    slug: 'potato',
    emoji: '🥔',
    name: 'Potatoes',
    shortName: 'Potatoes',
    diseaseType: 'Fungal',
    diseases: ['Early Blight', 'Late Blight'],
    summary: 'Early detection of Early Blight and Late Blight across the foliage before tuber infection.',
    headline: 'Protect every row from early to late blight.',
    accent: '#8db54d',
    image: '/assets/crop-potato.jpg',
    products: ['stand-count', 'pest-disease', 'canopy', 'orthomosaic'],
  },
  {
    slug: 'grapevine',
    emoji: '🍇',
    name: 'Grapevines',
    shortName: 'Grapevines',
    diseaseType: 'Fungal',
    diseases: ['Powdery Mildew', 'Downy Mildew', 'Grey Spot'],
    summary: 'Monitor Powdery Mildew, Downy Mildew, and Grey Spot across vine canopies and grape clusters.',
    headline: 'Vineyard-level canopy and cluster vigilance.',
    accent: '#7a5299',
    image: '/assets/crop-grapevine.jpg',
    products: ['pest-disease', 'canopy', 'orthomosaic'],
  },
];

export const productCatalog = {
  'stand-count': {
    title: 'Stand count',
    text: 'Quantify emergence around 14 days after emergence.',
    href: '/how-it-works',
  },
  'pest-disease': {
    title: 'Pest & disease detection',
    text: 'Catch threats at the leaf level, before they spread.',
    href: '/how-it-works',
  },
  canopy: {
    title: 'Canopy coverage',
    text: 'Track vigor and closure across the whole season.',
    href: '/how-it-works',
  },
  orthomosaic: {
    title: 'Orthomosaic',
    text: 'Centimeter-accurate maps stitched from every drone flight.',
    href: '/how-it-works',
  },
  'fruit-readiness': {
    title: 'Fruit readiness',
    text: 'Predict harvest windows with ripeness mapped per plant.',
    href: '/how-it-works',
  },
};

export const plans = [
  {
    label: 'Growers',
    title: 'Field Monitoring',
    text: 'See crop risks weeks before they impact your yield.',
    pricing: 'Per hectare, billed per season',
    href: '/free-demo',
    items: [
      'Field mapping',
      'Autonomous waypoint flights',
      'Drone imagery',
      'AI pest, disease, and stress detection',
      'Severity-scored scouting reports',
      'GPS-tagged findings',
      'Canopy coverage',
      'Stand count',
      'Orthophotos and NDVI stitching',
      'Prescription maps for targeted treatment',
    ],
  },
  {
    label: 'Companies and Cooperations',
    title: 'Visibility across your entire grower network',
    text: 'Know which growers need attention before production is impacted.',
    pricing: 'Custom pricing, based on network size',
    href: '/free-demo',
    items: [
      'Multi-grower field visibility',
      'Per-field scouting reports',
      'High-resolution drone monitoring',
      'AI pest, disease, and stress detection',
      'Severity scoring across fields',
      'Geo Dashboard',
      'GPS-tagged findings',
      'Field history and trend tracking',
      'Prescription maps for targeted action',
    ],
  },
  {
    label: 'Service Providers',
    title: 'Crop Intelligence Services',
    text: 'Create a new revenue stream from the drones you already own.',
    pricing: 'Custom pricing, based on service scope',
    href: '/free-demo',
    items: [
      'Drone capture workflows',
      'Multispectral drone imagery',
      'AI scouting reports',
      'Pest, disease, and stress detection',
      'GPS-tagged findings',
      'Severity maps',
      'Prescription maps',
      'Customer-ready field reports',
      'Partner onboarding and training',
    ],
  },
  {
    label: 'Insurance',
    title: 'Digital Damage Assessment',
    text: 'Objective, drone-based field evidence for faster and more accurate assessment.',
    pricing: 'Custom pricing, based on assessment scope',
    href: '/free-demo',
    items: [
      'Drone-based field assessment',
      'Orthophoto field maps',
      'Geo-referenced evidence',
      'Damage area measurement',
      'Damage percentage estimation',
      'Severity-based documentation',
      'Before-and-after field comparison',
      'Assessment reports',
    ],
  },
];

export const features = [
  ['Pest & disease detection', 'From Colorado potato beetle to Late blight, AI identifies every threat at the leaf level before it spreads.'],
  ['Scout more on every visit', 'Cover more ground in less time and get a fuller picture of field status.'],
  ['Severity scoring', 'High, medium, and low risk ratings so you know exactly where to act first.'],
  ['New infection alerts', 'Get notified the moment fresh threats like late blight or early blight are flagged in your fields.'],
  ['Treatment guidance', 'Turn report findings into targeted spray plans and agronomy recommendations fast.'],
  ['One crop intelligence hub', 'Inspection photos, risk maps, and agronomy reports, all in one place, on any device.'],
];

export const kbCategories = [
  {
    id: 'getting-started',
    icon: 'rocket',
    title: 'Getting started with PhytoGuard',
    subtitle: "Let's Up Your Scouting Game",
    articles: [
      {
        slug: 'getting-started-faq',
        title: 'Getting Started FAQ',
        excerpt: 'Basic overview of PhytoGuard AI, autonomous drone scouting, and how leaf-level neural networks detect early field risks.',
        content: `<h3>What is PhytoGuard AI?</h3>
<p>PhytoGuard AI is an automated drone intelligence platform designed for growers, agronomists, and crop insurers. By flying commercial drones over your acreage in automated waypoint grids, our platform captures high-resolution imagery and scans every plant at the leaf level for early pest and pathogen detection.</p>
<h4>Key Prerequisites:</h4>
<ul>
  <li>A supported commercial drone (e.g. DJI Mavic 3 Enterprise, Mavic 3 Multispectral, or Mavic Air 2S).</li>
  <li>A PhytoGuard AI account and dashboard access.</li>
  <li>An active field boundary mapped in your account.</li>
</ul>`
      },
      {
        slug: 'download-apps',
        title: 'How to Download PhytoGuard Apps?',
        excerpt: 'Download PhytoGuard Sky and Sky+ flight planner applications for DJI Smart Controllers and tablets.',
        content: `<h3>Downloading PhytoGuard Flight Apps</h3>
<p>PhytoGuard provides dedicated autonomous flight applications that run directly on DJI Smart Controllers (Enterprise Smart Controller, RC Pro) and field tablets:</p>
<ul>
  <li><strong>PhytoGuard Sky:</strong> Designed for DJI Mavic Air 2S and Mavic 2 Pro drones.</li>
  <li><strong>PhytoGuard Sky+:</strong> Calibrated for DJI Mavic 3 Multispectral (RGB + RedEdge/NIR) and Mavic 3 Enterprise.</li>
</ul>
<h4>Installation Steps:</h4>
<ol>
  <li>Open the browser on your DJI RC Pro or Android field controller.</li>
  <li>Log in to your PhytoGuard AI dashboard and navigate to <em>Downloads</em>.</li>
  <li>Install the APK and grant location and USB telemetry permissions.</li>
</ol>`
      },
      {
        slug: 'supported-hardware',
        title: 'Supported Hardware and Devices',
        excerpt: 'List of verified drones, multispectral sensors, and RTK base stations supported out-of-the-box.',
        content: `<h3>Hardware Compatibility Matrix</h3>
<p>PhytoGuard AI requires zero proprietary flight hardware lock-in. We natively support industry-standard commercial drone platforms:</p>
<ul>
  <li><strong>DJI Mavic 3 Multispectral:</strong> 4/3 CMOS RGB sensor + 4 × 5MP multispectral sensors (Green, Red, RedEdge, NIR).</li>
  <li><strong>DJI Mavic 3 Enterprise:</strong> High-resolution 56× hybrid zoom and mechanical shutter for high-speed foliar capture.</li>
  <li><strong>DJI Mavic Air 2S &amp; Mavic 2 Pro:</strong> Standard RGB scouting platforms for stand count and visible foliar damage.</li>
  <li><strong>DJI Agras Series (T30, T40):</strong> Direct export for variable-rate spray applications.</li>
  <li><strong>RTK Ground Gateways:</strong> DJI D-RTK 2 and NTRIP network corrections for centimeter-accurate GPS tagging.</li>
</ul>`
      },
      {
        slug: 'recommended-drone-kits',
        title: 'Recommended Drone Kits',
        excerpt: 'Recommended starter packages and field accessories for reliable all-day crop scouting.',
        content: `<h3>Field-Ready Drone Kit Recommendations</h3>
<p>To inspect large fields efficiently, we recommend the following setup:</p>
<ul>
  <li><strong>Aircraft:</strong> DJI Mavic 3 Multispectral with RTK module.</li>
  <li><strong>Batteries:</strong> Minimum of 3–4 intelligent flight batteries (yielding ~120–160 acres per charge cycle).</li>
  <li><strong>Field Charging:</strong> 100W car/inverter charger or portable battery station for continuous rotation.</li>
  <li><strong>Storage:</strong> High-speed V30 or U3 MicroSD cards (minimum 128GB with 130MB/s write speed).</li>
  <li><strong>Safety:</strong> High-visibility landing pad, anemometer (wind speed gauge), and sun hood for the controller.</li>
</ul>`
      },
      {
        slug: 'what-is-phytoguard',
        title: 'What is PhytoGuard AI?',
        excerpt: 'Learn how sub-millimeter computer vision transforms raw aerial images into actionable agronomic prescriptions.',
        content: `<h3>AI Crop Protection at the Leaf Level</h3>
<p>Traditional satellite imagery offers only 3–10 meter resolution, which only reveals crop failure after thousands of square meters have already died. PhytoGuard AI utilizes autonomous low-altitude drone flights (15–25 meters above canopy) yielding <strong>0.4 to 0.8 cm/pixel Ground Sample Distance (GSD)</strong>.</p>
<p>Our deep convolutional neural networks inspect leaves individually, identifying fungal spores, blights, and emergence gaps weeks before they are visible to the naked eye from the field edge.</p>`
      }
    ]
  },
  {
    id: 'flight-app',
    icon: 'drone',
    title: 'PhytoGuard Sky App',
    subtitle: "PhytoGuard's autonomous flight control application",
    articles: [
      {
        slug: 'stand-count-mission',
        title: 'How to Make a Stand Count Mission?',
        excerpt: 'Automate emergence counting and missing seed quantification 10 to 18 days after planting.',
        content: `<h3>Creating a Stand Count Flight Mission</h3>
<p>Stand count missions calculate plant population density, emergence uniformity, and missing seed clusters in early growth stages.</p>
<h4>Step-by-Step Instructions:</h4>
<ol>
  <li>Open <strong>PhytoGuard Sky</strong> and tap <em>New Mission &rarr; Stand Count</em>.</li>
  <li>Select your target field boundary from your synchronized farm map.</li>
  <li>Set the target crop (e.g. Wheat, Soybeans, Cucumbers, Potatoes).</li>
  <li>Confirm flight parameters: Altitude set to 15m (0.4cm GSD), 75% forward overlap, 70% side overlap.</li>
  <li>Verify drone satellites (minimum 12 sats + RTK fix) and tap <em>Launch Autonomous Grid</em>.</li>
</ol>`
      },
      {
        slug: 'pests-diseases-mission',
        title: 'How to do "pests and diseases" mission?',
        excerpt: 'Configure leaf-level inspection grids for early pathogen detection and severity rating.',
        content: `<h3>Executing a Pest &amp; Disease Inspection Mission</h3>
<p>Leaf-level disease missions capture ultra-high-resolution foliar detail across designated sampling grids.</p>
<h4>Flight Best Practices:</h4>
<ul>
  <li><strong>Time of Day:</strong> Fly between 10:00 AM and 2:30 PM when the sun angle minimizes shadow interference within the lower canopy.</li>
  <li><strong>Camera Settings:</strong> Set shutter speed to 1/1000s or faster to prevent motion blur during autonomous movement.</li>
  <li><strong>Sensor Angle:</strong> Nadir (90° straight down) for row crops; 75° oblique angle for vineyards and trellised crops.</li>
</ul>`
      },
      {
        slug: 'orthomosaic-rgb-ndvi',
        title: 'How to Make an Orthomosaic RGB and NDVI Mission?',
        excerpt: 'Generate seamless centimeter-accurate field maps with calibrated multispectral indices.',
        content: `<h3>Orthomosaic &amp; NDVI Mapping</h3>
<p>Orthomosaic flights produce a complete, geometrically corrected 2D composite map of your entire field.</p>
<ol>
  <li>In PhytoGuard Sky, select <em>Orthomosaic Mapping</em>.</li>
  <li>Trace or select your polygon boundary.</li>
  <li>Select sensor mode: <strong>Multispectral (NDVI + NDRE)</strong> or <strong>Standard High-Res RGB</strong>.</li>
  <li>Calibrate the sunlight sensor before takeoff using the included white reflectance calibration panel.</li>
  <li>The drone will automatically execute the serpentine flight path and return to home upon completion.</li>
</ol>`
      },
      {
        slug: 'new-mission-plan',
        title: 'How to Make a New Mission Plan?',
        excerpt: 'Step-by-step guide to drawing boundaries, setting altitudes, and saving reusable flight templates.',
        content: `<h3>Custom Mission Planning</h3>
<p>Save time in the field by preparing mission plans ahead of time on the web dashboard or directly on your flight controller:</p>
<ul>
  <li><strong>Boundary Import:</strong> Upload field boundaries via KML or GeoJSON shapefiles.</li>
  <li><strong>Flight Direction:</strong> Align the flight lines parallel to the crop rows to optimize battery consumption.</li>
  <li><strong>Terrain Follow:</strong> Enable ground-surface terrain following when scouting undulating or hilly fields.</li>
</ul>`
      },
      {
        slug: 'scout-field-ndvi-layer',
        title: 'How to scout your field based on NDVI/Orthophoto layer?',
        excerpt: 'Use the stitched NDVI reflectance layer to identify low-vigor zones and direct targeted ground verification.',
        content: `<h3>Targeted Scouting with NDVI Layers</h3>
<p>Once your flight photos are stitched, the NDVI layer highlights vegetative vigor anomalies:</p>
<ul>
  <li><strong>Deep Green (NDVI &gt; 0.75):</strong> Healthy, dense vegetative canopy.</li>
  <li><strong>Yellow (NDVI 0.45 – 0.65):</strong> Emerging stress, moisture deficit, or early foliar chlorosis.</li>
  <li><strong>Red / Orange (NDVI &lt; 0.40):</strong> Severe blight outbreak, fungal defoliation, or drowned out area.</li>
</ul>
<p>Click on any anomaly pin on the map to zoom in to the leaf-level neural network diagnosis.</p>`
      }
    ]
  },
  {
    id: 'drone-flights',
    icon: 'sensor',
    title: 'Drone Flights & Sensor Calibration',
    subtitle: 'Flight protocols, RTK accuracy, and high-resolution sensor setup',
    articles: [
      {
        slug: 'calibrate-multispectral',
        title: 'How to Calibrate Drone Multispectral Sensors?',
        excerpt: 'Ensure consistent radiometric data across changing sunlight and cloud conditions.',
        content: `<h3>Radiometric Calibration Protocol</h3>
<p>For scientific NDVI and NDRE comparison across different weeks of the growing season, accurate calibration is essential:</p>
<ol>
  <li>Place your calibrated reflectance panel flat on the ground away from shadows and drone reflections.</li>
  <li>Hold the drone approximately 1 meter above the panel facing straight down.</li>
  <li>Tap <em>Capture Calibration Target</em> in PhytoGuard Sky.</li>
  <li>Ensure the top-mounted sunshine sensor is unobstructed by drone antennas or accessories.</li>
</ol>`
      },
      {
        slug: 'altitude-gsd-guidelines',
        title: 'Altitude and GSD Guidelines for Sub-Millimeter Leaf Imaging',
        excerpt: 'Calculate the optimal altitude and camera zoom settings for each crop type.',
        content: `<h3>Flight Altitude &amp; Ground Sample Distance (GSD)</h3>
<table>
  <thead>
    <tr><th>Crop</th><th>Target Flight Altitude</th><th>Target GSD</th><th>Mission Type</th></tr>
  </thead>
  <tbody>
    <tr><td>Wheat</td><td>18 meters</td><td>0.42 cm/px</td><td>Rust &amp; Blight Foliar Scan</td></tr>
    <tr><td>Tomatoes</td><td>15 meters</td><td>0.38 cm/px</td><td>Leaf Blight &amp; Fruit Count</td></tr>
    <tr><td>Soybeans</td><td>20 meters</td><td>0.50 cm/px</td><td>SDS &amp; Stem Rot Detection</td></tr>
    <tr><td>Cucumbers</td><td>16 meters</td><td>0.40 cm/px</td><td>Downy Mildew &amp; Anthracnose</td></tr>
    <tr><td>Potatoes</td><td>18 meters</td><td>0.44 cm/px</td><td>Early &amp; Late Blight Scan</td></tr>
    <tr><td>Grapevines</td><td>22 meters (75° angle)</td><td>0.48 cm/px</td><td>Cluster &amp; Canopy Mildew</td></tr>
  </tbody>
</table>`
      },
      {
        slug: 'sync-drone-sd-card',
        title: 'How to Sync Drone SD Card Images to the Cloud?',
        excerpt: 'Fast data ingestion methods using high-speed card readers and automated cloud uploaders.',
        content: `<h3>Uploading Raw Drone Imagery for AI Processing</h3>
<p>After your drone lands:</p>
<ol>
  <li>Eject the MicroSD card from the aircraft and insert it into your computer or field upload hub.</li>
  <li>Navigate to your PhytoGuard Dashboard and click <em>New Flight Upload</em>.</li>
  <li>Drag and drop the entire <code>DCIM/100MEDIA</code> folder into the upload window.</li>
  <li>The uploader will automatically verify metadata, GPS coordinates, and camera timestamps before triggering cloud orthomosaic stitching and neural network inference.</li>
</ol>`
      }
    ]
  },
  {
    id: 'web-platform',
    icon: 'screen',
    title: 'PhytoGuard Web Platform',
    subtitle: 'Cloud telemetry, field grids, and AI analytics dashboard',
    articles: [
      {
        slug: 'web-platform-tutorial',
        title: 'Web Platform Tutorial & Navigation',
        excerpt: 'Complete walkthrough of the web dashboard, RTK telemetry status, and multi-field management.',
        content: `<h3>Navigating the PhytoGuard Web Platform</h3>
<p>The PhytoGuard Web Platform provides an end-to-end command center for your agronomy operations:</p>
<ul>
  <li><strong>Dashboard Overview:</strong> Live telemetry status (RTK gateway, flight counts, active pathologies, aircraft status).</li>
  <li><strong>Main Crops Catalog:</strong> Specific disease models for Wheat, Tomatoes, Soybeans, Cucumbers, Potatoes, and Grapevines.</li>
  <li><strong>Field Telemetry Map:</strong> Interactive orthomosaics with toggleable NDVI, thermal, and pathology bounding box layers.</li>
</ul>`
      },
      {
        slug: 'findings-symbology',
        title: 'Findings Symbology & Color Coding',
        excerpt: 'Learn the visual indicators for High, Medium, and Low risk pathogen classifications.',
        content: `<h3>Map Symbology Guide</h3>
<ul>
  <li><span style="color:#d9534f; font-weight:700;">● Red Warning:</span> High Severity Infestation. Active leaf necrosis or spreading fungal sporulation. Immediate variable-rate spray recommended.</li>
  <li><span style="color:#f0ad4e; font-weight:700;">● Orange Alert:</span> Medium Risk. Foliar lesions detected in isolated plant clusters. Schedule ground spot-check within 48 hours.</li>
  <li><span style="color:#2f6f43; font-weight:700;">● Green Status:</span> Healthy Canopy. Uniform foliar color with zero pathology alerts.</li>
</ul>`
      },
      {
        slug: 'exporting-shapefiles-isoxml',
        title: 'Exporting Shapefiles & ISO-XML for Sprayers',
        excerpt: 'How to convert leaf-level AI detections directly into precision variable-rate prescription maps.',
        content: `<h3>Variable-Rate Prescription Export</h3>
<p>Never spray a whole field when only 12% is infected:</p>
<ol>
  <li>In the field view, click <em>Generate Prescription Map</em>.</li>
  <li>Set your chemical product and label application rates (e.g. 100% rate on high-risk zones, 0% on clean zones, 50% preventative buffer).</li>
  <li>Click <em>Export</em> and choose your target machinery format:
    <ul>
      <li><strong>ISO-XML (TaskData.xml):</strong> John Deere, Case IH, AGCO, Claas terminals.</li>
      <li><strong>ESRI Shapefile (.shp, .dbf, .shx):</strong> Trimble, Raven, Ag Leader systems.</li>
      <li><strong>DJI Agras Prescription:</strong> Direct upload to DJI Agras T30/T40 flight controllers.</li>
    </ul>
  </li>
</ol>`
      }
    ]
  },
  {
    id: 'troubleshooting',
    icon: 'wrench',
    title: 'Troubleshooting & Hardware Support',
    subtitle: 'Resolve connection, flight upload, and telemetry issues',
    articles: [
      {
        slug: 'troubleshoot-drone-connection',
        title: 'Troubleshoot Drone Controller and RTK Connection Issues',
        excerpt: 'Quick fixes when the controller disconnects, GPS signals drop, or RTK link shows floating status.',
        content: `<h3>Resolving Controller &amp; RTK Communication Issues</h3>
<h4>Symptoms:</h4>
<p>PhytoGuard Sky displays "Aircraft Disconnected" or "RTK Float (Non-Fixed)".</p>
<h4>Solutions:</h4>
<ol>
  <li>Verify USB-C cable integrity between the controller and the drone or base station.</li>
  <li>If using an NTRIP network for RTK, confirm your mobile hotspot is active and credentials are correct.</li>
  <li>Check for high-voltage power lines or metal barns within 50 meters of your takeoff site that may cause compass interference.</li>
  <li>Reboot the aircraft first, followed by the controller.</li>
</ol>`
      },
      {
        slug: 'resolving-upload-failures',
        title: 'Resolving Image Upload and Stitching Failures',
        excerpt: 'Diagnose missing geotags, corrupt SD cards, or stitching alignment warnings.',
        content: `<h3>Image Upload &amp; Alignment Troubleshooting</h3>
<ul>
  <li><strong>Missing Geotags:</strong> Ensure the drone had valid GPS lock before takeoff. Photos without EXIF GPS metadata cannot be aligned on the map.</li>
  <li><strong>Insufficient Overlap:</strong> If orthomosaic stitching fails, check if the flight was flown in excessive wind causing the drone to pitch beyond 80% overlap margins. Re-fly with 80% forward and 75% side overlap.</li>
</ul>`
      }
    ]
  },
  {
    id: 'faq',
    icon: 'faq',
    title: 'FAQ',
    subtitle: 'Frequently asked questions about drone agronomy and accounts',
    articles: [
      {
        slug: 'drone-piloting-faq',
        title: 'Drone Piloting FAQ',
        excerpt: 'Permissible wind conditions, rain thresholds, and battery operating temperature specs.',
        content: `<h3>Environmental Flight Limits</h3>
<ul>
  <li><strong>Maximum Wind Speed:</strong> Commercial drones can fly in winds up to 25 mph (11 m/s), but for optimal leaf-level imaging we recommend flights under 15 mph (6.7 m/s) to avoid canopy movement blur.</li>
  <li><strong>Precipitation:</strong> Never fly in rain, dense fog, or active frost.</li>
  <li><strong>Operating Temperatures:</strong> 14°F to 104°F (-10°C to 40°C). In freezing conditions, pre-heat batteries to at least 68°F (20°C) before launch.</li>
</ul>`
      },
      {
        slug: 'commercial-license-part-107',
        title: 'How to Get a Commercial Drone Pilot License (Part 107)?',
        excerpt: 'Regulatory requirements for operating commercial agricultural drone scouting legally.',
        content: `<h3>Commercial Certification Guidelines</h3>
<p>To operate a drone for farm management or scouting services commercially in the US, you must obtain an FAA Part 107 Remote Pilot Certificate (or CAAB equivalent in Bangladesh / international civil aviation authority):</p>
<ol>
  <li>Must be at least 16 years old and be able to read, speak, and understand English.</li>
  <li>Study FAA airspace classifications, weather charts, and drone regulations.</li>
  <li>Pass the Initial Aeronautical Knowledge Test at an authorized FAA testing center.</li>
  <li>Register your commercial aircraft with the aviation authority.</li>
</ol>`
      },
      {
        slug: 'login-troubleshooting',
        title: 'Why Can’t I Log In to the Dashboard?',
        excerpt: 'Step-by-step account recovery, password reset, and credential troubleshooting.',
        content: `<h3>Dashboard Login Assistance</h3>
<p>If you have difficulty accessing your dashboard:</p>
<ul>
  <li>Ensure you are entering the registered email address (e.g. <code>ador@phytoguard.ai</code>).</li>
  <li>Verify that Caps Lock is disabled on your keyboard.</li>
  <li>If you recently registered a new account, your credentials are saved in your local session.</li>
</ul>`
      }
    ]
  },
  {
    id: 'reports',
    icon: 'document',
    title: 'Reports & Analytics',
    subtitle: 'Generate, customize, and share agronomy intelligence',
    articles: [
      {
        slug: 'create-edit-report',
        title: 'How to Create and Edit a Field Scouting Report',
        excerpt: 'Generate executive PDF summaries of crop pathology detections and infected acreage.',
        content: `<h3>Generating Agronomy Reports</h3>
<ol>
  <li>Navigate to your completed flight in the Web Platform.</li>
  <li>Click <em>Generate Scouting Report</em> in the top right actions bar.</li>
  <li>Select report sections: Executive Summary, Detected Pathologies, High-Risk GPS Coordinates, and Prescription Spray Map.</li>
  <li>Click <em>Download PDF</em> or <em>Share Link</em> to send directly to your agronomist or farm owner.</li>
</ol>`
      },
      {
        slug: 'customizing-severity-alerts',
        title: 'Customizing Severity Thresholds for Agronomists',
        excerpt: 'Adjust sensitivity triggers based on regional economic thresholds and crop development stages.',
        content: `<h3>Alert Customization</h3>
<p>Different crops and market destinations require different intervention thresholds. You can customize infection percentage alerts (e.g. alert if Late Blight exceeds 1.5% foliar surface in processing potatoes) directly in <em>Settings &rarr; Agronomy Thresholds</em>.</p>`
      }
    ]
  },
  {
    id: 'resources',
    icon: 'leaf',
    title: 'Resources & Crop Pathologies',
    subtitle: 'Want to know more about pests and diseases and digital scouting? This is the place!',
    articles: [
      {
        slug: 'wheat-pathologies',
        title: 'Wheat: Yellow Rust, Powdery Mildew, Septoria & Fusarium',
        excerpt: 'Foliar symptom markers and drone detection stages for essential wheat diseases.',
        content: `<h3>Wheat Disease Detection Protocols</h3>
<p>PhytoGuard AI is calibrated for 4 critical wheat fungal pathogens:</p>
<ul>
  <li><strong>Yellow Rust (Puccinia striiformis):</strong> Linear yellow-orange spore pustules along leaf veins. Flagged at early tillering and stem elongation.</li>
  <li><strong>Powdery Mildew (Blumeria graminis):</strong> White-grey cottony fungal patches on lower canopy leaves.</li>
  <li><strong>Septoria Tritici Blotch:</strong> Oval necrotic lesions with black pycnidia speckles.</li>
  <li><strong>Fusarium Head Blight:</strong> Premature ear bleaching and orange sporodochia during flowering.</li>
</ul>`
      },
      {
        slug: 'tomato-pathologies',
        title: 'Tomatoes: Late Blight, Early Blight, Bacterial Spot & Mosaic Virus',
        excerpt: 'Protect processing and fresh tomatoes with early leaf-level symptom identification.',
        content: `<h3>Tomato Pathology Diagnostics</h3>
<ul>
  <li><strong>Late Blight (Phytophthora infestans):</strong> Rapidly expanding dark green water-soaked lesions with white sporulation on leaf undersides.</li>
  <li><strong>Early Blight (Alternaria solani):</strong> Concentric target-like brown rings on older leaves.</li>
  <li><strong>Bacterial Spot (Xanthomonas):</strong> Small angular water-soaked dark spots with yellow halos.</li>
  <li><strong>Tomato Mosaic Virus (ToMV):</strong> Mottling, curling, and blistering of young foliage.</li>
</ul>`
      },
      {
        slug: 'soybean-pathologies',
        title: 'Soybeans: Soybean Rust, Sudden Death Syndrome (SDS) & Brown Stem Rot',
        excerpt: 'Catch soybean foliar and stem pathogens before catastrophic pod-fill yield loss.',
        content: `<h3>Soybean Disease Scouting</h3>
<ul>
  <li><strong>Soybean Rust (Phakopsora pachyrhizi):</strong> Tiny volcano-shaped lesions on lower foliage.</li>
  <li><strong>Sudden Death Syndrome (SDS):</strong> Distinct interveinal chlorosis and necrosis while midrib remains green.</li>
  <li><strong>Brown Stem Rot:</strong> Pith browning and foliar scorching during reproductive stages.</li>
</ul>`
      },
      {
        slug: 'cucumber-pathologies',
        title: 'Cucumbers: Downy Mildew, Anthracnose & Angular Leaf Spot',
        excerpt: 'Foliage and fruit protection protocols across greenhouse and open cucumber fields.',
        content: `<h3>Cucumber Pathology Identification</h3>
<ul>
  <li><strong>Downy Mildew (Pseudoperonospora cubensis):</strong> Angular bright yellow lesions confined by leaf veins.</li>
  <li><strong>Anthracnose (Colletotrichum orbiculare):</strong> Circular brown lesions that dry and tear, leaving shot-hole appearance.</li>
  <li><strong>Angular Leaf Spot (Pseudomonas):</strong> Small angular water-soaked lesions exuding bacterial ooze.</li>
</ul>`
      },
      {
        slug: 'potato-pathologies',
        title: 'Potatoes: Early Blight & Late Blight Detection Guide',
        excerpt: 'Foliar surveillance to protect potato tubers from irreversible rot infection.',
        content: `<h3>Potato Blight Surveillance</h3>
<ul>
  <li><strong>Early Blight:</strong> Concentric target rings on lower canopy leaves; flagged before senescence.</li>
  <li><strong>Late Blight:</strong> Dark water-soaked leaf margins with white downy mildew under humid conditions.</li>
</ul>`
      },
      {
        slug: 'grapevine-pathologies',
        title: 'Grapevines: Powdery Mildew, Downy Mildew & Grey Spot',
        excerpt: 'Vineyard canopy and grape cluster inspection using 75-degree oblique drone passes.',
        content: `<h3>Vineyard Canopy Diagnostics</h3>
<ul>
  <li><strong>Powdery Mildew (Erysiphe necator):</strong> Ash-white powdery growth on young shoots, leaves, and berry clusters.</li>
  <li><strong>Downy Mildew (Plasmopara viticola):</strong> Translucent "oil spots" on upper leaf surfaces followed by white cottony down underneath.</li>
  <li><strong>Grey Spot (Botrytis / Phomopsis):</strong> Small dark brown spots with black centers on leaves and cane shoots.</li>
</ul>`
      }
    ]
  }
];

