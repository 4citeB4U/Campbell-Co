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
TAG: UI.SRC.COMPONENTS.PRODUCT_GRID.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ProductGrid.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/ProductGrid.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product, Gender, Category } from '../types';
import ProductCard from './ProductCard';
import DiamondGuide from './DiamondGuide';
import RefinementBar from './RefinementBar';
import { ChevronDown, LayoutGrid, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductGrid() {
  const { gender: urlGender, category: urlCategory } = useParams();
  const navigate = useNavigate();
  const { products: allProducts, loading } = useProducts();
  
  const activeGender = useMemo(() => (urlGender || 'women') as Gender, [urlGender]);
  const activeCategory = useMemo(() => {
    if (!urlCategory) return 'Rings';
    // Map URL slug style to Category type
    const map: Record<string, Category> = {
      'rings': 'Rings',
      'chains': 'Chains',
      'pendants': 'Pendants',
      'bracelets': 'Bracelets',
      'stud-earrings': 'Stud Earrings',
      'loose-diamonds': 'Loose Diamonds'
    };
    return map[urlCategory] || 'Rings';
  }, [urlCategory]);

  const [sortBy, setSortBy] = useState<string>('Featured');
  const [filters, setFilters] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeGender, activeCategory, filters]);

  // Reset filters when changing category or gender
  useEffect(() => {
    setFilters({});
  }, [activeGender, activeCategory]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      // Loose Diamonds are unisex by default in marketplace
      const pGender = (p.gender || '').toLowerCase();
      const aGender = (activeGender || '').toLowerCase();
      
      if (activeCategory !== 'Loose Diamonds' && pGender !== aGender && pGender !== 'unisex') return false;
      if (p.category !== activeCategory) return false;

      // Apply dynamic filters
      for (const key in filters) {
        if (filters[key] && filters[key].length > 0) {
          const productValue = p[key as keyof Product];
          // Special handling for stoneType mapping if needed, but here we assume mapping is consistent
          if (!filters[key].includes(productValue)) return false;
        }
      }
      return true;
    });
  }, [allProducts, activeGender, activeCategory, filters]);

  const sortedProducts = useMemo(() => {
    const p = [...filteredProducts];
    if (sortBy === 'Price: Low to High') return p.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') return p.sort((a, b) => b.price - a.price);
    if (sortBy === 'Carat: High to Low') return p.sort((a, b) => (b.carat || 0) - (a.carat || 0));
    return p;
  }, [filteredProducts, sortBy]);

  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(0, currentPage * itemsPerPage);
  }, [sortedProducts, currentPage]);

  const hasMore = paginatedProducts.length < sortedProducts.length;

  const handleGenderChange = (g: Gender) => {
    navigate(`/${g}/${urlCategory || 'rings'}`);
  };

  const handleCategoryChange = (cat: string) => {
    navigate(`/${activeGender}/${cat}`);
  };

  if (loading && allProducts.length === 0) {
    return (
      <div className="min-h-screen bg-black-pure flex items-center justify-center">
         <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-black-pure min-h-screen">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 py-12">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 border-b border-gold/20 pb-12">
          <div className="space-y-8 flex-1">
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">
              <button 
                onClick={() => navigate('/')}
                className="hover:text-gold transition-colors"
               >
                 Home
               </button>
              <span className="opacity-30">/</span>
              <button 
                onClick={() => navigate('/shop')}
                className="hover:text-gold transition-colors"
              >
                Shop
              </button>
              <span className="opacity-30">/</span>
              <span className="text-white uppercase">
                {activeGender}'s {activeCategory}
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl lg:text-7xl font-serif tracking-[0.1em] uppercase text-white leading-none">
                {activeGender}'s <span className="text-gold">{activeCategory}</span>
              </h1>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black px-4 py-1.5 border border-gold/30 bg-gold/5">
                  {filteredProducts.length} PROFESSIONALLY VERIFIED PIECES
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 w-full lg:w-auto">
             <div className="flex bg-[#0a0a0a] border border-gold/10 p-1 rounded-sm w-full md:w-auto overflow-hidden">
                {['women', 'men'].map((g) => (
                  <button 
                    key={g}
                    onClick={() => handleGenderChange(g as Gender)}
                    className={`flex-1 md:flex-none px-12 py-3 text-[10px] uppercase font-black tracking-[0.6em] transition-all duration-700 ${activeGender === g ? 'bg-gold text-black-pure shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-white/40 hover:text-white hover:bg-gold/5'}`}
                  >
                    {g}
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Category Context Switcher */}
        <div className="flex gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar border-b border-gold/10">
          {[
            { label: 'Rings', slug: 'rings' },
            { label: 'Chains', slug: 'chains' },
            { label: 'Pendants', slug: 'pendants' },
            { label: 'Bracelets', slug: 'bracelets' },
            { label: 'Stud Earrings', slug: 'stud-earrings' },
            { label: 'Loose Diamonds', slug: 'loose-diamonds' }
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-12 py-5 text-[10px] uppercase tracking-[0.5em] font-black transition-all border-b-2 whitespace-nowrap ${activeCategory === cat.label ? 'border-gold text-white bg-gold/5' : 'border-transparent text-white/40 hover:text-white hover:border-gold/30'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <RefinementBar 
          filters={filters} 
          setFilters={setFilters} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
          activeCategory={activeCategory}
        />

        <div className="w-full">
          {paginatedProducts.length > 0 ? (
            <div className={`grid gap-x-6 gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
              <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 border border-gold/10 bg-[#050505] rounded-none">
                 <Search size={48} className="text-gold/20" />
                 <h3 className="text-3xl font-serif tracking-[0.3em] text-white uppercase">No Pieces Found</h3>
                 <p className="text-[11px] text-white/40 uppercase tracking-[0.4em] font-light max-w-sm leading-loose">
                   Your current search and filter criteria did not return any matches from our vault. All Campbell & Co. diamonds are professionally inspected and verified.
                 </p>
                 <button 
                  onClick={() => setFilters({})}
                  className="px-16 py-6 border border-gold text-gold text-[10px] uppercase tracking-[0.6em] font-black hover:bg-gold hover:text-black-pure transition-all"
                 >
                   Reset Global Filters
                 </button>
              </div>
            )}

            {hasMore && (
              <div className="mt-32 flex flex-col items-center gap-10 py-20 border-t border-gold/10">
                <div className="text-center space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-black">
                    Showing {paginatedProducts.length} of {sortedProducts.length} Discovery results
                  </p>
                  <div className="w-64 h-[1px] bg-gold/10 relative overflow-hidden">
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${(paginatedProducts.length / sortedProducts.length) * 100}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="group relative px-24 py-6 border border-gold text-white text-[10px] uppercase tracking-[0.6em] font-black transition-all bg-black-pure hover:bg-gold hover:text-black-pure"
                >
                  Load More <span className="text-gold group-hover:text-black-pure ml-2 transition-colors">Exclusives</span>
                </button>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
