/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF3131
FLUO=#FF5757
PASTEL=#FF9191

ICON_ASCII:
family=lucide
glyph=shield-check

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.LEEWAY.AGENT_PROPOSAL.MAIN
DESCRIPTION: Governed agent proposal type and template registry under LAW-0005 (Proposal-Before-Mutation).
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = LeeWayAgentProposal.ts — structured proposal contracts for all agent task mutations
WHY = LAW-0005 mandates every agent mutation must be proposed and explicitly approved by the owner before draft application
WHO = Lee Prime / Shield
WHERE = src/core/leeway/LeeWayAgentProposal.ts
WHEN = 2026-05-17
HOW = TypeScript type definitions + governed proposal template builder

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { getRuntimeAuthorityMode } from '../../hooks/useSiteContent';
import { SiteContent } from '../../content/siteContent';
import { PreviewControlBinding } from './PreviewControlRegistry';

// ─── GOVERNED PROPOSAL TYPE ─────────────────────────────────────────────────
// LAW-0005: Proposal-Before-Mutation
// LAW-0001: Human Sovereignty
// LAW-0010: Immutable System IDs
// LAW-0011: Audit Trail Ledger

export type LeeWayProposedChange = {
  fieldPath: string;
  label: string;
  before: string | number | boolean | string[] | null;
  after: string | number | boolean | string[] | null;
  reason: string;
};

export type LeeWayAgentProposal = {
  proposalId: string;
  proposalTag?: string;
  agentId: string;
  agentLabel: string;
  taskId: string;
  taskTitle: string;
  selectedLeewayId?: string;
  selectedSchemaPath?: string;
  selectedSchemaPaths?: string[];
  selectedMediaId?: string;
  routedSkillId?: string;
  workflowId: string;
  actionId: string;
  telemetryStreamId: string;
  auditCategory: string;
  runtimeMode: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lawReferences: string[];
  capabilityIds?: string[];
  diagnosticsUsed?: string[];
  visibleImpact?: string;
  tracePath?: string[];
  proposedChanges: LeeWayProposedChange[];
  publishDirectly: false;
  requiresHumanApproval: true;
  status: 'preview' | 'approved' | 'rejected' | 'applied';
  createdAt: string;
};

// ─── TELEMETRY EVENT TYPES ───────────────────────────────────────────────────

export type LeeWayProposalEvent =
  | 'AGENT_PROPOSAL_CREATED'
  | 'AGENT_PROPOSAL_APPROVED'
  | 'AGENT_PROPOSAL_REJECTED'
  | 'DRAFT_EDIT_APPLIED';

export type LeeWayProposalTelemetryEntry = {
  event: LeeWayProposalEvent;
  proposalId: string;
  agentId: string;
  taskId: string;
  timestamp: string;
  note?: string;
};

// ─── ID GENERATOR ───────────────────────────────────────────────────────────

function generateProposalId(agentId: string, taskId: string): string {
  const ts = Date.now().toString(36).toUpperCase();
  const ag = agentId.split('-')[0].toUpperCase();
  return `PROP-${ag}-${taskId.toUpperCase()}-${ts}`;
}

// ─── PROPOSAL TEMPLATES ─────────────────────────────────────────────────────
// Each task ID maps to a builder function that reads current draft state
// and returns a structured proposal WITHOUT applying any mutation.

export function createProposalForTask(
  agentId: string,
  agentLabel: string,
  taskId: string,
  draftContent: SiteContent | null
): LeeWayAgentProposal | null {

  const runtimeMode = getRuntimeAuthorityMode();
  const proposalId = generateProposalId(agentId, taskId);
  const createdAt = new Date().toISOString();

  switch (taskId) {

    case 'aura-1':
      return {
        proposalId,
        agentId,
        agentLabel,
        taskId,
        taskTitle: 'Luxury Brand Voice — Hero Block Rewrite',
        selectedLeewayId: 'public.home.hero',
        workflowId: 'workflow.content.hero.rewrite',
        actionId: 'action.draft.hero.update',
        telemetryStreamId: 'stream.aura.content',
        auditCategory: 'content.hero',
        runtimeMode,
        riskLevel: 'low',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0009', 'LAW-0011'],
        proposedChanges: [
          {
            fieldPath: 'home.hero.eyebrow',
            label: 'Hero Eyebrow',
            before: draftContent?.home.hero.eyebrow ?? null,
            after: 'MEMENTO VIVERE',
            reason: 'Elevate brand voice to Latin luxury positioning consistent with premium jewellery houses.',
          },
          {
            fieldPath: 'home.hero.titleLineOne',
            label: 'Hero Title Line 1',
            before: draftContent?.home.hero.titleLineOne ?? null,
            after: 'SOVEREIGN ACQUISITIONS',
            reason: 'Reinforce collector identity and ownership narrative.',
          },
          {
            fieldPath: 'home.hero.titleLineTwo',
            label: 'Hero Title Line 2',
            before: draftContent?.home.hero.titleLineTwo ?? null,
            after: 'Rare Lab Grown Diamonds',
            reason: 'Clarify the product category for new visitors while maintaining premium language.',
          },
          {
            fieldPath: 'home.hero.body',
            label: 'Hero Body Copy',
            before: draftContent?.home.hero.body ?? null,
            after: 'CURATED EXCLUSIVELY FOR DISCERNING COLLECTORS. CAMPBELL & CO. COMBINES BLOCKCHAIN TRANSPARENCY WITH IMPECCABLE HEIRLOOM CRAFTSMANSHIP.',
            reason: 'Align body copy to luxury-collector tone, emphasizing transparency credentials.',
          },
        ],
        publishDirectly: false,
        requiresHumanApproval: true,
        status: 'preview',
        createdAt,
      };

    case 'nova-1':
      return {
        proposalId,
        agentId,
        agentLabel,
        taskId,
        taskTitle: 'Promotional Feature Block — Vault Narrative',
        selectedLeewayId: 'public.home.promo',
        workflowId: 'workflow.content.promo.update',
        actionId: 'action.draft.promo.update',
        telemetryStreamId: 'stream.nova.content',
        auditCategory: 'content.promo',
        runtimeMode,
        riskLevel: 'low',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0009', 'LAW-0011'],
        proposedChanges: [
          {
            fieldPath: 'home.promo.feature.eyebrow',
            label: 'Promo Eyebrow',
            before: draftContent?.home.promo.feature.eyebrow ?? null,
            after: 'COLLECTOR ACQUISITIONS PROTOCOL',
            reason: 'Position the promotional section as a governed acquisition program, not a sale.',
          },
          {
            fieldPath: 'home.promo.feature.title',
            label: 'Promo Title',
            before: draftContent?.home.promo.feature.title ?? null,
            after: 'THE VERITAS STANDARD',
            reason: 'Name the authentication standard to build trust with high-value buyers.',
          },
          {
            fieldPath: 'home.promo.feature.body',
            label: 'Promo Body',
            before: draftContent?.home.promo.feature.body ?? null,
            after: 'ALL ACQUIRED DIAMONDS ARE CRYPTOGRAPHICALLY SECURED IN OUR VAULT UNDER LEEWAY COMPLIANCE PROTOCOLS.',
            reason: 'Reinforce blockchain-based certification credentials in the promotional block.',
          },
        ],
        publishDirectly: false,
        requiresHumanApproval: true,
        status: 'preview',
        createdAt,
      };

    case 'prime-1':
      return {
        proposalId,
        agentId,
        agentLabel,
        taskId,
        taskTitle: 'Ethical Verification Block — Compliance Attestation',
        selectedLeewayId: 'public.verification',
        workflowId: 'workflow.standards.source.inspect',
        actionId: 'action.draft.verification.update',
        telemetryStreamId: 'stream.prime.standards',
        auditCategory: 'standards.validation',
        runtimeMode,
        riskLevel: 'medium',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0006', 'LAW-0011', 'LAW-0016'],
        proposedChanges: [
          {
            fieldPath: 'verification.eyebrow',
            label: 'Verification Eyebrow',
            before: draftContent?.verification.eyebrow ?? null,
            after: 'LEEWAY CERTIFIED 100% COMPLIANT',
            reason: 'Surface the LeeWay governance certification to public visitors.',
          },
          {
            fieldPath: 'verification.title',
            label: 'Verification Title',
            before: draftContent?.verification.title ?? null,
            after: 'SOVEREIGN SYSTEM RUNTIME',
            reason: 'Assert operational integrity and system trustworthiness.',
          },
          {
            fieldPath: 'verification.body',
            label: 'Verification Body',
            before: draftContent?.verification.body ?? null,
            after: 'ALL CORE SYSTEMS PASSED VERITAS AUDIT RUNTIME WITHOUT ANOMALIES.',
            reason: 'Provide public audit attestation to build buyer confidence.',
          },
        ],
        publishDirectly: false,
        requiresHumanApproval: true,
        status: 'preview',
        createdAt,
      };

    case 'shield-1':
      return {
        proposalId,
        agentId,
        agentLabel,
        taskId,
        taskTitle: 'Header Trust Badges — Security Positioning',
        selectedLeewayId: 'public.header',
        workflowId: 'workflow.content.header.update',
        actionId: 'action.draft.header.benefits.update',
        telemetryStreamId: 'stream.shield.security',
        auditCategory: 'security.content',
        runtimeMode,
        riskLevel: 'low',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0007', 'LAW-0011'],
        proposedChanges: [
          {
            fieldPath: 'header.benefits',
            label: 'Header Benefit Badges',
            before: draftContent?.header.benefits ?? null,
            after: ['INSURED EXPRESS SHIPPING', 'GIA VERITAS ACCREDITED', 'LEEWAY CONSTITUTIONAL TRUST'],
            reason: 'Replace generic badges with GIA-accredited and LeeWay-certified trust signals.',
          },
        ],
        publishDirectly: false,
        requiresHumanApproval: true,
        status: 'preview',
        createdAt,
      };

    case 'atlas-1':
      return {
        proposalId,
        agentId,
        agentLabel,
        taskId,
        taskTitle: 'Search Placeholder — Vault Discovery Language',
        selectedLeewayId: 'public.header.search',
        workflowId: 'workflow.content.header.update',
        actionId: 'action.draft.header.search.update',
        telemetryStreamId: 'stream.atlas.integrations',
        auditCategory: 'content.header',
        runtimeMode,
        riskLevel: 'low',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0009', 'LAW-0011'],
        proposedChanges: [
          {
            fieldPath: 'header.searchPlaceholder',
            label: 'Search Placeholder Text',
            before: draftContent?.header.searchPlaceholder ?? null,
            after: 'QUERY VAULT ID OR SPECIFICATION...',
            reason: 'Shift search language from generic to vault-discovery terminology aligned with collector UX.',
          },
        ],
        publishDirectly: false,
        requiresHumanApproval: true,
        status: 'preview',
        createdAt,
      };

    default:
      return null;
  }
}

export function createSelectedAreaProposal(
  agentId: string,
  agentLabel: string,
  selectedSection: PreviewControlBinding,
  request: string,
  draftContent: SiteContent | null,
): LeeWayAgentProposal | null {
  const runtimeMode = getRuntimeAuthorityMode();
  const safeTaskId = `preview-${selectedSection.leewayId.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  const proposalId = generateProposalId(agentId, safeTaskId);
  const createdAt = new Date().toISOString();
  const normalizedRequest = request.trim() || `Refine ${selectedSection.label}`;
  const textField = selectedSection.editableFields.find((field) => field.inputType === 'text' || field.inputType === 'textarea');
  const imageField = selectedSection.editableFields.find((field) => field.inputType === 'image');

  if (!textField && !imageField) {
    return null;
  }

  const proposedChanges: LeeWayProposedChange[] = [];

  if (imageField && /image|photo|picture|hero image|replace image/i.test(normalizedRequest)) {
    const imageBefore = readFieldValue(draftContent, imageField.schemaPath);
    proposedChanges.push({
      fieldPath: imageField.schemaPath,
      label: imageField.label,
      before: imageBefore,
      after: '/images/owner-selected-placeholder.jpg',
      reason: `Owner requested a media-oriented change for ${selectedSection.label}. Review the draft path before applying.`,
    });
  }

  if (textField) {
    const before = readFieldValue(draftContent, textField.schemaPath);
    proposedChanges.push({
      fieldPath: textField.schemaPath,
      label: textField.label,
      before,
      after: `${String(before ?? '').trim()} ${normalizedRequest}`.trim(),
      reason: `Owner requested: "${normalizedRequest}". Review the governed text update before applying.`,
    });
  }

  return {
    proposalId,
    agentId,
    agentLabel,
    taskId: safeTaskId,
    taskTitle: `Selected Area Update - ${selectedSection.label}`,
    selectedLeewayId: selectedSection.leewayId,
    workflowId: 'workflow.preview.selected_area.agent_request',
    actionId: 'action.preview.proposal.request',
    telemetryStreamId: `stream.preview.${selectedSection.ownerAgent.toLowerCase().replace(/\s+/g, '-')}`,
    auditCategory: selectedSection.auditCategory,
    runtimeMode,
    riskLevel: 'low',
    lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0016'],
    proposedChanges,
    publishDirectly: false,
    requiresHumanApproval: true,
    status: 'preview',
    createdAt,
  };
}

function readFieldValue(draftContent: SiteContent | null, fieldPath: string) {
  if (!draftContent) {
    return null;
  }

  try {
    return fieldPath.split('.').reduce<any>((current, key) => current?.[key], draftContent) ?? null;
  } catch {
    return null;
  }
}

// ─── TELEMETRY RECORDER ─────────────────────────────────────────────────────

const _telemetryLog: LeeWayProposalTelemetryEntry[] = [];

export function recordProposalTelemetry(
  event: LeeWayProposalEvent,
  proposal: Pick<LeeWayAgentProposal, 'proposalId' | 'agentId' | 'taskId'>,
  note?: string
): LeeWayProposalTelemetryEntry {
  const entry: LeeWayProposalTelemetryEntry = {
    event,
    proposalId: proposal.proposalId,
    agentId: proposal.agentId,
    taskId: proposal.taskId,
    timestamp: new Date().toISOString(),
    note,
  };
  _telemetryLog.push(entry);
  return entry;
}

export function getProposalTelemetryLog(): LeeWayProposalTelemetryEntry[] {
  return [..._telemetryLog];
}
