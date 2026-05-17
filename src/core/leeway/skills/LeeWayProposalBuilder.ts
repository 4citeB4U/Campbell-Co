/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.BUILDER
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
WHAT = LeeWayProposalBuilder.ts
WHY = Build proposals for agent skills
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWayProposalBuilder.ts
WHEN = 2026-05-17
HOW = TypeScript builder
*/

import { LeeWaySkillRequest, LeeWaySkillEvidence, LeeWaySkillProposalResult } from './LeeWaySkillRuntime';
import { LeeWayAgentProposal } from '../LeeWayAgentProposal';
import { LeeWayDiagnosticIdentity, LeeWayProposalIdentity, createLeeWayIdentityId } from '../LeeWayRuntimeIdentity';

export type LeeWayCodePatchProposal = {
  patchId: string;
  ownerAgentId: string;
  supportAgentIds: string[];
  issueId: string;
  reason: string;
  targetFiles: string[];
  affectedLeewayIds: string[];
  affectedScreens: string[];
  beforeSummary: string;
  afterSummary: string;
  patchPlan: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lawsReferenced: string[];
  approvalRequired: true;
  canApplyAutomatically: false;
  validationCommands: string[];
  auditCategory: string;
};

export class LeeWayProposalBuilder {
  static buildProposal(
    skillId: string,
    request: LeeWaySkillRequest,
    evidence: LeeWaySkillEvidence[],
    diagnostics: LeeWayDiagnosticIdentity[]
  ): LeeWaySkillProposalResult | undefined {
    
    // Check if code patch is needed
    const codeEscalation = diagnostics.find(d => d.suggestedProposalAction?.includes('code patch proposal'));
    if (codeEscalation) {
      const codeProposal: LeeWayCodePatchProposal = {
        patchId: createLeeWayIdentityId('PATCH'),
        ownerAgentId: 'nova-operations-agent',
        supportAgentIds: ['agent-lee-prime'],
        issueId: 'issue.frontend.binding',
        reason: codeEscalation.evidence,
        targetFiles: [], // Determine from context
        affectedLeewayIds: [request.selectedLeewayId || ''],
        affectedScreens: [request.selectedScreenId || ''],
        beforeSummary: 'Component ignores schema field.',
        afterSummary: 'Component will consume correct schema field with data-leeway-schema-path.',
        patchPlan: ['Update component file to read from correct schema path.'],
        riskLevel: 'medium',
        lawsReferenced: ['LAW-0002'],
        approvalRequired: true,
        canApplyAutomatically: false,
        validationCommands: ['npm run lint', 'npm run build', 'npm run leeway:audit'],
        auditCategory: 'CODE_PATCH'
      };
      return { proposalType: 'LeeWayCodePatchProposal', proposal: codeProposal };
    }

    if (skillId === 'skill.media.assign-to-selected-region' || skillId === 'skill.media.assign-video-to-selected-region') {
      const imageFieldPath = request.selectedSchemaPaths?.find((path) => path.endsWith('.image'));
      const altFieldPath = request.selectedSchemaPaths?.find((path) => path.endsWith('.imageAlt'));
      const videoFieldPath = request.selectedSchemaPaths?.find((path) => path.endsWith('.videoUrl'));
      const mediaAsset = evidence.find((entry) => entry.sourceId === 'media_asset_registry')?.data;
      const isVideoSkill = skillId === 'skill.media.assign-video-to-selected-region';

      if (!(isVideoSkill ? videoFieldPath : imageFieldPath) || !mediaAsset?.url) {
        return undefined;
      }

      const currentImage = imageFieldPath ? readFieldValue(request.draftContent, imageFieldPath) : null;
      const currentAlt = altFieldPath ? readFieldValue(request.draftContent, altFieldPath) : null;
      const currentVideo = videoFieldPath ? readFieldValue(request.draftContent, videoFieldPath) : null;
      const altText = mediaAsset.altText || currentAlt || `${mediaAsset.title} image`;
      const primarySchemaPath = isVideoSkill ? videoFieldPath! : imageFieldPath!;

      const proposal: LeeWayAgentProposal = {
        proposalId: createLeeWayIdentityId('PROPOSAL'),
        agentId: 'aura-media-agent',
        agentLabel: 'Aura',
        taskId: `task.media.assign.${request.selectedLeewayId ?? 'selected-region'}`,
        taskTitle: `${isVideoSkill ? 'Assign Video' : 'Assign Media'} To Selected Region - ${request.selectedLeewayId ?? 'Unknown Region'}`,
        proposalTag: isVideoSkill ? 'PROPOSAL.MEDIA.ASSIGN_VIDEO.SELECTED_REGION' : 'PROPOSAL.MEDIA.ASSIGN.SELECTED_REGION',
        workflowId: 'workflow.media.assign',
        actionId: 'action.media.assign.selected-region',
        telemetryStreamId: 'stream.aura.visual',
        auditCategory: request.selectedAuditCategory || 'MEDIA_ASSIGNMENT',
        runtimeMode: request.runtimeMode || 'DEVELOPMENT_BOOTSTRAP',
        proposedChanges: [
          {
            fieldPath: primarySchemaPath,
            label: isVideoSkill ? 'Selected Region Video' : 'Selected Region Image',
            before: isVideoSkill ? currentVideo : currentImage,
            after: mediaAsset.url,
            reason: `Assign registered media asset "${mediaAsset.title}" to ${request.selectedLeewayId}.`,
          },
          ...(!isVideoSkill && altFieldPath ? [{
            fieldPath: altFieldPath,
            label: 'Selected Region Image Alt Text',
            before: currentAlt,
            after: altText,
            reason: 'Preserve accessible alt text when the selected media asset is moved into the governed region.',
          }] : []),
        ],
        riskLevel: 'low',
        lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0011', 'LAW-0016'],
        capabilityIds: [isVideoSkill ? 'media.assign.video.propose' : 'media.assign.propose'],
        selectedSchemaPath: primarySchemaPath,
        selectedMediaId: request.selectedMediaId,
        diagnosticsUsed: diagnostics.map((entry) => entry.diagnosticId),
        visibleImpact: `Draft-only ${isVideoSkill ? 'video' : 'media'} update for the selected public region.`,
        tracePath: ['AdminOS', request.selectedScreenId || 'ADMIN_PORTAL', 'workflow.media.assign', request.selectedLeewayId || 'no-selected-region'],
        requiresHumanApproval: true,
        status: 'preview',
        selectedLeewayId: request.selectedLeewayId || '',
        selectedSchemaPaths: request.selectedSchemaPaths ?? [],
        routedSkillId: skillId,
        publishDirectly: false,
        createdAt: new Date().toISOString()
      };
      return { proposalType: 'LeeWayAgentProposal', proposal, proposalIdentity: buildProposalIdentity(skillId, proposal) };
    }

    // Otherwise, generate LeeWayAgentProposal (draft fix)
    const draftFix = diagnostics.find(d => d.suggestedProposalAction?.toLowerCase().includes('alt text'));
    if (draftFix) {
      const proposal: LeeWayAgentProposal = {
        proposalId: createLeeWayIdentityId('PROPOSAL'),
        agentId: 'aura-media-agent',
        agentLabel: 'Aura Media Agent',
        taskId: 'task.media.updateAlt',
        taskTitle: 'Update Missing Alt Text',
        proposalTag: 'PROPOSAL.MEDIA.ALT_TEXT',
        workflowId: 'workflow.media.update',
        actionId: 'action.media.updateAlt',
        telemetryStreamId: 'stream.media.update',
        auditCategory: 'media.update',
        runtimeMode: request.runtimeMode || 'DEVELOPMENT_BOOTSTRAP',
        proposedChanges: [
          {
            fieldPath: draftFix.schemaPath || '',
            label: 'Image Alt Text',
            before: '',
            after: 'Descriptive alt text for image',
            reason: 'Missing alt text blocks publish and violates accessibility.'
          }
        ],
        riskLevel: 'low',
        lawReferences: ['LAW-0005', 'LAW-0004'],
        capabilityIds: ['media.assign.propose'],
        selectedSchemaPath: draftFix.schemaPath,
        selectedMediaId: request.selectedMediaId,
        diagnosticsUsed: diagnostics.map((entry) => entry.diagnosticId),
        visibleImpact: 'Draft alt text changes only until the owner publishes live.',
        tracePath: ['AdminOS', request.selectedScreenId || 'UNKNOWN_SCREEN', 'workflow.media.update'],
        requiresHumanApproval: true,
        status: 'preview',
        selectedLeewayId: request.selectedLeewayId || '',
        selectedSchemaPaths: request.selectedSchemaPaths ?? [],
        publishDirectly: false,
        createdAt: new Date().toISOString()
      };
      return { proposalType: 'LeeWayAgentProposal', proposal, proposalIdentity: buildProposalIdentity(skillId, proposal) };
    }

    return undefined; // No proposal generated
  }
}

function buildProposalIdentity(skillId: string, proposal: LeeWayAgentProposal): LeeWayProposalIdentity {
  return {
    proposalId: proposal.proposalId,
    proposalTag: proposal.proposalTag || 'PROPOSAL.GENERIC',
    skillId,
    actionId: proposal.actionId,
    workflowId: proposal.workflowId,
    agentId: proposal.agentId,
    selectedLeewayId: proposal.selectedLeewayId,
    selectedSchemaPath: proposal.selectedSchemaPath,
    selectedMediaId: proposal.selectedMediaId,
    beforeValues: proposal.proposedChanges.map((change) => ({ fieldPath: change.fieldPath, value: change.before })),
    afterValues: proposal.proposedChanges.map((change) => ({ fieldPath: change.fieldPath, value: change.after })),
    visibleImpact: proposal.visibleImpact || 'Draft-only governed proposal.',
    diagnosticsUsed: proposal.diagnosticsUsed || [],
    lawReferences: proposal.lawReferences,
    capabilityIds: proposal.capabilityIds || [],
    telemetryStreamId: proposal.telemetryStreamId,
    auditCategory: proposal.auditCategory,
    requiresHumanApproval: true,
    publishDirectly: false,
    tracePath: proposal.tracePath || ['AdminOS', proposal.workflowId],
  };
}

function readFieldValue(source: unknown, fieldPath: string) {
  if (!source) return null;

  try {
    return fieldPath.split('.').reduce<any>((current, key) => current?.[key], source) ?? null;
  } catch {
    return null;
  }
}
