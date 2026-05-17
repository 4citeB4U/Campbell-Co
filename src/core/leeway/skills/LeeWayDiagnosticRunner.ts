/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.DIAGNOSTIC
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
WHAT = LeeWayDiagnosticRunner.ts
WHY = Run diagnostic checks for agent skills
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWayDiagnosticRunner.ts
WHEN = 2026-05-17
HOW = TypeScript runner
*/

import { LeeWayAgentActionIdentity, LeeWayDiagnosticIdentity, createLeeWayIdentityId } from '../LeeWayRuntimeIdentity';
import { LeeWaySkillRequest, LeeWaySkillEvidence, LeeWaySkillRoute } from './LeeWaySkillRuntime';

export class LeeWayDiagnosticRunner {
  static runDiagnostics(
    actionIdentity: LeeWayAgentActionIdentity,
    route: LeeWaySkillRoute,
    request: LeeWaySkillRequest,
    evidence: LeeWaySkillEvidence[],
  ): LeeWayDiagnosticIdentity[] {
    const results: LeeWayDiagnosticIdentity[] = [];

    if (
      route.skillId === 'skill.media.public-image-not-showing' ||
      route.skillId === 'skill.media.assign-to-selected-region' ||
      route.skillId === 'skill.media.assign-video-to-selected-region'
    ) {
      const draftState = evidence.find(e => e.sourceId === 'draft_state')?.data;
      const publishedState = evidence.find(e => e.sourceId === 'published_state')?.data;
      const runtimeAuthority = evidence.find(e => e.sourceId === 'runtime_authority')?.data;
      const mediaAsset = evidence.find(e => e.sourceId === 'media_asset_registry')?.data;
      const imagePath = request.selectedSchemaPaths?.find(path => path.endsWith('.image'));
      const altPath = request.selectedSchemaPaths?.find(path => path.endsWith('.imageAlt'));
      const videoPath = request.selectedSchemaPaths?.find(path => path.endsWith('.videoUrl'));
      const expectsVideo = route.skillId === 'skill.media.assign-video-to-selected-region';

      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.media.region',
        status: request.selectedLeewayId ? 'pass' : 'fail',
        evidence: request.selectedLeewayId ? `Region ID: ${request.selectedLeewayId}` : 'No region selected',
        suggestedProposalAction: request.selectedLeewayId ? undefined : 'Select a governed preview region before asking agents to mutate media.',
      }));

      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.media.asset',
        status: mediaAsset?.id && mediaAsset?.type === (expectsVideo ? 'video' : 'image') ? 'pass' : 'fail',
        evidence: mediaAsset?.id ? `${mediaAsset.id} (${mediaAsset.type ?? 'unknown'})` : 'No registered media asset selected.',
        suggestedProposalAction: mediaAsset?.id ? undefined : `Choose a registered ${expectsVideo ? 'video' : 'image'} asset before generating a proposal.`,
      }));

      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: expectsVideo ? 'check.media.video_path' : 'check.media.image_path',
        status: expectsVideo ? (videoPath ? 'pass' : 'fail') : (imagePath ? 'pass' : 'fail'),
        evidence: expectsVideo ? (videoPath ?? 'No video schema path registered.') : (imagePath ?? 'No image schema path registered.'),
        schemaPath: expectsVideo ? videoPath : imagePath,
        suggestedProposalAction: expectsVideo
          ? (videoPath ? undefined : 'Unsupported selected region for video assignment.')
          : (imagePath ? undefined : 'Unsupported selected region for media assignment.'),
      }));

      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.media.alt_text',
        status: altPath && (mediaAsset?.altText || draftState?.altText) ? 'pass' : 'warning',
        evidence: altPath
          ? `Alt schema: ${altPath} / Value: ${mediaAsset?.altText || draftState?.altText || 'missing'}`
          : 'No imageAlt schema path registered.',
        schemaPath: altPath,
        suggestedProposalAction: !altPath || (!mediaAsset?.altText && !draftState?.altText) ? 'Propose alt text alongside image assignment.' : undefined,
      }));

      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.media.runtime_authority',
        status: runtimeAuthority?.mode === 'DEVELOPMENT_BOOTSTRAP' || runtimeAuthority?.mode === 'PRODUCTION_AUTHORITY' ? 'pass' : 'blocked',
        evidence: runtimeAuthority?.mode ?? 'Runtime authority unavailable.',
        suggestedProposalAction: runtimeAuthority?.mode === 'CONFIGURATION_BLOCKED' ? 'Runtime blocked mode prevents lawful draft mutation.' : undefined,
      }));

      const draftOnly = draftState?.imagePath !== publishedState?.imagePath || draftState?.altText !== publishedState?.altText;
      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.media.draft_published_state',
        status: draftOnly ? 'warning' : 'pass',
        evidence: `Draft image=${draftState?.imagePath ?? 'empty'} | Published image=${publishedState?.imagePath ?? 'empty'}`,
      }));

      if (request.selectedSchemaPath && !request.selectedSchemaPath.includes('image') && !imagePath) {
        results.push(buildDiagnostic(actionIdentity, route, {
          checkId: 'check.media.component_binding',
          status: 'fail',
          evidence: `Component binding is incorrect: ${request.selectedSchemaPath}`,
          schemaPath: request.selectedSchemaPath,
          suggestedProposalAction: 'Escalate to code patch proposal.',
        }));
      }
    }

    if (route.skillId === 'skill.animation.selected-section-apply') {
      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.animation.region',
        status: request.selectedLeewayId ? 'pass' : 'fail',
        evidence: request.selectedLeewayId ? `Region ID: ${request.selectedLeewayId}` : 'No region selected.',
      }));
      results.push(buildDiagnostic(actionIdentity, route, {
        checkId: 'check.animation.supported_region',
        status: 'fail',
        evidence: 'No supported animation binding exists for this selected region in the current build.',
        suggestedProposalAction: 'Unsupported selected region for animation request.',
      }));
    }

    return results;
  }
}

function buildDiagnostic(
  actionIdentity: LeeWayAgentActionIdentity,
  route: LeeWaySkillRoute,
  config: {
    checkId: string;
    status: 'pass' | 'fail' | 'warning' | 'blocked';
    evidence: string;
    schemaPath?: string;
    suggestedProposalAction?: string;
  },
): LeeWayDiagnosticIdentity {
  return {
    diagnosticId: createLeeWayIdentityId('DIAGNOSTIC'),
    checkId: config.checkId,
    skillId: route.skillId,
    agentId: actionIdentity.agentId,
    selectedLeewayId: actionIdentity.selectedLeewayId,
    schemaPath: config.schemaPath,
    status: config.status,
    evidence: config.evidence,
    lawReferences: actionIdentity.lawReferences,
    telemetryEventId: createLeeWayIdentityId('TELEMETRY'),
    auditCategory: actionIdentity.auditCategory,
    suggestedProposalAction: config.suggestedProposalAction,
  };
}
