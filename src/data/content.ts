export const SITE = {
  name: "CDS International Global Resources Limited",
  short: "CDS IGRL",
  url: "https://cdsigrl.theboostnation.space",
  email: "info@cdsigrl.org",
  phone: "+234 800 CDS IGRL",
  phoneHref: "tel:+2348002742475",
  address: "House 21, Megro Crescent, Maitama, Abuja, Nigeria",
};

export type Pillar = {
  n: string;
  slug: string;
  title: string;
  hook: string;
  short: string;
  body: string;
  tags: string[];
  outcome: string;
  bestFor: string;
  deliverables: string[];
};

export const PILLARS: Pillar[] = [
  {
    n: "01",
    slug: "retail-food-packaging",
    title: "Retail & Food Packaging",
    hook: "Trade measurements must be accurate, fast, and compliant. We supply and support scales and checkweighers built for retail and food operations.",
    short: "Price-computing scales, checkweighers, and multihead weighers for supermarkets, delis, and food packaging operations.",
    body: "CDS IGRL supplies price-computing scales, retail checkweighers, and multihead weighers for supermarkets, delis, bakeries, and food packaging lines. We help clients select equipment that meets Nigerian legal metrology standards, then support installation, calibration, and compliance certification so every transaction is fair and traceable.",
    tags: ["Scales", "Checkweighers", "Compliance"],
    outcome: "Accurate trade measurements, faster checkout, and confidence during regulatory inspections.",
    bestFor: "Supermarkets, delis, bakeries, and food packaging operations.",
    deliverables: ["Equipment selection", "Installation support", "Calibration", "Compliance certification"],
  },
  {
    n: "02",
    slug: "fuel-industrial-flow",
    title: "Fuel & Industrial Flow",
    hook: "Liquid and fuel measurement is high-stakes. We provide flow meters and dispensers engineered for accuracy in demanding industrial environments.",
    short: "Turbine flow meters, fuel dispensers, ultrasonic and Coriolis mass flow meters for oil & gas, chemical, and industrial applications.",
    body: "We source and deploy turbine flow meters, fuel dispensers, ultrasonic flow meters, and Coriolis mass flow meters for oil & gas, chemical processing, and industrial liquid transfer. Our team ensures each instrument is matched to the application, installed correctly, and traceable to measurement standards.",
    tags: ["Flow Meters", "Fuel Dispensers", "Oil & Gas"],
    outcome: "Reliable liquid measurement, reduced product loss, and audit-ready compliance documentation.",
    bestFor: "Fuel stations, depots, chemical plants, and liquid-processing facilities.",
    deliverables: ["Flow-meter selection", "Dispenser supply", "Installation supervision", "Calibration support"],
  },
  {
    n: "03",
    slug: "truck-bulk-weighing",
    title: "Truck & Bulk Weighing",
    hook: "Bulk weight drives revenue, logistics, and safety. We deliver weighbridges and load-cell systems that stand up to heavy use.",
    short: "Truck weighbridges, column load cells, conveyor belt scales, and weigh-in-motion systems for heavy industry.",
    body: "CDS IGRL supplies truck weighbridges, column load cells, conveyor belt scales, and weigh-in-motion systems for quarries, agriculture, logistics yards, and mining operations. We focus on rugged accuracy, local support, and compliance with weights and measures regulations across Nigeria.",
    tags: ["Weighbridges", "Load Cells", "Mining"],
    outcome: "Accurate bulk weighing, improved load control, and fewer compliance disputes.",
    bestFor: "Quarries, farms, logistics hubs, and mining operations.",
    deliverables: ["Weighbridge supply", "Load-cell installation", "System commissioning", "Ongoing support"],
  },
  {
    n: "04",
    slug: "hospitality-agriculture",
    title: "Hospitality & Agriculture",
    hook: "From bar pours to grain moisture, precise measurement protects margins and quality in hospitality and farming.",
    short: "Spirit measures, beverage flow meters, livestock scales, and grain moisture meters for hotels, bars, breweries, and farms.",
    body: "We provide spirit measures, beverage flow meters, livestock scales, and grain moisture meters for hotels, bars, breweries, and agricultural operations. Each solution is chosen for the local environment and backed by calibration guidance so measurements stay accurate season after season.",
    tags: ["Beverage", "Agriculture", "Livestock"],
    outcome: "Better inventory control, reduced waste, and consistent product quality.",
    bestFor: "Hotels, bars, breweries, farms, and feed mills.",
    deliverables: ["Equipment supply", "Installation support", "Calibration", "Training"],
  },
  {
    n: "05",
    slug: "utilities-transport",
    title: "Utilities & Transport",
    hook: "Public services and transport depend on trusted meters. We supply electricity meters and taxi meters built for accountability.",
    short: "Smart electricity meters, GPS taximeters, and utility measurement solutions for power distribution and transport.",
    body: "CDS IGRL supplies smart electricity meters, GPS taximeters, and utility measurement solutions for power distribution companies, transportation fleets, and public-service providers. We prioritize certified accuracy, tamper resistance, and local support capability.",
    tags: ["Electricity Meters", "Taximeters", "Utilities"],
    outcome: "Fair billing, reduced revenue leakage, and trusted public measurement.",
    bestFor: "Power distributors, taxi / transport fleets, and utility agencies.",
    deliverables: ["Meter procurement", "Supply logistics", "Installation support", "Compliance guidance"],
  },
  {
    n: "06",
    slug: "laboratory-precision",
    title: "Laboratory & Precision",
    hook: "Research and quality control demand exact measurements. We supply analytical balances and precision scales for labs and pharmacies.",
    short: "Analytical balances, pharmacy counting scales, and high-precision jewellery scales for laboratories and quality control.",
    body: "We source analytical balances, pharmacy counting scales, and high-precision jewellery scales for pharmaceutical, research, and quality-control laboratories. Every instrument is selected for resolution, repeatability, and traceability to support regulatory and scientific accuracy.",
    tags: ["Balances", "Pharmacy", "QC Labs"],
    outcome: "Traceable precision, compliant lab workflows, and reliable quality control.",
    bestFor: "Pharmaceutical labs, research institutions, and jewellery / precious-metal operations.",
    deliverables: ["Precision instrument selection", "Supply & delivery", "Calibration support", "Maintenance guidance"],
  },
];

export const STEPS = [
  { label: "01 · Assess", title: "Understand your measurement environment.", desc: "We review your application, regulatory requirements, site conditions, and accuracy needs to identify the right instruments." },
  { label: "02 · Select", title: "Choose certified equipment for the job.", desc: "We recommend equipment from verified global manufacturers that matches Nigerian legal metrology standards and your operational demands." },
  { label: "03 · Install", title: "Put the system to work.", desc: "We support delivery, installation, and commissioning so instruments are positioned and configured for accurate, repeatable performance." },
  { label: "04 · Certify", title: "Confirm compliance.", desc: "We guide calibration and compliance certification so your measurements stand up to regulatory and customer scrutiny." },
  { label: "05 · Support", title: "Keep it accurate.", desc: "Our team remains available for maintenance, recalibration, troubleshooting, and replacement as your operations grow." },
];

export const AUDIENCES = [
  { code: "RT", title: "Retail & Packaging", sub: "Trade Measurement", desc: "Supermarkets, food packagers, and retail outlets needing accurate, certified scales and checkweighers.", focus: "Checkout accuracy · Compliance" },
  { code: "IN", title: "Industrial & Energy", sub: "Flow & Bulk", desc: "Oil & gas, chemical, logistics, and mining operations measuring fuel, liquid flow, and bulk weight.", focus: "Flow meters · Weighbridges" },
  { code: "HC", title: "Healthcare & Science", sub: "Precision", desc: "Pharmaceutical, research, and quality-control laboratories requiring analytical precision.", focus: "Balances · Lab compliance" },
];

export const VALUES = [
  { title: "Certified Accuracy", desc: "Every instrument we supply is chosen to meet Nigerian legal metrology standards and the demands of real-world use." },
  { title: "Nationwide Reach", desc: "Headquartered in Abuja and equipped to serve clients across all 36 states of Nigeria." },
  { title: "After-Sales Support", desc: "We do not stop at delivery. Calibration, maintenance, and troubleshooting keep your measurements reliable." },
];

export const SECTORS = [
  "Retail", "Manufacturing", "Oil & Gas", "Healthcare", "Agriculture", "Logistics", "Utilities",
];

export const FAQS = [
  { q: "Do you only supply equipment, or do you also install and calibrate?", a: "We support the full lifecycle: selection, supply, installation supervision, calibration, compliance certification, and ongoing maintenance." },
  { q: "Can you serve clients outside Abuja?", a: "Yes. We serve clients across all 36 states in Nigeria, with our headquarters in Maitama, Abuja." },
  { q: "What industries do you cover?", a: "Retail, manufacturing, oil & gas, healthcare, agriculture, logistics, utilities, and scientific research." },
  { q: "Are your instruments compliant with Nigerian legal metrology standards?", a: "Yes. Equipment is selected and verified to meet the relevant Nigerian and international certification requirements." },
  { q: "How do I request a quote or consultation?", a: "Contact us by phone or email, or fill the request form. We will assess your needs and recommend the right instruments." },
];

/** Photo for a service (public/os/services/<slug>.jpg, Unsplash License). */
export const serviceImage = (slug: string) => `/os/services/${slug}.jpg`;
