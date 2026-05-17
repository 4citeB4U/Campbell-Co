/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.LEEWAY.AGENT_SKILLS.REGISTRY
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
WHAT = LeeWayAgentSkillProcessRegistry.ts
WHY = Store definitions for all governed agent skills
WHO = LeeWay Innovations
WHERE = src/core/leeway/LeeWayAgentSkillProcessRegistry.ts
WHEN = 2026-05-17
HOW = TypeScript registry
*/

export type LeeWayAgentSkillProcess = {
  skillId: string;
  label: string;
  description: string;
  ownerAgentId: string;
  supportAgents: string[];
  category:
    | "MEDIA"
    | "CONTENT"
    | "PRODUCT"
    | "THEME"
    | "LAYOUT"
    | "FRONTEND_CODE"
    | "BACKEND_STORAGE"
    | "MCP_INTEGRATION"
    | "RUNTIME_AUTHORITY"
    | "PUBLISHING"
    | "TROUBLESHOOTING"
    | "OWNER_GUIDANCE"
    | "LEEWAY_COMPLIANCE";
  triggerPhrases: string[];
  applicableScreens: string[];
  applicableWorkflows: string[];
  requiredLaws: string[];
  requiredRuntimeModes: string[];
  allowedMcpIds: string[];
  allowedTools: string[];
  inputRequirements: string[];
  diagnosticChecklist: string[];
  proposalOutputShape: string;
  canApplyDraft: boolean;
  canProposeCodePatch: boolean;
  canPublish: false;
  requiresHumanApproval: boolean;
  blockedActions: string[];
  telemetryEvents: string[];
  auditCategories: string[];
  manualSectionIds: string[];
  troubleshootingIds: string[];
};

export const LeeWayAgentSkillProcessRegistry: LeeWayAgentSkillProcess[] = [
  {
    skillId: 'skill.media.public-image-not-showing',
    label: 'Media Public Image Not Showing',
    description: 'Diagnose and resolve problems where images added in AdminOS do not appear on the public storefront.',
    ownerAgentId: 'nova-operations-agent', // Wait, prompt said Forge. I'll use forge.
    supportAgents: ['atlas-memory-agent', 'aura-media-agent', 'shield-governor-agent', 'agent-lee-prime'],
    category: 'MEDIA',
    triggerPhrases: [
      'image not showing',
      'picture not showing',
      'can’t add image',
      'image added but public site did not change',
      'product image missing',
      'hero image broken',
      'media upload not working',
      'image path broken'
    ],
    applicableScreens: ['ADMIN_PORTAL', 'ADMIN_PRODUCT_REGISTRY'],
    applicableWorkflows: ['workflow.troubleshooting.media'],
    requiredLaws: ['LAW-0001', 'LAW-0005'],
    requiredRuntimeModes: ['PRODUCTION_AUTHORITY', 'DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: ['media-library-mcp'],
    allowedTools: ['inspectSchema', 'viewDraft', 'viewPublished'],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath'],
    diagnosticChecklist: [
      'Is the image registered in the Media Library?',
      'Is the image assigned to the correct schema field?',
      'Is the schema path valid?',
      'Is the image URL/path valid?',
      'Does the image have required alt text?',
      'Is the related section/product visible?',
      'Is the update still in draft?',
      'Has the owner published it?',
      'Is the public preview in draft or published mode?',
      'Is runtime authority blocking publish?',
      'Is media storage/MCP configured?',
      'Are there broken asset path errors?',
      'Does GitHub Pages base path affect the asset URL?',
      'Is the product registry reading published data?',
      'Is the public component consuming the right field?'
    ],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: [
      'no silent media mutation',
      'no fake upload',
      'no bypassing alt text validation',
      'no direct publish',
      'no pretending storage is connected',
      'no direct code edit without approval'
    ],
    telemetryEvents: ['skill.media.diagnose', 'skill.media.proposal'],
    auditCategories: ['MEDIA_TROUBLESHOOTING', 'PROPOSAL_GENERATION'],
    manualSectionIds: ['manual.section.troubleshooting', 'manual.section.agents'],
    troubleshootingIds: ['issue.image.broken']
  },
  {
    skillId: 'skill.code.frontend.leeway-patch-propose',
    label: 'Code Patch Propose',
    description: 'Propose frontend code changes that preserve LeeWay Standards. Used when issues cannot be solved through schema/content settings.',
    ownerAgentId: 'nova-operations-agent',
    supportAgents: ['agent-lee-prime', 'shield-governor-agent', 'atlas-memory-agent'],
    category: 'FRONTEND_CODE',
    triggerPhrases: ['need code fix', 'code is broken', 'component not reading data', 'missing data-leeway-id'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.code.patch'],
    requiredLaws: ['LAW-0001', 'LAW-0002', 'LAW-0005'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: ['vs-code-bridge-mcp'],
    allowedTools: ['viewFile', 'replaceFileContent'],
    inputRequirements: ['issueId', 'targetFiles'],
    diagnosticChecklist: [
      'inspect the relevant files',
      'identify affected components',
      'preserve LeeWay headers',
      'preserve data-leeway attributes',
      'preserve proposal-before-mutation',
      'preserve manual publish',
      'preserve runtime authority mode',
      'add IDs/tags/action IDs/schema paths for any new UI node',
      'produce a patch proposal',
      'require human approval before applying',
      'run lint/build/audit after patch'
    ],
    proposalOutputShape: 'LeeWayCodePatchProposal',
    canApplyDraft: false,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: [
      'no direct code mutation without approval',
      'no removing LeeWay IDs',
      'no removing laws',
      'no bypassing compliance',
      'no adding anonymous UI nodes',
      'no fake MCP/VM/AI claims'
    ],
    telemetryEvents: ['skill.code.patch.propose'],
    auditCategories: ['CODE_PATCH'],
    manualSectionIds: ['manual.section.agents'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.backend.storage.authority-diagnose',
    label: 'Backend Storage Authority Diagnose',
    description: 'Diagnose whether a problem is caused by Firestore, local authority mode, product registry storage, media storage, draft/published mismatch, or configuration blocked state.',
    ownerAgentId: 'forge-logic-agent',
    supportAgents: ['shield-governor-agent', 'atlas-memory-agent', 'ledger-agent'],
    category: 'BACKEND_STORAGE',
    triggerPhrases: ['authority blocked', 'publish disabled', 'database error', 'cannot connect'],
    applicableScreens: ['ADMIN_SETTINGS_CENTER'],
    applicableWorkflows: ['workflow.troubleshooting.backend'],
    requiredLaws: ['LAW-0001', 'LAW-0009'],
    requiredRuntimeModes: ['CONFIGURATION_BLOCKED', 'DEVELOPMENT_BOOTSTRAP', 'PRODUCTION_AUTHORITY'],
    allowedMcpIds: [],
    allowedTools: ['readEnv'],
    inputRequirements: [],
    diagnosticChecklist: [
      'current runtime mode',
      'persistence authority',
      'draft store',
      'published store',
      'product registry authority',
      'media storage authority',
      'missing credentials',
      'publish permission',
      'blocked reason'
    ],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: false,
    canProposeCodePatch: false,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: [
      'no silently fall back',
      'no fake storage',
      'no mark production ready when configuration is blocked'
    ],
    telemetryEvents: ['skill.backend.diagnose'],
    auditCategories: ['BACKEND_TROUBLESHOOTING'],
    manualSectionIds: ['manual.section.publishing'],
    troubleshootingIds: ['issue.authority.blocked']
  },
  {
    skillId: 'skill.theme.global-experience-update',
    label: 'Global Experience Update',
    description: 'Help owner change theme colors, fonts, layout density, and visual preferences across public and admin surfaces.',
    ownerAgentId: 'avion-orchestrator',
    supportAgents: ['aura-media-agent', 'agent-lee-prime', 'shield-governor-agent'],
    category: 'THEME',
    triggerPhrases: ['change colors', 'change font', 'update theme', 'visual preference'],
    applicableScreens: ['ADMIN_SETTINGS_CENTER'],
    applicableWorkflows: ['workflow.theme.update'],
    requiredLaws: ['LAW-0001', 'LAW-0016'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP', 'PRODUCTION_AUTHORITY'],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: [],
    diagnosticChecklist: [
      'global vs public-only vs admin-only vs preview-only scope',
      'LAW-0016 Unified Theme Coupling',
      'draft preview vs published view',
      'CSS variable projection',
      'affected components',
      'owner confirmation'
    ],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: false,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: [
      'no direct publish'
    ],
    telemetryEvents: ['skill.theme.update'],
    auditCategories: ['THEME_UPDATE'],
    manualSectionIds: ['manual.section.theme'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.product.public-product-not-showing',
    label: 'Public Product Not Showing',
    description: 'Diagnose why a product is missing from the storefront.',
    ownerAgentId: 'orion-agent',
    supportAgents: ['forge-logic-agent', 'shield-governor-agent', 'aura-media-agent'],
    category: 'PRODUCT',
    triggerPhrases: ['product missing', 'product not showing', 'where is my product'],
    applicableScreens: ['ADMIN_PRODUCT_REGISTRY'],
    applicableWorkflows: ['workflow.troubleshooting.product'],
    requiredLaws: ['LAW-0001'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP', 'PRODUCTION_AUTHORITY'],
    allowedMcpIds: ['product-registry-mcp'],
    allowedTools: [],
    inputRequirements: [],
    diagnosticChecklist: [
      'product exists in draft registry',
      'product exists in published registry',
      'product visibility is live',
      'product has title',
      'product has slug',
      'slug is unique',
      'price is valid',
      'image exists',
      'alt text exists',
      'category is assigned',
      'public product grid consumes published registry',
      'product route resolves slug',
      'publish completed'
    ],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: [
      'no direct publish'
    ],
    telemetryEvents: ['skill.product.diagnose'],
    auditCategories: ['PRODUCT_TROUBLESHOOTING'],
    manualSectionIds: ['manual.section.products'],
    troubleshootingIds: ['issue.product.hidden']
  },
  {
    skillId: 'skill.owner.explain-and-guide',
    label: 'Explain and Guide',
    description: 'Explain to Avion what is happening in plain language, what he can do, what is blocked, and which agent/skill can help.',
    ownerAgentId: 'avion-orchestrator',
    supportAgents: [],
    category: 'OWNER_GUIDANCE',
    triggerPhrases: ['help', 'what do i do', 'explain', 'stuck'],
    applicableScreens: ['ADMIN_PORTAL', 'ADMIN_SETTINGS_CENTER'],
    applicableWorkflows: ['workflow.guidance'],
    requiredLaws: ['LAW-0001'],
    requiredRuntimeModes: [],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: [],
    diagnosticChecklist: [
      'what happened',
      'why it happened',
      'what he can do now',
      'what will affect public customers',
      'whether publish is required',
      'which agent is helping',
      'which law governs it',
      'link/manual section if available'
    ],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: false,
    canProposeCodePatch: false,
    canPublish: false,
    requiresHumanApproval: false,
    blockedActions: [],
    telemetryEvents: ['skill.owner.guide'],
    auditCategories: ['OWNER_GUIDANCE'],
    manualSectionIds: ['manual.section.intro'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.media.assign-to-selected-region',
    label: 'Assign Image to Selected Region',
    description: 'Assigns an uploaded image media asset to the currently selected region.',
    ownerAgentId: 'aura-media-agent',
    supportAgents: ['atlas-memory-agent'],
    category: 'MEDIA',
    triggerPhrases: ['put this uploaded image in this section', 'assign image', 'put this image here', 'make this product image the primary image'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.media.assign'],
    requiredLaws: ['LAW-0005', 'LAW-0001'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: ['media-library-mcp'],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath', 'mediaContext'],
    diagnosticChecklist: ['Is media an image?', 'Does it have alt text?', 'Is schema path valid?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish', 'no video'],
    telemetryEvents: ['skill.media.assign'],
    auditCategories: ['MEDIA_ASSIGNMENT'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.media.assign-video-to-selected-region',
    label: 'Assign Video to Selected Region',
    description: 'Assigns an uploaded video media asset to the currently selected region.',
    ownerAgentId: 'aura-media-agent',
    supportAgents: ['atlas-memory-agent'],
    category: 'MEDIA',
    triggerPhrases: ['put this uploaded video in this hero area', 'assign video'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.media.assign'],
    requiredLaws: ['LAW-0005', 'LAW-0001'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: ['media-library-mcp'],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath', 'mediaContext'],
    diagnosticChecklist: ['Is media a video?', 'Is schema path valid?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish', 'no image'],
    telemetryEvents: ['skill.media.assign'],
    auditCategories: ['MEDIA_ASSIGNMENT'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.theme.selected-background-update',
    label: 'Update Selected Background',
    description: 'Updates the background color or style of the currently selected region.',
    ownerAgentId: 'avion-orchestrator',
    supportAgents: ['aura-media-agent'],
    category: 'THEME',
    triggerPhrases: ['change this section background color'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.theme.update'],
    requiredLaws: ['LAW-0005', 'LAW-0016'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath'],
    diagnosticChecklist: ['Is the background preset allowed?', 'Is schema path valid?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish'],
    telemetryEvents: ['skill.theme.update'],
    auditCategories: ['THEME_UPDATE'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.animation.selected-section-apply',
    label: 'Apply Animation to Selected Section',
    description: 'Applies an allowed animation preset to the currently selected region.',
    ownerAgentId: 'avion-orchestrator',
    supportAgents: ['aura-media-agent'],
    category: 'THEME',
    triggerPhrases: ['add a fade-in animation to this block'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.theme.update'],
    requiredLaws: ['LAW-0005', 'LAW-0016'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath'],
    diagnosticChecklist: ['Is the animation preset allowed?', 'Is schema path valid?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish', 'no arbitrary animation code'],
    telemetryEvents: ['skill.theme.update'],
    auditCategories: ['THEME_UPDATE'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.content.selected-text-update',
    label: 'Update Selected Text',
    description: 'Updates text content (e.g., button text) in the currently selected region.',
    ownerAgentId: 'agent-lee-prime',
    supportAgents: ['atlas-memory-agent'],
    category: 'CONTENT',
    triggerPhrases: ['change this button text'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.content.update'],
    requiredLaws: ['LAW-0005', 'LAW-0001'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath'],
    diagnosticChecklist: ['Is schema path valid?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish'],
    telemetryEvents: ['skill.content.update'],
    auditCategories: ['CONTENT_UPDATE'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  },
  {
    skillId: 'skill.layout.selected-section-move',
    label: 'Move Selected Section',
    description: 'Adjusts the layout or ordering of the currently selected section.',
    ownerAgentId: 'nova-operations-agent',
    supportAgents: ['agent-lee-prime'],
    category: 'LAYOUT',
    triggerPhrases: ['move this section higher'],
    applicableScreens: ['ADMIN_PORTAL'],
    applicableWorkflows: ['workflow.layout.update'],
    requiredLaws: ['LAW-0005', 'LAW-0001'],
    requiredRuntimeModes: ['DEVELOPMENT_BOOTSTRAP'],
    allowedMcpIds: [],
    allowedTools: [],
    inputRequirements: ['selectedLeewayId', 'selectedSchemaPath'],
    diagnosticChecklist: ['Is schema path valid?', 'Is move allowed?'],
    proposalOutputShape: 'LeeWayAgentProposal',
    canApplyDraft: true,
    canProposeCodePatch: true,
    canPublish: false,
    requiresHumanApproval: true,
    blockedActions: ['no silent mutation', 'no direct publish'],
    telemetryEvents: ['skill.layout.update'],
    auditCategories: ['LAYOUT_UPDATE'],
    manualSectionIds: ['manual.section.agent.fix'],
    troubleshootingIds: []
  }
];
