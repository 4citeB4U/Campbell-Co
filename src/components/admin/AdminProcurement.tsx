/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_PROCUREMENT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminProcurement.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminProcurement.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Gem, 
  BarChart2, 
  Zap,
  Package,
  History,
  ArrowUpRight
} from 'lucide-react';
import { ProcurementData } from '../../types';

interface ProcurementProps {
  data: ProcurementData | null;
}

export function AdminProcurement({ data }: ProcurementProps) {
  if (!data) return <div className="text-[10px] uppercase tracking-widest text-white/40">Loading market intelligence...</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Material Sourcing</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Procurement Intel</h2>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-black">
              Last Sync: {new Date(data.lastUpdated).toLocaleTimeString()}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <MarketCard 
          label="Gold Market Price" 
          value={`$${data.goldPrice.toLocaleString()}`} 
          unit="/ oz"
          trend="+4.2%" 
          trendUp={true} 
          icon={<Zap size={24} className="text-gold" />}
        />
        <MarketCard 
          label="Diamond Index" 
          value={data.diamondPriceIndex.toString()} 
          unit="IDEX"
          trend="-1.5%" 
          trendUp={false} 
          icon={<Gem size={24} className="text-blue-400" />}
        />
        <MarketCard 
          label="Est. Portfolio Margin" 
          value="68%" 
          unit="Global"
          trend="+0.8%" 
          trendUp={true} 
          icon={<TrendingUp size={24} className="text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
         <div className="xl:col-span-2 bg-[#111] border border-white/5 p-10 space-y-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
               <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Price Impact Recommendations</h3>
               <BarChart2 size={18} className="text-white/20" />
            </div>
            <div className="space-y-6">
               <RecommendationRow 
                  title="Reprice 14K Yellow Gold Chains" 
                  reason="Gold spot price hit $2,350/oz. Current margin below 40%." 
                  impact="+$12,400 Monthly Revenue"
               />
               <RecommendationRow 
                  title="Bulk Buy: 1ct VS1 Lab Diamonds" 
                  reason="IDEX Index indicates temporary dip. Supplier A offering 5% rebate." 
                  impact="-12% Cost Basis"
               />
            </div>
         </div>

         <div className="bg-[#050505] border border-white/5 p-8 space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Supplier Costs</h3>
            <div className="space-y-6">
               {Object.entries(data.supplierCosts).map(([name, cost]) => (
                 <div key={name} className="flex justify-between items-center">
                    <div className="space-y-1">
                       <p className="text-[10px] uppercase tracking-widest text-white">{name}</p>
                       <p className="text-[8px] uppercase tracking-widest text-white/20">Primary Supplier</p>
                    </div>
                    <span className="text-[12px] font-mono text-gold">${cost.toLocaleString()}</span>
                 </div>
               ))}
               <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black transition-all">
                  Manage Suppliers
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}

function MarketCard({ label, value, unit, trend, trendUp, icon }: { label: string, value: string, unit: string, trend: string, trendUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-white/5 p-8 space-y-6 group hover:border-gold/30 transition-colors">
       <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-white/5 flex items-center justify-center">
             {icon}
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
             {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
             {trend}
          </div>
       </div>
       <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">{label}</p>
          <div className="flex items-baseline gap-2">
             <h3 className="text-3xl font-serif text-white tracking-widest">{value}</h3>
             <span className="text-[10px] text-white/20 uppercase font-black">{unit}</span>
          </div>
       </div>
    </div>
  );
}

function RecommendationRow({ title, reason, impact }: { title: string, reason: string, impact: string }) {
  return (
    <div className="flex gap-6 group">
       <div className="mt-1">
          <AlertTriangle size={16} className="text-gold" />
       </div>
       <div className="flex-1 space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h4>
          <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">{reason}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-green-500 flex items-center gap-2">
             <ArrowUpRight size={12} /> {impact}
          </p>
       </div>
       <button className="px-6 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-gold hover:text-black transition-all h-fit">
          Approve
       </button>
    </div>
  );
}
