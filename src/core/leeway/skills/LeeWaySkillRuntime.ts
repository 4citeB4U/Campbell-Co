/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.RUNTIME
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

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = LeeWaySkillRuntime.ts
WHY = Core runtime orchestrator for agent skills
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWaySkillRuntime.ts
WHEN = 2026-05-17
HOW = TypeScript runtime
*/

import { SiteContent } from '../../../content/siteContent';
import { RegisteredMediaAsset } from '../../../data/registeredMediaAssets';
import { LEEWAY_AGENT_ROSTER } from '../LeeWayAgentRegistry';
import { LEEWAY_CAPABILITY_REGISTRY } from '../LeeWayAgentCapabilityRegistry';
import { LeeWayAgentSkillProcessRegistry } from '../LeeWayAgentSkillProcessRegistry';
import {
  LeeWayAgentActionIdentity,
  LeeWayAgentRuntimeState,
  LeeWayAuditEvent,
  LeeWayDiagnosticIdentity,
  LeeWayDraftPatchIdentity,
  LeeWayProposalIdentity,
  LeeWaySkillRouteIdentity,
  LeeWayTelemetryEvent,
  LeeWayToolUsageRecord,
  createLeeWayIdentityId,
  recordLeeWayAuditEvent,
  recordLeeWayTelemetryEvent,
  recordLeeWayToolUsage,
  upsertRuntimeState,
} from '../LeeWayRuntimeIdentity';

export type LeeWaySkillRequest = {
  requestId: string;
  ownerText: string;
  selectedLeewayId?: string;
  selectedScreenId?: string;
  selectedSchemaPath?: string;
  selectedSchemaPaths?: string[];
  selectedAdminControlPath?: string;
  selectedMediaFields?: string[];
  selectedStyleFields?: string[];
  selectedLayoutFields?: string[];
  selectedAllowedActions?: string[];
  selectedOwnerAgent?: string;
  selectedAuditCategory?: string;
  selectedProductId?: string;
  selectedMediaId?: string;
  mediaContext?: RegisteredMediaAsset;
  draftContent?: SiteContent | null;
  publishedContent?: SiteContent | null;
  runtimeMode: string;
  createdAt: string;
};

export type LeeWaySkillRoute = {
  skillId: string;
  confidence: number;
  assignedAgents: string[];
  requiredEvidence: string[];
  draftPatchPossible: boolean;
  codePatchPossible: boolean;
  blockedCapabilities: string[];
  matchedTriggerPhrase: string;
  ownerAgentId: string;
  workflowId: string;
  telemetryStreamId: string;
  auditCategory: string;
  lawReferences: string[];
};

export type LeeWaySkillEvidence = {
  sourceId: string;
  status: 'AVAILABLE' | 'SOURCE_UNAVAILABLE' | 'MCP_NOT_CONNECTED' | 'CONFIGURATION_BLOCKED' | 'MANUAL_CONTEXT_REQUIRED';
  data: any;
};

export type LeeWaySkillDiagnosticResult = {
  checkId: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'blocked';
  evidence: string;
  affectedLeewayId?: string;
  schemaPath?: string;
  suggestedFix?: string;
  ownerAgentId: string;
};

export type LeeWaySkillProposalResult = {
  proposalType: 'LeeWayAgentProposal' | 'LeeWayCodePatchProposal';
  proposal: any;
  proposalIdentity?: LeeWayProposalIdentity;
};

export type LeeWaySkillRuntimeResult = {
  requestId: string;
  skillId: string;
  runtimeId: string;
  actionIdentity: LeeWayAgentActionIdentity;
  runtimeState: LeeWayAgentRuntimeState;
  route: LeeWaySkillRoute;
  routeIdentity: LeeWaySkillRouteIdentity;
  evidence: LeeWaySkillEvidence[];
  diagnostics: LeeWayDiagnosticIdentity[];
  proposalIdentity?: LeeWayProposalIdentity;
  draftPatchIdentity?: LeeWayDraftPatchIdentity;
  toolUsageRecords: LeeWayToolUsageRecord[];
  proposalResult?: LeeWaySkillProposalResult;
  telemetryEvents: LeeWayTelemetryEvent[];
  auditEvents: LeeWayAuditEvent[];
  status: 'COMPLETED' | 'BLOCKED' | 'ESCALATED' | 'FAILED';
};

import { LeeWaySkillRouter } from './LeeWaySkillRouter';
import { LeeWaySkillEvidenceCollector } from './LeeWaySkillEvidence';
import { LeeWayDiagnosticRunner } from './LeeWayDiagnosticRunner';
import { LeeWayProposalBuilder } from './LeeWayProposalBuilder';

export class LeeWaySkillRuntime {
  static async execute(request: LeeWaySkillRequest): Promise<LeeWaySkillRuntimeResult> {
    // 1. Route the request
    const route = LeeWaySkillRouter.routeRequest(request);
    const timestamp = new Date().toISOString();
    const runtimeId = createLeeWayIdentityId('RUNTIME');
    const rosterEntry = LEEWAY_AGENT_ROSTER.find((entry) => entry.systemId === route.ownerAgentId || entry.systemId.includes(route.ownerAgentId.replace('-agent', '')));
    const skillProcess = LeeWayAgentSkillProcessRegistry.find((entry) => entry.skillId === route.skillId);
    const capabilityIds = LEEWAY_CAPABILITY_REGISTRY
      .filter((entry) => entry.agentId === route.ownerAgentId && entry.allowedWorkflows.includes(route.workflowId))
      .map((entry) => entry.capabilityId);

    const actionIdentity: LeeWayAgentActionIdentity = {
      actionId: createLeeWayIdentityId('ACTION'),
      actionLabel: skillProcess?.label || route.skillId,
      actionTag: `ACTION.${route.skillId.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`,
      agentId: route.ownerAgentId,
      agentRoleId: rosterEntry?.immutableRoleId || 'ROLE-UNKNOWN',
      agentDisplayName: rosterEntry?.displayName || route.ownerAgentId,
      ownerAgent: skillProcess?.label || route.ownerAgentId,
      skillId: route.skillId,
      workflowId: route.workflowId,
      screenId: request.selectedScreenId || 'UNKNOWN_SCREEN',
      selectedLeewayId: request.selectedLeewayId,
      selectedSchemaPath: request.selectedSchemaPaths?.[0] || request.selectedSchemaPath,
      selectedMediaId: request.selectedMediaId,
      runtimeAuthorityMode: request.runtimeMode,
      lawReferences: route.lawReferences,
      capabilityIds,
      telemetryStreamId: route.telemetryStreamId,
      auditCategory: route.auditCategory,
      riskLevel: skillProcess?.canProposeCodePatch ? 'medium' : 'low',
      requiresHumanApproval: true,
      publishDirectly: false,
      tracePath: ['AdminOS', request.selectedScreenId || 'UNKNOWN_SCREEN', route.workflowId, route.skillId, request.selectedLeewayId || 'no-selected-region'],
    };

    const initialRuntimeState: LeeWayAgentRuntimeState = {
      runtimeId,
      agentId: actionIdentity.agentId,
      agentRoleId: actionIdentity.agentRoleId,
      agentDisplayName: actionIdentity.agentDisplayName,
      status: 'diagnosing',
      currentSkillId: actionIdentity.skillId,
      currentWorkflowId: actionIdentity.workflowId,
      currentActionId: actionIdentity.actionId,
      currentScreenId: actionIdentity.screenId,
      currentSelectedLeewayId: actionIdentity.selectedLeewayId,
      currentTelemetryStreamId: actionIdentity.telemetryStreamId,
      runtimeAuthorityMode: actionIdentity.runtimeAuthorityMode,
      mcpIdsUsed: skillProcess?.allowedMcpIds || [],
      toolIdsUsed: skillProcess?.allowedTools || [],
      startedAt: timestamp,
      updatedAt: timestamp,
    };
    upsertRuntimeState(initialRuntimeState);

    // 2. Collect evidence
    const evidence = LeeWaySkillEvidenceCollector.collectEvidence(request);

    // 3. Run diagnostics
    const diagnostics = LeeWayDiagnosticRunner.runDiagnostics(actionIdentity, route, request, evidence);

    // 4. Build proposal
    const proposalResult = LeeWayProposalBuilder.buildProposal(route.skillId, request, evidence, diagnostics);
    const proposalIdentity = proposalResult?.proposalIdentity;

    const routeIdentity: LeeWaySkillRouteIdentity = {
      routeId: createLeeWayIdentityId('ROUTE'),
      skillId: route.skillId,
      confidence: route.confidence,
      matchedTriggerPhrase: route.matchedTriggerPhrase,
      assignedAgents: route.assignedAgents,
      ownerAgent: route.ownerAgentId,
      workflowId: route.workflowId,
      telemetryStreamId: route.telemetryStreamId,
      auditCategory: route.auditCategory,
      selectedLeewayId: request.selectedLeewayId,
      runtimeAuthorityMode: request.runtimeMode,
      blockedCapabilities: route.blockedCapabilities,
      lawReferences: route.lawReferences,
    };

    const telemetryEvents: LeeWayTelemetryEvent[] = [
      recordLeeWayTelemetryEvent({
        eventId: createLeeWayIdentityId('TELEMETRY'),
        streamId: actionIdentity.telemetryStreamId,
        eventType: 'skill-routed',
        agentId: actionIdentity.agentId,
        skillId: actionIdentity.skillId,
        workflowId: actionIdentity.workflowId,
        actionId: actionIdentity.actionId,
        selectedLeewayId: actionIdentity.selectedLeewayId,
        screenId: actionIdentity.screenId,
        runtimeAuthorityMode: actionIdentity.runtimeAuthorityMode,
        timestamp,
        severity: 'info',
        message: `Routed selected-area request to ${route.skillId}.`,
        tracePath: actionIdentity.tracePath,
      }),
      recordLeeWayTelemetryEvent({
        eventId: createLeeWayIdentityId('TELEMETRY'),
        streamId: actionIdentity.telemetryStreamId,
        eventType: 'diagnostics-completed',
        agentId: actionIdentity.agentId,
        skillId: actionIdentity.skillId,
        workflowId: actionIdentity.workflowId,
        actionId: actionIdentity.actionId,
        selectedLeewayId: actionIdentity.selectedLeewayId,
        screenId: actionIdentity.screenId,
        runtimeAuthorityMode: actionIdentity.runtimeAuthorityMode,
        timestamp: new Date().toISOString(),
        severity: diagnostics.some((entry) => entry.status === 'fail' || entry.status === 'blocked') ? 'warning' : 'info',
        message: `${diagnostics.length} diagnostics completed for ${route.skillId}.`,
        tracePath: actionIdentity.tracePath,
      }),
    ];

    if (proposalIdentity) {
      telemetryEvents.push(recordLeeWayTelemetryEvent({
        eventId: createLeeWayIdentityId('TELEMETRY'),
        streamId: actionIdentity.telemetryStreamId,
        eventType: 'proposal-created',
        agentId: actionIdentity.agentId,
        skillId: actionIdentity.skillId,
        workflowId: actionIdentity.workflowId,
        actionId: actionIdentity.actionId,
        selectedLeewayId: actionIdentity.selectedLeewayId,
        screenId: actionIdentity.screenId,
        runtimeAuthorityMode: actionIdentity.runtimeAuthorityMode,
        timestamp: new Date().toISOString(),
        severity: 'info',
        message: `Governed proposal ${proposalIdentity.proposalId} created.`,
        tracePath: proposalIdentity.tracePath,
      }));
    }

    const auditEvents: LeeWayAuditEvent[] = [
      recordLeeWayAuditEvent({
        auditEventId: createLeeWayIdentityId('AUDIT'),
        actionId: actionIdentity.actionId,
        agentId: actionIdentity.agentId,
        ownerApprovalStatus: 'awaiting-approval',
        timestamp,
        lawReferences: actionIdentity.lawReferences,
        riskLevel: actionIdentity.riskLevel,
        auditCategory: actionIdentity.auditCategory,
        message: `Skill routed for ${actionIdentity.selectedLeewayId || 'unscoped request'}.`,
      }),
      recordLeeWayAuditEvent({
        auditEventId: createLeeWayIdentityId('AUDIT'),
        actionId: actionIdentity.actionId,
        agentId: actionIdentity.agentId,
        ownerApprovalStatus: proposalIdentity ? 'awaiting-approval' : 'blocked',
        timestamp: new Date().toISOString(),
        lawReferences: actionIdentity.lawReferences,
        riskLevel: actionIdentity.riskLevel,
        auditCategory: actionIdentity.auditCategory,
        message: proposalIdentity ? 'Proposal created for owner review.' : 'Runtime escalated without proposal.',
      }),
    ];

    const toolUsageRecords = buildToolUsageRecords(actionIdentity, skillProcess?.allowedTools || [], skillProcess?.allowedMcpIds || [], evidence);
    toolUsageRecords.forEach(recordLeeWayToolUsage);

    const finalStatus: LeeWaySkillRuntimeResult['status'] = proposalResult ? 'COMPLETED' : 'ESCALATED';
    const updatedRuntimeState: LeeWayAgentRuntimeState = {
      ...initialRuntimeState,
      status: proposalIdentity ? 'awaiting-approval' : 'blocked',
      currentAuditEventId: auditEvents[auditEvents.length - 1]?.auditEventId,
      updatedAt: new Date().toISOString(),
      blockedReason: proposalIdentity ? undefined : 'No governed proposal generated for this selected-area request.',
    };
    upsertRuntimeState(updatedRuntimeState);

    return {
      requestId: request.requestId,
      skillId: route.skillId,
      runtimeId,
      actionIdentity,
      runtimeState: updatedRuntimeState,
      route,
      routeIdentity,
      evidence,
      diagnostics,
      proposalIdentity,
      toolUsageRecords,
      proposalResult,
      telemetryEvents,
      auditEvents,
      status: finalStatus,
    };
  }
}

function buildToolUsageRecords(
  actionIdentity: LeeWayAgentActionIdentity,
  toolIds: string[],
  mcpIds: string[],
  evidence: LeeWaySkillEvidence[],
) {
  const mcpState = evidence.find((entry) => entry.sourceId === 'mcp_state')?.data;
  return toolIds.map((toolId, index) => {
    const mcpId = mcpIds[index] || mcpIds[0] || 'no-mcp-required';
    const connected = mcpId === 'no-mcp-required' || Boolean(mcpState?.connected?.includes?.(mcpId));
    return {
      usageId: createLeeWayIdentityId('TOOL'),
      actionId: actionIdentity.actionId,
      toolId,
      mcpId,
      connectionState: connected ? 'connected' : mcpId === 'no-mcp-required' ? 'not-configured' : 'disconnected',
      permissionState: connected ? 'allowed' : 'blocked',
      result: connected ? 'dependency-declared' : 'blocked',
      blockedReason: connected ? undefined : `MCP ${mcpId} was unavailable for tool ${toolId}.`,
    } as LeeWayToolUsageRecord;
  });
}
