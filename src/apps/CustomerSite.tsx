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
import MemberArea from '../components/MemberArea';
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

const PaymentOptionsPage = () => {
  const examplePrice = 4200;
  const deposit = Math.ceil(examplePrice * 0.2);
  const sixMonth = Math.ceil((examplePrice - deposit) / 6);
  const twelveMonth = Math.ceil((examplePrice * 0.88) / 12);

  const pathways = [
    {
      eyebrow: 'Pay In Full',
      title: 'Cards, Debit, and Wallet Checkout',
      body: 'Campbell & Co. can be prepared to accept major credit cards, debit cards, and wallet-based checkout for immediate authorization and secure capture.',
      bullets: ['Visa, Mastercard, Amex, and debit cards', 'Wallet-ready checkout such as Apple Pay and Google Pay', 'Fastest activation path for standard online payments'],
    },
    {
      eyebrow: 'Pay Over Time',
      title: 'Installments and Monthly Financing',
      body: 'For clients who want flexibility, the storefront can present monthly installment options at checkout and approval-based financing for higher-ticket pieces.',
      bullets: [`Estimated 12-month example: from $${twelveMonth.toLocaleString()} per month on a $${examplePrice.toLocaleString()} piece`, `Reserve-style plan example: $${deposit.toLocaleString()} down, then about $${sixMonth.toLocaleString()} per month for six months`, 'Clear disclosure language can live next to the product price and inside checkout'],
    },
    {
      eyebrow: 'Digital Assets',
      title: 'Bitcoin and Crypto Settlement',
      body: 'The storefront can also offer Bitcoin and selected digital asset settlement through a dedicated crypto payment partner for clients who prefer alternative payment rails.',
      bullets: ['Bitcoin-first presentation with room for additional approved assets', 'Manual or hosted payment link flow for private orders', 'Confirmation review before release or fulfillment'],
    },
  ];

  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-10 items-start">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">Payments</span>
            <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest leading-tight">Flexible Ways To Acquire</h1>
            <p className="text-white/50 text-sm uppercase tracking-[0.25em] leading-loose max-w-4xl">
              Campbell & Co. can present a premium payment experience that supports immediate card checkout, monthly installment options, reserve deposits, and Bitcoin-style settlement without making the customer guess how the process works.
            </p>
          </div>
          <div className="border border-gold/10 bg-gold/5 p-8 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Example Client View</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-white/10 px-4 py-4">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/40">Pay in full</span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-white">${examplePrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border border-white/10 px-4 py-4">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/40">12-month estimate</span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-gold">From ${twelveMonth.toLocaleString()} / month</span>
              </div>
              <div className="flex items-center justify-between border border-white/10 px-4 py-4">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/40">Reserve deposit</span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-gold">${deposit.toLocaleString()} down</span>
              </div>
              <div className="flex items-center justify-between border border-white/10 px-4 py-4">
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/40">Crypto settlement</span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-black text-white">Available by request</span>
              </div>
            </div>
            <Link to="/checkout" className="block w-full py-4 border border-gold text-gold text-center text-[10px] uppercase tracking-[0.4em] font-black hover:bg-gold hover:text-black-pure transition-all">
              Review Checkout Experience
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pathways.map((pathway) => (
            <article key={pathway.title} className="border border-white/10 bg-[#050505] p-8 space-y-6">
              <span className="text-[9px] uppercase tracking-[0.5em] text-gold font-black">{pathway.eyebrow}</span>
              <h2 className="text-2xl font-serif uppercase tracking-[0.15em]">{pathway.title}</h2>
              <p className="text-white/50 text-sm uppercase tracking-[0.2em] leading-loose">{pathway.body}</p>
              <div className="space-y-3">
                {pathway.bullets.map((bullet) => (
                  <div key={bullet} className="border border-white/10 px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/55">
                    {bullet}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="border border-gold/10 bg-[#050505] p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Recommended Rollout</p>
            <h2 className="text-3xl lg:text-4xl font-serif uppercase tracking-[0.15em]">Launch in layers, not all at once.</h2>
            <p className="text-white/50 text-sm uppercase tracking-[0.2em] leading-loose">
              The cleanest rollout is usually cards and debit first, monthly installments second, reserve deposit flows third, and Bitcoin or crypto settlement after the core checkout is proven.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'Phase 1: cards, debit, and wallet checkout',
              'Phase 2: installment messaging on product pages and in checkout',
              'Phase 3: private reserve deposit plans for higher-ticket orders',
              'Phase 4: Bitcoin and selected crypto by hosted payment link or direct settlement partner',
            ].map((item) => (
              <div key={item} className="border border-white/10 px-4 py-4 text-[9px] uppercase tracking-[0.2em] text-white/55">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LegalPage = ({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string }>;
}) => {
  return (
    <section className="pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-5xl mx-auto space-y-14">
        <div className="space-y-6 text-center">
          <span className="text-[10px] uppercase tracking-[0.7em] text-gold font-black">{eyebrow}</span>
          <h1 className="text-5xl lg:text-7xl font-serif uppercase tracking-widest">{title}</h1>
          <p className="text-white/50 text-sm uppercase tracking-[0.25em] leading-loose">{intro}</p>
        </div>
        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.title} className="border border-white/10 bg-[#050505] p-8 lg:p-10 space-y-4">
              <h2 className="text-xl lg:text-2xl font-serif uppercase tracking-[0.2em] text-gold">{section.title}</h2>
              <p className="text-white/55 text-sm uppercase tracking-[0.2em] leading-loose">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const PrivacyPage = () => (
  <LegalPage
    eyebrow="Privacy"
    title="Privacy Policy"
    intro="A plain-language overview of how Campbell & Co. handles browsing activity, inquiries, and customer information across the storefront and internal operating system."
    sections={[
      {
        title: 'Information We Collect',
        body: 'Campbell & Co. may collect information you provide directly, including contact details, consultation requests, purchase information, and communications submitted through the site.',
      },
      {
        title: 'How Information Is Used',
        body: 'Information is used to respond to inquiries, support orders, improve the customer experience, manage operations, and maintain the performance and security of the application.',
      },
      {
        title: 'Operational Services',
        body: 'Portions of the application may rely on third-party infrastructure such as hosting, analytics, authentication, storage, and payment-related services needed to operate the platform responsibly.',
      },
      {
        title: 'Customer Requests',
        body: 'Customers may request clarification, updates, or removal of submitted information by contacting Campbell & Co. through the available concierge or support pathways.',
      },
    ]}
  />
);

const TermsPage = () => (
  <LegalPage
    eyebrow="Terms"
    title="Terms of Service"
    intro="These terms describe the general expectations for using the Campbell & Co. storefront, content, and administrative services."
    sections={[
      {
        title: 'Use of the Site',
        body: 'Visitors may browse the storefront and request services for lawful personal or business purposes. Misuse, unauthorized access attempts, or interference with the platform is prohibited.',
      },
      {
        title: 'Product and Content Presentation',
        body: 'Campbell & Co. aims to present product details, imagery, availability, and guidance accurately, but offerings, pricing, and availability may change without notice.',
      },
      {
        title: 'Orders and Requests',
        body: 'Submitting a request or initiating checkout does not guarantee final acceptance. Orders, consultations, and operational actions may require confirmation, review, or follow-up communication.',
      },
      {
        title: 'Platform Governance',
        body: 'The application is maintained under LeeWay Standards for structured governance, technical continuity, and operational control. Administrative access is restricted to authorized users only.',
      },
    ]}
  />
);

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
            <Route path="/payments" element={<PaymentOptionsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/card" element={<BusinessCardPage />} />
            <Route path="/account" element={<MemberArea />} />
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
