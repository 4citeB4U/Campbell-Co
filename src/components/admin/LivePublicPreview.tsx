/*
LEEWAY HEADER — DO NOT REMOVE

REGION: ADMIN
TAG: UI.COMPONENTS.ADMIN.LIVE_PUBLIC_PREVIEW
ID: components.admin.live-public-preview
DESCRIPTION: The Live Public Storefront Preview panel for AdminOS, providing real storefront rendering, multi-device viewports, click-to-edit interactions, and visual inspection.
AUTHORITY: LeeWay-Standards
OWNER_AGENT: Lee Prime
TRACE_PATH: AdminOS → LivePublicPreview
AUDIT_CATEGORY: standards.validation
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = LivePublicPreview.tsx — true storefront projection and visual inspector
WHY = Enable real-time storefront tracking and interactive click-to-edit governance
WHO = Lee Prime
WHERE = src/components/admin/LivePublicPreview.tsx
WHEN = 2026-05-17
HOW = MemoryRouter wraps CustomerSite, click listeners intercept leeway ids, shared context overrides data

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect, useRef } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Edit3, 
  HelpCircle, 
  Sparkles, 
  CheckCircle,
  Database,
  ArrowRight,
  User,
  Zap,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CustomerSite from '../../apps/CustomerSite';
import { ProductExperienceProvider } from '../../context/ProductExperienceContext';
import { CartProvider } from '../../context/CartContext';
import { SiteContentContext, getRuntimeAuthorityMode, RUNTIME_METADATA } from '../../hooks/useSiteContent';
import { ProductContext, useProducts, useDraftProducts } from '../../hooks/useProducts';
import { SiteContent } from '../../content/siteContent';
import { Product } from '../../types';
import { PREVIEW_CONTROL_REGISTRY, getBindingForLeewayId, PreviewControlBinding } from '../../core/leeway/PreviewControlRegistry';
import { REGISTERED_MEDIA_ASSETS, RegisteredMediaAsset } from '../../data/registeredMediaAssets';
import { LeeWayHelpTrigger } from './LeeWayHelpTrigger';

// Route listener to keep track of the internal router location
function RouteListener({ onChange }: { onChange: (path: string) => void }) {
  const location = useLocation();
  useEffect(() => {
    onChange(location.pathname);
  }, [location, onChange]);
  return null;
}

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
type PreviewMode = 'draft' | 'published';

type LivePublicPreviewProps = {
  // Shared state
  draftContent: SiteContent | null;
  onUpdateDraftContent: (content: SiteContent) => void;
  publishedContent: SiteContent;
  draftProducts: Product[];
  publishedProducts: Product[];
  
  // Navigation / Integration
  onNavigateToModule: (module: string, panel: string) => void;
  onRequestProposal: (section: PreviewControlBinding, request: string, selectedMediaAsset?: RegisteredMediaAsset) => void;
  
  // Layout control
  isExpanded: boolean;
  onToggleExpand: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export function LivePublicPreview({
  draftContent,
  onUpdateDraftContent,
  publishedContent,
  draftProducts,
  publishedProducts,
  onNavigateToModule,
  onRequestProposal,
  isExpanded,
  onToggleExpand,
  isCollapsed,
  onToggleCollapse
}: LivePublicPreviewProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [mode, setMode] = useState<PreviewMode>('draft');
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<PreviewControlBinding | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'inspect' | 'ai'>('inspect');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [selectedMediaAssetId, setSelectedMediaAssetId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const sandboxRef = useRef<HTMLDivElement>(null);
  const authorityMode = getRuntimeAuthorityMode();
  const authorityMeta = RUNTIME_METADATA[authorityMode];

  // Map of routes for the selector dropdown
  const previewRoutes = [
    { label: 'Home Page', path: '/' },
    { label: 'Jewelry Shop', path: '/shop' },
    { label: 'Diamond Guide', path: '/diamonds' },
    { label: 'Secure Checkout', path: '/checkout' },
    { label: 'Flexible Payments', path: '/payments' },
    { label: 'Our Heritage (About)', path: '/about' },
    { label: 'Client FAQ', path: '/faq' },
    { label: 'Concierge Contact', path: '/contact' },
    { label: 'The Journal', path: '/journal' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  // Determine active content and products based on selected mode
  const activeContent = mode === 'draft' ? (draftContent || publishedContent) : publishedContent;
  const activeProducts = mode === 'draft' ? draftProducts : publishedProducts;

  // Global click interceptor to capture click events on elements with [data-leeway-id]
  const handlePreviewClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const leewayElement = target.closest('[data-leeway-id]');
    
    if (leewayElement) {
      e.preventDefault();
      e.stopPropagation();

      // Clear previous outline highlights
      const sandbox = sandboxRef.current;
      if (sandbox) {
        sandbox.querySelectorAll('[data-leeway-id]').forEach(el => {
          el.classList.remove('leeway-active-select');
        });
      }

      // Highlight clicked element
      leewayElement.classList.add('leeway-active-select');

      const leewayId = leewayElement.getAttribute('data-leeway-id') || '';
      const binding = getBindingForLeewayId(leewayId);

      if (binding) {
        setSelectedSection(binding);
      } else {
        // Fallback dynamic binding
        setSelectedSection({
          leewayId,
          label: leewayElement.getAttribute('data-leeway-tag') || leewayId,
          ownerAgent: (leewayElement.getAttribute('data-owner-agent') as any) || 'Lee Prime',
          publicComponent: 'Unknown Component',
          schemaPath: leewayElement.getAttribute('data-schema-path') || undefined,
          adminModule: 'site-control',
          adminPanel: 'identity',
          auditCategory: 'standards.custom',
          editableFields: []
        });
      }
      setInspectorTab('inspect');
    }
  };

  // Synchronize CSS class for selected element on selection changes
  useEffect(() => {
    const sandbox = sandboxRef.current;
    if (!sandbox) return;

    // Clear previous outlines
    sandbox.querySelectorAll('[data-leeway-id]').forEach(el => {
      el.classList.remove('leeway-active-select');
    });

    if (selectedSection) {
      const activeEl = sandbox.querySelector(`[data-leeway-id="${selectedSection.leewayId}"]`);
      if (activeEl) {
        activeEl.classList.add('leeway-active-select');
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedSection, currentRoute, refreshKey]);

  const handleFieldChange = (schemaPath: string, value: any) => {
    if (!draftContent) return;
    const updated = JSON.parse(JSON.stringify(draftContent));
    
    // Update nested property using path
    const keys = schemaPath.split('.');
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onUpdateDraftContent(updated);
  };

  const getFieldValue = (schemaPath: string): string => {
    if (!activeContent) return '';
    try {
      const keys = schemaPath.split('.');
      let current: any = activeContent;
      for (const key of keys) {
        current = current[key];
      }
      return typeof current === 'string' ? current : JSON.stringify(current);
    } catch {
      return '';
    }
  };

  const triggerProposalPreview = () => {
    if (!selectedSection) return;
    const selectedMediaAsset = selectedMediaAssetId
      ? REGISTERED_MEDIA_ASSETS.find((asset) => asset.id === selectedMediaAssetId)
      : undefined;
    onRequestProposal(selectedSection, aiPrompt, selectedMediaAsset);
    setAiStatus('Proposal requested. Review diagnostics and before/after values in the governed proposal modal.');
  };

  const allowedMediaAssets = selectedSection
    ? REGISTERED_MEDIA_ASSETS.filter((asset) => asset.usagePermissions.includes(selectedSection.leewayId))
    : [];

  useEffect(() => {
    setSelectedMediaAssetId('');
    setAiStatus(null);
    setAiPrompt('');
  }, [selectedSection?.leewayId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).__LEEWAY_PREVIEW_TEST_API = {
      selectRegion: (leewayId: string) => {
        const binding = getBindingForLeewayId(leewayId);
        if (binding) {
          setSelectedSection(binding);
          return true;
        }
        return false;
      },
      openAiTab: () => setInspectorTab('ai'),
      openFieldsTab: () => setInspectorTab('inspect'),
      setPrompt: (value: string) => setAiPrompt(value),
      setMediaAssetId: (value: string) => setSelectedMediaAssetId(value),
      setPreviewMode: (value: PreviewMode) => setMode(value),
      getPreviewMode: () => mode,
      getSelectedRegion: () => selectedSection?.leewayId || null,
      getSelectedOwnerAgent: () => selectedSection?.ownerAgent || null,
      getSelectedMediaAssetId: () => selectedMediaAssetId,
      getSelectedSectionSnapshot: () => selectedSection ? ({
        leewayId: selectedSection.leewayId,
        schemaPaths: selectedSection.editableFields.map((field) => field.schemaPath),
        ownerAgent: selectedSection.ownerAgent,
        allowedActions: ['proposal.preview', 'draft.apply', 'proposal.reject'],
        auditCategory: selectedSection.auditCategory,
      }) : null,
      getHeroSnapshot: () => ({
        mode,
        image: activeContent.home.hero.image,
        imageAlt: activeContent.home.hero.imageAlt,
      }),
      getInspectorText: () => document.body.innerText,
      submitAgentRequest: (prompt: string, mediaAssetId?: string) => {
        if (!selectedSection) return false;
        const asset = mediaAssetId ? REGISTERED_MEDIA_ASSETS.find((entry) => entry.id === mediaAssetId) : undefined;
        setAiPrompt(prompt);
        setSelectedMediaAssetId(mediaAssetId || '');
        onRequestProposal(selectedSection, prompt, asset);
        setAiStatus('Proposal requested. Review diagnostics and before/after values in the governed proposal modal.');
        return true;
      },
      triggerProposalPreview,
    };

    return () => {
      delete (window as any).__LEEWAY_PREVIEW_TEST_API;
    };
  }, [activeContent, mode, selectedMediaAssetId, selectedSection, triggerProposalPreview]);

  // Helper styles for preview iframe simulation
  const deviceWidths = {
    desktop: 'w-full max-w-[1400px]',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  if (isCollapsed) return null;

  return (
    <div
      data-leeway-id="admin.preview.panel"
      data-leeway-screen-id="ADMIN_PORTAL"
      data-leeway-workflow-id="workflow.onboarding.first_launch"
      data-leeway-owner-agent="aura-media-agent"
      className={`border-l border-stone-200 bg-[#fbf9f6] flex flex-col shrink-0 transition-all duration-500 overflow-hidden z-40 ${
      isFullscreen ? 'fixed inset-0 w-screen h-screen' : isExpanded ? 'w-[75%] lg:w-[65%]' : 'w-[45%] xl:w-[40%]'
    }`}
    >
      {/* 1. Header Toolbar */}
      <div className="h-16 px-6 border-b border-stone-200 bg-[#f8f5ef] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
            <Eye size={16} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-900">Live Storefront Projection</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`h-1.5 w-1.5 rounded-full ${mode === 'draft' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-[8px] uppercase tracking-wider font-bold text-stone-400">
                {mode === 'draft' ? 'Draft Sandbox' : 'Published Production'}
              </span>
            </div>
          </div>
          <LeeWayHelpTrigger helpId="help.ui.openLivePreview" />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-stone-200/60 rounded-full p-0.5 flex gap-0.5 shadow-inner">
            <button
              onClick={() => setMode('draft')}
              className={`rounded-full px-3.5 py-1.5 text-[8px] font-black uppercase tracking-wider transition-all ${
                mode === 'draft' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setMode('published')}
              className={`rounded-full px-3.5 py-1.5 text-[8px] font-black uppercase tracking-wider transition-all ${
                mode === 'published' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Live
            </button>
          </div>
          <LeeWayHelpTrigger helpId={mode === 'draft' ? 'help.ui.draftPreview' : 'help.ui.publishedPreview'} label={mode === 'draft' ? 'Draft Preview' : 'Published Preview'} />

          {/* Route Dropdown Selector */}
          <div className="relative group">
            <select
              value={currentRoute}
              onChange={(e) => setCurrentRoute(e.target.value)}
              className="bg-white border border-stone-200 text-[8px] font-black uppercase tracking-widest pl-3 pr-8 py-2 rounded-lg outline-none cursor-pointer appearance-none text-stone-700 shadow-sm font-sans"
            >
              {previewRoutes.map(r => (
                <option key={r.path} value={r.path}>{r.label}</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>

          {/* Device Selection */}
          <div className="border-l border-stone-250 h-5" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition ${device === 'desktop' ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Desktop View"
            >
              <Monitor size={14} />
            </button>
            <button 
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg transition ${device === 'tablet' ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Tablet View"
            >
              <Tablet size={14} />
            </button>
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition ${device === 'mobile' ? 'bg-stone-200 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
              title="Mobile View"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Action buttons */}
          <div className="border-l border-stone-250 h-5" />
          <button 
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition"
            title="Refresh Projection DOM"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={() => {
              if (isFullscreen) {
                setIsFullscreen(false);
              } else {
                onToggleExpand();
              }
            }}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition"
            title={isExpanded ? "Restore panel size" : "Expand panel"}
          >
            <Maximize2 size={14} />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={onToggleCollapse}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition"
            title="Hide panel"
          >
            <EyeOff size={14} />
          </button>
        </div>
      </div>

      {/* 2. Authority banner */}
      <div className="shrink-0">
        {mode === 'draft' ? (
          <div className="bg-amber-500/10 border-b border-amber-500/25 px-6 py-2.5 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-700">
                DRAFT PREVIEW — Not public yet. Staging changes in local admin buffer.
              </p>
            </div>
            <span className="text-[7px] font-black bg-amber-500/20 px-2 py-0.5 rounded text-amber-800 tracking-wider">
              {authorityMode}
            </span>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border-b border-emerald-500/25 px-6 py-2.5 flex items-center justify-between text-left">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-700">
                PUBLISHED LIVE VIEW — Customer-facing state. Showing production repository details.
              </p>
            </div>
            <span className="text-[7px] font-black bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-800 tracking-wider">
              {authorityMode === 'DEVELOPMENT_BOOTSTRAP' ? 'STAGING_ENVIRONMENT' : 'PRODUCTION_ENVIRONMENT'}
            </span>
          </div>
        )}
      </div>

      {/* 3. Main Split Area: Left=Storefront Canvas, Right=Inspector Panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Storefront Interactive Canvas */}
        <div className="flex-1 overflow-auto bg-stone-900 flex justify-center items-start p-6 custom-scrollbar relative">
          <style>{`
            /* Inject interactive leeway selection styles inside projection DOM */
            .projection-canvas [data-leeway-id] {
              transition: all 0.2s ease-in-out;
              position: relative !important;
              cursor: pointer !important;
            }
            .projection-canvas [data-leeway-id]:hover {
              outline: 2px dashed #e6c15c !important;
              outline-offset: -2px;
            }
            .projection-canvas [data-leeway-id].leeway-active-select {
              outline: 3px solid #39ff14 !important;
              outline-offset: -3px;
              box-shadow: 0 0 35px rgba(57,255,20,0.55) !important;
              z-index: 50 !important;
            }
          `}</style>
          
          <div 
            ref={sandboxRef}
            onClick={handlePreviewClick}
            className={`projection-canvas bg-black-pure overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 border border-white/5 ${deviceWidths[device]}`}
          >
            {/* The actual customer site rendered directly in this provider context */}
            <SiteContentContext.Provider value={{ content: activeContent, loading: false }}>
              <ProductContext.Provider value={{ products: activeProducts, loading: false }}>
                <MemoryRouter initialEntries={[currentRoute]} key={currentRoute + refreshKey + mode}>
                  <CartProvider>
                    <ProductExperienceProvider>
                      <RouteListener onChange={setCurrentRoute} />
                      <CustomerSite />
                    </ProductExperienceProvider>
                  </CartProvider>
                </MemoryRouter>
              </ProductContext.Provider>
            </SiteContentContext.Provider>
          </div>
        </div>

        {/* Right Side: Visual Section Inspector Panel */}
        <AnimatePresence>
          {selectedSection && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 border-l border-stone-200 bg-white flex flex-col shrink-0 shadow-xl z-20 text-left"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-150 bg-stone-50 flex items-center justify-between">
                <div>
                  <span className="text-[7px] font-black uppercase tracking-[0.25em] bg-stone-200 px-2 py-0.5 rounded text-stone-500">
                    LEEWAY ID: {selectedSection.leewayId}
                  </span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 mt-1.5 truncate max-w-[200px]">
                    {selectedSection.label}
                  </h4>
                </div>
                <button 
                  onClick={() => setSelectedSection(null)}
                  className="text-stone-400 hover:text-stone-700 text-[10px] font-bold uppercase tracking-widest"
                >
                  Close
                </button>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-stone-150 bg-stone-50/50 shrink-0">
                <button
                  onClick={() => setInspectorTab('inspect')}
                  className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest text-center border-b-2 transition ${
                    inspectorTab === 'inspect' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  Fields
                </button>
                <button
                  onClick={() => setInspectorTab('ai')}
                  className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
                    inspectorTab === 'ai' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <Sparkles size={10} />
                  AI Agent
                </button>
              </div>

              {/* Inspector Content Viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
                {inspectorTab === 'inspect' ? (
                  <div className="space-y-5">
                    {/* Metadata summary */}
                    <div data-leeway-id="admin.selected-region.panel" className="p-4 rounded-xl bg-stone-50 border border-stone-150 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Governing Agent:</span>
                        <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1">
                          <User size={8} /> {selectedSection.ownerAgent}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Public Component:</span>
                        <span className="text-[8px] font-mono text-stone-600 truncate max-w-[150px]" title={selectedSection.publicComponent}>
                          {selectedSection.publicComponent.split('/').pop()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Audit Category:</span>
                        <span className="text-[8px] font-black text-stone-500 uppercase tracking-wider">
                          {selectedSection.auditCategory}
                        </span>
                      </div>
                      <div className="space-y-1 pt-1">
                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest block">Selected Schema Paths:</span>
                        <p className="text-[9px] text-stone-600 leading-relaxed">
                          {selectedSection.editableFields.map((field) => field.schemaPath).join(', ')}
                        </p>
                      </div>
                      <div className="space-y-1 pt-1">
                        <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest block">Allowed Actions:</span>
                        <p className="text-[9px] text-stone-600 leading-relaxed">
                          proposal.preview, draft.apply, proposal.reject
                        </p>
                      </div>
                    </div>

                    {/* Quick Edit Fields */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Quick Fields</span>
                        <span className="text-[7px] text-amber-600 font-black uppercase tracking-widest">Draft Staging Active</span>
                      </div>

                      {selectedSection.editableFields.length === 0 ? (
                        <div className="py-4 text-center text-stone-400 italic text-[9px] uppercase tracking-widest bg-stone-50 border border-dashed border-stone-200 rounded-xl">
                          No direct editable fields registered.
                        </div>
                      ) : (
                        selectedSection.editableFields.map(field => {
                          const val = getFieldValue(field.schemaPath);

                          return (
                            <div key={field.fieldId} className="space-y-2">
                              <label className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">
                                {field.label}
                              </label>
                              {field.inputType === 'textarea' ? (
                                <textarea
                                  disabled={mode !== 'draft'}
                                  value={val}
                                  onChange={(e) => handleFieldChange(field.schemaPath, e.target.value)}
                                  rows={4}
                                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-[10px] outline-none tracking-wide leading-relaxed focus:bg-white focus:border-stone-400 disabled:opacity-55"
                                />
                              ) : (
                                <input
                                  type="text"
                                  disabled={mode !== 'draft'}
                                  value={val}
                                  onChange={(e) => handleFieldChange(field.schemaPath, e.target.value)}
                                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-[10px] outline-none focus:bg-white focus:border-stone-400 disabled:opacity-55"
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 text-left">
                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                      <div className="flex items-center gap-2 text-amber-800">
                        <Sparkles size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {selectedSection.ownerAgent} Agent Core
                        </span>
                      </div>
                      <p className="text-[10px] text-amber-700/80 leading-relaxed font-semibold">
                        Hello Avion. I govern this {selectedSection.label} segment. Tell me how you'd like to refine this block's narrative, tone, color style, or engagement.
                      </p>
                    </div>

                    <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-stone-500">Diagnostic Checklist</p>
                      <ul className="space-y-1 text-[10px] text-stone-600">
                        <li>Selected LeeWay ID captured: {selectedSection.leewayId}</li>
                        <li>Selected schema paths: {selectedSection.editableFields.map((field) => field.schemaPath).join(', ')}</li>
                        <li>Allowed actions: proposal.preview, draft.apply, proposal.reject</li>
                        <li>Runtime mode: {authorityMode}</li>
                        <li>Manual publish still required after draft approval.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">
                        Agent Prompt Instructions
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g. rewrite this hero description to sound more royal and emphasize blockchain diamonds..."
                        rows={3}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-[10px] outline-none focus:bg-white focus:border-stone-400"
                      />
                    </div>

                    {allowedMediaAssets.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">
                          Optional Registered Media Asset
                        </label>
                        <select
                          value={selectedMediaAssetId}
                          onChange={(e) => setSelectedMediaAssetId(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-[10px] outline-none focus:bg-white focus:border-stone-400"
                        >
                          <option value="">No asset selected</option>
                          {allowedMediaAssets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.title} ({asset.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      onClick={triggerProposalPreview}
                      className="w-full py-3 bg-stone-900 hover:bg-amber-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Zap size={10} />
                      Preview Proposal
                    </button>
                    <LeeWayHelpTrigger helpId="help.action.previewProposal" label="Ask Agents" />

                    {aiStatus && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3"
                      >
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Proposal Ready For Review</span>
                        </div>
                        <p className="text-[9px] font-mono text-stone-700 bg-white p-2.5 border border-stone-150 rounded leading-relaxed whitespace-pre-wrap">
                          {aiStatus}
                        </p>
                        <p className="text-[8px] text-stone-400 italic">
                          No draft mutation has happened yet. Apply only through the proposal modal if the before/after values look correct.
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions Footer */}
              <div className="p-4 border-t border-stone-150 bg-stone-50 space-y-2 shrink-0">
                <div className="flex gap-2">
                  <LeeWayHelpTrigger helpId="help.ui.viewTrace" label="View Trace" className="flex-1 justify-center" />
                  <LeeWayHelpTrigger helpId="help.ui.inspectAgent" label="Inspect Agent" className="flex-1 justify-center" />
                </div>
                <button
                  onClick={() => onNavigateToModule(selectedSection.adminModule, selectedSection.adminPanel)}
                  className="w-full py-3.5 bg-amber-600 hover:bg-stone-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Edit3 size={11} />
                  Open Admin CMS Panel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
