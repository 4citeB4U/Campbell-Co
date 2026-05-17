/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.CORE.SRC.CONSTANTS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = constants.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/constants.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Product, CategoryInfo } from './types';
import { generateCatalog } from './lib/catalogGenerator';
import { CATEGORY_ASSETS } from './data/campbellAssetRegistry';

export const COLLECTIONS = [
  { id: 'noir', title: 'Noir Collection', description: 'Dark elegance for the modern minimalist.' },
  { id: 'signature', title: 'Signature', description: 'The timeless essence of Campbell & Co.' },
  { id: 'aurelia', title: 'Aurelia', description: 'Gilded masterpieces for grand moments.' }
];

export const MASTER_PRODUCTS: Product[] = generateCatalog(300);

export const CATEGORIES: CategoryInfo[] = [
  { id: 'women-rings', title: 'Women\'s Rings', image: CATEGORY_ASSETS['women-rings'] },
  { id: 'men-rings', title: 'Men\'s Rings', image: CATEGORY_ASSETS['men-rings'] },
  { id: 'women-chains', title: 'Women\'s Chains', image: CATEGORY_ASSETS['women-chains'] },
  { id: 'men-chains', title: 'Men\'s Chains', image: CATEGORY_ASSETS['men-chains'] },
  { id: 'women-pendants', title: 'Women\'s Pendants', image: CATEGORY_ASSETS['women-pendants'] },
  { id: 'men-pendants', title: 'Men\'s Pendants', image: CATEGORY_ASSETS['men-pendants'] },
  { id: 'women-bracelets', title: 'Women\'s Bracelets', image: CATEGORY_ASSETS['women-bracelets'] },
  { id: 'men-bracelets', title: 'Men\'s Bracelets', image: CATEGORY_ASSETS['men-bracelets'] },
  { id: 'stud-earrings', title: 'Stud Earrings', image: CATEGORY_ASSETS['stud-earrings'] },
  { id: 'loose-diamonds', title: 'Loose Diamonds', image: CATEGORY_ASSETS['loose-diamonds'] }
];
