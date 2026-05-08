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

export type CategoryInfo = {
  id: string;
  title: string;
  image: string;
}
