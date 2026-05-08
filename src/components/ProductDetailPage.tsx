/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.PRODUCT_DETAIL_PAGE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ProductDetailPage.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/ProductDetailPage.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  Award, 
  Info, 
  ShoppingBag,
  BadgeCheck,
  Zap,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { MASTER_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import ProductViewer from './ProductViewer';
import RecommendationEngine from './RecommendationEngine';
import { trackSiteEvent } from '../services/siteAnalytics';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(MASTER_PRODUCTS.find(p => p.slug === slug));
  const [activeImage, setActiveImage] = useState(product?.image);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const found = MASTER_PRODUCTS.find(p => p.slug === slug);
    if (found) {
      setProduct(found);
      setActiveImage(found.image);
      window.scrollTo(0, 0);
      void trackSiteEvent('product_view', {
        productId: found.id,
        slug: found.slug,
        category: found.category,
        title: found.title,
        price: found.price,
      });
    } else {
      navigate('/shop');
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (!product) return undefined;

    const startedAt = Date.now();
    return () => {
      void trackSiteEvent('product_dwell', {
        productId: product.id,
        slug: product.slug,
        durationMs: Date.now() - startedAt,
      });
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      ...product,
      quantity: 1,
    });
    void trackSiteEvent('add_to_cart', {
      productId: product.id,
      slug: product.slug,
      price: product.price,
      source: 'product_detail',
    });
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div className="bg-black-pure pt-24 pb-32">
      {/* Breadcrumbs */}
      <div className="max-w-[1700px] mx-auto px-12 py-8 flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-gray-border/60">
        <Link to="/" className="hover:text-gold transition-colors">House</Link>
        <ChevronRight size={10} />
        <Link to={`/${product.gender}/${product.category.toLowerCase().replace(/ /g, '-')}`} className="hover:text-gold transition-colors">{product.gender}</Link>
        <ChevronRight size={10} />
        <span className="text-white font-black">{product.title}</span>
      </div>

      <div className="max-w-[1700px] mx-auto px-12 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Product Imagery Stage */}
        <div className="lg:col-span-7 space-y-8">
           <div className="aspect-square bg-[#0a0a0a] border border-gold/10 relative overflow-hidden group">
              <ProductViewer image={activeImage || product.image} title={product.title} />
              
              {/* Premium Indicator Overlay */}
              {product.isPremium && (
                <div className="absolute top-10 left-10 z-20">
                   <div className="flex items-center gap-3 bg-gold/10 backdrop-blur-md border border-gold/20 px-4 py-2 text-gold">
                      <Zap size={12} className="fill-gold" />
                      <span className="text-[10px] uppercase font-black tracking-[0.3em]">Signature Archive Artifact</span>
                   </div>
                </div>
              )}
           </div>

           {/* Thumbnails */}
           <div className="grid grid-cols-4 gap-6">
              {[product.image, ...(product.images || [])].map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square border transition-all duration-500 overflow-hidden ${
                    activeImage === img ? 'border-gold p-2 bg-gold/5' : 'border-white/5 hover:border-gold/30'
                  }`}
                >
                   <img src={img} alt="" className="w-full h-full object-contain grayscale opacity-80 hover:opacity-100" />
                </button>
              ))}
           </div>
        </div>

        {/* Right: Product Details & Acquisition Panel */}
        <div className="lg:col-span-5 space-y-10">
           <div className="space-y-6">
              <div className="space-y-2">
                 <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">{product.collection} Discovery</span>
                 <h1 className="text-5xl lg:text-5xl font-serif text-white tracking-[0.1em] uppercase leading-[1.1]">{product.title}</h1>
              </div>
              
              <div className="flex items-center gap-8">
                 <span className="text-2xl font-serif text-white">${product.price.toLocaleString()}</span>
                 <div className="h-4 w-px bg-white/10" />
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-white/40 font-black">REF SKU: <span className="text-gold">{product.sku}</span></span>
                 </div>
              </div>
           </div>

           {/* COMPACT ACQUISITION BAR */}
           <div className="p-6 bg-[#0a0a0a] border border-gold/20 space-y-4">
              <div className="flex gap-4">
                 <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 py-4 bg-gold text-black-pure text-[9px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all transform active:scale-95 disabled:bg-gray-border"
                 >
                    {isAdding ? 'Artifact Allocated' : 'Acquire Piece'}
                 </button>
                 <button className="px-5 border border-white/10 hover:border-gold transition-colors text-white group">
                    <ShoppingBag size={16} className="group-hover:text-gold transition-colors" />
                 </button>
              </div>
              <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.2em] text-white/40 font-black px-1">
                 <span className="flex items-center gap-2"><ShieldCheck size={10} className="text-gold" /> Global Insurance</span>
                 <span className="flex items-center gap-2"><Truck size={10} className="text-gold" /> Express Delivery</span>
              </div>
           </div>

           {/* The Narrative — Story (Moved Higher) */}
           <div className="space-y-4 pb-8 border-b border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-gold">The Narrative</h3>
              <p className="text-[12px] font-light italic text-gray-text leading-relaxed">
                "{product.productStory}"
              </p>
              <div className="flex items-center gap-3">
                 <Info size={11} className="text-gold" />
                 <span className="text-[8px] uppercase tracking-[0.4em] text-white/60 font-black italic">SYMBOLISM: {product.symbolism}</span>
              </div>
           </div>

           {/* COMPACT PASSPORT MODULE */}
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white">Diamond Passport</h3>
                 <span className="text-[8px] text-green-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                    <CheckCircle2 size={10} /> Authenticated
                 </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[7px] uppercase tracking-widest text-white/30 font-black">Source</p>
                    <p className="text-[10px] uppercase tracking-widest text-white font-black">{product.diamondPassport.source}</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/5 space-y-1">
                    <p className="text-[7px] uppercase tracking-widest text-white/30 font-black">Inspected By</p>
                    <p className="text-[10px] uppercase tracking-widest text-white font-black">{product.diamondPassport.inspectedBy}</p>
                 </div>
              </div>
              <div className="p-4 border border-white/5 bg-gold/5 flex flex-col gap-2">
                 <p className="text-[7px] uppercase tracking-widest text-gold font-black italic mb-1">Quality Inspection Note</p>
                 <p className="text-[10px] text-gray-text leading-relaxed tracking-widest italic uppercase">
                   "{product.diamondPassport.qualityNotes}"
                 </p>
              </div>
           </div>

           {/* Specs Grid (Now more secondary) */}
           <div className="grid grid-cols-3 gap-px bg-white/5 border border-white/5">
              {[
                { label: 'Metal', value: product.metal },
                { label: 'Stone', value: product.stoneType },
                { label: 'Cut', value: product.diamondCut },
                { label: 'Clarity', value: product.clarity },
                { label: 'Color', value: product.color },
                { label: 'Carat', value: `${product.carat}ct` }
              ].map((spec, i) => (
                <div key={i} className="bg-black-pure p-3 flex flex-col gap-1">
                   <span className="text-[7px] uppercase tracking-[0.3em] text-white/30 font-black">{spec.label}</span>
                   <span className="text-[8px] uppercase tracking-widest text-white font-black truncate">{spec.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* SECTION: DIAMOND PASSPORT — THE AUTHENTICATION EXPERIENCE */}
      <section className="max-w-[1700px] mx-auto px-12 mt-40">
         <div className="bg-[#050505] border border-gold/20 p-12 lg:p-24 relative overflow-hidden">
            {/* Visual Flourish */}
            <div className="absolute top-0 right-0 w-[600px] h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <div className="h-px w-20 bg-gold" />
                        <span className="text-[11px] uppercase tracking-[0.6em] text-gold font-black underline underline-offset-8">OFFICIAL DOCUMENTATION</span>
                     </div>
                     <h2 className="text-6xl lg:text-7xl font-serif text-white tracking-[0.1em] uppercase leading-none">THE DIAMOND<br/>PASSPORT</h2>
                  </div>

                  <div className="space-y-10">
                     <div className="p-10 border border-white/5 bg-black-pure/50 backdrop-blur-xl relative group">
                        <BadgeCheck className="absolute top-8 right-8 text-gold/40 group-hover:text-gold transition-colors" size={40} />
                        <div className="space-y-8">
                           <div className="grid grid-cols-2 gap-10">
                              <div className="space-y-2">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">Stone Source</p>
                                 <p className="text-[12px] uppercase tracking-widest text-white font-black">{product.diamondPassport.source}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">Verification Authority</p>
                                 <p className="text-[12px] uppercase tracking-widest text-white font-black">{product.diamondPassport.inspectedBy}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">Verified Date</p>
                                 <p className="text-[12px] uppercase tracking-widest text-white font-black">{product.diamondPassport.verifiedDate}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">Quality Status</p>
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[12px] uppercase tracking-widest text-green-500 font-black">Professionally Verified</p>
                                 </div>
                              </div>
                           </div>
                           <div className="pt-6 border-t border-white/5">
                              <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black mb-3">Master Evaluation Notes</p>
                              <p className="text-[11px] text-gray-text leading-relaxed tracking-widest italic uppercase">
                                "{product.diamondPassport.qualityNotes}"
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-12">
                  <p className="text-xl lg:text-2xl font-serif text-white/80 leading-relaxed max-w-xl italic">
                     "Each Campbell & Co. artifact is accompanied by a unique digital passport. We don't just sell jewelry; we authenticate a legacy of ownership and cinematic craftsmanship."
                  </p>
                  
                  <div className="space-y-8">
                     <div className="flex gap-12">
                        <div className="flex flex-col gap-2">
                           <Award className="text-gold" size={24} />
                           <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Ethics Sync</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           <MapPin className="text-gold" size={24} />
                           <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Full Sourcing Trace</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           <RotateCcw className="text-gold" size={24} />
                           <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Lifetime Service</p>
                        </div>
                     </div>
                     <button className="group flex items-center gap-8 py-4 px-2 border-b-2 border-gold text-[10px] uppercase tracking-[0.4em] font-black hover:text-gold transition-all">
                        VIEW FULL INSPECTION REPORT
                        <ChevronRight size={14} className="group-hover:translate-x-2 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Styled By The House — Related / Matching */}
      <section className="mt-40 border-t border-white/5 pt-24 pb-32">
         <RecommendationEngine 
            type="recommended" 
            title="House Styling" 
            subtitle="Acquisitions that complete the aesthetic"
         />
      </section>
    </div>
  );
}
