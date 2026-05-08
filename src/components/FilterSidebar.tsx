/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.FILTER_SIDEBAR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = FilterSidebar.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/FilterSidebar.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '../types';

interface FilterSidebarProps {
  activeCategory: Category;
  filters: any;
  setFilters: (filters: any) => void;
  openGroups: Record<string, boolean>;
  setOpenGroups: (groups: any) => void;
}

interface CheckboxProps {
  key?: string;
  group: string;
  label: string;
  filters: any;
  onChange: (group: string, value: string) => void;
}

const FilterGroup = ({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="border border-gold/30 bg-[#050505] mb-2 overflow-hidden">
    <button 
      onClick={onToggle}
      className="flex justify-between items-center w-full px-6 py-5 text-[10px] uppercase tracking-[0.4em] font-black text-gray-text hover:text-gold transition-colors bg-black-pure"
    >
      {title}
      {isOpen ? <ChevronUp size={14} className="text-gold" /> : <ChevronDown size={14} />}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Checkbox = ({ group, label, filters, onChange }: CheckboxProps) => {
  const isChecked = filters[group]?.includes(label);
  return (
    <label className="flex items-center gap-3 cursor-pointer group/item py-1">
      <div 
        onClick={() => onChange(group, label)}
        className={`w-3.5 h-3.5 border transition-all duration-300 flex items-center justify-center ${isChecked ? 'border-gold bg-gold/10' : 'border-white/10 group-hover/item:border-gold/50'}`}
      >
        {isChecked && <div className="w-1.5 h-1.5 bg-gold" />}
      </div>
      <span className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${isChecked ? 'text-white' : 'text-gray-border group-hover/item:text-white'}`}>
        {label}
      </span>
    </label>
  );
};

export default function FilterSidebar({ activeCategory, filters, setFilters, openGroups, setOpenGroups }: FilterSidebarProps) {
  const toggleGroup = (group: string) => {
    setOpenGroups((prev: any) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleCheckboxChange = (group: string, value: string) => {
    const current = filters[group] || [];
    const updated = current.includes(value) 
      ? current.filter((v: string) => v !== value) 
      : [...current, value];
    setFilters({ ...filters, [group]: updated });
  };

  const getStyleTitle = (cat: Category) => {
    if (cat === 'Rings') return 'RING STYLE';
    if (cat === 'Chains') return 'CHAIN STYLE';
    if (cat === 'Pendants') return 'PENDANT TYPE';
    if (cat === 'Bracelets') return 'BRACELET TYPE';
    if (cat === 'Stud Earrings') return 'CATEGORY';
    if (cat === 'Loose Diamonds') return 'DIAMOND SHAPE';
    return 'STYLE';
  };

  return (
    <div className="w-full border border-gold p-2 bg-black-pure">
      <div className="flex items-center justify-between mb-8 px-4 pt-4 pb-4 border-b border-white/10">
        <span className="text-[11px] uppercase tracking-[0.5em] font-black text-white">Refine By</span>
        <button 
          onClick={() => setFilters({})}
          className="text-[9px] uppercase tracking-[0.3em] text-gold hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      <FilterGroup title={getStyleTitle(activeCategory)} isOpen={openGroups.style} onToggle={() => toggleGroup('style')}>
        {activeCategory === 'Rings' && ['Classic Band', 'Brushed Band', 'Black Titanium', 'Onyx Signet', 'Diamond Channel', 'Black Diamond', 'Hammered Band', 'Braided Band', 'Carbon Fiber'].map(s => <Checkbox key={s} group="subCategory" label={s} filters={filters} onChange={handleCheckboxChange} />)}
        {activeCategory === 'Chains' && ['Miami Cuban', 'Rope Chain', 'Figaro Chain', 'Franco Chain', 'Box Chain', 'Snake Chain', 'Bead Chain', 'Paperclip Chain', 'Wheat Chain', 'Byzantine Chain'].map(s => <Checkbox key={s} group="subCategory" label={s} filters={filters} onChange={handleCheckboxChange} />)}
        {activeCategory === 'Pendants' && ['Diamond Cross', 'Baguette Cross', 'Lion Medallion', 'Onyx Dog Tag', 'Initial Pendant', 'Praying Hands', 'Compass Pendant', 'Jesus Face', 'Crown Pendant', 'Angel Pendant', 'Dollar Sign', 'Eagle Head'].map(s => <Checkbox key={s} group="subCategory" label={s} filters={filters} onChange={handleCheckboxChange} />)}
        {activeCategory === 'Bracelets' && ['Miami Cuban', 'Tennis Bracelet', 'Rope Bracelet', 'ID Bracelet', 'Onyx Beaded', 'Figaro Bracelet'].map(s => <Checkbox key={s} group="subCategory" label={s} filters={filters} onChange={handleCheckboxChange} />)}
        {activeCategory === 'Stud Earrings' && ['Lab Diamond Studs', 'Natural Diamond Studs', 'Halo Studs', 'Solitaire Studs', 'Princess Cut Studs', 'Round Cut Studs', 'Black Diamond Studs'].map(s => <Checkbox key={s} group="subCategory" label={s} filters={filters} onChange={handleCheckboxChange} />)}
        {activeCategory === 'Loose Diamonds' && ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Asscher', 'Marquise', 'Pear', 'Radiant', 'Heart'].map(s => <Checkbox key={s} group="cut" label={s} filters={filters} onChange={handleCheckboxChange} />)}
      </FilterGroup>

      {activeCategory === 'Loose Diamonds' && (
        <>
          <FilterGroup title="Carat Weight" isOpen={openGroups.carat} onToggle={() => toggleGroup('carat')}>
            {['0.50 - 0.99', '1.00 - 1.49', '1.50 - 1.99', '2.00 - 2.99', '3.00 - 3.99', '4.00+'].map(c => <Checkbox key={c} group="caratRange" label={c} filters={filters} onChange={handleCheckboxChange} />)}
          </FilterGroup>
          <FilterGroup title="Certification" isOpen={openGroups.cert} onToggle={() => toggleGroup('cert')}>
            {['GIA', 'IGI', 'GCAL'].map(c => <Checkbox key={c} group="certification" label={c} filters={filters} onChange={handleCheckboxChange} />)}
          </FilterGroup>
          <FilterGroup title="Clarity" isOpen={openGroups.clarity} onToggle={() => toggleGroup('clarity')}>
            {['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'].map(c => <Checkbox key={c} group="clarity" label={c} filters={filters} onChange={handleCheckboxChange} />)}
          </FilterGroup>
          <FilterGroup title="Color" isOpen={openGroups.color} onToggle={() => toggleGroup('color')}>
            {['D', 'E', 'F', 'G', 'H', 'I', 'J'].map(c => <Checkbox key={c} group="colorGrade" label={c} filters={filters} onChange={handleCheckboxChange} />)}
          </FilterGroup>
        </>
      )}

      <FilterGroup title="Diamond Type" isOpen={openGroups.stone} onToggle={() => toggleGroup('stone')}>
        {['Lab', 'Natural'].map(s => <Checkbox key={s} group="type" label={s} filters={filters} onChange={handleCheckboxChange} />)}
      </FilterGroup>

      <FilterGroup title="Metal" isOpen={openGroups.metal} onToggle={() => toggleGroup('metal')}>
        {['14K Yellow Gold', '14K White Gold', '14K Rose Gold', '18K Yellow Gold', 'Platinum', 'Black Titanium', 'Titanium'].map(s => <Checkbox key={s} group="metal" label={s} filters={filters} onChange={handleCheckboxChange} />)}
      </FilterGroup>


      {(activeCategory === 'Chains' || activeCategory === 'Bracelets') && (
        <FilterGroup title="Length" isOpen={openGroups.length} onToggle={() => toggleGroup('length')}>
          {['16 Inch', '18 Inch', '20 Inch', '22 Inch', '24 Inch', '26 Inch', '30 Inch'].map(l => <Checkbox key={l} group="length" label={l} filters={filters} onChange={handleCheckboxChange} />)}
        </FilterGroup>
      )}

      {activeCategory === 'Stud Earrings' && (
        <FilterGroup title="Carat Weight" isOpen={openGroups.carat} onToggle={() => toggleGroup('carat')}>
           {['0.25 - 0.49 CTW', '0.50 - 0.99 CTW', '1.00 - 1.99 CTW', '2.00 - 2.99 CTW', '3.00+ CTW'].map(c => <Checkbox key={c} group="caratRange" label={c} filters={filters} onChange={handleCheckboxChange} />)}
        </FilterGroup>
      )}

      {activeCategory === 'Stud Earrings' && (
        <FilterGroup title="Backing Type" isOpen={openGroups.backing} onToggle={() => toggleGroup('backing')}>
           {['Screw Back', 'Push Back'].map(b => <Checkbox key={b} group="backingType" label={b} filters={filters} onChange={handleCheckboxChange} />)}
        </FilterGroup>
      )}

      <FilterGroup title="Price Range" isOpen={openGroups.price} onToggle={() => toggleGroup('price')}>
        <div className="py-4">
          <input type="range" className="w-full accent-gold h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mb-6" />
          <div className="flex justify-between text-[10px] text-white font-bold tracking-widest px-2">
            <span>$150</span>
            <span>$20,000+</span>
          </div>
          <button className="w-full mt-6 py-3 border border-gold/50 text-gold text-[9px] uppercase tracking-[0.3em] font-black hover:bg-gold hover:text-black transition-all">Apply Filters</button>
        </div>
      </FilterGroup>
    </div>
  );
}
