/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.HERO.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Hero.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/Hero.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl } from '../lib/publicPath';

export default function Hero() {
  const { content } = useSiteContent();
  const hero = content.home.hero;
  const usesVideo = hero.mediaType === 'video' && Boolean(hero.videoUrl);

  return (
    <section className="relative h-screen min-h-[800px] flex overflow-hidden border-b border-gray-border">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24 bg-black-pure z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gold uppercase tracking-[0.4em] text-[11px] font-black block mb-6">
            {hero.eyebrow}
          </span>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.05] tracking-tight mb-8">
            {hero.titleLineOne}<br />
            <span className="italic font-light opacity-90">{hero.titleLineTwo}</span>
          </h1>
          <p className="text-gray-text text-[11px] md:text-[12px] font-light mb-12 leading-loose tracking-[0.2em] uppercase max-w-md">
            {hero.body}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to={hero.primaryCta.path}
              className="bg-gold hover:bg-white text-black-pure px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 text-center"
            >
              {hero.primaryCta.label}
            </Link>
            <Link 
              to={hero.secondaryCta.path}
              className="border border-gold text-gold hover:bg-gold hover:text-black-pure px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 text-center"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Content - Abstract Imagery */}
      <div className="hidden lg:flex w-1/2 relative bg-black-soft flex items-center justify-center border-l border-gray-border overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold rounded-full filter blur-[120px] opacity-10"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-10 group"
        >
          <div className="w-[450px] h-[450px] border border-gray-border rounded-full flex items-center justify-center p-12 bg-black-pure/40 backdrop-blur-xl">
            <div className="w-full h-full border border-gold/20 rounded-full flex items-center justify-center relative overflow-hidden">
               {usesVideo ? (
                 <video
                   src={publicAssetUrl(hero.videoUrl || '')}
                   className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[5s] group-hover:scale-110"
                   autoPlay
                   muted
                   loop
                   playsInline
                 />
               ) : (
                 <img 
                   src={publicAssetUrl(hero.image)}
                   alt={hero.imageAlt}
                   className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[5s] group-hover:scale-110"
                 />
               )}
               <div className="relative z-10 text-center">
                 <div className="text-4xl font-serif italic text-white mb-2 underline underline-offset-8 decoration-gold/50">{hero.featureTitle}</div>
                 <div className="text-[10px] uppercase tracking-widest text-gold font-semibold">{hero.featureSubtitle}</div>
               </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-16 right-16 text-right">
          <div className="text-[10px] text-gray-text uppercase tracking-[0.3em] font-semibold mb-2">{hero.priceEyebrow}</div>
          <div className="text-3xl font-serif text-white">{hero.priceText}</div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-[9px] uppercase tracking-[0.5em] font-black text-gold">{hero.scrollText}</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
      </motion.div>
    </section>
  );
}
