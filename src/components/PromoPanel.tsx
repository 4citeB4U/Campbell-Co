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
TAG: UI.SRC.COMPONENTS.PROMO_PANEL.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = PromoPanel.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/PromoPanel.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Truck, RotateCcw, Calendar } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl } from '../lib/publicPath';
import { useLeeWayID } from '../hooks/useLeeWayID';

export default function PromoPanel() {
  useLeeWayID({
    id: 'public.home.promo',
    label: 'Homepage Promotions',
    tag: 'UI.PUBLIC.HOME.PROMO',
    region: 'PUBLIC',
    ownerAgent: 'Aura',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'SiteContent', 'Published', 'CustomerSite', 'PromoPanel'],
    auditCategory: 'content.publish',
    status: 'active',
    hardCoded: false,
  });

  const { content } = useSiteContent();
  const promo = content.home.promo;
  const usesVideo = promo.feature.mediaType === 'video' && Boolean(promo.feature.videoUrl);

  return (
    <div 
      className="space-y-10 sticky top-32"
      data-leeway-id="public.home.promo"
      data-leeway-tag="UI.PUBLIC.HOME.PROMO"
      data-owner-agent="Aura"
    >
      {/* Hero Promo */}
      <div className="border border-gold bg-[#050505] overflow-hidden group relative">
        <div className="relative aspect-[4/5] overflow-hidden">
          {usesVideo ? (
            <video
              src={publicAssetUrl(promo.feature.videoUrl || '')}
              className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-[3s]"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img 
              src={publicAssetUrl(promo.feature.image)} 
              alt={promo.feature.imageAlt} 
              className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-[3s]"
            />
          )}
          <div className="absolute inset-0 p-8 flex flex-col justify-center items-start text-left bg-black-pure/40">
            <h3 className="text-3xl font-serif tracking-[0.15em] text-white leading-tight uppercase mb-4">
              {promo.feature.title}
            </h3>
            <p className="text-[10px] text-gray-text tracking-[0.2em] font-medium uppercase mb-8 opacity-90 max-w-[200px] leading-loose">
              {promo.feature.body}
            </p>
            <Link to={promo.feature.cta.path} className="px-6 py-4 bg-gold text-black-pure text-[10px] uppercase font-black tracking-[0.4em] hover:scale-105 transition-all inline-block">
              {promo.feature.cta.label}
            </Link>
          </div>
        </div>
        
        {/* Trust Mini List */}
        <div className="grid grid-cols-2 border-t border-gold">
          <div className="flex flex-col items-center p-4 border-r border-gold hover:bg-gold/5 transition-colors">
            <ShieldCheck size={14} className="text-gold mb-2" />
            <span className="text-[7px] uppercase tracking-[0.3em] font-black text-gray-border text-center">Authenticity Guaranteed</span>
          </div>
          <div className="flex flex-col items-center p-4 hover:bg-gold/5 transition-colors">
            <Award size={14} className="text-gold mb-2" />
            <span className="text-[7px] uppercase tracking-[0.3em] font-black text-gray-border text-center">Lifetime Warranty</span>
          </div>
          <div className="flex flex-col items-center p-4 border-t border-r border-gold hover:bg-gold/5 transition-colors">
            <Truck size={14} className="text-gold mb-2" />
            <span className="text-[7px] uppercase tracking-[0.3em] font-black text-gray-border text-center">Insured Shipping</span>
          </div>
          <div className="flex flex-col items-center p-4 border-t border-gold hover:bg-gold/5 transition-colors">
            <RotateCcw size={14} className="text-gold mb-2" />
            <span className="text-[7px] uppercase tracking-[0.3em] font-black text-gray-border text-center">30-Day Returns</span>
          </div>
        </div>
      </div>

      {/* Popular Styles Mini Grid */}
      <div className="border border-gold bg-[#050505] p-6 space-y-6">
        <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-white text-center pb-4 border-b border-gold/20">
          {promo.popularStylesTitle}
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {promo.popularStyles.map((item, i) => (
            <Link key={i} to={item.path} className="group cursor-pointer flex items-center gap-4 p-2 border border-gold/20 hover:border-gold transition-all bg-black-pure">
              <div className="w-16 h-16 overflow-hidden flex-shrink-0 border border-gold/10">
                <img src={publicAssetUrl(item.image)} className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 transition-transform" alt="" />
              </div>
              <div className="flex-1">
                <span className="text-[8px] uppercase tracking-[0.4em] font-black text-white block mb-1">{item.label}</span>
                <span className="text-[7px] uppercase tracking-[0.2em] text-gold">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="border border-gold bg-[#050505] overflow-hidden group">
        <div className="p-8 space-y-6 flex flex-col items-center text-center">
           <Calendar size={20} className="text-gold mb-2" />
          <h4 className="text-lg font-serif tracking-[0.15em] text-white uppercase">{promo.appointment.title}</h4>
          <p className="text-[9px] text-gray-text tracking-[0.3em] uppercase leading-loose font-light opacity-80">
            {promo.appointment.body}
          </p>
          <Link to={promo.appointment.cta.path} className="w-full py-4 border border-gold text-gold text-[9px] uppercase font-black tracking-[0.4em] hover:bg-gold hover:text-black-pure transition-all inline-block">
            {promo.appointment.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
