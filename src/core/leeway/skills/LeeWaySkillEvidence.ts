/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.EVIDENCE
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
WHAT = LeeWaySkillEvidence.ts
WHY = Collect evidence for agent skills
WHO = LeeWay Innovations
WHERE = src/core/leeway/skills/LeeWaySkillEvidence.ts
WHEN = 2026-05-17
HOW = TypeScript evidence collector
*/

import { LeeWaySkillRequest, LeeWaySkillEvidence } from './LeeWaySkillRuntime';

export class LeeWaySkillEvidenceCollector {
  static collectEvidence(request: LeeWaySkillRequest): LeeWaySkillEvidence[] {
    const evidence: LeeWaySkillEvidence[] = [];

    // Simulate collecting evidence
    evidence.push({
      sourceId: 'runtime_authority',
      status: request.runtimeMode ? 'AVAILABLE' : 'SOURCE_UNAVAILABLE',
      data: { mode: request.runtimeMode }
    });

    const selectedImageField = request.selectedSchemaPaths?.find((path) => path.endsWith('.image')) || request.selectedSchemaPath;
    const selectedAltField = request.selectedSchemaPaths?.find((path) => path.endsWith('.imageAlt'));

    evidence.push({
      sourceId: 'draft_state',
      status: 'AVAILABLE',
      data: {
        hasDraftContent: Boolean(request.draftContent),
        imagePath: selectedImageField ? readFieldValue(request.draftContent, selectedImageField) : null,
        altText: selectedAltField ? readFieldValue(request.draftContent, selectedAltField) : null,
        selectedLeewayId: request.selectedLeewayId,
        selectedSchemaPaths: request.selectedSchemaPaths ?? []
      }
    });

    evidence.push({
      sourceId: 'published_state',
      status: 'AVAILABLE',
      data: {
        hasPublishedContent: Boolean(request.publishedContent),
        imagePath: selectedImageField ? readFieldValue(request.publishedContent, selectedImageField) : null,
        altText: selectedAltField ? readFieldValue(request.publishedContent, selectedAltField) : null,
        selectedLeewayId: request.selectedLeewayId,
        selectedSchemaPaths: request.selectedSchemaPaths ?? []
      }
    });

    if (request.selectedProductId) {
      evidence.push({
        sourceId: 'product_draft_registry',
        status: 'AVAILABLE',
        data: { id: request.selectedProductId }
      });
    }

    if (request.selectedMediaId) {
      evidence.push({
        sourceId: 'media_asset_registry',
        status: 'AVAILABLE',
        data: request.mediaContext ?? { id: request.selectedMediaId }
      });
    }

    evidence.push({
      sourceId: 'mcp_state',
      status: 'AVAILABLE',
      data: { connected: ['media-library-mcp'] }
    });

    return evidence;
  }
}

function readFieldValue(source: unknown, fieldPath: string) {
  if (!source) return null;

  try {
    return fieldPath.split('.').reduce<any>((current, key) => current?.[key], source) ?? null;
  } catch {
    return null;
  }
}
