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
    title: 'Crop disease detection',
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
      'AI crop disease, pathogen, and stress detection',
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
      'AI crop disease, pathogen, and stress detection',
      'Severity scoring across fields',
      'Geo Dashboard',
      'GPS-tagged findings',
      'Field history and trend tracking',
      'Prescription maps for targeted action',
    ],
  },
];

export const features = [
  ['Crop disease detection', 'From Early blight to Late blight and foliar pathogens, AI identifies diseases at the leaf level before visible signs spread.'],
  ['Scout more on every visit', 'Cover more ground in less time and get a fuller picture of field status.'],
  ['Severity scoring', 'High, medium, and low risk ratings so you know exactly where to act first.'],
  ['New infection alerts', 'Get notified the moment fresh threats like late blight or early blight are flagged in your fields.'],
  ['Treatment guidance', 'Turn report findings into targeted spray plans and agronomy recommendations fast.'],
  ['One crop intelligence hub', 'Inspection photos, risk maps, and agronomy reports, all in one place, on any device.'],
];

export { kbCategories } from './kb-data.js';

export const diseaseRecommendations = {
  'Yellow Rust': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply targeted Tebuconazole fungicide spray via DJI Agras drone within 48h to contain pustule spread.',
    bn: 'ছত্রাক বিস্তার রোধে পরবর্তী ৪৮ ঘণ্টার মধ্যে ডিজেআই আগ্রাস ড্রোনের মাধ্যমে টেবুকোনাজল ছত্রাকনাশক স্প্রে করুন।',
  },
  'Late Blight': {
    severity: 'danger',
    icon: '🚨',
    en: 'Immediate Metalaxyl-M / Ridomil spray required; restrict overhead irrigation and re-scan in 72h.',
    bn: 'অবিলম্বে রিডোমিল গোল্ড / মেটালাক্সিল স্প্রে করুন; সেচ সীমিত করুন এবং ৭২ ঘণ্টার মধ্যে পুনরায় ড্রোন স্ক্যান করুন।',
  },
  'Downy Mildew': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply Mandipropamid foliar treatment and enhance trellis ventilation to reduce humidity.',
    bn: 'ম্যানডিপথ্রোপামিড স্প্রে প্রয়োগ করুন এবং মাচায় বায়ু চলাচল বৃদ্ধি করে পাতার আর্দ্রতা কমান।',
  },
  'Early Blight': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply Difenoconazole treatment to lesion spots; optimize nitrogen and prune lower foliage.',
    bn: 'আক্রান্ত দাগে ডিফেনোকোনাজল স্প্রে করুন; নাইট্রোজেনের ভারসাম্য রাখুন ও নিচের পাতা ছাঁটুন।',
  },
  'Powdery Mildew': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply sulphur-based micronized spray; improve canopy aeration and monitor humidity levels.',
    bn: 'সালফারযুক্ত স্প্রে প্রয়োগ করুন; ফসলের বায়ু চলাচল বাড়ান এবং আর্দ্রতা পর্যবেক্ষণ করুন।',
  },
  'Septoria': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply foliar Azoxystrobin spray and maintain RTK precision buffer lines to stop spore drift.',
    bn: 'স্পোর ছড়ানো থামাতে অ্যাজক্সিস্ট্রবিন স্প্রে করুন এবং আরটিকে বাফার লাইন বজায় রাখুন।',
  },
  'Fusarium': {
    severity: 'danger',
    icon: '🚨',
    en: 'Apply Prothioconazole at early anthesis; avoid overhead irrigation during flowering.',
    bn: 'ফুল আসার শুরুতে প্রোথিওকোনাজল স্প্রে করুন; ফুল ফোটার সময় অতিরিক্ত সেচ এড়িয়ে চলুন।',
  },
  'Bacterial Spot': {
    severity: 'danger',
    icon: '🚨',
    en: 'Apply copper hydroxide bactericide combined with Mancozeb via precision drone nozzle.',
    bn: 'কপার ব্যাক্টেরিসাইড ও ম্যানকোজেব মিশ্রণ প্রিসিশন ড্রোন নজলের মাধ্যমে স্প্রে করুন।',
  },
  'Tomato Mosaic Virus': {
    severity: 'danger',
    icon: '🚨',
    en: 'Sanitize tools and isolate infected vines immediately; manage insect vectors with targeted treatments.',
    bn: 'আক্রান্ত গাছ দ্রুত আলাদা করুন ও যন্ত্রপাতি জীবাণুমুক্ত করুন; বাহক পোকা দমনে ব্যবস্থা নিন।',
  },
  'Soybean Rust': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply preventative Strobilurin / Triazole fungicide; schedule follow-up multispectral scan in 5 days.',
    bn: 'স্ট্রবিলুরিন ছত্রাকনাশক স্প্রে করুন এবং ৫ দিনের মধ্যে ফলো-আপ ড্রোন স্ক্যান পরিচালনা করুন।',
  },
  'Sudden Death Syndrome': {
    severity: 'danger',
    icon: '🚨',
    en: 'Improve field drainage trenches; record GPS coordinates for resistant seed varietal planning.',
    bn: 'জমির নিষ্কাশন নালা উন্নত করুন এবং পরবর্তী মৌসুমের জন্য জিপিএস অবস্থান সংরক্ষণ করুন।',
  },
  'Brown Stem Rot': {
    severity: 'warn',
    icon: '💡',
    en: 'Avoid canopy injury; optimize crop rotation and plan post-harvest deep tillage.',
    bn: 'গাছের আঘাত এড়িয়ে চলুন; ফসল চক্র অনুসরণ করুন এবং ফসল তোলার পর গভীর চাষ দিন।',
  },
  'Anthracnose': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply protective Chlorothalonil barrier; avoid working in fields while vines are wet with dew.',
    bn: 'ক্লোরোথালোনিল প্রতিরোধক স্প্রে দিন; সকালের শিশিরে ভেজা অবস্থায় মাঠে কাজ করা থেকে বিরত থাকুন।',
  },
  'Angular Leaf Spot': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply fixed copper bactericide; minimize plant handling and avoid overhead sprinkler splash.',
    bn: 'কপার ব্যাক্টেরিসাইড স্প্রে করুন; গাছের পাতা নাড়াচাড়া কমান এবং উপরিভাগের সেচ এড়িয়ে চলুন।',
  },
  'Colorado Potato Beetle': {
    severity: 'danger',
    icon: '🚨',
    en: 'Apply targeted Spinosad bio-insecticide; scout egg clusters on leaf undersides.',
    bn: 'স্পিনোস্যাড বায়ো-কীটনাশক প্রয়োগ করুন এবং পাতার নিচে ডিমের গুচ্ছ নিয়মিত পর্যবেক্ষণ করুন।',
  },
  'Black Rot': {
    severity: 'warn',
    icon: '💡',
    en: 'Apply Myclobutanil preventative spray; manually remove mummified berries from vine trellis wires.',
    bn: 'মাইক্লোবুটানিল প্রতিরোধক স্প্রে দিন এবং তারে লেগে থাকা শুকনো ও পচা আঙুর অপসারণ করুন।',
  },
};

/**
 * Generate a short, actionable agronomic recommendation for any detected disease
 */
export function getDiseaseRecommendation(diseaseName, cropName = '', lang = 'en') {
  if (!diseaseName || typeof diseaseName !== 'string') return null;
  const isBn = lang === 'bn';
  const clean = diseaseName.toLowerCase().trim();

  // If healthy or clean, no disease detected
  if (
    clean.includes('clean') ||
    clean.includes('healthy') ||
    clean.includes('optimal') ||
    clean.includes('clear') ||
    clean === 'ok' ||
    clean === 'verified' ||
    clean === 'registered' ||
    clean === 'scanning'
  ) {
    return null;
  }

  // Exact or partial match in registry
  for (const [key, data] of Object.entries(diseaseRecommendations)) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return {
        disease: key,
        severity: data.severity || 'warn',
        icon: data.icon || '💡',
        text: isBn ? data.bn : data.en,
        actionTag: isBn 
          ? (data.severity === 'danger' ? 'জরুরি পদক্ষেপ' : 'এআই সুপারিশ') 
          : (data.severity === 'danger' ? 'Urgent Action' : 'AI Recommendation')
      };
    }
  }

  // Fallback for custom detected pathology
  return {
    disease: diseaseName,
    severity: 'warn',
    icon: '💡',
    text: isBn 
      ? 'অনুমোদিত ছত্রাকনাশক স্প্রে করুন এবং পরবর্তী ৭২ ঘণ্টার মধ্যে ফলো-আপ ড্রোন স্ক্যান পরিচালনা করুন।'
      : 'Apply targeted foliar treatment; schedule follow-up drone scan within 72 hours.',
    actionTag: isBn ? 'এআই সুপারিশ' : 'AI Recommendation'
  };
}

