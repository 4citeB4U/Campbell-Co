import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShoppingBag, 
  Gem, 
  Settings, 
  LogOut, 
  History, 
  Heart,
  Award,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminStore } from '../hooks/useAdminStore'; // Assuming we can use parts of this for members too or create a useMember hook

export default function MemberArea() {
  return (
    <div className="min-h-screen bg-black-pure pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full border border-gold/30 p-1">
                 <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                    <Users size={40} className="text-white/20" />
                 </div>
              </div>
              <div className="space-y-2">
                 <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-black">Private Account</span>
                 <h1 className="text-4xl lg:text-5xl font-serif tracking-widest uppercase">Evelyn Harper</h1>
                 <div className="flex gap-4">
                    <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full">VIP Member</span>
                    <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Elite Tier</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <button className="px-8 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black transition-all">Edit Profile</button>
              <button className="p-3 bg-white/5 border border-white/10 hover:text-red-500 transition-all"><LogOut size={16} /></button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Rewards Dashboard */}
           <div className="bg-[#050505] border border-white/5 p-10 space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Loyalty Rewards</h3>
                 <Award size={18} className="text-gold" />
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] uppercase tracking-widest text-white/40">Available Balance</p>
                 <h2 className="text-5xl font-serif text-white tracking-widest">12,450</h2>
                 <p className="text-[9px] uppercase tracking-widest text-gold italic">Points worth $124.50</p>
              </div>
              <div className="space-y-4">
                 <button className="w-full py-4 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white transition-all">Redeem Offer</button>
                 <p className="text-[8px] uppercase tracking-widest text-white/20 text-center leading-relaxed">Earn 10 points for every $1 spent on Campbell-Co artifacts.</p>
              </div>
           </div>

           {/* Quick Stats */}
           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-[#111] border border-white/5 p-10 space-y-6 group cursor-pointer hover:border-white/10">
                 <div className="flex justify-between items-center">
                    <ShoppingBag size={20} className="text-white/20 group-hover:text-gold transition-colors" />
                    <ChevronRight size={14} className="text-white/10" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Recent Acquisitions</h4>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">4 Items in processing</p>
                 </div>
              </div>
              <div className="bg-[#111] border border-white/5 p-10 space-y-6 group cursor-pointer hover:border-white/10">
                 <div className="flex justify-between items-center">
                    <Heart size={20} className="text-white/20 group-hover:text-red-500 transition-colors" />
                    <ChevronRight size={14} className="text-white/10" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Saved Artifacts</h4>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">12 Items in wishlist</p>
                 </div>
              </div>
              <div className="bg-[#111] border border-white/5 p-10 space-y-6 group cursor-pointer hover:border-white/10">
                 <div className="flex justify-between items-center">
                    <History size={20} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                    <ChevronRight size={14} className="text-white/10" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Legacy Registry</h4>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">Full purchase history</p>
                 </div>
              </div>
              <div className="bg-[#111] border border-white/5 p-10 space-y-6 group cursor-pointer hover:border-white/10">
                 <div className="flex justify-between items-center">
                    <Settings size={20} className="text-white/20 group-hover:text-white transition-colors" />
                    <ChevronRight size={14} className="text-white/10" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Vault Settings</h4>
                    <p className="text-[9px] uppercase tracking-widest text-white/40">Manage security & data</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Purchases Feed */}
        <div className="space-y-8">
           <h3 className="text-[12px] uppercase tracking-[0.4em] font-black border-b border-white/5 pb-6">Registry Activity</h3>
           <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-[#050505] border border-white/5 p-8 flex items-center gap-8 group hover:border-white/10 transition-colors">
                   <div className="w-20 h-20 bg-black-pure border border-white/5 p-4 shrink-0">
                      <ImageIcon size={24} className="text-white/10" />
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                         <h4 className="text-[11px] font-black uppercase tracking-widest">Noir Cuban Bracelet</h4>
                         <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-full">Delivered</span>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 leading-relaxed">Ref: CC-28A1B | Acquired on May 12, 2026</p>
                   </div>
                   <button className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-black transition-all">Details</button>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
