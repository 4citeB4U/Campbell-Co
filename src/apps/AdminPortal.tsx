/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.APPS.ADMIN_PORTAL.MAIN
DESCRIPTION: Luxury-commerce Operating System (Admin Portal)
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminPortal.tsx — full luxury OS rebuild
WHY = Transform basic admin into mobile-first owner command center
WHO = Leeway Innovations
WHERE = src/apps/AdminPortal.tsx
WHEN = 2026-05-13
HOW = React + Motion + Lucide + Custom Admin Modules

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Image as ImageIcon, 
  LayoutGrid, 
  Home, 
  Brain, 
  Gem, 
  ShoppingBag, 
  Settings as SettingsIcon,
  Plus,
  LogOut,
  ChevronRight,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Search,
  Users,
  ShieldCheck,
  Zap,
  Activity,
  Video,
  Target
} from 'lucide-react';
import { auth, signInWithGoogle, db, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useProducts, seedDatabase } from '../hooks/useProducts';
import { useAdminStore } from '../hooks/useAdminStore';
import { collection, doc, updateDoc, deleteDoc, getDocs, limit, orderBy, query, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { DEFAULT_SITE_CONTENT, SiteContent } from '../content/siteContent';
import { resetLocalSiteContent, saveSiteContent, useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl, publicUrl } from '../lib/publicPath';

// New Components
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminMembers } from '../components/admin/AdminMembers';
import { AdminAgents } from '../components/admin/AdminAgents';
import { AdminProcurement } from '../components/admin/AdminProcurement';
import { AdminMedia } from '../components/admin/AdminMedia';
import { AdminCMS } from '../components/admin/AdminCMS';
import { AdminPartners } from '../components/admin/AdminPartners';
import { AdminSettings } from '../components/admin/AdminSettings';

// Types for Admin View
type AdminSection = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'members' 
  | 'agents' 
  | 'procurement' 
  | 'media' 
  | 'vendors' 
  | 'analytics' 
  | 'privacy' 
  | 'site-control' 
  | 'settings';

type AdminUser = Pick<User, 'displayName' | 'photoURL'>;

export default function AdminPortal() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { products, loading: loadingProducts } = useProducts(true);
  const { orders, members, agents, procurement, actions, loading: loadingStore } = useAdminStore();

  useEffect(() => {
    if (!auth) {
      setUser({ displayName: 'Local Admin', photoURL: '' });
      setLoadingAuth(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  if (loadingAuth) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin rounded-full" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111] border border-white/10 p-12 space-y-10 text-center"
       >
          <div className="flex justify-center">
             <div className="w-16 h-16 border-2 border-gold flex items-center justify-center">
                <span className="text-gold font-serif text-3xl">C</span>
             </div>
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-serif text-white tracking-widest uppercase">Vault Access</h1>
             <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Owner Operating System Restricted</p>
          </div>
          <button 
            onClick={signInWithGoogle}
            className="w-full py-5 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all transform active:scale-95"
          >
            Authenticate Identity
          </button>
       </motion.div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'PIM / Registry', icon: Package },
    { id: 'members', label: 'CRM / Members', icon: Users },
    { id: 'agents', label: 'AI Workforce', icon: Brain },
    { id: 'procurement', label: 'Procurement', icon: Zap },
    { id: 'media', label: 'Media Studio', icon: Video },
    { id: 'vendors', label: 'Marketplace', icon: Target },
    { id: 'site-control', label: 'Site Control', icon: Home },
    { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
    { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
    { id: 'settings', label: 'Vault Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row lg:h-screen overflow-x-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#050505] border-r border-white/5 flex-col shrink-0">
         <div className="p-8 border-b border-white/5 flex items-center gap-5">
            <div className="relative group">
               <div className="w-10 h-10 border border-gold/40 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-all duration-700">
                  <span className="text-gold font-serif text-lg -rotate-45 group-hover:rotate-0 transition-all duration-700">C</span>
               </div>
               <div className="absolute inset-0 border border-gold/10 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.5em] font-black text-white">CAMPBELL</span>
                  <span className="text-gold font-serif italic text-sm">&</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.5em] font-black text-white">CO</span>
                  <span className="text-[8px] uppercase tracking-widest font-black text-gold/40">OS</span>
               </div>
            </div>
         </div>

         <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all group ${
                  activeSection === item.id 
                    ? 'bg-gold text-black-pure font-black' 
                    : 'hover:bg-white/5 text-white/40'
                }`}
              >
                <item.icon size={16} strokeWidth={activeSection === item.id ? 2.5 : 1.5} />
                <span className="text-[9px] uppercase tracking-[0.25em]">{item.label}</span>
              </button>
            ))}
         </nav>

         <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-sm">
               <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full grayscale" />
               <div className="flex-1 overflow-hidden">
                  <p className="text-[9px] font-black uppercase tracking-widest truncate">{user.displayName || 'Owner'}</p>
               </div>
               <button onClick={() => auth ? signOut(auth) : setUser(null)} className="text-white/20 hover:text-white transition-colors">
                  <LogOut size={14} />
               </button>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
         {/* Header */}
         <header className="h-20 bg-[#050505] border-b border-white/5 flex items-center justify-between px-4 lg:px-12 shrink-0 z-50 sticky top-0">
            <div className="flex items-center gap-6">
               <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={20} />
               </button>
               <h2 className="text-[12px] uppercase tracking-[0.6em] font-black text-white/90">
                 {navItems.find(i => i.id === activeSection)?.label}
               </h2>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest opacity-40">System Live</span>
               </div>
               <button onClick={() => setActiveSection('products')} className="p-2 text-white/40 hover:text-white transition-colors">
                  <Search size={18} />
               </button>
               <button className="lg:hidden w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src={user.photoURL || ''} alt="" className="w-full h-full object-cover grayscale" />
               </button>
            </div>
         </header>

         <div className="lg:hidden border-b border-white/5 bg-[#050505] px-4 py-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as AdminSection)}
                  className={`px-4 py-3 border text-[8px] uppercase tracking-[0.28em] font-black whitespace-nowrap transition-all ${
                    activeSection === item.id
                      ? 'border-gold bg-gold text-black-pure'
                      : 'border-white/10 text-white/45'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
         </div>

         {/* Content Viewport */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeSection}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="max-w-[1600px] mx-auto"
               >
                 {activeSection === 'dashboard' && <AdminDashboard orders={orders} members={members} products={products} analytics={{}} />}
                 {activeSection === 'orders' && <AdminOrders orders={orders} onUpdateStatus={actions.updateOrderStatus} />}
                 {activeSection === 'products' && <AdminProductList />}
                 {activeSection === 'members' && <AdminMembers members={members} />}
                 {activeSection === 'agents' && <AdminAgents agents={agents} onApprove={actions.approveAgentTask} />}
                 {activeSection === 'procurement' && <AdminProcurement data={procurement} />}
                 {activeSection === 'site-control' && <AdminCMS />}
                 {activeSection === 'media' && <AdminMedia />}
                 {activeSection === 'vendors' && <AdminPartners />}
                 {activeSection === 'analytics' && <AdminPlaceholder section="Intelligence" icon={BarChart3} description="First-party behavior tracking and conversion funnels." />}
                 {activeSection === 'privacy' && <AdminPlaceholder section="Privacy & Consent" icon={ShieldCheck} description="GDPR/CCPA compliance, cookie records, and data requests." />}
                 {activeSection === 'settings' && <AdminSettings />}
               </motion.div>
            </AnimatePresence>
         </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
         {mobileMenuOpen && (
           <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col lg:hidden"
           >
              <div className="h-20 border-b border-white/5 flex items-center justify-between px-6">
                 <div className="w-8 h-8 border border-gold flex items-center justify-center">
                    <span className="text-gold font-serif text-sm">C</span>
                 </div>
                 <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} />
                 </button>
              </div>
              <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                 {navItems.map((item) => (
                   <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id as AdminSection); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-6 p-4 rounded-sm transition-all ${
                       activeSection === item.id ? 'bg-gold text-black-pure font-black' : 'text-white/40 border border-white/5'
                    }`}
                   >
                      <item.icon size={20} />
                      <span className="text-[12px] uppercase tracking-[0.4em]">{item.label}</span>
                   </button>
                 ))}
              </nav>
              <div className="p-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full grayscale" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{user.displayName || 'Owner'}</p>
                 </div>
                 <button onClick={() => auth ? signOut(auth) : setUser(null)} className="p-2 text-white/20">
                    <LogOut size={20} />
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function AdminPlaceholder({ section, icon: Icon, description }: { section: string, icon: any, description: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 max-w-lg mx-auto">
       <div className="w-24 h-24 border-2 border-gold/20 flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gold/5 animate-pulse" />
          <Icon size={40} className="text-gold" />
       </div>
       <div className="space-y-4">
          <h2 className="text-2xl font-serif tracking-widest uppercase text-white">{section}</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] leading-loose text-white/40">{description}</p>
       </div>
       <button className="px-8 py-4 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gold/10 transition-all">
          Initialize Module
       </button>
    </div>
  );
}

function AdminProductList() {
  const { products, loading } = useProducts(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const displayedProducts = db ? products : localProducts;

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handleSave = async (p: Product) => {
    if (!db) {
      setLocalProducts((current) => {
        const existing = current.some((item) => item.id === p.id);
        return existing ? current.map((item) => item.id === p.id ? p : item) : [p, ...current];
      });
      setEditingProduct(null);
      return;
    }

    const { id, ...rest } = p;
    await setDoc(doc(db, 'products', id), {
      ...rest,
      updatedAt: serverTimestamp()
    }, { merge: true });
    setEditingProduct(null);
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Remove "${product.title || product.sku}" from the registry?`)) return;

    if (!db) {
      setLocalProducts((current) => current.filter((item) => item.id !== product.id));
      return;
    }

    await deleteDoc(doc(db, 'products', product.id));
  };

  return (
    <div className="space-y-10">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Registry</span>
             <h2 className="text-4xl font-serif tracking-widest uppercase">Inventory</h2>
          </div>
          <button 
            onClick={() => setEditingProduct({ 
              id: `new-${Date.now()}`, 
              slug: '',
              sku: `CC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 
              title: '', 
              price: 0, 
              status: 'draft', 
              image: '', 
              images: [],
              stoneType: 'Lab', 
              metal: '14K Yellow Gold', 
              carat: 1, 
              diamondCut: 'Round', 
              clarity: 'VS1',
              color: 'F',
              certification: 'IGI',
              description: '', 
              productStory: '',
              diamondPassport: { source: '', inspectedBy: '', verifiedDate: '', qualityNotes: '' },
              symbolism: '',
              stylingNotes: '',
              matchingProducts: [],
              category: 'Rings', 
              subcategory: '', 
              gender: 'women', 
              collection: '', 
              inventory: 1, 
              available: true,
              tags: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })}
            className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all">
             <Plus size={16} /> New Addition
          </button>
       </div>

       <div className="bg-[#111] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#050505] flex items-center justify-between">
             <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  placeholder="SEARCH REGISTRY..." 
                  className="w-full bg-black-pure border border-white/5 pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-[#050505] border-b border-white/5">
                   <tr>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Identity</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Specs</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Price</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Inventory</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Status</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {displayedProducts.map((product) => (
                     <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-black-pure border border-white/5 p-2 overflow-hidden flex items-center justify-center shrink-0">
                                 {product.image ? (
                                   <img src={publicAssetUrl(product.image)} alt="" className="max-w-full max-h-full object-contain grayscale" />
                                 ) : (
                                   <ImageIcon size={20} className="text-white/10" />
                                 )}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[11px] font-black tracking-widest uppercase truncate max-w-[200px]">{product.title || 'Untitled Artifact'}</p>
                                 <p className="text-[8px] font-mono text-gold italic uppercase">{product.sku}</p>
                              </div>
                           </div>
                        </td>
                        <td className="p-6">
                           <span className="text-[9px] uppercase tracking-widest text-white/40 block">{product.category}</span>
                           <span className="text-[8px] uppercase tracking-widest text-white/20">{product.metal} — {product.carat}ct</span>
                        </td>
                        <td className="p-6">
                           <span className="text-[11px] font-mono">${product.price.toLocaleString()}</span>
                        </td>
                        <td className="p-6">
                           <span className="text-[11px] font-mono">{product.inventory}</span>
                        </td>
                        <td className="p-6">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                product.status === 'live' ? 'bg-green-500' : 
                                product.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="text-[9px] uppercase tracking-widest font-black">{product.status}</span>
                           </div>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingProduct(product)} className="p-3 bg-white/5 text-white/40 hover:text-white transition-all"><ChevronRight size={14} /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {editingProduct && (
         <ProductEditModal 
           product={editingProduct} 
           onClose={() => setEditingProduct(null)} 
           onSave={handleSave} 
         />
       )}
    </div>
  );
}

function AdminTextArea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
       <label className="text-[9px] uppercase tracking-widest text-white/40 font-black">{label}</label>
       <textarea 
         value={value} 
         onChange={e => onChange(e.target.value)}
         rows={4}
         className="w-full bg-white/5 border border-white/10 p-4 text-[11px] uppercase tracking-widest focus:border-gold outline-none transition-colors leading-relaxed"
       />
    </div>
  );
}

function AdminTextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
      />
    </div>
  );
}

function ProductEditModal({ product, onClose, onSave }: { product: Product, onClose: () => void, onSave: (p: Product) => void }) {
  const [draft, setDraft] = useState<Product>(product);

  return (
    <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="bg-[#111] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
       >
          <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#111] z-10">
             <h3 className="text-xl font-serif tracking-widest uppercase">Edit Artifact</h3>
             <button onClick={onClose} className="p-2 hover:text-gold transition-colors"><X size={24} /></button>
          </div>
          
          <div className="p-12 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AdminTextField label="Title" value={draft.title} onChange={v => setDraft({...draft, title: v})} />
                <AdminTextField label="Price" value={draft.price.toString()} onChange={v => setDraft({...draft, price: Number(v)})} />
                <AdminTextField label="SKU" value={draft.sku} onChange={v => setDraft({...draft, sku: v})} />
                <AdminTextField label="Category" value={draft.category} onChange={v => setDraft({...draft, category: v as any})} />
             </div>
             <AdminTextArea label="Description" value={draft.description} onChange={v => setDraft({...draft, description: v})} />
          </div>

          <div className="p-8 border-t border-white/5 flex justify-end gap-6 sticky bottom-0 bg-[#111]">
             <button onClick={onClose} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
             <button onClick={() => onSave(draft)} className="px-10 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Update Registry</button>
          </div>
       </motion.div>
    </div>
  );
}
