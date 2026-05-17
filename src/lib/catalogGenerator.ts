/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFD700
FLUO=#FFEA00
PASTEL=#FFF9C4

ICON_ASCII:
family=lucide
glyph=wrench

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.SRC.LIB.CATALOG_GENERATOR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = catalogGenerator.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/lib/catalogGenerator.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Product } from '../types';
import { DIAMOND_MACRO_IMAGE, getCategoryAsset } from '../data/campbellAssetRegistry';

const CATEGORIES = [
  'Rings',
  'Chains',
  'Pendants',
  'Bracelets',
  'Stud Earrings',
  'Loose Diamonds'
];

const GENDERS = ['men', 'women', 'unisex'];

const METALS = [
  '14K Yellow Gold',
  '14K White Gold',
  '14K Rose Gold',
  '18K Yellow Gold',
  '18K White Gold',
  'Platinum',
  'Sterling Silver',
  'Black Titanium'
];

const SHAPES = ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Asscher', 'Marquise', 'Pear', 'Radiant', 'Heart'];

const RING_STYLES_WOMEN = ['Solitaire', 'Halo', 'Three Stone', 'Oval Solitaire', 'Emerald Halo', 'Pear Solitaire', 'Pavé Diamond', 'Cushion Halo', 'Infinity', 'Vintage Inspired', 'Diamond Eternity', 'Stackable Diamond'];
const RING_STYLES_MEN = ['Classic Gold Band', 'Brushed White Gold', 'Black Titanium', 'Onyx Signet', 'Diamond Channel', 'Black Diamond', 'Hammered Gold', 'Braided Band', 'Carbon Fiber'];
const PENDANT_STYLES_MEN = ['Diamond Cross', 'Lion Medallion', 'Onyx Dog Tag', 'Initial A', 'Praying Hands', 'Compass', 'Jesus Face', 'Crown', 'Angel', 'Black Onyx', 'Saint Christopher', 'Diamond Dollar Sign', 'Dagger', 'Eagle Head', 'Violin', 'Masonic'];
const PENDANT_STYLES_WOMEN = ['Solitaire Diamond', 'Halo Diamond', 'Heart Diamond', 'Initial A', 'Diamond Cross', 'Diamond Clover', 'Evil Eye', 'Starburst', 'Infinity', 'Emerald Cut', 'Pearl & Diamond', 'Diamond Butterfly', 'Hamsa Hand', 'Moon & Stars', 'Teardrop Halo'];
const CHAIN_STYLES_WOMEN = ['Cable', 'Paperclip', 'Rope', 'Snake', 'Station', 'Box', 'Bead', 'Herringbone', 'Satellite'];
const CHAIN_STYLES_MEN = ['Miami Cuban', 'Rope', 'Figaro', 'Franco', 'Box', 'Miami Cuban', 'Snake', 'Bead', 'Paperclip', 'Wheat', 'Byzantine'];
const BRACELET_STYLES_WOMEN = ['Tennis', 'Diamond Station', 'Bezel Station', 'Single Diamond', 'Heart Diamond', 'Bar Diamond', 'Infinity', 'Diamond Beaded', 'Diamond Bangle', 'Diamond Cuff', 'Moissanite Tennis'];
const BRACELET_STYLES_MEN = ['Miami Cuban', 'Diamond Tennis', 'Rope', 'Classic ID', 'Onyx Beaded', 'Black Onyx Beaded', 'Figaro'];
const EARRING_STYLES = ['Lab Diamond Studs', 'Natural Diamond Studs', 'Halo Studs', 'Solitaire Studs', 'Princess Cut Studs', 'Round Cut Studs', 'Men\'s Diamond Studs', 'Black Diamond Studs', 'Cushion Halo Studs'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProduct(id: number): Product {
  const gender = getRandomItem(GENDERS);
  const category = getRandomItem(CATEGORIES);
  const metal = getRandomItem(METALS);
  const shape = getRandomItem(SHAPES);
  
  let subcategory = '';
  let title = '';
  let imageUrl = '';
  
  if (category === 'Rings') {
    subcategory = gender === 'men' ? getRandomItem(RING_STYLES_MEN) : getRandomItem(RING_STYLES_WOMEN);
    title = `${subcategory}`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  } else if (category === 'Chains') {
    subcategory = gender === 'men' ? getRandomItem(CHAIN_STYLES_MEN) : getRandomItem(CHAIN_STYLES_WOMEN);
    title = `${subcategory} Chain`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  } else if (category === 'Pendants') {
    subcategory = gender === 'men' ? getRandomItem(PENDANT_STYLES_MEN) : getRandomItem(PENDANT_STYLES_WOMEN);
    title = `${subcategory} Pendant`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  } else if (category === 'Bracelets') {
    subcategory = gender === 'men' ? getRandomItem(BRACELET_STYLES_MEN) : getRandomItem(BRACELET_STYLES_WOMEN);
    title = `${subcategory} Bracelet`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  } else if (category === 'Stud Earrings') {
    subcategory = getRandomItem(EARRING_STYLES);
    title = `${subcategory}`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  } else if (category === 'Loose Diamonds') {
    subcategory = shape;
    title = `${shape} Cut Loose Diamond`;
    imageUrl = getCategoryAsset(gender as any, category as any);
  }

  const price = Math.floor(Math.random() * 15000) + 500;
  const sku = `CC-${gender.charAt(0).toUpperCase()}${category.charAt(0).toUpperCase()}-${id.toString().padStart(3, '0')}`;
  
  return {
    id: id.toString(),
    slug: `${title.toLowerCase().replace(/ /g, '-')}-${id}`,
    title,
    gender: gender as any,
    category: category as any,
    subcategory,
    collection: 'Signature',
    status: 'live',
    price,
    sku,
    inventory: Math.floor(Math.random() * 10) + 1,
    available: true,
    image: imageUrl,
    images: [imageUrl, DIAMOND_MACRO_IMAGE],
    metal: metal as any,
    stoneType: getRandomItem(['Natural', 'Lab', 'None']) as any,
    diamondCut: shape as any,
    carat: Number((Math.random() * 3 + 0.5).toFixed(2)),
    clarity: getRandomItem(['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1']) as any,
    color: getRandomItem(['D', 'E', 'F', 'G', 'H']) as any,
    certification: getRandomItem(['GIA', 'IGI', 'None']) as any,
    description: `A stunning ${title} from the Campbell & Co. collection. Hand-crafted for exceptional brilliance.`,
    productStory: 'Born from the depths of the earth or masterfully created in a lab, this stone represents the pinnacle of jewelry craftsmanship.',
    diamondPassport: {
      source: 'Globally Sourced',
      inspectedBy: 'Master Gemologist',
      verifiedDate: '2024-05-01',
      qualityNotes: 'Excellent polish and symmetry.'
    },
    symbolism: 'Elegance and Permanence',
    stylingNotes: 'Pairs perfectly with both formal and casual luxury wear.',
    matchingProducts: [],
    tags: [category.toLowerCase(), gender, subcategory.toLowerCase()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPremium: price > 5000
  };
}

export function generateCatalog(count: number = 300): Product[] {
  const catalog: Product[] = [];
  for (let i = 1; i <= count; i++) {
    catalog.push(generateProduct(i));
  }
  return catalog;
}
