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
TAG: CORE.SRC.CONTEXT.PRODUCT_EXPERIENCE_CONTEXT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ProductExperienceContext.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/context/ProductExperienceContext.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { createContext, useContext, ReactNode } from 'react';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

interface ProductExperienceContextType {
  products: Product[];
}

const ProductExperienceContext = createContext<ProductExperienceContextType | undefined>(undefined);

export function ProductExperienceProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  return (
    <ProductExperienceContext.Provider value={{ 
      products, 
    }}>
      {children}
    </ProductExperienceContext.Provider>
  );
}

export function useProductExperience() {
  const context = useContext(ProductExperienceContext);
  if (context === undefined) {
    throw new Error('useProductExperience must be used within a ProductExperienceProvider');
  }
  return context;
}
