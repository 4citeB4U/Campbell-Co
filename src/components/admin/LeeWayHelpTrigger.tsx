/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFDE59
FLUO=#FFD12A
PASTEL=#FFF2CC

ICON_ASCII:
family=lucide
glyph=help-circle

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI.ADMIN
TAG: UI.ADMIN.HELP_TRIGGER
DESCRIPTION: Reusable contextual help trigger bound to LeeWayHelpRegistry items.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = LeeWayHelpTrigger.tsx
WHY = Surface contextual help from real owner controls
WHO = UI Runtime
WHERE = src/components/admin/LeeWayHelpTrigger.tsx
WHEN = 2026-05-17
HOW = Button trigger plus fixed help drawer driven by LeeWayHelpRegistry

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import React, { useMemo, useState } from 'react';
import { HelpCircle, X, FileText, ShieldCheck, AlertTriangle, Workflow, Hash } from 'lucide-react';
import { getHelpItem } from '../../core/leeway/LeeWayHelpRegistry';
import { getManualSection } from '../../core/leeway/LeeWayOwnerManualRegistry';
import { getTroubleshootingItem } from '../../core/leeway/LeeWayTroubleshootingRegistry';

type LeeWayHelpTriggerProps = {
  helpId: string;
  label?: string;
  className?: string;
};

export function LeeWayHelpTrigger({ helpId, label = '', className = '' }: LeeWayHelpTriggerProps) {
  const [open, setOpen] = useState(false);
  const helpItem = useMemo(() => getHelpItem(helpId), [helpId]);
  const manualSection = useMemo(() => (helpItem ? getManualSection(helpItem.manualSectionId) : undefined), [helpItem]);
  const troubleshootingItems = useMemo(
    () => helpItem?.troubleshootingIds.map((id) => getTroubleshootingItem(id)).filter(Boolean) ?? [],
    [helpItem],
  );

  if (!helpItem) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-leeway-help-id={helpId}
        title={label || 'Help Information'}
        className={`inline-flex items-center justify-center gap-1 rounded-full border border-stone-200 bg-white p-2 text-stone-500 transition hover:border-amber-300 hover:text-amber-700 ${className}`}
      >
        <HelpCircle size={14} />
        {label && <span className="text-[10px] font-black uppercase tracking-widest px-1">{label}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[650] flex items-center justify-center bg-stone-950/45 p-4">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-6 py-5">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-700">LeeWay Contextual Help</p>
                <h3 className="text-lg font-serif uppercase tracking-[0.12em] text-stone-900">{helpItem.title}</h3>
                <p className="text-sm text-stone-600">{helpItem.summary}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-stone-200 p-2 text-stone-500 hover:text-stone-900">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6 text-sm text-stone-700">
              <section className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">What this does</p>
                <p className="mt-2 leading-relaxed">{helpItem.body}</p>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
                    <FileText size={12} />
                    Related Manual Section
                  </p>
                  <p className="mt-2 font-semibold text-stone-900">{manualSection?.title ?? helpItem.manualSectionId}</p>
                  <p className="mt-1 text-xs text-stone-500">Section ID: {helpItem.manualSectionId}</p>
                </div>
                <div className="rounded-2xl border border-stone-200 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
                    <ShieldCheck size={12} />
                    What Happens Next
                  </p>
                  <p className="mt-2 text-sm text-stone-700">
                    Review the guidance, compare draft and published impact, and only then continue with the governed action.
                  </p>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
                    <Workflow size={12} />
                    Traceability
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p>Help ID: {helpItem.helpId}</p>
                    <p>Screen ID: {helpItem.screenId}</p>
                    <p>Workflow ID: {helpItem.workflowId ?? 'not-applicable'}</p>
                    <p>Action ID: {helpItem.actionId ?? 'not-applicable'}</p>
                    <p>Owner Agent: {helpItem.ownerAgent}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-stone-200 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
                    <Hash size={12} />
                    Governing Laws
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {helpItem.lawReferences.map((law) => (
                      <span key={law} className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800">
                        {law}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {troubleshootingItems.length > 0 && (
                <section className="rounded-2xl border border-stone-200 p-4">
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
                    <AlertTriangle size={12} />
                    Troubleshooting Links
                  </p>
                  <div className="mt-3 space-y-3">
                    {troubleshootingItems.map((item) => (
                      <div key={item!.issueId} className="rounded-xl bg-stone-50 p-3">
                        <p className="font-semibold text-stone-900">{item!.title}</p>
                        <p className="mt-1 text-xs text-stone-600">Ask this agent first: {item!.relatedAgents.join(', ') || 'agent-lee-prime'}</p>
                        {item!.escalationMessage && (
                          <p className="mt-2 text-xs font-semibold text-rose-700">Developer escalation required: {item!.escalationMessage}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
