/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.PRODUCT_CARD.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ProductCard.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/ProductCard.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { trackSiteEvent } from '../services/siteAnalytics';
import { publicAssetUrl } from '../lib/publicPath';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const getBadge = () => {
    if (product.price > 10000) return { label: 'PREMIUM RESERVE', icon: Sparkles };
    if (product.tags?.includes('bestseller')) return { label: 'BEST SELLER', icon: Sparkles };
    return { label: 'SIGNATURE PIECE', icon: ShieldCheck };
  };

  const badgeInfo = getBadge();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#050505] border border-gold/10 hover:border-gold transition-all duration-700 flex flex-col h-full rounded-sm overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.15)]"
    >
      <Link
        to={`/product/${product.slug}`}
        onClick={() => {
          void trackSiteEvent('product_card_click', {
            productId: product.id,
            slug: product.slug,
            category: product.category,
            title: product.title,
          });
        }}
        className="block relative aspect-square overflow-hidden bg-black-pure p-4 lg:p-6 border-b border-gold/10"
      >
        <img 
          src={publicAssetUrl(product.image)} 
          alt={product.title} 
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out opacity-70 group-hover:opacity-100"
        />
        
        {/* Artifact Badge */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 pointer-events-none">
          <div className="bg-black-pure/90 border border-gold/20 px-4 py-2 flex items-center gap-3 backdrop-blur-xl">
            {badgeInfo.icon && <badgeInfo.icon size={11} className="text-gold" />}
            <span className="text-[9px] tracking-[0.4em] font-black uppercase text-gold">{badgeInfo.label}</span>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-20">
          <button 
            className="p-3 bg-black-pure border border-gold/30 text-gold hover:bg-gold hover:text-black-pure transition-all rounded-sm shadow-2xl"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <Heart size={16} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart({
                ...product,
                quantity: 1,
              });
              void trackSiteEvent('add_to_cart', {
                productId: product.id,
                slug: product.slug,
                price: product.price,
                source: 'card_quick_action',
              });
            }}
            className="p-3 bg-gold text-black-pure hover:scale-110 transition-all rounded-sm shadow-2xl"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Quick-Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <span className="text-[7px] uppercase tracking-[0.4em] font-black text-white/40">REF: {product.sku}</span>
           <span className="text-[7px] uppercase tracking-[0.4em] font-black text-gold">Ready for Sourcing</span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-8 flex flex-col flex-1 space-y-6">
        <div className="space-y-2">
          <p className="text-[10px] text-gold uppercase tracking-[0.4em] font-black opacity-80">{product.category}</p>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-serif tracking-[0.1em] uppercase text-white leading-tight min-h-[40px] line-clamp-2 hover:text-gold transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex flex-col gap-4 border-t border-gold/10 pt-6">
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-serif tracking-widest text-white">${product.price.toLocaleString()}</span>
            <span className="text-[8px] uppercase tracking-widest text-gray-border italic">Concierge Sourced</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/5 border border-white/5 flex flex-col gap-1">
               <span className="text-[6px] text-gray-border uppercase tracking-[0.3em]">Material</span>
               <span className="text-[9px] text-white font-black uppercase truncate">{product.metal}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/5 flex flex-col gap-1">
               <span className="text-[6px] text-gray-border uppercase tracking-[0.3em]">Status</span>
               <span className="text-[9px] text-gold font-black uppercase">In Vault</span>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              ...product,
              quantity: 1,
            });
            void trackSiteEvent('add_to_cart', {
              productId: product.id,
              slug: product.slug,
              price: product.price,
              source: 'card_primary_action',
            });
          }}
          className="w-full py-5 bg-black-pure border border-gold text-gold text-[10px] uppercase font-black tracking-[0.4em] hover:bg-gold hover:text-black-pure transition-all duration-500 mt-auto"
        >
          Acquire Piece
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
