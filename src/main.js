import './styles.css';
import { cropList, features, plans, productCatalog, kbCategories } from './data.js';
import { t, getLang, setLang, toggleLang, formatNumber } from './i18n.js';
import {
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseGetSession,
  fetchDemoRequestsFromSupabase,
  createDemoRequestInSupabase,
  updateDemoRequestInSupabase,
  analyzeDroneImageWithCnn,
  saveCnnAnalysisResultInSupabase,
  fetchCnnAnalysisFromSupabase,
  fetchMonitoredCropsFromSupabase,
  fetchDroneMissionsFromSupabase
} from './supabase.js';
import { predictDroneImageryWithCnn } from './cnn-inference.js';

const app = document.querySelector('#app');

// Standard Authentication Helpers
function getStoredUsers() {
  try {
    const raw = localStorage.getItem('phyto_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (!parsed.some(u => (u.email || '').toLowerCase() === 'admin@phytoguard.ai')) {
          parsed.push({
            name: 'System Administrator',
            firstName: 'Admin',
            lastName: 'Command',
            email: 'admin@phytoguard.ai',
            phone: '+880 1700-ADMIN',
            password: 'admin',
            role: 'admin'
          });
          try { localStorage.setItem('phyto_users', JSON.stringify(parsed)); } catch (e) {}
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading users from localStorage', e);
  }
  const defaultUsers = [
    {
      name: 'Ador Chowdhury',
      firstName: 'Ador',
      lastName: 'Chowdhury',
      email: 'ador@phytoguard.ai',
      phone: '+880 1700-000000',
      password: 'password123',
      role: 'grower'
    },
    {
      name: 'System Administrator',
      firstName: 'Admin',
      lastName: 'Command',
      email: 'admin@phytoguard.ai',
      phone: '+880 1700-ADMIN',
      password: 'admin',
      role: 'admin'
    }
  ];
  try {
    localStorage.setItem('phyto_users', JSON.stringify(defaultUsers));
  } catch (e) {}
  return defaultUsers;
}

// Demo Requests Store & Hyperspectral Imagery Management
function getStoredDemoRequests() {
  try {
    const raw = localStorage.getItem('phyto_demo_requests');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading demo requests', e);
  }

  const defaultRequests = [
    {
      id: 'REQ-2026-081',
      name: 'Ador Chowdhury',
      email: 'ador@phytoguard.ai',
      phone: '+880 1700-000000',
      company: 'Chowdhury Agrotech Farms',
      role: 'grower',
      district: 'Bogura',
      cropSector: 'Tomatoes',
      fieldSize: '40 Hectares',
      notes: 'Requesting leaf-level hyperspectral flight scan over northern greenhouse plots to detect early fungal leaf lesions before blossom.',
      status: 'Scanning',
      submittedAt: '2026-09-04 10:15',
      hyperspectralImages: []
    },
    {
      id: 'REQ-2026-082',
      name: 'Rafiqul Islam',
      email: 'rafiq@greenfields.bd',
      phone: '+880 1711-223344',
      company: 'Dinajpur Agro Enterprise',
      role: 'farm_manager',
      district: 'Dinajpur',
      cropSector: 'Wheat',
      fieldSize: '75 Hectares',
      notes: 'Winter wheat crop tiller stage. Need high-resolution orthomosaic scan for suspected Yellow Rust (Puccinia striiformis).',
      status: 'Imagery Uploaded',
      submittedAt: '2026-09-02 10:15',
      hyperspectralImages: [
        {
          id: 'IMG-D-082-1',
          fileName: 'DJI_0498_MicaSense_RedEdgeP_Wheat_Dinajpur.tif',
          fileSize: '48.2 MB',
          dataUrl: '/assets/generated-field-hero.png',
          bandType: '5-Band Multispectral (RGB + RedEdge + NIR)',
          droneModel: 'DJI Matrice 350 RTK (MicaSense RedEdge-P)',
          altitudeAGL: '65m AGL',
          gsdResolution: '0.38 cm/px',
          uploadedAt: '2026-09-02 16:45',
          uploadedBy: 'Admin (Chief Photogrammetrist)',
          agronomistNotes: 'Early chlorotic pustules identified along leaf veins in Sector 3 (Puccinia striiformis / Yellow Rust). Vigor index reduced by 18% in lower water basin.',
          pathologyAlerts: ['Yellow Rust Verified (Level 2 Alert)', 'Localized Nitrogen Depletion in Basin'],
          prescriptionAction: 'Targeted fungicide spot application recommended: Tebuconazole @ 1.2 L/Ha within 48 hours.'
        }
      ]
    },
    {
      id: 'REQ-2026-083',
      name: 'Tariqul Alam',
      email: 'tariq@northbengal.farm',
      phone: '+880 1812-998877',
      company: 'North Bengal Seed & Tubers',
      role: 'grower',
      district: 'Rajshahi',
      cropSector: 'Potatoes',
      fieldSize: '90 Hectares',
      notes: 'Ridge Plot 04 showing canopy wilt. Need autonomous drone scouting to verify Early Blight vs irrigation stress.',
      status: 'Flight Scheduled',
      submittedAt: '2026-09-03 08:20',
      hyperspectralImages: []
    },
    {
      id: 'REQ-2026-084',
      name: 'Dr. Selim Reza',
      email: 'selim@barc.gov.bd',
      phone: '+880 1911-334455',
      company: 'Bangladesh Agricultural Research Council (BARC)',
      role: 'researcher',
      district: 'Mymensingh',
      cropSector: 'Soybeans',
      fieldSize: '120 Hectares',
      notes: 'Monitoring river basin test beds for Sudden Death Syndrome (SDS) and leaf chlorosis variations.',
      status: 'Pending Review',
      submittedAt: '2026-09-03 18:40',
      hyperspectralImages: []
    }
  ];

  try {
    localStorage.setItem('phyto_demo_requests', JSON.stringify(defaultRequests));
  } catch (e) {}
  return defaultRequests;
}

function saveStoredDemoRequests(requests) {
  try {
    localStorage.setItem('phyto_demo_requests', JSON.stringify(requests));
  } catch (e) {
    console.error('Error saving demo requests', e);
  }
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('phyto_current_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading current user from localStorage', e);
  }
  return null;
}

function isDemoAccount(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  return email === 'ador@phytoguard.ai' || email === 'demo@phytoguard.ai' || Boolean(user.isDemo);
}

function setCurrentUser(user) {
  try {
    localStorage.setItem('phyto_current_user', JSON.stringify(user));
  } catch (e) {
    console.error('Error saving current user to localStorage', e);
  }
}

function logoutUser() {
  try {
    localStorage.removeItem('phyto_current_user');
    if (isSupabaseConfigured) {
      supabaseSignOut().catch((e) => console.warn('Supabase signout notice:', e));
    }
  } catch (e) {}
  navigate('/login');
}

function navigate(path) {
  window.history.pushState({}, '', path);
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function link(path, label, extra = '') {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isCurrent = currentPath === path || 
    (path === '/crops' && (currentPath === '/crops' || currentPath.startsWith('/crops/'))) ||
    ((path === '/about' || path === '/knowledge-base') && (currentPath === '/about' || currentPath === '/knowledge-base'));
  const classes = [extra, isCurrent ? 'active' : ''].filter(Boolean).join(' ');
  return `<a class="${classes}" href="${path}" data-route>${label}</a>`;
}

function getAllUsersForAdmin() {
  const registeredUsers = getStoredUsers();
  const demoRequests = getStoredDemoRequests();

  // Base structured farm profiles
  const predefinedProfiles = [
    {
      id: 'USER-001',
      name: 'Ador Chowdhury',
      firstName: 'Ador',
      email: 'ador@phytoguard.ai',
      company: 'Chowdhury Agrotech Farms',
      district: 'Bogura',
      cropSector: 'Tomatoes & Mixed Vegetables',
      crops: ['Tomatoes', 'Potatoes', 'Cucumbers', 'Wheat', 'Soybeans', 'Grapevines'],
      fieldSize: '450 Hectares',
      fieldHectares: 450,
      scannedHectares: 382.5,
      scanPercentage: 85.0,
      flights: 28,
      pathologyAlerts: ['Late Blight (Phytophthora infestans)', 'Early Blight', 'Yellow Rust', 'Powdery Mildew'],
      ndvi: '0.82',
      notes: 'High-density commercial tomato acreage under active DJI Matrice 350 RTK surveillance.'
    },
    {
      id: 'USER-002',
      name: 'Rafiqul Islam',
      firstName: 'Rafiqul',
      email: 'rafiq@greenfields.bd',
      company: 'Dinajpur Agro Enterprise',
      district: 'Dinajpur',
      cropSector: 'Wheat & Cereal Grains',
      crops: ['Wheat', 'Potatoes', 'Soybeans'],
      fieldSize: '180 Hectares',
      fieldHectares: 180,
      scannedHectares: 153.0,
      scanPercentage: 85.0,
      flights: 19,
      pathologyAlerts: ['Yellow Rust (Puccinia striiformis)', 'Early Blight'],
      ndvi: '0.78',
      notes: 'Grain farming hub with regular Mavic 3M multispectral NDVI vegetation mapping.'
    },
    {
      id: 'USER-003',
      name: 'Tariqul Hasan',
      firstName: 'Tariqul',
      email: 'tariq@northern.ag',
      company: 'Northern Green Agronomy',
      district: 'Rajshahi',
      cropSector: 'Soybeans & Legumes',
      crops: ['Soybeans', 'Cucumbers', 'Wheat'],
      fieldSize: '240 Hectares',
      fieldHectares: 240,
      scannedHectares: 204.0,
      scanPercentage: 85.0,
      flights: 34,
      pathologyAlerts: ['Soybean Rust (Phakopsora pachyrhizi)', 'Downy Mildew', 'Target Spot'],
      ndvi: '0.85',
      notes: 'Large-scale soybean producer utilizing Resonon VNIR hyperspectral scans for root nodule stress.'
    },
    {
      id: 'USER-004',
      name: 'Nazrul Ahmed',
      firstName: 'Nazrul',
      email: 'nazrul@pabnaprecision.com',
      company: 'Pabna Precision Agri',
      district: 'Pabna',
      cropSector: 'Potatoes & Root Crops',
      crops: ['Potatoes', 'Tomatoes'],
      fieldSize: '120 Hectares',
      fieldHectares: 120,
      scannedHectares: 102.0,
      scanPercentage: 85.0,
      flights: 15,
      pathologyAlerts: ['Early Blight (Alternaria solani)'],
      ndvi: '0.76',
      notes: 'Intensive potato seed production facility requiring leaf-level blight monitoring.'
    },
    {
      id: 'USER-005',
      name: 'Dr. M. A. Karim',
      firstName: 'Dr.',
      email: 'karim@munshiganjseed.org',
      company: 'Bikrampur Seed & Plant Path',
      district: 'Munshiganj',
      cropSector: 'Cucumbers & Horticulture',
      crops: ['Cucumbers', 'Tomatoes', 'Grapevines'],
      fieldSize: '85 Hectares',
      fieldHectares: 85,
      scannedHectares: 72.25,
      scanPercentage: 85.0,
      flights: 12,
      pathologyAlerts: ['Cucumber Mosaic Virus', 'Downy Mildew'],
      ndvi: '0.80',
      notes: 'Horticultural research institute utilizing narrow-band spectral disease detection.'
    }
  ];

  // Merge any dynamic requests
  const dynamicUsers = demoRequests
    .filter(req => !predefinedProfiles.some(p => p.email.toLowerCase() === (req.email || '').toLowerCase()))
    .map((req, idx) => ({
      id: req.id || `USER-REQ-${idx + 1}`,
      name: req.name || 'Valued Grower',
      firstName: (req.name || 'Grower').split(' ')[0],
      email: req.email || `client${idx}@phytoguard.ai`,
      company: req.company || `${req.name}'s Farm Plot`,
      district: req.district || 'Bogura',
      cropSector: req.cropSector || 'Mixed Agriculture',
      crops: [req.cropSector || 'Tomatoes', 'Wheat', 'Potatoes'],
      fieldSize: req.fieldSize || '100 Hectares',
      fieldHectares: parseInt(req.fieldSize) || 100,
      scannedHectares: Math.round((parseInt(req.fieldSize) || 100) * 0.85),
      scanPercentage: 85.0,
      flights: 8 + (idx % 10),
      pathologyAlerts: ['Leaf Spot (Cercospora spp.)', 'Mild Chlorosis'],
      ndvi: '0.79',
      notes: req.notes || 'Inbound trial user requesting commercial drone scouting.'
    }));

  return [...predefinedProfiles, ...dynamicUsers];
}

function header() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';

  return `
    <header class="site-header ${isAdmin ? 'admin-site-header' : ''}">
      <a class="brand" href="${isAdmin ? '/dashboard' : '/'}" data-route aria-label="PhytoGuard AI home">
        <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
      </a>
      ${isAdmin ? `
        <!-- System Administrator Mode: Zero consumer nav links (dashboard, how it works, plans, main crops, knowledge base removed) -->
        <div class="admin-header-center">
          <span class="admin-header-badge">
            <span class="admin-pulse-dot" aria-hidden="true"></span>
            <span>${t('nav.adminBadge')}</span>
          </span>
        </div>
      ` : `
        <nav class="main-nav" aria-label="Main navigation">
          ${currentUser ? link('/dashboard', t('nav.dashboard')) : `<a class="nav-unlinked" href="/login" data-route>${t('nav.dashboard')}</a>`}
          ${link('/crops', t('nav.crops'))}
          ${link('/how-it-works', t('nav.howItWorks'))}
          ${link('/plans', t('nav.plans'))}
          ${link('/knowledge-base', t('nav.knowledgeBase'))}
        </nav>
      `}
      <div class="header-actions">
        <button class="lang-selector" type="button" aria-label="${t('nav.langSwitchTooltip')}" title="${t('nav.langSwitchTooltip')}">
          <svg class="globe-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5"/>
            <path d="M1.5 8h13M8 1.5c2 2.5 3 4.5 3 6.5s-1 4-3 6.5c-2-2.5-3-4.5-3-6.5s1-4 3-6.5z"/>
          </svg>
          <span>${getLang() === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>
        ${currentUser ? `
          <div class="user-header-profile">
            <a class="login-link user-logged-btn ${isAdmin ? 'admin-user-btn' : ''}" href="/dashboard" data-route aria-label="${t('nav.dashboard')}" title="${isAdmin ? t('nav.adminTitle') : t('nav.dashboard')}">
              <span class="user-avatar-badge" aria-hidden="true">${isAdmin ? '🛡️' : (currentUser.firstName || currentUser.name || 'U').charAt(0).toUpperCase()}</span>
              <span class="user-name-label">${isAdmin ? t('nav.adminTitle') : (currentUser.name || currentUser.firstName || 'User')}</span>
            </a>
            <button class="header-logout-btn" type="button" aria-label="${t('nav.logout')}" title="${t('nav.logout')}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ` : `
          <a class="login-link" href="/login" data-route>${t('nav.login')} <span aria-hidden="true">&rarr;</span></a>
        `}
      </div>
    </header>
  `;
}

function landingHeroSection() {
  const sparkleIcon = `
    <svg class="announcement-sparkle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 2L11.8 7.5L17.5 9.3L11.8 11.2L10 16.8L8.1 11.2L2.5 9.3L8.1 7.5L10 2Z" stroke="#c9822a" stroke-width="1.6" stroke-linejoin="round" fill="#fef6ea"/>
    </svg>
  `;
  return `
    <section class="landing-hero has-video-bg">
      <!-- Commercial Drone Scouting Video Background -->
      <video class="hero-video-bg" id="hero-video" autoplay loop muted playsinline poster="/assets/dji-drone-hero.jpg" preload="auto">
        <source src="/assets/hero-video.mp4" type="video/mp4" />
        <source src="/assets/hero%20video.mp4" type="video/mp4" />
      </video>
      <div class="landing-hero-backdrop" aria-hidden="true"></div>
      <div class="landing-hero-content">
        <a class="hero-announcement" href="/free-demo" data-route>
          ${sparkleIcon}
          <span>${t('hero.announcement')}</span>
          <span class="announcement-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <h1 class="hero-title">
          ${t('hero.title')}
        </h1>
        <p class="hero-subtitle">
          ${t('hero.subtitle')}
        </p>
        <div class="hero-cta-group">
          <a class="hero-cta-btn" href="/free-demo" data-route>
            ${t('hero.cta')} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

function setupLandingHeroVideoEvents() {
  const video = document.getElementById('hero-video');
  if (!video) return;

  const startPlayback = () => {
    if (video.paused) {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          initCanvasVideoStream(video);
        });
      }
    }
  };

  startPlayback();

  // Ensure video always plays continuously
  video.addEventListener('pause', () => {
    startPlayback();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startPlayback();
    }
  });

  video.addEventListener('error', () => {
    initCanvasVideoStream(video);
  });
}

function initCanvasVideoStream(video) {
  if (!video || video.__canvasStreamInitialized) return;
  video.__canvasStreamInitialized = true;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const bgImg = new Image();
    bgImg.src = '/assets/dji-drone-hero.jpg';

    function draw() {
      frame++;
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#14211a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = 'rgba(14, 25, 18, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scanY = (frame * 2.2) % canvas.height;
      const grad = ctx.createLinearGradient(0, scanY - 45, 0, scanY + 45);
      grad.addColorStop(0, 'rgba(47, 111, 67, 0)');
      grad.addColorStop(0.5, 'rgba(110, 209, 140, 0.42)');
      grad.addColorStop(1, 'rgba(47, 111, 67, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 45, canvas.width, 90);

      const rx = (canvas.width * 0.62) + Math.sin(frame * 0.02) * 110;
      const ry = (canvas.height * 0.48) + Math.cos(frame * 0.02) * 55;
      ctx.strokeStyle = 'rgba(251, 167, 64, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rx, ry, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(251, 167, 64, 0.9)';
      ctx.font = '12px monospace';
      ctx.fillText('DJI RTK FIXED ±1.2cm', rx + 32, ry - 6);
      ctx.fillText('NDVI 0.82 • 65m AGL', rx + 32, ry + 12);

      requestAnimationFrame(draw);
    }
    draw();

    if (canvas.captureStream) {
      const stream = canvas.captureStream(30);
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  } catch (e) {
    console.warn('Canvas stream initialization', e);
  }
}

function footer() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && currentUser.role === 'admin';

  return `
    <footer class="site-footer ${isAdmin ? 'admin-site-footer' : ''}">
      <div>
        <a class="brand" href="${isAdmin ? '/dashboard' : '/'}" data-route aria-label="PhytoGuard AI home">
          <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
        </a>
        <p>${t('footer.tagline')}</p>
      </div>
      <div class="footer-links">
        ${isAdmin ? `
          <span class="admin-footer-status">🛡️ ${t('footer.adminSession')}</span>
          <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a>
        ` : `
          ${link('/crops', t('nav.allCrops'))}
          ${link('/how-it-works', t('nav.howItWorks'))}
          ${link('/plans', t('nav.plans'))}
          ${link('/knowledge-base', t('nav.knowledgeBase'))}
          <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a>
        `}
      </div>
    </footer>
  `;
}

function visual(seed = 'field', label = '') {
  return `
    <div class="field-visual field-${seed}" role="img" aria-label="${label || 'AI monitored crop fields'}">
      <img src="/assets/generated-field-hero.png" alt="" />
      <div class="scan scan-a"></div>
      <div class="scan scan-b"></div>
      <div class="telemetry">
        <span>NDVI +0.18</span>
        <span>Risk zone 03</span>
        <span>GPS tagged</span>
      </div>
    </div>
  `;
}

function hero({ eyebrow, title, text, action, imageLabel, tone = 'dark' }) {
  return `
    <section class="hero hero-${tone}">
      <div class="hero-copy">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        <p class="lead">${text}</p>
        ${action ? `<a class="button primary" href="${action.href}">${action.label}</a>` : ''}
      </div>
      ${visual('field', imageLabel)}
    </section>
  `;
}

function homePage() {
  const isBn = getLang() === 'bn';
  const stepsTitle = isBn ? 'মাঠ থেকে সিদ্ধান্ত — মাত্র তিন ধাপে' : 'From field to decision in three steps';
  const stepsList = isBn ? [
    ['মাঠের সীমানা ম্যাপিং ও ফ্লাইট', 'আপনার মাঠের সীমানা চিহ্নিত করে সাধারণ বা মাল্টিস্পেকট্রাল সেন্সরযুক্ত ড্রোন স্বয়ংক্রিয়ভাবে পরিচালনা করুন।'],
    ['এআই প্রতিটি পাতা স্ক্যান করে', 'ফাইটোগার্ড এআই পাতার স্তর পর্যন্ত রোগবালাই, ক্ষতিকর পোকা ও স্ট্রেস শনাক্ত করে মাঠজুড়ে ঝুঁকি চিহ্নিত করে।'],
    ['আত্মবিশ্বাসের সাথে ব্যবস্থা নিন', 'স্প্রেয়ার ড্রোন বা স্প্রে মেশিনে সরাসরি প্রেরণের উপযোগী সুনির্দিষ্ট প্রেসক্রিপশন ম্যাপ, সতর্কতা ও পরামর্শ পান।']
  ] : [
    ['Capture your fields', 'Map your field boundaries and fly autonomous drone scans with standard or multispectral sensors.'],
    ['AI scans every leaf', 'PhytoGuard AI detects pests, disease, and stress down to the leaf and flags risks across your fields.'],
    ['Act with confidence', 'Get prescription maps, alerts, and agronomy recommendations ready to send to the sprayer.'],
  ];

  return `
    ${landingHeroSection()}
    ${whyPhytoGuardSection()}
    ${stepsSection(stepsTitle, stepsList)}
    ${landingDemoSection()}
  `;
}

function whyPhytoGuardSection() {
  const isBn = getLang() === 'bn';
  const icons = [
    // 1. Pest & disease detection (leaf droplet)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>`,
    // 2. Scout more on every visit (scouting footsteps)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <ellipse cx="9" cy="8.5" rx="2.4" ry="4.5"/>
      <ellipse cx="15" cy="15.5" rx="2.4" ry="4.5"/>
      <circle cx="9.2" cy="15.5" r="1.5" fill="currentColor"/>
      <circle cx="14.8" cy="8.5" r="1.5" fill="currentColor"/>
    </svg>`,
    // 3. Severity scoring (ascending bars)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="4" y="14" width="3.5" height="6" rx="1"/>
      <rect x="10.25" y="10" width="3.5" height="10" rx="1"/>
      <rect x="16.5" y="4" width="3.5" height="16" rx="1"/>
    </svg>`,
    // 4. New infection alerts (notification bell)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`,
    // 5. Treatment guidance (crescent moon / spray target)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`,
    // 6. One crop intelligence hub (cloud sync)
    `<svg class="why-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>`
  ];

  const displayFeatures = isBn ? [
    ['বালাই ও রোগবালাই শনাক্তকরণ', 'কলোরাডো আলু বিটল থেকে লেইট ব্লাইট পর্যন্ত — এআই প্রতিটি ঝুঁকি পাতার স্তরে শনাক্ত করে ছড়িয়ে পড়ার আগেই।'],
    ['প্রতি পরিদর্শনে আরও বেশি জমি স্কাউটিং', 'কম সময়ে বিশাল মাঠ পরিদর্শন করুন এবং সামগ্রিক ফসলের পুঙ্খানুপুঙ্খ চিত্র পান।'],
    ['ঝুঁকির তীব্রতা মূল্যায়ন', 'উচ্চ, মাঝারি ও নিম্ন ঝুঁকির রেটিং, যাতে আপনি নির্ভুলভাবে জানতে পারেন কোথায় প্রথম ব্যবস্থা নিতে হবে।'],
    ['নতুন সংক্রমণের তাৎক্ষণিক সতর্কতা', 'আপনার মাঠে লেইট ব্লাইট বা আর্লি ব্লাইটের মতো নতুন সংক্রমণ দেখা মাত্রই সতর্কবার্তা পান।'],
    ['সুনির্দিষ্ট বালাইনাশক প্রয়োগ গাইড', 'রিপোর্টের ফলাফল থেকে তৈরি করুন স্প্রেয়ার ড্রোনের উপযোগী নির্ভুল স্প্রে পরিকল্পনা ও কৃষি পরামর্শ।'],
    ['একক ক্রপ ইন্টেলিজেন্স প্ল্যাটফর্ম', 'পরিদর্শন ছবি, ঝুঁকি মানচিত্র এবং কৃষি রিপোর্ট — সবই এক প্ল্যাটফর্মে, যেকোনো ডিভাইসে।']
  ] : features;

  return `
    <section class="why-phyto-section">
      <div class="why-phyto-container">
        
        <!-- Left Column: Pest & Disease Report #025292 Card -->
        <div class="report-column">
          <div class="report-card">
            <div class="report-window-dots" aria-hidden="true">
              <span class="window-dot"></span>
              <span class="window-dot"></span>
              <span class="window-dot"></span>
            </div>

            <div class="report-meta-header">
              <span class="report-code">${isBn ? 'বালাই ও রোগবালাই রিপোর্ট #০২৫২৯২' : 'Pests & Disease Report #025292'}</span>
              <span class="report-badge-new">
                <span class="report-badge-dot" aria-hidden="true"></span>
                <span>${isBn ? 'নতুন সংক্রমণ' : 'New infections'}</span>
              </span>
            </div>

            <h3 class="report-grower-title">${isBn ? 'চাদ নর্থ · আলু ক্ষেত' : 'Chad North · Potato'}</h3>
            <p class="report-date-count">${isBn ? '১৩ জুন ২০২৬ · ৫৯৮টি ছবি বিশ্লেষণ' : '13 Jun 2026 · 598 images inspected'}</p>

            <div class="report-findings-list">
              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-late-blight.jpg" alt="Late blight (fresh)" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">${isBn ? 'লেইট ব্লাইট (তাজা সংক্রমণ)' : 'Late blight (fresh)'}</h4>
                  <p class="finding-source">${isBn ? 'মাঠ পরিদর্শন নমুনা' : 'Sample from field inspection'}</p>
                </div>
                <span class="finding-pill pill-high">${isBn ? 'উচ্চ' : 'High'}</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-colorado-beetle.jpg" alt="Colorado beetle - larvae" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">${isBn ? 'কলোরাডো বিটল - লার্ভা' : 'Colorado beetle - larvae'}</h4>
                  <p class="finding-source">${isBn ? 'মাঠ পরিদর্শন নমুনা' : 'Sample from field inspection'}</p>
                </div>
                <span class="finding-pill pill-med">${isBn ? 'মাঝারি' : 'Medium'}</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-early-blight.jpg" alt="Early blight, alternaria leaf spot" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">${isBn ? 'আর্লি ব্লাইট, অ্যালটারনারিয়া দাগ' : 'Early blight, alternaria leaf spot'}</h4>
                  <p class="finding-source">${isBn ? 'মাঠ পরিদর্শন নমুনা' : 'Sample from field inspection'}</p>
                </div>
                <span class="finding-pill pill-med">${isBn ? 'মাঝারি' : 'Medium'}</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-brown-spot.jpg" alt="Brown spot, alternaria blight" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">${isBn ? 'ব্রাউন স্পট, অল্টারনারিয়া ব্লাইট' : 'Brown spot, alternaria blight'}</h4>
                  <p class="finding-source">${isBn ? 'মাঠ পরিদর্শন নমুনা' : 'Sample from field inspection'}</p>
                </div>
                <span class="finding-pill pill-low">${isBn ? 'নিম্ন' : 'Low'}</span>
              </div>
            </div>

            <div class="report-special-alert">
              <p>
                ${isBn ? '<strong class="alert-highlight">বিশেষ সতর্কতা:</strong> চিহ্নিত অংশ সরাসরি মাঠে পরিদর্শন করুন; এখানে লেইট ব্লাইট (তাজা) সংক্রমণের ঝুঁকি রয়েছে।' : '<strong class="alert-highlight">Special attention:</strong> Inspect flagged labels directly in the field; they are suspected of Late Blight (Fresh).'}
              </p>
            </div>

            <p class="report-footer-note">
              ${isBn ? 'আরও শনাক্ত হয়েছে: পূর্ণাঙ্গ কলোরাডো বিটল ও লার্ভা, ফ্লি বিটল, শিলাবৃষ্টির ক্ষত, লুপার আর্মি ওয়ার্ম ক্ষত, আগাছা ও কৃষি সরঞ্জামের আঘাত।' : 'Also found: Colorado beetle adults and larvae, flea beetles, hail damage, looper army worm damage, weeds, pest damage, and agricultural-tool damage.'}
            </p>
          </div>

          <div class="report-action-row">
            <button class="report-download-button" type="button" aria-label="${isBn ? 'সম্পূর্ণ রিপোর্ট ডাউনলোড করুন' : 'Download full report'}">
              <svg class="report-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>${isBn ? 'সম্পূর্ণ রিপোর্ট ডাউনলোড করুন' : 'Download full report'}</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Header & 6 Sleek Cards -->
        <div class="why-phyto-content">
          <div class="why-phyto-header">
            <span class="why-eyebrow">${isBn ? 'কেন ফাইটোগার্ড' : 'WHY PHYTOGUARD'}</span>
            <h2 class="why-heading">${isBn ? 'ফসল সুরক্ষা,<br />পাতার স্তর পর্যন্ত' : 'Crop protection,<br />down to the leaf'}</h2>
          </div>

          <div class="why-cards-grid">
            ${displayFeatures.map(([title, text], idx) => `
              <div class="why-feature-card">
                <div class="why-icon-badge" aria-hidden="true">
                  ${icons[idx]}
                </div>
                <h3 class="why-card-title">${title}</h3>
                <p class="why-card-desc">${text}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>
  `;
}

function landingDemoSection() {
  const checkSvg = `
    <svg class="check-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="6.75" stroke="#fba740" stroke-width="1.35" />
      <path d="M5.2 8.1L7.1 10L10.8 5.9" stroke="#fba740" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
  const isBn = getLang() === 'bn';

  return `
    <section class="landing-demo">
      <div class="landing-demo-content">
        <p class="demo-eyebrow">${isBn ? 'শুরু করুন' : 'GET STARTED'}</p>
        <h2>${isBn ? 'আপনার ফসলের ফলন<br />সুরক্ষিত করতে প্রস্তুত?' : 'Ready to protect<br />your yields?'}</h2>
        <p class="demo-lead">${isBn ? 'হাজার হাজার কৃষকের সাথে যোগ দিন যারা নির্ভুল ফসল সুরক্ষায় ফাইটোগার্ড এআই ব্যবহার করছেন।' : 'Join thousands of growers using PhytoGuard AI for precision crop monitoring.'}</p>
        <ul class="demo-checks">
          <li>${checkSvg}<span>${t('why.perks.detection')}</span></li>
          <li>${checkSvg}<span>${t('why.perks.coverage')}</span></li>
          <li>${checkSvg}<span>${t('why.perks.setup')}</span></li>
        </ul>
        <div class="demo-action-row">
          <a class="demo-button" href="/free-demo" data-route>${isBn ? 'ফ্রি ডেমো অনুরোধ পাঠান' : 'Request a demo'} <span aria-hidden="true">&rarr;</span></a>
          <span class="demo-badge">${isBn ? 'কোনো ক্রেডিট কার্ডের প্রয়োজন নেই' : 'No credit card needed'}</span>
        </div>
        <p class="demo-contact">${isBn ? 'কোনো প্রশ্ন আছে? আমাদের লিখুন:' : 'Have a question? Reach us at'} <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a></p>
      </div>
    </section>
  `;
}

function getTranslatedCrop(rawCrop) {
  if (!rawCrop) return rawCrop;
  if (getLang() !== 'bn') return rawCrop;
  const bnCrops = {
    wheat: {
      name: 'গম',
      shortName: 'গম',
      diseaseType: 'ছত্রাকজনিত',
      headline: 'মরিচা, মিলডিউ ও হেড ব্লাইট থেকে গমের ফলন সুরক্ষিত রাখুন।',
      summary: 'টিলারিং থেকে দানা গঠন পর্যন্ত ইয়েলো রাস্ট, পাউডারি মিলডিউ, সেপ্টোরিয়া ও ফুসারিয়াম হেড ব্লাইট শনাক্ত করুন।'
    },
    tomato: {
      name: 'টমেটো',
      shortName: 'টমেটো',
      diseaseType: 'ছত্রাক, ব্যাকটেরিয়া ও ভাইরাসজনিত',
      headline: 'প্রক্রিয়াজাতকরণ ও তাজা টমেটোর জন্য পাতার স্তরে সতর্কতা।',
      summary: 'ছড়িয়ে পড়ার আগেই পাতার স্তরে লেইট ব্লাইট, আর্লি ব্লাইট, ব্যাক্টেরিয়াল স্পট ও টমেটো মোজাইক ভাইরাস শনাক্ত করুন।'
    },
    soybeans: {
      name: 'সয়াবিন',
      shortName: 'সয়াবিন',
      diseaseType: 'ছত্রাক ও মৃত্তিকা-বাহিত',
      headline: 'সয়াবিন রাস্ট, এসডিএস এবং স্টেম রট প্রাথমিক অবস্থাতেই চিহ্নিত করুন।',
      summary: 'ফলন সুরক্ষায় সয়াবিন রাস্ট, সাডেন ডেথ সিন্ড্রোম (এসডিএস) এবং ব্রাউন স্টেম রট প্রাথমিক অবস্থায় চিহ্নিত করুন।'
    },
    cucumber: {
      name: 'শসা',
      shortName: 'শসা',
      diseaseType: 'ছত্রাক ও ব্যাকটেরিয়াঘটিত',
      headline: 'পাতা ও ফলকে মিলডিউ ও অ্যানথ্রাকনোজ থেকে সম্পূর্ণ সুরক্ষা দিন।',
      summary: 'গ্রিনহাউস ও উন্মুক্ত মাঠে ডাউনি মিলডিউ, অ্যানথ্রাকনোজ এবং অ্যাঙ্গুলার লিফ স্পট নির্ভুলভাবে খুঁজুন।'
    },
    potato: {
      name: 'আলু',
      shortName: 'আলু',
      diseaseType: 'ছত্রাকজনিত',
      headline: 'আলু ক্ষেতে ব্লাইট শনাক্ত করে তাত্ক্ষণিক স্প্রে প্রেসক্রিপশন তৈরি করুন।',
      summary: 'ক্যানোপি বন্ধ হওয়ার আগে ও পরে আর্লি ব্লাইট এবং লেইট ব্লাইট দ্রুত শনাক্ত করে স্প্রে ম্যাপ তৈরি করুন।'
    },
    grapevine: {
      name: 'আঙুর',
      shortName: 'আঙুর',
      diseaseType: 'ছত্রাকজনিত',
      headline: 'লতা ও ফলের থোকায় পাতার স্তরভিত্তিক স্বাস্থ্য ও প্যাথলজি পর্যবেক্ষণ।',
      summary: 'লতা ও ফলের থোকায় পাউডারি মিলডিউ, ডাউনি মিলডিউ এবং ব্ল্যাক রট চিহ্নিত করে ফলন সুরক্ষিত রাখুন।'
    },
    corn: {
      name: 'ভুট্টা',
      shortName: 'ভুট্টা',
      diseaseType: 'ছত্রাক ও ফলিয়ার',
      headline: 'পাতার ব্লাইট ও মরিচা রোগ থেকে ভুট্টার ফলন রক্ষা করুন।',
      summary: 'নর্দার্ন কর্ন লিফ ব্লাইট, গ্রে লিফ স্পট এবং সাধারণ রাস্ট প্রাথমিক পর্যায়ে শনাক্ত করুন।'
    },
    cotton: {
      name: 'তুলা',
      shortName: 'তুলা',
      diseaseType: 'ব্যাকটেরিয়া ও ফলিয়ার ছত্রাক',
      headline: 'তুলার পাতা ও গুটি সুস্থ রাখতে উন্নত ড্রোন স্ক্যানিং।',
      summary: 'অ্যালটারনারিয়া লিফ স্পট, ব্যাক্টেরিয়াল ব্লাইট এবং তুলার পাতার পুষ্টির ঘাটতি আকাশপথে স্ক্যান করুন।'
    },
    sugarcane: {
      name: 'আখ',
      shortName: 'আখ',
      diseaseType: 'ছত্রাক ও সিস্টেমেটিক',
      headline: 'রেড রট ও স্মাট রোগ থেকে আখের ফলন ও চিনি ধারণ ক্ষমতা সুরক্ষা দিন।',
      summary: 'রেড রট, স্মাট এবং মরিচা রোগ ব্যাপকভাবে ছড়িয়ে পড়ার আগেই ক্যানোপি লেভেলে চিহ্নিত করুন।'
    },
    'sugar-beet': {
      name: 'সুগার বিট',
      shortName: 'সুগার বিট',
      diseaseType: 'ফলিয়ার ও মূলজনিত',
      headline: 'সারকোস্পোরা লিফ স্পট ও রুট রট প্রাথমিক অবস্থায় প্রতিরোধ করুন।',
      summary: 'সারকোস্পোরা লিফ স্পট, পাউডারি মিলডিউ এবং রাইজোক্টোনিয়া রুট রট প্রাথমিক অবস্থায় খুঁজুন।'
    },
    onion: {
      name: 'পেঁয়াজ',
      shortName: 'পেঁয়াজ',
      diseaseType: 'ছত্রাক ও কীটজনিত',
      headline: 'পার্পল ব্লচ ও ডাউনি মিলডিউ থেকে পেঁয়াজের শীর্ষ ক্যানোপি রক্ষা করুন।',
      summary: 'পার্পল ব্লচ, ডাউনি মিলডিউ এবং থ্রিপসের আক্রমণ শনাক্ত করে গুণগত মান নিশ্চিত করুন।'
    }
  };
  return bnCrops[rawCrop.slug] ? { ...rawCrop, ...bnCrops[rawCrop.slug] } : rawCrop;
}

function cropsPage() {
  const isBn = getLang() === 'bn';
  return `
    <div class="crops-page-wrap">
      <section class="crops-header-section">
        <span class="crops-eyebrow">${isBn ? 'প্রধান ফসলসমূহ' : 'Main crops'}</span>
        <h1 class="crops-main-title">${isBn ? 'যে ফসলগুলো মানবজাতিকে পুষ্টি জোগায় তাদের সুরক্ষায় প্রস্তুত' : 'Built for the crops that feed the world'}</h1>
        <p class="crops-main-subtitle">
          ${isBn ? 'ফাইটোগার্ড এআই কৃষকদের সর্বাধিক নির্ভরশীল ফসলের পাতার স্তরে দৃষ্টি এবং এআই-চালিত রোগ ও বালাই শনাক্তকরণ নিশ্চিত করে।' : 'PhytoGuard AI delivers leaf-level visibility and AI-powered pest and disease detection across the row crops growers rely on most.'}
        </p>
      </section>

      <section class="crops-grid-section">
        <div class="crops-grid">
          ${cropList.map(cropCard).join('')}
        </div>
      </section>

      <section class="crops-bottom-banner-section">
        <div class="crops-bottom-banner">
          <h2 class="crop-banner-heading">${isBn ? 'অন্য কোনো ফসল চাষ করছেন?' : 'Growing a different crops?'}</h2>
          <p class="crop-banner-text">
            ${isBn ? 'সব সমাধান নির্দিষ্ট ফসলের মধ্যে সীমাবদ্ধ নয়। মাঠজুড়ে প্রযোজ্য আমাদের সামগ্রিক ড্রোন টুলস ব্যবহার করে আরও বেশি জমি পর্যবেক্ষণ করুন এবং সঠিক সিদ্ধান্ত নিন।' : 'Not every solution is crop-specific. Explore field-wide tools that help you monitor more area, save scouting time, and make better decisions across many crops.'}
          </p>
          <a class="crop-banner-btn" href="/how-it-works" data-route>
            ${isBn ? 'সমাধানসমূহ দেখুন' : 'Explore solutions'} <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </div>
  `;
}

function cropCard(rawCrop) {
  const crop = getTranslatedCrop(rawCrop);
  return `
    <a class="crop-card" href="/crops/${crop.slug}" data-route>
      <div class="crop-card-image-wrap">
        <img class="crop-card-img" src="${crop.image}" alt="${crop.name} field" loading="lazy" />
      </div>
      <div class="crop-card-content">
        <div class="crop-card-title-row">
          <span class="crop-card-emoji" aria-hidden="true">${crop.emoji}</span>
          <h3 class="crop-card-title">${crop.name}</h3>
        </div>
        <p class="crop-card-desc">${crop.summary}</p>
      </div>
    </a>
  `;
}

function productCard(id) {
  const product = productCatalog[id];
  return `
    <a class="product-card" href="${product.href}" data-route>
      <span class="arrow-icon" aria-hidden="true">↗</span>
      <h3>${product.title}</h3>
      <p>${product.text}</p>
      <strong>Explore ${product.title}</strong>
    </a>
  `;
}

function cropDetailPage(crop) {
  return `
    <div class="crop-detail-page-wrap">
      <!-- 1. Header Section -->
      <section class="crop-detail-header-section">
        <div class="crop-nav-breadcrumb">
          <a href="/crops" data-route class="crop-back-link">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 12L6 8l4-4"/>
            </svg>
            All Crops
          </a>
          <span class="crop-breadcrumb-sep">/</span>
          <span class="crop-breadcrumb-current">${crop.name}</span>
        </div>

        <span class="crop-detail-eyebrow">${crop.emoji} ${crop.name} Pathology & AI Detection</span>
        <h1 class="crop-detail-main-title">${crop.name} Leaf-Level AI Protection</h1>
        <p class="crop-detail-main-subtitle">${crop.headline} Centimeter-level drone imagery and deep neural networks trained to identify ${crop.name.toLowerCase()} diseases before they spread.</p>

        <div class="crop-detail-hero-actions">
          <a class="crop-hero-btn primary" href="/free-demo" data-route>
            Request ${crop.shortName.toLowerCase()} demo &rarr;
          </a>
          <a class="crop-hero-btn secondary" href="#diseases-section">
            Explore detected diseases &darr;
          </a>
        </div>

        <div class="crop-detail-trust-strip">
          <span class="trust-item"><span class="check-dot"></span> Centimeter drone mapping</span>
          <span class="trust-item"><span class="check-dot"></span> Leaf-level symptom diagnosis</span>
          <span class="trust-item"><span class="check-dot"></span> Variable-rate spray prescription</span>
        </div>
      </section>

      <!-- 2. Hero Field Showcase Telemetry Card -->
      <section class="crop-field-visual-section">
        <div class="crop-field-telemetry-card">
          <div class="telemetry-glass-header">
            <div class="live-indicator">
              <span class="live-dot"></span>
              <span>${crop.name} Aerial Inspection Feed &bull; Live Sensor Data</span>
            </div>
            <div class="telemetry-chips">
              <span class="telemetry-chip-tag">${crop.diseaseType} Pathology Engine</span>
            </div>
          </div>
          <div class="crop-field-image-viewport">
            <img src="${crop.image}" alt="${crop.name} field monitored by drone" />
            <div class="field-telemetry-overlay">
              <div class="field-hud-card hud-top-right">
                <span class="hud-status-dot"></span>
                <strong>Autonomous Flight Grid</strong>
                <span>GSD: 0.4cm/px &bull; Altitude: 18m</span>
              </div>
              <div class="field-hud-card hud-bottom-left">
                <span class="hud-icon">${crop.emoji}</span>
                <div class="hud-text-group">
                  <strong>${crop.name} Foliar Health Index</strong>
                  <span>Normalized NDVI: 0.84 &bull; AI Diagnosis Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Specific Diseases Detected in Crop Section -->
      ${crop.diseases ? `
        <section id="diseases-section" class="crop-diseases-section">
          <div class="crop-section-heading">
            <span class="crop-section-eyebrow">${crop.diseaseType} Pathology</span>
            <h2 class="crop-section-title">Specific Diseases Detected in ${crop.name}</h2>
            <p class="crop-section-lead">Drone-captured leaf-level computer vision flags early symptoms before visual field symptoms spread, enabling targeted spot-spraying and reduced chemical costs.</p>
          </div>

          <div class="disease-cards-grid">
            ${crop.diseases.map((d) => `
              <div class="disease-card">
                <div class="disease-card-header">
                  <span class="disease-pill-badge">${crop.diseaseType.split(',')[0].trim()}</span>
                  <span class="disease-status-indicator">
                    <span class="disease-live-dot"></span> AI Model Active
                  </span>
                </div>
                <h3 class="disease-card-title">${d}</h3>
                <p class="disease-card-desc">Leaf-level deep neural network trained for early identification, severity scoring, and georeferenced boundary mapping in ${crop.name}.</p>
                <div class="disease-telemetry-strip">
                  <div class="disease-meta-item">
                    <span class="meta-label">Detection Stage</span>
                    <span class="meta-val">Early Foliar</span>
                  </div>
                  <div class="disease-meta-item">
                    <span class="meta-label">Resolution</span>
                    <span class="meta-val">Sub-mm / Leaf</span>
                  </div>
                  <div class="disease-meta-item">
                    <span class="meta-label">Export Map</span>
                    <span class="meta-val">ISO-XML &bull; SHP</span>
                  </div>
                </div>
                <div class="disease-card-footer">
                  <a class="disease-card-btn" href="/free-demo" data-route>
                    Request ${d} demo &rarr;
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- 4. Precision Drone Agronomy Tools Matched to Crop -->
      <section class="crop-tools-section">
        <div class="crop-section-heading">
          <span class="crop-section-eyebrow">Drone Tools</span>
          <h2 class="crop-section-title">Crop intelligence matched to ${crop.name.toLowerCase()}</h2>
          <p class="crop-section-lead">Integrated aerial flight workflows and analytic layers calibrated specifically for ${crop.name.toLowerCase()} canopy structures.</p>
        </div>

        <div class="crop-tools-grid">
          ${crop.products.map((id) => {
            const prod = productCatalog[id];
            if (!prod) return '';
            return `
              <div class="crop-tool-card">
                <div class="tool-card-icon-wrap">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </div>
                <h3 class="tool-card-title">${prod.title}</h3>
                <p class="tool-card-desc">${prod.text}</p>
                <a class="tool-card-link" href="/how-it-works" data-route>
                  Explore ${prod.title} &rarr;
                </a>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 5. Bottom Banner Section -->
      <section class="crop-detail-banner-section">
        <div class="crop-detail-bottom-banner">
          <h2 class="crop-banner-heading">Ready to protect your ${crop.name.toLowerCase()} harvest?</h2>
          <p class="crop-banner-text">Request a 20-minute field demonstration tailored to your ${crop.name.toLowerCase()} acreage, drone hardware, and regional pathogen pressures.</p>
          <a class="crop-banner-btn" href="/free-demo" data-route>Start a free demo &rarr;</a>
          <p class="crop-contact-note">Looking for other crops? <a href="/crops" data-route>Explore all supported crops &rarr;</a></p>
        </div>
      </section>
    </div>
  `;
}

function allCropsPage() {
  return `
    ${hero({
      eyebrow: 'General',
      title: 'Field-wide tools, every crop',
      text: 'Regardless of what you grow, these data layers run across your whole operation.',
      imageLabel: 'General crop analytics map',
      tone: 'light',
    })}
    <section class="products-section">
      <div class="product-grid general-grid">
        ${productCard('orthomosaic')}
        ${productCard('pest-disease')}
        <article class="product-card plain">
          <span class="arrow-icon" aria-hidden="true">⌁</span>
          <h3>Spray maps</h3>
          <p>Prescription spray maps generated from detection layers and exported to your sprayer or drone applicator, so chemicals land only where they're needed.</p>
        </article>
      </div>
      ${link('/crops', 'All crops', 'button secondary')}
    </section>
  `;
}

function stepsSection(title, steps) {
  return `
    <section class="steps-section">
      <div class="steps-container">
        <div class="steps-heading">
          <p class="steps-eyebrow">HOW IT WORKS</p>
          <h2 class="steps-title">${title}</h2>
        </div>
        <div class="steps-flow">
          <div class="steps-connecting-line" aria-hidden="true"></div>
          ${steps.map(([stepTitle, text], index) => `
            <div class="step-item">
              <div class="step-badge-node">
                <span class="step-badge-num">${index + 1}</span>
              </div>
              <h3 class="step-item-title">${stepTitle}</h3>
              <p class="step-item-desc">${text}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function flowCard(title, text, steps, options = {}) {
  const { icon, eyebrow, tag, accent } = options;
  return `
    <article class="flow-card" style="--card-accent: ${accent || '#2f6f43'}">
      <div class="flow-card-header">
        <div class="flow-icon-wrap" aria-hidden="true">${icon || ''}</div>
        <div class="flow-meta">
          <span class="flow-eyebrow">${eyebrow || ''}</span>
          <h3>${title}</h3>
        </div>
        <span class="flow-tag">${tag || ''}</span>
      </div>
      <p class="flow-desc">${text}</p>
      <div class="flow-pipeline">
        <span class="pipeline-label">Execution Flow</span>
        <div class="flow-line">
          ${steps.map((step, index) => `
            <div class="flow-step-node">
              <span class="node-num">${index + 1}</span>
              <span class="node-text">${step}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </article>
  `;
}

function howItWorksPage() {
  const faqs = [
    ['Which drones work with PhytoGuard AI?', 'PhytoGuard AI natively supports commercial off-the-shelf drones including DJI Mavic Air 2S, Mavic 2 Pro, Mavic 3 Enterprise, Mavic 3 Multispectral, and DJI Agras spraying platforms.'],
    ['How high does the drone fly to detect pests at the leaf level?', 'Our automated waypoint patterns fly between 15 to 25 meters above the canopy, delivering 0.4 to 0.8 cm/pixel Ground Sample Distance (GSD) for sub-millimeter leaf diagnosis.'],
    ['How often should I fly my drone over the fields?', 'We recommend flying every 7 to 14 days during critical growth, emergence, and flowering stages, or immediately following high-humidity spells to spot early fungal spores before they spread.'],
    ['Can I export prescription maps directly to my sprayer?', 'Yes. PhytoGuard AI automatically converts detection findings into standard GeoTIFF, Shapefile, and ISO-XML prescription maps ready to load directly into modern tractor and sprayer controllers.'],
  ];

  const flightIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" opacity="0.25"/>
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  `;

  const leafAiIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      <path d="M12 22.5V12"/>
      <circle cx="12" cy="8" r="1.8" fill="currentColor"/>
    </svg>
  `;

  const prescriptionIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/>
      <line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  `;

  const isBn = getLang() === 'bn';

  return `
    <div class="hiw-page-wrap">
      <section class="hiw-header-section">
        <span class="hiw-eyebrow">${isBn ? 'যেভাবে কাজ করে' : 'How It Works'}</span>
        <h1 class="hiw-main-title">${isBn ? 'আপনার সমস্ত ড্রোন ইমেজ। একক এআই ইন্টেলিজেন্স প্ল্যাটফর্মে।' : 'All your drone imagery. One AI intelligence platform.'}</h1>
        <p class="hiw-main-subtitle">
          ${isBn ? 'স্বয়ংক্রিয় ফ্লাইট পরিকল্পনা, পাতার স্তরে এআই স্ক্যানিং এবং অর্থোমোসাইক স্টিচিং — সবকিছু এক জায়গায়, যাতে প্রতিটি হেক্টর থাকে সার্বক্ষণিক নজরে।' : 'Automated flight planning, leaf-level AI scanning, and orthomosaic stitching. All feeding into one place, so every acre stays under watch.'}
        </p>
        <div class="hiw-hero-actions">
          <a class="button primary hiw-hero-btn" href="/free-demo" data-route>${isBn ? 'ফ্রি ডেমো শুরু করুন' : 'Start free demo'} <span aria-hidden="true">&rarr;</span></a>
          <a class="button ghost hiw-ghost-btn" href="#platform-flows">${isBn ? 'কাজের ধারা দেখুন' : 'Explore workflows'} &darr;</a>
        </div>
        <div class="hiw-trust-strip">
          <span class="trust-item"><span class="check-dot"></span>${isBn ? 'নির্দিষ্ট হার্ডওয়্যার বাধ্যবাধকতা নেই' : 'Zero proprietary flight hardware'}</span>
          <span class="trust-item"><span class="check-dot"></span>${isBn ? 'ডিজেআই ও মাল্টিস্পেকট্রাল রেডি' : 'DJI & Multispectral ready'}</span>
          <span class="trust-item"><span class="check-dot"></span>${isBn ? 'সেন্টিমিটার স্তরের জিপিএস ট্যাগিং' : 'Centimeter-accurate GPS tagging'}</span>
        </div>
      </section>

      <section class="hiw-visual-section">
        <div class="hiw-telemetry-card">
          <div class="telemetry-glass-header">
            <div class="status-live-indicator"><span class="pulse-emerald"></span> ${isBn ? 'লাইভ টেলিমেট্রি ফিড' : 'Live Telemetry Feed'}</div>
            <span class="telemetry-version">PhytoGuard Core v3.4</span>
          </div>
          <div class="telemetry-preview-viewport">
            <img src="/assets/landing-demo-bg.png" alt="Multi-sensor agricultural intelligence field" />
            <div class="radar-scan-overlay" aria-hidden="true"></div>
            <div class="telemetry-chip chip-drone">
              <span class="chip-dot"></span>
              <span>🛸 ${isBn ? 'স্বয়ংক্রিয় ফ্লাইট গ্রিড' : 'Autonomous Flight Grid'}</span>
              <span class="chip-sub">${isBn ? 'উচ্চতা: ১৮ মি · জিএসডি: ০.৪ সেমি/পিক্সেল' : 'Altitude: 18m · GSD: 0.4cm/px'}</span>
            </div>
            <div class="telemetry-chip chip-ai">
              <span class="chip-dot-amber"></span>
              <span>🔬 ${isBn ? 'পাতার স্তরে নিউরাল সেগমেন্টেশন' : 'Leaf-Level Neural Segmentation'}</span>
              <span class="chip-sub">${isBn ? 'সক্রিয় বায়োমার্কার: লেইট ব্লাইট ৯৮.২%' : 'Active Biomarker: Late Blight 98.2%'}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="hiw-flows-section" id="platform-flows">
        <div class="hiw-section-heading centered">
          <span class="hiw-section-eyebrow">${isBn ? 'মূল প্রযুক্তি স্তর' : 'Core Architecture'}</span>
          <h2 class="hiw-section-title">${isBn ? 'তিনটি স্তরে মাঠ বুদ্ধিমান করে তোলা হয়' : 'Three layers of crop intelligence'}</h2>
          <p class="hiw-section-sub">
            ${isBn ? 'ফ্লাইট পরিকল্পনা থেকে সুনির্দিষ্ট স্প্রে ম্যাপ — প্রতিটি পদক্ষেপ সর্বোচ্চ নির্ভুলতার জন্য অপ্টিমাইজড।' : 'From flight planning to variable-rate spray maps, each layer is purpose-built for speed and precision.'}
          </p>
        </div>

        <div class="hiw-flows-grid">
          ${flowCard(
            isBn ? 'স্বয়ংক্রিয় ড্রোন উড্ডয়ন' : 'Autonomous Flight',
            isBn ? 'ফসলের প্রয়োজনের সাথে সামঞ্জস্য রেখে স্বয়ংক্রিয় ওয়েপয়েন্ট গ্রিডে ড্রোন পরিচালনা করুন।' : "Fly your drone in automated waypoint grids tuned to your crop's needs, like pest detection, stand count, or canopy coverage.",
            isBn ? ['প্যাটার্ন পরিকল্পনা', 'ফ্লাইট ও ছবি সংগ্রহ', 'উচ্চ রেজোলিউশন ফটো', 'ফ্লাইট আপলোড'] : ['Plan pattern', 'Fly & capture', 'High-res raw photos', 'Upload flight'],
            {
              icon: flightIcon,
              eyebrow: isBn ? 'আকাশপথে ডেটা সংগ্রহ' : 'Aerial Capture',
              tag: isBn ? 'স্বয়ংক্রিয় · সেন্টিমিটার জিএসডি' : 'Autonomous · Centimeter GSD',
              accent: '#2f6f43'
            }
          )}
          ${flowCard(
            isBn ? 'পাতার স্তরে এআই স্ক্যান' : 'Leaf-Level AI Scan',
            isBn ? 'গভীর নিউরাল নেটওয়ার্ক প্রতিটি উচ্চ রেজোলিউশন ছবি স্ক্যান করে রোগ ও স্ট্রেস ছড়িয়ে পড়ার আগেই চিহ্নিত করে।' : 'Deep neural networks inspect every high-resolution aerial photo down to the leaf, detecting pests, blight, and nutrient stress before they spread.',
            isBn ? ['অর্থোমোসাইক স্টিচিং', 'এআই লিফ স্ক্যান', 'তীব্রতা মূল্যায়ন', 'ঝুঁকি সতর্কতা'] : ['Orthomosaic stitching', 'AI leaf scan', 'Severity scoring', 'Risk alerts'],
            {
              icon: leafAiIcon,
              eyebrow: isBn ? 'কম্পিউটার ভিশন' : 'Computer Vision',
              tag: isBn ? 'সাব-মিলিমিটার · এআই রোগ নির্ণয়' : 'Sub-millimeter · AI Diagnosis',
              accent: '#1b73e8'
            }
          )}
          ${flowCard(
            isBn ? 'সুনির্দিষ্ট স্প্রে প্রেসক্রিপশন' : 'Variable-Rate Spraying',
            isBn ? 'শনাক্তকরণ রিপোর্টকে সরাসরি পরিবর্তনশীল স্প্রে ম্যাপে রূপান্তর করে ড্রোন বা স্প্রেয়ারে এক্সপোর্ট করুন।' : 'Turn aerial detection reports directly into variable-rate prescription spray maps, exported to your sprayer so chemicals land only where needed.',
            isBn ? ['ঝুঁকি সীমানা', 'প্রেসক্রিপশন ম্যাপ', 'স্প্রেয়ার এক্সপোর্ট', 'সুনির্দিষ্ট প্রয়োগ'] : ['Threat boundary', 'Prescription map', 'Sprayer export', 'Targeted treatment'],
            {
              icon: prescriptionIcon,
              eyebrow: isBn ? 'যথার্থ কৃষি বিজ্ঞান' : 'Precision Agronomy',
              tag: isBn ? 'ভেরিয়েবল রেট · আইএসও-এক্সএমএল প্রস্তুত' : 'Variable-Rate · ISO-XML Ready',
              accent: '#c9771e'
            }
          )}
        </div>
      </section>

      <section class="hiw-pipeline-section">
        <div class="hiw-section-heading centered">
          <span class="hiw-section-eyebrow">${isBn ? 'পরিপূর্ণ কার্যপ্রণালী' : 'End-to-End Execution'}</span>
          <h2 class="hiw-section-title">${isBn ? 'আকাশ থেকে স্প্রেয়ার — চার ধাপে' : 'From sky to sprayer in four steps'}</h2>
        </div>
        <div class="hiw-pipeline-grid">
          <article class="pipeline-step">
            <span class="pipeline-step-badge">${isBn ? 'ধাপ ০১' : 'Phase 01'}</span>
            <h3>${isBn ? 'মাঠের চিত্র গ্রহণ' : 'Capture Fields'}</h3>
            <p>${isBn ? 'কোনো নির্দিষ্ট হার্ডওয়্যারের বাধ্যবাধকতা ছাড়াই আপনার ফসলের মাঠে স্বয়ংক্রিয় ড্রোন ফ্লাইট পরিচালনা করুন।' : 'Launch automated drone flight grids across your acreage with zero proprietary hardware lock-in.'}</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">${isBn ? 'ধাপ ০২' : 'Phase 02'}</span>
            <h3>${isBn ? 'পাতার এআই স্ক্যান' : 'AI Leaf Scan'}</h3>
            <p>${isBn ? 'গভীর নিউরাল নেটওয়ার্ক স্বতন্ত্র গাছ পর্যন্ত রোগবালাই, ক্ষতিকর পোকা ও অঙ্কুরোদগম বিশ্লেষণ করে।' : 'Deep neural networks detect diseases, bugs, and stand counts down to individual plants.'}</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">${isBn ? 'ধাপ ০৩' : 'Phase 03'}</span>
            <h3>${isBn ? 'ঝুঁকির তীব্রতা মূল্যায়ন' : 'Severity Scoring'}</h3>
            <p>${isBn ? 'ঝুঁকিগুলোকে উচ্চ, মাঝারি ও নিম্ন স্তরে বিভক্ত করে সুনির্দিষ্ট জিপিএস কোঅর্ডিনেট সহ চিহ্নিত করুন।' : 'Rank threats into High, Medium, and Low risk zones tagged with exact GPS coordinates.'}</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">${isBn ? 'ধাপ ০৪' : 'Phase 04'}</span>
            <h3>${isBn ? 'পদক্ষেপ ও স্প্রে' : 'Act & Spray'}</h3>
            <p>${isBn ? 'সর্বোচ্চ রাসায়নিক সাশ্রয় নিশ্চিত করে সরাসরি স্প্রেয়ার বা ড্রোনে পরিবর্তনশীল স্প্রে ম্যাপ পাঠাতে এক্সপোর্ট করুন।' : 'Export prescription spray maps straight to your sprayer or applicator with pinpoint chemical efficiency.'}</p>
          </article>
        </div>
      </section>

      <section class="hiw-delivery-section">
        <div class="hiw-delivery-grid">
          ${[
            'Flight Planning|Automated waypoint flight grids and altitude control',
            'Leaf-Level AI|Sub-millimeter pest, disease, and canopy diagnosis',
            'Prescription Maps|Variable-rate spray maps ready for sprayers and drones'
          ].map((item, idx) => {
            const [name, text] = item.split('|');
            return `
              <article class="delivery-card">
                <span class="delivery-num">0${idx + 1}</span>
                <h3>${name}</h3>
                <p>${text}</p>
              </article>
            `;
          }).join('')}
        </div>
      </section>

      <section class="hiw-ecosystem-section">
        <div class="hiw-ecosystem-card">
          <div class="hiw-ecosystem-content">
            <span class="hiw-section-tag-inline">Hardware Agnostic</span>
            <h2 class="hiw-ecosystem-title">Compatible with the aircraft you already own</h2>
            <p class="hiw-ecosystem-text">No proprietary flight hardware lock-in. PhytoGuard AI natively integrates with standard and multispectral drone platforms.</p>
            <div class="hiw-drone-pills">
              <span class="drone-pill-item">DJI Mavic 3 Multispectral</span>
              <span class="drone-pill-item">DJI Mavic 3 Enterprise</span>
              <span class="drone-pill-item">DJI Mavic 3 Mini Pro</span>
              <span class="drone-pill-item">DJI Mavic Air 2S &amp; Mavic 2 Pro</span>
              <span class="drone-pill-item">DJI Agras Series</span>
            </div>
          </div>
          <div class="hiw-apps-card">
            <h3>Automated Flight Planners</h3>
            <p>Download our automated flight pattern apps to capture field-grade imagery hands-free.</p>
            <div class="hiw-app-list">
              <div class="hiw-app-box">
                <strong>PhytoGuard Sky</strong>
                <span>For DJI Mavic Air 2S &amp; Mavic 2 Pro</span>
              </div>
              <div class="hiw-app-box">
                <strong>PhytoGuard Sky+</strong>
                <span>For DJI Mavic 3 Multispectral &amp; Enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="hiw-faq-section">
        <div class="hiw-section-heading centered">
          <span class="hiw-section-eyebrow">Flight questions answered</span>
          <h2 class="hiw-section-title">Common questions</h2>
        </div>
        <div class="hiw-faq-list">
          ${faqs.map(([question, answer]) => `
            <details class="hiw-faq-card">
              <summary class="hiw-faq-summary">
                <span>${question}</span>
                <span class="hiw-faq-plus" aria-hidden="true">+</span>
              </summary>
              <div class="hiw-faq-answer">
                <p>${answer}</p>
              </div>
            </details>
          `).join('')}
        </div>
      </section>

      <section class="hiw-bottom-banner-section">
        <div class="hiw-bottom-banner">
          <h2 class="hiw-banner-heading">From drone flight to targeted action.</h2>
          <p class="hiw-banner-text">Try PhytoGuard AI free and see how autonomous drone flights and leaf-level AI protect your harvest.</p>
          <div class="hiw-banner-actions">
            <a class="hiw-banner-btn" href="/free-demo" data-route>Start free demo <span aria-hidden="true">&rarr;</span></a>
            <span class="hiw-banner-note">No credit card required</span>
          </div>
        </div>
      </section>
    </div>
  `;
}

function getTranslatedPlan(plan) {
  if (getLang() !== 'bn') return plan;
  const bnPlans = {
    'Growers': {
      label: 'চাষী ও খামারি',
      title: 'মাঠ পরিদর্শন ও নজরদারি',
      text: 'ফলনে প্রভাব ফেলার কয়েক সপ্তাহ আগেই ফসলের ঝুঁকি শনাক্ত করুন।',
      pricing: 'প্রতি হেক্টর হিসেবে, প্রতি মৌসুমে নির্ধারিত',
      items: [
        'মাঠ ম্যাপিং ও সীমানা নির্ধারণ',
        'স্বয়ংক্রিয় ওয়েপয়েন্ট ড্রোন ফ্লাইট',
        'উচ্চ রেজোলিউশন ড্রোন ইমেজ সংগ্রহ',
        'এআই বালাই, রোগ ও স্ট্রেস শনাক্তকরণ',
        'তীব্রতা স্কোরসহ স্কাউটিং রিপোর্ট',
        'জিপিএস ট্যাগযুক্ত রোগ পর্যবেক্ষণ',
        'ক্যানোপি কভারেজ বিশ্লেষণ',
        'উদ্ভিদ গণনা ও সমবণ্টন',
        'অর্থোফটো ও এনডিভিআই স্টিচিং',
        'সুনির্দিষ্ট প্রেসক্রিপশন স্প্রে ম্যাপ'
      ],
      btn: 'মাঠ নজরদারি দেখুন'
    },
    'Companies and Cooperations': {
      label: 'কোম্পানি ও সমবায়',
      title: 'সমগ্র কৃষক নেটওয়ার্কের পূর্ণ দৃশ্যমানতা',
      text: 'উৎপাদনে বিঘ্ন ঘটার আগেই জানুন কোন কৃষকের সহায়তা প্রয়োজন।',
      pricing: 'নেটওয়ার্কের আয়তন অনুযায়ী কাস্টম মূল্য',
      items: [
        'বহু-কৃষক মাঠ পর্যবেক্ষণ',
        'মাঠভিত্তিক স্কাউটিং রিপোর্ট',
        'উচ্চ রেজোলিউশন ড্রোন নজরদারি',
        'এআই বালাই ও রোগ শনাক্তকরণ',
        'মাঠজুড়ে তীব্রতা স্কোরিং',
        'জিও ড্যাশবোর্ড',
        'জিপিএস ট্যাগযুক্ত ফলাফল',
        'মাঠের ইতিহাস ও প্রবণতা ট্র্যাকিং',
        'ব্যবস্থা গ্রহণের জন্য প্রেসক্রিপশন ম্যাপ'
      ],
      btn: 'নেটওয়ার্ক প্ল্যান দেখুন'
    },
    'Service Providers': {
      label: 'ড্রোন সার্ভিস প্রোভাইডার',
      title: 'ক্রপ ইন্টেলিজেন্স সার্ভিসেস',
      text: 'আপনার বর্তমান ড্রোন থেকেই তৈরি করুন নতুন আয়ের উৎস।',
      pricing: 'সার্ভিসের পরিধি অনুযায়ী কাস্টম মূল্য',
      items: [
        'ড্রোন ক্যাপচার ওয়ার্কফ্লো',
        'মাল্টিস্পেকট্রাল ড্রোন ইমেজ',
        'এআই স্কাউটিং রিপোর্ট',
        'রোগ ও বালাই শনাক্তকরণ',
        'জিপিএস ট্যাগযুক্ত রিপোর্ট',
        'রোগের তীব্রতা ম্যাপ',
        'প্রেসক্রিপশন ম্যাপ',
        'গ্রাহক উপযোগী মাঠ রিপোর্ট',
        'অংশীদার প্রশিক্ষণ ও অনবোর্ডিং'
      ],
      btn: 'সার্ভিস প্ল্যান দেখুন'
    },
    'Insurance': {
      label: 'কৃষি বীমা',
      title: 'ডিজিটাল ক্ষতি মূল্যায়ন',
      text: 'দ্রুত এবং নির্ভুল ক্ষতি মূল্যায়নের জন্য ড্রোনভিত্তিক নিরপেক্ষ প্রমাণ।',
      pricing: 'অ্যাসেসমেন্টের পরিধি অনুযায়ী কাস্টম মূল্য',
      items: [
        'ড্রোনভিত্তিক মাঠ ক্ষতি মূল্যায়ন',
        'অর্থোফটো ফিল্ড ম্যাপ',
        'জিও-রেফারেন্সড প্রমাণপত্র',
        'ক্ষতিগ্রস্ত এলাকার সঠিক পরিমাপ',
        'ক্ষতির শতাংশ হিসাব',
        'তীব্রতাভিত্তিক ডকুমেন্টেশন',
        'পূর্ব ও পরবর্তী মাঠ তুলনা',
        'বীমা অ্যাসেসমেন্ট রিপোর্ট'
      ],
      btn: 'বীমা সমাধান দেখুন'
    }
  };
  return bnPlans[plan.label] ? { ...plan, ...bnPlans[plan.label] } : plan;
}

function planCard(rawPlan) {
  const plan = getTranslatedPlan(rawPlan);
  const isBn = getLang() === 'bn';
  return `
    <article class="plan-card">
      <div class="plan-card-header">
        <span class="plan-tag">${plan.label}</span>
        <h2 class="plan-title">${plan.title}</h2>
        <p class="plan-desc">${plan.text}</p>
      </div>

      <div class="plan-pricing-box">
        <span class="pricing-icon" aria-hidden="true">🌱</span>
        <span class="pricing-text">${plan.pricing}</span>
      </div>

      <ul class="plan-features" aria-label="Included features in ${plan.title}">
        ${plan.items.map((item) => `
          <li>
            <svg class="plan-check-svg" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="4 11 8 15 16 6"/>
            </svg>
            <span>${item}</span>
          </li>
        `).join('')}
      </ul>

      <div class="plan-card-footer">
        <a class="plan-btn" href="${plan.href}" data-route>
          ${plan.btn || `Explore ${plan.title}`} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </article>
  `;
}

function plansPage() {
  const isBn = getLang() === 'bn';
  return `
    <div class="plans-page-wrap">
      <section class="plans-header-section">
        <span class="plans-eyebrow">${isBn ? 'প্যাকেজ ও মূল্য' : 'Plans'}</span>
        <h1 class="plans-main-title">${isBn ? 'ফসল সরবরাহ ব্যবস্থার প্রতিটি স্তরের জন্য প্রস্তুত' : 'Built for every link in the crop value chain'}</h1>
        <p class="plans-main-subtitle">
          ${isBn ? 'আপনার কাজের ধরণের সাথে মিলে এমন প্যাকেজ বেছে নিন — আপনি চাষী, প্রক্রিয়াজাতকারী, পরামর্শক বা বীমাকারী যাই হোন না কেন।' : 'Pick the plan that matches how you work, whether you grow, process, advise, or insure. Every plan is powered by the same leaf-level AI crop protection platform.'}
        </p>
      </section>

      <section class="plans-grid-section">
        <div class="plans-grid">
          ${plans.map(planCard).join('')}
        </div>
      </section>

      <section class="plans-bottom-banner-section">
        <div class="plans-bottom-banner">
          <h2 class="plan-banner-heading">${isBn ? 'কোন প্যাকেজটি আপনার উপযুক্ত তা নিয়ে অনিশ্চিত?' : 'Still not sure which plan fits?'}</h2>
          <p class="plan-banner-text">
            ${isBn ? 'একটি ২০ মিনিটের ডেমো শিডিউল করুন। আমরা আপনার ফসল, জমির পরিমাণ ও কাজের ধারা দেখে সঠিক প্যাকেজের সুপারিশ করব। কোনো বাধ্যবাধকতা নেই।' : "Book a 20-minute demo. We'll look at your crops, acreage, and workflow, then point you to the right plan. No commitment."}
          </p>
          <a class="plan-banner-btn" href="/free-demo" data-route>
            ${isBn ? 'ডেমো বুক করুন' : 'Book a demo'} <span aria-hidden="true">&rarr;</span>
          </a>
          <p class="plan-contact-note">${isBn ? 'কোনো প্রশ্ন আছে? আমাদের লিখুন:' : 'Have a question? Reach us at'} <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a></p>
        </div>
      </section>
    </div>
  `;
}
function getKbIcon(name) {
  switch (name) {
    case 'rocket':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>`;
    case 'drone':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5"/>
        <path d="M6 6l3.5 3.5m5 0l3.5-3.5m-3.5 5l3.5 3.5m-8.5 0l3.5-3.5"/>
        <circle cx="4.5" cy="4.5" r="2.5"/>
        <circle cx="19.5" cy="4.5" r="2.5"/>
        <circle cx="19.5" cy="19.5" r="2.5"/>
        <circle cx="4.5" cy="19.5" r="2.5"/>
      </svg>`;
    case 'sensor':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 3v3m0 12v3M3 12h3m12 0h3"/>
      </svg>`;
    case 'screen':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>`;
    case 'wrench':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>`;
    case 'faq':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>`;
    case 'document':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>`;
    case 'leaf':
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        <path d="M12 22.5V12"/>
        <circle cx="12" cy="8" r="1.8"/>
      </svg>`;
    default:
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`;
  }
}

function knowledgeBasePage() {
  const isBn = getLang() === 'bn';
  return `
    <div class="kb-page">
      <section class="kb-hero-banner">
        <div class="kb-hero-content-wrap">
          <div class="kb-hero-left">
            <h1 class="kb-hero-title">${isBn ? 'হ্যালো। বাংলাদেশ কৃষি তথ্যভান্ডারে আপনাকে স্বাগতম।' : 'Hello. How can we help your Bangladesh farm?'}</h1>
            <p class="kb-hero-desc" style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin-top: 0.5rem; margin-bottom: 1.25rem;">
              ${isBn ? 'বাংলাদেশ বেসামরিক বিমান চলাচল কর্তৃপক্ষ (CAAB) নিয়মাবলী, বারী/ব্রি জাত, ব্লাস্ট ও লেট ব্লাইট দমন এবং আধুনিক কৃষি ড্রোন ব্যবহারের প্রামাণ্য নির্দেশিকা।' : 'Official technical repository for CAAB drone regulations, BARI/BRRI crop genetics, wheat blast & potato blight scouting, and precision aerial agronomy in Bangladesh.'}
            </p>
            <div class="kb-search-box-wrap">
              <input
                type="text"
                id="kb-search-input"
                class="kb-search-input"
                placeholder="${isBn ? 'ড্রোন, ব্লাস্ট, আলু ব্লাইট, CAAB বা বারী জাত অনুসন্ধান করুন...' : 'Search for drone rules, CAAB, wheat blast, late blight, BARI...'}"
                autocomplete="off"
                aria-label="${isBn ? 'নলেজ বেস আর্টিকেল অনুসন্ধান করুন' : 'Search knowledge base articles'}"
              />
              <button class="kb-search-btn" type="button" id="kb-search-trigger" aria-label="${isBn ? 'অনুসন্ধান' : 'Search'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </div>
            <div id="kb-search-count" class="kb-search-count" style="display: none;"></div>
          </div>
          <div class="kb-hero-right" aria-hidden="true">
            <div class="kb-device-mockup">
              <div class="kb-mockup-top-bar">
                <span class="mockup-camera-dot"></span>
                <span class="mockup-speaker-bar"></span>
              </div>
              <div class="kb-mockup-screen">
                <img src="/assets/crop-potato.jpg" alt="Drone leaf inspection preview" />
                <div class="kb-bbox-spot" style="top: 28%; left: 32%; width: 44%; height: 38%;">
                  <span class="kb-bbox-badge">${isBn ? 'এআই ৯৮.৪% · আলু লেট ব্লাইট (মুন্সীগঞ্জ)' : 'AI 98.4% · Potato Late Blight (Munshiganj)'}</span>
                </div>
                <div class="kb-mockup-hud">
                  <span class="kb-hud-dot"></span>
                  <span>${isBn ? 'কৃষি ড্রোন মাল্টিস্পেকট্রাল লাইভ' : 'Mavic 3M Multispectral Feed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="kb-main-container">
        <div id="kb-no-results" class="kb-no-results" style="display: none;">
          <div class="no-results-icon">🔍</div>
          <h3>${isBn ? 'কোনো আর্টিকেল খুঁজে পাওয়া যায়নি' : 'No matching articles found'}</h3>
          <p>${isBn ? 'অনুগ্রহ করে "ড্রোন", "ব্লাস্ট", "মুন্সীগঞ্জ", "CAAB", "লেট ব্লাইট", বা "সার" লিখে অনুসন্ধান করুন।' : 'Try searching for keywords like "drone", "CAAB", "blast", "potato", "Munshiganj", "Bogura", or "spray".'}</p>
          <button class="button secondary" type="button" id="kb-clear-search-btn">${isBn ? 'অনুসন্ধান রিসেট করুন' : 'Clear Search'}</button>
        </div>

        <div class="kb-categories-grid" id="kb-categories-grid">
          ${kbCategories.map(cat => `
            <article class="kb-category-card" data-cat-id="${cat.id}">
              <div class="kb-cat-icon-badge" aria-hidden="true">
                ${getKbIcon(cat.icon)}
              </div>
              <h2 class="kb-cat-title">${isBn ? (cat.title_bn || cat.title) : cat.title}</h2>
              <p class="kb-cat-subtitle">${isBn ? (cat.subtitle_bn || cat.subtitle) : cat.subtitle}</p>
              <ul class="kb-article-links">
                ${cat.articles.map(art => `
                  <li class="kb-article-item" data-art-slug="${art.slug}">
                    <a href="#${art.slug}" class="kb-article-link" data-kb-slug="${art.slug}">
                      ${isBn ? (art.title_bn || art.title) : art.title}
                    </a>
                  </li>
                `).join('')}
              </ul>
              <a href="#cat-${cat.id}" class="kb-see-more-link" data-kb-cat="${cat.id}">${isBn ? 'আরও দেখুন &rarr;' : 'See more &rarr;'}</a>
            </article>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Article Modal Dialog -->
      <div id="kb-article-modal" class="kb-modal-backdrop" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="kb-modal-title">
        <div class="kb-modal-dialog">
          <div class="kb-modal-header">
            <div class="kb-modal-breadcrumbs">
              <span id="kb-modal-cat-crumb">${isBn ? 'নলেজ বেস' : 'Knowledge Base'}</span>
              <span class="crumb-separator">/</span>
              <span class="crumb-current">${isBn ? 'আর্টিকেল' : 'Article'}</span>
            </div>
            <button type="button" class="kb-modal-close-btn" id="kb-modal-close" aria-label="${isBn ? 'বন্ধ করুন' : 'Close article'}">&times;</button>
          </div>
          <div class="kb-modal-body">
            <h2 id="kb-modal-title" class="kb-modal-heading"></h2>
            <div class="kb-modal-meta">
              <span class="kb-badge-pill">${isBn ? 'বাংলাদেশ কৃষি ও সিএএবি মানদণ্ড' : 'CAAB & BARI Agri-Standard'}</span>
              <span class="kb-reading-time">${isBn ? '৩ মিনিট পাঠ' : '3 min read'}</span>
            </div>
            <div id="kb-modal-content" class="kb-modal-prose"></div>
          </div>
          <div class="kb-modal-footer">
            <div class="kb-helpful-prompt" id="kb-helpful-container">
              <span>${isBn ? 'এই আর্টিকেলটি কি আপনার জন্য সহায়ক ছিল?' : 'Was this article helpful?'}</span>
              <button type="button" class="kb-feedback-btn" id="kb-feedback-yes">${isBn ? 'হ্যাঁ 👍' : 'Yes 👍'}</button>
              <button type="button" class="kb-feedback-btn" id="kb-feedback-no">${isBn ? 'না 👎' : 'No 👎'}</button>
            </div>
            <button type="button" class="button secondary" id="kb-modal-done-btn">${isBn ? 'নলেজ বেসে ফিরে যান' : 'Back to Knowledge Base'}</button>
          </div>
        </div>
      </div>

      ${chatWidget()}
    </div>
  `;
}

function setupKnowledgeBaseEvents() {
  const searchInput = document.querySelector('#kb-search-input');
  const searchCount = document.querySelector('#kb-search-count');
  const noResults = document.querySelector('#kb-no-results');
  const clearBtn = document.querySelector('#kb-clear-search-btn');
  const catGrid = document.querySelector('#kb-categories-grid');
  const modal = document.querySelector('#kb-article-modal');
  const modalClose = document.querySelector('#kb-modal-close');
  const modalDone = document.querySelector('#kb-modal-done-btn');
  const modalTitle = document.querySelector('#kb-modal-title');
  const modalContent = document.querySelector('#kb-modal-content');
  const modalCatCrumb = document.querySelector('#kb-modal-cat-crumb');
  const helpfulContainer = document.querySelector('#kb-helpful-container');

  function openArticle(slug) {
    const isBn = getLang() === 'bn';
    let foundArticle = null;
    let foundCategory = null;
    for (const cat of kbCategories) {
      const art = cat.articles.find(a => a.slug === slug);
      if (art) {
        foundArticle = art;
        foundCategory = cat;
        break;
      }
    }
    if (!foundArticle || !modal) return;

    if (modalCatCrumb) modalCatCrumb.textContent = isBn ? (foundCategory.title_bn || foundCategory.title) : foundCategory.title;
    if (modalTitle) modalTitle.textContent = isBn ? (foundArticle.title_bn || foundArticle.title) : foundArticle.title;
    if (modalContent) modalContent.innerHTML = isBn ? (foundArticle.content_bn || foundArticle.content) : foundArticle.content;
    if (helpfulContainer) {
      helpfulContainer.innerHTML = `
        <span>${isBn ? 'এই আর্টিকেলটি কি আপনার জন্য সহায়ক ছিল?' : 'Was this article helpful?'}</span>
        <button type="button" class="kb-feedback-btn" id="kb-feedback-yes">${isBn ? 'হ্যাঁ 👍' : 'Yes 👍'}</button>
        <button type="button" class="kb-feedback-btn" id="kb-feedback-no">${isBn ? 'না 👎' : 'No 👎'}</button>
      `;
      const yesBtn = helpfulContainer.querySelector('#kb-feedback-yes');
      const noBtn = helpfulContainer.querySelector('#kb-feedback-no');
      const thankMsg = isBn ? '<em>আপনার মতামতের জন্য ধন্যবাদ!</em>' : '<em>Thank you for your feedback!</em>';
      if (yesBtn) yesBtn.onclick = () => { helpfulContainer.innerHTML = thankMsg; };
      if (noBtn) noBtn.onclick = () => { helpfulContainer.innerHTML = thankMsg; };
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.onclick = closeModal;
  if (modalDone) modalDone.onclick = closeModal;
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  document.querySelectorAll('.kb-article-link').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const slug = link.dataset.kbSlug;
      openArticle(slug);
    };
  });

  document.querySelectorAll('.kb-see-more-link').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      const catId = link.dataset.kbCat;
      const cat = kbCategories.find(c => c.id === catId);
      if (cat && cat.articles.length > 0) {
        openArticle(cat.articles[0].slug);
      }
    };
  });

  function doSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    const isBn = getLang() === 'bn';

    if (!query) {
      if (searchCount) searchCount.style.display = 'none';
      if (noResults) noResults.style.display = 'none';
      if (catGrid) catGrid.style.display = 'grid';
      document.querySelectorAll('.kb-category-card').forEach(card => {
        card.style.display = '';
        card.querySelectorAll('.kb-article-item').forEach(item => {
          item.style.display = '';
        });
      });
      return;
    }

    let totalMatches = 0;
    document.querySelectorAll('.kb-category-card').forEach(card => {
      const catId = card.dataset.catId;
      const cat = kbCategories.find(c => c.id === catId);
      let catMatches = 0;

      card.querySelectorAll('.kb-article-item').forEach(item => {
        const slug = item.dataset.artSlug;
        const art = cat ? cat.articles.find(a => a.slug === slug) : null;
        if (art) {
          const artTitle = (art.title || '').toLowerCase();
          const artTitleBn = (art.title_bn || '').toLowerCase();
          const artExcerpt = (art.excerpt || '').toLowerCase();
          const artExcerptBn = (art.excerpt_bn || '').toLowerCase();
          const artContent = (art.content || '').toLowerCase();
          const artContentBn = (art.content_bn || '').toLowerCase();
          const catTitle = (cat.title || '').toLowerCase();
          const catTitleBn = (cat.title_bn || '').toLowerCase();

          if (
            artTitle.includes(query) ||
            artTitleBn.includes(query) ||
            artExcerpt.includes(query) ||
            artExcerptBn.includes(query) ||
            artContent.includes(query) ||
            artContentBn.includes(query) ||
            catTitle.includes(query) ||
            catTitleBn.includes(query)
          ) {
            item.style.display = '';
            catMatches++;
            totalMatches++;
          } else {
            item.style.display = 'none';
          }
        } else {
          item.style.display = 'none';
        }
      });

      if (catMatches > 0) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    if (totalMatches === 0) {
      if (catGrid) catGrid.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      if (searchCount) searchCount.style.display = 'none';
    } else {
      if (catGrid) catGrid.style.display = 'grid';
      if (noResults) noResults.style.display = 'none';
      if (searchCount) {
        searchCount.style.display = 'block';
        searchCount.textContent = isBn
          ? `"${query}" এর জন্য ${formatNumber(totalMatches)}টি আর্টিকেল পাওয়া গেছে`
          : `Found ${totalMatches} article${totalMatches === 1 ? '' : 's'} matching "${query}"`;
      }
    }
  }

  if (searchInput) {
    searchInput.oninput = doSearch;
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (searchInput) {
        searchInput.value = '';
        doSearch();
      }
    };
  }

  window.onkeydown = (e) => {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
      closeModal();
    }
  };
}

function chatWidget() {
  return `
    <button class="floating-chat-btn" type="button" aria-label="Support chat">
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  `;
}

function loginPage() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.role === 'admin') navigate('/admin');
    else navigate('/dashboard');
    return '';
  }

  return `
    <div class="auth-page auth-login-page">
      <div class="auth-split-grid">
        <div class="auth-side-visual login-visual">
          <img src="/assets/login-drone-field.jpg" alt="Lush crop fields with surveillance drone" />
        </div>
        <div class="auth-side-form">
          <div class="auth-form-card">
            <a class="auth-brand" href="/" data-route aria-label="PhytoGuard AI home">
              <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
              <span class="auth-tagline">Detection Done Right</span>
            </a>
            
            <!-- Login Role Switcher: Grower vs Admin Portal -->
            <div class="auth-role-tabs" role="tablist">
              <button type="button" class="auth-tab-btn active" id="tab-login-grower" role="tab" aria-selected="true">
                <span>${t('auth.growerTab')}</span>
              </button>
              <button type="button" class="auth-tab-btn" id="tab-login-admin" role="tab" aria-selected="false">
                <span>${t('auth.adminTab')}</span>
              </button>
            </div>

            <h1 class="auth-title">${t('auth.welcome')}</h1>
            <p class="auth-subtitle">${t('auth.welcomeSub')}</p>

            <div id="login-alert" class="auth-alert-box" style="display: none;"></div>

            <form id="login-form" class="auth-form" novalidate>
              <div class="auth-input-group" id="group-login-user">
                <input id="login-username" class="auth-input" type="text" placeholder=" " required autocomplete="username" value="ador@phytoguard.ai" />
                <label class="auth-floating-label" for="login-username">${t('auth.usernameLabel')}<span class="req-star">*</span></label>
              </div>

              <div class="auth-input-group" id="group-login-pass">
                <input id="login-password" class="auth-input has-toggle" type="password" placeholder=" " required autocomplete="current-password" value="password123" />
                <label class="auth-floating-label" for="login-password">${t('auth.passwordLabel')}<span class="req-star">*</span></label>
                <button class="password-toggle" type="button" aria-label="Toggle password visibility">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>

              <div class="auth-remember-row">
                <label class="auth-checkbox-label">
                  <input type="checkbox" id="login-remember" class="auth-checkbox" checked />
                  <span class="checkbox-box" aria-hidden="true">
                    <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 5l3 3 6-6.5"/></svg>
                  </span>
                  <span>${t('auth.rememberMe')}</span>
                </label>
                <span class="demo-credential-hint"><strong>${t('auth.roleHintGrower')}</strong> ador@phytoguard.ai / password123</span>
              </div>

              <button class="auth-btn-primary" type="submit" id="login-submit-btn">${t('auth.signIn')}</button>

              <div class="auth-divider">
                <span>or</span>
              </div>

              <div class="social-row">
                <button class="social-btn" type="button" aria-label="Sign in with Google">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </button>
                <button class="social-btn" type="button" aria-label="Sign in with Microsoft">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#f25022" d="M1 1h10v10H1z"/>
                    <path fill="#00a4ef" d="M1 13h10v10H1z"/>
                    <path fill="#7fba00" d="M13 1h10v10H13z"/>
                    <path fill="#ffb900" d="M13 13h10v10H13z"/>
                  </svg>
                </button>
                <button class="social-btn" type="button" aria-label="Sign in with Apple">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#1d1d1f">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.66-1.07 1.73-.93 2.76 1 .08 2.02-.51 2.63-1.26z"/>
                  </svg>
                </button>
              </div>

              <div class="auth-footer-links">
                <a class="auth-signup-cta" href="/signup" data-route>${t('auth.signUp')}</a>
                <a class="auth-forgot-link" href="#forgot">${t('auth.forgotPassword')}</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      ${chatWidget()}
    </div>
  `;
}

function setupLoginEvents() {
  const tabGrower = document.getElementById('tab-login-grower');
  const tabAdmin = document.getElementById('tab-login-admin');
  const userInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  const titleEl = document.querySelector('.auth-title');
  const subEl = document.querySelector('.auth-subtitle');
  const submitBtn = document.getElementById('login-submit-btn');
  const hintEl = document.querySelector('.demo-credential-hint');
  const card = document.querySelector('.auth-form-card');

  const urlParams = new URLSearchParams(window.location.search);
  const isAdminInitial = urlParams.get('admin') === '1' || urlParams.get('redirect') === '/admin';

  function setMode(mode) {
    if (mode === 'admin') {
      if (tabAdmin) {
        tabAdmin.classList.add('active');
        tabAdmin.setAttribute('aria-selected', 'true');
      }
      if (tabGrower) {
        tabGrower.classList.remove('active');
        tabGrower.setAttribute('aria-selected', 'false');
      }
      if (card) card.classList.add('admin-mode-active');
      if (titleEl) titleEl.innerHTML = `${t('auth.adminGateway')} 🛡️`;
      if (subEl) subEl.textContent = t('auth.adminGatewaySub');
      if (userInput) userInput.value = 'admin@phytoguard.ai';
      if (passInput) passInput.value = 'admin';
      if (submitBtn) submitBtn.textContent = t('auth.signInAdmin');
      if (hintEl) hintEl.innerHTML = `<strong>${t('auth.roleHintAdmin')}</strong> admin@phytoguard.ai / admin`;
    } else {
      if (tabGrower) {
        tabGrower.classList.add('active');
        tabGrower.setAttribute('aria-selected', 'true');
      }
      if (tabAdmin) {
        tabAdmin.classList.remove('active');
        tabAdmin.setAttribute('aria-selected', 'false');
      }
      if (card) card.classList.remove('admin-mode-active');
      if (titleEl) titleEl.textContent = t('auth.welcome');
      if (subEl) subEl.textContent = t('auth.welcomeSub');
      if (userInput) userInput.value = 'ador@phytoguard.ai';
      if (passInput) passInput.value = 'password123';
      if (submitBtn) submitBtn.textContent = t('auth.signIn');
      if (hintEl) hintEl.innerHTML = `<strong>${t('auth.roleHintGrower')}</strong> ador@phytoguard.ai / password123`;
    }
  }

  if (tabGrower) tabGrower.addEventListener('click', () => setMode('grower'));
  if (tabAdmin) tabAdmin.addEventListener('click', () => setMode('admin'));

  if (isAdminInitial) {
    setMode('admin');
  }
}

function signupPage() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    navigate('/dashboard');
    return '';
  }

  return `
    <div class="auth-page auth-signup-page">
      <div class="auth-split-grid signup-grid">
        <div class="auth-side-form">
          <div class="auth-form-card signup-card">
            <a class="auth-brand" href="/" data-route aria-label="PhytoGuard AI home">
              <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
              <span class="auth-tagline">Detection Done Right</span>
            </a>

            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join PhytoGuard AI for drone crop protection</p>

            <div id="signup-alert" class="auth-alert-box" style="display: none;"></div>

            <form id="signup-form" class="auth-form" novalidate>
              <div class="auth-input-group" id="group-signup-first">
                <input id="signup-firstname" class="auth-input" type="text" placeholder=" " required autocomplete="given-name" />
                <label class="auth-floating-label" for="signup-firstname">First Name<span class="req-star">*</span></label>
              </div>

              <div class="auth-input-group" id="group-signup-last">
                <input id="signup-lastname" class="auth-input" type="text" placeholder=" " required autocomplete="family-name" />
                <label class="auth-floating-label" for="signup-lastname">Last Name<span class="req-star">*</span></label>
              </div>

              <div class="auth-input-group" id="group-signup-email">
                <input id="signup-email" class="auth-input" type="email" placeholder=" " required autocomplete="email" />
                <label class="auth-floating-label" for="signup-email">Email<span class="req-star">*</span></label>
              </div>

              <div class="auth-input-group" id="group-signup-phone">
                <input id="signup-phone" class="auth-input" type="tel" placeholder=" " autocomplete="tel" />
                <label class="auth-floating-label" for="signup-phone">Phone Number (Optional)</label>
              </div>

              <div class="auth-input-group" id="group-signup-pass">
                <input id="signup-password" class="auth-input has-toggle" type="password" placeholder=" " required autocomplete="new-password" />
                <label class="auth-floating-label" for="signup-password">Password (min 6 characters)<span class="req-star">*</span></label>
                <button class="password-toggle" type="button" aria-label="Toggle password visibility">
                  <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </div>

              <button class="auth-btn-primary" type="submit" id="signup-submit-btn">Create Account &amp; Access Dashboard</button>

              <div class="auth-bottom-row">
                <span>Already have an account? <a class="auth-link-highlight" href="/login" data-route>Log In</a></span>
              </div>
            </form>
          </div>
        </div>
        <div class="auth-side-visual signup-visual">
          <div class="signup-showcase-container">
            <img class="signup-mockup-img" src="/assets/signup-platform-showcase.jpg" alt="PhytoGuard AI leaf-level drone crop protection platform" />
            <p class="auth-showcase-caption">
              Monitor crops, detect pests, and optimize yields - all from <strong class="accent-blue">One Platform</strong>
            </p>
          </div>
        </div>
      </div>
      ${chatWidget()}
    </div>
  `;
}

function droneCoverageHeatmap(isDemo = true, userReq = null, hasCompletedScan = false, latestScan = null) {
  if (!isDemo && !hasCompletedScan) {
    return `
      <div class="dash-map-section">
        <div class="map-section-header">
          <div>
            <div class="map-header-eyebrow">
              <span class="live-dot" style="background:#64748b;" aria-hidden="true"></span>
              <span>${getLang() === 'bn' ? 'ড্রোন কভারেজ ও প্যাথলজি হিটম্যাপ' : 'Drone Coverage & Foliar Pathology Heatmap'}</span>
            </div>
            <h2 class="panel-title">${getLang() === 'bn' ? 'এরিয়াল ড্রোন কভারেজ হিটম্যাপ' : 'Aerial Drone Coverage Heatmap'}</h2>
            <p class="panel-sub">${getLang() === 'bn' ? 'আপনার খামারের স্বায়ত্তশাসিত ফ্লাইট সম্পন্ন হলে মাল্টিস্পেকট্রাল এনডিভিআই ম্যাপিং এখানে প্রদর্শিত হবে।' : 'Multispectral NDVI orthomosaics & foliar pathology alerts will display here once a drone mission is flown.'}</p>
          </div>
          <div class="map-stats-badge" style="background: rgba(100, 116, 139, 0.1); border-color: rgba(100, 116, 139, 0.25);">
            <span class="scan-counter-val" style="color: #64748b;">0.0 / 0.0 Ha</span>
            <span class="scan-counter-pct" style="color: #94a3b8;">(0% Scanned)</span>
          </div>
        </div>

        <div class="dash-map-empty-viewport">
          <div class="dash-map-empty-grid"></div>
          <div class="dash-map-empty-radar-glow"></div>
          <div class="dash-map-empty-content">
            <div class="dash-map-empty-icon">🛰️</div>
            <h3 class="dash-map-empty-title">${getLang() === 'bn' ? 'কোনো এরিয়াল সার্ভে ডেটা নেই' : 'No Aerial Survey Data Available Yet'}</h3>
            <p class="dash-map-empty-desc">
              ${getLang() === 'bn' 
                ? 'আপনার প্লটে ড্রোন মিশন শিডিউল করে রিয়েল-টাইম মাল্টিস্পেকট্রাল অর্থোমোসাইক, এনডিভিআই ক্যানোপি ভাইটালিটি এবং এআই রোগ নির্ণয় পান।' 
                : 'Schedule an autonomous RTK photogrammetry flight across your acreage to generate centimeter-precision multispectral orthomosaics, NDVI vegetation maps, and automated leaf pathology diagnostics.'}
            </p>
            <div class="dash-map-empty-pills">
              <span class="dash-map-empty-pill">Centimeter RTK Flight</span>
              <span class="dash-map-empty-pill">7-Band Multispectral</span>
              <span class="dash-map-empty-pill">Phyto-CNN Inference</span>
            </div>
            <div class="dash-empty-actions" style="margin-top: 14px;">
              <a class="dash-empty-btn" href="/free-demo" data-route>
                <span>+</span>
                <span>${getLang() === 'bn' ? 'ড্রোন মিশন রিকোয়েস্ট করুন' : 'Schedule Drone Flight Mission'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="dash-map-section">
      <div class="map-section-header">
        <div>
          <div class="map-header-eyebrow">
            <span class="live-dot" aria-hidden="true"></span>
            <span>Live Photogrammetry Telemetry &bull; Mission DJI-RTK-0498</span>
          </div>
          <h2 class="panel-title">Drone Scan Coverage &amp; Leaf Pathology Heatmap</h2>
          <p class="panel-sub">16:9 Widescreen view of autonomous drone scan progress across 450 hectares</p>
        </div>
        <div class="map-stats-badge">
          <span class="scan-counter-val">382.5 / 450 Ha</span>
          <span class="scan-counter-pct">(85.0% Scanned)</span>
        </div>
      </div>

      <!-- 16:9 Aspect Ratio Container -->
      <div class="dash-map-viewport" id="dash-map-viewport" data-active-layer="coverage" data-active-sector="all">
        <svg class="dash-map-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Agricultural drone coverage heatmap map">
          <defs>
            <!-- Background Satellite Terrain Glow -->
            <radialGradient id="bg-sat-glow" cx="60%" cy="50%" r="70%">
              <stop offset="0%" stop-color="#14281c" />
              <stop offset="60%" stop-color="#0b1710" />
              <stop offset="100%" stop-color="#050a07" />
            </radialGradient>

            <!-- Coverage Density Gradients -->
            <linearGradient id="grad-cov-full" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.65" />
            </linearGradient>
            <linearGradient id="grad-cov-pending" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#334155" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#1e293b" stop-opacity="0.3" />
            </linearGradient>

            <!-- NDVI Vigor Gradients -->
            <linearGradient id="grad-ndvi-wheat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#15803d" stop-opacity="0.85" />
              <stop offset="60%" stop-color="#84cc16" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#eab308" stop-opacity="0.75" />
            </linearGradient>
            <linearGradient id="grad-ndvi-tomatoes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#22c55e" stop-opacity="0.75" />
              <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.85" />
            </linearGradient>
            <linearGradient id="grad-ndvi-soybeans" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#16a34a" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#22c55e" stop-opacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-ndvi-cucumbers" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#84cc16" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#eab308" stop-opacity="0.8" />
            </linearGradient>
            <linearGradient id="grad-ndvi-potatoes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#15803d" stop-opacity="0.8" />
              <stop offset="65%" stop-color="#ca8a04" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.75" />
            </linearGradient>
            <linearGradient id="grad-ndvi-grapes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#16a34a" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#15803d" stop-opacity="0.85" />
            </linearGradient>

            <!-- Drone Camera Beam Projection -->
            <radialGradient id="drone-beam-grad" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.85" />
              <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
            </radialGradient>

            <!-- Grid Furrow Pattern -->
            <pattern id="soil-furrows" width="24" height="24" patternUnits="userSpaceOnUse">
              <line x1="0" y1="24" x2="24" y2="0" stroke="rgba(255,255,255,0.035)" stroke-width="1" />
            </pattern>
          </defs>

          <!-- Deep Satellite Terrain Backdrop -->
          <rect width="1600" height="900" fill="url(#bg-sat-glow)" />
          <rect width="1600" height="900" fill="url(#soil-furrows)" />

          <!-- Coordinate Grid Lines -->
          <g class="map-coord-grid" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4 6">
            <line x1="60" y1="250" x2="1540" y2="250" />
            <line x1="60" y1="450" x2="1540" y2="450" />
            <line x1="60" y1="650" x2="1540" y2="650" />
            <line x1="530" y1="70" x2="530" y2="830" />
            <line x1="1060" y1="70" x2="1060" y2="830" />
          </g>

          <g class="map-coord-labels" fill="rgba(255,255,255,0.35)" font-size="11" font-family="monospace">
            <text x="70" y="60">23°48'12"N · 90°24'08"E</text>
            <text x="540" y="60">23°48'36"N · 90°25'14"E</text>
            <text x="1070" y="60">23°49'02"N · 90°26'30"E</text>
            <text x="1450" y="60">ELEV 24m AGL</text>
          </g>

          <!-- 6 CROP SECTOR POLYGONS & BOUNDARIES -->
          <!-- SECTOR 1: WHEAT (North - 75 Ha - 100% Scanned) -->
          <g class="sector-group" data-sector="wheat" id="sector-wheat" cursor="pointer">
            <rect class="sector-bg" x="60" y="75" width="450" height="355" rx="12" fill="#0f291e" stroke="#2f6f43" stroke-width="1.8" />
            <rect class="sector-cov-fill" x="60" y="75" width="450" height="355" rx="12" fill="url(#grad-cov-full)" />
            <rect class="sector-ndvi-fill" x="60" y="75" width="450" height="355" rx="12" fill="url(#grad-ndvi-wheat)" style="display:none;" />
            <path class="flight-track-lines" d="M 90 120 H 480 M 480 155 H 90 M 90 190 H 480 M 480 225 H 90 M 90 260 H 480 M 480 295 H 90 M 90 330 H 480 M 480 365 H 90 M 90 400 H 480" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
            <rect x="75" y="90" width="165" height="26" rx="6" fill="rgba(0,0,0,0.65)" />
            <text x="85" y="107" fill="#ffffff" font-size="13" font-weight="600">🌾 Wheat (Sector North)</text>
            <text x="490" y="108" text-anchor="end" fill="#10b981" font-size="12" font-weight="700">75 Ha · 100%</text>
          </g>

          <!-- SECTOR 2: TOMATOES (Block B - 40 Ha - 100% Scanned) -->
          <g class="sector-group" data-sector="tomatoes" id="sector-tomatoes" cursor="pointer">
            <rect class="sector-bg" x="530" y="75" width="510" height="355" rx="12" fill="#1a251b" stroke="#3b7d52" stroke-width="1.8" />
            <rect class="sector-cov-fill" x="530" y="75" width="510" height="355" rx="12" fill="url(#grad-cov-full)" />
            <rect class="sector-ndvi-fill" x="530" y="75" width="510" height="355" rx="12" fill="url(#grad-ndvi-tomatoes)" style="display:none;" />
            <path class="flight-track-lines" d="M 565 105 V 400 M 605 400 V 105 M 645 105 V 400 M 685 400 V 105 M 725 105 V 400 M 765 400 V 105 M 805 105 V 400 M 845 400 V 105 M 885 105 V 400 M 925 400 V 105 M 965 105 V 400 M 1005 400 V 105" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
            <rect x="545" y="90" width="185" height="26" rx="6" fill="rgba(0,0,0,0.65)" />
            <text x="555" y="107" fill="#ffffff" font-size="13" font-weight="600">🍅 Tomatoes (Block B)</text>
            <text x="1025" y="108" text-anchor="end" fill="#10b981" font-size="12" font-weight="700">40 Ha · 100%</text>
          </g>

          <!-- SECTOR 3: SOYBEANS (River Basin - 120 Ha - 100% Scanned) -->
          <g class="sector-group" data-sector="soybeans" id="sector-soybeans" cursor="pointer">
            <rect class="sector-bg" x="1060" y="75" width="480" height="355" rx="12" fill="#132c1c" stroke="#2f6f43" stroke-width="1.8" />
            <rect class="sector-cov-fill" x="1060" y="75" width="480" height="355" rx="12" fill="url(#grad-cov-full)" />
            <rect class="sector-ndvi-fill" x="1060" y="75" width="480" height="355" rx="12" fill="url(#grad-ndvi-soybeans)" style="display:none;" />
            <path class="flight-track-lines" d="M 1090 120 H 1510 M 1510 165 H 1090 M 1090 210 H 1510 M 1510 255 H 1090 M 1090 300 H 1510 M 1510 345 H 1090 M 1090 390 H 1510" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
            <rect x="1075" y="90" width="180" height="26" rx="6" fill="rgba(0,0,0,0.65)" />
            <text x="1085" y="107" fill="#ffffff" font-size="13" font-weight="600">🫘 Soybeans (Basin)</text>
            <text x="1525" y="108" text-anchor="end" fill="#10b981" font-size="12" font-weight="700">120 Ha · 100%</text>
            <g transform="translate(1450, 360)">
              <circle r="18" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2" />
              <path d="M -6 0 L -1 5 L 8 -4" fill="none" stroke="#10b981" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </g>

          <!-- SECTOR 4: CUCUMBERS (Greenhouse 2 - 25 Ha - 100% Scanned) -->
          <g class="sector-group" data-sector="cucumbers" id="sector-cucumbers" cursor="pointer">
            <rect class="sector-bg" x="60" y="455" width="410" height="365" rx="12" fill="#152618" stroke="#2f6f43" stroke-width="1.8" />
            <rect class="sector-cov-fill" x="60" y="455" width="410" height="365" rx="12" fill="url(#grad-cov-full)" />
            <rect class="sector-ndvi-fill" x="60" y="455" width="410" height="365" rx="12" fill="url(#grad-ndvi-cucumbers)" style="display:none;" />
            <path class="flight-track-lines" d="M 90 495 H 440 M 440 535 H 90 M 90 575 H 440 M 440 615 H 90 M 90 655 H 440 M 440 695 H 90 M 90 735 H 440 M 440 775 H 90" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
            <rect x="75" y="470" width="185" height="26" rx="6" fill="rgba(0,0,0,0.65)" />
            <text x="85" y="487" fill="#ffffff" font-size="13" font-weight="600">🥒 Cucumbers (GH 2)</text>
            <text x="450" y="488" text-anchor="end" fill="#10b981" font-size="12" font-weight="700">25 Ha · 100%</text>
          </g>

          <!-- SECTOR 5: POTATOES (Ridge Plot 04 - 90 Ha - 100% Scanned) -->
          <g class="sector-group" data-sector="potatoes" id="sector-potatoes" cursor="pointer">
            <rect class="sector-bg" x="490" y="455" width="490" height="365" rx="12" fill="#18281b" stroke="#376e48" stroke-width="1.8" />
            <rect class="sector-cov-fill" x="490" y="455" width="490" height="365" rx="12" fill="url(#grad-cov-full)" />
            <rect class="sector-ndvi-fill" x="490" y="455" width="490" height="365" rx="12" fill="url(#grad-ndvi-potatoes)" style="display:none;" />
            <path class="flight-track-lines" d="M 520 495 H 950 M 950 535 H 520 M 520 575 H 950 M 950 615 H 520 M 520 655 H 950 M 950 695 H 520 M 520 735 H 950 M 950 775 H 520" stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-dasharray="4 4" fill="none" />
            <rect x="505" y="470" width="180" height="26" rx="6" fill="rgba(0,0,0,0.65)" />
            <text x="515" y="487" fill="#ffffff" font-size="13" font-weight="600">🥔 Potatoes (Ridge 04)</text>
            <text x="965" y="488" text-anchor="end" fill="#10b981" font-size="12" font-weight="700">90 Ha · 100%</text>
          </g>

          <!-- SECTOR 6: GRAPEVINES (Hillside - LIVE SORTIE IN PROGRESS) -->
          <g class="sector-group" data-sector="grapevines" id="sector-grapevines" cursor="pointer">
            <rect class="sector-bg" x="1000" y="455" width="540" height="365" rx="12" fill="#112217" stroke="#25633a" stroke-width="1.8" />
            <path class="sector-cov-fill" d="M 1000 455 H 1220 V 820 H 1000 Z" fill="url(#grad-cov-full)" />
            <path class="sector-cov-fill" d="M 1220 455 H 1540 V 820 H 1220 Z" fill="url(#grad-cov-pending)" />
            <rect class="sector-ndvi-fill" x="1000" y="455" width="540" height="365" rx="12" fill="url(#grad-ndvi-grapes)" style="display:none;" />
            <path class="flight-track-lines" d="M 1025 495 H 1220 M 1220 535 H 1025 M 1025 575 H 1220 M 1220 615 H 1025 M 1025 655 H 1220" stroke="#10b981" stroke-width="1.6" stroke-dasharray="4 4" fill="none" />
            <path class="flight-track-pending" d="M 1220 655 H 1515 M 1515 695 H 1220 M 1220 735 H 1515 M 1515 775 H 1220" stroke="rgba(245, 158, 11, 0.45)" stroke-width="1.4" stroke-dasharray="6 6" fill="none" />
            <rect x="1015" y="470" width="195" height="26" rx="6" fill="rgba(0,0,0,0.7)" />
            <text x="1025" y="487" fill="#ffffff" font-size="13" font-weight="600">🍇 Grapevines (Hillside)</text>
            <text x="1525" y="488" text-anchor="end" fill="#f59e0b" font-size="12" font-weight="700">32.5 / 100 Ha · In-Flight</text>
          </g>

          <!-- ACTIVE DRONE FOOTPRINT & SCANNER -->
          <g class="drone-active-telemetry" transform="translate(1220, 635)">
            <polygon class="drone-scan-cone" points="-75,-25 75,-25 110,65 -110,65" fill="url(#drone-beam-grad)" />
            <circle class="drone-pulse-radar" r="42" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.8" />
            <circle r="18" fill="none" stroke="#38bdf8" stroke-width="1.5" />
            <g class="drone-aircraft" transform="rotate(45)">
              <rect x="-18" y="-3" width="36" height="6" rx="3" fill="#e2e8f0" />
              <rect x="-3" y="-18" width="6" height="36" rx="3" fill="#e2e8f0" />
              <circle r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
              <circle cx="-16" cy="-16" r="6" fill="#38bdf8" opacity="0.8" />
              <circle cx="16" cy="-16" r="6" fill="#38bdf8" opacity="0.8" />
              <circle cx="-16" cy="16" r="6" fill="#10b981" opacity="0.8" />
              <circle cx="16" cy="16" r="6" fill="#10b981" opacity="0.8" />
            </g>
            <rect x="25" y="-30" width="190" height="24" rx="6" fill="rgba(15, 23, 42, 0.85)" stroke="#38bdf8" stroke-width="1" />
            <text x="32" y="-14" fill="#38bdf8" font-size="11" font-weight="700">DJI-350 RTK · 65m · 84% Bat</text>
          </g>

          <!-- DISEASE PATHOLOGY HOTSPOT PINS -->
          <!-- Hotspot 1: Wheat - Yellow Rust -->
          <g class="hotspot-pin" data-pin="yellow-rust" transform="translate(270, 240)" cursor="pointer" role="button" aria-label="Yellow Rust Hotspot">
            <circle class="pin-halo warn" r="22" fill="rgba(245, 158, 11, 0.25)" />
            <circle r="12" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">!</text>
            <rect x="-55" y="16" width="110" height="20" rx="5" fill="rgba(0,0,0,0.8)" />
            <text x="0" y="30" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">Yellow Rust</text>
          </g>

          <!-- Hotspot 2: Tomatoes - Late Blight -->
          <g class="hotspot-pin" data-pin="late-blight" transform="translate(790, 250)" cursor="pointer" role="button" aria-label="Late Blight Critical Alert">
            <circle class="pin-halo danger" r="26" fill="rgba(239, 68, 68, 0.3)" />
            <circle r="13" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="900">⚠️</text>
            <rect x="-65" y="18" width="130" height="20" rx="5" fill="rgba(0,0,0,0.85)" stroke="#ef4444" stroke-width="1" />
            <text x="0" y="32" text-anchor="middle" fill="#fca5a5" font-size="10" font-weight="700">Late Blight (Alert)</text>
          </g>

          <!-- Hotspot 3: Cucumbers - Downy Mildew -->
          <g class="hotspot-pin" data-pin="downy-mildew" transform="translate(240, 650)" cursor="pointer" role="button" aria-label="Downy Mildew Hotspot">
            <circle class="pin-halo warn" r="22" fill="rgba(245, 158, 11, 0.25)" />
            <circle r="12" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">!</text>
            <rect x="-60" y="16" width="120" height="20" rx="5" fill="rgba(0,0,0,0.8)" />
            <text x="0" y="30" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">Downy Mildew</text>
          </g>

          <!-- Hotspot 4: Potatoes - Early Blight -->
          <g class="hotspot-pin" data-pin="early-blight" transform="translate(730, 665)" cursor="pointer" role="button" aria-label="Early Blight Hotspot">
            <circle class="pin-halo warn" r="22" fill="rgba(245, 158, 11, 0.25)" />
            <circle r="12" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" />
            <text x="0" y="4" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">!</text>
            <rect x="-55" y="16" width="110" height="20" rx="5" fill="rgba(0,0,0,0.8)" />
            <text x="0" y="30" text-anchor="middle" fill="#fbbf24" font-size="10" font-weight="700">Early Blight</text>
          </g>
        </svg>

        <!-- GLASSMORPHISM HUD OVERLAYS -->
        <!-- Top-Left Telemetry HUD -->
        <div class="map-hud-panel hud-top-left">
          <div class="hud-item-title">
            <span class="hud-status-dot"></span>
            <span>Flight Grid Active · RTK Fixed (1.2cm)</span>
          </div>
          <div class="hud-metric-row">
            <div>
              <span class="hud-label">Scanned Area</span>
              <strong class="hud-val">382.5 <span class="hud-sub">/ 450 Ha</span></strong>
            </div>
            <div class="hud-divider"></div>
            <div>
              <span class="hud-label">GSD Resolution</span>
              <strong class="hud-val">0.42 <span class="hud-sub">cm/px</span></strong>
            </div>
            <div class="hud-divider"></div>
            <div>
              <span class="hud-label">Overlap</span>
              <strong class="hud-val">80% <span class="hud-sub">Front</span></strong>
            </div>
          </div>
        </div>

        <!-- Top-Right Layer Switcher HUD -->
        <div class="map-hud-panel hud-top-right">
          <span class="hud-layer-label">Map Layers:</span>
          <div class="hud-layer-group" role="tablist">
            <button class="map-layer-btn active" data-layer="coverage" type="button" role="tab" aria-selected="true">
              <span>🛰️ Scan Coverage</span>
            </button>
            <button class="map-layer-btn" data-layer="ndvi" type="button" role="tab" aria-selected="false">
              <span>🌿 NDVI Vigor</span>
            </button>
            <button class="map-layer-btn" data-layer="grid" type="button" role="tab" aria-selected="false">
              <span>📐 Flight Grid</span>
            </button>
          </div>
        </div>

        <!-- Bottom-Left Dynamic Legend HUD -->
        <div class="map-hud-panel hud-bottom-left" id="map-legend-panel">
          <div class="legend-content coverage-legend">
            <span class="legend-title">Scan Density:</span>
            <div class="legend-bar-wrap">
              <span class="legend-label">0%</span>
              <div class="legend-gradient-bar coverage-bar"></div>
              <span class="legend-label">100% (High Overlap)</span>
            </div>
          </div>
          <div class="legend-content ndvi-legend" style="display: none;">
            <span class="legend-title">NDVI Canopy Health:</span>
            <div class="legend-bar-wrap">
              <span class="legend-label">0.2 Low</span>
              <div class="legend-gradient-bar ndvi-bar"></div>
              <span class="legend-label">0.6 Mid</span>
              <span class="legend-label">0.95 Optimal</span>
            </div>
          </div>
          <div class="legend-content grid-legend" style="display: none;">
            <span class="legend-title">Flight Telemetry:</span>
            <div class="legend-tags">
              <span class="grid-tag completed">● Traversed</span>
              <span class="grid-tag active">● Live Beam</span>
              <span class="grid-tag pending">◌ Queued</span>
            </div>
          </div>
        </div>

        <!-- Bottom-Right Sector Quick-Filter -->
        <div class="map-hud-panel hud-bottom-right">
          <span class="hud-filter-label">Focus Sector:</span>
          <div class="hud-sector-pills">
            <button class="map-sector-btn active" data-sector="all" type="button">All (450 Ha)</button>
            <button class="map-sector-btn" data-sector="wheat" type="button">🌾 Wheat</button>
            <button class="map-sector-btn" data-sector="tomatoes" type="button">🍅 Tomatoes</button>
            <button class="map-sector-btn" data-sector="soybeans" type="button">🫘 Soybeans</button>
            <button class="map-sector-btn" data-sector="cucumbers" type="button">🥒 Cucumbers</button>
            <button class="map-sector-btn" data-sector="potatoes" type="button">🥔 Potatoes</button>
            <button class="map-sector-btn" data-sector="grapevines" type="button">🍇 Grapevines</button>
          </div>
        </div>

        <!-- Interactive Floating Tooltip (Dynamic) -->
        <div class="map-interactive-tooltip" id="map-interactive-tooltip" style="display: none;" role="tooltip">
          <div class="tooltip-header">
            <strong id="tooltip-title">Sector Name</strong>
            <button class="tooltip-close" id="tooltip-close-btn" type="button" aria-label="Close tooltip">&times;</button>
          </div>
          <div class="tooltip-body">
            <div class="tooltip-stat-row">
              <span>Scan Status:</span>
              <strong id="tooltip-status">100% Completed</strong>
            </div>
            <div class="tooltip-stat-row">
              <span>Acreage:</span>
              <strong id="tooltip-area">75 Hectares</strong>
            </div>
            <div class="tooltip-stat-row">
              <span>Camera GSD:</span>
              <strong id="tooltip-gsd">0.38 cm/px</strong>
            </div>
            <div class="tooltip-stat-row" id="tooltip-pathology-row">
              <span>Detected Issue:</span>
              <strong id="tooltip-pathology" class="text-amber">Yellow Rust</strong>
            </div>
          </div>
          <div class="tooltip-action-row">
            <a href="/crops" class="tooltip-link" id="tooltip-action-link" data-route>View Crop Diagnostics &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupDashboardHeatmapEvents() {
  const viewport = document.getElementById('dash-map-viewport');
  if (viewport) {

  const tooltip = document.getElementById('map-interactive-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipStatus = document.getElementById('tooltip-status');
  const tooltipArea = document.getElementById('tooltip-area');
  const tooltipGsd = document.getElementById('tooltip-gsd');
  const tooltipPathology = document.getElementById('tooltip-pathology');
  const tooltipActionLink = document.getElementById('tooltip-action-link');
  const tooltipCloseBtn = document.getElementById('tooltip-close-btn');

  // Layer Switching
  const layerBtns = viewport.querySelectorAll('.map-layer-btn');
  const legendCoverage = viewport.querySelector('.coverage-legend');
  const legendNdvi = viewport.querySelector('.ndvi-legend');
  const legendGrid = viewport.querySelector('.grid-legend');
  const covFills = viewport.querySelectorAll('.sector-cov-fill');
  const ndviFills = viewport.querySelectorAll('.sector-ndvi-fill');
  const flightTracks = viewport.querySelectorAll('.flight-track-lines, .flight-track-pending');

  layerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layerBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const layer = btn.dataset.layer;
      viewport.dataset.activeLayer = layer;

      if (layer === 'coverage') {
        covFills.forEach(el => el.style.display = 'block');
        ndviFills.forEach(el => el.style.display = 'none');
        flightTracks.forEach(el => el.style.opacity = '0.45');
        if (legendCoverage) legendCoverage.style.display = 'block';
        if (legendNdvi) legendNdvi.style.display = 'none';
        if (legendGrid) legendGrid.style.display = 'none';
      } else if (layer === 'ndvi') {
        covFills.forEach(el => el.style.display = 'none');
        ndviFills.forEach(el => el.style.display = 'block');
        flightTracks.forEach(el => el.style.opacity = '0.2');
        if (legendCoverage) legendCoverage.style.display = 'none';
        if (legendNdvi) legendNdvi.style.display = 'block';
        if (legendGrid) legendGrid.style.display = 'none';
      } else if (layer === 'grid') {
        covFills.forEach(el => el.style.display = 'none');
        ndviFills.forEach(el => el.style.display = 'none');
        flightTracks.forEach(el => el.style.opacity = '1');
        if (legendCoverage) legendCoverage.style.display = 'none';
        if (legendNdvi) legendNdvi.style.display = 'none';
        if (legendGrid) legendGrid.style.display = 'block';
      }
    });
  });

  // Sector Filtering
  const sectorBtns = viewport.querySelectorAll('.map-sector-btn');
  const sectorGroups = viewport.querySelectorAll('.sector-group');

  sectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sectorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.sector;
      viewport.dataset.activeSector = target;

      sectorGroups.forEach(group => {
        if (target === 'all' || group.dataset.sector === target) {
          group.style.opacity = '1';
          group.style.filter = 'none';
        } else {
          group.style.opacity = '0.2';
          group.style.filter = 'grayscale(80%)';
        }
      });
    });
  });

  // Sector Data for Tooltip
  const sectorInfo = {
    wheat: {
      name: '🌾 Wheat (Sector North)',
      status: '100% Scanned (Today 08:30 AM)',
      area: '75 Hectares',
      gsd: '0.38 cm/px (Sub-mm)',
      pathology: 'Yellow Rust · 2 hotspots flagged',
      pathologyClass: 'text-amber',
      url: '/crops/wheat'
    },
    tomatoes: {
      name: '🍅 Tomatoes (Block B - Processing)',
      status: '100% Scanned (Today 09:15 AM)',
      area: '40 Hectares',
      gsd: '0.32 cm/px (Sub-mm)',
      pathology: 'Late Blight · Critical alert verified',
      pathologyClass: 'text-red',
      url: '/crops/tomatoes'
    },
    soybeans: {
      name: '🫘 Soybeans (River Basin)',
      status: '100% Scanned (Yesterday 04:00 PM)',
      area: '120 Hectares',
      gsd: '0.45 cm/px',
      pathology: 'Clean · No Rust / SDS detected (95% vigor)',
      pathologyClass: 'text-green',
      url: '/crops/soybeans'
    },
    cucumbers: {
      name: '🥒 Cucumbers (Greenhouse 2)',
      status: '100% Scanned (Today 07:00 AM)',
      area: '25 Hectares',
      gsd: '0.28 cm/px',
      pathology: 'Downy Mildew · Morning humidity alert',
      pathologyClass: 'text-amber',
      url: '/crops/cucumbers'
    },
    potatoes: {
      name: '🥔 Potatoes (Ridge Plot 04)',
      status: '100% Scanned (Today 10:30 AM)',
      area: '90 Hectares',
      gsd: '0.35 cm/px',
      pathology: 'Early Blight · Targeted spray map exported',
      pathologyClass: 'text-amber',
      url: '/crops/potatoes'
    },
    grapevines: {
      name: '🍇 Grapevines (Hillside Vineyard)',
      status: 'In-Flight Sortie (32.5 Ha Scanned, 67.5 Ha Pending)',
      area: '100 Hectares',
      gsd: '0.40 cm/px',
      pathology: 'Optimal Canopy Vigor (0.91 NDVI)',
      pathologyClass: 'text-green',
      url: '/crops/grapevines'
    }
  };

  function showTooltip(data, clientX, clientY) {
    if (!tooltip) return;
    tooltipTitle.textContent = data.name;
    tooltipStatus.textContent = data.status;
    tooltipArea.textContent = data.area;
    tooltipGsd.textContent = data.gsd;
    tooltipPathology.textContent = data.pathology;
    tooltipPathology.className = data.pathologyClass;
    tooltipActionLink.setAttribute('href', data.url);

    const rect = viewport.getBoundingClientRect();
    let left = clientX - rect.left + 15;
    let top = clientY - rect.top + 15;

    if (left + 280 > rect.width) left = rect.width - 290;
    if (top + 210 > rect.height) top = rect.height - 220;
    if (left < 10) left = 10;
    if (top < 10) top = 10;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.display = 'block';
  }

  // Sector hover/clicks
  sectorGroups.forEach(group => {
    group.addEventListener('click', (e) => {
      const sectorKey = group.dataset.sector;
      const data = sectorInfo[sectorKey];
      if (data) showTooltip(data, e.clientX, e.clientY);
    });
  });

  // Hotspot pin clicks
  const pins = viewport.querySelectorAll('.hotspot-pin');
  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const pinType = pin.dataset.pin;
      let sectorKey = 'wheat';
      if (pinType === 'late-blight') sectorKey = 'tomatoes';
      else if (pinType === 'downy-mildew') sectorKey = 'cucumbers';
      else if (pinType === 'early-blight') sectorKey = 'potatoes';
      const data = sectorInfo[sectorKey];
      if (data) showTooltip(data, e.clientX, e.clientY);
    });
  });

  if (tooltipCloseBtn) {
    tooltipCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      tooltip.style.display = 'none';
    });
  }

    viewport.addEventListener('click', (e) => {
      if (!e.target.closest('.sector-group') && !e.target.closest('.hotspot-pin') && !e.target.closest('.map-interactive-tooltip')) {
        if (tooltip) tooltip.style.display = 'none';
      }
    });
  }

  // User Hyperspectral Viewer triggers on /dashboard
  const userViewBtns = document.querySelectorAll('.user-inspect-rx-btn, .user-imagery-view-btn');
  const userModal = document.getElementById('user-viewer-modal');
  const userModalClose = document.getElementById('user-viewer-modal-close');
  userViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (userModal) userModal.style.display = 'flex';
    });
  });
  if (userModalClose && userModal) {
    userModalClose.addEventListener('click', () => {
      userModal.style.display = 'none';
    });
  }
  if (userModal) {
    userModal.addEventListener('click', (e) => {
      if (e.target === userModal) userModal.style.display = 'none';
    });

    const userBandPills = userModal.querySelectorAll('[data-user-band]');
    userBandPills.forEach(pill => {
      pill.addEventListener('click', () => {
        userBandPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const band = pill.dataset.userBand;
        const canvasImg = document.getElementById('user-spectral-canvas-img');
        const hudBand = document.getElementById('user-hud-band-name');
        const activeSpec = document.getElementById('user-active-band-spec');
        if (!canvasImg) return;
        canvasImg.className = `spectral-img band-${band}`;
        if (band === 'rgb') {
          if (hudBand) hudBand.textContent = 'Visible Orthomosaic (RGB)';
          if (activeSpec) activeSpec.textContent = 'Visible Spectrum (400-700nm)';
        } else if (band === 'nir') {
          if (hudBand) hudBand.textContent = 'NIR False Color (Infrared 842nm)';
          if (activeSpec) activeSpec.textContent = 'Near-Infrared Reflectance Layer';
        } else if (band === 'ndvi') {
          if (hudBand) hudBand.textContent = 'NDVI Canopy Vigor Index (0.84 Peak)';
          if (activeSpec) activeSpec.textContent = 'Calibrated Chlorophyll Absorption';
        } else if (band === 'thermal') {
          if (hudBand) hudBand.textContent = 'Thermal IR Canopy Transpiration (24.2°C)';
          if (activeSpec) activeSpec.textContent = 'Long-Wave Infrared (8-14µm)';
        }
      });
    });
  }

  // Dynamic Scan Handlers: Complete Scan & Request New Scan
  const completeScanBtn = document.getElementById('user-complete-scan-btn');
  if (completeScanBtn) {
    completeScanBtn.addEventListener('click', async () => {
      completeScanBtn.disabled = true;
      completeScanBtn.innerHTML = `<span>⏳ Processing Neural Inference...</span>`;

      const activeUser = getCurrentUser();
      const requests = getStoredDemoRequests();
      let req = requests.find(r => 
        (r.email && activeUser.email && r.email.toLowerCase() === activeUser.email.toLowerCase()) ||
        (r.name && activeUser.name && r.name.toLowerCase() === activeUser.name.toLowerCase())
      );

      if (!req) {
        const userCompany = activeUser.company || (activeUser.name ? `${activeUser.name}'s Farm` : 'Independent Farm');
        req = {
          id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
          name: activeUser.name || 'Grower',
          email: activeUser.email || '',
          company: userCompany,
          role: activeUser.role || 'grower',
          district: activeUser.district || 'Bogura',
          cropSector: 'Tomatoes',
          fieldSize: '35 Hectares',
          status: 'Scanning',
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          hyperspectralImages: []
        };
        requests.unshift(req);
      }

      const crop = req.cropSector || 'Tomatoes';
      const defaultImg = crop.toLowerCase().includes('potato') ? '/assets/crop-potato.jpg' : '/assets/crop-tomato.jpg';

      try {
        const cnnOutcome = await predictDroneImageryWithCnn(defaultImg, { crop });
        const newScan = {
          id: `IMG-REQ-${Date.now().toString().slice(-6)}`,
          fileName: `DJI_Matrice350_MicaSense_${crop}_${req.district || 'Bogura'}.tif`,
          fileSize: '48.6 MB',
          dataUrl: defaultImg,
          droneModel: 'DJI Matrice 350 RTK (MicaSense RedEdge-P)',
          bandType: '7-Band Multispectral (RGB + RedEdge + NIR + Thermal)',
          altitudeAGL: '55m AGL',
          gsdResolution: '0.38 cm/px',
          uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          uploadedBy: 'Autonomous Drone Flight System (RTK)',
          agronomistNotes: `Autonomous drone scan over ${crop} canopy completed. CNN model detected foliar chlorosis with ${cnnOutcome.confidence}% confidence.`,
          pathologyAlerts: [cnnOutcome.detectedPathology, `${crop} Canopy Chlorosis ${cnnOutcome.affectedCanopyPct}%`],
          prescriptionAction: cnnOutcome.recommendedTreatment,
          cnnAnalysis: cnnOutcome
        };

        if (!req.hyperspectralImages) req.hyperspectralImages = [];
        req.hyperspectralImages.unshift(newScan);
        req.status = 'Imagery Uploaded';
        saveStoredDemoRequests(requests);

        // Sync to Supabase if configured
        if (isSupabaseConfigured) {
          analyzeDroneImageWithCnn(defaultImg, crop, {
            notes: newScan.agronomistNotes,
            prescription: newScan.prescriptionAction
          }).catch(e => console.warn('Supabase sync notice:', e));
        }

        render();
      } catch (err) {
        console.error('Scan completion error:', err);
        completeScanBtn.disabled = false;
        completeScanBtn.textContent = 'Retry Complete Scan';
      }
    });
  }

  const reqNewScanBtn = document.getElementById('user-request-new-scan-btn');
  if (reqNewScanBtn) {
    reqNewScanBtn.addEventListener('click', () => {
      navigate('/free-demo');
    });
  }

  const startNewScanBtn = document.getElementById('user-start-new-scan-btn');
  const cropScanTomatoBtn = document.getElementById('crop-scan-tomato-btn');
  [startNewScanBtn, cropScanTomatoBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        navigate('/free-demo');
      });
    }
  });

  // Admin User Switcher Events on /dashboard
  const adminUserSelect = document.getElementById('admin-user-select');
  if (adminUserSelect) {
    adminUserSelect.addEventListener('change', (e) => {
      sessionStorage.setItem('phyto_admin_active_user_email', e.target.value);
      render();
    });
  }

  const adminUserChips = document.querySelectorAll('.admin-user-chip-btn');
  adminUserChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const email = chip.dataset.switchUser;
      if (email) {
        sessionStorage.setItem('phyto_admin_active_user_email', email);
        render();
      }
    });
  });

  // Admin Hyperspectral Upload Modal on /dashboard
  const adminUploadBtn = document.getElementById('admin-upload-user-btn');
  const adminQuickUploadBtn = document.getElementById('admin-quick-upload-action');
  const adminQuickSwitchBtn = document.getElementById('admin-quick-switch-action');
  const adminUploadModal = document.getElementById('admin-upload-modal');
  const adminUploadClose = document.getElementById('upload-modal-close');
  const adminUploadCancel = document.getElementById('upload-modal-cancel-btn');

  function openAdminUploadModal() {
    if (adminUploadModal) adminUploadModal.style.display = 'flex';
  }
  function closeAdminUploadModal() {
    if (adminUploadModal) adminUploadModal.style.display = 'none';
  }

  if (adminUploadBtn) adminUploadBtn.addEventListener('click', openAdminUploadModal);
  if (adminQuickUploadBtn) adminQuickUploadBtn.addEventListener('click', openAdminUploadModal);
  if (adminQuickSwitchBtn && adminUserSelect) {
    adminQuickSwitchBtn.addEventListener('click', () => {
      adminUserSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
      adminUserSelect.focus();
    });
  }

  if (adminUploadClose) adminUploadClose.addEventListener('click', closeAdminUploadModal);
  if (adminUploadCancel) adminUploadCancel.addEventListener('click', closeAdminUploadModal);
  if (adminUploadModal) {
    adminUploadModal.addEventListener('click', (e) => {
      if (e.target === adminUploadModal) closeAdminUploadModal();
    });
  }

  // Dropzone handling inside upload modal
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('spectral-file-input');
  const changeFileBtn = document.getElementById('dropzone-change-btn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.id !== 'dropzone-change-btn') {
        fileInput.click();
      }
    });
    if (changeFileBtn) {
      changeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleUploadFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleUploadFile(fileInput.files[0]);
      }
    });
  }

  function handleUploadFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const previewImg = document.getElementById('dropzone-preview-img');
      const previewName = document.getElementById('dropzone-file-name');
      const previewSize = document.getElementById('dropzone-file-size');
      const prompt = document.getElementById('dropzone-prompt');
      const previewWrap = document.getElementById('dropzone-preview');

      if (previewImg) previewImg.src = dataUrl;
      if (previewName) previewName.textContent = file.name;
      if (previewSize) previewSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      const dataUrlInput = document.getElementById('upload-data-url');
      const nameInput = document.getElementById('upload-file-name-val');
      const sizeInput = document.getElementById('upload-file-size-val');

      if (dataUrlInput) dataUrlInput.value = dataUrl;
      if (nameInput) nameInput.value = file.name;
      if (sizeInput) sizeInput.value = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      if (prompt) prompt.style.display = 'none';
      if (previewWrap) previewWrap.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  // 1-Click Drone Preset Buttons
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;
      const modelSelect = document.getElementById('upload-drone-model');
      const bandSelect = document.getElementById('upload-band-type');
      const altInput = document.getElementById('upload-altitude');
      const gsdInput = document.getElementById('upload-gsd');
      const pathInput = document.getElementById('upload-pathology');
      const notesInput = document.getElementById('upload-notes');
      const rxInput = document.getElementById('upload-prescription');
      const dataUrlInput = document.getElementById('upload-data-url');
      const nameInput = document.getElementById('upload-file-name-val');
      const sizeInput = document.getElementById('upload-file-size-val');

      if (preset === 'micasense') {
        if (modelSelect) modelSelect.value = 'DJI Matrice 350 RTK (MicaSense RedEdge-P)';
        if (bandSelect) bandSelect.value = '5-Band Multispectral (RGB + RedEdge + NIR)';
        if (altInput) altInput.value = '65m AGL';
        if (gsdInput) gsdInput.value = '0.38 cm/px';
        if (pathInput) pathInput.value = 'Late Blight (Phytophthora infestans) Detected in Lower Foliage';
        if (notesInput) notesInput.value = 'MicaSense 5-band sensor detected 14% canopy chlorosis and necrotic spots. Cellular reflectance drop confirms fungal spore activity.';
        if (rxInput) rxInput.value = 'Targeted spot application of Copper Oxychloride @ 1.8 L/Ha within 36 hours. Drone spray boundary exported to DJI Agras T40.';
        if (dataUrlInput) dataUrlInput.value = '/assets/crop-tomato.jpg';
        if (nameInput) nameInput.value = 'DJI_Matrice350_MicaSense_RedEdgeP.tif';
        if (sizeInput) sizeInput.value = '48.6 MB';
      } else if (preset === 'mavic3m') {
        if (modelSelect) modelSelect.value = 'DJI Mavic 3 Multispectral';
        if (bandSelect) bandSelect.value = '5-Band Multispectral (RGB + RedEdge + NIR)';
        if (altInput) altInput.value = '50m AGL';
        if (gsdInput) gsdInput.value = '0.42 cm/px';
        if (pathInput) pathInput.value = 'Yellow Rust (Puccinia striiformis) Hotspots Flagged';
        if (notesInput) notesInput.value = 'Mavic 3M multispectral camera identified stripe rust clusters on winter wheat tillers. Early intervention required.';
        if (rxInput) rxInput.value = 'Precision foliar fungicide: Tebuconazole @ 1.0 L/Ha. Waypoint mission loaded into drone.';
        if (dataUrlInput) dataUrlInput.value = '/assets/crop-wheat.jpg';
        if (nameInput) nameInput.value = 'DJI_Mavic3M_Wheat_Orthomosaic.tif';
        if (sizeInput) sizeInput.value = '34.2 MB';
      } else if (preset === 'resonon') {
        if (modelSelect) modelSelect.value = 'DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)';
        if (bandSelect) bandSelect.value = 'Hyperspectral VNIR (400-1000nm)';
        if (altInput) altInput.value = '45m AGL';
        if (gsdInput) gsdInput.value = '0.32 cm/px';
        if (pathInput) pathInput.value = 'Early Blight (Alternaria solani) Target Spot Lesions';
        if (notesInput) notesInput.value = 'Resonon continuous hyperspectral scan revealed narrow-band chlorophyll breakdown and sub-canopy water transpiration deficits.';
        if (rxInput) rxInput.value = 'Mancozeb 75% WP @ 2.5 kg/Ha spot treatment. Re-flight scheduled in 72 hours.';
        if (dataUrlInput) dataUrlInput.value = '/assets/crop-potato.jpg';
        if (nameInput) nameInput.value = 'Resonon_Pika_Continuous_VNIR.tif';
        if (sizeInput) sizeInput.value = '82.4 MB';
      }
    });
  });

  // Handle Upload Form Submit on /dashboard
  const uploadForm = document.getElementById('hyperspectral-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const targetEmail = (document.getElementById('upload-target-email')?.value || '').toLowerCase();
      const targetName = document.getElementById('upload-target-name')?.value || 'Farm Client';
      const droneModel = document.getElementById('upload-drone-model')?.value || 'DJI Matrice 350 RTK';
      const bandType = document.getElementById('upload-band-type')?.value || '5-Band Multispectral';
      const altitudeAGL = document.getElementById('upload-altitude')?.value || '65m AGL';
      const gsdResolution = document.getElementById('upload-gsd')?.value || '0.38 cm/px';
      const pathology = document.getElementById('upload-pathology')?.value || 'Pathology Detected';
      const agronomistNotes = document.getElementById('upload-notes')?.value || '';
      const prescriptionAction = document.getElementById('upload-prescription')?.value || '';
      const dataUrl = document.getElementById('upload-data-url')?.value || '/assets/crop-tomato.jpg';
      const fileName = document.getElementById('upload-file-name-val')?.value || 'orthomosaic.tif';
      const fileSize = document.getElementById('upload-file-size-val')?.value || '45.0 MB';

      const newImage = {
        id: `IMG-${Date.now().toString().slice(-6)}`,
        fileName,
        fileSize,
        dataUrl,
        droneModel,
        bandType,
        altitudeAGL,
        gsdResolution,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        uploadedBy: 'Admin (Lead Photogrammetrist)',
        agronomistNotes,
        pathologyAlerts: [pathology],
        prescriptionAction
      };

      const requests = getStoredDemoRequests();
      let req = requests.find(r => (r.email || '').toLowerCase() === targetEmail);
      if (!req) {
        req = {
          id: `REQ-${Date.now().toString().slice(-6)}`,
          name: targetName,
          email: targetEmail,
          company: `${targetName}'s Farm`,
          role: 'grower',
          district: 'Bogura',
          cropSector: 'Tomatoes',
          fieldSize: '100 Hectares',
          notes: 'Hyperspectral drone scan dataset attached.',
          status: 'Imagery Uploaded',
          submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          hyperspectralImages: []
        };
        requests.unshift(req);
      }

      if (!req.hyperspectralImages) req.hyperspectralImages = [];
      req.hyperspectralImages.unshift(newImage);
      req.status = 'Imagery Uploaded';

      saveStoredDemoRequests(requests);
      closeAdminUploadModal();
      render();
    });
  }
}

function renderAdminUploadModal(targetUser) {
  const user = targetUser || {
    id: 'REQ-2026-081',
    name: 'Ador Chowdhury',
    company: 'Chowdhury Agrotech Farms',
    district: 'Bogura',
    email: 'ador@phytoguard.ai',
    cropSector: 'Tomatoes'
  };

  return `
    <div class="admin-modal-backdrop" id="admin-upload-modal" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title">
      <div class="admin-modal-card upload-modal-card">
        <div class="admin-modal-header">
          <div>
            <span class="modal-eyebrow">COMMERCIAL DRONE PHOTOGRAMMETRY DISPATCH</span>
            <h2 class="modal-title" id="upload-modal-title">Upload Hyperspectral Imagery for ${user.name}</h2>
            <p class="modal-sub">Attaching calibrated aerial dataset to ${user.company || user.name} (${user.district} District &bull; ${user.email})</p>
          </div>
          <button class="modal-close-btn" id="upload-modal-close" type="button" aria-label="Close modal">&times;</button>
        </div>

        <form id="hyperspectral-upload-form" class="modal-form">
          <input type="hidden" id="upload-target-email" value="${user.email}" />
          <input type="hidden" id="upload-target-name" value="${user.name}" />
          <input type="hidden" id="upload-data-url" value="/assets/crop-tomato.jpg" />
          <input type="hidden" id="upload-file-name-val" value="DJI_Matrice350_MicaSense_RedEdgeP.tif" />
          <input type="hidden" id="upload-file-size-val" value="48.6 MB" />

          <!-- Drag and Drop Dropzone -->
          <div class="upload-dropzone" id="upload-dropzone">
            <input type="file" id="spectral-file-input" accept=".tif,.tiff,.png,.jpg,.jpeg,.dat" style="display: none;" />
            <div class="dropzone-prompt" id="dropzone-prompt">
              <div class="dropzone-icon">🛰️</div>
              <p class="dropzone-title">Drag &amp; drop calibrated GeoTIFF, TIFF or PNG dataset</p>
              <span class="dropzone-sub">Supports 5-band MicaSense, Mavic 3M multispectral, or Resonon hyperspectral (up to 250 MB)</span>
              <button type="button" class="button secondary dropzone-browse-btn" id="dropzone-browse-btn">Browse Local Files</button>
            </div>
            <div class="dropzone-preview" id="dropzone-preview" style="display: none;">
              <img id="dropzone-preview-img" src="" alt="Drone orthomosaic preview" />
              <div class="dropzone-file-meta">
                <strong id="dropzone-file-name">orthomosaic.tif</strong>
                <span id="dropzone-file-size">14.2 MB</span>
                <button type="button" class="dropzone-change-btn" id="dropzone-change-btn">Change file</button>
              </div>
            </div>
          </div>

          <!-- 1-Click Preset Commercial Drone Datasets -->
          <div class="preset-section">
            <span class="preset-label">Or select a calibrated commercial drone dataset:</span>
            <div class="preset-buttons-grid">
              <button type="button" class="preset-btn active" data-preset="micasense">
                <span class="preset-icon">🌾</span>
                <span class="preset-name">DJI Matrice 350 RTK</span>
                <span class="preset-spec">MicaSense RedEdge-P 5-Band (0.38 cm/px)</span>
              </button>
              <button type="button" class="preset-btn" data-preset="mavic3m">
                <span class="preset-icon">🍅</span>
                <span class="preset-name">DJI Mavic 3 Multispectral</span>
                <span class="preset-spec">4-Band VNIR + Green (0.42 cm/px)</span>
              </button>
              <button type="button" class="preset-btn" data-preset="resonon">
                <span class="preset-icon">🥔</span>
                <span class="preset-name">Resonon Pika Hyperspectral</span>
                <span class="preset-spec">400-1000nm Continuous (0.32 cm/px)</span>
              </button>
            </div>
          </div>

          <!-- Sensor & Flight Parameters -->
          <div class="modal-form-grid">
            <div class="form-field">
              <label for="upload-drone-model">Commercial Drone Platform</label>
              <select id="upload-drone-model" class="modal-select" required>
                <option value="DJI Matrice 350 RTK (MicaSense RedEdge-P)">DJI Matrice 350 RTK (MicaSense RedEdge-P)</option>
                <option value="DJI Mavic 3 Multispectral">DJI Mavic 3 Multispectral</option>
                <option value="DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)">DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)</option>
                <option value="DJI Agras T40 Multispectral Recon">DJI Agras T40 Multispectral Recon</option>
              </select>
            </div>
            <div class="form-field">
              <label for="upload-band-type">Spectral Band Configuration</label>
              <select id="upload-band-type" class="modal-select" required>
                <option value="5-Band Multispectral (RGB + RedEdge + NIR)">5-Band Multispectral (RGB + RedEdge + NIR)</option>
                <option value="Hyperspectral VNIR (400-1000nm)">Hyperspectral VNIR (400-1000nm Continuous)</option>
                <option value="NDRE / Chlorophyll Absorption Index">NDRE / Chlorophyll Absorption Index</option>
                <option value="Thermal IR Canopy Temperature">Thermal IR Canopy Temperature</option>
              </select>
            </div>
          </div>

          <div class="modal-form-grid">
            <div class="form-field">
              <label for="upload-altitude">Flight Altitude AGL</label>
              <input type="text" id="upload-altitude" class="modal-input" value="65m AGL" required />
            </div>
            <div class="form-field">
              <label for="upload-gsd">Camera GSD Ground Resolution</label>
              <input type="text" id="upload-gsd" class="modal-input" value="0.38 cm/px" required />
            </div>
          </div>

          <!-- Leaf Pathology Diagnostics -->
          <div class="form-field">
            <label for="upload-pathology">Identified Pathologies / Canopy Stress Alerts</label>
            <input type="text" id="upload-pathology" class="modal-input" value="Late Blight (Phytophthora infestans) Detected in Lower Foliage" required />
          </div>

          <div class="form-field">
            <label for="upload-notes">Agronomist Diagnostic Analysis</label>
            <textarea id="upload-notes" class="modal-textarea" rows="3">MicaSense 5-band sensor detected 14% canopy chlorosis and necrotic spots. Cellular reflectance drop confirms fungal spore activity.</textarea>
          </div>

          <div class="form-field">
            <label for="upload-prescription">Agronomic Treatment Prescription Action</label>
            <textarea id="upload-prescription" class="modal-textarea" rows="2">Targeted spot application of Copper Oxychloride @ 1.8 L/Ha within 36 hours. Drone spray boundary exported to DJI Agras T40.</textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="button secondary" id="upload-modal-cancel-btn">Cancel</button>
            <button type="submit" class="button primary" id="upload-modal-submit-btn">
              <span>Attach Dataset to ${user.firstName || user.name} &rarr;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function dashboardPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    navigate('/login');
    return '';
  }

  const activeUser = currentUser;
  const isDemo = isDemoAccount(activeUser);

  // Retrieve user's scan request data
  const requests = getStoredDemoRequests();
  const userReq = requests.find(r => 
    (r.email && activeUser.email && r.email.toLowerCase() === activeUser.email.toLowerCase()) ||
    (r.name && activeUser.name && r.name.toLowerCase() === activeUser.name.toLowerCase())
  );

  const hasCompletedScan = Boolean(userReq && userReq.hyperspectralImages && userReq.hyperspectralImages.length > 0);
  const isScanning = Boolean(userReq && !hasCompletedScan);
  const latestScan = hasCompletedScan ? userReq.hyperspectralImages[0] : null;

  // Calculate dynamic stats for this user
  let kpiAcreage = 450;
  let kpiAcreageUnit = t('dash.kpi.acreageUnit');
  let kpiAcreageSub = t('dash.kpi.acreageSub');
  let kpiMissions = 28;
  let kpiMissionsSub = t('dash.kpi.missionsSub');
  let kpiPathologies = 4;
  let kpiPathologiesSub = t('dash.kpi.pathologiesSub');
  let kpiHealth = '0.82';
  let kpiHealthSub = t('dash.kpi.healthSub');

  if (!isDemo) {
    if (userReq) {
      const matchAcreage = (userReq.fieldSize || '').match(/\d+/);
      kpiAcreage = matchAcreage ? parseInt(matchAcreage[0], 10) : (userReq.acreage ? Number(userReq.acreage) : 35);
      kpiAcreageSub = `${userReq.district || 'Active'} plot registered`;
      kpiMissions = hasCompletedScan ? 1 : (isScanning ? 1 : 0);
      kpiMissionsSub = hasCompletedScan ? 'Sortie completed' : (isScanning ? 'Flight sortie active' : 'Flight pending');
      kpiPathologies = hasCompletedScan && latestScan && latestScan.pathologyAlerts ? latestScan.pathologyAlerts.length : 0;
      kpiPathologiesSub = kpiPathologies > 0 ? 'Requires spot-treatment' : 'Clean & clear';
      kpiHealth = hasCompletedScan ? '0.88' : '--';
      kpiHealthSub = hasCompletedScan ? 'Optimal vigor' : 'Pending aerial scan';
    } else {
      kpiAcreage = 0;
      kpiAcreageSub = getLang() === 'bn' ? 'কোনো জমি নিবন্ধিত নেই' : 'No fields registered yet';
      kpiMissions = 0;
      kpiMissionsSub = getLang() === 'bn' ? 'কোনো ফ্লাইট রেকর্ড নেই' : 'No flight history';
      kpiPathologies = 0;
      kpiPathologiesSub = getLang() === 'bn' ? 'কোনো সক্রিয় অ্যালার্ট নেই' : 'No active alerts';
      kpiHealth = '--';
      kpiHealthSub = getLang() === 'bn' ? 'ফ্লাইটের অপেক্ষায়' : 'Awaiting first flight';
    }
  }

  return `
    <div class="dashboard-page-container">
      <!-- Top Overview Bar -->
      <div class="dash-top-bar">
        <div class="dash-welcome">
          <div class="dash-session-pill">
            <span class="live-dot" aria-hidden="true"></span>
            <span>${t('dash.session')}</span>
          </div>
          <h1 class="dash-greeting">${t('dash.welcome')} <span class="dash-user-highlight">${activeUser.name}</span> 👋</h1>
          <p class="dash-subtitle">${t('dash.subtitle')}</p>
        </div>
        <div class="dash-actions">
          <button class="button secondary dash-export-btn" type="button" onclick="window.print()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>${t('dash.exportReport')}</span>
          </button>
          <a class="button primary dash-flight-btn" href="/free-demo" data-route>
            <span class="dash-taka-symbol" aria-hidden="true">৳</span>
            <span>${getLang() === 'bn' ? '+ ড্রোন মিশন প্ল্যান করুন' : '+ Plan Drone Mission'}</span>
          </a>
        </div>
      </div>

      ${hasCompletedScan ? `
        <!-- Drone Photogrammetry & AI Scanning Complete Notification with 100x100 Result Box -->
        <div class="dash-scan-notification-card is-completed" id="dash-scan-notification-card">
          <div class="scan-notify-left">
            <!-- 100x100 Result Box in a Proper Way -->
            <div class="scan-box-100 is-result user-inspect-rx-btn" id="scan-box-100" role="button" tabindex="0" title="Click to inspect full multispectral orthomosaic (100×100 px specimen)">
              <img class="scan-100-img" src="${latestScan.dataUrl || '/assets/crop-tomato.jpg'}" alt="100x100 Calibrated Result" />
              <div class="scan-100-reticle"></div>
              <div class="scan-100-overlay">
                <span class="scan-100-inspect-pill">
                  <span class="scan-100-inspect-icon">👁️</span>
                  <span>Inspect</span>
                </span>
              </div>
              <span class="scan-100-badge result">100×100</span>
              <div class="scan-100-scrim">
                <div class="scan-100-status-pill ${latestScan.pathologyAlerts && latestScan.pathologyAlerts[0] && latestScan.pathologyAlerts[0].toLowerCase().includes('clean') ? 'healthy' : 'alert'}">
                  <span class="scan-100-dot ${latestScan.pathologyAlerts && latestScan.pathologyAlerts[0] && latestScan.pathologyAlerts[0].toLowerCase().includes('clean') ? 'healthy' : 'alert'}"></span>
                  <span class="scan-100-status-text">${(latestScan.pathologyAlerts && latestScan.pathologyAlerts[0]) ? (latestScan.pathologyAlerts[0].toLowerCase().includes('clean') || latestScan.pathologyAlerts[0].toLowerCase().includes('healthy') ? 'Healthy' : latestScan.pathologyAlerts[0].split('(')[0].trim()) : 'Alert'}</span>
                </div>
              </div>
            </div>

            <div class="scan-notify-text">
              <div class="scan-notify-header-line">
                <span class="scan-notify-tag is-completed">✓ ${t('dash.scanCompleteTag', 'AI DRONE SCANNING COMPLETED')}</span>
                <span class="scan-notify-model-badge">${latestScan.cnnAnalysis?.modelVersion || 'Phyto-CNN (best_model.pt)'}</span>
                <span class="scan-meta-item" style="font-size:0.78rem; color:#4a5c51;">• ${latestScan.uploadedAt || 'Today'}</span>
              </div>
              <h3 class="scan-notify-title">
                ${userReq.cropSector || 'Tomatoes'} Sector • ${t('dash.scanSectorReady', 'Scan Results & Leaf Pathology Diagnosis Ready')}
              </h3>
              <p class="scan-notify-sub">
                <span>📍 ${userReq.district || 'Bogura'} (${userReq.fieldSize || 'Plot 02'})</span>
                <span>• 🛰️ ${latestScan.droneModel}</span>
                <span>• <strong class="scan-pathology-highlight">⚠️ ${latestScan.pathologyAlerts ? latestScan.pathologyAlerts[0] : 'Pathology Alert'}</strong></span>
                ${latestScan.cnnAnalysis && latestScan.cnnAnalysis.confidence ? `<span class="scan-confidence-pill">🎯 ${latestScan.cnnAnalysis.confidence}% Model Confidence</span>` : '<span class="scan-confidence-pill">🎯 98.4% Model Confidence</span>'}
              </p>
            </div>
          </div>

          <div class="scan-notify-actions">
            <button class="button primary scan-inspect-btn user-inspect-rx-btn" type="button" id="user-open-rx-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>${t('dash.inspectRxBtn', 'Inspect Rx & Diagnostics')}</span>
            </button>
          </div>
        </div>
      ` : isScanning ? `
        <!-- Autonomous Drone Scanning In Progress Notification with 100x100 Live Radar Box -->
        <div class="dash-scan-notification-card is-scanning" id="dash-scan-notification-card">
          <div class="scan-notify-left">
            <!-- 100x100 Animated Radar Scanning Box -->
            <div class="scan-box-100 is-scanning" id="scan-box-100" title="Autonomous Drone Radar Telemetry Viewfinder">
              <div class="scan-100-radar-grid">
                <div class="scan-100-radar-ring ring-1"></div>
                <div class="scan-100-radar-ring ring-2"></div>
                <div class="scan-100-radar-crosshair"></div>
                <div class="scan-100-radar-sweep"></div>
              </div>
              <div class="scan-100-center-icon">🚁</div>
              <span class="scan-100-badge scanning">100×100 • RTK</span>
              <div class="scan-100-scrim">
                <div class="scan-100-status-pill scanning">
                  <span class="scan-100-dot scanning"></span>
                  <span class="scan-100-status-text">SCANNING</span>
                </div>
              </div>
            </div>

            <div class="scan-notify-text">
              <div class="scan-notify-header-line">
                <span class="scan-notify-tag is-scanning">
                  <span class="pulse-beacon"></span>
                  ${t('dash.scanningActiveTag', 'AUTONOMOUS DRONE SCAN IN PROGRESS')}
                </span>
                <span class="scan-notify-model-badge">DJI Matrice 350 RTK</span>
                <span class="scan-meta-item" style="font-size:0.78rem; color:#4a5c51;">• 55m AGL • 0.38 cm/px</span>
              </div>
              <h3 class="scan-notify-title">
                ${userReq.cropSector || 'Tomatoes'} Sector • ${t('dash.scanningInProgress', 'Aerial Grid Flight & Multispectral Sensor Active')}
              </h3>
              <p class="scan-notify-sub">
                <span>📍 ${userReq.district || 'Bogura'} (${userReq.fieldSize || 'Plot 02'})</span>
                <span>• 🛰️ Capturing 7-band hyperspectral layers (RGB, NIR, RedEdge, Thermal)</span>
                <span>• <strong class="scan-scanning-highlight">⏳ Running Phyto-CNN neural analysis...</strong></span>
              </p>
              <div class="scan-telemetry-progress-wrap">
                <div class="scan-telemetry-progress-bar">
                  <div class="scan-telemetry-progress-fill"></div>
                </div>
                <span class="scan-telemetry-status-txt">Acquiring high-resolution foliar frames • 100×100 px specimen sampling</span>
              </div>
            </div>
          </div>

          <div class="scan-notify-actions">
            <button class="button primary complete-scan-btn" type="button" id="user-complete-scan-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span>${t('dash.completeScanBtn', 'Complete Scan & Process Results')}</span>
            </button>
          </div>
        </div>
      ` : `
        <!-- Standby State: No Scan Requested Yet -->
        <div class="dash-scan-notification-card is-idle" id="dash-scan-notification-card">
          <div class="scan-notify-left">
            <div class="scan-box-100 is-idle" id="scan-box-100" title="${isDemo ? 'Launch Autonomous Drone Aerial Scan' : 'Schedule Your First Aerial Scan'}">
              <div class="scan-100-center-icon">🚁</div>
              <span class="scan-100-badge idle">100×100</span>
              <div class="scan-100-scrim">
                <div class="scan-100-status-pill idle">
                  <span class="scan-100-dot idle"></span>
                  <span class="scan-100-status-text">STANDBY</span>
                </div>
              </div>
            </div>
            <div class="scan-notify-text">
              <div class="scan-notify-header-line">
                <span class="scan-notify-tag is-idle">🛰️ ${isDemo ? t('dash.standbyTag', 'AUTONOMOUS DRONE SCOUTING') : (getLang() === 'bn' ? 'স্বাগতম • নতুন ড্রোন মিশন' : 'GETTING STARTED • AUTONOMOUS SCOUTING')}</span>
                <span class="scan-notify-model-badge">RTK Centimeter Grid</span>
              </div>
              <h3 class="scan-notify-title">
                ${isDemo 
                  ? t('dash.standbyTitle', 'Launch Autonomous Drone Aerial Scan') 
                  : (getLang() === 'bn' ? `স্বাগতম, ${activeUser.firstName || activeUser.name}! আপনার প্রথম ড্রোন মিশন প্ল্যান করুন` : `Welcome to PhytoGuard AI, ${activeUser.firstName || activeUser.name}!`)}
              </h3>
              <p class="scan-notify-sub">
                <span>${isDemo 
                  ? t('dash.standbySub', 'Schedule an autonomous RTK photogrammetry flight to capture 7-band canopy imagery and run leaf pathology diagnostics.')
                  : (getLang() === 'bn' ? 'আপনার ফসলের জমিতে ৭-ব্যান্ড হাইপারস্পেকট্রাল ড্রোন স্ক্যান ও এআই রোগ নির্ণয় শুরু করতে মিশন রিকোয়েস্ট করুন।' : 'Schedule an autonomous RTK photogrammetry flight to capture 7-band canopy imagery and run real-time leaf pathology diagnostics on your crops.')}</span>
              </p>
            </div>
          </div>
          <div class="scan-notify-actions">
            <button class="button primary scan-inspect-btn" type="button" id="user-start-new-scan-btn">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              <span>${isDemo ? t('dash.requestScanBtn', 'Request Drone Scan') : (getLang() === 'bn' ? 'ড্রোন স্ক্যান শুরু করুন' : 'Request First Drone Scan')}</span>
            </button>
          </div>
        </div>
      `}

      <!-- Metric KPI Cards -->
      <div class="dash-metrics-grid">
        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-green-light">
            <span class="metric-emoji">🌾</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">${t('dash.kpi.acreage')}</span>
            <strong class="metric-value">${formatNumber(kpiAcreage)} <span class="metric-unit">${kpiAcreageUnit}</span></strong>
            <span class="metric-sub text-green">${kpiAcreageSub}</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-blue-light">
            <span class="metric-emoji">🚁</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">${t('dash.kpi.missions')}</span>
            <strong class="metric-value">${formatNumber(kpiMissions)} <span class="metric-unit">${t('dash.kpi.missionsUnit')}</span></strong>
            <span class="metric-sub text-blue">${kpiMissionsSub}</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-amber-light">
            <span class="metric-emoji">🦠</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">${t('dash.kpi.pathologies')}</span>
            <strong class="metric-value">${formatNumber(kpiPathologies)} <span class="metric-unit">${t('dash.kpi.pathologiesUnit')}</span></strong>
            <span class="metric-sub text-amber">${kpiPathologiesSub}</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-emerald-light">
            <span class="metric-emoji">📈</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">${t('dash.kpi.health')}</span>
            <strong class="metric-value">${kpiHealth === '--' ? '--' : `${formatNumber(Number(kpiHealth))} <span class="metric-unit">${t('dash.kpi.healthUnit')}</span>`}</strong>
            <span class="metric-sub text-green">${kpiHealthSub}</span>
          </div>
        </div>
      </div>

      <!-- 16:9 Drone Coverage Heatmap -->
      ${droneCoverageHeatmap(isDemo, userReq, hasCompletedScan, latestScan)}

      <!-- Main Dashboard Content Grid -->
      <div class="dash-content-grid">
        <!-- Monitored Crop Fields (6 Crops) -->
        <div class="dash-panel fields-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">${t('dash.sectors.heading')}</h2>
              <p class="panel-sub">${t('dash.sectors.subheading')}</p>
            </div>
            <a class="panel-link" href="/crops" data-route>${t('dash.sectors.viewAll')}</a>
          </div>

          <div class="dash-fields-list">
            ${isDemo ? `
              <div class="dash-field-row">
                <div class="field-crop-icon">🌾</div>
                <div class="field-meta">
                  <strong>Wheat — Sector North</strong>
                  <span>75 Ha • Flight: Today 08:30 AM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge warn">Yellow Rust</span>
                  <span class="pathology-type">Fungal • 2 hotspots</span>
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill" style="width: 86%;"></div></div>
                  <span>86%</span>
                </div>
              </div>

              <div class="dash-field-row">
                <div class="field-crop-icon">🍅</div>
                <div class="field-meta">
                  <strong>Tomatoes — Block B (Processing)</strong>
                  <span>40 Ha • Flight: Today 09:15 AM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge danger">Late Blight</span>
                  <span class="pathology-type">Fungal • Leaf scan verified</span>
                  ${hasCompletedScan ? '<button class="field-rx-btn user-inspect-rx-btn" type="button">👁️ Inspect Rx</button>' : isScanning ? `<span class="field-scan-status scanning"><span class="pulse-beacon"></span> ${getLang() === 'bn' ? 'স্ক্যান চলছে...' : 'Scanning...'}</span>` : `<button class="field-rx-btn" type="button" id="crop-scan-tomato-btn">🚁 ${getLang() === 'bn' ? 'স্ক্যান করুন' : 'Scan Sector'}</button>`}
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill bg-amber" style="width: 78%;"></div></div>
                  <span>78%</span>
                </div>
              </div>

              <div class="dash-field-row">
                <div class="field-crop-icon">🫘</div>
                <div class="field-meta">
                  <strong>Soybeans — River Basin</strong>
                  <span>120 Ha • Flight: Yesterday 04:00 PM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge ok">Clean</span>
                  <span class="pathology-type">No Rust / SDS detected</span>
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill" style="width: 95%;"></div></div>
                  <span>95%</span>
                </div>
              </div>

              <div class="dash-field-row">
                <div class="field-crop-icon">🥒</div>
                <div class="field-meta">
                  <strong>Cucumbers — Greenhouse 2</strong>
                  <span>25 Ha • Flight: Today 07:00 AM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge warn">Downy Mildew</span>
                  <span class="pathology-type">Fungal • Humidity alert</span>
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill bg-amber" style="width: 81%;"></div></div>
                  <span>81%</span>
                </div>
              </div>

              <div class="dash-field-row">
                <div class="field-crop-icon">🥔</div>
                <div class="field-meta">
                  <strong>Potatoes — Ridge Plot 04</strong>
                  <span>90 Ha • Flight: Today 10:30 AM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge warn">Early Blight</span>
                  <span class="pathology-type">Fungal • Targeted spray map exported</span>
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill" style="width: 84%;"></div></div>
                  <span>84%</span>
                </div>
              </div>

              <div class="dash-field-row">
                <div class="field-crop-icon">🍇</div>
                <div class="field-meta">
                  <strong>Grapevines — Hillside Vineyard</strong>
                  <span>100 Ha • Flight: Today 11:45 AM</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge ok">Healthy</span>
                  <span class="pathology-type">Canopy vigor optimal</span>
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill" style="width: 93%;"></div></div>
                  <span>93%</span>
                </div>
              </div>
            ` : userReq ? `
              <div class="dash-field-row">
                <div class="field-crop-icon">${userReq.cropSector === 'Wheat' ? '🌾' : userReq.cropSector === 'Potatoes' ? '🥔' : '🍅'}</div>
                <div class="field-meta">
                  <strong>${userReq.cropSector || 'Tomatoes'} — ${userReq.company || userReq.district || 'Plot 01'}</strong>
                  <span>${userReq.fieldSize || '35 Hectares'} • ${userReq.district || 'Field'} • ${userReq.status || 'Pending Review'}</span>
                </div>
                <div class="field-pathology">
                  <span class="pathology-badge ${hasCompletedScan ? 'danger' : isScanning ? 'warn' : 'ok'}">${hasCompletedScan ? (latestScan?.pathologyAlerts?.[0] || 'Verified') : isScanning ? 'Scanning' : (userReq.status || 'Registered')}</span>
                  <span class="pathology-type">${hasCompletedScan ? 'AI Diagnosis Ready' : isScanning ? 'Flight Sortie Active' : 'Flight Sortie Scheduled'}</span>
                  ${hasCompletedScan ? '<button class="field-rx-btn user-inspect-rx-btn" type="button">👁️ Inspect Rx</button>' : isScanning ? `<span class="field-scan-status scanning"><span class="pulse-beacon"></span> ${getLang() === 'bn' ? 'স্ক্যান চলছে...' : 'Scanning...'}</span>` : `<button class="field-rx-btn" type="button" id="crop-scan-tomato-btn">🚁 ${getLang() === 'bn' ? 'স্ক্যান করুন' : 'Scan Sector'}</button>`}
                </div>
                <div class="field-health">
                  <div class="health-bar"><div class="health-fill ${hasCompletedScan ? 'bg-amber' : ''}" style="width: ${hasCompletedScan ? '78%' : '100%'};"></div></div>
                  <span>${hasCompletedScan ? '78%' : '100%'}</span>
                </div>
              </div>
            ` : `
              <div class="dash-empty-state-card">
                <div class="dash-empty-icon">🌱</div>
                <h3 class="dash-empty-title">${getLang() === 'bn' ? 'কোনো ফসল সেক্টর নিবন্ধিত নেই' : 'No Monitored Crop Sectors Yet'}</h3>
                <p class="dash-empty-desc">
                  ${getLang() === 'bn' 
                    ? 'আপনার প্লট বা ফসলের জমি যুক্ত করুন অথবা ড্রোন ফ্লাইটের মাধ্যমে রিয়েল-টাইম রোগ পর্যবেক্ষণ ও স্বাস্থ্য বিশ্লেষণ শুরু করুন।' 
                    : 'Register your crop fields or schedule an aerial scan to monitor leaf diseases, canopy vigor, and drone flight schedules in real time.'}
                </p>
                <div class="dash-empty-actions">
                  <a class="dash-empty-btn" href="/free-demo" data-route>
                    <span>+</span>
                    <span>${getLang() === 'bn' ? 'ফসল সেক্টর যুক্ত / ড্রোন স্ক্যান করুন' : 'Register Crop / Plan Drone Mission'}</span>
                  </a>
                </div>
              </div>
            `}
          </div>
        </div>

        <!-- Right Side: Drone Fleet & Recent Operations (Exact Original) -->
        <div class="dash-sidebar">
          <!-- Drone Hardware Status -->
          <div class="dash-panel drone-panel">
            <div class="panel-header">
              <h2 class="panel-title">${getLang() === 'bn' ? 'ড্রোন ফ্লিট স্ট্যাটাস' : 'Drone Fleet Status'}</h2>
              <span class="status-live-chip" ${!isDemo ? 'style="background:#e2e8f0; color:#475569; border-color:#cbd5e1;"' : ''}>${isDemo ? '2 Drones Online' : (getLang() === 'bn' ? '০টি সক্রিয় ড্রোন' : '0 Drones Active')}</span>
            </div>
            ${isDemo ? `
              <div class="drone-card">
                <div class="drone-card-head">
                  <span class="drone-name">DJI Matrice 350 RTK</span>
                  <span class="drone-pill active">In-Flight</span>
                </div>
                <p class="drone-sub">Mission: Autonomous Orthophoto Mapping (Sector North)</p>
                <div class="drone-stats-row">
                  <div><span>Altitude:</span> <strong>65m AGL</strong></div>
                  <div><span>Battery:</span> <strong>84%</strong></div>
                  <div><span>Sensor:</span> <strong>5-Band RGB+NIR</strong></div>
                </div>
              </div>
              <div class="drone-card">
                <div class="drone-card-head">
                  <span class="drone-name">DJI Mavic 3 Enterprise</span>
                  <span class="drone-pill standby">Standby</span>
                </div>
                <p class="drone-sub">Ready for targeted waypoint spot-scouting</p>
                <div class="drone-stats-row">
                  <div><span>GPS Fix:</span> <strong>RTK Fixed (1.2cm)</strong></div>
                  <div><span>Battery:</span> <strong>100%</strong></div>
                  <div><span>Payload:</span> <strong>4K Mechanical</strong></div>
                </div>
              </div>
            ` : `
              <div class="dash-fleet-empty-card">
                <div class="dash-fleet-empty-icon">🛸</div>
                <h3 class="dash-fleet-empty-title">${getLang() === 'bn' ? 'কোনো ড্রোন সংযুক্ত নেই' : 'No Drone Assigned Yet'}</h3>
                <p class="dash-fleet-empty-desc">
                  ${getLang() === 'bn' 
                    ? 'আপনার জমির জন্য বর্তমানে কোনো স্বায়ত্তশাসিত ড্রোন নির্ধারিত নেই। ফ্লাইট বুক করলে রিয়েল-টাইম জিপিএস ও টেলিমেট্রি এখানে দেখতে পাবেন।' 
                    : 'No autonomous drone is currently deployed for your fields. Once you schedule a mission or link hardware, telemetry will stream here in real time.'}
                </p>
                <a class="dash-empty-btn-subtle" href="/free-demo" data-route style="margin-top: 4px;">
                  <span>${getLang() === 'bn' ? 'ড্রোন ফ্লাইট বুক করুন' : 'Book Autonomous Drone'}</span>
                </a>
              </div>
            `}
          </div>

          <!-- Quick Actions -->
          <div class="dash-panel actions-panel">
            <h2 class="panel-title">Scouting Operations</h2>
            <div class="dash-quick-links">
              <a class="dash-quick-btn" href="/how-it-works" data-route>
                <span class="quick-btn-icon">⚡</span>
                <div>
                  <strong>View Flight Workflows</strong>
                  <span>Flight planning, autonomous scan &amp; cloud AI</span>
                </div>
              </a>
              <a class="dash-quick-btn" href="/crops" data-route>
                <span class="quick-btn-icon">🌿</span>
                <div>
                  <strong>Disease Pathology Catalog</strong>
                  <span>Review fungal, bacterial, and viral detections</span>
                </div>
              </a>
              <a class="dash-quick-btn" href="/free-demo" data-route>
                <span class="quick-btn-icon">📍</span>
                <div>
                  <strong>Request Field Agronomist Visit</strong>
                  <span>Schedule on-site drone flight demonstration</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      ${hasCompletedScan ? `
        <!-- Grower Multi-Band Hyperspectral & Rx Diagnostics Modal -->
        <div id="user-viewer-modal" class="admin-modal" style="display: none;" role="dialog" aria-labelledby="user-viewer-title" aria-modal="true">
          <div class="viewer-modal-card">
            <div class="viewer-modal-header">
              <div>
                <div class="viewer-tag-row">
                  <span class="live-dot" aria-hidden="true"></span>
                  <span class="viewer-tag">${t('dash.scanNoticeModalTitle', 'DRONE SPECTRAL ANALYSIS • GROWER REPORT')}</span>
                  <span class="band-meta-badge" id="user-viewer-model-badge">${latestScan.cnnAnalysis?.modelVersion || 'Phyto-CNN: best_model.pt'}</span>
                </div>
                <h3 class="viewer-modal-title" id="user-viewer-title">
                  ${userReq.name} &bull; ${userReq.cropSector || 'Crop'} Sector &bull; ${userReq.district}
                </h3>
                <p class="viewer-modal-meta" id="user-viewer-meta">
                  ${latestScan.droneModel} &bull; ${latestScan.altitudeAGL} &bull; ${latestScan.gsdResolution} GSD &bull; ${latestScan.uploadedAt || 'Today'}
                </p>
              </div>
              <button class="modal-close-btn" type="button" id="user-viewer-modal-close" aria-label="Close modal">&times;</button>
            </div>
            
            <div class="viewer-body">
              <!-- Spectral Band Navigation Toolbar -->
              <div class="spectral-band-toolbar">
                <span class="band-toolbar-label">Spectral Layer:</span>
                <div class="band-pills" role="tablist">
                  <button type="button" class="band-pill-btn active" data-user-band="rgb" role="tab">
                    <span>🌿 RGB True Color</span>
                  </button>
                  <button type="button" class="band-pill-btn" data-user-band="nir" role="tab">
                    <span>🔴 NIR False Color</span>
                  </button>
                  <button type="button" class="band-pill-btn" data-user-band="ndvi" role="tab">
                    <span>🟢 NDVI Canopy Health</span>
                  </button>
                  <button type="button" class="band-pill-btn" data-user-band="thermal" role="tab">
                    <span>🔥 Thermal Stress</span>
                  </button>
                </div>
                <div class="band-meta-badge" id="user-active-band-spec">Visible Orthomosaic (400-700nm)</div>
              </div>

              <!-- Imagery Display Canvas -->
              <div class="spectral-canvas-wrap">
                <div class="canvas-viewport">
                  <img id="user-spectral-canvas-img" class="spectral-img band-rgb" src="${latestScan.dataUrl || '/assets/generated-field-hero.png'}" alt="Hyperspectral Orthomosaic" />
                  <div class="spectral-hud-overlay">
                    <span class="hud-tag">RTK Centimeter Accuracy: &plusmn;1.2cm Fixed</span>
                    <span class="hud-tag" id="user-hud-band-name">Visible Orthomosaic (RGB)</span>
                  </div>
                </div>
              </div>

              <!-- Agronomist Diagnostic Findings & Prescription -->
              <div class="viewer-report-grid">
                <div class="report-col">
                  <div class="modal-roi-header-wrap">
                    <div class="modal-roi-100box" title="100×100 px High-Resolution Calibrated Leaf Pathology Specimen (Sub-millimeter GSD)">
                      <img src="${latestScan.dataUrl || '/assets/crop-tomato.jpg'}" alt="100x100 Calibrated Specimen ROI" class="modal-roi-100img" />
                      <span class="roi-100-badge">100×100 ROI</span>
                      <div class="roi-100-crosshair"></div>
                    </div>
                    <div class="modal-roi-details">
                      <h4 class="report-heading" style="margin: 0 0 6px;">Identified Leaf Pathologies</h4>
                      <div class="pathology-pills-wrap" id="user-viewer-pathologies">
                        ${(latestScan.pathologyAlerts || ['Late Blight Detected']).map(alert => `
                          <span class="pathology-chip alert">⚠️ ${alert}</span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                  <h4 class="report-heading" style="margin-top: 14px;">Diagnostic Analysis &amp; AI Provenance</h4>
                  <p class="report-text" id="user-viewer-notes">
                    ${latestScan.agronomistNotes || 'Multi-spectral sensor analysis completed with sub-millimeter leaf resolution.'}
                  </p>
                </div>
                <div class="report-col">
                  <h4 class="report-heading">Agronomic Prescription Action (Rx)</h4>
                  <div class="prescription-box" id="user-viewer-prescription">
                    ${latestScan.prescriptionAction || 'Precision variable-rate treatment prescription pending.'}
                  </div>
                  <div class="viewer-download-row">
                    <a id="user-viewer-download-btn" class="button secondary download-btn" href="${latestScan.dataUrl || '#'}" download="PhytoGuard_Hyperspectral_Orthomosaic.png">
                      <span>📥 Download Calibrated Orthomosaic</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

const bdDistricts = [
  'Bagerhat', 'Bandarban', 'Barguna', 'Barishal', 'Bhola', 'Bogura', 'Brahmanbaria', 
  'Chandpur', 'Chapainawabganj', 'Chattogram', 'Chuadanga', "Cox's Bazar", 'Cumilla', 'Dhaka', 'Dinajpur', 
  'Faridpur', 'Feni', 'Gaibandha', 'Gazipur', 'Gopalganj', 'Habiganj', 'Jamalpur', 
  'Jashore', 'Jhalokati', 'Jhenaidah', 'Joypurhat', 'Khagrachhari', 'Khulna', 
  'Kishoreganj', 'Kurigram', 'Kushtia', 'Lakshmipur', 'Lalmonirhat', 'Madaripur', 
  'Magura', 'Manikganj', 'Meherpur', 'Moulvibazar', 'Munshiganj', 'Mymensingh', 
  'Naogaon', 'Narail', 'Narayanganj', 'Narsingdi', 'Natore', 'Netrokona', 
  'Nilphamari', 'Noakhali', 'Pabna', 'Panchagarh', 'Patuakhali', 'Pirojpur', 
  'Rajbari', 'Rajshahi', 'Rangamati', 'Rangpur', 'Satkhira', 'Shariatpur', 
  'Sherpur', 'Sirajganj', 'Sunamganj', 'Sylhet', 'Tangail', 'Thakurgaon'
];

// Handle demo request submission from /free-demo
function handleDemoRequestSubmit(form) {
  if (!form) return;
  const name = (form.querySelector('#demo-name') || {}).value?.trim() || 'Grower Applicant';
  const email = (form.querySelector('#demo-email') || {}).value?.trim() || 'farmer@agro.bd';
  const company = (form.querySelector('#demo-company') || {}).value?.trim() || 'Independent Farm';
  const roleSelect = form.querySelector('#demo-role');
  const role = roleSelect ? roleSelect.value : 'grower';
  const districtSelect = form.querySelector('#demo-district');
  const district = districtSelect ? districtSelect.value : 'Bogura';
  const notes = (form.querySelector('#demo-notes') || {}).value?.trim() || 'Commercial drone scouting trial requested.';

  const newReq = {
    id: `REQ-2026-${Math.floor(100 + Math.random() * 900)}`,
    name,
    email,
    company,
    role,
    district,
    cropSector: 'Tomatoes',
    fieldSize: '35 Hectares',
    notes,
    status: 'Pending Review',
    submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    hyperspectralImages: []
  };

  const requests = getStoredDemoRequests();
  requests.unshift(newReq);
  saveStoredDemoRequests(requests);

  // Sync to Supabase demo_requests table
  if (isSupabaseConfigured) {
    createDemoRequestInSupabase(newReq).catch(err => {
      console.warn('Notice: Supabase demo_requests insert sync error:', err);
    });
  }

  form.classList.add('is-submitted');
}
window.handleDemoRequestSubmit = handleDemoRequestSubmit;

function renderAdminRequestRows(requests) {
  if (!requests || requests.length === 0) {
    return `
      <tr class="admin-empty-row">
        <td colspan="7" class="text-center">${getLang() === 'bn' ? 'আপনার ফিল্টারের সাথে মিলে এমন কোনো অনুরোধ পাওয়া যায়নি।' : 'No demo requests found matching your filter criteria.'}</td>
      </tr>
    `;
  }

  return requests.map(req => {
    const isPending = req.status === 'Pending Review' || !req.status;
    const isApproved = req.status === 'Approved' || req.status === 'Flight Scheduled';
    const isUploaded = req.status === 'Imagery Uploaded' || req.status === 'Completed' || (req.hyperspectralImages && req.hyperspectralImages.length > 0);
    const hasImages = req.hyperspectralImages && req.hyperspectralImages.length > 0;

    const statusClass = 
      isUploaded ? 'status-uploaded' :
      isApproved ? 'status-approved' : 'status-pending';

    const displayStatus = 
      isPending ? t('admin.status.pending') :
      isApproved ? t('admin.status.approved') :
      isUploaded ? t('admin.status.uploaded') : req.status;

    return `
      <tr class="admin-req-row" data-id="${req.id}" data-status="${req.status}">
        <td class="req-cell-id">
          <span class="req-id-badge">${req.id}</span>
          <span class="req-date">${req.submittedAt}</span>
        </td>
        <td class="req-cell-user">
          <strong class="req-user-name">${req.name}</strong>
          <span class="req-user-email">${req.email}</span>
          <span class="req-user-company">${req.company || (getLang() === 'bn' ? 'স্বতন্ত্র খামার' : 'Independent Farm')} &bull; <em>${req.role || (getLang() === 'bn' ? 'চাষী' : 'Grower')}</em></span>
        </td>
        <td class="req-cell-loc">
          <strong class="req-district">📍 ${req.district}</strong>
          <span class="req-field-size">${req.fieldSize || '30 Ha'}</span>
        </td>
        <td class="req-cell-crop">
          <span class="req-crop-pill">${req.cropSector || (getLang() === 'bn' ? 'মিশ্র ফসল' : 'Mixed Crops')}</span>
        </td>
        <td class="req-cell-status">
          <span class="admin-status-badge ${statusClass}">
            <span class="status-dot"></span>
            ${displayStatus}
          </span>
        </td>
        <td class="req-cell-data">
          ${hasImages ? `
            <div class="data-ready-wrap">
              <span class="data-badge ready">✓ ${formatNumber(req.hyperspectralImages.length)} ${getLang() === 'bn' ? 'টি ডেটাসেট প্রস্তুত' : 'Dataset Ready'}</span>
              <span class="data-sensor-sub">${req.hyperspectralImages[0].droneModel.split('(')[0].trim()}</span>
            </div>
          ` : isApproved ? `
            <span class="data-badge approved-wait">${t('admin.spectral.ready')}</span>
          ` : `
            <span class="data-badge empty">${t('admin.spectral.awaiting')}</span>
          `}
        </td>
        <td class="req-cell-actions text-right">
          <div class="admin-actions-group">
            ${isPending ? `
              <button class="admin-btn approve btn-approve-request" type="button" data-req-id="${req.id}" title="${t('admin.btn.approve')}">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>${t('admin.btn.approve')}</span>
              </button>
            ` : ''}

            ${isApproved ? `
              <button class="admin-btn primary btn-upload-spectral" type="button" data-req-id="${req.id}" title="${t('admin.btn.upload')}">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                <span>${t('admin.btn.upload')}</span>
              </button>
            ` : ''}

            ${isUploaded ? `
              <button class="admin-btn secondary btn-inspect-spectral" type="button" data-req-id="${req.id}" title="${t('admin.btn.inspect')}">
                <span>👁️ ${t('admin.btn.inspect')}</span>
              </button>
              <button class="admin-btn secondary btn-upload-spectral" type="button" data-req-id="${req.id}" title="${t('admin.btn.reupload')}">
                <span>🔄 ${t('admin.btn.reupload')}</span>
              </button>
            ` : ''}

            <button class="admin-btn-delete" type="button" data-req-id="${req.id}" title="Delete Request" aria-label="Delete Request">&times;</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function adminDashboardPage() {
  const requests = getStoredDemoRequests();
  const pendingCount = requests.filter(r => r.status === 'Pending Review' || !r.status).length;
  const approvedCount = requests.filter(r => r.status === 'Approved' || r.status === 'Flight Scheduled').length;
  const uploadedCount = requests.filter(r => r.hyperspectralImages && r.hyperspectralImages.length > 0).length;

  return `
    <div class="admin-dashboard-container">
      <!-- Admin Top Command Bar -->
      <div class="admin-top-bar">
        <div class="admin-welcome">
          <div class="admin-session-pill">
            <span class="live-dot" aria-hidden="true"></span>
            <span>${t('admin.badge')}</span>
          </div>
          <h1 class="admin-title">${t('admin.heading')} <span class="dash-user-highlight">${t('admin.headingAccent')}</span></h1>
          <p class="admin-subtitle">
            ${t('admin.subheading')}
          </p>
        </div>
      </div>

      <!-- KPI Metrics Ribbon (Golden Ratio) -->
      <div class="admin-metrics-grid">
        <div class="admin-metric-card">
          <div class="admin-metric-icon bg-green-light">📋</div>
          <div class="admin-metric-info">
            <span class="admin-metric-value" id="metric-total-val">${formatNumber(requests.length)}</span>
            <span class="admin-metric-label">${t('admin.kpi.total')}</span>
            <span class="admin-metric-sub">${t('admin.kpi.totalSub')}</span>
          </div>
        </div>
        <div class="admin-metric-card">
          <div class="admin-metric-icon bg-amber-light">⏳</div>
          <div class="admin-metric-info">
            <span class="admin-metric-value" id="metric-pending-val">${formatNumber(pendingCount)}</span>
            <span class="admin-metric-label">${t('admin.kpi.pending')}</span>
            <span class="admin-metric-sub">${t('admin.kpi.pendingSub')}</span>
          </div>
        </div>
        <div class="admin-metric-card">
          <div class="admin-metric-icon bg-blue-light">✅</div>
          <div class="admin-metric-info">
            <span class="admin-metric-value" id="metric-approved-val">${formatNumber(approvedCount)}</span>
            <span class="admin-metric-label">${t('admin.kpi.approved')}</span>
            <span class="admin-metric-sub">${t('admin.kpi.approvedSub')}</span>
          </div>
        </div>
        <div class="admin-metric-card">
          <div class="admin-metric-icon bg-emerald-light">🛰️</div>
          <div class="admin-metric-info">
            <span class="admin-metric-value" id="metric-uploaded-val">${formatNumber(uploadedCount)}</span>
            <span class="admin-metric-label">${t('admin.kpi.uploaded')}</span>
            <span class="admin-metric-sub">${t('admin.kpi.uploadedSub')}</span>
          </div>
        </div>
      </div>

      <!-- Demo Requests Table Panel -->
      <div class="admin-table-panel">
        <div class="admin-table-header">
          <div class="admin-filter-tabs">
            <button class="admin-tab-btn active" data-filter="all" type="button">
              ${t('admin.tab.all')} <span class="tab-badge" id="badge-all">${formatNumber(requests.length)}</span>
            </button>
            <button class="admin-tab-btn" data-filter="Pending Review" type="button">
              ${t('admin.tab.pending')} <span class="tab-badge" id="badge-pending">${formatNumber(pendingCount)}</span>
            </button>
            <button class="admin-tab-btn" data-filter="Approved" type="button">
              ${t('admin.tab.approved')} <span class="tab-badge" id="badge-approved">${formatNumber(approvedCount)}</span>
            </button>
            <button class="admin-tab-btn" data-filter="Imagery Uploaded" type="button">
              ${t('admin.tab.uploaded')} <span class="tab-badge" id="badge-uploaded">${formatNumber(uploadedCount)}</span>
            </button>
          </div>
          <div class="admin-search-wrap">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" id="admin-search-input" class="admin-search-input" placeholder="${t('admin.searchPlaceholder')}" aria-label="Search requests" />
          </div>
        </div>

        <div class="admin-table-scroll">
          <table class="admin-requests-table">
            <thead>
              <tr>
                <th>${t('admin.th.id')}</th>
                <th>${t('admin.th.user')}</th>
                <th>${t('admin.th.district')}</th>
                <th>${t('admin.th.crop')}</th>
                <th>${t('admin.th.status')}</th>
                <th>${t('admin.th.spectral')}</th>
                <th class="text-right">${t('admin.th.actions')}</th>
              </tr>
            </thead>
            <tbody id="admin-requests-tbody">
              ${renderAdminRequestRows(requests)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Upload Hyperspectral Modal -->
      <div class="admin-modal-backdrop" id="admin-upload-modal" style="display: none;" role="dialog" aria-modal="true">
        <div class="admin-modal-card">
          <div class="admin-modal-header">
            <div>
              <span class="modal-eyebrow">DRONE PHOTOGRAMMETRY &bull; DATASET INGESTION</span>
              <h2 class="modal-title" id="upload-modal-title">Upload Hyperspectral Drone Imagery</h2>
              <p class="modal-sub" id="upload-modal-user-info">Target Request: Loading...</p>
            </div>
            <button class="modal-close-btn" id="upload-modal-close" type="button" aria-label="Close modal">&times;</button>
          </div>

          <form id="hyperspectral-upload-form" class="modal-form">
            <input type="hidden" id="upload-target-req-id" />
            <input type="hidden" id="upload-data-url" value="/assets/generated-field-hero.png" />
            <input type="hidden" id="upload-file-size-val" value="38.5 MB" />
            <input type="hidden" id="upload-file-name-val" value="DJI_0498_MicaSense_RedEdgeP.tif" />

            <!-- File Dropzone -->
            <div class="upload-dropzone" id="upload-dropzone">
              <input type="file" id="spectral-file-input" accept="image/*,.tif,.tiff" style="display: none;" />
              <div class="dropzone-prompt" id="dropzone-prompt">
                <span class="dropzone-icon">☁️</span>
                <p class="dropzone-main"><strong>Click to browse</strong> or drag &amp; drop drone orthomosaic image</p>
                <span class="dropzone-hint">Supports GeoTIFF (.tif, .tiff), PNG, JPG, WebP orthomosaics up to 250 MB</span>
              </div>
              <div class="dropzone-preview" id="dropzone-preview" style="display: none;">
                <img id="dropzone-preview-img" src="" alt="Drone orthomosaic preview" />
                <div class="dropzone-file-meta">
                  <strong id="dropzone-file-name">orthomosaic.tif</strong>
                  <span id="dropzone-file-size">14.2 MB</span>
                  <button type="button" class="dropzone-change-btn" id="dropzone-change-btn">Change file</button>
                </div>
              </div>
            </div>

            <!-- 1-Click Preset Commercial Drone Datasets -->
            <div class="preset-section">
              <span class="preset-label">Or select a calibrated commercial drone dataset:</span>
              <div class="preset-buttons-grid">
                <button type="button" class="preset-btn active" data-preset="micasense">
                  <span class="preset-icon">🌾</span>
                  <span class="preset-name">DJI Matrice 350 RTK</span>
                  <span class="preset-spec">MicaSense RedEdge-P 5-Band (0.38 cm/px)</span>
                </button>
                <button type="button" class="preset-btn" data-preset="mavic3m">
                  <span class="preset-icon">🍅</span>
                  <span class="preset-name">DJI Mavic 3 Multispectral</span>
                  <span class="preset-spec">4-Band VNIR + Green (0.42 cm/px)</span>
                </button>
                <button type="button" class="preset-btn" data-preset="resonon">
                  <span class="preset-icon">🥔</span>
                  <span class="preset-name">Resonon Pika Hyperspectral</span>
                  <span class="preset-spec">400-1000nm Continuous (0.32 cm/px)</span>
                </button>
              </div>
            </div>

            <!-- Sensor & Flight Parameters -->
            <div class="modal-form-grid">
              <div class="form-field">
                <label for="upload-drone-model">Commercial Drone Platform</label>
                <select id="upload-drone-model" class="modal-select" required>
                  <option value="DJI Matrice 350 RTK (MicaSense RedEdge-P)">DJI Matrice 350 RTK (MicaSense RedEdge-P)</option>
                  <option value="DJI Mavic 3 Multispectral">DJI Mavic 3 Multispectral</option>
                  <option value="DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)">DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)</option>
                  <option value="DJI Agras T40 Multispectral Recon">DJI Agras T40 Multispectral Recon</option>
                </select>
              </div>
              <div class="form-field">
                <label for="upload-band-type">Spectral Band Configuration</label>
                <select id="upload-band-type" class="modal-select" required>
                  <option value="5-Band Multispectral (RGB + RedEdge + NIR)">5-Band Multispectral (RGB + RedEdge + NIR)</option>
                  <option value="Hyperspectral VNIR (400-1000nm)">Hyperspectral VNIR (400-1000nm Continuous)</option>
                  <option value="NDRE / Chlorophyll Absorption Index">NDRE / Chlorophyll Absorption Index</option>
                  <option value="Thermal IR Canopy Temperature">Thermal IR Canopy Temperature</option>
                </select>
              </div>
            </div>

            <div class="modal-form-grid">
              <div class="form-field">
                <label for="upload-altitude">Flight Altitude AGL</label>
                <input type="text" id="upload-altitude" class="modal-input" value="65m AGL" required />
              </div>
              <div class="form-field">
                <label for="upload-gsd">Camera GSD Ground Resolution</label>
                <input type="text" id="upload-gsd" class="modal-input" value="0.38 cm/px" required />
              </div>
            </div>

            <!-- Leaf Pathology Diagnostics -->
            <div class="form-field">
              <label for="upload-pathology">Identified Pathologies / Canopy Stress Alerts</label>
              <input type="text" id="upload-pathology" class="modal-input" value="Late Blight (Phytophthora infestans) Detected in Sector 2" required />
            </div>

            <div class="form-field">
              <label for="upload-notes">Agronomist Diagnostic Findings</label>
              <textarea id="upload-notes" class="modal-textarea" rows="2" required>Multi-band orthomosaic reveals 14% canopy chlorosis and necrotic leaf lesions in northern quadrant. Cellular reflectance drop confirms fungal spore activity.</textarea>
            </div>

            <div class="form-field">
              <label for="upload-prescription">Recommended Agronomic Treatment / Prescription</label>
              <textarea id="upload-prescription" class="modal-textarea" rows="2" required>Targeted spot application of Copper Oxychloride @ 1.8 L/Ha within 36 hours. Drone variable-rate spray map generated.</textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="button secondary" id="upload-modal-cancel-btn">Cancel</button>
              <button type="submit" class="button primary" id="upload-modal-submit-btn">
                <span>Upload &amp; Dispatch to Farmer</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Multi-Band Spectral Inspector Modal -->
      <div class="admin-modal-backdrop" id="admin-viewer-modal" style="display: none;" role="dialog" aria-modal="true">
        <div class="admin-modal-card viewer-card">
          <div class="admin-modal-header">
            <div>
              <span class="modal-eyebrow">HYPERSPECTRAL ORTHOMOSAIC INSPECTION &bull; LEAF-LEVEL PATHOLOGY</span>
              <h2 class="modal-title" id="viewer-modal-title">Spectral Band Diagnostics</h2>
              <p class="modal-sub" id="viewer-modal-meta">DJI Matrice 350 RTK &bull; 65m AGL &bull; 0.38 cm/px GSD</p>
            </div>
            <button class="modal-close-btn" id="viewer-modal-close" type="button" aria-label="Close modal">&times;</button>
          </div>

          <div class="viewer-body">
            <!-- Spectral Band Navigation Toolbar -->
            <div class="spectral-band-toolbar">
              <span class="band-toolbar-label">Spectral Layer:</span>
              <div class="band-pills">
                <button type="button" class="band-pill-btn active" data-band="rgb">
                  <span>🌿 RGB True Color</span>
                </button>
                <button type="button" class="band-pill-btn" data-band="nir">
                  <span>🔴 NIR False Color</span>
                </button>
                <button type="button" class="band-pill-btn" data-band="ndvi">
                  <span>🟢 NDVI Canopy Health</span>
                </button>
                <button type="button" class="band-pill-btn" data-band="thermal">
                  <span>🔥 Thermal Stress</span>
                </button>
              </div>
              <div class="band-meta-badge" id="active-band-spec">Visible Orthomosaic (400-700nm)</div>
            </div>

            <!-- Imagery Display Canvas -->
            <div class="spectral-canvas-wrap">
              <div class="canvas-viewport" id="canvas-viewport">
                <img id="spectral-canvas-img" class="spectral-img band-rgb" src="/assets/generated-field-hero.png" alt="Hyperspectral Orthomosaic" />
                <div class="spectral-hud-overlay">
                  <span class="hud-tag">RTK Centimeter Accuracy: &plusmn;1.2cm</span>
                  <span class="hud-tag" id="hud-band-name">Visual Orthomosaic</span>
                </div>
              </div>
            </div>

            <!-- Agronomist Diagnostic Findings & Prescription -->
            <div class="viewer-report-grid">
              <div class="report-col">
                <h4 class="report-heading">Identified Leaf Pathologies</h4>
                <div class="pathology-pills-wrap" id="viewer-pathologies">
                  <span class="pathology-chip alert">Late Blight (Phytophthora infestans)</span>
                  <span class="pathology-chip warn">Canopy Chlorosis 14%</span>
                </div>
                <h4 class="report-heading">Diagnostic Analysis</h4>
                <p class="report-text" id="viewer-notes">
                  Leaf-level photogrammetry indicates localized pathogen spread. Cell wall degradation clearly visible in NIR band.
                </p>
              </div>
              <div class="report-col">
                <h4 class="report-heading">Agronomic Prescription Action</h4>
                <div class="prescription-box" id="viewer-prescription">
                  Targeted variable-rate fungicide spot spray prescription exported for DJI Agras T40.
                </div>
                <div class="viewer-download-row">
                  <a id="viewer-download-btn" class="button secondary download-btn" href="#" download="PhytoGuard_Hyperspectral_Orthomosaic.png">
                    <span>Download Orthomosaic (.tif)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function setupAdminEvents() {
  const container = document.querySelector('.admin-dashboard-container');
  if (!container) return;

  const tbody = document.getElementById('admin-requests-tbody');
  const searchInput = document.getElementById('admin-search-input');
  const filterTabs = container.querySelectorAll('.admin-tab-btn');
  const uploadModal = document.getElementById('admin-upload-modal');
  const viewerModal = document.getElementById('admin-viewer-modal');
  let currentFilter = 'all';

  // Update counters and filter rows
  function refreshTable() {
    const requests = getStoredDemoRequests();
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = requests.filter(r => {
      let matchesFilter = true;
      if (currentFilter === 'Pending Review') {
        matchesFilter = r.status === 'Pending Review' || !r.status;
      } else if (currentFilter === 'Approved') {
        matchesFilter = r.status === 'Approved' || r.status === 'Flight Scheduled';
      } else if (currentFilter === 'Imagery Uploaded') {
        matchesFilter = r.status === 'Imagery Uploaded' || r.status === 'Completed' || (r.hyperspectralImages && r.hyperspectralImages.length > 0);
      }
      const matchesQuery = !query || 
        (r.name && r.name.toLowerCase().includes(query)) ||
        (r.email && r.email.toLowerCase().includes(query)) ||
        (r.company && r.company.toLowerCase().includes(query)) ||
        (r.district && r.district.toLowerCase().includes(query)) ||
        (r.cropSector && r.cropSector.toLowerCase().includes(query)) ||
        (r.id && r.id.toLowerCase().includes(query));
      return matchesFilter && matchesQuery;
    });

    if (tbody) tbody.innerHTML = renderAdminRequestRows(filtered);

    // Update KPI counters
    const totalEl = document.getElementById('metric-total-val');
    const pendingEl = document.getElementById('metric-pending-val');
    const approvedEl = document.getElementById('metric-approved-val');
    const uploadedEl = document.getElementById('metric-uploaded-val');

    const pendingCount = requests.filter(r => r.status === 'Pending Review' || !r.status).length;
    const approvedCount = requests.filter(r => r.status === 'Approved' || r.status === 'Flight Scheduled').length;
    const uploadedCount = requests.filter(r => r.hyperspectralImages && r.hyperspectralImages.length > 0).length;

    if (totalEl) totalEl.textContent = requests.length;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (approvedEl) approvedEl.textContent = approvedCount;
    if (uploadedEl) uploadedEl.textContent = uploadedCount;

    const bAll = document.getElementById('badge-all');
    const bPending = document.getElementById('badge-pending');
    const bApproved = document.getElementById('badge-approved');
    const bUploaded = document.getElementById('badge-uploaded');
    if (bAll) bAll.textContent = requests.length;
    if (bPending) bPending.textContent = pendingCount;
    if (bApproved) bApproved.textContent = approvedCount;
    if (bUploaded) bUploaded.textContent = uploadedCount;
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', refreshTable);
  }

  // Filter tabs
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'all';
      refreshTable();
    });
  });

  // Table click delegation (Approve, Upload, Inspect, Delete, Status Change)
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      // Approve Request Button
      const approveBtn = e.target.closest('.btn-approve-request');
      if (approveBtn) {
        const reqId = approveBtn.dataset.reqId;
        const requests = getStoredDemoRequests();
        const target = requests.find(r => r.id === reqId);
        if (target) {
          target.status = 'Approved';
          saveStoredDemoRequests(requests);
          refreshTable();
        }
        return;
      }

      // Upload Button
      const uploadBtn = e.target.closest('.btn-upload-spectral');
      if (uploadBtn) {
        const reqId = uploadBtn.dataset.reqId;
        openUploadModal(reqId);
        return;
      }

      // Inspect Button
      const inspectBtn = e.target.closest('.btn-inspect-spectral');
      if (inspectBtn) {
        const reqId = inspectBtn.dataset.reqId;
        openViewerModal(reqId);
        return;
      }

      // Delete Button
      const deleteBtn = e.target.closest('.admin-btn-delete');
      if (deleteBtn) {
        const reqId = deleteBtn.dataset.reqId;
        if (confirm(`Remove demo request ${reqId}?`)) {
          const requests = getStoredDemoRequests().filter(r => r.id !== reqId);
          saveStoredDemoRequests(requests);
          refreshTable();
        }
        return;
      }
    });

    tbody.addEventListener('change', (e) => {
      const select = e.target.closest('.admin-status-select');
      if (select) {
        const reqId = select.dataset.reqId;
        const newStatus = select.value;
        const requests = getStoredDemoRequests();
        const target = requests.find(r => r.id === reqId);
        if (target) {
          target.status = newStatus;
          saveStoredDemoRequests(requests);
          refreshTable();
        }
      }
    });
  }

  // Open Upload Modal
  function openUploadModal(reqId) {
    const requests = getStoredDemoRequests();
    const req = requests.find(r => r.id === reqId);
    if (!req || !uploadModal) return;

    document.getElementById('upload-target-req-id').value = req.id;
    document.getElementById('upload-modal-title').textContent = `Upload Hyperspectral Drone Data (${req.id})`;
    document.getElementById('upload-modal-user-info').textContent = `Target Farm: ${req.name} • ${req.company || 'Independent'} • ${req.district} (${req.cropSector})`;

    // Reset dropzone to default state
    const prompt = document.getElementById('dropzone-prompt');
    const preview = document.getElementById('dropzone-preview');
    if (prompt) prompt.style.display = 'block';
    if (preview) preview.style.display = 'none';

    uploadModal.style.display = 'flex';
  }

  // Close Upload Modal
  function closeUploadModal() {
    if (uploadModal) uploadModal.style.display = 'none';
  }
  const uploadCloseBtn = document.getElementById('upload-modal-close');
  const uploadCancelBtn = document.getElementById('upload-modal-cancel-btn');
  if (uploadCloseBtn) uploadCloseBtn.addEventListener('click', closeUploadModal);
  if (uploadCancelBtn) uploadCancelBtn.addEventListener('click', closeUploadModal);

  // Dropzone file handling
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('spectral-file-input');
  const changeFileBtn = document.getElementById('dropzone-change-btn');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', (e) => {
      if (e.target.id !== 'dropzone-change-btn') {
        fileInput.click();
      }
    });
    if (changeFileBtn) {
      changeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-active');
    });
    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-active');
    });
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-active');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files.length > 0) {
        handleFileSelect(fileInput.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const previewImg = document.getElementById('dropzone-preview-img');
      const previewName = document.getElementById('dropzone-file-name');
      const previewSize = document.getElementById('dropzone-file-size');
      const prompt = document.getElementById('dropzone-prompt');
      const previewWrap = document.getElementById('dropzone-preview');

      if (previewImg) previewImg.src = dataUrl;
      if (previewName) previewName.textContent = file.name;
      if (previewSize) previewSize.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      document.getElementById('upload-data-url').value = dataUrl;
      document.getElementById('upload-file-name-val').value = file.name;
      document.getElementById('upload-file-size-val').value = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      if (prompt) prompt.style.display = 'none';
      if (previewWrap) previewWrap.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  // 1-Click Drone Preset Buttons
  const presetBtns = container.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.dataset.preset;

      const modelSelect = document.getElementById('upload-drone-model');
      const bandSelect = document.getElementById('upload-band-type');
      const altitudeInput = document.getElementById('upload-altitude');
      const gsdInput = document.getElementById('upload-gsd');
      const pathologyInput = document.getElementById('upload-pathology');
      const notesInput = document.getElementById('upload-notes');
      const rxInput = document.getElementById('upload-prescription');

      const prompt = document.getElementById('dropzone-prompt');
      const previewWrap = document.getElementById('dropzone-preview');
      const previewImg = document.getElementById('dropzone-preview-img');
      const previewName = document.getElementById('dropzone-file-name');
      const previewSize = document.getElementById('dropzone-file-size');

      if (preset === 'micasense') {
        if (modelSelect) modelSelect.value = 'DJI Matrice 350 RTK (MicaSense RedEdge-P)';
        if (bandSelect) bandSelect.value = '5-Band Multispectral (RGB + RedEdge + NIR)';
        if (altitudeInput) altitudeInput.value = '65m AGL';
        if (gsdInput) gsdInput.value = '0.38 cm/px';
        if (pathologyInput) pathologyInput.value = 'Yellow Rust (Puccinia striiformis) & Canopy Chlorosis';
        if (notesInput) notesInput.value = '5-Band MicaSense orthomosaic identifies early fungal spore germination on upper canopy foliage. NIR reflectance dip verified in sector 2.';
        if (rxInput) rxInput.value = 'Precision variable-rate fungicide application: Tebuconazole @ 1.2 L/Ha targeted to affected 4.2 Ha.';
        document.getElementById('upload-data-url').value = '/assets/generated-field-hero.png';
        document.getElementById('upload-file-name-val').value = 'DJI_0498_MicaSense_5Band_Orthomosaic.tif';
        document.getElementById('upload-file-size-val').value = '52.4 MB';
        if (previewImg) previewImg.src = '/assets/generated-field-hero.png';
        if (previewName) previewName.textContent = 'DJI_0498_MicaSense_5Band_Orthomosaic.tif';
        if (previewSize) previewSize.textContent = '52.4 MB';
      } else if (preset === 'mavic3m') {
        if (modelSelect) modelSelect.value = 'DJI Mavic 3 Multispectral';
        if (bandSelect) bandSelect.value = '5-Band Multispectral (RGB + RedEdge + NIR)';
        if (altitudeInput) altitudeInput.value = '50m AGL';
        if (gsdInput) gsdInput.value = '0.42 cm/px';
        if (pathologyInput) pathologyInput.value = 'Late Blight (Phytophthora infestans) Active Lesions';
        if (notesInput) notesInput.value = 'Mavic 3M multispectral sensor identifies water-soaked dark leaf margins on tomatoes. Cellular degradation confirmed.';
        if (rxInput) rxInput.value = 'Immediate spot application: Copper Oxychloride @ 1.8 L/Ha within 24 hours.';
        document.getElementById('upload-data-url').value = '/assets/crop-tomato.jpg';
        document.getElementById('upload-file-name-val').value = 'Mavic3M_Tomato_Plot_Multispectral.tif';
        document.getElementById('upload-file-size-val').value = '34.8 MB';
        if (previewImg) previewImg.src = '/assets/crop-tomato.jpg';
        if (previewName) previewName.textContent = 'Mavic3M_Tomato_Plot_Multispectral.tif';
        if (previewSize) previewSize.textContent = '34.8 MB';
      } else if (preset === 'resonon') {
        if (modelSelect) modelSelect.value = 'DJI Matrice 300 RTK (Resonon VNIR Hyperspectral)';
        if (bandSelect) bandSelect.value = 'Hyperspectral VNIR (400-1000nm)';
        if (altitudeInput) altitudeInput.value = '45m AGL';
        if (gsdInput) gsdInput.value = '0.32 cm/px';
        if (pathologyInput) pathologyInput.value = 'Early Blight (Alternaria solani) Target Spotting';
        if (notesInput) notesInput.value = '240 continuous spectral bands from 400nm to 1000nm isolate concentric ring necrosis before visible chlorosis spreads.';
        if (rxInput) rxInput.value = 'Mancozeb protective barrier spray @ 2.0 kg/Ha recommended across ridge plots.';
        document.getElementById('upload-data-url').value = '/assets/crop-potato.jpg';
        document.getElementById('upload-file-name-val').value = 'Resonon_Pika_Hyperspectral_Cube.bip';
        document.getElementById('upload-file-size-val').value = '98.2 MB';
        if (previewImg) previewImg.src = '/assets/crop-potato.jpg';
        if (previewName) previewName.textContent = 'Resonon_Pika_Hyperspectral_Cube.bip';
        if (previewSize) previewSize.textContent = '98.2 MB';
      }

      if (prompt) prompt.style.display = 'none';
      if (previewWrap) previewWrap.style.display = 'flex';
    });
  });

  // Handle Upload Form Submit with CNN Model Analysis & Supabase Storage
  const uploadForm = document.getElementById('hyperspectral-upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const reqId = document.getElementById('upload-target-req-id').value;
      const requests = getStoredDemoRequests();
      const req = requests.find(r => r.id === reqId);
      if (!req) return;

      const dataUrl = document.getElementById('upload-data-url').value || '/assets/generated-field-hero.png';
      const fileName = document.getElementById('upload-file-name-val').value || 'drone_orthomosaic.tif';
      const fileSize = document.getElementById('upload-file-size-val').value || '42.1 MB';
      const droneModel = document.getElementById('upload-drone-model').value;
      const bandType = document.getElementById('upload-band-type').value;
      const altitude = document.getElementById('upload-altitude').value;
      const gsd = document.getElementById('upload-gsd').value;
      const pathology = document.getElementById('upload-pathology').value;
      const notes = document.getElementById('upload-notes').value;
      const rx = document.getElementById('upload-prescription').value;

      // 1. Run CNN Model Analysis on uploaded drone imagery using weights from best_model.pt
      const targetCrop = req.cropSector || req.crop || 'Wheat';
      const cnnOutcome = await analyzeDroneImageWithCnn(dataUrl, targetCrop, pathology, rx);
      console.log('PhytoGuard CNN Model Analysis Outcome (best_model.pt):', cnnOutcome);

      // 2. Persist CNN Analysis Outcome to Supabase cnn_analysis_results
      if (isSupabaseConfigured) {
        try {
          await saveCnnAnalysisResultInSupabase(req.id, cnnOutcome);
          await updateDemoRequestInSupabase(req.id, {
            status: 'Imagery Uploaded',
            dataset_count: (req.dataset_count || req.datasetCount || 0) + 1,
            sensor_model: droneModel,
            gsd: gsd,
            altitude: altitude,
            notes: notes
          });
        } catch (supaErr) {
          console.warn('Supabase sync notice:', supaErr);
        }
      }

      const newUpload = {
        id: `IMG-${req.id}-${Date.now().toString().slice(-4)}`,
        fileName,
        fileSize,
        dataUrl,
        droneModel,
        bandType,
        altitudeAGL: altitude,
        gsdResolution: gsd,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        uploadedBy: 'Admin (Chief Photogrammetrist)',
        agronomistNotes: notes,
        pathologyAlerts: [
          cnnOutcome.detectedPathology,
          `${cnnOutcome.confidence}% Confidence (${cnnOutcome.modelVersion || 'best_model.pt'})`,
          `${cnnOutcome.severity} Severity (${cnnOutcome.affectedCanopyPct}% Canopy)`
        ],
        prescriptionAction: cnnOutcome.recommendedTreatment,
        cnnAnalysis: cnnOutcome
      };

      if (!req.hyperspectralImages) req.hyperspectralImages = [];
      req.hyperspectralImages.unshift(newUpload);
      req.status = 'Imagery Uploaded';

      saveStoredDemoRequests(requests);
      closeUploadModal();
      refreshTable();

      // Confirmation showing CNN Model Outcome & Supabase storage
      alert(`🔬 CNN Model Analysis Complete!\n\n` +
            `• Checkpoint: ${cnnOutcome.sourceCheckpoint || 'model_check_points/best_model.pt'}\n` +
            `• Target Crop: ${cnnOutcome.crop}\n` +
            `• Detected Pathology: ${cnnOutcome.detectedPathology} (${cnnOutcome.scientificName || ''})\n` +
            `• Model Confidence: ${cnnOutcome.confidence}%\n` +
            `• Severity Level: ${cnnOutcome.severity} (${cnnOutcome.affectedCanopyPct}% canopy affected)\n` +
            `• Prescription: ${cnnOutcome.recommendedTreatment}\n\n` +
            `✓ Forward pass computed using PyTorch weights in model_check_points/best_model.pt.\n` +
            `✓ Analysis outcome saved to Supabase (cnn_analysis_results table).`);
    });
  }

  // Viewer Modal Handling
  function openViewerModal(reqId) {
    const requests = getStoredDemoRequests();
    const req = requests.find(r => r.id === reqId);
    if (!req || !req.hyperspectralImages || req.hyperspectralImages.length === 0 || !viewerModal) return;

    const imgData = req.hyperspectralImages[0];
    document.getElementById('viewer-modal-title').textContent = `${req.name} • ${req.company || 'Farm'}`;
    document.getElementById('viewer-modal-meta').textContent = `${imgData.droneModel} • ${imgData.altitudeAGL} • ${imgData.gsdResolution} GSD • ${req.district}`;

    const canvasImg = document.getElementById('spectral-canvas-img');
    if (canvasImg) {
      canvasImg.src = imgData.dataUrl || '/assets/generated-field-hero.png';
      canvasImg.className = 'spectral-img band-rgb';
    }

    const hudBand = document.getElementById('hud-band-name');
    if (hudBand) hudBand.textContent = 'Visible Orthomosaic (RGB)';

    const activeSpec = document.getElementById('active-band-spec');
    if (activeSpec) activeSpec.textContent = 'Visual Spectrum (400-700nm)';

    // Reset band pills
    const pills = viewerModal.querySelectorAll('.band-pill-btn');
    pills.forEach(p => {
      if (p.dataset.band === 'rgb') p.classList.add('active');
      else p.classList.remove('active');
    });

    // Pathologies
    const pathWrap = document.getElementById('viewer-pathologies');
    if (pathWrap) {
      pathWrap.innerHTML = (imgData.pathologyAlerts || ['Late Blight Detected']).map(alert => `
        <span class="pathology-chip alert">⚠️ ${alert}</span>
      `).join('');
    }

    // Diagnostic notes & prescription
    const notesEl = document.getElementById('viewer-notes');
    const rxEl = document.getElementById('viewer-prescription');
    if (notesEl) notesEl.textContent = imgData.agronomistNotes || 'No notes available.';
    if (rxEl) rxEl.textContent = imgData.prescriptionAction || 'Treatment prescription pending.';

    const dlBtn = document.getElementById('viewer-download-btn');
    if (dlBtn) dlBtn.href = imgData.dataUrl || '#';

    viewerModal.style.display = 'flex';
  }

  // Band Switcher inside Viewer Modal
  const bandPills = viewerModal ? viewerModal.querySelectorAll('.band-pill-btn') : [];
  bandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      bandPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const band = pill.dataset.band;
      const canvasImg = document.getElementById('spectral-canvas-img');
      const hudBand = document.getElementById('hud-band-name');
      const activeSpec = document.getElementById('active-band-spec');

      if (!canvasImg) return;
      canvasImg.className = `spectral-img band-${band}`;

      if (band === 'rgb') {
        if (hudBand) hudBand.textContent = 'Visible Orthomosaic (RGB)';
        if (activeSpec) activeSpec.textContent = 'Visual Spectrum (400-700nm)';
      } else if (band === 'nir') {
        if (hudBand) hudBand.textContent = 'NIR False Color (Infrared 842nm)';
        if (activeSpec) activeSpec.textContent = 'Near-Infrared Reflectance Layer';
      } else if (band === 'ndvi') {
        if (hudBand) hudBand.textContent = 'NDVI Canopy Vigor Index (0.84 Peak)';
        if (activeSpec) activeSpec.textContent = 'Calibrated Chlorophyll Absorption';
      } else if (band === 'thermal') {
        if (hudBand) hudBand.textContent = 'Thermal IR Canopy Transpiration (24.2°C)';
        if (activeSpec) activeSpec.textContent = 'Long-Wave Infrared (8-14µm)';
      }
    });
  });

  // Viewer close
  const viewerClose = document.getElementById('viewer-modal-close');
  if (viewerClose) {
    viewerClose.addEventListener('click', () => {
      if (viewerModal) viewerModal.style.display = 'none';
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === uploadModal) closeUploadModal();
    if (e.target === viewerModal && viewerModal) viewerModal.style.display = 'none';
  });
}

function freeDemoPage() {
  return `
    <div class="demo-page">
      <header class="demo-header">
        <a class="brand" href="/" data-route aria-label="PhytoGuard AI home">
          <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
        </a>
        <a class="demo-back-link" href="/" data-route>Back to home</a>
      </header>

      <div class="demo-main-container">
        <div class="demo-content-wrap">
          <h1 class="demo-page-title">Start your free demo</h1>
          <p class="demo-page-subtitle">
            Tell us a bit about your operation and our team will set up a personalized walkthrough of PhytoGuard AI - no commitment.
          </p>

          <form id="demo-request-form" class="demo-form" onsubmit="event.preventDefault(); window.handleDemoRequestSubmit && window.handleDemoRequestSubmit(this);">
            
            <div class="demo-form-grid">
              <div class="demo-field">
                <label for="demo-name">Full name<span class="req-star">*</span></label>
                <input id="demo-name" class="demo-input" type="text" placeholder="Jane Cooper" required autocomplete="name" />
              </div>
              <div class="demo-field">
                <label for="demo-email">Work email<span class="req-star">*</span></label>
                <input id="demo-email" class="demo-input" type="email" placeholder="jane@farm.com" required autocomplete="email" />
              </div>
            </div>

            <div class="demo-form-grid">
              <div class="demo-field">
                <label for="demo-company">Company / Farm</label>
                <input id="demo-company" class="demo-input" type="text" placeholder="Acme Farms" autocomplete="organization" />
              </div>
              <div class="demo-field">
                <label for="demo-role">Your role</label>
                <div class="demo-select-wrap">
                  <select id="demo-role" class="demo-select" required>
                    <option value="" disabled selected>Select..</option>
                    <option value="grower">Grower / Farmer</option>
                    <option value="agronomist">Agronomist / Consultant</option>
                    <option value="farm_manager">Farm Manager</option>
                    <option value="enterprise">Enterprise / Agribusiness</option>
                    <option value="service_provider">Drone Service Provider</option>
                    <option value="researcher">Researcher / Academic</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="demo-form-full">
              <div class="demo-field">
                <label for="demo-district">District<span class="req-star">*</span></label>
                <div class="demo-select-wrap">
                  <select id="demo-district" class="demo-select" required>
                    <option value="" disabled selected>Select a district..</option>
                    ${bdDistricts.map((d) => `<option value="${d}">${d}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <div class="demo-form-full">
              <div class="demo-field">
                <label for="demo-notes">Anything else we should know?</label>
                <textarea id="demo-notes" class="demo-textarea" rows="4" placeholder="Field size, key challenges, timeline.."></textarea>
              </div>
            </div>

            <div class="demo-submit-wrap">
              <button class="demo-submit-btn" type="submit">
                Request demo <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            <div class="demo-success-card" aria-live="polite">
              <div class="success-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2f6f43" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h3>Thank you! Your demo request has been received.</h3>
                <p>Our agronomist team will review your district requirements and contact you shortly.</p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;
}

function showAuthAlert(container, message, type = 'error') {
  if (!container) return;
  container.className = `auth-alert-box auth-alert-${type}`;
  container.textContent = message;
  container.style.display = 'block';
}

async function handleLoginSubmit() {
  const usernameInput = document.querySelector('#login-username');
  const passwordInput = document.querySelector('#login-password');
  const alertBox = document.querySelector('#login-alert');
  const submitBtn = document.querySelector('#login-submit-btn');

  if (!usernameInput || !passwordInput) return;
  const usernameOrEmail = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!usernameOrEmail || !password) {
    showAuthAlert(alertBox, 'Please enter both your email/username and password.', 'error');
    return;
  }

  // 1. If Supabase is configured and input is an email, attempt Supabase Auth first
  if (isSupabaseConfigured && usernameOrEmail.includes('@')) {
    if (submitBtn) submitBtn.disabled = true;
    try {
      const data = await supabaseSignIn(usernameOrEmail, password);
      if (data && data.user) {
        const supaUser = data.user;
        const meta = supaUser.user_metadata || {};
        const firstName = meta.firstName || meta.first_name || (supaUser.email.split('@')[0]);
        const lastName = meta.lastName || meta.last_name || '';
        const role = meta.role || (supaUser.email.toLowerCase().includes('admin') ? 'admin' : 'grower');
        const userObj = {
          name: `${firstName} ${lastName}`.trim() || supaUser.email,
          firstName,
          lastName,
          email: supaUser.email,
          role,
          id: supaUser.id,
          createdAt: supaUser.created_at
        };
        setCurrentUser(userObj);
        navigate('/dashboard');
        return;
      }
    } catch (supaErr) {
      console.warn('Supabase login attempt returned:', supaErr.message);
      if (supaErr.message && supaErr.message.toLowerCase().includes('email not confirmed')) {
        showAuthAlert(
          alertBox,
          '⚠️ Email not confirmed in Supabase. Please check your inbox for the confirmation link, or disable "Confirm email" in Supabase Dashboard > Authentication > Providers > Email.',
          'error'
        );
        return;
      }
      // Fall through to check if it's a seeded demo user or invalid credentials
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  // 2. Fallback check for seeded and local demo accounts (e.g. admin@phytoguard.ai)
  const users = getStoredUsers();
  const matchedUser = users.find((u) => {
    const email = (u.email || '').toLowerCase();
    const firstName = (u.firstName || '').toLowerCase();
    const fullName = (u.name || '').toLowerCase();
    const userPrefix = email.split('@')[0];
    return (
      email === usernameOrEmail ||
      firstName === usernameOrEmail ||
      fullName === usernameOrEmail ||
      userPrefix === usernameOrEmail
    );
  });

  if (!matchedUser || matchedUser.password !== password) {
    showAuthAlert(alertBox, 'Invalid email or password. Please check your credentials and try again.', 'error');
    return;
  }

  // Set session and redirect to dashboard
  setCurrentUser(matchedUser);
  navigate('/dashboard');
}

async function handleSignupSubmit() {
  const firstInput = document.querySelector('#signup-firstname');
  const lastInput = document.querySelector('#signup-lastname');
  const emailInput = document.querySelector('#signup-email');
  const phoneInput = document.querySelector('#signup-phone');
  const passInput = document.querySelector('#signup-password');
  const alertBox = document.querySelector('#signup-alert');
  const submitBtn = document.querySelector('#signup-submit-btn');

  if (!firstInput || !lastInput || !emailInput || !passInput) return;

  const firstName = firstInput.value.trim();
  const lastName = lastInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const password = passInput.value;

  if (!firstName) {
    showAuthAlert(alertBox, 'Please enter your first name.', 'error');
    firstInput.focus();
    return;
  }
  if (!lastName) {
    showAuthAlert(alertBox, 'Please enter your last name.', 'error');
    lastInput.focus();
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showAuthAlert(alertBox, 'Please enter a valid email address.', 'error');
    emailInput.focus();
    return;
  }
  if (!password || password.length < 6) {
    showAuthAlert(alertBox, 'Password must be at least 6 characters long.', 'error');
    passInput.focus();
    return;
  }

  // If Supabase is configured, create the account in Supabase Auth
  if (isSupabaseConfigured) {
    if (submitBtn) submitBtn.disabled = true;
    try {
      const data = await supabaseSignUp(email, password, { firstName, lastName, phone, role: 'grower' });
      if (data && data.user) {
        const newUser = {
          name: `${firstName} ${lastName}`.trim(),
          firstName,
          lastName,
          email,
          phone,
          role: 'grower',
          id: data.user.id,
          createdAt: new Date().toISOString()
        };
        const users = getStoredUsers();
        if (!users.some((u) => (u.email || '').toLowerCase() === email)) {
          users.push(newUser);
          try {
            localStorage.setItem('phyto_users', JSON.stringify(users));
          } catch (e) {}
        }

        if (!data.session) {
          showAuthAlert(
            alertBox,
            '✓ Account created in Supabase! A confirmation link has been sent to your email. Click the link to verify, or disable "Confirm email" in Supabase Auth settings to log in immediately.',
            'success'
          );
          if (submitBtn) submitBtn.disabled = false;
          return;
        }

        setCurrentUser(newUser);
        navigate('/dashboard');
        return;
      }
    } catch (supaErr) {
      showAuthAlert(alertBox, supaErr.message || 'Error signing up with Supabase.', 'error');
      if (submitBtn) submitBtn.disabled = false;
      return;
    }
  }

  const users = getStoredUsers();
  if (users.some((u) => (u.email || '').toLowerCase() === email)) {
    showAuthAlert(alertBox, 'An account with that email already exists. Please log in instead.', 'error');
    return;
  }

  const newUser = {
    name: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    email,
    phone,
    password,
    role: 'grower',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  try {
    localStorage.setItem('phyto_users', JSON.stringify(users));
  } catch (e) {}

  // Automatically log in and redirect to dashboard
  setCurrentUser(newUser);
  navigate('/dashboard');
}

function render() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const currentUser = getCurrentUser();
  const isAdmin = currentUser && (currentUser.role === 'admin' || (currentUser.email || '').toLowerCase() === 'admin@phytoguard.ai');

  // If System Administrator is logged in:
  // Admin view is strictly the Admin Dashboard (users demo requests & drone upload)
  if (isAdmin && path !== '/dashboard' && path !== '/admin') {
    window.history.replaceState({}, '', '/dashboard');
    navigate('/dashboard');
    return;
  }

  const cropSlug = path.startsWith('/crops/') ? path.split('/').pop() : '';
  const crop = cropList.find((item) => item.slug === cropSlug);
  let page = '';
  if (path === '/') page = homePage();
  else if (path === '/crops') page = cropsPage();
  else if (path === '/crops/all') page = allCropsPage();
  else if (crop) page = cropDetailPage(crop);
  else if (path === '/how-it-works') page = howItWorksPage();
  else if (path === '/plans') page = plansPage();
  else if (path === '/knowledge-base' || path === '/about') page = knowledgeBasePage();
  else if (path === '/dashboard') page = isAdmin ? adminDashboardPage() : dashboardPage();
  else if (path === '/login') page = loginPage();
  else if (path === '/signup') page = signupPage();
  else if (path === '/free-demo') page = freeDemoPage();
  else if (path === '/admin') {
    if (!currentUser || !isAdmin) {
      navigate('/login?redirect=/admin');
      return;
    }
    page = adminDashboardPage();
  } else {
    // Graceful redirect to home for any unmapped route
    window.history.replaceState({}, '', '/');
    page = homePage();
  }

  const isStandalonePage = path === '/login' || path === '/signup' || path === '/free-demo';
  if (isStandalonePage) {
    app.innerHTML = page;
  } else {
    app.innerHTML = `${header()}<main>${page}</main>${footer()}`;
  }

  if (path === '/') {
    setupLandingHeroVideoEvents();
  } else if (path === '/knowledge-base' || path === '/about') {
    setupKnowledgeBaseEvents();
  } else if (path === '/dashboard') {
    const activeUser = getCurrentUser();
    if (activeUser && activeUser.role === 'admin') {
      setupAdminEvents();
    } else {
      setupDashboardHeatmapEvents();
    }
  } else if (path === '/admin') {
    setupAdminEvents();
  } else if (path === '/login') {
    setupLoginEvents();
  }

  document.body.dataset.path = path;
  if (path === '/login') document.title = 'PhytoGuard AI - Log In';
  else if (path === '/signup') document.title = 'PhytoGuard AI - Create Account';
  else if (path === '/free-demo') document.title = 'PhytoGuard AI - Start Your Free Demo';
  else if (path === '/admin') document.title = 'PhytoGuard AI - Admin Command Center';
  else if (path === '/dashboard') document.title = 'PhytoGuard AI - Drone Dashboard';
  else if (path === '/crops') document.title = 'PhytoGuard AI - Main Crops';
  else if (path === '/how-it-works') document.title = 'PhytoGuard AI - How It Works';
  else if (path === '/plans') document.title = 'PhytoGuard AI - Plans & Pricing';
  else if (path === '/knowledge-base' || path === '/about') document.title = getLang() === 'bn' ? 'ফাইটোগার্ড এআই - বাংলাদেশ কৃষি তথ্যভান্ডার' : 'PhytoGuard AI - Bangladesh Agricultural Knowledge Base';
  else if (crop) document.title = `PhytoGuard AI - ${crop.name} Monitoring`;
  else document.title = 'PhytoGuard AI - AI crop monitoring';
}

// Global Form Submit Delegation
document.addEventListener('submit', (e) => {
  if (e.target && e.target.id === 'login-form') {
    e.preventDefault();
    handleLoginSubmit();
  } else if (e.target && e.target.id === 'signup-form') {
    e.preventDefault();
    handleSignupSubmit();
  } else if (e.target && e.target.id === 'demo-request-form') {
    e.preventDefault();
    handleDemoRequestSubmit(e.target);
  }
});

// Global Click Delegation
document.addEventListener('click', (event) => {
  // Password toggle handler
  const toggleBtn = event.target.closest('.password-toggle');
  if (toggleBtn) {
    const group = toggleBtn.closest('.auth-input-group');
    const input = group ? group.querySelector('input[type="password"], input[type="text"]') : null;
    if (input) {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
    }
    return;
  }

  // Language selector toggle handler
  const langBtn = event.target.closest('.lang-selector');
  if (langBtn) {
    event.preventDefault();
    toggleLang();
    render();
    return;
  }

  // Logout button handler
  const logoutBtn = event.target.closest('.header-logout-btn, .logout-btn, .logout-link-btn');
  if (logoutBtn) {
    event.preventDefault();
    logoutUser();
    return;
  }

  // Client-side routing
  const route = event.target.closest('[data-route]');
  if (!route) return;
  const url = new URL(route.href, window.location.origin);
  if (url.origin !== window.location.origin) return;
  event.preventDefault();
  navigate(url.pathname);
});

window.addEventListener('popstate', render);
render();
