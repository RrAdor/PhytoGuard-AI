// PhytoGuard AI - Bangladesh (BD) Agricultural Knowledge Base
// Grounded in CAAB Drone Rules 2020, DAE/BARI crop protection guidelines,
// and Bangladesh agro-ecological regions (Bogura, Dinajpur, Munshiganj, Rajshahi, Jashore, Lakshmipur).

export const kbCategories = [
  {
    id: 'getting-started',
    icon: 'rocket',
    title: 'Getting Started in Bangladesh',
    title_bn: 'বাংলাদেশে ফাইটোগার্ডের সাথে শুরু করুন',
    subtitle: 'Autonomous drone crop protection for Bangladeshi farms',
    subtitle_bn: 'বাংলাদেশের কৃষিজমির জন্য স্বয়ংক্রিয় ড্রোন প্রযুক্তি',
    articles: [
      {
        slug: 'getting-started-faq',
        title: 'Getting Started with Drone Agronomy in BD',
        title_bn: 'বাংলাদেশে ড্রোন কৃষিশিক্ষা ও প্রাথমিক জিজ্ঞাসা',
        excerpt: 'Overview of PhytoGuard AI across Bangladeshi agricultural landscapes, CAAB compliance, and Bigha/Decimal plot setup.',
        excerpt_bn: 'বাংলাদেশের কৃষিজমি, সিএএবি ড্রোন নীতিমালা এবং বিঘা/শতক ভিত্তিতে প্লট সেটআপের প্রাথমিক রূপরেখা।',
        content: `<h3>What is PhytoGuard AI in Bangladesh?</h3>
<p>PhytoGuard AI is an autonomous commercial drone intelligence platform engineered specifically for the agro-ecological conditions of Bangladesh. By deploying RTK-guided commercial drones over agricultural fields in Bogura, Dinajpur, Munshiganj, Rajshahi, and Jashore, our platform captures high-resolution imagery and diagnoses crop pathologies at the sub-millimeter leaf level.</p>
<h4>Prerequisites for Bangladeshi Farms:</h4>
<ul>
  <li><strong>Supported Drone Aircraft:</strong> CAAB-compliant commercial drone (e.g. DJI Mavic 3 Multispectral, Mavic 3 Enterprise, or Mavic Air 2S).</li>
  <li><strong>Field Boundary Registration:</strong> Cadastral plot boundaries measured in local Bangladeshi units (<strong>Bigha</strong>, <strong>Decimal/Shotok</strong>, or <strong>Hectares</strong>).</li>
  <li><strong>Regulatory Clearance:</strong> Compliance with the <em>Civil Aviation Authority of Bangladesh (CAAB) Drone Rules 2020</em>.</li>
  <li><strong>Active PhytoGuard Account:</strong> Web and mobile dashboard access for farm managers and agronomists.</li>
</ul>`,
        content_bn: `<h3>বাংলাদেশে ফাইটোগার্ড এআই কী?</h3>
<p>ফাইটোগার্ড এআই হলো বাংলাদেশের কৃষি-পরিবেশগত বৈশিষ্ট্যের উপযোগী একটি স্বয়ংক্রিয় বাণিজ্যিক ড্রোন প্ল্যাটফর্ম। বগুড়া, দিনাজপুর, মুন্সীগঞ্জ, রাজশাহী ও যশোরের মতো প্রধান শস্য উৎপাদনকারী অঞ্চলে আরটিকে (RTK) চালিত ড্রোন উড্ডয়নের মাধ্যমে মিলিমিটার-স্তরের নিখুঁত ছবি সংগ্রহ করে ফসলের রোগবালাই শনাক্ত করা হয়।</p>
<h4>বাংলাদেশি খামারিদের জন্য প্রয়োজনীয় শর্তাবলী:</h4>
<ul>
  <li><strong>অনুমোদিত ড্রোন:</strong> সিএএবি (CAAB) অনুমোদিত বাণিজ্যিক ড্রোন (যেমন: ডিজেআই ম্যাভিক ৩ মাল্টিস্পেকট্রাল, ম্যাভিক ৩ এন্টারপ্রাইজ)।</li>
  <li><strong>জমির সীমানা নির্ধারণ:</strong> দেশীয় পরিমাপে (<strong>বিঘা</strong>, <strong>শতক/শতাংশ</strong>, বা <strong>হেক্টর</strong>) প্লটের সঠিক সীমানা।</li>
  <li><strong>আইনি সম্মতি:</strong> <em>বেসামরিক বিমান চলাচল কর্তৃপক্ষ (সিএএবি) ড্রোন উড্ডয়ন নীতিমালা ২০২০</em> অনুসরণ।</li>
  <li><strong>সক্রিয় ফাইটোগার্ড অ্যাকাউন্ট:</strong> খামার ব্যবস্থাপক ও কৃষিবিদদের জন্য ড্যাশবোর্ড সুবিধা।</li>
</ul>`
      },
      {
        slug: 'download-apps',
        title: 'How to Download PhytoGuard Apps in BD?',
        title_bn: 'বাংলাদেশে ফাইটোগার্ড অ্যাপ কীভাবে ডাউনলোড করবেন?',
        excerpt: 'Download PhytoGuard Sky and Sky+ flight planner apps for DJI Smart Controllers with offline caching for rural BD.',
        excerpt_bn: 'ডিজেআই কন্ট্রোলারে ফাইটোগার্ড স্কাই অ্যাপ ইনস্টলেশন ও গ্রামীণ এলাকায় অফলাইন ক্যাশিং নির্দেশিকা।',
        content: `<h3>Downloading PhytoGuard Sky for Bangladeshi Operations</h3>
<p>PhytoGuard provides dedicated autonomous flight software designed to operate reliably on DJI Smart Controllers (Enterprise Smart Controller, RC Pro) and Android tablets, even in rural Upazilas with intermittent 4G/LTE mobile coverage:</p>
<ul>
  <li><strong>PhytoGuard Sky:</strong> Designed for standard RGB foliar scouting on DJI Mavic Air 2S and Mavic 2 Pro drones.</li>
  <li><strong>PhytoGuard Sky+:</strong> Calibrated for 5-band multispectral sensors (RGB + RedEdge + NIR) on DJI Mavic 3 Multispectral.</li>
</ul>
<h4>Installation Steps:</h4>
<ol>
  <li>Connect your DJI RC Pro or Android tablet to Wi-Fi or a local mobile hotspot (Grameenphone, Banglalink, Robi).</li>
  <li>Open the browser, log in to your PhytoGuard AI dashboard, and navigate to <em>Downloads</em>.</li>
  <li>Install the APK and grant location, storage, and USB telemetry permissions.</li>
  <li><strong>Offline Map Caching:</strong> Before traveling to remote union fields (e.g. char lands or river floodplains), download offline satellite base maps directly in the app.</li>
</ol>`,
        content_bn: `<h3>বাংলাদেশে ফাইটোগার্ড স্কাই অ্যাপ ডাউনলোড</h3>
<p>বাংলাদেশের প্রত্যন্ত ইউনিয়ন ও চরাঞ্চলে যেখানে ইন্টারনেটের গতি ওঠানামা করে, সেখানেও নির্বিঘ্নে পরিচালনার জন্য ফাইটোগার্ড স্কাই অ্যাপে অফলাইন মোড রয়েছে:</p>
<ul>
  <li><strong>ফাইটোগার্ড স্কাই:</strong> ডিজেআই ম্যাভিক এয়ার ২এস এবং ম্যাভিক ২ প্রো এর সাধারণ আরজিবি নজরদারির জন্য।</li>
  <li><strong>ফাইটোগার্ড স্কাই+:</strong> ডিজেআই ম্যাভিক ৩ মাল্টিস্পেকট্রাল ক্যামেরার জন্য বিশেষভাবে ক্যালিব্রেট করা।</li>
</ul>
<h4>ইনস্টলেশন ধাপসমূহ:</h4>
<ol>
  <li>আপনার ডিজেআই আরসি প্রো কন্ট্রোলারটি ইন্টারনেট বা মোবাইল হটস্পটের সাথে সংযুক্ত করুন।</li>
  <li>ব্রাউজারে ফাইটোগার্ড ড্যাশবোর্ডে লগইন করে <em>Downloads</em> সেকশন থেকে এপিকে (APK) নামিয়ে নিন।</li>
  <li>লোকেশন ও ইউএসবি পারমিশন নিশ্চিত করে ইনস্টল সম্পন্ন করুন।</li>
  <li><strong>অফলাইন ম্যাপ সেভ:</strong> চরাঞ্চল বা দূরবর্তী মাঠে যাওয়ার পূর্বে অ্যাপের ভেতরে প্রয়োজনীয় মৌজা বা প্লটের অফলাইন ম্যাপ ডাউনলোড করে রাখুন।</li>
</ol>`
      },
      {
        slug: 'supported-hardware',
        title: 'Supported Drone Hardware & RTK in Bangladesh',
        title_bn: 'বাংলাদেশে অনুমোদিত ড্রোন হার্ডওয়্যার ও আরটিকে সরঞ্জাম',
        excerpt: 'List of verified commercial drones legally importable and operable under CAAB guidelines and DAE standards.',
        excerpt_bn: 'সিএএবি নীতিমালা ও কৃষি সম্প্রসারণ অধিদপ্তরের মানদণ্ড অনুযায়ী অনুমোদিত ড্রোন ও আরটিকে তালিকা।',
        content: `<h3>Verified Commercial Hardware in Bangladesh</h3>
<p>PhytoGuard AI integrates directly with commercially available drone hardware legally importable under Bangladesh customs and CAAB clearance:</p>
<ul>
  <li><strong>DJI Mavic 3 Multispectral:</strong> Dual-imaging system with 4/3 CMOS 20MP RGB camera and 4 × 5MP multispectral sensors (Green, Red, RedEdge, Near-Infrared). Optimal for potato late blight and wheat blast early detection.</li>
  <li><strong>DJI Mavic 3 Enterprise:</strong> Mechanical shutter (0.7s interval) and 56× hybrid zoom for high-speed foliar canopy capture across large Bigha acreage.</li>
  <li><strong>DJI Agras Series (T30, T40, T50):</strong> Direct export of variable-rate prescription shapefiles for automated targeted fungicide and micronutrient spraying.</li>
  <li><strong>RTK Ground Stations:</strong> DJI D-RTK 2 high-precision GNSS mobile station and Survey of Bangladesh (SoB) permanent reference stations for centimeter-grade GPS geotagging.</li>
</ul>`,
        content_bn: `<h3>বাংলাদেশে পরীক্ষিত ও অনুমোদিত ড্রোন হার্ডওয়্যার</h3>
<p>বাংলাদেশের কাস্টমস ও সিএএবি নীতিমালা মেনে বৈধভাবে আমদানিযোগ্য ও পরিচালনযোগ্য ড্রোনসমূহ ফাইটোগার্ডের সাথে সরাসরি সামঞ্জস্যপূর্ণ:</p>
<ul>
  <li><strong>ডিজেআই ম্যাভিক ৩ মাল্টিস্পেকট্রাল:</strong> ২০ মেগাপিক্সেল আরজিবি ক্যামেরা এবং ৪টি ৫ মেগাপিক্সেল মাল্টিস্পেকট্রাল সেন্সরযুক্ত। আলু ও গমের ব্লাইট ও মরিচা রোগ নির্ণয়ে সেরা।</li>
  <li><strong>ডিজেআই ম্যাভিক ৩ এন্টারপ্রাইজ:</strong> দ্রুতগতির মেকানিক্যাল শাটার যুক্ত, যা বৃহৎ বাণিজ্যিক জমিতে দ্রুত ফ্রেম তুলতে সক্ষম।</li>
  <li><strong>ডিজেআই এগ্রাস সিরিজ (T30, T40, T50):</strong> প্রিসিশন ছত্রাকনাশক ও বালাইনাশক স্প্রে করার জন্য তৈরি হেভি-ডিউটি স্প্রে ড্রোন।</li>
  <li><strong>আরটিকে বেস স্টেশন:</strong> সেন্টিমিটার-লেভেলের নিখুঁত জিপিএস ম্যাপিং নিশ্চিত করতে ডি-আরটিকে ২ স্টেশন।</li>
</ul>`
      },
      {
        slug: 'recommended-drone-kits',
        title: 'Recommended Drone Kits for Bangladesh Climate',
        title_bn: 'বাংলাদেশের আবহাওয়ার জন্য উপযোগী ড্রোন ফিল্ড কিট',
        excerpt: 'Field gear optimized for high humidity, morning winter fog, and rural power resilience in Bangladesh.',
        excerpt_bn: 'উচ্চ আর্দ্রতা, শীতের ঘন কুয়াশা ও গ্রামীণ লোডশেডিং মোকাবিলায় প্রয়োজনীয় মাঠ পর্যায়ের সরঞ্জাম।',
        content: `<h3>Field Kit Recommendations for Bangladeshi Agro-Climates</h3>
<p>Operating drones in rural Bangladesh requires equipment prepared for distinct seasonal extremes—from heavy winter morning dew (Rabi season) to intense 38°C–42°C summer heat in Rajshahi:</p>
<ul>
  <li><strong>Aircraft:</strong> DJI Mavic 3 Multispectral with top-mounted RTK module.</li>
  <li><strong>Batteries:</strong> 4–6 Intelligent Flight Batteries (providing coverage for 150–200 Bighas per scouting day).</li>
  <li><strong>Rural Power Backup:</strong> 1000W portable power station or 100W vehicle inverter charger to counter rural load-shedding during field missions.</li>
  <li><strong>Storage:</strong> High-speed V30/U3 MicroSD cards (minimum 128GB, 160MB/s read/write).</li>
  <li><strong>Field Safety:</strong> Heavy-duty foldable landing pad (to prevent mud and paddy stubble from fouling drone propellers on narrow field bunds/আইল), handheld digital anemometer, and anti-glare tablet hood.</li>
</ul>`,
        content_bn: `<h3>বাংলাদেশি আবহাওয়ার জন্য ফিল্ড কিট প্যাকেজ</h3>
<p>তীব্র কুয়াশা, উচ্চ আর্দ্রতা কিংবা রাজশাহীর তীব্র গরমের মধ্যে মাঠপর্যায়ে ড্রোন পরিচালনায় নিচের সরঞ্জামগুলো থাকা বাঞ্ছনীয়:</p>
<ul>
  <li><strong>ড্রোন:</strong> আরটিকে মডিউলসহ ডিজেআই ম্যাভিক ৩ মাল্টিস্পেকট্রাল।</li>
  <li><strong>ব্যাটারি:</strong> ৪ থেকে ৬টি ফ্লাইট ব্যাটারি (প্রতিদিন ১৫০-২০০ বিঘা জমি স্ক্যান করার জন্য)।</li>
  <li><strong>পাওয়ার ব্যাকআপ:</strong> গ্রামীণ লোডশেডিং মোকাবিলায় ১০০০ ওয়াটের পোর্টেবল ব্যাটারি স্টেশন অথবা ১০০ ওয়াটের কার চার্জার।</li>
  <li><strong>মেমোরি কার্ড:</strong> উচ্চগতির ১২৮ জিবি V30/U3 মাইক্রোএসডি কার্ড।</li>
  <li><strong>মাঠ নিরাপত্তা:</strong> সরু মাটির আইল ও কাদা থেকে প্রপেলার বাঁচাতে ওয়াটারপ্রুফ ল্যান্ডিং প্যাড ও বাতাসের গতি মাপার অ্যানিমোমিটার।</li>
</ul>`
      },
      {
        slug: 'what-is-phytoguard',
        title: 'What is PhytoGuard AI for Bangladeshi Agriculture?',
        title_bn: 'বাংলাদেশের কৃষিতে ফাইটোগার্ড এআই-এর ভূমিকা কী?',
        excerpt: 'Why sub-millimeter drone imagery succeeds where free satellite imagery fails on fragmented 1-3 Bigha Bangladeshi plots.',
        excerpt_bn: 'বাংলাদেশের ১-৩ বিঘার খণ্ড খণ্ড জমিতে স্যাটেলাইট ব্যর্থ হলেও ড্রোন কেন শতভাগ সফল।',
        content: `<h3>Sub-Millimeter Drone Vision vs. Coarse Satellite Data</h3>
<p>In Bangladesh, over 80% of agricultural land is fragmented into smallholder plots ranging from 1 to 5 Bighas, separated by narrow earthen levees (আইল) and intercropped with diverse vegetables. Free satellite imagery (such as Sentinel-2 or Landsat) provides 10 to 30 meters per pixel, meaning a single pixel averages an entire Bigha, entirely missing localized fungal spots.</p>
<p>PhytoGuard AI deploys low-altitude autonomous drones (15–20 meters above canopy) delivering <strong>0.38 to 0.45 cm/pixel Ground Sample Distance (GSD)</strong>. Our deep learning convolutional neural network inspects individual tomato, potato, and wheat leaves, pinpointing foliar fungal lesions 10 to 14 days before symptoms can be spotted by walking the field edges.</p>`,
        content_bn: `<h3>সাব-মিলিমিটার ড্রোন ভিশন বনাম স্যাটেলাইট ডেটা</h3>
<p>বাংলাদেশে শতকরা ৮০ ভাগ কৃষিজমি ১ থেকে ৫ বিঘার ছোট ছোট খণ্ডে বিভক্ত, যার চারপাশে মাটির আইল থাকে এবং প্রায়শই মিশ্র ফসল চাষ হয়। প্রচলিত ফ্রি স্যাটেলাইট চিত্রে প্রতিটি পিক্সেল ১০ থেকে ৩০ মিটার জায়গা দেখায়, ফলে পুরো এক বিঘা জমি মাত্র কয়েকটি পিক্সেলে হারিয়ে যায় এবং প্রাথমিক রোগ শনাক্ত করা অসম্ভব হয়।</p>
<p>ফাইটোগার্ড এআই মাত্র ১৫-২০ মিটার উপর দিয়ে ড্রোন উড়িয়ে প্রতি পিক্সেলে <strong>০.৩৮ থেকে ০.৪৫ সেন্টিমিটার</strong> রেজুলেশনের ছবি তোলে। এতে আলু, টমেটো বা গমের পাতার সূক্ষ্ম ছত্রাকের দাগ ও স্পোর মানুষের চোখ মাঠে পৌঁছানোর ১০-১৪ দিন আগেই নিখুঁতভাবে ধরা পড়ে।</p>`
      }
    ]
  },
  {
    id: 'flight-app',
    icon: 'drone',
    title: 'PhytoGuard Sky App — Flight Operations',
    title_bn: 'ফাইটোগার্ড স্কাই অ্যাপ — ফ্লাইট পরিচালনা',
    subtitle: 'Autonomous grid planning over Bangladeshi croplands',
    subtitle_bn: 'বাংলাদেশের কৃষিজমিতে স্বয়ংক্রিয় গ্রিড ম্যাপিং',
    articles: [
      {
        slug: 'stand-count-mission',
        title: 'How to Make a Stand Count Mission in BD?',
        title_bn: 'বাংলাদেশে চারা গণনা ও অঙ্কুরোদগম মিশন পরিচালনা',
        excerpt: 'Automate emergence counting and missing seed quantification 10 to 18 days after transplanting in potato ridges and tomato beds.',
        excerpt_bn: 'আলু রোপণ বা টমেটোর চারা লাগানোর ১০-১৮ দিন পর নিখুঁতভাবে চারা সংখ্যা ও শূন্যস্থান গণনা।',
        content: `<h3>Executing Stand Count Missions on Bangladeshi Plots</h3>
<p>Stand count missions calculate plant population density, emergence uniformity, and missing germination clusters across potato ridges (আলুর ভেলি) and vegetable beds:</p>
<ol>
  <li>Open <strong>PhytoGuard Sky</strong> on your DJI controller and select <em>New Mission &rarr; Stand Count</em>.</li>
  <li>Select your target field boundary from your synchronized farm cadastral map (e.g. Bogura Plot 02 - 35 Bighas).</li>
  <li>Select the crop type: <strong>Potatoes</strong>, <strong>Tomatoes</strong>, <strong>Wheat</strong>, or <strong>Soybeans</strong>.</li>
  <li>Set flight parameters: 15m altitude (0.38 cm GSD), 75% forward overlap, 70% side overlap.</li>
  <li>Confirm RTK fix status (minimum 16 satellites) and tap <em>Launch Autonomous Grid</em>.</li>
  <li>The AI counts individual emerging stems, maps emergence gaps, and calculates required replanting seedling volumes.</li>
</ol>`,
        content_bn: `<h3>চারা সংখ্যা ও ফলন সম্ভাব্যতা যাচাই</h3>
<p>আলু রোপণ বা বীজ বপনের ১০ থেকে ১৮ দিনের মধ্যে জমিতে চারার ঘনত্ব ও অপূর্ণ স্থান পরিমাপ করতে এই মিশন পরিচালনা করা হয়:</p>
<ol>
  <li>ডিজেআই কন্ট্রোলারে <strong>ফাইটোগার্ড স্কাই</strong> ওপেন করে <em>New Mission &rarr; Stand Count</em> সিলেক্ট করুন।</li>
  <li>মৌজা ম্যাপ বা সংরক্ষিত প্লট থেকে জমির সীমানা নির্বাচন করুন (যেমন: বগুড়া প্লট ২ - ৩৫ বিঘা)।</li>
  <li>ফসলের ধরন বাছাই করুন: আলু, টমেটো, গম বা সয়াবিন।</li>
  <li>উচ্চতা ১৫ মিটার ও ওভারল্যাপ ৭৫% নির্ধারণ করুন।</li>
  <li>আরটিকে জিপিএস ফিক্স নিশ্চিত করে <em>Launch Autonomous Grid</em> চাপুন।</li>
  <li>ড্রোন স্বয়ংক্রিয়ভাবে প্রতি লাইনের চারা গুনে কোথায় কোথায় বীজ গজায়নি তার সুনির্দিষ্ট তালিকা তৈরি করবে।</li>
</ol>`
      },
      {
        slug: 'pests-diseases-mission',
        title: 'How to do "Pests and Diseases" Mission in BD?',
        title_bn: 'বাংলাদেশে রোগবালাই শনাক্তকরণ ড্রোন মিশন কীভাবে করবেন?',
        excerpt: 'Configure foliar inspection grids scheduled between 10:30 AM and 2:30 PM after winter morning fog lifts.',
        excerpt_bn: 'শীতের সকালে কুয়াশা কাটার পর সকাল ১০:৩০ থেকে দুপুর ২:৩০-এর মধ্যে রোগবালাই স্ক্যান ফ্লাইট পরিচালনা।',
        content: `<h3>Executing Pest &amp; Pathogen Scouting Missions in BD</h3>
<p>Foliar disease missions capture ultra-high-resolution multispectral imagery over high-density crop canopies:</p>
<h4>Bangladesh Flight Best Practices:</h4>
<ul>
  <li><strong>Optimal Flight Window (Rabi Season):</strong> Fly between 10:30 AM and 2:30 PM. In Bangladesh winters, early morning dew and thick fog (কুয়াশা) cause specular light reflections and water droplets that obscure leaf lesions. Wait until leaves are fully dry.</li>
  <li><strong>Camera Shutter Speed:</strong> Set shutter speed to 1/1000s or faster to eliminate canopy motion blur from river valley breezes.</li>
  <li><strong>Gimbal Pitch:</strong> 90° Nadir (straight down) for open field crops (potatoes, wheat); 75° oblique angle for trellised tomatoes and cucurbits (মাচায় চাষকৃত শসা ও লাউ).</li>
</ul>`,
        content_bn: `<h3>মাঠপর্যায়ে রোগবালাই শনাক্তকরণ ফ্লাইট</h3>
<p>পাতার রোগ ও ছত্রাকের আক্রমণ দ্রুত শনাক্ত করতে বিশেষ নির্দেশিকা:</p>
<h4>বাংলাদেশে উড্ডয়নের সেরা সময় ও কৌশল:</h4>
<ul>
  <li><strong>সেরা সময় (রবি মৌসুম):</strong> সকাল ১০:৩০ থেকে দুপুর ২:৩০ পর্যন্ত। শীতকালে ভোরের ঘন কুয়াশা ও পাতায় জমে থাকা শিশির শুকানোর পর ফ্লাইট শুরু করুন, যাতে ক্যামেরার লেন্সে পানির প্রতিফলন না ঘটে।</li>
  <li><strong>ক্যামেরা শাটার স্পিড:</strong> নদীর অববাহিকার বাতাসের কারণে পাতার দোলাচল ঠেকাতে শাটার স্পিড ন্যূনতম ১/১০০০ সেকেন্ড রাখুন।</li>
  <li><strong>ক্যামেরা অ্যাঙ্গেল:</strong> খোলা জমির আলু ও গমের জন্য ৯০ ডিগ্রি (সোজা নিচে); মাচায় চাষকৃত টমেটো ও শসার জন্য ৭৫ ডিগ্রি কোণ ব্যবহার করুন।</li>
</ul>`
      },
      {
        slug: 'orthomosaic-rgb-ndvi',
        title: 'How to Make an Orthomosaic RGB and NDVI Mission in BD?',
        title_bn: 'বাংলাদেশে অর্থোমোজাইক ও এনডিভিআই ম্যাপিং মিশন',
        excerpt: 'Stitch fragmented cadastral plots into seamless georeferenced maps with sunlight-calibrated multispectral indices.',
        excerpt_bn: 'খণ্ড খণ্ড কৃষিজমিকে যুক্ত করে একক জিও-রেফারেন্সড এনডিভিআই ও রঙিন অর্থোফটো তৈরি।',
        content: `<h3>Orthomosaic &amp; NDVI Mapping Across Bangladeshi Farmlands</h3>
<p>Orthomosaic flights stitch hundreds of individual drone exposures into an accurate 2D vegetative vigor map:</p>
<ol>
  <li>Select <em>Orthomosaic Mapping</em> in PhytoGuard Sky.</li>
  <li>Trace your plot boundary using the high-resolution field polygon tool.</li>
  <li>Select sensor mode: <strong>Multispectral (NDVI + NDRE)</strong> for chlorophyll and nitrogen monitoring, or <strong>High-Res RGB</strong> for visual verification.</li>
  <li>Calibrate the top-mounted sunshine sensor before takeoff using the calibrated reflectance panel to account for tropical cloud shifts.</li>
  <li>The aircraft flies the autonomous serpentine grid, captures georeferenced TIFFs, and returns home upon mission completion.</li>
</ol>`,
        content_bn: `<h3>অর্থোমোজাইক ও এনডিভিআই ম্যাপিং নির্দেশিকা</h3>
<p>শত শত ড্রোন ছবিকে নিখুঁতভাবে জোড়া লাগিয়ে জমির সম্পূর্ণ স্বাস্থ্যের ডিজিটাল চিত্র তৈরি করা হয়:</p>
<ol>
  <li>ফাইটোগার্ড স্কাই অ্যাপে <em>Orthomosaic Mapping</em> অপশনে যান।</li>
  <li>জমির সীমানা নির্ধারণ করুন।</li>
  <li>সেন্সর মোড নির্বাচন করুন: ক্লোরোফিল ও নাইট্রোজেন ঘাটতি যাচাইয়ে <strong>Multispectral (NDVI + NDRE)</strong> অথবা সাধারণ <strong>RGB</strong>।</li>
  <li>আকাশের মেঘ ও সূর্যের আলোর পরিবর্তন সমন্বয় করতে টেকঅফের পূর্বে রিফ্লেক্ট্যান্স প্যানেল দিয়ে সেন্সর ক্যালিব্রেট করে নিন।</li>
  <li>ড্রোনটি আঁকাবাঁকা গ্রিড ধরে ছবি তুলে স্বয়ংক্রিয়ভাবে টেকঅফ পয়েন্টে ফিরে আসবে।</li>
</ol>`
      },
      {
        slug: 'new-mission-plan',
        title: 'Custom Mission Planning for Bangladeshi Landholdings',
        title_bn: 'স্থানীয় খামারের জন্য কাস্টম ফ্লাইট পরিকল্পনা',
        excerpt: 'Drawing boundaries over cadastral plots, aligning flight lines with irrigation canals (ড্রেনেজ নালা) and bunds (আইল).',
        excerpt_bn: 'ড্রেনেজ নালা ও মাটির আইলের সমান্তরালে ফ্লাইট লাইন সাজিয়ে ব্যাটারির কার্যক্ষমতা বৃদ্ধি।',
        content: `<h3>Optimizing Flight Paths for Bangladeshi Field Geometry</h3>
<p>Save battery and maximize acreage coverage by aligning flight paths with the physical layout of Bangladeshi fields:</p>
<ul>
  <li><strong>Flight Line Orientation:</strong> Always align flight passes parallel to crop ridges and irrigation canals (নালা). Flying perpendicular increases drone turns and drains battery prematurely.</li>
  <li><strong>Cadastral Integration:</strong> Import KML or GeoJSON boundaries directly from local Upazila land survey files or Google Earth.</li>
  <li><strong>Obstacle Clearance:</strong> Set minimum Return-to-Home (RTH) altitude to 45 meters to safely clear betel nut palms (সুপারি গাছ), eucalyptus trees, and rural power poles.</li>
</ul>`,
        content_bn: `<h3>জমির আকার অনুযায়ী ফ্লাইট পাথ নির্ধারণ</h3>
<p>ব্যাটারি সাশ্রয় ও দ্রুত জরিপ নিশ্চিত করার বিশেষ কৌশল:</p>
<ul>
  <li><strong>ফ্লাইট লাইনের দিক:</strong> ড্রোন উড্ডয়ন লাইন সবসময় সেচ নালা ও ভেলির সমান্তরালে রাখুন। আড়াআড়ি উড়লে বারবার ড্রোন ঘোরাতে গিয়ে ব্যাটারি অপচয় হয়।</li>
  <li><strong>কেএমএল ফাইল ইমপোর্ট:</strong> গুগল আর্থ বা উপজেলা ভূমি অফিসের ডিজিটাল সীমানা ফাইল সরাসরি অ্যাপে যুক্ত করতে পারেন।</li>
  <li><strong>গাছপালা ও খুঁটি এড়ানো:</strong> রিটার্ন-টু-হোম (RTH) উচ্চতা ন্যূনতম ৪৫ মিটার রাখুন, যাতে সুপারির বাগান, ইউক্যালিপটাস গাছ ও পল্লী বিদ্যুতের তার নিরাপদে এড়ানো যায়।</li>
</ul>`
      },
      {
        slug: 'scout-field-ndvi-layer',
        title: 'Scouting Fields with NDVI in Bangladesh Agro-Zones',
        title_bn: 'এনডিভিআই লেয়ার দেখে জমিতে রোগ ও লবণাক্ততা শনাক্তকরণ',
        excerpt: 'Differentiating soil salinity in southern coastal belts from drought in Barind Tract and active fungal leaf necrosis.',
        excerpt_bn: 'উপকূলীয় চরাঞ্চলে মাটির লবণাক্ততা ও বরেন্দ্র অঞ্চলের খরা চাপের সাথে ছত্রাক রোগের পার্থক্য নির্ণয়।',
        content: `<h3>Interpreting NDVI Layers Across Bangladesh Agro-Zones</h3>
<p>NDVI reflectance values reveal distinct stress patterns across different regions of Bangladesh:</p>
<ul>
  <li><strong>Deep Green (NDVI &gt; 0.75):</strong> Vigorous, healthy vegetative canopy with high chlorophyll content.</li>
  <li><strong>Yellow / Light Green (NDVI 0.45 – 0.65):</strong> Emerging stress. In southern coastal belts (Lakshmipur, Khulna, Barishal), this often indicates seasonal soil salinity; in Rajshahi/Naogaon, it indicates drought stress; in Munshiganj potatoes, it signals early nitrogen deficiency or fungal onset.</li>
  <li><strong>Red / Orange (NDVI &lt; 0.40):</strong> Severe foliar necrosis. Indicates active Late Blight defoliation or Wheat Blast hotspots requiring immediate spray intervention.</li>
</ul>`,
        content_bn: `<h3>বাংলাদেশের আঞ্চলিক কৃষিতে এনডিভিআই মান বিশ্লেষণ</h3>
<p>এনডিভিআই সূচক দেখে বিভিন্ন অঞ্চলের ফসলের অবস্থা বিশ্লেষণ:</p>
<ul>
  <li><strong>গাঢ় সবুজ (NDVI > ০.৭৫):</strong> অত্যন্ত স্বাস্থ্যবান ও সতেজ ফসল।</li>
  <li><strong>হলুদ/হালকা সবুজ (NDVI ০.৪৫ - ০.৬৫):</strong> ফসলে প্রাথমিক চাপ। উপকূলীয় অঞ্চলে (খুলনা, বরিশাল, লক্ষ্মীপুর) এটি মাটির লবণাক্ততা নির্দেশ করে; বরেন্দ্র অঞ্চলে (রাজশাহী, নওগাঁ) পানির ঘাটতি; আর মুন্সীগঞ্জের আলুতে নাইট্রোজেনের অভাব বা প্রাথমিক রোগের লক্ষণ।</li>
  <li><strong>লাল/কমলা (NDVI < ০.৪০):</strong> তীব্র ক্ষতি। লেইট ব্লাইট বা হুইট ব্লাস্টে আক্রান্ত হয়ে পাতা পুড়ে যাওয়া চিহ্নিত করে, যেখানে জরুরি স্প্রে প্রয়োজন।</li>
</ul>`
      }
    ]
  },
  {
    id: 'drone-flights',
    icon: 'sensor',
    title: 'Drone Flights & Sensor Calibration',
    title_bn: 'ড্রোন ফ্লাইট ও সেন্সর ক্যালিব্রেশন (বাংলাদেশ প্রেক্ষিত)',
    subtitle: 'Radiometric calibration, tropical humidity handling, and RTK accuracy',
    subtitle_bn: 'উচ্চ আর্দ্রতায় রেডিওমেট্রিক ক্যালিব্রেশন ও সেন্টিমিটার নিখুঁত আরটিকে',
    articles: [
      {
        slug: 'calibrate-multispectral',
        title: 'Calibrating Multispectral Sensors in BD Humidity',
        title_bn: 'উচ্চ আর্দ্রতায় মাল্টিস্পেকট্রাল সেন্সর ক্যালিব্রেশন',
        excerpt: 'Preventing lens condensation and ensuring consistent radiometric indices across changing winter haze.',
        excerpt_bn: 'গাড়ির এসি থেকে বের করার পর লেন্সের বাষ্প দূরীকরণ ও কুয়াশার মধ্যে সঠিক ক্যালিব্রেশন পদ্ধতি।',
        content: `<h3>Radiometric Calibration Protocol in Bangladesh</h3>
<p>Bangladesh frequently experiences 80% to 95% relative humidity during the winter Rabi growing season. To prevent erroneous vegetative indices:</p>
<ol>
  <li><strong>Lens Acclimation:</strong> When taking the drone out of an air-conditioned vehicle or hotel room, leave it in the ambient outdoor air for 15 minutes. This prevents internal lens condensation (বাষ্প/ঘাম) from ruining optical capture.</li>
  <li><strong>Reflectance Target Calibration:</strong> Place the calibrated diffuse reflectance panel flat on an unshaded levee or ground spot. Hold the drone 1 meter directly above and trigger the calibration snapshot in PhytoGuard Sky.</li>
  <li><strong>Sunshine Sensor:</strong> Ensure the upward-facing ambient light sensor is free of dust or bird deposits before each battery sortie.</li>
</ol>`,
        content_bn: `<h3>বাংলাদেশে রেডিওমেট্রিক ক্যালিব্রেশন গাইড</h3>
<p>শীতকালে বাংলাদেশের বাতাসে আর্দ্রতা প্রায়শই ৮০-৯৫% থাকে। ভুল রিডিং এড়াতে নিচের নিয়ম অনুসরণ করুন:</p>
<ol>
  <li><strong>লেন্স স্বাভাবিকীকরণ:</strong> শীতাতপ নিয়ন্ত্রিত গাড়ি থেকে ড্রোন বের করে সরাসরি উড়াবেন না। বাইরের স্বাভাবিক বাতাসে ১৫ মিনিট রেখে দিন, যাতে লেন্সে ভেতরের বাষ্প না জমে।</li>
  <li><strong>রিফ্লেক্ট্যান্স প্যানেল পরীক্ষা:</strong> ছায়াহীন সমতল স্থানে ক্যালিব্রেশন প্যানেল রেখে ড্রোনটি ১ মিটার উপরে ধরে অ্যাপ থেকে ক্যালিব্রেশন ফ্রেম তুলুন।</li>
  <li><strong>সানশাইন সেন্সর পরিষ্কার:</strong> ড্রোনের উপরের আলোক সংবেদী সেন্সরে যাতে ধুলোবালি বা পাখির মল না থাকে তা যাচাই করুন।</li>
</ol>`
      },
      {
        slug: 'altitude-gsd-guidelines',
        title: 'Flight Altitude & GSD Guidelines for BD Crops',
        title_bn: 'বাংলাদেশের প্রধান ফসলের জন্য ফ্লাইট উচ্চতা ও রেজুলেশন',
        excerpt: 'Calculate the optimal flight altitude and Ground Sample Distance (GSD) for potatoes, tomatoes, wheat, and soybeans.',
        excerpt_bn: 'আলু, টমেটো, গম ও সয়াবিনের জন্য নিখুঁত মিলিমিটার স্তরের উচ্চতা চার্ট।',
        content: `<h3>Recommended Flight Altitudes for Bangladesh Major Crops</h3>
<table>
  <thead>
    <tr><th>Crop (ফসল)</th><th>Target Region</th><th>Altitude (AGL)</th><th>Target GSD</th><th>Target Pathology</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Potatoes (আলু)</strong></td><td>Munshiganj, Bogura, Rangpur</td><td>15–18 meters</td><td>0.38–0.44 cm/px</td><td>Late Blight &amp; Early Blight</td></tr>
    <tr><td><strong>Tomatoes (টমেটো)</strong></td><td>Bogura, Rajshahi, Jashore</td><td>15 meters</td><td>0.38 cm/px</td><td>Late Blight, Leaf Curl (TYLCV)</td></tr>
    <tr><td><strong>Wheat (গম)</strong></td><td>Dinajpur, Rajshahi, Pabna</td><td>16–18 meters</td><td>0.42 cm/px</td><td>Wheat Blast &amp; Yellow Rust</td></tr>
    <tr><td><strong>Soybeans (সয়াবিন)</strong></td><td>Lakshmipur, Noakhali, Bhola</td><td>20 meters</td><td>0.50 cm/px</td><td>Soybean Rust &amp; Charcoal Rot</td></tr>
    <tr><td><strong>Cucumbers (শসা)</strong></td><td>Jashore, Narsingdi, Cumilla</td><td>16 meters</td><td>0.40 cm/px</td><td>Downy Mildew &amp; Anthracnose</td></tr>
    <tr><td><strong>High-Value Canopy</strong></td><td>Chuadanga, Gazipur</td><td>22 meters (75° tilt)</td><td>0.48 cm/px</td><td>Powdery Mildew &amp; Fruit Scab</td></tr>
  </tbody>
</table>`,
        content_bn: `<h3>বাংলাদেশের প্রধান ফসলের উচ্চতা ও রেজুলেশন চার্ট</h3>
<table>
  <thead>
    <tr><th>ফসল</th><th>প্রধান অঞ্চল</th><th>ফ্লাইট উচ্চতা</th><th>রেজুলেশন (GSD)</th><th>টার্গেট রোগবালাই</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>আলু</strong></td><td>মুন্সীগঞ্জ, বগুড়া, রংপুর</td><td>১৫-১৮ মিটার</td><td>০.৩৮-০.৪৪ সেমি/পিক্সেল</td><td>নাবী ধসা ও আগাম ধসা</td></tr>
    <tr><td><strong>টমেটো</strong></td><td>বগুড়া, রাজশাহী, যশোর</td><td>১৫ মিটার</td><td>০.৩৮ সেমি/পিক্সেল</td><td>লেইট ব্লাইট ও পাতা কোঁকড়ানো</td></tr>
    <tr><td><strong>গম</strong></td><td>দিনাজপুর, রাজশাহী, পাবনা</td><td>১৬-১৮ মিটার</td><td>০.৪২ সেমি/পিক্সেল</td><td>হুইট ব্লাস্ট ও হলুদ মরিচা</td></tr>
    <tr><td><strong>সয়াবিন</strong></td><td>লক্ষ্মীপুর, নোয়াখালী, ভোলা</td><td>২০ মিটার</td><td>০.৫০ সেমি/পিক্সেল</td><td>সয়াবিন রাস্ট ও চারকোল রট</td></tr>
    <tr><td><strong>শসা</strong></td><td>যশোর, নরসিংদী, কুমিল্লা</td><td>১৬ মিটার</td><td>০.৪০ সেমি/পিক্সেল</td><td>ডাউনি মিলডিউ ও ক্ষত রোগ</td></tr>
    <tr><td><strong>ফল বাগান</strong></td><td>চুয়াডাঙ্গা, গাজীপুর</td><td>২২ মিটার (৭৫° কোণ)</td><td>০.৪৮ সেমি/পিক্সেল</td><td>পাউডারি মিলডিউ ও ফ্রুট স্ক্যাব</td></tr>
  </tbody>
</table>`
      },
      {
        slug: 'sync-drone-sd-card',
        title: 'Image Ingestion & Rural Cloud Sync in BD',
        title_bn: 'গ্রামীণ নেটওয়ার্কে ড্রোন ছবির দ্রুত ক্লাউড আপলোড',
        excerpt: 'Fast data ingestion methods using field laptops and chunked uploads optimized for rural 4G mobile networks.',
        excerpt_bn: 'মাঠের ল্যাপটপ থেকে কম ব্যান্ডউইথেও সহজে ক্লাউডে ছবি সিনক্রোনাইজেশন।',
        content: `<h3>Handling Drone Imagery Ingestion in Rural Bangladesh</h3>
<p>A single 50-Bigha drone survey generates 500 to 1,200 high-resolution RAW/TIFF images (15–35 GB). In rural union parishads with limited fiber broadband:</p>
<ol>
  <li><strong>Field Verification:</strong> Eject the MicroSD card and insert it into a portable field laptop. Run the PhytoGuard Local Sync Agent to check that all images contain valid RTK GPS tags.</li>
  <li><strong>Chunked Resumable Upload:</strong> PhytoGuard uses a bandwidth-adaptive multi-threaded uploader that pauses and resumes automatically during rural cellular network dips (Grameenphone/Robi 4G).</li>
  <li><strong>Direct Cloud Processing:</strong> Once uploaded, our high-performance AI cluster runs orthomosaic stitching and convolutional neural inference within 8 to 15 minutes.</li>
</ol>`,
        content_bn: `<h3>গ্রামীণ পরিবেশে দ্রুত ডাটা প্রসেসিং কৌশল</h3>
<p>৫০ বিঘার একটি ড্রোন মিশনে ৫০০ থেকে ১২০০টি উচ্চমানের ছবি (১৫-৩৫ জিবি) উঠতে পারে। প্রত্যন্ত অঞ্চলে ইন্টারনেট ধীরগতির হলেও কাজ করার কৌশল:</p>
<ol>
  <li><strong>ফিল্ড ভেরিফিকেশন:</strong> মাঠের ল্যাপটপে এসডি কার্ড ঢুকিয়ে ফাইটোগার্ড লোকাল এজেন্টের মাধ্যমে নিশ্চিত হন যে প্রতিটি ছবিতে সঠিক জিপিএস অবস্থান যুক্ত হয়েছে।</li>
  <li><strong>রিজিউমেবল আপলোড:</strong> আমাদের ওয়েব প্ল্যাটফর্ম গ্রামীণ ফোরজি নেটওয়ার্কের ওঠানামার সাথে স্বয়ংক্রিয়ভাবে খাপ খায়; সংযোগ বিচ্ছিন্ন হলেও পুনরায় প্রথম থেকে শুরু হয় না।</li>
  <li><strong>ক্লাউড এআই বিশ্লেষণ:</strong> ছবি আপলোড শেষ হওয়ার মাত্র ৮-১৫ মিনিটের মধ্যে সম্পূর্ণ ম্যাপ ও রোগের রিপোর্ট তৈরি হয়ে যায়।</li>
</ol>`
      }
    ]
  },
  {
    id: 'web-platform',
    icon: 'screen',
    title: 'PhytoGuard Web Platform & Prescriptions',
    title_bn: 'ফাইটোগার্ড ওয়েব প্ল্যাটফর্ম ও প্রিসিশন প্রেসক্রিপশন',
    subtitle: 'Telemetry, risk heatmaps, and variable-rate spray maps',
    subtitle_bn: 'টেলিমেট্রি, ঝুঁকি মানচিত্র এবং ভেরিয়েবল-রেট স্প্রে গাইড',
    articles: [
      {
        slug: 'web-platform-tutorial',
        title: 'Web Platform Tutorial for Bangladeshi Farm Teams',
        title_bn: 'বাংলাদেশি খামার ব্যবস্থাপকদের জন্য ওয়েব প্ল্যাটফর্ম নির্দেশিকা',
        excerpt: 'Complete walkthrough of multi-field management across Upazilas and Districts with live RTK telemetry.',
        excerpt_bn: 'উপজেলা ও জেলাভিত্তিক একাধিক কৃষিজমি তদারকি এবং ড্রোন ফ্লাইট ট্র্যাকিং।',
        content: `<h3>Navigating the PhytoGuard Web Dashboard in BD</h3>
<p>The web dashboard provides a unified intelligence center for growers, contract farming enterprises (PRAN, ACI, Square, BRAC), and agronomists:</p>
<ul>
  <li><strong>District &amp; Upazila Filtering:</strong> Manage agricultural plots grouped by administrative regions (e.g. Bogura Sadar, Shibganj, Munshiganj Sadar, Dinajpur Sadar).</li>
  <li><strong>Crop Health KPIs:</strong> Real-time tracked Bighas/Hectares, completed drone flight sorties, detected hotspots, and average canopy NDVI vigor.</li>
  <li><strong>Leaf-Level Inspection Modal:</strong> Click any diagnosed specimen to inspect 100×100 pixel foliar pathology crops with model confidence ratings and active lesion highlights.</li>
</ul>`,
        content_bn: `<h3>ওয়েব ড্যাশবোর্ড ব্যবহারের পূর্ণাঙ্গ নির্দেশিকা</h3>
<p>বড় খামারি ও চুক্তিভিত্তিক কৃষি সংস্থার (প্রাণ, এসিআই, স্কয়ার, ব্র্যাক) জন্য সমন্বিত মনিটরিং ব্যবস্থা:</p>
<ul>
  <li><strong>জেলা ও উপজেলাভিত্তিক ফিল্টার:</strong> বিভিন্ন অঞ্চলের জমিগুলোকে এলাকাভিত্তিক গ্রুপ করে পর্যবেক্ষণ (যেমন: শিবগঞ্জ, বগুড়া; মুন্সীগঞ্জ সদর)।</li>
  <li><strong>কেপিআই মেট্রিক্স:</strong> মোট চাষকৃত বিঘা, সম্পন্নকৃত ড্রোন ফ্লাইট, শনাক্তকৃত রোগাক্রান্ত এলাকা ও গড় এনডিভিআই মান।</li>
  <li><strong>১০০×১০০ পাতার স্পেসিমেন ভিউয়ার:</strong> ড্যাশবোর্ডের ১০০×১০০ বক্সে ক্লিক করে সরাসরি পাতার রোগের দাগ ও এআই মডেলের আত্মবিশ্বাসের স্তর পর্যবেক্ষণ করুন।</li>
</ul>`
      },
      {
        slug: 'findings-symbology',
        title: 'Findings Symbology & Color Coding for Extension Officers',
        title_bn: 'মানচিত্রের সংকেত ও রঙের অর্থ (কৃষি কর্মকর্তাদের জন্য)',
        excerpt: 'Visual risk classification tiers aligned with Department of Agricultural Extension (DAE) protocols.',
        excerpt_bn: 'কৃষি সম্প্রসারণ অধিদপ্তরের (ডিএই) বালাই দমন নীতিমালার সাথে সমন্বয়কৃত রঙের সংকেত।',
        content: `<h3>Map Symbology &amp; Risk Alert Tiers</h3>
<p>PhytoGuard standardizes color-coded risk alerts to help agronomists prioritize field action:</p>
<ul>
  <li><span style="color:#dc2626; font-weight:700;">● Red Warning (Severe Infestation):</span> Active sporulating pathogen (e.g. Late Blight in potatoes or Wheat Blast in ears). Requires targeted spray intervention within 24 to 48 hours.</li>
  <li><span style="color:#d97706; font-weight:700;">● Orange Alert (Moderate Risk):</span> Foliar lesions detected in isolated plant clusters. Recommend ground spot-check by Sub-Assistant Agriculture Officer (SAAO) or farm scout within 48 hours.</li>
  <li><span style="color:#16a34a; font-weight:700;">● Green Status (Healthy Canopy):</span> Optimal chlorophyll vigor with zero detected pathogen markers.</li>
</ul>`,
        content_bn: `<h3>রঙের সংকেত ও ঝুঁকির মাত্রা</h3>
<p>মাঠপর্যায়ে উপ-সহকারী কৃষি কর্মকর্তা (এসএএও) ও চাষিদের তাৎক্ষণিক সিদ্ধান্ত গ্রহণের জন্য রঙের বিন্যাস:</p>
<ul>
  <li><span style="color:#dc2626; font-weight:700;">● লাল সতর্কবার্তা (তীব্র আক্রমণ):</span> ফসলে সক্রিয় ছত্রাকের সংক্রমণ (যেমন: আলুর নাবী ধসা বা গমের ব্লাস্ট)। ২৪ থেকে ৪৮ ঘণ্টার মধ্যে নির্দিষ্ট স্থানে স্প্রে করা আবশ্যক।</li>
  <li><span style="color:#d97706; font-weight:700;">● কমলা সংকেত (মাঝারি ঝুঁকি):</span> নির্দিষ্ট কিছু গাছে প্রাথমিক লক্ষণ শনাক্ত। পরবর্তী ৪৮ ঘণ্টার মধ্যে উপ-সহকারী কৃষি কর্মকর্তা দ্বারা সরেজমিনে পরিদর্শনের পরামর্শ।</li>
  <li><span style="color:#16a34a; font-weight:700;">● সবুজ সংকেত (সুস্থ ফসল):</span> কোনো রোগবালাই নেই; ফসল শতভাগ সতেজ ও স্বাভাবিক।</li>
</ul>`
      },
      {
        slug: 'exporting-shapefiles-isoxml',
        title: 'Variable-Rate Spray Prescriptions for BD Equipment',
        title_bn: 'বাংলাদেশি স্প্রেয়ার ও এগ্রাস ড্রোনের জন্য প্রেসক্রিপশন তৈরি',
        excerpt: 'Converting AI detections into precision spray maps for DJI Agras T30/T40 drones and power-tiller sprayers.',
        excerpt_bn: 'ডিজেআই এগ্রাস স্প্রে ড্রোন ও পাওয়ার টিলার স্প্রেয়ারের জন্য বালাইনাশক প্রেসক্রিপশন রপ্তানি।',
        content: `<h3>Precision Variable-Rate Spraying in Bangladesh</h3>
<p>In conventional farming, growers blanket-spray entire 50-Bigha plots when only 10% is infected, wasting expensive fungicides and increasing chemical runoff into local rivers. PhytoGuard generates targeted spray maps:</p>
<ol>
  <li>In the field view, click <em>Generate Prescription Map</em>.</li>
  <li>Select your target chemical product following DAE/BARI recommendations (e.g. <strong>Mancozeb</strong>, <strong>Metalaxyl</strong>, <strong>Azoxystrobin</strong>, or <strong>Nativo</strong>).</li>
  <li>Export the prescription directly in your preferred machinery format:
    <ul>
      <li><strong>DJI Agras Route (.kml / TaskData):</strong> Import directly to DJI Agras T30, T40, or T50 controllers for automated spot-spraying.</li>
      <li><strong>ESRI Shapefile (.shp, .dbf):</strong> Compatible with tractor and power-tiller boom sprayers.</li>
      <li><strong>GPS Field Labor Coordinates:</strong> Printable PDF/SMS list of infected GPS coordinates for directed knapsack mist-blower spraying by field laborers (কামলা/মজুর).</li>
    </ul>
  </li>
</ol>`,
        content_bn: `<h3>বাংলাদেশে প্রিসিশন বালাইনাশক স্প্রে ব্যবস্থাপনা</h3>
<p>সাধারণত পুরো জমিতে বালাইনাশক ছিটানো হয়, যা অত্যন্ত ব্যয়বহুল ও পরিবেশের জন্য ক্ষতিকর। ফাইটোগার্ডের মাধ্যমে মাত্র আক্রান্ত ১০-১৫% জমিতে সুনির্দিষ্ট স্প্রে সম্ভব:</p>
<ol>
  <li>ড্যাশবোর্ডে গিয়ে <em>Generate Prescription Map</em> চাপুন।</li>
  <li>কৃষি গবেষণা ইনস্টিটিউট (বারি) অনুমোদিত অনুমোদিত ছত্রাকনাশক নির্বাচন করুন (যেমন: <strong>ম্যানকোজেব</strong>, <strong>মেটালেক্সিল</strong>, <strong>এমিস্টার টপ</strong> বা <strong>নেটিভো</strong>)।</li>
  <li>আপনার স্প্রে পদ্ধতির সাথে মিলিয়ে ফরম্যাট ডাউনলোড করুন:
    <ul>
      <li><strong>ডিজেআই এগ্রাস রুট (.kml):</strong> টি৩০ বা টি৪০ স্প্রে ড্রোনে সরাসরি লোড করে স্বয়ংক্রিয় স্প্রে।</li>
      <li><strong>শেপফাইল (.shp):</strong> পাওয়ার টিলার চালিত আধুনিক স্প্রেয়ারের জন্য।</li>
      <li><strong>শ্রমিকদের জন্য জিপিএস লিস্ট:</strong> হস্তচালিত ন্যাপস্যাক বা ব্যাটারি স্প্রেয়ার নিয়ে নির্দিষ্ট দাগে গিয়ে স্প্রে করার তালিকা।</li>
    </ul>
  </li>
</ol>`
      }
    ]
  },
  {
    id: 'troubleshooting',
    icon: 'wrench',
    title: 'Troubleshooting in Rural Bangladesh',
    title_bn: 'মাঠপর্যায়ে প্রযুক্তিগত সমস্যা সমাধান',
    subtitle: 'Resolving connectivity, cellular RTK, and flight issues',
    subtitle_bn: 'সেলুলার নেটওয়ার্ক, আরটিকে সংযোগ ও ফ্লাইট জটিলতা সমাধান',
    articles: [
      {
        slug: 'troubleshoot-drone-connection',
        title: 'Resolving Drone Controller & RTK Issues in Rural BD',
        title_bn: 'গ্রামীণ অঞ্চলে আরটিকে ও রিমোট কন্ট্রোল সংযোগ ত্রুটি সমাধান',
        excerpt: 'Handling cellular dropouts with local D-RTK 2 base stations and avoiding magnetic interference near telecom towers and brick kilns.',
        excerpt_bn: 'টেলিকম টাওয়ার ও ইটভাটার চৌম্বকীয় বাধা এড়ানো এবং আরটিকে ফ্লোট সমস্যা দূরীকরণ।',
        content: `<h3>Troubleshooting Remote Telemetry in Bangladesh</h3>
<h4>Symptoms:</h4>
<p>PhytoGuard Sky displays "Aircraft Disconnected", "Compass Interference", or "RTK Float".</p>
<h4>Solutions in Rural BD:</h4>
<ol>
  <li><strong>Cellular Network Dropout:</strong> In rural union parishads with weak 4G internet, internet-based NTRIP RTK may drop to "Float". Switch to an independent physical <strong>DJI D-RTK 2 Tripod Base Station</strong> placed on a field levee.</li>
  <li><strong>Compass Interference:</strong> Keep takeoff location at least 60 meters away from mobile network towers (BTCL, Grameenphone, Robi), brick kilns (ইটভাটা), and rural high-voltage power transmission lines.</li>
  <li><strong>Controller Cable:</strong> Verify the USB-C OTG cable between the DJI RC Pro controller and your field monitoring tablet is firmly seated.</li>
</ol>`,
        content_bn: `<h3>মাঠপর্যায়ে রিমোট কন্ট্রোল ও আরটিকে সংযোগ সমাধান</h3>
<h4>লক্ষণসমূহ:</h4>
<p>অ্যাপে "Aircraft Disconnected", "Compass Interference" অথবা "RTK Float" সংকেত আসা।</p>
<h4>সমাধান:</h4>
<ol>
  <li><strong>দুর্বল মোবাইল নেটওয়ার্ক:</strong> প্রত্যন্ত চরাঞ্চলে ৪জি নেটওয়ার্ক না থাকলে ইন্টারনেট আরটিকে কাজ নাও করতে পারে। এক্ষেত্রে নিজস্ব <strong>ডিজেআই ডি-আরটিকে ২ বেস স্টেশন</strong> ট্রাইপডে বসিয়ে লোকাল আরটিকে ফিক্স ব্যবহার করুন।</li>
  <li><strong>চৌম্বকীয় হস্তক্ষেপ:</strong> মোবাইল টাওয়ার, গ্রামীণ বিদ্যুৎ সঞ্চালন লাইন এবং ইটভাটার চিমনির মেটাল কাঠামো থেকে ড্রোন অন্তত ৬০ মিটার দূরে রেখে টেকঅফ করান।</li>
  <li><strong>ক্যাবল পরীক্ষা:</strong> কন্ট্রোলারের সাথে ট্যাবলেটের ইউএসবি-সি ক্যাবলটি শক্তভাবে লেগে আছে কিনা নিশ্চিত করুন।</li>
</ol>`
      },
      {
        slug: 'resolving-upload-failures',
        title: 'Resolving Rural Upload & Stitching Failures in BD',
        title_bn: 'ছবি আপলোড ও অর্থোমোজাইক জোড়া না লাগার ত্রুটি সমাধান',
        excerpt: 'Handling rural internet drops with resumable uploads and adjusting overlap for windy river floodplains.',
        excerpt_bn: 'নদীর চরে তীব্র বাতাসের কারণে ওভারল্যাপ কমে যাওয়া এবং ধীরগতির নেটওয়ার্কে আপলোড সমাধান।',
        content: `<h3>Image Upload &amp; Photogrammetry Stitching Optimization</h3>
<ul>
  <li><strong>Windy Floodplain Drift:</strong> Along open river basins (Padma, Jamuna, Teesta), crosswinds can cause the aircraft to pitch, reducing effective photo overlap below 70%. When flying in open river corridors, increase forward overlap to 80% and side overlap to 75%.</li>
  <li><strong>Intermittent Broadband:</strong> If your local union digital center or broadband drops during upload, do not close the browser tab. The PhytoGuard uploader caches sent chunks locally and resumes automatically upon reconnection.</li>
  <li><strong>Missing EXIF GPS:</strong> Never launch before the drone acquires at least 14 satellites and green RTK lock; un-geotagged frames cannot be placed on the cadastral map.</li>
</ul>`,
        content_bn: `<h3>ছবি আপলোড ও জোড়া লাগানোর সমস্যা সমাধান</h3>
<ul>
  <li><strong>নদীর চরের বাতাস:</strong> পদ্মা, যমুনা বা তিস্তার চরাঞ্চলে তীব্র বাতাসে ড্রোন হেলে যেতে পারে, ফলে ছবির ওভারল্যাপ কমে যায়। এসব এলাকায় উড্ডয়নের সময় ওভারল্যাপ ন্যূনতম ৮০% ও ৭৫% সেট করুন।</li>
  <li><strong>ধীরগতির ইন্টারনেট:</strong> ইউনিয়ন ডিজিটাল সেন্টার বা মডেমের সংযোগ সাময়িক বিচ্ছিন্ন হলেও ব্রাউজার ট্যাব বন্ধ করবেন না। সংযোগ ফিরলে আপলোড স্বয়ংক্রিয়ভাবে বাকি অংশ থেকে শুরু হবে।</li>
  <li><strong>জিপিএস মেটাডাটা:</strong> কমপক্ষে ১৪টি স্যাটেলাইট লক ও সবুজ আরটিকে সিগন্যাল পাওয়ার আগে টেকঅফ করবেন না, অন্যথায় ছবিতে জিপিএস ট্যাগ থাকবে না।</li>
</ul>`
      }
    ]
  },
  {
    id: 'faq',
    icon: 'faq',
    title: 'FAQ & Bangladesh Aviation Regulations',
    title_bn: 'সাধারণ প্রশ্নোত্তর ও বাংলাদেশের ড্রোন আইন',
    subtitle: 'CAAB drone rules, environmental limits, and account access',
    subtitle_bn: 'বেসামরিক বিমান চলাচল কর্তৃপক্ষ (CAAB) নীতিমালা ও সাধারণ জিজ্ঞাসা',
    articles: [
      {
        slug: 'drone-piloting-faq',
        title: 'Environmental Flight Limits in Bangladesh',
        title_bn: 'বাংলাদেশে ড্রোন উড্ডয়নের আবহাওয়াগত সীমা',
        excerpt: 'Avoiding Kalbaishakhi storm fronts, 38-42°C summer heat in Rajshahi, and winter fog lifting thresholds.',
        excerpt_bn: 'কালবৈশাখী ঝড়, রাজশাহীর তীব্র তাপপ্রবাহ এবং শীতের ঘন কুয়াশার মধ্যে নিরাপদ ড্রোন পরিচালনা।',
        content: `<h3>Environmental Flight Thresholds for Bangladesh Operations</h3>
<ul>
  <li><strong>Kalbaishakhi Squalls (কালবৈশাখী ঝড়):</strong> In pre-monsoon months (April–May), sudden squalls can generate winds exceeding 60 km/h within minutes. Strictly ground all drone sorties if dark cumulonimbus clouds appear on the northwestern horizon. Maximum safe flight wind is 25 km/h.</li>
  <li><strong>Heat &amp; Battery Thermal Throttling:</strong> During Rajshahi, Kushtia, and Chuadanga summer heatwaves (38°C–42°C), drone batteries can overheat quickly. Rest batteries in shaded, ventilated areas between flights and avoid charging hot batteries immediately after landing.</li>
  <li><strong>Dense Fog Thresholds:</strong> In December and January, wait for horizontal surface visibility to exceed 500 meters and the fog ceiling to lift above 50 meters before launching foliar scan sorties.</li>
</ul>`,
        content_bn: `<h3>বাংলাদেশে ড্রোন উড্ডয়নের নিরাপদ আবহাওয়ার মাপকাঠি</h3>
<ul>
  <li><strong>কালবৈশাখী ঝড় সতর্কতা:</strong> বৈশাখ-জ্যৈষ্ঠ মাসে উত্তর-পশ্চিম আকাশে কালো মেঘ দেখা দিলে সাথে সাথে ড্রোন নামিয়ে নিন। সর্বোচ্চ নিরাপদ বাতাসের গতি ২৫ কিমি/ঘণ্টা।</li>
  <li><strong>তীব্র গরম ও ব্যাটারি সুরক্ষা:</strong> রাজশাহী ও চুয়াডাঙ্গায় গ্রীষ্মের প্রচণ্ড তাপদাহে (৩৮°-৪২° সে.) ড্রোন ব্যাটারি দ্রুত গরম হয়। ফ্লাইট শেষে ব্যাটারি ছায়াযুক্ত স্থানে ঠান্ডা করে তারপর চার্জে দিন।</li>
  <li><strong>শীতকালীন ঘন কুয়াশা:</strong> পৌষ ও মাঘ মাসে দৃষ্টিসীমা ৫০০ মিটারের কম থাকলে এবং কুয়াশার স্তর মাটি থেকে ৫০ মিটারের উপরে না ওঠা পর্যন্ত ফ্লাইট স্থগিত রাখুন।</li>
</ul>`
      },
      {
        slug: 'commercial-license-part-107',
        title: 'CAAB Drone Rules 2020 & Pilot Compliance in BD',
        title_bn: 'বাংলাদেশে সিএএবি ড্রোন উড্ডয়ন নীতিমালা ও লাইসেন্সিং',
        excerpt: 'Complete guide to Civil Aviation Authority of Bangladesh (CAAB) RPAS Regulations, Category A/B/C/D rules, and no-fly zones.',
        excerpt_bn: 'বেসামরিক বিমান চলাচল কর্তৃপক্ষের (CAAB) ড্রোন নিবন্ধন নীতিমালা ২০২০, ক্যাটাগরি ও নো-ফ্লাই জোন সংক্রান্ত গাইড।',
        content: `<h3>CAAB Drone Regulations &amp; Legal Compliance in Bangladesh</h3>
<p>Commercial drone scouting in Bangladesh is governed by the <strong>Civil Aviation Authority of Bangladesh (CAAB) Remotely Piloted Aircraft Systems (RPAS) Rules 2020</strong>:</p>
<h4>Operating Categories:</h4>
<ul>
  <li><strong>Category A (Recreational/Micro):</strong> Drones under 5 kg used exclusively for non-commercial personal photography.</li>
  <li><strong>Category B (Commercial Agricultural Scouting):</strong> Commercial drones weighing 5 kg to 25 kg (such as the DJI Mavic 3 Multispectral and Mavic 3 Enterprise). Requires digital registration through the CAAB online portal and local administration notification.</li>
  <li><strong>Category C &amp; D (Heavy Agricultural Spraying):</strong> Aircraft over 25 kg (such as the DJI Agras T30/T40). Requires formal authorization from CAAB, clearance from the Ministry of Civil Aviation &amp; Tourism, and coordination with local District Commissioners (DC), Upazila Nirbahi Officers (UNO), and local Police.</li>
</ul>
<h4>Crucial Operational Restrictions:</h4>
<ol>
  <li><strong>Maximum Altitude:</strong> Standard maximum flight altitude is strictly <strong>200 feet (60 meters) Above Ground Level (AGL)</strong> unless special CAAB waiver is granted. PhytoGuard foliar sorties fly well within this limit (15–25m AGL).</li>
  <li><strong>No-Fly Zones (NFZ):</strong> Flying within <strong>9.3 km (5 nautical miles)</strong> of any active airport (Hazrat Shahjalal, Shah Amanat, Osmani, Saidpur, Rajshahi, Barishal, Cox's Bazar) is strictly prohibited without explicit air traffic control clearance.</li>
  <li><strong>Border Proximity:</strong> Drone flights within <strong>5 km of international borders</strong> (India/Myanmar) are strictly restricted and require Ministry of Home Affairs approval.</li>
</ol>`,
        content_bn: `<h3>বাংলাদেশে ড্রোন নিবন্ধন ও আইনি বাধ্যবাধকতা (CAAB গাইড)</h3>
<p>বাংলাদেশে বাণিজ্যিকভাবে ড্রোন পরিচালনার ক্ষেত্রে <strong>বেসামরিক বিমান চলাচল কর্তৃপক্ষ (সিএএবি) ড্রোন উড্ডয়ন নীতিমালা ২০২০</strong> কঠোরভাবে অনুসরণ করতে হয়:</p>
<h4>ড্রোনের ক্যাটাগরি বিভাজন:</h4>
<ul>
  <li><strong>ক্যাটাগরি 'ক' (ব্যক্তিগত/মাইক্রো):</strong> ৫ কেজির নিচে ওজনের ড্রোন, যা অবাণিজ্যিক কাজে ব্যবহৃত হয়।</li>
  <li><strong>ক্যাটাগরি 'খ' (বাণিজ্যিক কৃষি নজরদারি):</strong> ৫ থেকে ২৫ কেজি পর্যন্ত ওজনের ড্রোন (যেমন: ডিজেআই ম্যাভিক ৩ মাল্টিস্পেকট্রাল)। এর জন্য সিএএবি অনলাইন পোর্টালে ডিজিটাল নিবন্ধন সম্পন্ন করতে হবে।</li>
  <li><strong>ক্যাটাগরি 'গ' ও 'ঘ' (ভারী স্প্রে ড্রোন):</strong> ২৫ কেজির বেশি ওজনের স্প্রে ড্রোন (যেমন: ডিজেআই এগ্রাস টি৪০)। এর জন্য সিএএবি, বেসামরিক বিমান পরিবহন ও পর্যটন মন্ত্রণালয় এবং স্থানীয় জেলা প্রশাসন (ডিসি/ইউএনও) ও পুলিশের অনুমতি প্রয়োজন।</li>
</ul>
<h4>অত্যন্ত গুরুত্বপূর্ণ উড্ডয়ন বিধিনিষেধ:</h4>
<ol>
  <li><strong>সর্বোচ্চ উচ্চতা সীমা:</strong> মাটি থেকে সর্বোচ্চ <strong>২০০ ফুট (৬০ মিটার)</strong> উচ্চতার মধ্যে উড়তে হবে। ফাইটোগার্ডের কৃষি স্ক্যানিং সাধারণত ১৫-২৫ মিটারের মধ্যেই সম্পন্ন হয়।</li>
  <li><strong>বিমানবন্দর নো-ফ্লাই জোন:</strong> দেশের যে কোনো সক্রিয় বিমানবন্দর (ঢাকা, চট্টগ্রাম, সিলেট, সৈয়দপুর, রাজশাহী, বরিশাল, কক্সবাজার ইত্যাদি) থেকে <strong>৯.৩ কিলোমিটারের (৫ নটিক্যাল মাইল)</strong> মধ্যে ড্রোন উড্ডয়ন সম্পূর্ণ নিষিদ্ধ।</li>
  <li><strong>সীমান্তবর্তী এলাকা:</strong> আন্তর্জাতিক সীমান্ত রেখার <strong>৫ কিলোমিটারের</strong> ভেতরে ড্রোন ওড়াতে স্বরাষ্ট্র মন্ত্রণালয়ের বিশেষ অনুমতি আবশ্যক।</li>
</ol>`
      },
      {
        slug: 'login-troubleshooting',
        title: 'Dashboard Login & Account Troubleshooting',
        title_bn: 'ড্যাশবোর্ড লগইন ও অ্যাকাউন্ট পুনরুদ্ধার নির্দেশিকা',
        excerpt: 'Step-by-step account recovery, password reset, and role permissions for agronomists, farm managers, and growers.',
        excerpt_bn: 'পাসওয়ার্ড রিসেট ও কৃষিবিদ, খামার ব্যবস্থাপক এবং কৃষকদের বিভিন্ন রোল ও পারমিশন সহায়তা।',
        content: `<h3>Resolving Dashboard Access in Bangladesh</h3>
<p>If your farm team encounters difficulties signing in to PhytoGuard AI:</p>
<ul>
  <li>Ensure you are entering the registered email address (e.g. <code>farmer@agro.bd</code> or <code>ador@phytoguard.ai</code>).</li>
  <li>If your internet connection drops during authentication, your login credentials remain locally encrypted and cached for seamless offline review.</li>
  <li>Role permissions can be configured between <strong>Grower</strong>, <strong>Farm Manager</strong>, <strong>Agronomist (DAE/BARI)</strong>, and <strong>Enterprise Admin</strong>.</li>
</ul>`,
        content_bn: `<h3>ড্যাশবোর্ডে লগইন সহায়তা</h3>
<p>অ্যাকাউন্টে প্রবেশের ক্ষেত্রে কোনো সমস্যা হলে করণীয়:</p>
<ul>
  <li>নিবন্ধিত সঠিক ইমেইল আইডি প্রবেশ করাচ্ছেন কিনা নিশ্চিত হন।</li>
  <li>ইন্টারনেট সাময়িক বিচ্ছিন্ন হলেও পূর্ববর্তী সংরক্ষিত সেশনের মাধ্যমে ড্যাশবোর্ড অফলাইনে দেখা সম্ভব।</li>
  <li>ব্যবহারকারীর ধরন অনুযায়ী এক্সেস লেভেল নির্ধারিত থাকে (কৃষক, খামার ব্যবস্থাপক, কৃষিবিদ বা অ্যাডমিন)।</li>
</ul>`
      }
    ]
  },
  {
    id: 'reports',
    icon: 'document',
    title: 'Reports, Analytics & Crop Insurance',
    title_bn: 'প্রতিবেদন, অ্যানালিটিক্স ও শস্য বীমা',
    subtitle: 'Scouting reports for DAE, agronomists, and insurers',
    subtitle_bn: 'কৃষি সম্প্রসারণ অধিদপ্তর, গবেষক ও বীমা কোম্পানির জন্য রিপোর্ট',
    articles: [
      {
        slug: 'create-edit-report',
        title: 'Generating Field Scouting Reports for DAE & Insurers',
        title_bn: 'ডিএই ও বীমা কোম্পানির জন্য মাঠ পরিদর্শন রিপোর্ট তৈরি',
        excerpt: 'Generate executive PDF summaries of crop pathology detections, affected Bigha acreage, and prescription spray plans.',
        excerpt_bn: 'আক্রান্ত বিঘার হিসাব, জিপিএস হটস্পট ও স্প্রে প্রেসক্রিপশন সম্বলিত অফিশিয়াল পিডিএফ রিপোর্ট।',
        content: `<h3>Generating Agronomy &amp; Insurance Audit Reports in BD</h3>
<p>PhytoGuard generates standardized agronomic reports designed for submission to Upazila Agriculture Offices, DAE agronomists, and agricultural insurance adjusters (e.g. Green Delta Insurance crop schemes):</p>
<ol>
  <li>Navigate to your completed drone survey on the dashboard.</li>
  <li>Click <em>Generate Scouting Report</em> in the top-right action bar.</li>
  <li>Select report modules:
    <ul>
      <li><strong>Executive Overview:</strong> Total monitored Bighas/Hectares and overall canopy health percentage.</li>
      <li><strong>Pathology Findings:</strong> Detected diseases (e.g. Late Blight, Wheat Blast) with AI confidence ratings.</li>
      <li><strong>Affected Hotspot GPS Coordinates:</strong> Geotagged coordinates for spot-inspection.</li>
      <li><strong>Chemical Spray Prescription:</strong> Recommended chemical dosage compliant with DAE regulations.</li>
    </ul>
  </li>
  <li>Click <em>Download PDF</em> or generate an instant QR-code sharing link.</li>
</ol>`,
        content_bn: `<h3>কৃষি কর্মকর্তা ও শস্য বীমার জন্য রিপোর্ট তৈরি</h3>
<p>উপজেলা কৃষি অফিস, ডিএই কর্মকর্তা কিংবা শস্য বীমা দাবি নিষ্পত্তির জন্য প্রাতিষ্ঠানিক ফরম্যাটে রিপোর্ট প্রস্তুত করুন:</p>
<ol>
  <li>সম্পন্নকৃত ড্রোন স্ক্যানের ড্যাশবোর্ডে যান।</li>
  <li>উপরে ডানে থাকা <em>Generate Scouting Report</em> বাটনে ক্লিক করুন।</li>
  <li>রিপোর্টের অংশগুলো নির্বাচন করুন:
    <ul>
      <li><strong>সারসংক্ষেপ:</strong> মোট স্ক্যানকৃত বিঘা এবং ফসলের সার্বিক স্বাস্থ্য স্কোর।</li>
      <li><strong>শনাক্তকৃত রোগ:</strong> নাবী ধসা, ব্লাস্ট বা উইল্ট রোগের বিস্তারিত ও এআই কনফিডেন্স স্কোর।</li>
      <li><strong>আক্রান্ত স্থানের জিপিএস তালিকা:</strong> সরেজমিনে পরিদর্শনের জন্য দাগ নম্বর ও অক্ষাংশ-দ্রাঘিমাংশ।</li>
      <li><strong>প্রেসক্রিপশন গাইড:</strong> সরকারি নির্দেশিকা অনুযায়ী ছত্রাকনাশকের মাত্রা ও ছিটানোর সময়সূচি।</li>
    </ul>
  </li>
  <li><em>Download PDF</em> বাটনে চেপে এক ক্লিকে প্রিন্টযোগ্য ডকুমেন্ট নামিয়ে নিন।</li>
</ol>`
      },
      {
        slug: 'customizing-severity-alerts',
        title: 'Customizing Economic Injury Thresholds for BD Markets',
        title_bn: 'দেশীয় বাজারের অর্থনৈতিক ক্ষতিসীমা (ETL) নির্ধারণ',
        excerpt: 'Setting intervention triggers aligned with local mandi wholesale prices and cold-storage potato shelf-life preservation.',
        excerpt_bn: 'পাইকারি মোকামের আলুর দাম ও কোল্ড স্টোরেজের সংরক্ষণ মানদণ্ডের সাথে অ্যালার্ট টিউনিং।',
        content: `<h3>Economic Threshold Levels (ETL) for Bangladeshi Markets</h3>
<p>Different crops in Bangladesh require different intervention urgency based on local market dynamics and post-harvest storage:</p>
<ul>
  <li><strong>Cold-Storage Table Potatoes (Munshiganj &amp; Bogura):</strong> Tubers destined for long-term cold storage cannot tolerate even 1.5% Late Blight foliar infection, as spores wash down into soil ridges during winter irrigation. Set alert sensitivity to <em>High (1% threshold)</em>.</li>
  <li><strong>Winter Processing Tomatoes:</strong> Set alert threshold to <em>2% foliar surface</em> to catch Early Blight before it stains fruit destined for commercial ketchup or paste factories.</li>
  <li><strong>Commercial Wheat Belt (Dinajpur &amp; Rajshahi):</strong> For Wheat Blast (*Magnaporthe oryzae*), zero economic tolerance exists once heading begins; set alert trigger to <em>Zero-Tolerance (Immediate Alert)</em>.</li>
</ul>`,
        content_bn: `<h3>দেশীয় বাজারের জন্য অ্যালার্টের সংবেদনশীলতা নির্ধারণ</h3>
<p>স্থানীয় পাইকারি মোকাম ও কোল্ড স্টোরেজের চাহিদার ভিত্তিতে রোগের অ্যালার্ট থ্রেশহোল্ড পরিবর্তন:</p>
<ul>
  <li><strong>মুন্সীগঞ্জ ও বগুড়ার কোল্ড স্টোরেজ আলু:</strong> হিমাগারে রাখার উপযোগী আলুর ক্ষেত্রে জমিতে নাবী ধসার মাত্রা ১.৫% হলেও ভয়াবহ ক্ষতি হতে পারে। তাই অ্যালার্টের সংবেদনশীলতা <em>High (১% থ্রেশহোল্ড)</em> রাখুন।</li>
  <li><strong>প্রসেসিং টমেটো:</strong> টমেটো পেস্ট বা প্রক্রিয়াজাতকরণ কারখানায় সরবরাহের ক্ষেত্রে আর্লি ব্লাইট বা দাগ লাগা ফল ঠেকাতে <em>২% থ্রেশহোল্ড</em> ব্যবহার করুন।</li>
  <li><strong>উত্তরাঞ্চলের গম চাষ (দিনাজপুর ও রাজশাহী):</strong> গমের ব্লাস্ট রোগের ক্ষেত্রে কোনো ছাড় নেই; একটি শীষেও সংক্রমণ দেখা দিলে তাৎক্ষণিক <em>Zero-Tolerance অ্যালার্ট</em> সক্রিয় হবে।</li>
</ul>`
      }
    ]
  },
  {
    id: 'resources',
    icon: 'leaf',
    title: 'Resources & BD Crop Pathologies',
    title_bn: 'রিসোর্স ও বাংলাদেশের প্রধান ফসলের রোগবালাই',
    subtitle: 'Diagnostic identification keys for the 6 primary crops of Bangladesh',
    subtitle_bn: 'বাংলাদেশের ৬টি প্রধান ফসলের রোগবালাই ও লক্ষণ শনাক্তকরণ গাইড',
    articles: [
      {
        slug: 'wheat-pathologies',
        title: 'Wheat: Wheat Blast, Yellow Rust, Powdery Mildew & Bipolaris Blight',
        title_bn: 'গম: গম ব্লাস্ট, হলুদ মরিচা, পাউডারি মিলডিউ ও বাইপোলারিস ব্লাইট',
        excerpt: 'Detailed symptom markers, Dinajpur/Meherpur historical surveillance, BARI Gom-33 blast-resistant varieties, and DAE spray protocols.',
        excerpt_bn: 'গমের মারাত্মক ব্লাস্ট ও হলুদ মরিচা রোগের লক্ষণ, বিএআরআই গম-৩৩ জাত ও বালাই ব্যবস্থাপনা।',
        content: `<h3>Wheat Pathologies in Bangladesh</h3>
<p>Wheat is a vital winter Rabi cereal in northern and southwestern Bangladesh. PhytoGuard AI monitors for 4 critical pathogens:</p>
<ul>
  <li><strong>Wheat Blast (<em>Magnaporthe oryzae</em> pv. <em>Triticum</em>):</strong> First detected in Meherpur and Chuadanga in 2016. Symptoms include premature bleaching of the wheat spike (শীষ শুকিয়ে সাদা হয়ে যাওয়া), while the lower portion remains green. Spindle-shaped grey-centered eye spots appear on leaves. PhytoGuard flags early foliar lesions 7–10 days before ear emergence.</li>
  <li><strong>Yellow / Stripe Rust (<em>Puccinia striiformis</em>):</strong> Major epidemic risk during cool northern winters in Dinajpur, Panchagarh, and Thakurgaon. Symptoms: Bright yellow-orange pustules arranged in linear stripes parallel to leaf veins.</li>
  <li><strong>Bipolaris Leaf Blight (<em>Bipolaris sorokiniana</em>):</strong> Common foliar blight characterized by small brown oval spots expanding into irregular necrotic patches.</li>
  <li><strong>Powdery Mildew (<em>Blumeria graminis</em>):</strong> Greyish-white cottony mycelial patches across dense lower leaf canopies.</li>
</ul>
<h4>DAE Management Protocol:</h4>
<p>Promote blast-resistant varieties such as <strong>BARI Gom-33</strong> and <strong>WMRI Gom-3</strong>. At first drone detection, apply preventive triazole/strobilurin fungicides (e.g. Nativo 75 WG @ 0.75 g/L or Amistar Top 325 SC @ 1 ml/L) during heading.</p>`,
        content_bn: `<h3>বাংলাদেশে গমের প্রধান রোগবালাই ও ব্যবস্থাপনা</h3>
<p>বাংলাদেশের উত্তরাঞ্চলে গম একটি প্রধান অর্থকরী ফসল। ফাইটোগার্ড এআই গমের ৪টি প্রধান রোগ পর্যবেক্ষণ করে:</p>
<ul>
  <li><strong>গম ব্লাস্ট (<em>Magnaporthe oryzae</em>):</strong> ২০১৬ সালে মেহেরপুরে প্রথম শনাক্ত হওয়া এই ছত্রাক গমের শীষকে অপরিপক্ব অবস্থায় শুকিয়ে সাদা করে ফেলে এবং পাতায় চোখের মতো ধূসর দাগ তৈরি করে। ফাইটোগার্ড শীষ আসার আগেই পাতায় এর লক্ষণ চিহ্নিত করে।</li>
  <li><strong>হলুদ মরিচা (<em>Puccinia striiformis</em>):</strong> দিনাজপুর, পঞ্চগড় ও ঠাকুরগাঁওয়ের শীতকালে বেশি দেখা যায়। পাতার শিরার সমান্তরালে হলুদ গুঁড়োর মতো রেখা তৈরি হয়।</li>
  <li><strong>বাইপোলারিস পাতা পোড়া রোগ (<em>Bipolaris sorokiniana</em>):</strong> পাতায় বাদামি ও ডিম্বাকৃতি দাগ তৈরি করে পাতা ঝলসে দেয়।</li>
  <li><strong>পাউডারি মিলডিউ:</strong> ঘন পাতার নিচে সাদা তুলার মতো ছত্রাকের প্রলেপ পড়ে।</li>
</ul>
<h4>প্রস্তাবিত ব্যবস্থাপনা:</h4>
<p>ব্লাস্ট প্রতিরোধী <strong>বারি গম-৩৩</strong> চাষ করুন। ড্রোনে রোগ ধরা পড়লে শীষ বের হওয়ার সময় অনুমোদিত ছত্রাকনাশক (যেমন: নেটিভো ৭৫ ডব্লিউজি প্রতি লিটারে ০.৭৫ গ্রাম বা এমিস্টার টপ ৩২৫ এসসি প্রতি লিটারে ১ মিলি) স্প্রে করুন।</p>`
      },
      {
        slug: 'tomato-pathologies',
        title: 'Tomatoes: Late Blight, Early Blight, Bacterial Wilt & Leaf Curl Virus',
        title_bn: 'টমেটো: নাবী ধসা, আগাম ধসা, ব্যাকটেরিয়াল উইল্ট ও পাতা কোঁকড়ানো ভাইরাস',
        excerpt: 'Winter fog blight management in Bogura and Rajshahi, whitefly vector control, and silt loam soil bacterial wilt prevention.',
        excerpt_bn: 'বগুড়া ও রাজশাহীর শীতের কুয়াশায় টমেটোর ব্লাইট ও সাদা মাছি বাহিত ভাইরাস দমন গাইড।',
        content: `<h3>Tomato Pathologies in Bangladesh</h3>
<p>Tomatoes are cultivated extensively across Bogura, Jashore, Rajshahi, and Cumilla during both winter (Rabi) and summer (Kharif) seasons:</p>
<ul>
  <li><strong>Late Blight (<em>Phytophthora infestans</em>):</strong> Highly devastating during prolonged foggy weather with high humidity in December–January. Dark water-soaked lesions appear on leaves, with white fungal sporulation underneath during early morning hours. Can decimate a 10-Bigha tomato plot within 4 days.</li>
  <li><strong>Early Blight (<em>Alternaria solani</em>):</strong> Concentric dark brown "target-board" rings appearing on older lower leaves, causing premature defoliation.</li>
  <li><strong>Tomato Leaf Curl Virus (TYLCV):</strong> Transmitted by the whitefly vector (<em>Bemisia tabaci</em>). Infected plants exhibit severe upward leaf curling, yellowing of leaf margins, and severe stunting.</li>
  <li><strong>Bacterial Wilt (<em>Ralstonia solanacearum</em>):</strong> Rapid daytime wilting of green plants in warm silt loam soils without prior yellowing.</li>
</ul>
<h4>Prescription Guidance:</h4>
<p>For Late Blight, apply Ridomil Gold (Metalaxyl + Mancozeb @ 2 g/L) or Acrobat MZ immediately upon drone detection. For whitefly control, apply Imidacloprid (Admire/Tido @ 0.5 ml/L).</p>`,
        content_bn: `<h3>টমেটোর ক্ষতিকর রোগ ও তার প্রতিকার</h3>
<p>বগুড়া, যশোর, রাজশাহী ও কুমিল্লা অঞ্চলের টমেটো ক্ষেতে সচরাচর যেসব রোগ আক্রমণ করে:</p>
<ul>
  <li><strong>নাবী ধসা / লেইট ব্লাইট:</strong> পৌষ-মাঘ মাসের ঘন কুয়াশায় এই ছত্রাক দ্রুত ছড়ায়। পাতার কিনারায় কালচে ভেজা দাগ হয় এবং পাতার উল্টো পিঠে সাদা তুলার মতো ছত্রাক দেখা যায়। কয়েকদিনের মধ্যে পুরো ক্ষেত পুড়ে যায়।</li>
  <li><strong>আগাম ধসা / আর্লি ব্লাইট:</strong> পুরনো নিচের পাতায় গোল গোল চক্রাকার বাদামি দাগ পড়ে।</li>
  <li><strong>পাতা কোঁকড়ানো ভাইরাস (TYLCV):</strong> সাদা মাছি পোকা দ্বারা বাহিত হয়। আক্রান্ত গাছের পাতা কুঁকড়ে যায় এবং গাছ খর্বাকৃতি হয়ে ফল আসা বন্ধ হয়ে যায়।</li>
  <li><strong>ব্যাকটেরিয়াল উইল্ট (ঢলে পড়া):</strong> সবুজ থাকা অবস্থাতেই গাছ হঠাৎ দুপুরে ঢলে পড়ে এবং মারা যায়।</li>
</ul>
<h4>প্রস্তাবিত প্রতিকার:</h4>
<p>লেইট ব্লাইট দেখা দিলে তাৎক্ষণিক রিডোমিল গোল্ড (প্রতি লিটার পানিতে ২ গ্রাম) স্প্রে করুন। সাদা মাছি দমনে ইমিডাক্লোপ্রিড গ্রুপের ওষুধ ব্যবহার করুন।</p>`
      },
      {
        slug: 'potato-pathologies',
        title: 'Potatoes: Late Blight (নাবী ধসা) & Early Blight in Munshiganj & Bogura',
        title_bn: 'আলু: মুন্সীগঞ্জ ও বগুড়ায় নাবী ধসা (Late Blight) ও আগাম ধসা শনাক্তকরণ',
        excerpt: 'Early warning protocols for Munshiganj, Bogura, and Rangpur potato belts to protect Diamant, Cardinal, and Asterix crops.',
        excerpt_bn: 'ডায়মন্ট, কার্ডিনাল ও অ্যাস্টেরিক্স আলুর জমিতে ৩-৫ দিন আগেই নাবী ধসার পূর্বাভাস।',
        content: `<h3>Potato Pathologies in the National Potato Belts</h3>
<p>Bangladesh ranks among the top 10 potato producers worldwide, with production concentrated in Munshiganj, Bogura, Rangpur, and Joypurhat. Foliar protection is critical for commercial yields:</p>
<ul>
  <li><strong>Late Blight (<em>Phytophthora infestans</em>):</strong> The single greatest economic threat to Bangladeshi potato farmers. It strikes when nighttime temperatures dip to 10°C–15°C with relative humidity above 90% and continuous overcast or foggy days. Water-soaked pale green lesions rapidly turn dark brown to black. PhytoGuard AI detects the micro-lesions 3 to 5 days before field collapse.</li>
  <li><strong>Early Blight (<em>Alternaria solani</em>):</strong> Characteristic dry brown concentric rings on lower leaves, appearing when dry sunny days follow humid periods.</li>
  <li><strong>Stem Rot (<em>Sclerotium rolfsii</em>):</strong> White mycelial fan at stem bases near the soil line with mustard-seed-like sclerotia.</li>
</ul>
<h4>Varietal Resilience &amp; Treatment:</h4>
<p>Popular varieties include BARI Alu-7 (Diamant), BARI Alu-8 (Cardinal), and Asterix. At the first AI alert, apply Mancozeb (Dithane M-45 @ 2 g/L) preventively, or Curzate M8 (Cymoxanil + Mancozeb) curatively.</p>`,
        content_bn: `<h3>মুন্সীগঞ্জ ও উত্তরাঞ্চলের আলুর নাবী ধসা রোগ ব্যবস্থাপনা</h3>
<p>বাংলাদেশ বিশ্বের অন্যতম শীর্ষ আলু উৎপাদনকারী দেশ। মুন্সীগঞ্জ, বগুড়া ও রংপুর অঞ্চলে আলুর দুটি প্রধান রোগ:</p>
<ul>
  <li><strong>নাবী ধসা / লেইট ব্লাইট:</strong> আলুর সবচেয়ে মারাত্মক রোগ। রাতে তাপমাত্রা ১০-১৫ ডিগ্রি এবং আর্দ্রতা ৯০% এর বেশি হলে কুয়াশাচ্ছন্ন আবহাওয়ায় এই রোগ মহামারি আকারে ছড়ায়। ফাইটোগার্ড এআই পুরো ক্ষেত নষ্ট হওয়ার ৩-৫ দিন আগেই ড্রোনের মাধ্যমে প্রাথমিক স্পট চিহ্নিত করতে পারে।</li>
  <li><strong>আগাম ধসা / আর্লি ব্লাইট:</strong> নিচের পাতায় লক্ষ্যভেদী চক্রাকার বাদামি দাগ তৈরি করে।</li>
  <li><strong>কান্ড পচা রোগ:</strong> মাটির ঠিক উপরে কান্ডে সরিষার দানার মতো সাদা ও বাদামি গুটি তৈরি হয়।</li>
</ul>
<h4>বালাই দমন পরামর্শ:</h4>
<p>জনপ্রিয় ডায়মন্ট ও কার্ডিনাল জাতের আলুতে প্রথম সতর্কবার্তা পাওয়ার সাথে সাথে ম্যানকোজেব (ডাইথেন এম-৪৫) অথবা কারজেট এম-৮ অনুমোদিত মাত্রায় স্প্রে করুন।</p>`
      },
      {
        slug: 'soybean-pathologies',
        title: 'Soybeans: Soybean Rust & Charcoal Rot in Coastal Chars',
        title_bn: 'সয়াবিন: উপকূলীয় চরাঞ্চলে সয়াবিন রাস্ট ও চারকোল রট রোগ',
        excerpt: 'Coastal char cultivation in Lakshmipur (Raipur, Ramgati), Noakhali (Subarnachar), and Bhola; managing salinity stress and defoliation.',
        excerpt_bn: 'লক্ষ্মীপুর, নোয়াখালী ও ভোলার চরাঞ্চলে সয়াবিনের মরিচা রোগ ও উপকূলীয় লবণাক্ততা ব্যবস্থাপনা।',
        content: `<h3>Soybean Pathologies in Bangladesh Coastal Belts</h3>
<p>Over 80% of Bangladesh’s soybeans are produced in the coastal char districts of Lakshmipur (Raipur, Ramgati, Kamalnagar), Noakhali (Subarnachar), and Bhola during the Rabi season:</p>
<ul>
  <li><strong>Soybean Rust (<em>Phakopsora pachyrhizi</em>):</strong> Highly aggressive airborne fungus. Symptoms begin as tiny chlorotic specks on lower leaves, developing into raised reddish-brown or tan pustules that cause premature leaf drop and drastically reduced pod fill.</li>
  <li><strong>Charcoal Rot (<em>Macrophomina phaseolina</em>):</strong> Promoted by soil moisture stress and coastal salinity in late Rabi. Stems show silvery-grey discoloration with tiny black microsclerotia within the pith.</li>
  <li><strong>Yellow Mosaic Virus:</strong> Vectored by whiteflies, resulting in alternating yellow and green patches on foliage.</li>
</ul>
<h4>DAE Management Protocol:</h4>
<p>Promote varieties BARI Soybean-5 and BARI Soybean-6. Apply Azoxystrobin or Tebuconazole (Folicur @ 1 ml/L) at first drone detection during pre-flowering.</p>`,
        content_bn: `<h3>উপকূলীয় চরাঞ্চলে সয়াবিনের রোগবালাই</h3>
<p>বাংলাদেশের সিংহভাগ সয়াবিন উৎপাদিত হয় লক্ষ্মীপুর (রায়পুর, রামগতি), নোয়াখালী (সুবর্ণচর) ও ভোলার চরাঞ্চলে:</p>
<ul>
  <li><strong>সয়াবিন মরিচা রোগ (Soybean Rust):</strong> অত্যন্ত আগ্রাসী ছত্রাক রোগ। নিচের পাতায় ছোট ছোট ফোস্কার মতো দাগ তৈরি করে এবং দ্রুত পাতা ঝরিয়ে দেয়, ফলে শুঁটিতে দানা পুষ্ট হয় না।</li>
  <li><strong>চারকোল রট / কয়লা পচা রোগ:</strong> মৌসুমের শেষভাগে খরা ও মাটির লবণাক্ততার কারণে কান্ডে কাঠকয়লার গুঁড়োর মতো কালো দাগ দেখা দেয়।</li>
  <li><strong>হলুদ মোজাইক ভাইরাস:</strong> পাতায় হালকা হলুদ ও সবুজ ছোপ ছোপ দাগ দেখা যায়।</li>
</ul>
<h4>ব্যবস্থাপনা:</h4>
<p>বারি সয়াবিন-৫ ও ৬ জাত চাষ করুন। গাছে ফুল আসার পূর্বে রোগ দেখা দিলে টেবুকোনাজল গ্রুপের ছত্রাকনাশক স্প্রে করুন।</p>`
      },
      {
        slug: 'cucumber-pathologies',
        title: 'Cucumbers: Downy Mildew, Anthracnose & Powdery Mildew in BD',
        title_bn: 'শসা ও করলা: ডাউনি মিলডিউ, অ্যানথ্রাকনোজ ও পাউডারি মিলডিউ',
        excerpt: 'High-density trellis cucumber cultivation in Jashore, Bogura, and Cumilla; greenhouse and open field foliar rot management.',
        excerpt_bn: 'যশোর ও বগুড়ার মাচায় চাষকৃত শসা ও করলার ডাউনি মিলডিউ ও ফল পচা রোগ দমন।',
        content: `<h3>Cucurbit Pathologies in Bangladeshi Vegetable Belts</h3>
<p>Cucumbers and gourds are grown on bamboo trellises (বাঁশের মাচা) across Jashore, Bogura, Narsingdi, and Cumilla:</p>
<ul>
  <li><strong>Downy Mildew (<em>Pseudoperonospora cubensis</em>):</strong> Angular chlorotic yellow spots restricted by leaf veins on the upper surface, with purplish-grey downy spore growth underneath during humid conditions.</li>
  <li><strong>Anthracnose (<em>Colletotrichum orbiculare</em>):</strong> Circular water-soaked brown leaf spots that enlarge, dry up, and drop out, creating a "shot-hole" appearance. Sunken dark cankers develop on harvest-ready fruits.</li>
  <li><strong>Powdery Mildew (<em>Podosphaera xanthii</em>):</strong> White talcum-powder-like fungal patches on leaf surfaces and petioles.</li>
</ul>
<h4>Foliar Treatment:</h4>
<p>Apply Acrobat MZ (Dimethomorph + Mancozeb @ 2 g/L) for Downy Mildew. For Anthracnose, apply Autostin (Carbendazim @ 1 g/L) or Tilt (Propiconazole @ 0.5 ml/L).</p>`,
        content_bn: `<h3>মাচায় চাষকৃত শসার প্রধান রোগবালাই</h3>
<p>যশোর, বগুড়া, নরসিংদী ও কুমিল্লায় মাচায় চাষকৃত শসা ও করলার রোগসমূহ:</p>
<ul>
  <li><strong>ডাউনি মিলডিউ:</strong> পাতার উপরের পৃষ্ঠে শিরা দ্বারা সীমাবদ্ধ চারকোনা হলুদ দাগ পড়ে এবং নিচে বেগুনি-ধূসর রঙের ছত্রাকের প্রলেপ দেখা যায়।</li>
  <li><strong>অ্যানথ্রাকনোজ (ক্ষত রোগ):</strong> পাতায় গোলাকার বাদামি দাগ হয় যা শুকিয়ে খসে পড়ে এবং পাতায় ছিদ্র তৈরি হয়। শসার গায়ে দেবে যাওয়া কালো ক্ষত সৃষ্টি হয়।</li>
  <li><strong>পাউডারি মিলডিউ:</strong> পাতার উপরে ট্যালকম পাউডারের মতো সাদা গুঁড়োর প্রলেপ পড়ে।</li>
</ul>
<h4>প্রস্তাবিত বালাইনাশক:</h4>
<p>ডাউনি মিলডিউ দমনে এক্রোবেট এমজেড এবং অ্যানথ্রাকনোজ দমনে অটোস্টিন (প্রতি লিটারে ১ গ্রাম) বা টিল্ট ব্যবহার করুন।</p>`
      },
      {
        slug: 'grapevine-pathologies',
        title: 'High-Value Fruit & Canopy Protection in BD (Grapevines & Orchards)',
        title_bn: 'বাংলাদেশে উচ্চমূল্যের ফল ও উদ্যান ফসলের ক্যানোপি সুরক্ষা',
        excerpt: 'Specialized trellis inspection for emerging commercial table grape vineyards in Chuadanga/Jashore, dragon fruit, and guava orchards.',
        excerpt_bn: 'চুয়াডাঙ্গা ও যশোরের আঙ্গুর, ড্রাগন ফল ও পেয়ারা বাগানের আধুনিক ড্রোন নজরদারি।',
        content: `<h3>High-Value Fruit Canopy Diagnostics in Bangladesh</h3>
<p>Modern commercial fruit cultivation is expanding across Chuadanga, Jashore, Meherpur, and Gazipur, including high-tunnel table grapes, dragon fruit, and export-grade guava orchards:</p>
<ul>
  <li><strong>Powdery Mildew (<em>Erysiphe necator</em>):</strong> Ash-white fungal coating on grape clusters, young shoots, and foliage. Leads to fruit splitting and unmarketable bunches.</li>
  <li><strong>Downy Mildew (<em>Plasmopara viticola</em>):</strong> Yellow translucent "oil spot" lesions on upper foliage followed by dense white down underneath.</li>
  <li><strong>Anthracnose &amp; Fruit Scab (<em>Elsinoe ampelina</em>):</strong> "Bird's eye" dark sunken spots on stems and ripening berries.</li>
</ul>
<h4>Oblique Drone Scouting Technique:</h4>
<p>For trellised fruit canopies, fly PhytoGuard Sky missions at <strong>20–22 meters altitude with a 75° oblique camera angle</strong>. This captures both upper foliage and lower fruit cluster zones beneath the canopy.</p>`,
        content_bn: `<h3>উচ্চমূল্যের ফল ও ড্রাগন-আঙ্গুর বাগানের আধুনিক রোগ নির্ণয়</h3>
<p>চুয়াডাঙ্গা, মেহেরপুর ও গাজীপুরে বাণিজ্যিকভাবে আঙ্গুর ও ড্রাগন ফলের আবাদ বাড়ছে। এসব বাগানের সুরক্ষায় করণীয়:</p>
<ul>
  <li><strong>পাউডারি মিলডিউ:</strong> আঙ্গুরের থোকায় ও পাতায় ছাই রঙের পাউডারের মতো আবরণ তৈরি করে এবং ফল ফেটে যায়।</li>
  <li><strong>ডাউনি মিলডিউ:</strong> পাতার উপরে তৈলাক্ত দাগ ও নিচে সাদা ডাউন তৈরি করে ফলন ধ্বংস করে।</li>
  <li><strong>অ্যানথ্রাকনোজ (পাখির চোখের মতো দাগ):</strong> ফলে ও কান্ডে গোল দেবে যাওয়া ক্ষত তৈরি করে।</li>
</ul>
<h4>ড্রোন উড্ডয়ন পদ্ধতি:</h4>
<p>মাচাযুক্ত ফল বাগানের জন্য ক্যামেরা ৭৫ ডিগ্রি বাঁকা (oblique) করে ২০-২২ মিটার উচ্চতায় ড্রোন ওড়ানো হয়, যাতে পাতার নিচের থোকাগুলো ক্যামেরায় পরিষ্কার ধরা পড়ে।</p>`
      }
    ]
  }
];
