/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.FOOTER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Footer.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/Footer.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Send, Truck, Award, ShieldCheck, CreditCard, RotateCcw } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicUrl } from '../lib/publicPath';

export default function Footer() {
  const { content } = useSiteContent();
  const badgeIcons = [Truck, Award, ShieldCheck, CreditCard, RotateCcw];

  return (
    <footer className="bg-black-pure pt-24 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-16 border-b border-white/5 mb-16">
          {content.footer.badges.map((badge, index) => {
            const BadgeIcon = badgeIcons[index] || ShieldCheck;
            return (
              <div key={badge.title} className={`flex flex-col items-center md:items-start gap-4 ${index === 4 ? 'hidden lg:flex' : ''}`}>
                <BadgeIcon size={24} className="text-gold" />
                <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white">{badge.title}</h5>
                <p className="text-[10px] text-gray-text text-center md:text-left leading-relaxed">{badge.body}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="flex items-baseline gap-2 group">
              <span className="font-serif text-3xl italic text-gold">C&C</span>
              <span className="font-sans text-xl tracking-[0.3em] font-bold text-white group-hover:text-gold transition-colors">CAMPBELL & CO.</span>
            </Link>
            <p className="text-[11px] text-gray-text leading-loose tracking-widest uppercase opacity-60">
              {content.footer.brandStatement}
            </p>
            <div className="flex gap-6">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-text hover:text-gold transition-all hover:scale-110">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h6 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Shop</h6>
            <ul className="space-y-4">
              {[
                { label: 'All Jewelry', path: '/shop' },
                { label: 'Rings', path: '/shop' },
                { label: 'Necklaces', path: '/shop' },
                { label: 'Earrings', path: '/shop' },
                { label: 'Bracelets', path: '/shop' },
                { label: "Men's Collection", path: '/men/rings' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[10px] uppercase tracking-[0.25em] text-gray-text hover:text-gold transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h6 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Diamonds</h6>
            <ul className="space-y-4">
              {[
                { label: 'Lab Grown Diamonds', path: '/diamonds/lab' },
                { label: 'Natural Diamonds', path: '/diamonds/natural' },
                { label: 'Diamond Guide', path: '/diamonds' },
                { label: 'Certification', path: '/diamonds/certified' },
                { label: 'Stone Security', path: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[10px] uppercase tracking-[0.25em] text-gray-text hover:text-gold transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h6 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">Customer Care</h6>
            <ul className="space-y-4">
              {[
                { label: 'Contact Us', path: '/contact' },
                { label: 'FAQ', path: '/faq' },
                { label: 'About Us', path: '/about' },
                { label: 'Returns & Exchanges', path: '/faq' },
                { label: 'Order Tracking', path: '#' },
                { label: 'Size Guide', path: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-[10px] uppercase tracking-[0.25em] text-gray-text hover:text-gold transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h6 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">{content.footer.newsletterTitle}</h6>
            <p className="text-[10px] text-gray-text tracking-widest leading-relaxed">
              {content.footer.newsletterBody}
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="w-full bg-black-soft border border-white/10 rounded px-6 py-4 text-[10px] tracking-widest text-white placeholder:text-gray-border focus:outline-none focus:border-gold transition-colors"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:text-white transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-border">
            <Link to="/about" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-gold transition-colors">Terms of Service</Link>
            <a href={publicUrl('/admin.html')} className="text-gold hover:text-white transition-colors">Admin Portal</a>
            <span>{content.footer.copyright}</span>
          </div>

          <div className="flex items-center gap-6 grayscale opacity-40">
            <div className="flex gap-4 items-center">
              <span className="text-[9px] uppercase tracking-widest font-bold text-gray-text mr-4">WE ACCEPT</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-2" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="PayPal" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Apple_Pay_logo.svg" className="h-4" alt="Apple Pay" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/bf/Klarna_Logo.svg" className="h-4" alt="Klarna" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
