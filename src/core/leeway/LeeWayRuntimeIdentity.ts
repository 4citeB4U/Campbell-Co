/*
LEEWAY HEADER - DO NOT REMOVE

REGION: CORE.LEEWAY
TAG: CORE.LEEWAY.RUNTIME_IDENTITY.MAIN
DESCRIPTION: Structured LeeWay identity ledger for agent runtime actions, telemetry, audit events, diagnostics, proposals, and draft patches.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections

5WH:
WHAT = LeeWayRuntimeIdentity.ts - runtime identity contracts and in-memory ledger
WHY = Ensure every agent runtime object is LeeWay-named, classified, tagged, owned, traceable, and auditable
WHO = Leeway Innovations
WHERE = src/core/leeway/LeeWayRuntimeIdentity.ts
WHEN = 2026-05-17
HOW = TypeScript identity types plus structured runtime ledger helpers

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

AGENTS:
ASSESS
ALIGN
AUDIT

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type LeeWayRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type LeeWayAgentActionIdentity = {
  actionId: string;
  actionLabel: string;
  actionTag: string;
  agentId: string;
  agentRoleId: string;
  agentDisplayName: string;
  ownerAgent: string;
  skillId: string;
  workflowId: string;
  screenId: string;
  selectedLeewayId?: string;
  selectedSchemaPath?: string;
  selectedMediaId?: string;
  runtimeAuthorityMode: string;
  lawReferences: string[];
  capabilityIds: string[];
  telemetryStreamId: string;
  auditCategory: string;
  riskLevel: LeeWayRiskLevel;
  requiresHumanApproval: boolean;
  publishDirectly: false;
  tracePath: string[];
};

export type LeeWayAgentRuntimeState = {
  runtimeId: string;
  agentId: string;
  agentRoleId: string;
  agentDisplayName: string;
  status:
    | 'idle'
    | 'diagnosing'
    | 'proposal-ready'
    | 'awaiting-approval'
    | 'applying-draft'
    | 'blocked'
    | 'completed'
    | 'failed';
  currentSkillId?: string;
  currentWorkflowId?: string;
  currentActionId?: string;
  currentScreenId?: string;
  currentSelectedLeewayId?: string;
  currentTelemetryStreamId?: string;
  currentAuditEventId?: string;
  runtimeAuthorityMode: string;
  mcpIdsUsed: string[];
  toolIdsUsed: string[];
  blockedReason?: string;
  startedAt?: string;
  updatedAt: string;
};

export type LeeWaySkillRouteIdentity = {
  routeId: string;
  skillId: string;
  confidence: number;
  matchedTriggerPhrase: string;
  assignedAgents: string[];
  ownerAgent: string;
  workflowId: string;
  telemetryStreamId: string;
  auditCategory: string;
  selectedLeewayId?: string;
  runtimeAuthorityMode: string;
  blockedCapabilities: string[];
  lawReferences: string[];
};

export type LeeWayDiagnosticIdentity = {
  diagnosticId: string;
  checkId: string;
  skillId: string;
  agentId: string;
  selectedLeewayId?: string;
  schemaPath?: string;
  status: 'pass' | 'fail' | 'warning' | 'blocked';
  evidence: string;
  lawReferences: string[];
  telemetryEventId: string;
  auditCategory: string;
  suggestedProposalAction?: string;
};

export type LeeWayProposalIdentity = {
  proposalId: string;
  proposalTag: string;
  skillId: string;
  actionId: string;
  workflowId: string;
  agentId: string;
  selectedLeewayId?: string;
  selectedSchemaPath?: string;
  selectedMediaId?: string;
  beforeValues: Array<{ fieldPath: string; value: unknown }>;
  afterValues: Array<{ fieldPath: string; value: unknown }>;
  visibleImpact: string;
  diagnosticsUsed: string[];
  lawReferences: string[];
  capabilityIds: string[];
  telemetryStreamId: string;
  auditCategory: string;
  requiresHumanApproval: true;
  publishDirectly: false;
  tracePath: string[];
};

export type LeeWayDraftPatchIdentity = {
  patchId: string;
  proposalId: string;
  skillId: string;
  actionId: string;
  agentId: string;
  affectedFieldPaths: string[];
  beforeAfterSnapshot: Array<{ fieldPath: string; before: unknown; after: unknown }>;
  validationResult: 'pending' | 'passed' | 'failed';
  runtimeAuthorityMode: string;
  auditEventId: string;
  telemetryEventId: string;
  timestamp: string;
};

export type LeeWayTelemetryEvent = {
  eventId: string;
  streamId: string;
  eventType: string;
  agentId: string;
  skillId: string;
  workflowId: string;
  actionId: string;
  selectedLeewayId?: string;
  screenId: string;
  runtimeAuthorityMode: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  tracePath: string[];
};

export type LeeWayAuditEvent = {
  auditEventId: string;
  actionId: string;
  agentId: string;
  ownerApprovalStatus: 'not-required' | 'awaiting-approval' | 'approved' | 'rejected' | 'blocked';
  beforeAfter?: Array<{ fieldPath: string; before: unknown; after: unknown }>;
  timestamp: string;
  lawReferences: string[];
  riskLevel: LeeWayRiskLevel;
  auditCategory: string;
  message: string;
};

export type LeeWayToolUsageRecord = {
  usageId: string;
  actionId: string;
  toolId: string;
  mcpId: string;
  connectionState: 'connected' | 'disconnected' | 'not-configured';
  permissionState: 'allowed' | 'blocked';
  result: 'used' | 'not-used' | 'blocked' | 'dependency-declared';
  blockedReason?: string;
};

type RuntimeLedger = {
  runtimeStates: LeeWayAgentRuntimeState[];
  telemetryEvents: LeeWayTelemetryEvent[];
  auditEvents: LeeWayAuditEvent[];
  draftPatches: LeeWayDraftPatchIdentity[];
  toolUsageRecords: LeeWayToolUsageRecord[];
};

const runtimeLedger: RuntimeLedger = {
  runtimeStates: [],
  telemetryEvents: [],
  auditEvents: [],
  draftPatches: [],
  toolUsageRecords: [],
};

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function createLeeWayIdentityId(prefix: string) {
  return nextId(prefix);
}

export function upsertRuntimeState(state: LeeWayAgentRuntimeState) {
  const existingIndex = runtimeLedger.runtimeStates.findIndex((entry) => entry.runtimeId === state.runtimeId);
  if (existingIndex >= 0) {
    runtimeLedger.runtimeStates[existingIndex] = state;
  } else {
    runtimeLedger.runtimeStates.unshift(state);
  }
  return state;
}

export function recordLeeWayTelemetryEvent(event: LeeWayTelemetryEvent) {
  runtimeLedger.telemetryEvents.unshift(event);
  return event;
}

export function recordLeeWayAuditEvent(event: LeeWayAuditEvent) {
  runtimeLedger.auditEvents.unshift(event);
  return event;
}

export function recordLeeWayDraftPatch(patch: LeeWayDraftPatchIdentity) {
  runtimeLedger.draftPatches.unshift(patch);
  return patch;
}

export function recordLeeWayToolUsage(record: LeeWayToolUsageRecord) {
  runtimeLedger.toolUsageRecords.unshift(record);
  return record;
}

export function getLeeWayRuntimeStates() {
  return [...runtimeLedger.runtimeStates];
}

export function getLeeWayTelemetryEvents() {
  return [...runtimeLedger.telemetryEvents];
}

export function getLeeWayAuditEvents() {
  return [...runtimeLedger.auditEvents];
}

export function getLeeWayDraftPatches() {
  return [...runtimeLedger.draftPatches];
}

export function getLeeWayToolUsageRecords() {
  return [...runtimeLedger.toolUsageRecords];
}
