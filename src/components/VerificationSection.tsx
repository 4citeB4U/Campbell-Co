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
TAG: UI.SRC.COMPONENTS.VERIFICATION_SECTION.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = VerificationSection.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/VerificationSection.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl } from '../lib/publicPath';
import { useLeeWayID } from '../hooks/useLeeWayID';

export default function VerificationSection() {
  useLeeWayID({
    id: 'public.home.verification',
    label: 'Verification & Transparency',
    tag: 'UI.PUBLIC.HOME.VERIFICATION',
    region: 'PUBLIC',
    ownerAgent: 'Aura',
    authority: 'AdminOS',
    tracePath: ['AdminOS', 'SiteContent', 'Published', 'CustomerSite', 'VerificationSection'],
    auditCategory: 'content.publish',
    status: 'active',
    hardCoded: false,
  });

  const { content } = useSiteContent();
  const verification = content.verification;

  return (
    <section 
      className="py-32 bg-black-pure overflow-hidden"
      data-leeway-id="public.home.verification"
      data-leeway-tag="UI.PUBLIC.HOME.VERIFICATION"
      data-owner-agent="Aura"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-medium block mb-4">
            {verification.eyebrow}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">{verification.title}</h2>
          <p className="text-gray-text text-lg font-light max-w-2xl mx-auto leading-relaxed">
            {verification.body}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Natural */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 border border-gold/20 bg-black-soft rounded-2xl relative group"
          >
            <div className="absolute top-4 right-4 text-gold/30 group-hover:text-gold transition-colors">
              <Info size={20} />
            </div>
            <h3 className="text-2xl font-serif mb-6 text-white">{verification.naturalTitle}</h3>
            <ul className="space-y-4 mb-10">
              {verification.naturalBullets.map(item => (
                <li key={item} className="flex gap-3 text-sm text-gray-text">
                  <Check size={16} className="text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to={verification.naturalCta.path} className="w-full bg-gold text-black-pure py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-white transition-colors text-center block">
              {verification.naturalCta.label}
            </Link>
          </motion.div>

          {/* Center Visual */}
          <div className="relative flex justify-center order-first lg:order-none">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="relative w-72 h-72 md:w-96 md:h-96"
            >
              <img 
                src={publicAssetUrl('/assets/campbell/diamonds/hero-cut.png')} 
                alt="Main Diamond" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(214,180,106,0.2)]"
              />
            </motion.div>
            {/* Pulsing rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border border-gold/10 rounded-full animate-ping opacity-20" />
            </div>
          </div>

          {/* Lab Grown */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 border border-white/10 bg-black-soft rounded-2xl relative group"
          >
            <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/30 transition-colors">
              <Info size={20} />
            </div>
            <h3 className="text-2xl font-serif mb-6 text-white">{verification.labTitle}</h3>
            <ul className="space-y-4 mb-10">
              {verification.labBullets.map(item => (
                <li key={item} className="flex gap-3 text-sm text-gray-text">
                  <Check size={16} className="text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to={verification.labCta.path} className="w-full border border-white/20 text-white py-4 text-[11px] uppercase tracking-widest font-bold hover:bg-white hover:text-black-pure transition-all text-center block">
              {verification.labCta.label}
            </Link>
          </motion.div>
        </div>

        {/* Pricing Transparency */}
        <div className="mt-32 p-12 border border-gray-border/50 rounded-3xl bg-gradient-to-br from-black-soft to-black-pure text-center">
          <h3 className="text-2xl font-serif mb-4">{verification.advantageTitle}</h3>
          <p className="text-gray-text max-w-2xl mx-auto text-sm leading-relaxed mb-8">
            {verification.advantageBody}
          </p>
          <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-gray-border/30">
            {verification.proofPoints.map((point) => (
              <div key={point.label} className="text-center">
                <div className="text-gold text-lg mb-1">{point.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-text">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
