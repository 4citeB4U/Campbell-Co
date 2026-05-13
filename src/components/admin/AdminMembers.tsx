/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_MEMBERS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminMembers.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminMembers.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Gem,
  Award,
  History,
  MessageSquare
} from 'lucide-react';
import { Member } from '../../types';

interface MembersProps {
  members: Member[];
}

export function AdminMembers({ members }: MembersProps) {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">CRM</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Global Members</h2>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all">
            Private Client Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-[#111] border border-white/5 p-8 space-y-8">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Member Insights</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Total Lifetime Value</p>
                    <p className="text-2xl font-serif text-white tracking-widest">$1.2M</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Active VIPs</p>
                    <p className="text-2xl font-serif text-white tracking-widest">142</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Avg. Loyalty Balance</p>
                    <p className="text-2xl font-serif text-white tracking-widest">4,500 pts</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#111] border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-[#050505] flex items-center justify-between">
                 <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="SEARCH CLIENTS..." 
                      className="w-full bg-black-pure border border-white/5 pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
                    />
                 </div>
                 <div className="flex gap-4">
                    <button className="p-3 bg-black-pure border border-white/5 text-white/40 hover:text-white">
                       <Award size={16} />
                    </button>
                 </div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-[#050505] border-b border-white/5">
                          <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Client</th>
                          <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Tier</th>
                          <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">LTV</th>
                          <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Points</th>
                          <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black text-right">Concierge</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {members.map((member) => (
                         <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                     <span className="text-[10px] font-black uppercase text-gold">{member.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                     <p className="text-[11px] font-black uppercase tracking-widest">{member.name}</p>
                                     <p className="text-[8px] text-white/20 uppercase mt-1">{member.email}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="p-6">
                               <span className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                                  member.customerTier === 'Private Client' ? 'bg-gold/10 text-gold border-gold/20' :
                                  member.customerTier === 'VIP' ? 'bg-white/10 text-white border-white/20' :
                                  'bg-transparent text-white/40 border-white/10'
                               }`}>
                                  {member.customerTier}
                               </span>
                            </td>
                            <td className="p-6">
                               <span className="text-[11px] font-mono">${member.lifetimeValue.toLocaleString()}</span>
                            </td>
                            <td className="p-6">
                               <span className="text-[11px] font-mono">{member.rewardsBalance.toLocaleString()}</span>
                            </td>
                            <td className="p-6 text-right">
                               <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all">
                                     <MessageSquare size={14} />
                                  </button>
                                  <button className="p-3 bg-white/5 hover:bg-white hover:text-black transition-all">
                                     <History size={14} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                       {members.length === 0 && (
                          <tr>
                             <td colSpan={5} className="p-20 text-center text-white/20 uppercase tracking-[0.4em] text-[10px]">
                                No members in the global registry
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
