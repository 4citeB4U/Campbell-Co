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
TAG: UI.SRC.COMPONENTS.REFINEMENT_BAR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = RefinementBar.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/RefinementBar.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

interface RefinementBarProps {
  filters: any;
  setFilters: (filters: any) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeCategory: string;
}

const Dropdown = ({ label, options, selected, onSelect, multi = false }: { 
  label: string; 
  options: string[]; 
  selected: string | string[]; 
  onSelect: (val: string) => void;
  multi?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSelected = (val: string) => {
    if (Array.isArray(selected)) return selected.includes(val);
    return selected === val;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-4 px-6 py-4 border transition-all duration-500 whitespace-nowrap ${isOpen || (Array.isArray(selected) ? selected.length > 0 : selected !== 'Featured' && selected !== 'All') ? 'border-gold bg-gold/5 text-gold' : 'border-gold/10 text-gray-text hover:border-gold/40'}`}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-black">
          {label}
          {Array.isArray(selected) && selected.length > 0 && (
            <span className="ml-2 bg-gold text-black-pure px-1.5 py-0.5 text-[8px] rounded-full">
              {selected.length}
            </span>
          )}
        </span>
        <ChevronDown size={12} className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-72 bg-black-pure border border-gold z-50 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt);
                    if (!multi) setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-left transition-colors hover:bg-gold/10 ${isSelected(opt) ? 'text-gold bg-gold/5' : 'text-gray-text'}`}
                >
                  {opt}
                  {isSelected(opt) && <Check size={12} className="text-gold" />}
                </button>
              ))}
            </div>
            {multi && Array.isArray(selected) && selected.length > 0 && (
              <div className="p-2 border-t border-gold/10">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white transition-colors"
                >
                  Apply Selection
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function RefinementBar({ filters, setFilters, sortBy, setSortBy, activeCategory }: RefinementBarProps) {
  const handleFilterChange = (group: string, value: string) => {
    const current = filters[group] || [];
    const updated = current.includes(value) 
      ? current.filter((v: string) => v !== value) 
      : [...current, value];
    setFilters({ ...filters, [group]: updated });
  };

  const metals = ['14K Yellow Gold', '14K White Gold', '14K Rose Gold', 'Platinum', 'Black Titanium', 'Titanium'];
  const shapes = ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Asscher', 'Marquise', 'Pear', 'Radiant', 'Heart'];
  const types = ['Lab', 'Natural'];
  const qualities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const sorts = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Carat: High to Low'];

  return (
    <div className="flex flex-wrap items-center gap-4 py-8 mb-12 border-t border-gold/10">
      <Dropdown 
        label="Metal" 
        options={metals} 
        selected={filters.metal || []} 
        onSelect={(val) => handleFilterChange('metal', val)} 
        multi 
      />
      
      {(activeCategory === 'Loose Diamonds' || activeCategory === 'Rings' || activeCategory === 'Stud Earrings') && (
        <Dropdown 
          label="Shape" 
          options={shapes} 
          selected={filters.cut || []} 
          onSelect={(val) => handleFilterChange('cut', val)} 
          multi 
        />
      )}

      <Dropdown 
        label="Culture" 
        options={types} 
        selected={filters.stoneType || []} 
        onSelect={(val) => handleFilterChange('stoneType', val)} 
        multi 
      />

      {(activeCategory === 'Loose Diamonds') && (
        <Dropdown 
          label="Quality" 
          options={qualities} 
          selected={filters.clarity || []} 
          onSelect={(val) => handleFilterChange('clarity', val)} 
          multi 
        />
      )}

      <div className="ml-auto flex items-center gap-4">
        <span className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-border">Sort By:</span>
        <Dropdown 
          label={sortBy} 
          options={sorts} 
          selected={sortBy} 
          onSelect={setSortBy} 
        />
      </div>
    </div>
  );
}
