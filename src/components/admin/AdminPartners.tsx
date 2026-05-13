/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_PARTNERS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminPartners.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminPartners.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Link as LinkIcon, 
  Plus, 
  Search, 
  Globe, 
  ShieldCheck, 
  Zap, 
  BarChart,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  Unlock
} from 'lucide-react';

export function AdminPartners() {
  const [partners, setPartners] = useState([
    { id: '1', name: 'GIA Registry', type: 'Certification', status: 'Connected', uptime: '99.9%', apiCalls: '12k' },
    { id: '2', name: 'FedEx Luxury', type: 'Logistics', status: 'Active', uptime: '98.5%', apiCalls: '4k' },
    { id: '3', name: 'Stripe Private', type: 'Payments', status: 'Connected', uptime: '100%', apiCalls: '45k' },
  ]);

  const [connecting, setConnecting] = useState(false);

  const simulateConnection = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      alert('Partner API Successfully Integrated. Neural bridge established.');
    }, 3000);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Marketplace & APIs</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Partner Hub</h2>
        </div>
        <button 
          onClick={simulateConnection}
          className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all"
        >
          {connecting ? <div className="w-3 h-3 border-2 border-black-pure border-t-transparent animate-spin rounded-full" /> : <Plus size={16} />}
          {connecting ? 'Establishing Bridge...' : 'Integrate New Partner'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
         <div className="xl:col-span-2 space-y-6">
            <div className="bg-[#111] border border-white/5 overflow-hidden">
               <div className="p-6 border-b border-white/5 bg-[#050505] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Active Connections</span>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-500 rounded-full" />
                     <span className="text-[9px] uppercase tracking-widest text-green-500 font-black">All Systems Normal</span>
                  </div>
               </div>
               <div className="divide-y divide-white/5">
                  {partners.map((partner) => (
                    <div key={partner.id} className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                       <div className="flex items-center gap-8">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-gold transition-colors">
                             <Globe size={24} />
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-[11px] font-black uppercase tracking-widest">{partner.name}</h4>
                             <p className="text-[9px] uppercase tracking-widest text-white/40">{partner.type} - API v4.2</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-12">
                          <div className="text-right space-y-1">
                             <p className="text-[9px] uppercase tracking-widest text-white/20 font-black">Monthly Calls</p>
                             <p className="text-[11px] font-mono text-white">{partner.apiCalls}</p>
                          </div>
                          <div className="text-right space-y-1">
                             <p className="text-[9px] uppercase tracking-widest text-white/20 font-black">Uptime</p>
                             <p className="text-[11px] font-mono text-green-500">{partner.uptime}</p>
                          </div>
                          <button className="p-3 border border-white/10 hover:border-gold/40 hover:text-gold transition-all">
                             <ExternalLink size={14} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gold/5 border border-gold/10 p-8 space-y-8">
               <div className="flex items-center gap-4">
                  <ShieldCheck size={24} className="text-gold" />
                  <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">API Security Vault</h3>
               </div>
               <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">All partner connections are governed by LeeWay Sovereign Standards. Keys are rotated every 24 hours.</p>
               <button className="w-full py-4 border border-gold/20 text-gold text-[9px] uppercase tracking-[0.3em] font-black hover:bg-gold hover:text-black-pure transition-all">Rotate Global Keys</button>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 space-y-8">
               <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Onboarding Requests</h3>
               <div className="space-y-4">
                  {[1].map(i => (
                    <div key={i} className="p-4 bg-black-pure border border-white/5 space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest text-gold font-black">DeBeers Private</span>
                          <span className="text-[8px] uppercase tracking-widest text-white/20">Pending</span>
                       </div>
                       <p className="text-[9px] uppercase tracking-widest text-white/40 leading-relaxed">Requesting access to real-time inventory PIM for automated wholesale pricing.</p>
                       <div className="flex gap-4">
                          <button className="flex-1 py-2 bg-white/5 text-[8px] uppercase tracking-widest font-black hover:bg-green-500 hover:text-black-pure transition-all">Approve</button>
                          <button className="flex-1 py-2 bg-white/5 text-[8px] uppercase tracking-widest font-black hover:bg-red-500 hover:text-black-pure transition-all">Deny</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
