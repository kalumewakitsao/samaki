/**
 * The Samaki Express catalogue: products and services.
 *
 * Names and one-line summaries come from the live site (read 2026-09-30).
 * Longer descriptions explain what each item is for in general aquaculture
 * terms; they make no claims about price, stock, pack sizes or certification,
 * which are confirmed per request. Keep this file free of runtime imports:
 * scripts/generate-seo-files.mts reads it directly with Node.
 */

export type CategoryId =
  'fingerlings' | 'feeds' | 'hatchery' | 'testing' | 'aeration' | 'filtration';

export type IllustrationId =
  | 'fingerlings'
  | 'feeds'
  | 'hatchery'
  | 'testing'
  | 'aeration'
  | 'filtration'
  | 'support'
  | 'training'
  | 'delivery'
  | 'health'
  | 'audit'
  | 'water'
  | 'kit'
  | 'pen'
  | 'pump'
  | 'artemia';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  blurb: string;
  icon: string;
}

export interface Product {
  kind: 'product';
  slug: string;
  name: string;
  category: CategoryId;
  /** Overrides the category illustration. */
  illustration?: IllustrationId;
  summary: string;
  description: string[];
  goodFor: string[];
  tellUs: string[];
  quantityHint: string;
  related: string[];
}

export interface Service {
  kind: 'service';
  slug: string;
  name: string;
  icon: string;
  illustration: IllustrationId;
  summary: string;
  description: string[];
  includes: string[];
  tellUs: string[];
  related: string[];
}

export type Offering = Product | Service;

export const CATEGORIES: readonly Category[] = [
  {
    id: 'fingerlings',
    name: 'Fingerlings',
    shortName: 'Fingerlings',
    blurb: 'Young fish for stocking ponds, cages and tanks.',
    icon: 'fish',
  },
  {
    id: 'feeds',
    name: 'Feeds and supplements',
    shortName: 'Feeds',
    blurb: 'Starter and transition feeds for larvae and fry.',
    icon: 'feed',
  },
  {
    id: 'hatchery',
    name: 'Hatchery inputs',
    shortName: 'Hatchery',
    blurb: 'Spawning hormones for broodstock management.',
    icon: 'flask',
  },
  {
    id: 'testing',
    name: 'Water testing',
    shortName: 'Testing',
    blurb: 'Meters and kits to check water before it becomes a problem.',
    icon: 'gauge',
  },
  {
    id: 'aeration',
    name: 'Aeration and pumps',
    shortName: 'Aeration',
    blurb: 'Keep oxygen up and water moving.',
    icon: 'bubbles',
  },
  {
    id: 'filtration',
    name: 'Filtration',
    shortName: 'Filtration',
    blurb: 'Cleaner water for hatchery tanks.',
    icon: 'filter',
  },
];

export const PRODUCTS: readonly Product[] = [
  {
    kind: 'product',
    slug: 'fingerlings',
    name: 'Fingerlings',
    category: 'fingerlings',
    summary: 'Young fish for stocking ponds, cages and tanks, planned around your stocking date.',
    description: [
      'A good cycle starts with good stock. Tell us which species you farm, how many fingerlings you need and when you plan to stock, and we will confirm what is available, at what size, and how it will reach your farm.',
      'If you are stocking for the first time, share your pond, cage or tank size. It helps us check that the numbers you have in mind suit the space you have.',
    ],
    goodFor: ['New ponds and cages', 'Restocking after harvest', 'Farms scaling up production'],
    tellUs: [
      'The species you farm',
      'How many fingerlings you need',
      'The size or age you prefer, if you know it',
      'When you plan to stock',
      'Your pond, cage or tank size',
    ],
    quantityHint: 'For example, 2,000 fingerlings',
    related: ['wean-mix', 'water-tester-7-in-1', 'hatchery-supply'],
  },
  {
    kind: 'product',
    slug: 'artemia',
    name: 'Artemia',
    category: 'feeds',
    illustration: 'artemia',
    summary: 'High-protein hatchery feed to boost early-stage survival.',
    description: [
      'Artemia, also known as brine shrimp, is one of the most widely used first feeds in fish hatcheries. The cysts hatch into small, protein-rich live food that larvae can eat in their first days of feeding.',
      'Tell us how many larvae you rear per cycle and we will help you work out a sensible quantity.',
    ],
    goodFor: ['Hatcheries rearing larvae', 'The first days of feeding'],
    tellUs: [
      'How many larvae you rear per cycle',
      'How much you need',
      'What you feed at the moment',
    ],
    quantityHint: 'For example, 2 tins',
    related: ['wean-mix', 'internal-filter', 'ovaprim'],
  },
  {
    kind: 'product',
    slug: 'wean-mix',
    name: 'Wean Mix',
    category: 'feeds',
    summary: 'Transition feed blend designed for rapid fry growth.',
    description: [
      'Wean Mix helps fry move from live feed to dry feed. A steady weaning stage keeps fry eating and growing through one of the most delicate parts of the cycle.',
      'Share how many fry you are weaning and what they eat now, and we will suggest how much to order.',
    ],
    goodFor: ['Hatcheries weaning fry', 'Nursing fry before stocking out'],
    tellUs: ['How many fry you are weaning', 'What they eat now', 'How much you need'],
    quantityHint: 'For example, 5 kg',
    related: ['artemia', 'fingerlings', 'feed-water-management'],
  },
  {
    kind: 'product',
    slug: 'ovaprim',
    name: 'Ovaprim',
    category: 'hatchery',
    summary: 'Reliable spawning inducer for efficient broodstock cycles.',
    description: [
      'Ovaprim is an injectable hormone preparation that hatcheries use to induce spawning in broodstock, so spawning happens on a planned schedule rather than by chance.',
      'Our hatchery team can talk you through handling and use when we confirm your order.',
    ],
    goodFor: ['Hatcheries planning spawning runs', 'Broodstock management'],
    tellUs: ['The species you breed', 'How many broodstock you plan to spawn', 'How much you need'],
    quantityHint: 'For example, 2 vials',
    related: ['ovatide', 'artemia', 'hatchery-supply'],
  },
  {
    kind: 'product',
    slug: 'ovatide',
    name: 'Ovatide',
    category: 'hatchery',
    summary: 'Spawning hormone for consistent fertilisation results.',
    description: [
      'Ovatide is a spawning hormone used by hatcheries to bring broodstock into spawning together, which makes stripping and fertilisation easier to plan.',
      'Tell us about your broodstock and we will confirm the right quantity with you.',
    ],
    goodFor: ['Hatcheries planning spawning runs', 'Broodstock management'],
    tellUs: ['The species you breed', 'How many broodstock you plan to spawn', 'How much you need'],
    quantityHint: 'For example, 2 vials',
    related: ['ovaprim', 'wean-mix', 'hatchery-supply'],
  },
  {
    kind: 'product',
    slug: 'dissolved-oxygen-analyzer',
    name: 'Dissolved oxygen analyzer',
    category: 'testing',
    summary: 'Precision meter for tracking oxygen levels in ponds.',
    description: [
      'Low oxygen is one of the most common reasons fish go off feed, get stressed or die. A dissolved oxygen meter tells you the real level in the water, so you can aerate, reduce feeding or exchange water before fish suffer.',
      'Readings are most useful early in the morning, when oxygen is usually at its lowest.',
    ],
    goodFor: ['Ponds with high stocking density', 'Farms using aeration', 'Hatchery tanks'],
    tellUs: ['How many ponds or tanks you monitor', 'How many meters you need'],
    quantityHint: 'For example, 1 meter',
    related: ['water-tester-7-in-1', 'vento-airpump', 'air-compressor'],
  },
  {
    kind: 'product',
    slug: 'water-tester-7-in-1',
    name: '7-in-1 water tester',
    category: 'testing',
    illustration: 'pen',
    summary: 'Multi-parameter tester for daily pond monitoring.',
    description: [
      'One handheld tester that checks several water quality readings in one go, making a daily check quick enough to become a habit.',
      'Ask us which readings it covers and how it compares with single-parameter kits for your farm.',
    ],
    goodFor: ['Daily pond checks', 'Farmers starting a water log', 'Small and medium farms'],
    tellUs: ['How many ponds or tanks you monitor', 'How many testers you need'],
    quantityHint: 'For example, 1 tester',
    related: ['ammonium-test-kit', 'nitrite-test', 'dissolved-oxygen-analyzer'],
  },
  {
    kind: 'product',
    slug: 'ammonium-test-kit',
    name: 'Ammonium test kit',
    category: 'testing',
    illustration: 'kit',
    summary: 'Detect ammonia levels early to prevent stress.',
    description: [
      'Ammonia builds up from fish waste and uneaten feed. Even at low levels it can stress fish and slow growth. Regular testing shows you when to cut feeding or change water.',
    ],
    goodFor: ['Ponds and tanks with heavy feeding', 'Recirculating and tank systems'],
    tellUs: ['How many ponds or tanks you test', 'How many kits you need'],
    quantityHint: 'For example, 2 kits',
    related: ['nitrite-test', 'water-tester-7-in-1', 'feed-water-management'],
  },
  {
    kind: 'product',
    slug: 'nitrite-test',
    name: 'Nitrite (NO2) test',
    category: 'testing',
    illustration: 'kit',
    summary: 'Quick nitrite checks so you can act before fish are stressed.',
    description: [
      'Nitrite forms as ammonia breaks down and can harm fish when it builds up, especially in tanks and systems with little water exchange. A quick test tells you whether your water is keeping up.',
    ],
    goodFor: ['Tank and recirculating systems', 'Hatcheries', 'Ponds with low water exchange'],
    tellUs: ['How many ponds or tanks you test', 'How many tests you need'],
    quantityHint: 'For example, 2 kits',
    related: ['ammonium-test-kit', 'internal-filter', 'water-tester-7-in-1'],
  },
  {
    kind: 'product',
    slug: 'air-compressor',
    name: 'Air compressor',
    category: 'aeration',
    summary: 'Heavy-duty aeration support for large ponds.',
    description: [
      'A compressor pushes air through diffusers to lift oxygen levels across larger ponds and many tanks at once. It is the backbone of aeration on farms stocking at higher densities.',
      'Share your pond sizes and how many diffusers you run so we can help you choose the right setup.',
    ],
    goodFor: ['Large ponds', 'Farms stocking at higher densities', 'Many tanks on one air line'],
    tellUs: [
      'The size and number of ponds or tanks',
      'Your power supply',
      'How many units you need',
    ],
    quantityHint: 'For example, 1 unit',
    related: ['vento-airpump', 'dissolved-oxygen-analyzer', 'submersible-pump'],
  },
  {
    kind: 'product',
    slug: 'vento-airpump',
    name: 'Vento air pump',
    category: 'aeration',
    summary: 'Quiet, efficient air pump for intensive systems.',
    description: [
      'A compact air pump for tanks, hatchery systems and smaller ponds, where steady aeration matters and noise and power use should stay low.',
    ],
    goodFor: ['Hatchery and nursery tanks', 'Small ponds', 'Intensive systems'],
    tellUs: ['The number and size of tanks or ponds', 'How many pumps you need'],
    quantityHint: 'For example, 2 pumps',
    related: ['air-compressor', 'internal-filter', 'dissolved-oxygen-analyzer'],
  },
  {
    kind: 'product',
    slug: 'submersible-pump',
    name: 'Submersible pump',
    category: 'aeration',
    illustration: 'pump',
    summary: 'Reliable water circulation and transfer.',
    description: [
      'A submersible pump moves water where you need it: filling and draining ponds, exchanging water, or circulating water through a filter.',
      'Tell us how far and how high you need to move water so we can suggest a suitable pump.',
    ],
    goodFor: ['Water exchange', 'Filling and draining ponds', 'Circulation through filters'],
    tellUs: ['What you need to pump and how far', 'Your power supply', 'How many pumps you need'],
    quantityHint: 'For example, 1 pump',
    related: ['internal-filter', 'air-compressor', 'feed-water-management'],
  },
  {
    kind: 'product',
    slug: 'internal-filter',
    name: 'Internal liquid filter',
    category: 'filtration',
    summary: 'Compact filtration for hatchery tanks.',
    description: [
      'An internal filter sits inside the tank and keeps water cleaner between changes, which is especially valuable for larvae and fry in hatchery tanks.',
    ],
    goodFor: ['Hatchery and nursery tanks', 'Broodstock holding tanks'],
    tellUs: ['The number and volume of tanks', 'How many filters you need'],
    quantityHint: 'For example, 4 filters',
    related: ['vento-airpump', 'nitrite-test', 'artemia'],
  },
];

export const SERVICES: readonly Service[] = [
  {
    kind: 'service',
    slug: 'hatchery-supply',
    name: 'Fingerlings and hatchery supply',
    icon: 'fish',
    illustration: 'fingerlings',
    summary:
      'Fingerlings and hatchery inputs supplied to your stocking plan, with breeding support for hatcheries.',
    description: [
      'We supply fingerlings for stocking and the inputs hatcheries rely on, from spawning hormones to first feeds. For hatcheries, we also support setup and breeding programmes.',
    ],
    includes: [
      'Fingerlings matched to your species, numbers and stocking date',
      'Spawning hormones and first feeds for hatcheries',
      'Support with hatchery setup and breeding programmes',
    ],
    tellUs: ['Whether you stock fish or run a hatchery', 'Species and numbers', 'Your timeline'],
    related: ['fingerlings', 'ovaprim', 'artemia'],
  },
  {
    kind: 'service',
    slug: 'feed-water-management',
    name: 'Feed and water management',
    icon: 'droplet',
    illustration: 'water',
    summary: 'Balanced feeding plans with on-site water testing, treatment plans and monitoring.',
    description: [
      'Feed is usually the biggest cost on a fish farm, and water quality decides how well that feed turns into growth. We look at both together.',
    ],
    includes: [
      'Feeding plans for each stage of the cycle',
      'On-site water testing',
      'Water treatment plans and a simple monitoring routine',
    ],
    tellUs: ['Your farm type and size', 'What you feed now', 'Any water problems you have seen'],
    related: ['water-tester-7-in-1', 'dissolved-oxygen-analyzer', 'wean-mix'],
  },
  {
    kind: 'service',
    slug: 'on-site-farm-support',
    name: 'On-site farm support',
    icon: 'pin',
    illustration: 'support',
    summary: 'Field visits to your farm with a practical action plan you can follow.',
    description: [
      'A specialist visits your farm, looks at how it runs day to day, and leaves you with a clear action plan. We confirm whether a visit is possible in your area when we reply to your request.',
    ],
    includes: [
      'A farm visit by a field specialist',
      'A written action plan',
      'Follow-up support by phone',
    ],
    tellUs: ['Where your farm is', 'Your farm type and size', 'What you want help with'],
    related: ['farm-audits-advisory', 'health-biosecurity', 'training'],
  },
  {
    kind: 'service',
    slug: 'health-biosecurity',
    name: 'Health and biosecurity',
    icon: 'shield',
    illustration: 'health',
    summary:
      'Routine health screening, vaccination guidance and biosecurity routines suited to your farm.',
    description: [
      'Disease is easier to keep out than to treat. We help you set up routines that protect your stock, and screen fish so problems are caught early.',
    ],
    includes: [
      'Routine health screening',
      'Vaccination guidance',
      'Biosecurity routines for your farm',
    ],
    tellUs: ['Your farm type and species', 'Any signs of disease you have noticed'],
    related: ['on-site-farm-support', 'water-tester-7-in-1', 'feed-water-management'],
  },
  {
    kind: 'service',
    slug: 'farm-audits-advisory',
    name: 'Farm audits and advisory',
    icon: 'clipboard',
    illustration: 'audit',
    summary:
      'Operational audits, yield forecasting and performance tracking for each production cycle.',
    description: [
      'Know where your farm stands and what to fix first. An audit looks at stocking, feeding, water, labour and records, and turns them into a forecast and a short list of priorities.',
    ],
    includes: ['An operational audit', 'Yield forecasting', 'Performance tracking for each cycle'],
    tellUs: ['Your farm type and size', 'Your production goals', 'The records you keep today'],
    related: ['on-site-farm-support', 'training', 'feed-water-management'],
  },
  {
    kind: 'service',
    slug: 'training',
    name: 'Training and upskilling',
    icon: 'cap',
    illustration: 'training',
    summary: 'Hands-on workshops and remote coaching for you and your farm team.',
    description: [
      'Practical training that your team can put to work the next morning, from daily pond routines to hatchery practice.',
    ],
    includes: ['Hands-on workshops', 'Remote coaching', 'Training for new and growing farm teams'],
    tellUs: ['How many people you want trained', 'Topics you want covered', 'Where you are based'],
    related: ['on-site-farm-support', 'farm-audits-advisory', 'hatchery-supply'],
  },
  {
    kind: 'service',
    slug: 'delivery',
    name: 'Logistics and delivery',
    icon: 'truck',
    illustration: 'delivery',
    summary: 'Delivery of fingerlings, feeds and equipment, arranged when we confirm your order.',
    description: [
      'We deliver fingerlings, feeds and equipment. Delivery date, handling and cost are agreed with you when we confirm your order, so you know exactly what to expect.',
    ],
    includes: [
      'Delivery of fingerlings, feeds and equipment',
      'A delivery date agreed with you',
      'Handling suited to live fish',
    ],
    tellUs: ['Your location', 'What needs delivering', 'When you need it'],
    related: ['fingerlings', 'hatchery-supply', 'air-compressor'],
  },
];

export const PROCESS = [
  { title: 'Assess and plan', body: 'We review your farm setup and agree a plan that fits it.' },
  { title: 'Supply', body: 'We deliver fingerlings, feeds and equipment on an agreed schedule.' },
  {
    title: 'Train and support',
    body: 'On-site training plus support by phone when you need a second opinion.',
  },
  {
    title: 'Track and improve',
    body: 'We look at the results of each cycle and adjust what you do next.',
  },
] as const;

export function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function findOffering(slug: string): Offering | undefined {
  return findProduct(slug) ?? findService(slug);
}

export function findCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function offeringArt(o: Offering): IllustrationId {
  return o.kind === 'product' ? (o.illustration ?? o.category) : o.illustration;
}

export function offeringUrl(offering: Offering): string {
  return offering.kind === 'product' ? `/products/${offering.slug}` : `/services/${offering.slug}`;
}
