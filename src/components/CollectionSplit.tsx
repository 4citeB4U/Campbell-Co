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
TAG: UI.SRC.COMPONENTS.COLLECTION_SPLIT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = CollectionSplit.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/CollectionSplit.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl } from '../lib/publicPath';
import { useLeeWayID } from '../hooks/useLeeWayID';

export default function CollectionSplit() {
  useLeeWayID({
    id: 'public.home.collections',
    label: 'Homepage Collections',
    tag: 'UI.PUBLIC.HOME.COLLECTIONS',
    region: 'PUBLIC',
    ownerAgent: 'Aura',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'SiteContent', 'Published', 'CustomerSite', 'Collections'],
    auditCategory: 'content.publish',
    status: 'active',
    hardCoded: false,
  });

  const { content } = useSiteContent();
  const { women, men } = content.home.collections;

  return (
    <section 
      className="bg-black-pure border-y border-gold/10"
      data-leeway-id="public.home.collections"
      data-leeway-tag="UI.PUBLIC.HOME.COLLECTIONS"
      data-owner-agent="Aura"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-[800px]">
        {/* WOMEN'S COLLECTION */}
        <div className="relative group overflow-hidden border-r border-gold/20">
          <img 
            src={publicAssetUrl(women.image)} 
            alt={women.imageAlt} 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-60 grayscale group-hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/20 to-transparent opacity-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-black">{women.eyebrow}</span>
                <h2 className="text-5xl lg:text-7xl font-serif text-white tracking-[0.1em] uppercase">{women.title}</h2>
              </div>
              <p className="text-gray-text max-w-sm mx-auto text-[11px] uppercase tracking-[0.25em] leading-relaxed opacity-80">
                {women.body}
              </p>
              <div className="pt-6">
                <Link 
                  to={women.cta.path}
                  className="group flex items-center gap-6 border border-gold px-14 py-6 text-[10px] text-gold uppercase tracking-[0.4em] font-black hover:bg-gold hover:text-black-pure transition-all inline-flex"
                >
                  {women.cta.label}
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* MEN'S COLLECTION */}
        <div className="relative group overflow-hidden">
          <img 
            src={publicAssetUrl(men.image)} 
            alt={men.imageAlt} 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-60 grayscale group-hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black-pure via-black-pure/20 to-transparent opacity-80" />
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-black">{men.eyebrow}</span>
                <h2 className="text-5xl lg:text-7xl font-serif text-white tracking-[0.1em] uppercase">{men.title}</h2>
              </div>
              <p className="text-gray-text max-w-sm mx-auto text-[11px] uppercase tracking-[0.25em] leading-relaxed opacity-80">
                {men.body}
              </p>
              <div className="pt-6">
                <Link 
                  to={men.cta.path}
                  className="group flex items-center gap-6 border border-gold px-14 py-6 text-[10px] text-gold uppercase tracking-[0.4em] font-black hover:bg-gold hover:text-black-pure transition-all inline-flex"
                >
                  {men.cta.label}
                  <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
