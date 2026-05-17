/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#4D4DFF
FLUO=#3333FF
PASTEL=#B3B3FF

ICON_ASCII:
family=lucide
glyph=book-open

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI.ADMIN
TAG: UI.ADMIN.MANUAL
DESCRIPTION: Printable and exportable governed Owner Manual view.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = OwnerManual.tsx
WHY = Comprehensive instruction manual for owner per LAW-0001
WHO = UI Runtime
WHERE = src/components/admin/OwnerManual.tsx
WHEN = 2026-05-17
HOW = Renders registry-driven manual, troubleshooting, and Markdown export

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import React from 'react';
import { BookOpen, Printer, Download, ShieldCheck, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import {
  LeeWayOwnerManualRegistry,
  LEEWAY_OWNER_MANUAL_VERSION,
  ManualSection,
} from '../../core/leeway/LeeWayOwnerManualRegistry';
import { LeeWayTroubleshootingRegistry, LeeWayTroubleshootingItem } from '../../core/leeway/LeeWayTroubleshootingRegistry';

function buildTroubleshootingMarkdown(issue: LeeWayTroubleshootingItem) {
  const symptoms = issue.symptoms.map((symptom) => `- ${symptom}`).join('\n');
  const likelyCauses = issue.likelyCauses.map((cause) => `- ${cause}`).join('\n');
  const fixSteps = issue.fixSteps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  const escalation = issue.escalationMessage
    ? `Developer escalation required: ${issue.escalationMessage}`
    : 'Developer escalation required: No';

  return `### ${issue.title}

- Issue ID: ${issue.issueId}
- Severity: ${issue.severity}
- Owner can fix: ${issue.canOwnerFix ? 'Yes' : 'No'}
- Ask this agent first: ${issue.relatedAgents.join(', ') || 'agent-lee-prime'}
- Related screens: ${issue.relatedScreens.join(', ') || 'not-listed'}
- Related laws: ${issue.relatedLawIds.join(', ') || 'not-listed'}
- Related MCPs: ${issue.relatedMcpIds.join(', ') || 'not-listed'}
- Printable: true

Symptoms:
${symptoms}

Likely causes:
${likelyCauses}

How to fix:
${fixSteps}

${escalation}
`;
}

function buildSectionMarkdown(section: ManualSection) {
  return `## ${section.title}

- Section ID: ${section.sectionId}
- Screen ID: ${section.screenId}
- Workflow ID: ${section.workflowId}
- Owner Agent: ${section.ownerAgent}
- Law IDs: ${section.lawReferences.join(', ')}
- Printable: ${section.printable ? 'true' : 'false'}

${section.content}
`;
}

function buildManualMarkdown() {
  const today = new Date().toISOString().slice(0, 10);
  const toc = LeeWayOwnerManualRegistry.map((section) => `- [${section.title}](#${section.sectionId})`).join('\n');
  const sectionMarkdown = LeeWayOwnerManualRegistry.map((section) => buildSectionMarkdown(section)).join('\n');
  const troubleshooting = LeeWayTroubleshootingRegistry.map((issue) => buildTroubleshootingMarkdown(issue)).join('\n');

  return `# Campbell & Co. Owner Manual

- Version: ${LEEWAY_OWNER_MANUAL_VERSION}
- Export Date: ${today}
- Printable Metadata: true

## Table of Contents

${toc}
- [Troubleshooting Guide](#troubleshooting)

${sectionMarkdown}

## Troubleshooting Guide

${troubleshooting}`;
}

function TroubleshootingCard({ issue }: { issue: LeeWayTroubleshootingItem }) {
  return (
    <div key={issue.issueId} className="border border-stone-200 rounded-2xl p-6 bg-stone-50 break-inside-avoid">
      <h4 className="font-bold text-stone-900 mb-4 uppercase tracking-widest text-xs flex items-center justify-between">
        {issue.title}
        <span className={`px-2 py-1 rounded text-[9px] ${issue.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
          {issue.severity.toUpperCase()}
        </span>
      </h4>
      <div className="grid gap-6">
        <div>
          <strong className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Symptoms</strong>
          <ul className="text-sm text-stone-600 list-disc pl-4 space-y-1">
            {issue.symptoms.map((symptom) => <li key={`${issue.issueId}-${symptom}`}>{symptom}</li>)}
          </ul>
        </div>
        <div>
          <strong className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Likely Causes</strong>
          <ul className="text-sm text-stone-600 list-disc pl-4 space-y-1">
            {issue.likelyCauses.map((cause) => <li key={`${issue.issueId}-${cause}`}>{cause}</li>)}
          </ul>
        </div>
        <div>
          <strong className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">How To Fix</strong>
          <ul className="text-sm text-stone-600 space-y-2">
            {issue.fixSteps.map((step) => (
              <li key={`${issue.issueId}-${step}`} className="flex gap-2">
                <ChevronRight size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 md:grid-cols-3 text-xs">
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <strong className="block uppercase tracking-widest text-stone-400 text-[10px]">Owner Can Fix</strong>
            <p className="mt-2 text-stone-700">{issue.canOwnerFix ? 'Yes, follow the owner-safe steps listed here.' : 'No, review the escalation guidance below.'}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <strong className="block uppercase tracking-widest text-stone-400 text-[10px]">Ask This Agent First</strong>
            <p className="mt-2 text-stone-700">{issue.relatedAgents.join(', ') || 'agent-lee-prime'}</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <strong className="block uppercase tracking-widest text-stone-400 text-[10px]">Developer Escalation Required</strong>
            <p className="mt-2 text-stone-700">{issue.escalationMessage ?? 'No escalation is required if the owner-safe steps resolve the problem.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OwnerManual() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([buildManualMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'campbell-adminos-owner-manual.md';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-8" data-leeway-id="admin.manual.view">
      <div className="flex items-center justify-between border-b border-stone-200 pb-6 print:hidden">
        <div>
          <h2 className="text-xl font-serif uppercase tracking-wider text-stone-900">Instruction Manual</h2>
          <p className="mt-2 text-xs font-black uppercase tracking-widest text-stone-500">LeeWay Governed Documentation</p>
          <p className="mt-2 text-[11px] text-stone-500">Version {LEEWAY_OWNER_MANUAL_VERSION} | Export date {exportDate}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-xs font-black uppercase tracking-widest text-stone-600 hover:bg-stone-50">
            <Download size={14} /> Download MD
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm">
            <Printer size={14} /> Print Manual
          </button>
        </div>
      </div>

      <div className="print:block" id="printable-manual">
        <div className="hidden print:block mb-8 border-b-2 border-stone-900 pb-4">
          <h1 className="text-3xl font-serif uppercase tracking-widest">Campbell & Co. AdminOS</h1>
          <p className="text-sm font-black uppercase tracking-widest mt-2 text-stone-500">Official Owner Instruction Manual</p>
          <p className="text-xs font-mono text-stone-400 mt-2">Version {LEEWAY_OWNER_MANUAL_VERSION} | Export Date {exportDate}</p>
        </div>

        <div className="mb-12 p-6 border border-stone-200 bg-stone-50 rounded-2xl break-inside-avoid">
          <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-stone-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm text-stone-700 font-medium">
            {LeeWayOwnerManualRegistry.map((section) => (
              <li key={`toc-${section.sectionId}`}>
                <a href={`#${section.sectionId}`} className="hover:text-amber-600 transition-colors flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-stone-200 text-[10px] flex items-center justify-center font-bold text-stone-600">{section.title.charAt(0)}</span>
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#troubleshooting" className="hover:text-amber-600 transition-colors flex items-center gap-2 mt-4 pt-2 border-t border-stone-200">
                <span className="w-4 h-4 rounded-full bg-rose-100 text-[10px] flex items-center justify-center font-bold text-rose-600">?</span>
                Troubleshooting Guide
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-12">
          {LeeWayOwnerManualRegistry.map((section) => (
            <section key={section.sectionId} id={section.sectionId} className="break-inside-avoid scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={18} className="text-amber-600" />
                <h3 className="text-lg font-black uppercase tracking-wider text-stone-900">{section.title}</h3>
              </div>
              <div className="prose prose-sm prose-stone max-w-none text-stone-600 leading-relaxed font-serif whitespace-pre-wrap">
                {section.content}
              </div>
              <div className="mt-4 grid gap-3 border-t border-stone-100 pt-4 text-[10px] font-mono text-stone-400 print:text-stone-500 md:grid-cols-2">
                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Laws: {section.lawReferences.join(', ')}</span>
                <span className="flex items-center gap-1"><FileText size={12} /> Section ID: {section.sectionId}</span>
                <span>Screen ID: {section.screenId}</span>
                <span>Workflow ID: {section.workflowId}</span>
                <span>Owner Agent: {section.ownerAgent}</span>
                <span>Printable: {section.printable ? 'true' : 'false'}</span>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-stone-200 break-before-page" id="troubleshooting">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle size={24} className="text-rose-600" />
            <h3 className="text-xl font-black uppercase tracking-wider text-stone-900">Troubleshooting Guide</h3>
          </div>
          <div className="grid gap-6">
            {LeeWayTroubleshootingRegistry.map((issue) => (
              <TroubleshootingCard key={issue.issueId} issue={issue} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
