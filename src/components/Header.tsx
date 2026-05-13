/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.HEADER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Header.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/Header.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, ShieldCheck, Truck, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { MASTER_PRODUCTS } from '../constants';
import { Product } from '../types';
import { useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl, publicUrl } from '../lib/publicPath';

export default function Header() {
  const { toggleCart, totalItems } = useCart();
  const { content } = useSiteContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = MASTER_PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Women', path: '/women/rings' },
    { label: 'Men', path: '/men/rings' },
    { label: 'Diamonds', path: '/diamonds' },
    { label: 'Shop All', path: '/shop' }
  ];

  return (
    <>
      {/* Top Trust Bar */}
      <div className="bg-[#050505] border-b border-gold/10 py-3 hidden lg:block relative z-[60]">
        <div className="max-w-[1700px] mx-auto px-12 flex justify-between items-center">
          <div className="flex gap-10">
            {content.header.benefits.map((benefit, index) => {
              const icons = [Truck, Award, ShieldCheck];
              const BenefitIcon = icons[index] || ShieldCheck;
              return (
                <div key={benefit} className="flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] text-gray-border font-black">
                  <BenefitIcon size={10} className="text-gold" />
                  {benefit}
                </div>
              );
            })}
          </div>
          <div className="flex gap-8 text-[8px] uppercase tracking-[0.3em] text-white font-black">
            <Link to="/account" className="hover:text-gold transition-colors flex items-center gap-2">
              <User size={12} className="text-gold" /> Account
            </Link>
            <button className="hover:text-gold transition-colors flex items-center gap-2"><Heart size={12} className="text-gold" /> Wishlist (0)</button>
            <button onClick={toggleCart} className="hover:text-gold transition-colors flex items-center gap-2 relative">
              <ShoppingBag size={12} className="text-gold" /> 
              Bag ({totalItems})
            </button>
          </div>
        </div>
      </div>

      <header 
        className={`fixed lg:sticky top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? 'bg-black-pure/95 backdrop-blur-md py-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-black-pure py-8'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-6 lg:px-12 flex items-center justify-between gap-12">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white hover:text-gold transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Luxury Logo */}
          <div className="flex-none text-center lg:text-left">
            <Link to="/" className="flex flex-col group">
              <span className="font-serif text-3xl lg:text-4xl tracking-[0.2em] text-white group-hover:text-gold transition-colors uppercase leading-none">
                CAMPBELL <span className="text-gold">&</span> CO.
              </span>
              <span className="text-[8px] tracking-[0.6em] text-gold uppercase font-black mt-2 pl-1 opacity-80">DIAMOND MERCHANTS</span>
            </Link>
          </div>

          {/* GLOBAL SEARCH SYSTEM */}
          <div className="hidden lg:flex flex-1 max-w-xl relative" ref={searchRef}>
            <div 
              className={`flex items-center w-full bg-[#0a0a0a] border ${
                isSearchOpen ? 'border-gold shadow-[0_0_20px_rgba(214,180,106,0.15)]' : 'border-gold/20'
              } transition-all duration-500 rounded-sm overflow-hidden`}
            >
              <Search size={16} className="text-gold ml-5 mr-3" />
              <input 
                type="text" 
                placeholder={content.header.searchPlaceholder}
                className="w-full py-4 bg-transparent text-white text-[10px] uppercase tracking-[0.25em] font-black focus:outline-none placeholder:text-gray-border/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-border hover:text-white px-5 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* AUTO-SUGGEST DROPDOWN */}
            <AnimatePresence>
              {isSearchOpen && (searchQuery.length > 0 || searchResults.length > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black-pure border border-gold shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] overflow-hidden"
                >
                  <div className="p-6 space-y-6">
                    {searchResults.length > 0 ? (
                      <>
                        <h5 className="text-[9px] uppercase tracking-[0.5em] text-gold font-black border-b border-gold/10 pb-3 mb-2">Refined Results</h5>
                        <div className="space-y-4">
                          {searchResults.map((p) => (
                            <div 
                              key={p.id} 
                              onClick={() => {
                                setIsSearchOpen(false);
                                navigate(`/product/${p.slug}`);
                              }}
                              className="flex gap-5 p-3 hover:bg-gold/5 transition-all duration-300 cursor-pointer group rounded-sm"
                            >
                              <div className="w-14 h-14 bg-[#0a0a0a] border border-gold/10 flex-none overflow-hidden">
                                <img src={publicAssetUrl(p.image)} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={p.title} />
                              </div>
                              <div className="flex flex-col justify-center gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white group-hover:text-gold transition-colors">{p.title}</span>
                                <div className="flex gap-4 items-center">
                                  <span className="text-[9px] text-gray-border uppercase tracking-widest">${p.price.toLocaleString()}</span>
                                  <span className="text-[8px] px-2 py-0.5 bg-gold/10 text-gold border border-gold/20 font-black">{p.stoneType}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="py-10 text-center space-y-4">
                        <p className="text-[11px] text-gray-border uppercase tracking-[0.3em] italic">No diamonds found matching your criteria</p>
                        <p className="text-[9px] text-gold uppercase tracking-[0.4em] font-black">Try searching by cut, metal, or collection</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="hidden xl:flex items-center gap-10">
            {navItems.map((item) => (
              <Link 
                key={item.label}
                to={item.path}
                className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all relative group py-2 ${
                  location.pathname === item.path ? 'text-gold' : 'text-white hover:text-gold'
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-500 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>
          
          <div className="lg:hidden flex items-center gap-6">
             <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-white hover:text-gold transition-colors">
               <Search size={22} />
             </button>
             <button onClick={toggleCart} className="text-white hover:text-gold transition-colors relative">
               <ShoppingBag size={22} />
               {totalItems > 0 && (
                 <span className="absolute -top-2 -right-2 bg-gold text-black-pure text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-sm">
                   {totalItems}
                 </span>
               )}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black-pure/95 z-[60] backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-black-pure border-r border-gold/20 z-[70] p-10 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex flex-col">
                  <span className="font-serif text-3xl italic text-gold">C&C</span>
                  <span className="text-[7px] tracking-[0.4em] text-gold font-black">EST. 2026</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-gold transition-colors p-2"
                >
                  <X size={32} />
                </button>
              </div>
              <div className="flex flex-col gap-10">
                {navItems.map((item) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group text-left"
                  >
                    <span className="text-3xl font-serif tracking-widest text-white hover:text-gold transition-all uppercase block mb-1">
                      {item.label}
                    </span>
                    <div className="h-px w-0 bg-gold group-hover:w-12 transition-all duration-500" />
                  </Link>
                ))}
                <a 
                  href={publicUrl('/admin.html')}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group text-left"
                >
                  <span className="text-3xl font-serif tracking-widest text-gold hover:text-white transition-all uppercase block mb-1">
                    Management
                  </span>
                  <div className="h-px w-0 bg-white group-hover:w-12 transition-all duration-500" />
                </a>
              </div>
              
              <div className="mt-auto space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">{content.header.mobileConciergeTitle}</p>
                  <p className="text-[11px] text-gray-text leading-relaxed tracking-widest uppercase italic">{content.header.mobileConciergeBody}</p>
                </div>
                <Link 
                  to={content.header.mobileConciergeCta.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-5 border border-gold text-gold text-[10px] uppercase font-black tracking-[0.4em] inline-block text-center hover:bg-gold hover:text-black-pure transition-all"
                >
                  {content.header.mobileConciergeCta.label}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
