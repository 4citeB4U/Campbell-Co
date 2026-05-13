/*
LEEWAY HEADER — DO NOT REMOVE

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
  purpose: string;
  status: 'active' | 'idle' | 'working' | 'alert';
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
}
