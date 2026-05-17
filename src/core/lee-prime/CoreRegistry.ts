/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEE_PRIME.CORE_REGISTRY.MAIN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

DESCRIPTION: Canonical LeeWay Sovereign Agent Registry for Campbell & Co.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = CoreRegistry.ts — sovereign authority definition
WHY = Prevent duplicate power centers and define cognitive authority boundaries
WHO = Leeway Innovations / Agent Lee Prime
WHERE = src/core/lee-prime/CoreRegistry.ts
WHEN = 2026-05-16
HOW = Schema-driven authority mapping

AGENTS:
ASSESS
ALIGN
AUDIT

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

/**
 * CORE AUTHORITY IDENTIFIERS
 */
export type CoreId =
  | 'LEE_PRIME'
  | 'ORIGIN_CORE'
  | 'STRUCTURE_CORE'
  | 'VERITAS_CORE'
  | 'ECHO_CORE'
  | 'VECTOR_CORE'
  | 'SYNTHESIS_CORE'
  | 'SHIELD_GOVERNOR'
  | 'NOVA_FORGE'
  | 'AURA_MEDIA';

/**
 * SOVEREIGN EXECUTION STAGES (The 8-Stage Cycle)
 */
export const SOVEREIGN_EXECUTION_ORDER: CoreId[] = [
  'LEE_PRIME',      // Stage 1: Orchestration
  'ORIGIN_CORE',    // Stage 2: Intent/Perception
  'STRUCTURE_CORE', // Stage 3: Planning
  'NOVA_FORGE',     // Stage 4: Execution/Creation
  'VERITAS_CORE',   // Stage 5: Validation/Safety
  'ECHO_CORE',      // Stage 6: Memory/Persistence
  'AURA_MEDIA',     // Stage 7: Synthesis/Presentation
  'LEE_PRIME',      // Stage 8: Final Delivery
];

export interface CoreRegistryEntry {
  id: CoreId;
  label: string;
  family: string;
  authority: 'SOVEREIGN' | 'ADVISORY' | 'RESTRICTED';
  permissions: string[];
  failurePolicy: 'FAIL_CLOSED' | 'RETRY' | 'ESCALATE';
}

/**
 * THE HOUSE REGISTRY
 */
export const CORE_REGISTRY: Map<CoreId, CoreRegistryEntry> = new Map([
  [
    'LEE_PRIME',
    {
      id: 'LEE_PRIME',
      label: 'Agent Lee Prime',
      family: 'core',
      authority: 'SOVEREIGN',
      permissions: ['*'],
      failurePolicy: 'FAIL_CLOSED',
    },
  ],
  [
    'ORIGIN_CORE',
    {
      id: 'ORIGIN_CORE',
      label: 'Origin Cognition',
      family: 'core',
      authority: 'SOVEREIGN',
      permissions: ['intent.parse', 'perception.align'],
      failurePolicy: 'ESCALATE',
    },
  ],
  [
    'STRUCTURE_CORE',
    {
      id: 'STRUCTURE_CORE',
      label: 'Structure Planning',
      family: 'core',
      authority: 'SOVEREIGN',
      permissions: ['plan.sequence', 'task.route'],
      failurePolicy: 'RETRY',
    },
  ],
  [
    'VERITAS_CORE',
    {
      id: 'VERITAS_CORE',
      label: 'Veritas Validation',
      family: 'security',
      authority: 'SOVEREIGN',
      permissions: ['validate.safety', 'validate.policy', 'receipt.emit'],
      failurePolicy: 'FAIL_CLOSED',
    },
  ],
  [
    'ECHO_CORE',
    {
      id: 'ECHO_CORE',
      label: 'Echo Memory',
      family: 'memory',
      authority: 'SOVEREIGN',
      permissions: ['memory.read', 'memory.write', 'memory.mirror'],
      failurePolicy: 'ESCALATE',
    },
  ],
  [
    'NOVA_FORGE',
    {
      id: 'NOVA_FORGE',
      label: 'Nova Forge',
      family: 'forge',
      authority: 'ADVISORY',
      permissions: ['code.mutate', 'logic.align'],
      failurePolicy: 'RETRY',
    },
  ],
  [
    'AURA_MEDIA',
    {
      id: 'AURA_MEDIA',
      label: 'Aura Media',
      family: 'media',
      authority: 'ADVISORY',
      permissions: ['ui.render', 'voice.synth', 'style.apply'],
      failurePolicy: 'RETRY',
    },
  ],
  [
    'SHIELD_GOVERNOR',
    {
      id: 'SHIELD_GOVERNOR',
      label: 'Shield Governor',
      family: 'security',
      authority: 'SOVEREIGN',
      permissions: ['security.enforce', 'auth.verify'],
      failurePolicy: 'FAIL_CLOSED',
    },
  ],
]);
