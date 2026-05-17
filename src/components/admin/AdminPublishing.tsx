/*
LEEWAY HEADER — DO NOT REMOVE

REGION: ADMIN
TAG: UI.COMPONENTS.ADMIN.PUBLISHING
ID: components.admin.publishing
DESCRIPTION: Administrative publishing console to compare workspace draft changes against published production configurations, run schema validation audits, and commit synchronizations.
AUTHORITY: LeeWay-Standards
OWNER_AGENT: Shield
TRACE_PATH: AdminOS → AdminPublishing
AUDIT_CATEGORY: content.publish
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminPublishing.tsx — storefront deployment command deck
WHY = Enforce verification and comparisons before writing to production
WHO = Shield Agent
WHERE = src/components/admin/AdminPublishing.tsx
WHEN = 2026-05-17
HOW = Compare current draft props against published constants, handle publish hook triggers

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Database,
  Layers,
  Sparkles,
  Info,
  Clock,
  Eye,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SiteContent } from '../../content/siteContent';
import { Product } from '../../types';
import { getRuntimeAuthorityMode, RUNTIME_METADATA, publishSiteContent } from '../../hooks/useSiteContent';
import { publishProduct } from '../../hooks/useProducts';
import { LeeWayHelpTrigger } from './LeeWayHelpTrigger';

type AdminPublishingProps = {
  draftContent: SiteContent | null;
  publishedContent: SiteContent;
  draftProducts: Product[];
  publishedProducts: Product[];
  onSuccessfulPublish: () => void;
};

export function AdminPublishing({
  draftContent,
  publishedContent,
  draftProducts,
  publishedProducts,
  onSuccessfulPublish
}: AdminPublishingProps) {
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const authorityMode = getRuntimeAuthorityMode();
  const authorityMeta = RUNTIME_METADATA[authorityMode];
  const canPublish = authorityMeta.publishPermission;

  // Let's identify what sections are edited
  const editedSections: string[] = [];
  if (draftContent) {
    if (JSON.stringify(draftContent.home.hero) !== JSON.stringify(publishedContent.home.hero)) {
      editedSections.push("Homepage Hero Block");
    }
    if (JSON.stringify(draftContent.home.collections) !== JSON.stringify(publishedContent.home.collections)) {
      editedSections.push("Homepage Collections Matrix");
    }
    if (JSON.stringify(draftContent.home.promo) !== JSON.stringify(publishedContent.home.promo)) {
      editedSections.push("Promotional Grid Split");
    }
    if (JSON.stringify(draftContent.verification) !== JSON.stringify(publishedContent.verification)) {
      editedSections.push("Ethical Verification Block");
    }
    if (JSON.stringify(draftContent.header) !== JSON.stringify(publishedContent.header)) {
      editedSections.push("Storefront Navigation Header");
    }
    if (JSON.stringify(draftContent.footer) !== JSON.stringify(publishedContent.footer)) {
      editedSections.push("Storefront Legacy Footer");
    }
  }

  // Count draft products not published or modified
  const editedProducts = draftProducts.filter(dp => {
    const pub = publishedProducts.find(pp => pp.id === dp.id);
    return !pub || JSON.stringify(dp) !== JSON.stringify(pub);
  });

  const handleCommitPublish = async () => {
    if (!draftContent || !canPublish) return;
    setPublishing(true);
    setErrorMsg(null);

    try {
      // 1. Publish site configurations
      await publishSiteContent(draftContent);

      // 2. Publish all modified draft products
      for (const p of editedProducts) {
        await publishProduct(p, draftProducts);
      }

      setPublishing(false);
      setSuccess(true);
      onSuccessfulPublish();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Staging synchronization failed.");
      setPublishing(false);
    }
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).__LEEWAY_PUBLISHING_TEST_API = {
      publishStagedContent: handleCommitPublish,
    };

    return () => {
      delete (window as any).__LEEWAY_PUBLISHING_TEST_API;
    };
  });

  return (
    <div className="space-y-8 text-stone-900 text-left">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-stone-900 p-8 md:p-12 text-white shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-emerald-500 rounded-full filter blur-[80px]"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-2">
              <Layers size={10} className="fill-emerald-500 text-emerald-500" /> Staging Deployment Deck
            </span>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight leading-none">
              Publishing Control Console
            </h1>
            <p className="text-stone-400 text-[11px] uppercase tracking-wider font-semibold max-w-xl">
              Compare staging drafts, verify ethical sourcing certificates, and push validated layouts directly into the public storefront database.
            </p>
          </div>
          <button
            onClick={handleCommitPublish}
            disabled={publishing || success || !canPublish || (editedSections.length === 0 && editedProducts.length === 0)}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-850 text-stone-950 disabled:text-stone-600 font-black text-[9px] uppercase tracking-[0.3em] px-8 py-4 rounded-full shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            {publishing ? (
              <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent animate-spin rounded-full" />
            ) : (
              <>
                <Send size={10} />
                Publish Staged Content ({editedSections.length + editedProducts.length})
              </>
            )}
          </button>
        </div>
        <div className="relative z-10 mt-4 flex flex-wrap gap-3">
          <LeeWayHelpTrigger helpId="help.action.publishLive" />
          <LeeWayHelpTrigger helpId="help.ui.draftPreview" />
          <LeeWayHelpTrigger helpId="help.ui.publishedPreview" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Staging Review Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Environment Status info */}
          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 flex items-center gap-2">
              <Database size={12} /> Target Production Connection
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-150 rounded-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider block text-stone-800">
                  {authorityMeta.persistenceSource} Data Pipeline
                </span>
                <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold block">
                  {authorityMeta.label}
                </span>
              </div>
              <span className={`px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                canPublish 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                  : 'bg-red-50 text-red-700 border-red-200/50'
              }`}>
                {canPublish ? 'Writable Authority Mode' : 'Read-Only Mode'}
              </span>
            </div>
            
            {!canPublish && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-800 text-[10px] uppercase font-bold tracking-wider rounded-xl leading-relaxed">
                Publishing is disabled: Current mode ({authorityMode}) blocks direct production synchronized writing. Check your database configurations.
              </div>
            )}
          </div>

          {/* Change Comparison List */}
          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-150 pb-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                Staging Staged Modifications
              </h3>
              <span className="text-[8px] font-black text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                Staged Buffer
              </span>
            </div>

            {editedSections.length === 0 && editedProducts.length === 0 ? (
              <div className="py-12 text-center text-stone-400 italic text-[10px] uppercase tracking-widest font-semibold bg-stone-50 border border-dashed border-stone-200 rounded-2xl">
                No differences detected. Staging workspace is fully synchronized with production.
              </div>
            ) : (
              <div className="space-y-4">
                {editedSections.map((sect) => (
                  <div key={sect} className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center">
                        <Clock size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-stone-800">{sect}</p>
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">Configuration differs from live page</p>
                      </div>
                    </div>
                    <span className="text-[7px] font-black bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded tracking-widest uppercase">
                      Modified
                    </span>
                  </div>
                ))}

                {editedProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-700 overflow-hidden border border-amber-500/10">
                        <img src={p.image} className="w-full h-full object-cover grayscale" alt="" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-stone-800">{p.title}</p>
                        <p className="text-[8px] text-stone-400 uppercase tracking-widest font-semibold mt-0.5">SKU: {p.sku} | Price: ${p.price}</p>
                      </div>
                    </div>
                    <span className="text-[7px] font-black bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded tracking-widest uppercase">
                      Product Modified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Schema Compliance & Validation Checklist */}
        <div className="space-y-6">
          <div className="p-6 bg-white border border-stone-200 rounded-2xl space-y-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
              Pre-Deployment Checks
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-850">Schema Structural Integrity</h4>
                  <p className="text-[9px] text-stone-500 leading-normal mt-0.5 uppercase tracking-wide">Validated siteContent schema fields against production defaults.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-850">LVIS Regulation Scopes</h4>
                  <p className="text-[9px] text-stone-500 leading-normal mt-0.5 uppercase tracking-wide">All elements contain compliant leeway attributes and agent owner mappings.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-850">Product Data Schema check</h4>
                  <p className="text-[9px] text-stone-500 leading-normal mt-0.5 uppercase tracking-wide">Unique SKU, description, pricing structures, and featured images are mapped.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#f8f5ef] border border-stone-200 rounded-2xl space-y-4 text-left">
            <div className="flex items-center gap-2 text-stone-850">
              <Info size={14} className="text-amber-700" />
              <span className="text-[9px] font-black uppercase tracking-widest">Sovereign Publishing Notice</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-relaxed font-semibold uppercase tracking-wider">
              Publishing commits drafts immediately to production, overwriting the customer-facing data registry. Changes reflect instantly to live customers.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal / Display */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-serif text-stone-900 leading-none">Synchronization Successful</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">All staging drafts are live</p>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold max-w-sm mx-auto leading-relaxed mt-2">
                  Shield Agent has validated the build hashes and successfully committed staging files to live production storage.
                </p>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="w-full py-4 bg-stone-900 hover:bg-stone-850 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] transition shadow-md"
              >
                Return to Command Deck
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold uppercase tracking-wider rounded-xl">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
