import './styles.css';
import { cropList, features, plans, productCatalog, kbCategories } from './data.js';

const app = document.querySelector('#app');

// Standard Authentication Helpers
function getStoredUsers() {
  try {
    const raw = localStorage.getItem('phyto_users');
    if (raw) return JSON.parse(raw);
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
      password: 'password123'
    }
  ];
  try {
    localStorage.setItem('phyto_users', JSON.stringify(defaultUsers));
  } catch (e) {}
  return defaultUsers;
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
  const isCurrent = currentPath === path || (path === '/crops' && (currentPath === '/crops' || currentPath.startsWith('/crops/')));
  const classes = [extra, isCurrent ? 'active' : ''].filter(Boolean).join(' ');
  return `<a class="${classes}" href="${path}" data-route>${label}</a>`;
}

function header() {
  const currentUser = getCurrentUser();
  return `
    <header class="site-header">
      <a class="brand" href="/" data-route aria-label="PhytoGuard AI home">
        <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
      </a>
      <nav class="main-nav" aria-label="Main navigation">
        ${currentUser ? link('/dashboard', 'Dashboard') : `<a class="nav-unlinked" href="/login" data-route>Dashboard</a>`}
        ${link('/crops', 'Main Crops')}
        ${link('/how-it-works', 'How It Works')}
        ${link('/plans', 'Plans')}
        <a class="nav-unlinked" href="#" onclick="event.preventDefault()">About</a>
        ${link('/knowledge-base', 'Knowledge Base')}
      </nav>
      <div class="header-actions">
        <button class="lang-selector" type="button" aria-label="Select language">
          <svg class="globe-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
            <circle cx="8" cy="8" r="6.5"/>
            <path d="M1.5 8h13M8 1.5c2 2.5 3 4.5 3 6.5s-1 4-3 6.5c-2-2.5-3-4.5-3-6.5s1-4 3-6.5z"/>
          </svg>
          <span>EN</span>
        </button>
        ${currentUser ? `
          <div class="user-header-profile">
            <a class="login-link user-logged-btn" href="/dashboard" data-route aria-label="Dashboard for ${currentUser.name}" title="Go to Dashboard">
              <span class="user-avatar-badge" aria-hidden="true">${(currentUser.firstName || currentUser.name || 'U').charAt(0).toUpperCase()}</span>
              <span class="user-name-label">${currentUser.name || currentUser.firstName || 'User'}</span>
            </a>
            <button class="header-logout-btn" type="button" aria-label="Log Out" title="Log Out">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ` : `
          <a class="login-link" href="/login" data-route>Login <span aria-hidden="true">&rarr;</span></a>
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
    <section class="landing-hero">
      <div class="landing-hero-backdrop" aria-hidden="true"></div>
      <div class="landing-hero-content">
        <a class="hero-announcement" href="/free-demo" data-route>
          ${sparkleIcon}
          <span>Free autonomous drone scouting trial</span>
          <span class="announcement-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <h1 class="hero-title">
          Leaf Level<br />
          Crop Protection
        </h1>
        <p class="hero-subtitle">
          An AI platform for crop protection, delivering field level visibility down to the leaf.
        </p>
        <div class="hero-cta-group">
          <a class="hero-cta-btn" href="/free-demo" data-route>
            Start free demo <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <a class="brand" href="/" data-route aria-label="PhytoGuard AI home">
          <span class="brand-text">Phyto<span class="brand-accent">G</span>uard&nbsp;<span class="brand-accent">AI</span></span>
        </a>
        <p>AI crop protection at the leaf level.</p>
      </div>
      <div class="footer-links">
        ${link('/crops', 'All crops')}
        ${link('/how-it-works', 'How it works')}
        ${link('/plans', 'Plans')}
        ${link('/knowledge-base', 'Knowledge Base')}
        <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a>
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
  return `
    ${landingHeroSection()}
    ${whyPhytoGuardSection()}
    ${stepsSection('From field to decision in three steps', [
      ['Capture your fields', 'Map your field boundaries and fly autonomous drone scans with standard or multispectral sensors.'],
      ['AI scans every leaf', 'PhytoGuard AI detects pests, disease, and stress down to the leaf and flags risks across your fields.'],
      ['Act with confidence', 'Get prescription maps, alerts, and agronomy recommendations ready to send to the sprayer.'],
    ])}
    ${landingDemoSection()}
  `;
}

function whyPhytoGuardSection() {
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
              <span class="report-code">Pests & Disease Report #025292</span>
              <span class="report-badge-new">
                <span class="report-badge-dot" aria-hidden="true"></span>
                <span>New infections</span>
              </span>
            </div>

            <h3 class="report-grower-title">Chad North · Potato</h3>
            <p class="report-date-count">13 Jun 2026 · 598 images inspected</p>

            <div class="report-findings-list">
              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-late-blight.jpg" alt="Late blight (fresh)" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">Late blight (fresh)</h4>
                  <p class="finding-source">Sample from field inspection</p>
                </div>
                <span class="finding-pill pill-high">High</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-colorado-beetle.jpg" alt="Colorado beetle - larvae" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">Colorado beetle - larvae</h4>
                  <p class="finding-source">Sample from field inspection</p>
                </div>
                <span class="finding-pill pill-med">Medium</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-early-blight.jpg" alt="Early blight, alternaria leaf spot" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">Early blight, alternaria leaf spot</h4>
                  <p class="finding-source">Sample from field inspection</p>
                </div>
                <span class="finding-pill pill-med">Medium</span>
              </div>

              <div class="finding-row">
                <div class="finding-thumb">
                  <img src="/assets/thumb-brown-spot.jpg" alt="Brown spot, alternaria blight" />
                </div>
                <div class="finding-info">
                  <h4 class="finding-name">Brown spot, alternaria blight</h4>
                  <p class="finding-source">Sample from field inspection</p>
                </div>
                <span class="finding-pill pill-low">Low</span>
              </div>
            </div>

            <div class="report-special-alert">
              <p>
                <strong class="alert-highlight">Special attention:</strong> Inspect flagged labels directly in the field; they are suspected of Late Blight (Fresh).
              </p>
            </div>

            <p class="report-footer-note">
              Also found: Colorado beetle adults and larvae, flea beetles, hail damage, looper army worm damage, weeds, pest damage, and agricultural-tool damage.
            </p>
          </div>

          <div class="report-action-row">
            <button class="report-download-button" type="button" aria-label="Download full report">
              <svg class="report-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span>Download full report</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Header & 6 Sleek Cards -->
        <div class="why-phyto-content">
          <div class="why-phyto-header">
            <span class="why-eyebrow">WHY PHYTOGUARD</span>
            <h2 class="why-heading">Crop protection,<br />down to the leaf</h2>
          </div>

          <div class="why-cards-grid">
            ${features.map(([title, text], idx) => `
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

  return `
    <section class="landing-demo">
      <div class="landing-demo-content">
        <p class="demo-eyebrow">GET STARTED</p>
        <h2>Ready to protect<br />your yields?</h2>
        <p class="demo-lead">Join thousands of growers using PhytoGuard AI for precision crop monitoring.</p>
        <ul class="demo-checks">
          <li>${checkSvg}<span>Leaf-level AI detection</span></li>
          <li>${checkSvg}<span>High-resolution drone coverage</span></li>
          <li>${checkSvg}<span>Setup in minutes</span></li>
        </ul>
        <div class="demo-action-row">
          <a class="demo-button" href="/free-demo" data-route>Request a demo <span aria-hidden="true">&rarr;</span></a>
          <span class="demo-badge">No credit card needed</span>
        </div>
        <p class="demo-contact">Have a question? Reach us at <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a></p>
      </div>
    </section>
  `;
}

function cropsPage() {
  return `
    <div class="crops-page-wrap">
      <section class="crops-header-section">
        <span class="crops-eyebrow">Main crops</span>
        <h1 class="crops-main-title">Built for the crops that feed the world</h1>
        <p class="crops-main-subtitle">
          PhytoGuard AI delivers leaf-level visibility and AI-powered pest and disease detection across the row crops growers rely on most.
        </p>
      </section>

      <section class="crops-grid-section">
        <div class="crops-grid">
          ${cropList.map(cropCard).join('')}
        </div>
      </section>

      <section class="crops-bottom-banner-section">
        <div class="crops-bottom-banner">
          <h2 class="crop-banner-heading">Growing a different crops?</h2>
          <p class="crop-banner-text">
            Not every solution is crop-specific. Explore field-wide tools that help you monitor more area, save scouting time, and make better decisions across many crops.
          </p>
          <a class="crop-banner-btn" href="/how-it-works" data-route>
            Explore solutions <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </div>
  `;
}

function cropCard(crop) {
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

  return `
    <div class="hiw-page-wrap">
      <section class="hiw-header-section">
        <span class="hiw-eyebrow">How It Works</span>
        <h1 class="hiw-main-title">All your drone imagery. One AI intelligence platform.</h1>
        <p class="hiw-main-subtitle">
          Automated flight planning, leaf-level AI scanning, and orthomosaic stitching. All feeding into one place, so every acre stays under watch.
        </p>
        <div class="hiw-hero-actions">
          <a class="button primary hiw-hero-btn" href="/free-demo" data-route>Start free demo <span aria-hidden="true">&rarr;</span></a>
          <a class="button ghost hiw-ghost-btn" href="#platform-flows">Explore workflows &darr;</a>
        </div>
        <div class="hiw-trust-strip">
          <span class="trust-item"><span class="check-dot"></span>Zero proprietary flight hardware</span>
          <span class="trust-item"><span class="check-dot"></span>DJI &amp; Multispectral ready</span>
          <span class="trust-item"><span class="check-dot"></span>Centimeter-accurate GPS tagging</span>
        </div>
      </section>

      <section class="hiw-visual-section">
        <div class="hiw-telemetry-card">
          <div class="telemetry-glass-header">
            <div class="status-live-indicator"><span class="pulse-emerald"></span> Live Telemetry Feed</div>
            <span class="telemetry-version">PhytoGuard Core v3.4</span>
          </div>
          <div class="telemetry-preview-viewport">
            <img src="/assets/landing-demo-bg.png" alt="Multi-sensor agricultural intelligence field" />
            <div class="radar-scan-overlay" aria-hidden="true"></div>
            <div class="telemetry-chip chip-drone">
              <span class="chip-dot"></span>
              <span>🛸 Autonomous Flight Grid</span>
              <span class="chip-sub">Altitude: 18m · GSD: 0.4cm/px</span>
            </div>
            <div class="telemetry-chip chip-ai">
              <span class="chip-dot"></span>
              <span>🎯 AI Leaf Inspection</span>
              <span class="chip-sub">598 leaves analyzed · 4 alerts</span>
            </div>
            <div class="telemetry-chip chip-spray">
              <span class="chip-dot"></span>
              <span>🗺️ Variable-Rate Spray Map</span>
              <span class="chip-sub">Prescription ready for sprayer</span>
            </div>
          </div>
        </div>
      </section>

      <section id="platform-flows" class="hiw-flows-section">
        <div class="hiw-section-heading">
          <span class="hiw-section-eyebrow">What the platform delivers</span>
          <h2 class="hiw-section-title">End-to-end drone intelligence workflow</h2>
          <p class="hiw-section-lead">
            From autonomous waypoint flights to sub-millimeter AI leaf diagnosis and targeted prescription spray maps, PhytoGuard AI streamlines your crop protection.
          </p>
        </div>

        <div class="hiw-flows-grid">
          ${flowCard('Autonomous Flight', 'Fly your drone in automated waypoint grids tuned to your crop\'s needs, like pest detection, stand count, or canopy coverage.', ['Plan pattern', 'Fly & capture', 'High-res raw photos', 'Upload flight'], {
            icon: flightIcon,
            eyebrow: 'Aerial Capture',
            tag: 'Autonomous · Centimeter GSD',
            accent: '#2f6f43'
          })}
          ${flowCard('Leaf-Level AI Scan', 'Deep neural networks inspect every high-resolution aerial photo down to the leaf, detecting pests, blight, and nutrient stress before they spread.', ['Orthomosaic stitching', 'AI leaf scan', 'Severity scoring', 'Risk alerts'], {
            icon: leafAiIcon,
            eyebrow: 'Computer Vision',
            tag: 'Sub-millimeter · AI Diagnosis',
            accent: '#1b73e8'
          })}
          ${flowCard('Variable-Rate Spraying', 'Turn aerial detection reports directly into variable-rate prescription spray maps, exported to your sprayer so chemicals land only where needed.', ['Threat boundary', 'Prescription map', 'Sprayer export', 'Targeted treatment'], {
            icon: prescriptionIcon,
            eyebrow: 'Precision Agronomy',
            tag: 'Variable-Rate · ISO-XML Ready',
            accent: '#c9771e'
          })}
        </div>
      </section>

      <section class="hiw-pipeline-section">
        <div class="hiw-section-heading centered">
          <span class="hiw-section-eyebrow">End-to-End Execution</span>
          <h2 class="hiw-section-title">From sky to sprayer in four steps</h2>
        </div>
        <div class="hiw-pipeline-grid">
          <article class="pipeline-step">
            <span class="pipeline-step-badge">Phase 01</span>
            <h3>Capture Fields</h3>
            <p>Launch automated drone flight grids across your acreage with zero proprietary hardware lock-in.</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">Phase 02</span>
            <h3>AI Leaf Scan</h3>
            <p>Deep neural networks detect diseases, bugs, and stand counts down to individual plants.</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">Phase 03</span>
            <h3>Severity Scoring</h3>
            <p>Rank threats into High, Medium, and Low risk zones tagged with exact GPS coordinates.</p>
          </article>
          <article class="pipeline-step">
            <span class="pipeline-step-badge">Phase 04</span>
            <h3>Act & Spray</h3>
            <p>Export prescription spray maps straight to your sprayer or applicator with pinpoint chemical efficiency.</p>
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

function planCard(plan) {
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
          Explore ${plan.title} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </article>
  `;
}

function plansPage() {
  return `
    <div class="plans-page-wrap">
      <section class="plans-header-section">
        <span class="plans-eyebrow">Plans</span>
        <h1 class="plans-main-title">Built for every link in the crop value chain</h1>
        <p class="plans-main-subtitle">
          Pick the plan that matches how you work, whether you grow, process, advise, or insure. Every plan is powered by the same leaf-level AI crop protection platform.
        </p>
      </section>

      <section class="plans-grid-section">
        <div class="plans-grid">
          ${plans.map(planCard).join('')}
        </div>
      </section>

      <section class="plans-bottom-banner-section">
        <div class="plans-bottom-banner">
          <h2 class="plan-banner-heading">Still not sure which plan fits?</h2>
          <p class="plan-banner-text">
            Book a 20-minute demo. We'll look at your crops, acreage, and workflow, then point you to the right plan. No commitment.
          </p>
          <a class="plan-banner-btn" href="/free-demo" data-route>
            Book a free demo <span aria-hidden="true">&rarr;</span>
          </a>
          <p class="plan-contact-note">Have a question? Reach us at <a href="mailto:info@phytoguard.ai">info@phytoguard.ai</a></p>
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
  return `
    <div class="kb-page">
      <section class="kb-hero-banner">
        <div class="kb-hero-content-wrap">
          <div class="kb-hero-left">
            <h1 class="kb-hero-title">Hello. How can we help you?</h1>
            <div class="kb-search-box-wrap">
              <input
                type="text"
                id="kb-search-input"
                class="kb-search-input"
                placeholder="Search for answers..."
                autocomplete="off"
                aria-label="Search knowledge base articles"
              />
              <button class="kb-search-btn" type="button" id="kb-search-trigger" aria-label="Search">
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
                  <span class="kb-bbox-badge">AI 98.4% · Late Blight</span>
                </div>
                <div class="kb-mockup-hud">
                  <span class="kb-hud-dot"></span>
                  <span>Autonomous Drone Feed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="kb-main-container">
        <div id="kb-no-results" class="kb-no-results" style="display: none;">
          <div class="no-results-icon">🔍</div>
          <h3>No matching articles found</h3>
          <p>Try searching for keywords like "drone", "blight", "mission", "export", or "flight".</p>
          <button class="button secondary" type="button" id="kb-clear-search-btn">Clear Search</button>
        </div>

        <div class="kb-categories-grid" id="kb-categories-grid">
          ${kbCategories.map(cat => `
            <article class="kb-category-card" data-cat-id="${cat.id}">
              <div class="kb-cat-icon-badge" aria-hidden="true">
                ${getKbIcon(cat.icon)}
              </div>
              <h2 class="kb-cat-title">${cat.title}</h2>
              <p class="kb-cat-subtitle">${cat.subtitle}</p>
              <ul class="kb-article-links">
                ${cat.articles.map(art => `
                  <li class="kb-article-item" data-art-slug="${art.slug}">
                    <a href="#${art.slug}" class="kb-article-link" data-kb-slug="${art.slug}">
                      ${art.title}
                    </a>
                  </li>
                `).join('')}
              </ul>
              <a href="#cat-${cat.id}" class="kb-see-more-link" data-kb-cat="${cat.id}">See more &rarr;</a>
            </article>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Article Modal Dialog -->
      <div id="kb-article-modal" class="kb-modal-backdrop" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="kb-modal-title">
        <div class="kb-modal-dialog">
          <div class="kb-modal-header">
            <div class="kb-modal-breadcrumbs">
              <span id="kb-modal-cat-crumb">Knowledge Base</span>
              <span class="crumb-separator">/</span>
              <span class="crumb-current">Article</span>
            </div>
            <button type="button" class="kb-modal-close-btn" id="kb-modal-close" aria-label="Close article">&times;</button>
          </div>
          <div class="kb-modal-body">
            <h2 id="kb-modal-title" class="kb-modal-heading"></h2>
            <div class="kb-modal-meta">
              <span class="kb-badge-pill">Drone Scouting Standard</span>
              <span class="kb-reading-time">3 min read</span>
            </div>
            <div id="kb-modal-content" class="kb-modal-prose"></div>
          </div>
          <div class="kb-modal-footer">
            <div class="kb-helpful-prompt" id="kb-helpful-container">
              <span>Was this article helpful?</span>
              <button type="button" class="kb-feedback-btn" id="kb-feedback-yes">Yes 👍</button>
              <button type="button" class="kb-feedback-btn" id="kb-feedback-no">No 👎</button>
            </div>
            <button type="button" class="button secondary" id="kb-modal-done-btn">Back to Knowledge Base</button>
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

    if (modalCatCrumb) modalCatCrumb.textContent = foundCategory.title;
    if (modalTitle) modalTitle.textContent = foundArticle.title;
    if (modalContent) modalContent.innerHTML = foundArticle.content;
    if (helpfulContainer) {
      helpfulContainer.innerHTML = `
        <span>Was this article helpful?</span>
        <button type="button" class="kb-feedback-btn" id="kb-feedback-yes">Yes 👍</button>
        <button type="button" class="kb-feedback-btn" id="kb-feedback-no">No 👎</button>
      `;
      const yesBtn = helpfulContainer.querySelector('#kb-feedback-yes');
      const noBtn = helpfulContainer.querySelector('#kb-feedback-no');
      if (yesBtn) yesBtn.onclick = () => { helpfulContainer.innerHTML = '<em>Thank you for your feedback!</em>'; };
      if (noBtn) noBtn.onclick = () => { helpfulContainer.innerHTML = '<em>Thank you for your feedback!</em>'; };
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
        if (art && (
          art.title.toLowerCase().includes(query) ||
          art.excerpt.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query) ||
          cat.title.toLowerCase().includes(query)
        )) {
          item.style.display = '';
          catMatches++;
          totalMatches++;
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
        searchCount.textContent = `Found ${totalMatches} article${totalMatches === 1 ? '' : 's'} matching "${query}"`;
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
    navigate('/dashboard');
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
            
            <h1 class="auth-title">Welcome</h1>
            <p class="auth-subtitle">Please log in to your account</p>

            <div id="login-alert" class="auth-alert-box" style="display: none;"></div>

            <form id="login-form" class="auth-form" novalidate>
              <div class="auth-input-group" id="group-login-user">
                <input id="login-username" class="auth-input" type="text" placeholder=" " required autocomplete="username" value="ador@phytoguard.ai" />
                <label class="auth-floating-label" for="login-username">Username or Email Address<span class="req-star">*</span></label>
              </div>

              <div class="auth-input-group" id="group-login-pass">
                <input id="login-password" class="auth-input has-toggle" type="password" placeholder=" " required autocomplete="current-password" value="password123" />
                <label class="auth-floating-label" for="login-password">Password<span class="req-star">*</span></label>
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
                  <span>Remember me</span>
                </label>
                <span class="demo-credential-hint">Demo: ador@phytoguard.ai / password123</span>
              </div>

              <button class="auth-btn-primary" type="submit" id="login-submit-btn">Sign In</button>

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
                <a class="auth-signup-cta" href="/signup" data-route>Sign Up</a>
                <a class="auth-forgot-link" href="#forgot">Forgot password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      ${chatWidget()}
    </div>
  `;
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

function dashboardPage() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    navigate('/login');
    return '';
  }

  return `
    <div class="dashboard-page-container">
      <!-- Top Overview Bar -->
      <div class="dash-top-bar">
        <div class="dash-welcome">
          <div class="dash-session-pill">
            <span class="live-dot" aria-hidden="true"></span>
            <span>Drone RTK Gateway Active</span>
          </div>
          <h1 class="dash-greeting">Welcome back, <span class="dash-user-highlight">${currentUser.name}</span> 👋</h1>
          <p class="dash-subtitle">Autonomous Drone Crop Protection &amp; Leaf-Level Pathology Monitor</p>
        </div>
        <div class="dash-actions">
          <a class="button primary dash-flight-btn" href="/free-demo" data-route>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>+ Plan Drone Mission</span>
          </a>
          <button class="button secondary dash-export-btn" type="button" onclick="window.print()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <!-- Metric KPI Cards -->
      <div class="dash-metrics-grid">
        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-green-light">
            <span class="metric-emoji">🌾</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">Monitored Acreage</span>
            <strong class="metric-value">450 <span class="metric-unit">Hectares</span></strong>
            <span class="metric-sub text-green">Across 6 Crop Sectors</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-blue-light">
            <span class="metric-emoji">🚁</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">Drone Missions</span>
            <strong class="metric-value">28 <span class="metric-unit">Flights</span></strong>
            <span class="metric-sub text-blue">1 Mission Scheduled Today</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-amber-light">
            <span class="metric-emoji">🦠</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">Active Pathologies</span>
            <strong class="metric-value">4 <span class="metric-unit">Alerts</span></strong>
            <span class="metric-sub text-amber">Early Blight &amp; Yellow Rust</span>
          </div>
        </div>

        <div class="dash-metric-card">
          <div class="metric-icon-wrap bg-emerald-light">
            <span class="metric-emoji">📈</span>
          </div>
          <div class="metric-info">
            <span class="metric-label">Canopy Health (NDVI)</span>
            <strong class="metric-value">0.82 <span class="metric-unit">Index</span></strong>
            <span class="metric-sub text-green">+3.8% Optimal vigor</span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Content Grid -->
      <div class="dash-content-grid">
        <!-- Monitored Crop Fields (6 Crops) -->
        <div class="dash-panel fields-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Monitored Crop Sectors</h2>
              <p class="panel-sub">Real-time leaf pathology &amp; drone status for registered crops</p>
            </div>
            <a class="panel-link" href="/crops" data-route>All Crops &rarr;</a>
          </div>

          <div class="dash-fields-list">
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
          </div>
        </div>

        <!-- Right Side: Drone Fleet & Recent Operations -->
        <div class="dash-sidebar">
          <!-- Drone Hardware Status -->
          <div class="dash-panel drone-panel">
            <div class="panel-header">
              <h2 class="panel-title">Drone Fleet Status</h2>
              <span class="status-live-chip">2 Drones Online</span>
            </div>
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

          <form id="demo-request-form" class="demo-form" onsubmit="event.preventDefault(); document.getElementById('demo-request-form').classList.add('is-submitted');">
            
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

function handleLoginSubmit() {
  const usernameInput = document.querySelector('#login-username');
  const passwordInput = document.querySelector('#login-password');
  const alertBox = document.querySelector('#login-alert');

  if (!usernameInput || !passwordInput) return;
  const usernameOrEmail = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!usernameOrEmail || !password) {
    showAuthAlert(alertBox, 'Please enter both your email/username and password.', 'error');
    return;
  }

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

function handleSignupSubmit() {
  const firstInput = document.querySelector('#signup-firstname');
  const lastInput = document.querySelector('#signup-lastname');
  const emailInput = document.querySelector('#signup-email');
  const phoneInput = document.querySelector('#signup-phone');
  const passInput = document.querySelector('#signup-password');
  const alertBox = document.querySelector('#signup-alert');

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

  const users = getStoredUsers();
  const existingUser = users.find((u) => (u.email || '').toLowerCase() === email);
  if (existingUser) {
    showAuthAlert(alertBox, 'An account with this email already exists. Please log in.', 'error');
    return;
  }

  const newUser = {
    name: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    email,
    phone,
    password,
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
  const cropSlug = path.startsWith('/crops/') ? path.split('/').pop() : '';
  const crop = cropList.find((item) => item.slug === cropSlug);
  let page = '';
  if (path === '/') page = homePage();
  else if (path === '/crops') page = cropsPage();
  else if (path === '/crops/all') page = allCropsPage();
  else if (crop) page = cropDetailPage(crop);
  else if (path === '/how-it-works') page = howItWorksPage();
  else if (path === '/plans') page = plansPage();
  else if (path === '/knowledge-base') page = knowledgeBasePage();
  else if (path === '/dashboard') page = dashboardPage();
  else if (path === '/login') page = loginPage();
  else if (path === '/signup') page = signupPage();
  else if (path === '/free-demo') page = freeDemoPage();
  else {
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

  if (path === '/knowledge-base') {
    setupKnowledgeBaseEvents();
  }

  document.body.dataset.path = path;
  if (path === '/login') document.title = 'PhytoGuard AI - Log In';
  else if (path === '/signup') document.title = 'PhytoGuard AI - Create Account';
  else if (path === '/free-demo') document.title = 'PhytoGuard AI - Start Your Free Demo';
  else if (path === '/dashboard') document.title = 'PhytoGuard AI - Drone Dashboard';
  else if (path === '/crops') document.title = 'PhytoGuard AI - Main Crops';
  else if (path === '/how-it-works') document.title = 'PhytoGuard AI - How It Works';
  else if (path === '/plans') document.title = 'PhytoGuard AI - Plans & Pricing';
  else if (path === '/knowledge-base') document.title = 'PhytoGuard AI - Knowledge Base & Help Center';
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
