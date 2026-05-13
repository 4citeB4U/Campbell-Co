/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_MEDIA.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminMedia.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminMedia.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Image as ImageIcon, 
  Music, 
  Upload, 
  Plus, 
  Search, 
  MoreVertical,
  Play,
  Trash2,
  CheckCircle,
  FileText
} from 'lucide-react';
import { publicAssetUrl } from '../../lib/publicPath';

export function AdminMedia() {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'images' | 'audio'>('all');
  const [items, setItems] = useState([
    { id: '1', type: 'video', title: 'Summer Collection Hero', size: '12.4 MB', date: '2 hours ago', thumbnail: '' },
    { id: '2', type: 'image', title: 'Noir Cuban Bracelet - Front', size: '2.1 MB', date: '5 hours ago', thumbnail: '/assets/products/bracelet-1.png' },
    { id: '3', type: 'video', title: 'Craftsmanship Lookbook', size: '45.8 MB', date: '1 day ago', thumbnail: '' },
    { id: '4', type: 'audio', title: 'Luxury Ambient - Store Loop', size: '3.2 MB', date: '2 days ago', thumbnail: '' },
  ]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    // Simulate luxury asset upload
    setTimeout(() => {
      const newItem = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'video' : 'image',
        title: `Asset_${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        size: `${(Math.random() * 20).toFixed(1)} MB`,
        date: 'Just now',
        thumbnail: ''
      };
      setItems([newItem, ...items]);
      setUploading(false);
    }, 2500);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Content Engine</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Media Studio</h2>
        </div>
        <button 
          onClick={handleUpload}
          disabled={uploading}
          className={`px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-black-pure border-t-transparent animate-spin rounded-full" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Encoding Asset...' : 'Upload New Asset'}
        </button>
      </div>

      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#050505] flex flex-wrap gap-6 items-center justify-between">
           <div className="flex gap-4">
              {['all', 'video', 'images', 'audio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-5 py-2 text-[9px] uppercase tracking-[0.3em] font-black transition-all ${
                    activeTab === tab ? 'text-gold border-b border-gold' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>
           <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input 
                type="text" 
                placeholder="SEARCH MEDIA..." 
                className="bg-black-pure border border-white/5 pl-10 pr-4 py-2 text-[9px] uppercase tracking-widest focus:border-gold outline-none text-white"
              />
           </div>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 min-h-[400px]">
           <AnimatePresence>
              {items.filter(i => activeTab === 'all' || i.type === activeTab.slice(0, -1)).map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group space-y-4"
                >
                    <div className="aspect-square bg-black-pure border border-white/5 relative overflow-hidden flex items-center justify-center">
                      {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Play size={32} className="text-white" />
                          </div>
                      )}
                      {item.thumbnail ? (
                        <img src={publicAssetUrl(item.thumbnail)} alt="" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      ) : (
                        <div className="text-white/10 group-hover:text-gold transition-colors">
                            {item.type === 'video' ? <Video size={40} /> : item.type === 'audio' ? <Music size={40} /> : <ImageIcon size={40} />}
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 bg-black/60 hover:bg-red-500 transition-colors"
                          >
                             <Trash2 size={12} />
                          </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest truncate">{item.title}</p>
                      <div className="flex justify-between items-center text-[8px] uppercase tracking-widest text-white/20">
                          <span>{item.size}</span>
                          <span>{item.date}</span>
                      </div>
                    </div>
                </motion.div>
              ))}
           </AnimatePresence>
           
           <button 
              onClick={handleUpload}
              className="aspect-square border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 text-white/20 hover:text-gold hover:border-gold/30 transition-all"
            >
              <Plus size={24} />
              <span className="text-[9px] uppercase tracking-widest font-black">Add Asset</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 bg-[#050505] border border-white/5 p-8 space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Background Music Control</h3>
            <div className="space-y-6">
               <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-gold/10 flex items-center justify-center text-gold">
                        <Music size={20} />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase tracking-widest">Storefront Ambient</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Playing on Homepage</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <span className="text-[9px] uppercase tracking-widest text-green-500 font-black">Active</span>
                     <button className="px-5 py-2 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-black transition-all">Change</button>
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-[#111] border border-white/5 p-8 space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Storage Usage</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40">
                     <span>5.2 GB Used</span>
                     <span>10 GB Total</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full">
                     <div className="h-full bg-gold transition-all duration-1000" style={{ width: `${(items.length / 20) * 100}%` }} />
                  </div>
               </div>
               <p className="text-[8px] uppercase tracking-widest text-white/20 leading-relaxed">Luxury video assets account for 85% of total storage. Upgrade to Infinite Vault for more capacity.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
