/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.APPS.ADMIN_PORTAL.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminPortal.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/apps/AdminPortal.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

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
  Search
} from 'lucide-react';
import { auth, signInWithGoogle, db, isFirebaseConfigured } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useProducts, seedDatabase } from '../hooks/useProducts';
import { collection, doc, updateDoc, deleteDoc, getDocs, limit, orderBy, query, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { DEFAULT_SITE_CONTENT, SiteContent } from '../content/siteContent';
import { resetLocalSiteContent, saveSiteContent, useSiteContent } from '../hooks/useSiteContent';
import { publicAssetUrl, publicUrl } from '../lib/publicPath';

// Types for Admin View
type AdminSection = 'dashboard' | 'products' | 'categories' | 'homepage' | 'avo' | 'diamonds' | 'orders' | 'settings';
type AdminUser = Pick<User, 'displayName' | 'photoURL'>;

export default function AdminPortal() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      setUser({ displayName: 'Local Admin', photoURL: '' });
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return (
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
             <h1 className="text-3xl font-serif text-white tracking-widest uppercase">Admin Access</h1>
             <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Management Portal Restricted</p>
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

  // Sidebar Items
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Collections', icon: LayoutGrid },
    { id: 'homepage', label: 'Live Site', icon: Home },
    { id: 'avo', label: 'AVO Knowledge', icon: Brain },
    { id: 'diamonds', label: 'Loose Diamonds', icon: Gem },
    { id: 'orders', label: 'Global Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Vault Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#050505] border-r border-white/5 flex-col shrink-0">
         <div className="p-8 border-b border-white/5 flex items-center gap-4">
            <div className="w-8 h-8 border border-gold flex items-center justify-center shrink-0">
               <span className="text-gold font-serif text-sm">C</span>
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase tracking-[0.4em] font-black text-gold">Internal</span>
               <span className="text-[10px] uppercase tracking-[0.2em] font-black opacity-40">House Admin</span>
            </div>
         </div>

         <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-sm transition-all group ${
                  activeSection === item.id 
                    ? 'bg-gold text-black-pure font-black' 
                    : 'hover:bg-white/5 text-white/40'
                }`}
              >
                <item.icon size={18} strokeWidth={activeSection === item.id ? 2 : 1.5} />
                <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
         </nav>

         <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-sm">
               <img src={user.photoURL || ''} alt="" className="w-6 h-6 rounded-full grayscale" />
               <div className="flex-1 overflow-hidden">
                  <p className="text-[9px] font-black uppercase tracking-widest truncate">{user.displayName || 'House Admin'}</p>
               </div>
               <button onClick={() => auth ? signOut(auth) : setUser({ displayName: 'Local Admin', photoURL: '' })} className="text-white/20 hover:text-white transition-colors">
                  <LogOut size={14} />
               </button>
            </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* Header */}
         <header className="h-20 bg-[#050505] border-b border-white/5 flex items-center justify-between px-8 lg:px-12 shrink-0">
            <div className="flex items-center gap-6">
               <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={20} />
               </button>
               <h2 className="text-[12px] uppercase tracking-[0.6em] font-black text-white/90">
                 {navItems.find(i => i.id === activeSection)?.label}
               </h2>
            </div>
            
            <div className="flex items-center gap-6">
               {!isFirebaseConfigured && (
                 <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full">
                    <span className="text-[8px] uppercase tracking-widest text-gold">Local Demo Mode</span>
                 </div>
               )}
               <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest opacity-40">System Live</span>
               </div>
               <button onClick={() => setActiveSection('products')} className="p-2 text-white/40 hover:text-white transition-colors" title="Find products">
                  <Search size={18} />
               </button>
            </div>
         </header>

         {/* Content Viewport */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
            <AnimatePresence mode="wait">
               {activeSection === 'dashboard' && <AdminDashboard key="dash" onNavigate={setActiveSection} />}
               {activeSection === 'products' && <AdminProductList key="prod" />}
               {activeSection === 'categories' && <AdminCategories key="cat" />}
               {activeSection === 'homepage' && <AdminHomepageManager key="home" />}
               {activeSection === 'avo' && <AdminAVOKnowledge key="avo" />}
               {activeSection === 'diamonds' && <AdminDiamonds key="diamonds" />}
               {activeSection === 'orders' && <AdminOrders key="orders" />}
               {activeSection === 'settings' && <AdminSettings key="settings" />}
            </AnimatePresence>
         </div>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
         {mobileMenuOpen && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl lg:hidden"
           >
              <div className="flex justify-end p-8">
                 <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} />
                 </button>
              </div>
              <nav className="flex flex-col items-center gap-8 pt-12">
                 {navItems.map((item) => (
                   <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id as AdminSection); setMobileMenuOpen(false); }}
                    className="flex items-center gap-6 text-[14px] uppercase tracking-[0.4em]"
                   >
                      <item.icon size={20} className="text-gold" />
                      <span className={activeSection === item.id ? 'text-gold font-black' : 'text-white/40'}>{item.label}</span>
                   </button>
                 ))}
              </nav>
           </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}

// --- Dashboard Placeholder ---
function AdminDashboard({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const { products } = useProducts(true);
  const [seeding, setSeeding] = useState(false);
  const [analytics, setAnalytics] = useState({
    events: 0,
    sessions: 0,
    productViews: 0,
    addToCart: 0,
  });

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        const snapshot = await getDocs(query(collection(db, 'site_analytics'), orderBy('occurredAt', 'desc'), limit(500)));
        const events = snapshot.docs.map((item) => item.data());
        const sessions = new Set(events.map((event) => event.sessionId).filter(Boolean));

        if (mounted) {
          setAnalytics({
            events: events.length,
            sessions: sessions.size,
            productViews: events.filter((event) => event.name === 'product_view').length,
            addToCart: events.filter((event) => event.name === 'add_to_cart').length,
          });
        }
      } catch (error) {
        console.debug('Analytics summary unavailable', error);
      }
    }

    void loadAnalytics();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    { label: 'Total Artifacts', value: products.length.toString(), icon: Package, trend: 'Refined Registry' },
    { label: 'Live Listings', value: products.filter(p => p.status === 'live').length.toString(), icon: CheckCircle2, trend: 'Publicly Visible' },
    { label: 'Visitor Sessions', value: analytics.sessions.toString(), icon: BarChart3, trend: `${analytics.events} tracked actions` },
    { label: 'Cart Intent', value: analytics.addToCart.toString(), icon: ShoppingBag, trend: `${analytics.productViews} product views` },
  ];

  const handleSeed = async (force = false) => {
    setSeeding(true);
    try {
      await seedDatabase(force);
      alert(force ? 'Global Registry Refined Successfully' : 'Global Registry Seeded Successfully');
    } catch (err) {
      console.error(err);
      alert('Error during synchronization');
    }
    setSeeding(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
       <div className="flex justify-end gap-4 p-4 bg-[#050505] border border-white/5 rounded-sm">
          <button 
            disabled={seeding}
            onClick={() => handleSeed(true)}
            className="px-6 py-2 border border-gold/20 text-gold text-[9px] uppercase tracking-widest font-black hover:bg-gold/10 transition-all disabled:opacity-50"
          >
            {seeding ? 'Processing...' : 'Refine Global Registry'}
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#111] border border-white/5 p-8 space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">{stat.label}</span>
                  <stat.icon size={16} className="text-gold/60" />
               </div>
               <div className="space-y-2">
                  <p className="text-4xl font-serif text-white tracking-widest">{stat.value}</p>
                  <p className="text-[8px] uppercase tracking-widest text-gold italic">{stat.trend}</p>
               </div>
            </div>
          ))}
       </div>

       {products.length === 0 && (
         <div className="bg-gold/5 border border-gold/20 p-12 text-center space-y-6">
            <div className="space-y-2">
               <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Registry Empty</h3>
               <p className="text-[10px] text-white/40 uppercase tracking-widest leading-loose">No artifacts detected in the secure vault. Bootstrap initial collections?</p>
            </div>
            <button 
              onClick={() => handleSeed()}
              disabled={seeding}
              className="px-12 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all disabled:opacity-50"
            >
              {seeding ? 'Initializing...' : 'Seed Global Registry'}
            </button>
         </div>
       )}

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-[#050505] border border-white/5 p-10 space-y-8">
             <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Registry Activity</h3>
                <button onClick={() => onNavigate('homepage')} className="text-[10px] uppercase tracking-widest text-gold">View Site Controls</button>
             </div>
             <div className="space-y-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex gap-6 items-center group">
                     <div className="w-12 h-12 bg-white/5 flex items-center justify-center shrink-0">
                        <ImageIcon size={16} className="text-white/20" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-widest font-black truncate">Updated "Noir Cuban Bracelet" Price</p>
                        <p className="text-[8px] uppercase tracking-widest text-white/20">May 12, 14:23 — Security Vault A</p>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-gold" />
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gold p-10 space-y-8 flex flex-col justify-between">
             <div className="space-y-4">
                <h3 className="text-[12px] uppercase tracking-[0.4em] font-black text-black-pure">Global Commands</h3>
                <p className="text-[10px] leading-relaxed text-black-pure/60 font-black">Quickly modify the state of the jewelry house from anywhere.</p>
             </div>
             <div className="space-y-4">
                <button onClick={() => onNavigate('products')} className="w-full py-4 bg-black-pure text-white text-[9px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                   <Plus size={14} /> New Artifact
                </button>
                <button onClick={() => window.open(publicUrl('/'), '_blank', 'noopener,noreferrer')} className="w-full py-4 bg-white/20 text-black-pure text-[9px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                  <Eye size={14} /> Global Preview
                </button>
             </div>
          </div>
       </div>
    </motion.div>
  );
}

// --- Product List ---
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
    if (!window.confirm(`Remove "${product.title || product.sku}" from the admin list?`)) return;

    if (!db) {
      setLocalProducts((current) => current.filter((item) => item.id !== product.id));
      return;
    }

    await deleteDoc(doc(db, 'products', product.id));
  };

  if (loading && displayedProducts.length === 0) return <div>Synchronizing Registry...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-10"
    >
       <div className="flex justify-between items-end">
          <div className="space-y-4">
             <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Manager</span>
             <h2 className="text-4xl font-serif tracking-widest uppercase">Registry</h2>
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
          <table className="w-full text-left focus-ring">
             <thead className="bg-[#050505] border-b border-white/5">
                <tr>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Thumbnail</th>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Identity</th>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Category</th>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Price</th>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Status</th>
                   <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {displayedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                     <td className="p-6">
                        <div className="w-16 h-16 bg-black-pure border border-white/5 p-2 overflow-hidden flex items-center justify-center">
                           {product.image ? (
                             <img src={publicAssetUrl(product.image)} alt="" className="max-w-full max-h-full object-contain grayscale" />
                           ) : (
                             <ImageIcon size={20} className="text-white/10" />
                           )}
                        </div>
                     </td>
                     <td className="p-6">
                        <div className="space-y-1">
                           <p className="text-[11px] font-black tracking-widest uppercase truncate max-w-[200px]">{product.title || 'Untitled Artifact'}</p>
                           <p className="text-[8px] font-mono text-gold italic uppercase">{product.sku}</p>
                        </div>
                     </td>
                     <td className="p-6">
                        <span className="text-[9px] uppercase tracking-widest text-white/40">{product.category} — {product.gender}</span>
                     </td>
                     <td className="p-6">
                        <span className="text-[11px] font-mono">${product.price.toLocaleString()}</span>
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
                           <button onClick={() => setEditingProduct(product)} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">Edit</button>
                           <button className="text-[10px] uppercase tracking-widest text-red-500/40 hover:text-red-500" onClick={() => handleDelete(product)}>Delete</button>
                        </div>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>

       {editingProduct && (
         <ProductEditModal 
           product={editingProduct} 
           onClose={() => setEditingProduct(null)} 
           onSave={handleSave} 
         />
       )}
    </motion.div>
  );
}

function AdminHomepageManager() {
  const { content, loading } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [activePanel, setActivePanel] = useState<'homepage' | 'trust' | 'pages' | 'footer'>('homepage');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setDraft(content);
  }, [content]);

  const updateDraft = (updater: (current: SiteContent) => SiteContent) => {
    setDraft((current) => updater(structuredClone(current)));
    setStatus('Unsaved changes');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteContent(draft);
      setStatus(isFirebaseConfigured ? 'Published to the live site' : 'Saved in local demo mode');
    } catch (error) {
      console.error(error);
      setStatus('Could not publish. Check admin permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const next = structuredClone(DEFAULT_SITE_CONTENT);
    setDraft(next);
    if (!isFirebaseConfigured) resetLocalSiteContent();
    setStatus('Restored default content. Save to publish defaults.');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">No-Code Site Control</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Public Site Editor</h2>
          <p className="max-w-3xl text-[11px] uppercase tracking-[0.25em] leading-loose text-white/40">
            Edit the words, images, buttons, and trust messaging customers see. Use full public paths like /shop, /contact, or image paths from /assets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">{loading ? 'Loading content...' : status || 'Ready'}</span>
          <button onClick={handleReset} className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white/5">
            Restore Defaults
          </button>
          <button disabled={saving} onClick={handleSave} className="px-8 py-3 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white disabled:opacity-50 flex items-center gap-3">
            <Save size={14} /> {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_520px] gap-8">
        <div className="bg-[#111] border border-white/5">
          <div className="flex flex-wrap gap-2 p-4 border-b border-white/5 bg-[#050505]">
            {[
              ['homepage', 'Homepage'],
              ['trust', 'Trust & Proof'],
              ['pages', 'Pages'],
              ['footer', 'Footer'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActivePanel(id as typeof activePanel)}
                className={`px-5 py-3 text-[9px] uppercase tracking-[0.3em] font-black ${activePanel === id ? 'bg-gold text-black-pure' : 'text-white/40 hover:bg-white/5'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-8 lg:p-10 space-y-10">
            {activePanel === 'homepage' && (
              <>
                <AdminEditorGroup title="Top Hero">
                  <AdminTextField label="Small Label" value={draft.home.hero.eyebrow} onChange={(value) => updateDraft((next) => { next.home.hero.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline Line 1" value={draft.home.hero.titleLineOne} onChange={(value) => updateDraft((next) => { next.home.hero.titleLineOne = value; return next; })} />
                  <AdminTextField label="Headline Line 2" value={draft.home.hero.titleLineTwo} onChange={(value) => updateDraft((next) => { next.home.hero.titleLineTwo = value; return next; })} />
                  <AdminTextArea label="Intro Text" value={draft.home.hero.body} onChange={(value) => updateDraft((next) => { next.home.hero.body = value; return next; })} />
                  <AdminTextField label="Main Button Text" value={draft.home.hero.primaryCta.label} onChange={(value) => updateDraft((next) => { next.home.hero.primaryCta.label = value; return next; })} />
                  <AdminTextField label="Main Button Link" value={draft.home.hero.primaryCta.path} onChange={(value) => updateDraft((next) => { next.home.hero.primaryCta.path = value; return next; })} />
                  <AdminTextField label="Second Button Text" value={draft.home.hero.secondaryCta.label} onChange={(value) => updateDraft((next) => { next.home.hero.secondaryCta.label = value; return next; })} />
                  <AdminTextField label="Second Button Link" value={draft.home.hero.secondaryCta.path} onChange={(value) => updateDraft((next) => { next.home.hero.secondaryCta.path = value; return next; })} />
                  <AdminTextField label="Hero Image" value={draft.home.hero.image} onChange={(value) => updateDraft((next) => { next.home.hero.image = value; return next; })} />
                  <AdminTextField label="Starting Price Text" value={draft.home.hero.priceText} onChange={(value) => updateDraft((next) => { next.home.hero.priceText = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="Collection Doors">
                  {(['women', 'men'] as const).map((key) => (
                    <div key={key} className="md:col-span-2 border border-white/5 p-6 space-y-6">
                      <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">{key === 'women' ? 'Women Block' : 'Men Block'}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminTextField label="Small Label" value={draft.home.collections[key].eyebrow} onChange={(value) => updateDraft((next) => { next.home.collections[key].eyebrow = value; return next; })} />
                        <AdminTextField label="Headline" value={draft.home.collections[key].title} onChange={(value) => updateDraft((next) => { next.home.collections[key].title = value; return next; })} />
                        <AdminTextArea label="Text" value={draft.home.collections[key].body} onChange={(value) => updateDraft((next) => { next.home.collections[key].body = value; return next; })} />
                        <AdminTextField label="Image" value={draft.home.collections[key].image} onChange={(value) => updateDraft((next) => { next.home.collections[key].image = value; return next; })} />
                        <AdminTextField label="Button Text" value={draft.home.collections[key].cta.label} onChange={(value) => updateDraft((next) => { next.home.collections[key].cta.label = value; return next; })} />
                        <AdminTextField label="Button Link" value={draft.home.collections[key].cta.path} onChange={(value) => updateDraft((next) => { next.home.collections[key].cta.path = value; return next; })} />
                      </div>
                    </div>
                  ))}
                </AdminEditorGroup>

                <AdminEditorGroup title="Side Promo">
                  <AdminTextField label="Promo Headline" value={draft.home.promo.feature.title} onChange={(value) => updateDraft((next) => { next.home.promo.feature.title = value; return next; })} />
                  <AdminTextArea label="Promo Text" value={draft.home.promo.feature.body} onChange={(value) => updateDraft((next) => { next.home.promo.feature.body = value; return next; })} />
                  <AdminTextField label="Promo Image" value={draft.home.promo.feature.image} onChange={(value) => updateDraft((next) => { next.home.promo.feature.image = value; return next; })} />
                  <AdminTextField label="Promo Button Text" value={draft.home.promo.feature.cta.label} onChange={(value) => updateDraft((next) => { next.home.promo.feature.cta.label = value; return next; })} />
                  <AdminTextField label="Promo Button Link" value={draft.home.promo.feature.cta.path} onChange={(value) => updateDraft((next) => { next.home.promo.feature.cta.path = value; return next; })} />
                  <AdminTextField label="Appointment Title" value={draft.home.promo.appointment.title} onChange={(value) => updateDraft((next) => { next.home.promo.appointment.title = value; return next; })} />
                  <AdminTextArea label="Appointment Text" value={draft.home.promo.appointment.body} onChange={(value) => updateDraft((next) => { next.home.promo.appointment.body = value; return next; })} />
                  <AdminTextField label="Appointment Link" value={draft.home.promo.appointment.cta.path} onChange={(value) => updateDraft((next) => { next.home.promo.appointment.cta.path = value; return next; })} />
                </AdminEditorGroup>
              </>
            )}

            {activePanel === 'trust' && (
              <>
                <AdminEditorGroup title="Header Benefit Strip">
                  {draft.header.benefits.map((benefit, index) => (
                    <AdminTextField key={index} label={`Benefit ${index + 1}`} value={benefit} onChange={(value) => updateDraft((next) => { next.header.benefits[index] = value; return next; })} />
                  ))}
                  <AdminTextField label="Search Placeholder" value={draft.header.searchPlaceholder} onChange={(value) => updateDraft((next) => { next.header.searchPlaceholder = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="Diamond Proof Section">
                  <AdminTextField label="Small Label" value={draft.verification.eyebrow} onChange={(value) => updateDraft((next) => { next.verification.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline" value={draft.verification.title} onChange={(value) => updateDraft((next) => { next.verification.title = value; return next; })} />
                  <AdminTextArea label="Intro Text" value={draft.verification.body} onChange={(value) => updateDraft((next) => { next.verification.body = value; return next; })} />
                  <AdminTextArea label="Natural Diamond Bullets" value={draft.verification.naturalBullets.join('\n')} onChange={(value) => updateDraft((next) => { next.verification.naturalBullets = value.split('\n').filter(Boolean); return next; })} />
                  <AdminTextArea label="Lab Diamond Bullets" value={draft.verification.labBullets.join('\n')} onChange={(value) => updateDraft((next) => { next.verification.labBullets = value.split('\n').filter(Boolean); return next; })} />
                  <AdminTextField label="Advantage Headline" value={draft.verification.advantageTitle} onChange={(value) => updateDraft((next) => { next.verification.advantageTitle = value; return next; })} />
                  <AdminTextArea label="Advantage Text" value={draft.verification.advantageBody} onChange={(value) => updateDraft((next) => { next.verification.advantageBody = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="Bottom Trust Bar">
                  <AdminTextField label="Left Label" value={draft.trustBar.label} onChange={(value) => updateDraft((next) => { next.trustBar.label = value; return next; })} />
                  {draft.trustBar.points.map((point, index) => (
                    <AdminTextField key={index} label={`Trust Point ${index + 1}`} value={point} onChange={(value) => updateDraft((next) => { next.trustBar.points[index] = value; return next; })} />
                  ))}
                  <AdminTextField label="Right Label" value={draft.trustBar.established} onChange={(value) => updateDraft((next) => { next.trustBar.established = value; return next; })} />
                </AdminEditorGroup>
              </>
            )}

            {activePanel === 'footer' && (
              <>
                <AdminEditorGroup title="Footer Brand and Newsletter">
                  <AdminTextArea label="Brand Statement" value={draft.footer.brandStatement} onChange={(value) => updateDraft((next) => { next.footer.brandStatement = value; return next; })} />
                  <AdminTextField label="Newsletter Headline" value={draft.footer.newsletterTitle} onChange={(value) => updateDraft((next) => { next.footer.newsletterTitle = value; return next; })} />
                  <AdminTextArea label="Newsletter Text" value={draft.footer.newsletterBody} onChange={(value) => updateDraft((next) => { next.footer.newsletterBody = value; return next; })} />
                  <AdminTextField label="Copyright Text" value={draft.footer.copyright} onChange={(value) => updateDraft((next) => { next.footer.copyright = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="Footer Trust Badges">
                  {draft.footer.badges.map((badge, index) => (
                    <div key={index} className="border border-white/5 p-6 space-y-5">
                      <AdminTextField label={`Badge ${index + 1} Title`} value={badge.title} onChange={(value) => updateDraft((next) => { next.footer.badges[index].title = value; return next; })} />
                      <AdminTextArea label={`Badge ${index + 1} Text`} value={badge.body} onChange={(value) => updateDraft((next) => { next.footer.badges[index].body = value; return next; })} />
                    </div>
                  ))}
                </AdminEditorGroup>
              </>
            )}

            {activePanel === 'pages' && (
              <>
                <AdminEditorGroup title="About Page">
                  <AdminTextField label="Small Label" value={draft.pages.about.eyebrow} onChange={(value) => updateDraft((next) => { next.pages.about.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline" value={draft.pages.about.title} onChange={(value) => updateDraft((next) => { next.pages.about.title = value; return next; })} />
                  <AdminTextArea label="Page Text" value={draft.pages.about.body} onChange={(value) => updateDraft((next) => { next.pages.about.body = value; return next; })} />
                  <AdminTextField label="Image" value={draft.pages.about.image} onChange={(value) => updateDraft((next) => { next.pages.about.image = value; return next; })} />
                  <AdminTextField label="Button Text" value={draft.pages.about.cta.label} onChange={(value) => updateDraft((next) => { next.pages.about.cta.label = value; return next; })} />
                  <AdminTextField label="Button Link" value={draft.pages.about.cta.path} onChange={(value) => updateDraft((next) => { next.pages.about.cta.path = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="Contact Page">
                  <AdminTextField label="Small Label" value={draft.pages.contact.eyebrow} onChange={(value) => updateDraft((next) => { next.pages.contact.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline" value={draft.pages.contact.title} onChange={(value) => updateDraft((next) => { next.pages.contact.title = value; return next; })} />
                  <AdminTextArea label="Page Text" value={draft.pages.contact.body} onChange={(value) => updateDraft((next) => { next.pages.contact.body = value; return next; })} />
                  <AdminTextField label="Primary Button Text" value={draft.pages.contact.primaryCta.label} onChange={(value) => updateDraft((next) => { next.pages.contact.primaryCta.label = value; return next; })} />
                  <AdminTextField label="Primary Button Link" value={draft.pages.contact.primaryCta.path} onChange={(value) => updateDraft((next) => { next.pages.contact.primaryCta.path = value; return next; })} />
                  <AdminTextField label="Secondary Button Text" value={draft.pages.contact.secondaryCta.label} onChange={(value) => updateDraft((next) => { next.pages.contact.secondaryCta.label = value; return next; })} />
                </AdminEditorGroup>

                <AdminEditorGroup title="FAQ Page">
                  <AdminTextField label="Small Label" value={draft.pages.faq.eyebrow} onChange={(value) => updateDraft((next) => { next.pages.faq.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline" value={draft.pages.faq.title} onChange={(value) => updateDraft((next) => { next.pages.faq.title = value; return next; })} />
                  <AdminTextArea label="Intro Text" value={draft.pages.faq.body} onChange={(value) => updateDraft((next) => { next.pages.faq.body = value; return next; })} />
                  {draft.pages.faq.questions.map((item, index) => (
                    <div key={index} className="border border-white/5 p-6 space-y-5 md:col-span-2">
                      <AdminTextField label={`Question ${index + 1}`} value={item.question} onChange={(value) => updateDraft((next) => { next.pages.faq.questions[index].question = value; return next; })} />
                      <AdminTextArea label={`Answer ${index + 1}`} value={item.answer} onChange={(value) => updateDraft((next) => { next.pages.faq.questions[index].answer = value; return next; })} />
                    </div>
                  ))}
                </AdminEditorGroup>

                <AdminEditorGroup title="Journal Page">
                  <AdminTextField label="Small Label" value={draft.pages.journal.eyebrow} onChange={(value) => updateDraft((next) => { next.pages.journal.eyebrow = value; return next; })} />
                  <AdminTextField label="Headline" value={draft.pages.journal.title} onChange={(value) => updateDraft((next) => { next.pages.journal.title = value; return next; })} />
                  <AdminTextArea label="Intro Text" value={draft.pages.journal.body} onChange={(value) => updateDraft((next) => { next.pages.journal.body = value; return next; })} />
                  {draft.pages.journal.posts.map((post, index) => (
                    <div key={index} className="border border-white/5 p-6 space-y-5 md:col-span-2">
                      <AdminTextField label={`Post ${index + 1} Title`} value={post.title} onChange={(value) => updateDraft((next) => { next.pages.journal.posts[index].title = value; return next; })} />
                      <AdminTextArea label={`Post ${index + 1} Summary`} value={post.excerpt} onChange={(value) => updateDraft((next) => { next.pages.journal.posts[index].excerpt = value; return next; })} />
                      <AdminTextField label={`Post ${index + 1} Link`} value={post.path} onChange={(value) => updateDraft((next) => { next.pages.journal.posts[index].path = value; return next; })} />
                    </div>
                  ))}
                </AdminEditorGroup>
              </>
            )}
          </div>
        </div>

        <aside className="bg-[#050505] border border-white/5 h-[760px] sticky top-8 hidden 2xl:flex flex-col">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Live Preview</p>
              <p className="text-[9px] uppercase tracking-widest text-white/30 mt-2">Public homepage</p>
            </div>
            <a href={publicUrl('/')} target="_blank" className="text-[9px] uppercase tracking-widest text-white/40 hover:text-gold">Open Site</a>
          </div>
          <iframe title="Public site preview" src={publicUrl('/')} className="flex-1 w-full bg-black-pure" />
        </aside>
      </div>
    </motion.div>
  );
}

function AdminEditorGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-gold border-b border-white/5 pb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}

function AdminTextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-3 block">
      <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-black-pure border border-white/10 p-4 text-[11px] outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}

function AdminTextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-3 block md:col-span-2">
      <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-black">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-black-pure border border-white/10 p-4 text-[11px] outline-none focus:border-gold transition-colors"
      />
    </label>
  );
}

function AdminCategories() {
  const categories = [
    { title: 'Women Rings', count: 48, image: '/assets/campbell/jewelry/women-rings.png' },
    { title: 'Men Rings', count: 36, image: '/assets/campbell/jewelry/men-rings.png' },
    { title: 'Chains', count: 62, image: '/assets/campbell/jewelry/men-chains.png' },
    { title: 'Bracelets', count: 44, image: '/assets/campbell/jewelry/women-bracelets.png' },
    { title: 'Stud Earrings', count: 28, image: '/assets/campbell/jewelry/stud-earrings.png' },
    { title: 'Loose Diamonds', count: 82, image: '/assets/campbell/jewelry/loose-diamonds.png' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <AdminSectionHeader eyebrow="Collection Control" title="Collections" action="Preview Collections" onAction={() => window.open(publicUrl('/shop'), '_blank', 'noopener,noreferrer')} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.title} className="bg-[#111] border border-white/5 overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="aspect-[16/10] bg-black-pure overflow-hidden">
              <img src={publicAssetUrl(category.image)} alt="" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </div>
            <div className="p-8 flex items-center justify-between">
              <div>
                <h3 className="text-[12px] uppercase tracking-[0.3em] font-black">{category.title}</h3>
                <p className="text-[9px] uppercase tracking-widest text-white/30 mt-2">{category.count} live artifacts</p>
              </div>
              <button onClick={() => window.open(publicUrl('/shop'), '_blank', 'noopener,noreferrer')} className="text-gold" title={`Preview ${category.title}`}><ChevronRight size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AdminDiamonds() {
  const stones = [
    { shape: 'Round', grade: 'D / VVS1', carat: '1.50ct', image: '/assets/campbell/diamonds/round.png' },
    { shape: 'Princess', grade: 'E / VS1', carat: '2.10ct', image: '/assets/campbell/diamonds/princess.png' },
    { shape: 'Oval', grade: 'F / VVS2', carat: '1.75ct', image: '/assets/campbell/diamonds/oval.png' },
    { shape: 'Emerald', grade: 'D / IF', carat: '3.00ct', image: '/assets/campbell/diamonds/emerald.png' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <AdminSectionHeader eyebrow="Stone Vault" title="Loose Diamonds" action="Preview Diamond Guide" onAction={() => window.open(publicUrl('/diamonds'), '_blank', 'noopener,noreferrer')} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {stones.map((stone) => (
          <div key={stone.shape} className="bg-[#111] border border-white/5 p-8 space-y-6">
            <div className="aspect-square bg-black-pure border border-white/5 p-4">
              <img src={publicAssetUrl(stone.image)} alt="" className="w-full h-full object-contain grayscale" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">{stone.shape}</h3>
              <p className="text-[9px] uppercase tracking-widest text-gold">{stone.grade}</p>
              <p className="text-2xl font-serif">{stone.carat}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AdminOrders() {
  const orders = [
    { id: 'CC-ORD-1048', client: 'Private Client', total: '$8,420', status: 'Concierge Review' },
    { id: 'CC-ORD-1047', client: 'Vault Member', total: '$2,900', status: 'Insured Transit' },
    { id: 'CC-ORD-1046', client: 'Digital Inquiry', total: '$14,200', status: 'Awaiting Authorization' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <AdminSectionHeader eyebrow="Acquisition Flow" title="Orders" action="Open Checkout" onAction={() => window.open(publicUrl('/checkout'), '_blank', 'noopener,noreferrer')} />
      <div className="bg-[#111] border border-white/5 divide-y divide-white/5">
        {orders.map((order) => (
          <div key={order.id} className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gold">{order.id}</span>
            <span className="text-[11px] uppercase tracking-widest">{order.client}</span>
            <span className="text-xl font-serif">{order.total}</span>
            <span className="text-[9px] uppercase tracking-widest text-white/40">{order.status}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AdminSettings() {
  const [copied, setCopied] = useState(false);
  const adminEntry = `${window.location.origin}${publicUrl('/admin.html')}`;
  const copyAdminLink = async () => {
    await navigator.clipboard?.writeText(adminEntry);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <AdminSectionHeader eyebrow="House Controls" title="Vault Settings" action={copied ? 'Copied' : 'Copy Admin Link'} onAction={copyAdminLink} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          ['Firebase Status', isFirebaseConfigured ? 'Connected' : 'Local demo mode'],
          ['Storefront URL', `${window.location.origin}${publicUrl('/')}`],
          ['Admin Entry', adminEntry],
          ['Catalog Source', db ? 'Firestore products collection' : 'Generated local catalog'],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#111] border border-white/5 p-8 space-y-3">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">{label}</p>
            <p className="text-[12px] uppercase tracking-widest text-white/60 break-all">{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AdminSectionHeader({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">{eyebrow}</span>
        <h2 className="text-4xl font-serif tracking-widest uppercase">{title}</h2>
      </div>
      <button onClick={onAction} className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-white transition-all">
        <Plus size={16} /> {action}
      </button>
    </div>
  );
}

function AdminAVOKnowledge() {
  const [items, setItems] = useState([
    { topic: 'Sustainability', content: 'Our lab-grown diamonds reduce environmental impact by 70% compared to traditional mining.' },
    { topic: 'Craftsmanship', content: 'Each piece undergoes a 15-day multi-point quality control process in our San Francisco vault.' }
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftItem, setDraftItem] = useState({ topic: '', content: '' });

  const openEditor = (index?: number) => {
    if (typeof index === 'number') {
      setDraftItem(items[index]);
      setEditingIndex(index);
      return;
    }

    setDraftItem({ topic: 'New Client Answer', content: 'Write the answer customers should hear from AVO.' });
    setEditingIndex(items.length);
  };

  const saveNode = () => {
    setItems((current) => {
      const next = [...current];
      if (editingIndex === null) return next;
      next[editingIndex] = draftItem;
      return next;
    });
    setEditingIndex(null);
  };

  return (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
        <div className="flex justify-between items-end">
           <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Intelligence Base</span>
              <h2 className="text-4xl font-serif tracking-widest uppercase">AVO Cognitive Sync</h2>
           </div>
           <button onClick={() => openEditor()} className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all">
              <Plus size={16} /> New Knowledge Node
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {items.map((item, idx) => (
             <div key={idx} className="bg-[#111] border border-white/5 p-10 space-y-6 group hover:border-gold/30 transition-colors">
                <div className="flex justify-between items-center">
                   <h4 className="text-[11px] uppercase tracking-[0.4em] font-black text-gold">{item.topic}</h4>
                   <button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== idx))} className="opacity-0 group-hover:opacity-100 transition-opacity" title="Remove node"><X size={14} /></button>
                </div>
                <p className="text-[12px] leading-loose text-white/60 font-light italic">"{item.content}"</p>
                <div className="pt-4 flex justify-end">
                   <button onClick={() => openEditor(idx)} className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white">Edit Node</button>
                </div>
             </div>
           ))}
        </div>
        <AnimatePresence>
          {editingIndex !== null && (
            <div className="fixed inset-0 z-[320] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
              <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="bg-[#111] border border-gold/20 w-full max-w-2xl p-10 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="text-[12px] uppercase tracking-[0.5em] font-black text-gold">Teach AVO</h3>
                  <button onClick={() => setEditingIndex(null)}><X size={18} /></button>
                </div>
                <AdminTextField label="Topic Customers Ask About" value={draftItem.topic} onChange={(value) => setDraftItem((current) => ({ ...current, topic: value }))} />
                <AdminTextArea label="Friendly Answer" value={draftItem.content} onChange={(value) => setDraftItem((current) => ({ ...current, content: value }))} />
                <div className="flex justify-end gap-4">
                  <button onClick={() => setEditingIndex(null)} className="px-8 py-4 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black">Cancel</button>
                  <button onClick={saveNode} className="px-8 py-4 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black">Save Node</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
     </motion.div>
  );
}

function ProductEditModal({ product, onClose, onSave }: { product: Product, onClose: () => void, onSave: (p: Product) => void }) {
  const [data, setData] = useState<Product>(product);

  const fields = [
    { label: 'Title', key: 'title', type: 'text' },
    { label: 'Slug', key: 'slug', type: 'text' },
    { label: 'Price', key: 'price', type: 'number' },
    { label: 'Status', key: 'status', type: 'select', options: ['draft', 'preview', 'live', 'unavailable', 'archived'] },
    { label: 'Category', key: 'category', type: 'select', options: ['Rings', 'Chains', 'Pendants', 'Bracelets', 'Stud Earrings', 'Loose Diamonds'] },
    { label: 'Gender', key: 'gender', type: 'select', options: ['men', 'women', 'unisex'] },
    { label: 'Metal', key: 'metal', type: 'select', options: ['14K Yellow Gold', '14K White Gold', '14K Rose Gold', '18K Yellow Gold', '18K White Gold', 'Platinum', 'Sterling Silver', 'Black Titanium', 'Titanium'] },
    { label: 'Stone Type', key: 'stoneType', type: 'select', options: ['Lab', 'Natural', 'Certified', 'None'] },
    { label: 'Carat', key: 'carat', type: 'number' },
    { label: 'Image URL', key: 'image', type: 'text' },
    { label: 'Description', key: 'description', type: 'textarea' },
    { label: 'Product Story', key: 'productStory', type: 'textarea' },
    { label: 'Symbolism', key: 'symbolism', type: 'text' },
    { label: 'Passport Source', key: 'passportSource', type: 'text' },
    { label: 'Passport Inspected By', key: 'passportInspectedBy', type: 'text' },
    { label: 'Passport Verified Date', key: 'passportVerifiedDate', type: 'text' },
    { label: 'Passport Quality Notes', key: 'passportQualityNotes', type: 'textarea' },
  ];

  const handleFieldChange = (key: string, value: any) => {
    if (key.startsWith('passport')) {
      const passportKey = key.replace('passport', '').charAt(0).toLowerCase() + key.replace('passport', '').slice(1);
      setData(prev => ({
        ...prev,
        diamondPassport: {
          ...prev.diamondPassport,
          [passportKey]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [key]: value }));
    }
  };

  const getFieldValue = (key: string) => {
    if (key.startsWith('passport')) {
      const passportKey = key.replace('passport', '').charAt(0).toLowerCase() + key.replace('passport', '').slice(1) as keyof typeof data.diamondPassport;
      return data.diamondPassport[passportKey] || '';
    }
    return data[key as keyof Product];
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
       <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111] border border-gold/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar p-12 space-y-12 shadow-[0_0_100px_rgba(212,175,55,0.1)]"
       >
          <div className="flex justify-between items-center border-b border-white/5 pb-8">
             <h3 className="text-[14px] uppercase tracking-[0.6em] font-black">{product.sku ? 'Edit Artifact' : 'New Acquisition'}</h3>
             <button onClick={onClose}><X size={20} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {fields.map(f => (
               <div key={f.key} className="space-y-4">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">{f.label}</label>
                  {f.type === 'select' ? (
                    <select 
                      value={getFieldValue(f.key) as string}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      className="w-full bg-black-pure border border-white/10 p-4 text-[11px] uppercase tracking-widest outline-none focus:border-gold transition-colors"
                    >
                       {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea 
                      value={getFieldValue(f.key) as string}
                      onChange={(e) => handleFieldChange(f.key, e.target.value)}
                      rows={5}
                      className="w-full bg-black-pure border border-white/10 p-4 text-[11px] outline-none focus:border-gold transition-colors"
                    />
                  ) : (
                    <input 
                      type={f.type}
                      value={getFieldValue(f.key) as any}
                      onChange={(e) => handleFieldChange(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="w-full bg-black-pure border border-white/10 p-4 text-[11px] outline-none focus:border-gold transition-colors"
                    />
                  )}
               </div>
             ))}
          </div>

          <div className="flex justify-end gap-6 pt-12 border-t border-white/5">
             <button onClick={onClose} className="px-12 py-4 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white/5">Cancel</button>
             <button onClick={() => onSave(data)} className="px-12 py-4 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white">Commit Changes</button>
          </div>
       </motion.div>
    </div>
  );
}
