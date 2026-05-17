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
TAG: CORE.CORE.SRC.TYPES.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = types.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/types.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
export type Category = 'Rings' | 'Chains' | 'Pendants' | 'Bracelets' | 'Stud Earrings' | 'Loose Diamonds';
export interface CategoryInfo {
  id: string;
  title: string;
  image: string;
}
export type Gender = 'men' | 'women' | 'unisex';
export type MetalType = '14K Yellow Gold' | '14K White Gold' | '14K Rose Gold' | '18K Yellow Gold' | '18K White Gold' | 'Platinum' | 'Sterling Silver' | 'Black Titanium' | 'Titanium' | '10K Yellow Gold' | '10K White Gold' | 'None';
export type DiamondType = 'Lab' | 'Natural' | 'Certified' | 'None';
export type DiamondCut = 'Round' | 'Princess' | 'Oval' | 'Cushion' | 'Emerald' | 'Pear' | 'Radiant' | 'Heart' | 'Marquise' | 'Asscher';
export type Certification = 'GIA' | 'IGI' | 'GCAL' | 'None';
export type Clarity = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2';
export type ColorGrade = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type CutGrade = 'Ideal' | 'Excellent' | 'Very Good' | 'Good';

export interface Product {
  id: string;
  slug: string;
  title: string;
  gender: Gender;
  category: Category;
  subcategory: string;
  collection: string;
  status: 'draft' | 'preview' | 'live' | 'unavailable' | 'archived';
  price: number;
  salePrice?: number;
  sku: string;
  inventory: number;
  available: boolean;
  image: string; // Featured image
  images: string[]; // Gallery images
  rotationFrames?: string[];
  metal: MetalType;
  stoneType: DiamondType;
  diamondCut: DiamondCut;
  carat: number;
  clarity: Clarity;
  color: ColorGrade;
  certification: Certification;
  description: string;
  productStory: string;
  diamondPassport: {
    source: string;
    inspectedBy: string;
    verifiedDate: string;
    qualityNotes: string;
  };
  symbolism: string;
  stylingNotes: string;
  matchingProducts: string[]; // IDs of related products
  tags: string[];
  createdAt: any;
  updatedAt: any;
  
  // Backwards compatibility or optional extras
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isPremium?: boolean;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  imageAlt?: string;
  leewayMetadata?: any;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'unpaid' | 'paid' | 'partially_refunded' | 'refunded';
  customerInfo: {
    id?: string;
    email: string;
    phone: string;
    name: string;
  };
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    sku: string;
    image: string;
  }[];
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    zip: string;
    trackingNumber?: string;
  };
  total: number;
  internalNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  signupDate: any;
  consentStatus: 'accepted' | 'rejected' | 'partial';
  originalReferrer?: string;
  utmSource?: string;
  purchaseHistory: string[]; // Order IDs
  rewardsBalance: number;
  lifetimeValue: number;
  customerTier: 'Member' | 'VIP' | 'Elite' | 'Private Client';
  adminNotes?: string;
  wishlist: string[]; // Product IDs
}

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  commissionPercentage: number;
  status: 'active' | 'inactive';
  payoutTracking: {
    totalEarned: number;
    pendingPayout: number;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  title?: string;
  department?: string;
  family: 'core' | 'forge' | 'memory' | 'guardian' | 'routing' | 'media' | 'pipeline' | 'security' | 'trust' | 'host' | 'ui' | 'api' | 'quality' | 'style' | 'visual';
  purpose: string;
  status: 'active' | 'idle' | 'working' | 'alert';
  authorityLevel?: string;
  sourceAgent?: string;
  lineage?: string;
  capabilities: string[];
  responsibilities?: string[];
  operatingMode?: 'advisory' | 'connected' | 'standby';
  tasks: {
    id: string;
    title: string;
    description: string;
    timestamp: any;
    status: 'pending' | 'completed' | 'denied';
  }[];
  recommendations: {
    id: string;
    text: string;
    actionLabel: string;
    actionType: string;
  }[];
}

export interface ProcurementData {
  goldPrice: number;
  diamondPriceIndex: number;
  lastUpdated: any;
  supplierCosts: Record<string, number>;
  materials?: Array<{
    id: string;
    label: string;
    category: 'diamond' | 'gem' | 'gold' | 'metal';
    specification: string;
    unitPrice: number;
    unitLabel: string;
    trend: string;
    trendUp: boolean;
    note: string;
  }>;
  alerts?: Array<{
    id: string;
    title: string;
    reason: string;
    impact: string;
  }>;
}

export type RuntimeAuthorityMode = 
  | 'PRODUCTION_AUTHORITY'
  | 'DEVELOPMENT_BOOTSTRAP'
  | 'STATIC_BOOTSTRAP_CONTENT'
  | 'CONFIGURATION_BLOCKED';

export interface RuntimeModeMetadata {
  id: 'runtime.authority.production' | 'runtime.authority.development-bootstrap' | 'runtime.authority.static-bootstrap-content' | 'runtime.authority.configuration-blocked';
  label: string;
  tag: string;
  ownerAgent: 'Lee Prime' | 'Nova' | 'Atlas' | 'Shield' | 'Aura';
  authority: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'None' | 'Very Low';
  allowedEnvironment: 'production' | 'development' | 'all' | 'none';
  publishPermission: boolean;
  persistenceSource: 'Firestore' | 'LocalStorage' | 'Memory' | 'None';
  tracePath: string[];
  auditCategory: string;
  missingConfigDetail?: string;
}
