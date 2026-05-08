/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.APPS.CUSTOMER_SITE.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = CustomerSite.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/apps/CustomerSite.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import RecommendationEngine from '../components/RecommendationEngine';
import DiamondGuide from '../components/DiamondGuide';
import PromoPanel from '../components/PromoPanel';
import VerificationSection from '../components/VerificationSection';
import TrustBar from '../components/TrustBar';
import Footer from '../components/Footer';
import CollectionSplit from '../components/CollectionSplit';
import CartSidebar from '../components/CartSidebar';
import Checkout from '../components/Checkout';
import AvoConcierge from '../components/AvoConcierge';
import ProductDetailPage from '../components/ProductDetailPage';
import { motion, AnimatePresence } from 'motion/react';
import { usePageAnalytics } from '../hooks/usePageAnalytics';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl, publicUrl } from '../lib/publicPath';

const AboutPage = () => {
  const { content } = useSiteContent();
  const page = content.pages.about;

  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">{page.eyebrow}</span>
          <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest leading-tight">{page.title}</h1>
          <p className="text-white/50 text-sm uppercase tracking-[0.25em] leading-loose">{page.body}</p>
          <Link to={page.cta.path} className="inline-flex px-10 py-5 bg-gold text-black-pure text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white transition-colors">
            {page.cta.label}
          </Link>
        </div>
        <div className="aspect-[4/5] border border-gold/20 overflow-hidden bg-[#050505]">
          <img src={publicAssetUrl(page.image)} alt="" className="w-full h-full object-cover grayscale opacity-70" />
        </div>
      </div>
    </section>
  );
};

const FAQPage = () => {
  const { content } = useSiteContent();
  const page = content.pages.faq;

  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="space-y-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">{page.eyebrow}</span>
          <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest">{page.title}</h1>
          <p className="text-white/50 text-sm uppercase tracking-[0.25em] leading-loose">{page.body}</p>
        </div>
        <div className="divide-y divide-white/10 border border-white/10 bg-[#050505]">
          {page.questions.map((item) => (
            <details key={item.question} className="group p-8">
              <summary className="cursor-pointer text-[11px] uppercase tracking-[0.3em] font-black text-gold">{item.question}</summary>
              <p className="pt-6 text-white/50 text-sm uppercase tracking-[0.2em] leading-loose">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactPage = () => {
  const { content } = useSiteContent();
  const page = content.pages.contact;

  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">{page.eyebrow}</span>
        <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest leading-tight">{page.title}</h1>
        <p className="text-white/50 text-sm uppercase tracking-[0.25em] leading-loose">{page.body}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <a href={page.primaryCta.path} className="px-10 py-5 bg-gold text-black-pure text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white transition-colors">{page.primaryCta.label}</a>
          <Link to={page.secondaryCta.path} className="px-10 py-5 border border-gold text-gold text-[10px] uppercase tracking-[0.4em] font-black hover:bg-gold hover:text-black-pure transition-colors">{page.secondaryCta.label}</Link>
        </div>
      </div>
    </section>
  );
};

const JournalPage = () => {
  const { content } = useSiteContent();
  const page = content.pages.journal;

  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">{page.eyebrow}</span>
          <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest">{page.title}</h1>
          <p className="max-w-3xl text-white/50 text-sm uppercase tracking-[0.25em] leading-loose">{page.body}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {page.posts.map((post) => (
            <Link key={post.title} to={post.path} className="border border-white/10 bg-[#050505] p-8 space-y-8 hover:border-gold/40 transition-colors">
              <h2 className="text-2xl font-serif uppercase tracking-widest">{post.title}</h2>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] leading-loose">{post.excerpt}</p>
              <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Read More</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
const BusinessCardPage = () => <div className="pt-40 px-20 text-white font-serif text-4xl text-center pb-20"><img src={publicAssetUrl('/assets/campbell/business-card/card-front.png')} className="max-w-md mx-auto border border-gold" alt="Business Card" /><p className="mt-10 uppercase tracking-[0.5em] text-gold text-[10px]">Digital Artifact</p></div>;
const AdminRedirect = () => {
  React.useEffect(() => {
    window.location.assign(publicUrl('/admin.html'));
  }, []);

  return <div className="pt-40 px-20 text-white font-serif text-4xl text-center">Opening Admin...</div>;
};

function Home() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Hero />
      <CollectionSplit />
      <RecommendationEngine type="trending" title="Global Acquisitions" subtitle="Current High Demand" />
      <PromoPanel />
      <RecommendationEngine type="recommended" title="Curated Selection" subtitle="Based on your profile" />
      <VerificationSection />
      <RecommendationEngine type="recently-viewed" title="Recently Browsed" subtitle="Pick up where you left off" />
      <TrustBar />
    </motion.div>
  );
}

export default function CustomerSite() {
  usePageAnalytics();

  return (
    <div className="bg-black-pure min-h-screen selection:bg-gold selection:text-black-pure">
      <Header />
      
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<div className="pt-32"><ProductGrid /></div>} />
            
            {/* Gender filtered routes */}
            <Route path="/women" element={<Navigate to="/women/rings" replace />} />
            <Route path="/men" element={<Navigate to="/men/rings" replace />} />
            <Route path="/:gender/:category" element={<div className="pt-32"><ProductGrid /></div>} />
            
            {/* Diamond routes */}
            <Route path="/diamonds" element={<div className="pt-32"><DiamondGuide /></div>} />
            <Route path="/diamonds/:type" element={<div className="pt-32"><DiamondGuide /></div>} />
            
            {/* Direct access to product */}
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            
            {/* Other routes */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/card" element={<BusinessCardPage />} />
            <Route path="/admin" element={<AdminRedirect />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <CartSidebar />
      <AvoConcierge />
    </div>
  );
}
