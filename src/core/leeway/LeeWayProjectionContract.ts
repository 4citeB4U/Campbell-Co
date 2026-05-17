/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=repeat

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE.LEEWAY
TAG: CORE.LEEWAY.PROJECTION_CONTRACT
DESCRIPTION: Projection sync contract outlining draft and published state propagation rules
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export interface ProjectionState {
  stateType: 'DRAFT_BUFFER' | 'PUBLISHED_LIVE' | 'ADMIN_SHELL_PREFERENCE' | 'GLOBAL_EXPERIENCE_THEME';
  description: string;
  sourceAuthority: string;
  persistenceStore: 'LocalStorage' | 'Firestore' | 'SessionStorage' | 'Memory';
  propagationTimeMs: number;
  enforcingAgent: string;
  publishTarget?: string;
}

export const LEEWAY_PROJECTION_CONTRACTS: Record<string, ProjectionState> = {
  adminDraftState: {
    stateType: "DRAFT_BUFFER",
    description: "The live editing workspace staging visual alterations, brand tags, and layout changes. Safe for agent assist simulation.",
    sourceAuthority: "AdminOS Site Control / Visual CMS",
    persistenceStore: "LocalStorage",
    propagationTimeMs: 0, // Instant local refresh
    enforcingAgent: "Nova",
    publishTarget: "adminPublishedState"
  },
  adminPublishedState: {
    stateType: "PUBLISHED_LIVE",
    description: "The cryptographic production content buffer signed by the human owner and deployed to the customer storefront.",
    sourceAuthority: "Human Owner signature confirmation",
    persistenceStore: "LocalStorage",
    propagationTimeMs: 1200, // Smooth transition fade
    enforcingAgent: "Forge"
  },
  adminUIPreferenceState: {
    stateType: "ADMIN_SHELL_PREFERENCE",
    description: "Local operating configurations scoped strictly to the administrative layout (e.g. sidebar panel density or device preview defaults).",
    sourceAuthority: "Local Admin Preferences console",
    persistenceStore: "LocalStorage",
    propagationTimeMs: 0,
    enforcingAgent: "Avion"
  },
  globalExperienceTheme: {
    stateType: "GLOBAL_EXPERIENCE_THEME",
    description: "Shared brand colors, custom font selections, and radii scoped to synchronize public customer views and administrative portal highlighting elements.",
    sourceAuthority: "Experience Theme Editor",
    persistenceStore: "LocalStorage",
    propagationTimeMs: 50, // Micro-animation fade transition
    enforcingAgent: "Aura"
  }
};

export const SYNC_RULES = [
  "RULE-001: Content drafts mutate the local draftContentState and propagate to the live preview panel instantly.",
  "RULE-002: Published content remains locked from public consumer screens until explicit human activation in the Publishing Console.",
  "RULE-003: Global Experience Theme alterations instantly mutate custom CSS properties globally on both AdminOS and Customer Preview panels.",
  "RULE-004: Workspace Code Patches cannot mutate code files without human signature confirmation on the verification audit terminal."
];
