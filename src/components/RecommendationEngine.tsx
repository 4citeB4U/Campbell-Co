/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF3131
FLUO=#FF5757
PASTEL=#FF9191

ICON_ASCII:
family=lucide
glyph=layout

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI
TAG: UI.SRC.COMPONENTS.RECOMMENDATION_ENGINE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = RecommendationEngine.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/RecommendationEngine.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface RecommendationEngineProps {
  type: 'trending' | 'recently-viewed' | 'recommended' | 'limited';
  limit?: number;
  title?: string;
  subtitle?: string;
}

export default function RecommendationEngine({ 
  type, 
  limit = 4, 
  title, 
  subtitle 
}: RecommendationEngineProps) {
  const { products: allProducts, loading } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (loading || allProducts.length === 0) return;

    let items: Product[] = [];
    if (type === 'trending') {
      items = allProducts.slice(0, limit);
    } else if (type === 'recently-viewed') {
      items = allProducts.slice(4, 4 + limit);
    } else if (type === 'recommended') {
      items = allProducts.slice(8, 8 + limit);
    } else {
      items = allProducts.slice(12, 12 + limit);
    }
    setProducts(items);
  }, [type, limit, allProducts, loading]);

  return (
    <section className="py-32 border-t border-gold/10">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-gold" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">
                {subtitle || (type === 'trending' ? 'Global Demand' : 'For You')}
              </span>
            </div>
            <h2 className="text-4xl font-serif tracking-[0.1em] uppercase">
              {title || (type === 'trending' ? 'Trending Now' : 'Recommended For You')}
            </h2>
          </div>
          <Link to="/shop" className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-white hover:text-gold transition-all group">
            View Collection 
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
