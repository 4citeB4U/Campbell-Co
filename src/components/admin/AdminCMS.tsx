/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_CMS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminCMS.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminCMS.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  Eye, 
  Type, 
  Palette, 
  Layout, 
  Settings as SettingsIcon,
  ChevronRight,
  Monitor,
  Smartphone,
  Undo2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useSiteContent, saveSiteContent } from '../../hooks/useSiteContent';
import { SiteContent } from '../../content/siteContent';

export function AdminCMS() {
  const { content, loading } = useSiteContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [activePanel, setActivePanel] = useState<'content' | 'style' | 'layout'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (content && !draft) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [content, draft]);

  const updateDraft = (path: string, value: any) => {
    if (!draft) return;
    const newDraft = { ...draft };
    const parts = path.split('.');
    let current: any = newDraft;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setDraft(newDraft);
    setHasChanges(true);
    setStatus('UNSAVED CHANGES');
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveSiteContent(draft);
      setHasChanges(false);
      setStatus('PUBLISHED TO LIVE SITE');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus('SAVE FAILED');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !draft) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-gold border-t-transparent animate-spin rounded-full" />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#111] border border-white/5 p-4 rounded-sm shrink-0">
         <div className="flex items-center gap-6">
            <h3 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40">Visual Editor</h3>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-4">
               <button onClick={() => setPreviewMode('desktop')} className={`p-2 transition-all ${previewMode === 'desktop' ? 'text-gold' : 'text-white/20'}`}><Monitor size={16} /></button>
               <button onClick={() => setPreviewMode('mobile')} className={`p-2 transition-all ${previewMode === 'mobile' ? 'text-gold' : 'text-white/20'}`}><Smartphone size={16} /></button>
            </div>
         </div>
         
         <div className="flex items-center gap-6">
            {status && (
               <span className={`text-[8px] uppercase tracking-widest font-black ${status.includes('UNSAVED') ? 'text-yellow-500' : 'text-green-500'}`}>
                  {status}
               </span>
            )}
            <button 
              disabled={!hasChanges || saving}
              onClick={handleSave}
              className={`px-6 py-2 text-[9px] uppercase tracking-[0.3em] font-black transition-all flex items-center gap-3 ${
                hasChanges ? 'bg-gold text-black-pure hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
               {saving ? <div className="w-3 h-3 border-2 border-black-pure border-t-transparent animate-spin rounded-full" /> : <Save size={12} />}
               {saving ? 'Publishing...' : 'Publish Live'}
            </button>
         </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
         
         {/* Control Sidebar */}
         <aside className="w-80 flex flex-col bg-[#111] border border-white/5 rounded-sm overflow-hidden shrink-0">
            <div className="flex border-b border-white/5">
               <button onClick={() => setActivePanel('content')} className={`flex-1 py-4 text-[8px] uppercase tracking-widest font-black transition-all ${activePanel === 'content' ? 'bg-white/5 text-gold' : 'text-white/20 hover:text-white'}`}>Content</button>
               <button onClick={() => setActivePanel('style')} className={`flex-1 py-4 text-[8px] uppercase tracking-widest font-black transition-all ${activePanel === 'style' ? 'bg-white/5 text-gold' : 'text-white/20 hover:text-white'}`}>Design</button>
               <button onClick={() => setActivePanel('layout')} className={`flex-1 py-4 text-[8px] uppercase tracking-widest font-black transition-all ${activePanel === 'layout' ? 'bg-white/5 text-gold' : 'text-white/20 hover:text-white'}`}>Layout</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
               <AnimatePresence mode="wait">
                  {activePanel === 'content' && (
                    <motion.div 
                      key="content"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                       <CMSSubSection title="Hero Section">
                          <CMSTextField label="Hero Heading" value={draft.home.hero.titleLineOne} onChange={v => updateDraft('home.hero.titleLineOne', v)} />
                          <CMSTextField label="Hero Subtext" value={draft.home.hero.body} onChange={v => updateDraft('home.hero.body', v)} />
                          <CMSTextField label="CTA Label" value={draft.home.hero.primaryCta.label} onChange={v => updateDraft('home.hero.primaryCta.label', v)} />
                       </CMSSubSection>

                       <CMSSubSection title="About Page">
                          <CMSTextField label="About Heading" value={draft.pages.about.title} onChange={v => updateDraft('pages.about.title', v)} />
                          <CMSTextArea label="About Body" value={draft.pages.about.body} onChange={v => updateDraft('pages.about.body', v)} />
                       </CMSSubSection>
                    </motion.div>
                  )}

                  {activePanel === 'style' && (
                    <motion.div 
                      key="style"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                    >
                       <CMSSubSection title="Brand Identity">
                          <div className="space-y-3">
                             <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Primary Brand Color</label>
                             <div className="flex gap-4">
                                <input 
                                  type="color" 
                                  value={draft.theme.primaryColor} 
                                  onChange={e => updateDraft('theme.primaryColor', e.target.value)}
                                  className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                                />
                                <input 
                                  type="text"
                                  value={draft.theme.primaryColor}
                                  onChange={e => updateDraft('theme.primaryColor', e.target.value)}
                                  className="flex-1 bg-white/5 border border-white/5 px-4 text-[10px] text-white/60 font-mono"
                                />
                             </div>
                          </div>

                          <div className="space-y-3">
                             <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Heading Font</label>
                             <select 
                               value={draft.theme.headingFont}
                               onChange={e => updateDraft('theme.headingFont', e.target.value)}
                               className="w-full bg-white/5 border border-white/5 p-4 text-[10px] uppercase tracking-widest text-white focus:outline-none"
                             >
                                <option value="Playfair Display">Playfair Display (Luxury)</option>
                                <option value="Cormorant Garamond">Cormorant Garamond (Elegant)</option>
                                <option value="Cinzel">Cinzel (Romanesque)</option>
                                <option value="Outfit">Outfit (Modern)</option>
                             </select>
                          </div>
                       </CMSSubSection>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </aside>

         {/* Visual Preview */}
         <main className="flex-1 bg-[#050505] border border-white/5 rounded-sm relative overflow-hidden flex flex-col">
            <div className="p-3 border-b border-white/5 bg-[#111] flex items-center justify-between shrink-0">
               <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                  <div className="w-2 h-2 rounded-full bg-green-500/20" />
               </div>
               <span className="text-[8px] uppercase tracking-[0.4em] font-black text-white/20">LIVE PREVIEW CLONE</span>
               <div className="w-10" />
            </div>
            
            <div className="flex-1 bg-black-pure overflow-hidden p-6 lg:p-12">
               <div className={`mx-auto h-full border border-white/5 bg-[#0a0a0a] transition-all duration-700 shadow-2xl ${
                  previewMode === 'mobile' ? 'max-w-[375px]' : 'w-full'
               }`}>
                  <div className="h-full overflow-y-auto custom-scrollbar relative">
                     {/* Simulated Storefront Header */}
                     <header className="p-8 flex justify-between items-center border-b border-white/5">
                        <span className="font-serif text-xl tracking-[0.2em]" style={{ color: draft.theme.primaryColor }}>CAMPBELL <span className="text-gold">&</span> CO.</span>
                        <div className="flex gap-4 opacity-20">
                           <div className="w-4 h-4 rounded-full border border-white" />
                           <div className="w-4 h-4 rounded-full border border-white" />
                        </div>
                     </header>

                     {/* Simulated Hero */}
                     <section className="p-12 space-y-8 min-h-[400px] flex flex-col justify-center text-center">
                        <h1 className="text-4xl uppercase tracking-[0.3em] font-serif leading-tight" style={{ fontFamily: draft.theme.headingFont }}>
                           {draft.home.hero.titleLineOne}
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 leading-relaxed max-w-sm mx-auto">
                           {draft.home.hero.body}
                        </p>
                        <button className="mx-auto px-10 py-4 text-[9px] uppercase tracking-[0.4em] font-black" style={{ backgroundColor: draft.theme.primaryColor, color: '#000' }}>
                           {draft.home.hero.primaryCta.label}
                        </button>
                     </section>

                     {/* Overlay Indicator */}
                     <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="px-4 py-2 bg-gold/10 border border-gold/20 backdrop-blur-md rounded-full">
                           <span className="text-[8px] uppercase tracking-widest text-gold font-black">Visual Preview Mode</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>

      </div>
    </div>
  );
}

function CMSSubSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-5">
       <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/60 flex items-center gap-4">
          {title}
          <div className="h-px flex-1 bg-white/5" />
       </h4>
       <div className="space-y-6">
          {children}
       </div>
    </div>
  );
}

function CMSTextField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
       <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
       <input 
         type="text" 
         value={value}
         onChange={e => onChange(e.target.value)}
         className="w-full bg-white/5 border border-white/5 p-3 text-[11px] text-white focus:border-gold outline-none transition-all"
       />
    </div>
  );
}

function CMSTextArea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
       <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
       <textarea 
         value={value}
         onChange={e => onChange(e.target.value)}
         rows={4}
         className="w-full bg-white/5 border border-white/5 p-3 text-[11px] text-white focus:border-gold outline-none transition-all leading-relaxed"
       />
    </div>
  );
}
