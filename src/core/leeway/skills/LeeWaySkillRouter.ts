/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.ROUTER
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
WHAT = LeeWaySkillRouter.ts
WHY = Route skill requests to appropriate processes
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWaySkillRouter.ts
WHEN = 2026-05-17
HOW = TypeScript router
*/

import { LeeWaySkillRequest, LeeWaySkillRoute } from './LeeWaySkillRuntime';
import { LeeWayAgentSkillProcessRegistry } from '../LeeWayAgentSkillProcessRegistry';

export class LeeWaySkillRouter {
  static routeRequest(request: LeeWaySkillRequest): LeeWaySkillRoute {
    const lowerText = request.ownerText.toLowerCase();

    // Default route: owner guidance
    let matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.owner.explain-and-guide')!;
    let confidence = 0.1;
    let matchedTriggerPhrase = 'fallback.owner.guidance';

    for (const skill of LeeWayAgentSkillProcessRegistry) {
      const matchedPhrase = skill.triggerPhrases.find((phrase) => lowerText.includes(phrase));
      if (matchedPhrase) {
        matchedSkill = skill;
        confidence = 0.9;
        matchedTriggerPhrase = matchedPhrase;
        break;
      }
    }

    const isImageAssignmentIntent =
      Boolean(request.selectedLeewayId) &&
      (!request.mediaContext || request.mediaContext?.type === 'image') &&
      /(put|place|assign|use|make).*(image|photo|picture)|hero/i.test(lowerText);

    const isVideoAssignmentIntent =
      Boolean(request.selectedLeewayId) &&
      request.mediaContext?.type === 'video' &&
      /(put|place|assign|use|make).*(video)|video/i.test(lowerText);

    const isAnimationIntent =
      Boolean(request.selectedLeewayId) &&
      /(animation|animate|fade-in|fade in)/i.test(lowerText);

    if (isVideoAssignmentIntent) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.media.assign-video-to-selected-region')!;
      confidence = 0.98;
      matchedTriggerPhrase = 'put this video here';
    } else if (isImageAssignmentIntent) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.media.assign-to-selected-region')!;
      confidence = 0.98;
      matchedTriggerPhrase = 'put this image here';
    } else if (isAnimationIntent) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.animation.selected-section-apply')!;
      confidence = 0.96;
      matchedTriggerPhrase = 'add a fade-in animation to this block';
    } else if (lowerText.includes('product missing')) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.product.public-product-not-showing')!;
      confidence = 0.95;
      matchedTriggerPhrase = 'product missing';
    } else if (lowerText.includes('change color') || lowerText.includes('theme')) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.theme.global-experience-update')!;
      confidence = 0.95;
      matchedTriggerPhrase = 'change color';
    } else if (lowerText.includes('code is broken') || lowerText.includes('need code fix')) {
      matchedSkill = LeeWayAgentSkillProcessRegistry.find(s => s.skillId === 'skill.code.frontend.leeway-patch-propose')!;
      confidence = 0.95;
      matchedTriggerPhrase = 'need code fix';
    }

    return {
      skillId: matchedSkill.skillId,
      confidence,
      assignedAgents: [matchedSkill.ownerAgentId, ...matchedSkill.supportAgents],
      requiredEvidence: Array.from(new Set([
        'draft_state',
        'published_state',
        'runtime_authority',
        'mcp_state',
        ...(request.selectedMediaId ? ['media_asset_registry'] : []),
      ])),
      draftPatchPossible: matchedSkill.canApplyDraft,
      codePatchPossible: matchedSkill.canProposeCodePatch,
      blockedCapabilities: matchedSkill.blockedActions,
      matchedTriggerPhrase,
      ownerAgentId: matchedSkill.ownerAgentId,
      workflowId: matchedSkill.applicableWorkflows[0] || 'workflow.owner.guide',
      telemetryStreamId: matchedSkill.skillId.includes('media.assign') ? 'stream.aura.visual' : matchedSkill.skillId.includes('code.patch') ? 'stream.nova.ui' : 'stream.avion.experience',
      auditCategory: matchedSkill.auditCategories[0] || 'OWNER_GUIDANCE',
      lawReferences: matchedSkill.requiredLaws,
    };
  }
}
