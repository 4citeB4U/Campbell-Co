/*
LEEWAY HEADER - DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.APPLIER
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

DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = LeeWayDraftPatchApplier.ts
WHY = Safely apply draft patches
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWayDraftPatchApplier.ts
WHEN = 2026-05-17
HOW = TypeScript applier
*/

import { LeeWayAgentProposal } from '../LeeWayAgentProposal';
import { createLeeWayIdentityId, recordLeeWayTelemetryEvent } from '../LeeWayRuntimeIdentity';

export class LeeWayDraftPatchApplier {
  static apply(proposal: LeeWayAgentProposal): boolean {
    if (proposal.publishDirectly) {
      throw new Error('LAW-0005 Violation: Skills cannot publish directly. Must apply to draft.');
    }

    recordLeeWayTelemetryEvent({
      eventId: createLeeWayIdentityId('TELEMETRY'),
      streamId: proposal.telemetryStreamId,
      eventType: 'draft-patch-apply-requested',
      agentId: proposal.agentId,
      skillId: proposal.routedSkillId || 'skill.unknown',
      workflowId: proposal.workflowId,
      actionId: proposal.actionId,
      selectedLeewayId: proposal.selectedLeewayId,
      screenId: 'ADMIN_PORTAL',
      runtimeAuthorityMode: proposal.runtimeMode,
      timestamp: new Date().toISOString(),
      severity: 'info',
      message: `Draft patch apply requested for proposal ${proposal.proposalId}.`,
      tracePath: proposal.tracePath || ['AdminOS', proposal.workflowId],
    });

    return true;
  }
}
