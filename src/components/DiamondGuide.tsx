/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.DIAMOND_GUIDE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = DiamondGuide.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/DiamondGuide.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Diamond, Sparkles, Filter, Search } from 'lucide-react';
import { publicAssetUrl } from '../lib/publicPath';

const SHAPES = [
  { name: 'ROUND', desc: 'Most popular', icon: '/assets/campbell/diamonds/round.png' },
  { name: 'PRINCESS', desc: 'Modern & brilliant', icon: '/assets/campbell/diamonds/princess.png' },
  { name: 'OVAL', desc: 'Elegant & elongating', icon: '/assets/campbell/diamonds/oval.png' },
  { name: 'CUSHION', desc: 'Classic & soft', icon: '/assets/campbell/diamonds/cushion.png' },
  { name: 'EMERALD', desc: 'Step cut elegance', icon: '/assets/campbell/diamonds/emerald.png' },
  { name: 'ASSCHER', desc: 'Vintage brilliance', icon: '/assets/campbell/diamonds/round.png' },
  { name: 'MARQUISE', desc: 'Unique & bold', icon: '/assets/campbell/diamonds/princess.png' },
  { name: 'PEAR', desc: 'Teardrop beauty', icon: '/assets/campbell/diamonds/oval.png' },
  { name: 'RADIANT', desc: 'Extra sparkle', icon: '/assets/campbell/diamonds/cushion.png' },
  { name: 'HEART', desc: 'Romantic shape', icon: '/assets/campbell/diamonds/round.png' },
];

const QUALITY_GUIDE = [
  { label: 'CUT', sub: 'EXCELLENT', icon: '/assets/campbell/jewelry/diamond-macro.png', desc: 'Ideal proportions for maximum brilliance and fire.' },
  { label: 'COLOR', sub: 'D - F', icon: '/assets/campbell/diamonds/color.png', desc: 'Colorless. The highest grade for exceptional purity.' },
  { label: 'CLARITY', sub: 'VS1+', icon: '/assets/campbell/jewelry/loose-diamonds.png', desc: 'Very Slightly Included. Premium clarity grade.' },
  { label: 'CARAT', sub: '1.00 CT+', icon: '/assets/campbell/diamonds/carat.png', desc: 'Weight refers to the size of the diamond.' },
];

const STONE_TYPES = [
  { name: 'LAB GROWN DIAMONDS', desc: 'Ethical. Sustainable. Identical brilliance.', shop: 'SHOP LAB DIAMONDS', icon: '/assets/campbell/diamonds/emerald.png' },
  { name: 'NATURAL DIAMONDS', desc: 'Timeless. Rare. Formed by nature.', shop: 'SHOP NATURAL DIAMONDS', icon: '/assets/campbell/diamonds/round.png' },
  { name: 'VERIFIED DIAMONDS', desc: 'IGI / GIA / GCAL Certified. Maximum confidence.', shop: 'SHOP VERIFIED', icon: '/assets/campbell/jewelry/loose-diamonds.png' },
  { name: 'UNVERIFIED DIAMONDS', desc: 'Beautiful quality. Better pricing.', shop: 'SHOP UNVERIFIED', icon: '/assets/campbell/diamonds/carat.png' },
  { name: 'LOOSE DIAMONDS', desc: 'Hand-selected stones. Perfect for custom pieces.', shop: 'SHOP LOOSE DIAMONDS', icon: '/assets/campbell/jewelry/diamond-macro.png' },
];

export default function DiamondGuide() {
  const [activeTab, setActiveTab] = React.useState('DIAMONDS');

  return (
    <div className="bg-black-pure text-white min-h-screen font-sans">
      {/* HEADER SECTION */}
      <header className="pt-24 pb-8 px-6 lg:px-12">
        <div className="max-w-[1700px] mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif tracking-[0.05em] uppercase text-white">DIAMOND & GEMSTONE GUIDE</h1>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold font-bold">EXPLORE OUR PREMIUM STONES</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-4">
            <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed max-w-xl">
              Hand-selected for brilliance, fire, and exceptional quality. Every stone in our collection meets the most rigorous standards of the Campbell & Co. vault.
            </p>
            
            <nav className="flex gap-10">
              {['DIAMONDS', 'COLORED GEMSTONES', 'PRECIOUS GEMSTONES', 'LAB DIAMONDS'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-black transition-all relative ${activeTab === tab ? 'text-gold' : 'text-white/40 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-80 p-6 lg:p-12 space-y-10 border-r border-white/5 bg-[#050505]">
          <div className="space-y-10">
            {/* Filter Group: Diamond Type */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold opacity-80">DIAMOND TYPE</h3>
                <ChevronDown size={14} className="text-white/40" />
              </div>
              <div className="space-y-4">
                {['Lab Grown Diamonds', 'Natural Diamonds', 'Verified Diamonds', 'Unverified Diamonds'].map((type) => (
                  <label key={type} className="flex items-center gap-4 text-[10px] uppercase tracking-widest cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 rounded-sm flex-shrink-0 group-hover:border-gold transition-colors" />
                    <span className="text-white/50 group-hover:text-white transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Diamond Shape */}
            <div className="space-y-6 border-t border-white/5 pt-10">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold opacity-80">DIAMOND SHAPE</h3>
                <ChevronDown size={14} className="text-white/40" />
              </div>
              <div className="space-y-4">
                {SHAPES.slice(0, 10).map((shape) => (
                  <label key={shape.name} className="flex items-center gap-4 text-[10px] uppercase tracking-widest cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 rounded-sm flex-shrink-0 group-hover:border-gold transition-colors" />
                    <span className="text-white/50 group-hover:text-white transition-colors">{shape.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Carat Weight */}
            <div className="space-y-6 border-t border-white/5 pt-10">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold opacity-80">CARAT WEIGHT</h3>
              <div className="space-y-4">
                {['0.25 - 0.49 CT', '0.50 - 0.99 CT', '1.00 - 1.99 CT', '2.00 - 2.99 CT', '3.00 - 3.99 CT', '4.00+ CT'].map((weight) => (
                  <label key={weight} className="flex items-center gap-4 text-[10px] uppercase tracking-widest cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 rounded-full flex-shrink-0 group-hover:border-gold transition-colors" />
                    <span className="text-white/50 group-hover:text-white transition-colors">{weight}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Price Range */}
            <div className="space-y-6 border-t border-white/5 pt-10">
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-white font-bold opacity-80">PRICE RANGE</h3>
              <div className="space-y-6 pb-4">
                  <div className="relative h-px bg-white/10 w-full">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-black rounded-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-black rounded-full" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-white/50">
                    <span>$500</span>
                    <span>$50,000+</span>
                  </div>
              </div>
            </div>

            <button className="w-full py-5 bg-gold/5 border border-gold/20 hover:border-gold text-gold text-[10px] font-black uppercase tracking-[0.4em] transition-all">
              APPLY FILTERS
            </button>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 p-6 lg:p-12 space-y-20">
          
          {/* SECTION: DIAMOND SHAPES */}
          <section className="space-y-10">
            <h2 className="text-[12px] uppercase tracking-[0.6em] text-gold font-black text-center">DIAMOND SHAPES</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {SHAPES.map((shape) => (
                <div key={shape.name} className="bg-[#0a0a0a] border border-white/5 p-8 flex flex-col items-center group cursor-pointer hover:border-gold transition-all">
                  <div className="w-24 h-24 mb-6 overflow-hidden">
                    <img 
                      src={publicAssetUrl(shape.icon)} 
                      alt={shape.name} 
                      className="w-full h-full object-cover filter grayscale brightness-125 transition-transform group-hover:scale-110" 
                    />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2">{shape.name}</span>
                  <span className="text-[9px] text-white/30 uppercase tracking-[0.1em] font-medium">{shape.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: QUALITY GUIDE */}
          <section className="bg-[#050505] p-12 border border-white/10 space-y-12">
            <h2 className="text-[12px] uppercase tracking-[0.6em] text-gold font-black text-center">DIAMOND QUALITY GUIDE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {QUALITY_GUIDE.map((item) => (
                <div key={item.label} className="space-y-6 text-center group">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">{item.label}</span>
                    <div className="text-xl font-serif tracking-widest uppercase text-white">{item.sub}</div>
                  </div>
                  <div className="aspect-square relative overflow-hidden border border-white/5 group-hover:border-gold/30 transition-all">
                    <img src={publicAssetUrl(item.icon)} alt={item.label} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-[9px] text-white/40 leading-relaxed tracking-widest uppercase px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: STONE TYPES */}
          <section className="space-y-10">
            <h2 className="text-[12px] uppercase tracking-[0.6em] text-gold font-black text-center uppercase">AVAILABLE STONE TYPES</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {STONE_TYPES.map((stone) => (
                <div key={stone.name} className="bg-[#0a0a0a] border border-white/5 p-8 flex flex-col space-y-8 group hover:border-gold transition-all">
                  <div className="aspect-video overflow-hidden border border-white/10">
                    <img src={publicAssetUrl(stone.icon)} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">{stone.name}</h3>
                    <p className="text-[10px] text-white/40 leading-relaxed tracking-widest uppercase">{stone.desc}</p>
                  </div>
                  <Link to="/shop" className="text-[10px] uppercase tracking-[0.4em] text-gold font-black pt-4 hover:pl-2 transition-all block">
                    {stone.shop}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* CUSTOM STONE CTA */}
          <section className="bg-black-pure p-12 border border-white/10 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/5 blur-[80px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif tracking-[0.1em] uppercase">LOOKING FOR A CUSTOM STONE?</h2>
                <p className="text-[11px] text-white/40 tracking-[0.3em] font-medium uppercase font-bold">Our specialists can source the perfect stone for you.</p>
              </div>
              <button className="px-16 py-6 border border-white/20 hover:border-gold text-white hover:text-gold text-[10px] font-black uppercase tracking-[0.5em] transition-all whitespace-nowrap">
                REQUEST A STONE
              </button>
            </div>
          </section>

        </main>
      </div>

      {/* FOOTER BADGES */}
      <footer className="border-t border-white/5 py-16 mt-20">
        <div className="max-w-[1700px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 px-6">
          {[
            { icon: <ShieldCheck size={24} />, label: 'AUTHENTICITY GUARANTEED', sub: 'Every diamond is tested & verified.' },
            { icon: <Award size={24} />, label: 'LIFETIME WARRANTY', sub: 'We stand behind every stone.' },
            { icon: <ShieldCheck size={24} />, label: 'INSURED SHIPPING', sub: 'Fully insured & secure delivery.' },
            { icon: <Sparkles size={24} />, label: 'EASY RETURNS', sub: 'Hassle-free 30-day returns.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="text-gold mt-1 opacity-60 group-hover:opacity-100 transition-opacity">{item.icon}</div>
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-[0.3em]">{item.label}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

function ChevronDown({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
