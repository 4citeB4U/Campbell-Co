/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=scale

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE.LEEWAY
TAG: CORE.LEEWAY.LAW_SET
DESCRIPTION: Immutable Leeway Laws governing the sovereign AdminOS environment
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export interface LeeWayLaw {
  lawId: string;
  title: string;
  description: string;
  ownerAgent: string;
  enforcementMethod: string;
  affectedSystems: string[];
  complianceChecks: string[];
  violationBehavior: string;
  auditCategory: string;
  tracePath: string[];
}

export const LEEWAY_LAW_SET: LeeWayLaw[] = [
  {
    lawId: "LAW-0001",
    title: "Human Sovereignty",
    description: "The human owner is the final authority over all visual, content, product, layout, and publishing decisions.",
    ownerAgent: "Lee Prime",
    enforcementMethod: "Enforced via RBAC and explicit human signature checks on all mutations.",
    affectedSystems: ["AdminOS", "Storefront Preview", "Publishing Console"],
    complianceChecks: ["Verify user authentication matches owner profile before draft mutation.", "Reject direct autonomous publisher payloads."],
    violationBehavior: "Immediate freeze of transaction and notification emission to the owner desk.",
    auditCategory: "access.authority",
    tracePath: ["LeeWay", "Authority", "OwnerSovereignty"]
  },
  {
    lawId: "LAW-0002",
    title: "No Anonymous System Parts",
    description: "Every screen, component, workflow, setting, action, telemetry stream, agent, tool, MCP route, and public region must have a stable LeeWay ID.",
    ownerAgent: "Sentinel",
    enforcementMethod: "DOM and bundle static analysis audit.",
    affectedSystems: ["Vite Bundle", "Admin UI", "Storefront Components"],
    complianceChecks: ["Assert data-leeway-id is present on all interactive elements.", "Assert all registered agents possess a stable LeeWay ID."],
    violationBehavior: "Flag element in compliance dashboard; raise warning logs in console.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Standards", "NodeTraceability"]
  },
  {
    lawId: "LAW-0003",
    title: "AdminOS Controls Public Projection",
    description: "The public storefront must be a projection of AdminOS-published state.",
    ownerAgent: "Forge",
    enforcementMethod: "Isolated state projection hook inside the storefront runtime.",
    affectedSystems: ["CustomerSite", "Draft Site Content", "Firestore Persistence"],
    complianceChecks: ["Assert public site loads published content buffer.", "Verify no unapproved draft changes propagate to public customer views."],
    violationBehavior: "Rollback public storefront to the last signed production database state.",
    auditCategory: "content.publish",
    tracePath: ["LeeWay", "State", "ProjectionSync"]
  },
  {
    lawId: "LAW-0004",
    title: "Unified Experience Settings",
    description: "Theme, color, typography, spacing, display preferences, and brand settings must apply consistently across both AdminOS and the public storefront unless explicitly scoped.",
    ownerAgent: "Avion",
    enforcementMethod: "Unified style projection provider.",
    affectedSystems: ["AdminPortal", "CustomerSite", "BrandTheme"],
    complianceChecks: ["Verify primaryColor updates both Admin active items and Storefront highlight items.", "Verify typography styles are shared globally."],
    violationBehavior: "Throw styled visual warning and trigger fallback palette alignment.",
    auditCategory: "theme.synchronization",
    tracePath: ["LeeWay", "Experience", "UnifiedTheme"]
  },
  {
    lawId: "LAW-0005",
    title: "Standards Cannot Be Disabled",
    description: "The owner may customize the experience, but may not remove LeeWay IDs, governance metadata, audit rules, validation boundaries, or runtime authority checks.",
    ownerAgent: "Sentinel",
    enforcementMethod: "Read-only file structures and runtime validation locks.",
    affectedSystems: ["Compliance Audit", "useLeeWayID Hook", "File Headers"],
    complianceChecks: ["Confirm compliance checking scripts compile successfully.", "Confirm leeway:doctor exits with status 0."],
    violationBehavior: "Block system publishing, lock portal in advisory mode.",
    auditCategory: "governance.lock",
    tracePath: ["LeeWay", "Standards", "ImmutableRules"]
  },
  {
    lawId: "LAW-0006",
    title: "Agents Require Lawful Capability",
    description: "An agent may only perform actions explicitly granted by the LeeWay Capability Registry.",
    ownerAgent: "Lee Prime",
    enforcementMethod: "Capability checks before workflow initiation.",
    affectedSystems: ["AI Workforce", "Agent Task Runners"],
    complianceChecks: ["Assert agent has matching capability ID inside registry before running a step.", "Verify that the agent possesses mcp tool permissions if requested."],
    violationBehavior: "Refuse task execution and log unauthorized agent capability attempts to the ledger.",
    auditCategory: "agent.security",
    tracePath: ["LeeWay", "Workforce", "AgentPermissions"]
  },
  {
    lawId: "LAW-0007",
    title: "Agents Must Be Observable",
    description: "Every active agent must expose live status, current task, workflow, tool usage, MCP connection state, telemetry stream, and audit trail.",
    ownerAgent: "Sentinel",
    enforcementMethod: "Continuous telemetry stream validation.",
    affectedSystems: ["AI Workforce UI", "Telemetry Feed"],
    complianceChecks: ["Confirm agent card renders active telemetry stream ID.", "Confirm telemetry feed streams logs during agent operations."],
    violationBehavior: "Switch agent badge to standby and trigger registry reset.",
    auditCategory: "agent.observability",
    tracePath: ["LeeWay", "Workforce", "Observability"]
  },
  {
    lawId: "LAW-0008",
    title: "No Fake Intelligence",
    description: "Agents may not claim to think, retrieve, validate, code, deploy, or operate tools unless that capability is implemented, connected, identified, and auditable.",
    ownerAgent: "Atlas",
    enforcementMethod: "Strict interface implementation checks.",
    affectedSystems: ["AI Workforce", "Standards Inspector"],
    complianceChecks: ["Assert agent skills are registered inside LeeWaySkillRegistry.", "Verify active tool handlers exist in the runtime environment."],
    violationBehavior: "Mask unconfigured agent capabilities in the dashboard.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Standards", "TruthfulAI"]
  },
  {
    lawId: "LAW-0009",
    title: "Proposal Before Mutation",
    description: "AI and agent actions must propose changes first. Human approval is required before applying draft changes unless the action is explicitly classified as safe automatic assistance.",
    ownerAgent: "Avion",
    enforcementMethod: "Task approval queue UI.",
    affectedSystems: ["AI Workforce Recommendations", "Draft Content Staging"],
    complianceChecks: ["Verify no changes are made to draftContentState until human clicks approve.", "Log approval action ID with user profile reference."],
    violationBehavior: "Revert draft content to pre-proposal checkout baseline.",
    auditCategory: "access.authority",
    tracePath: ["LeeWay", "Authority", "ProposeBeforeMutate"]
  },
  {
    lawId: "LAW-0010",
    title: "Manual Publish",
    description: "No agent may publish directly to the public storefront. Publish remains a deliberate human action.",
    ownerAgent: "Shield",
    enforcementMethod: "Publishing console security guards.",
    affectedSystems: ["Publishing Console", "Production Projection State"],
    complianceChecks: ["Assert only human owner/admin credentials can trigger production publish actions.", "Confirm presence of visual comparison view prior to commit."],
    violationBehavior: "Throw security breach alarm; block database transaction.",
    auditCategory: "content.publish",
    tracePath: ["LeeWay", "Authority", "ManualPublish"]
  },
  {
    lawId: "LAW-0011",
    title: "MCP and Tool Transparency",
    description: "If an agent uses an MCP server, internal tool, file connector, code bridge, VM, browser, or retrieval system, that tool must be named, visible, permissioned, logged, and traceable.",
    ownerAgent: "Sentinel",
    enforcementMethod: "MCP registry lookup checks.",
    affectedSystems: ["MCP Inspector", "Telemetry Stream"],
    complianceChecks: ["Confirm MCP connections are displayed in settings.", "Log tool inputs/outputs to the telemetry stream."],
    violationBehavior: "Refuse tool connection and log warning.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Integration", "McpTransparency"]
  },
  {
    lawId: "LAW-0012",
    title: "Full Public/Admin Coupling",
    description: "Every setting that affects presentation must clearly declare whether it affects public only, admin only, preview only, or global application experience.",
    ownerAgent: "Avion",
    enforcementMethod: "Settings configuration metadata tags.",
    affectedSystems: ["Vault Settings", "Experience Theme Editor"],
    complianceChecks: ["Assert setting contains a valid scope field.", "Display scope badge next to settings slider/inputs."],
    violationBehavior: "Mark setting as unclassified and block rendering.",
    auditCategory: "theme.synchronization",
    tracePath: ["LeeWay", "Experience", "ScopeCoupling"]
  },
  {
    lawId: "LAW-0013",
    title: "LeeWay VS Code Bridge Truth",
    description: "The app must truthfully show whether LeeWay VS Code, LeeWay SDK, GitHub standards source, MCP tools, and VM/code-edit execution layers are connected or not connected.",
    ownerAgent: "Atlas",
    enforcementMethod: "Bridge validation handshake routines.",
    affectedSystems: ["LeeWay Standards Console", "Settings Console"],
    complianceChecks: ["Confirm bridge online status check matches actual local WebSocket/IPC state.", "Present explicit connection status dashboard."],
    violationBehavior: "Set status label to 'DISCONNECTED' and disable bridge dependent workflows.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Integration", "BridgeTruth"]
  },
  {
    lawId: "LAW-0014",
    title: "Instant Recognizability",
    description: "Every governed object must be recallable by stable ID, label, tag, owner agent, screen ID, schema path, and audit category.",
    ownerAgent: "Sentinel",
    enforcementMethod: "LeeWay registry search dictionary.",
    affectedSystems: ["Governance Panel", "Inspector Sidebar"],
    complianceChecks: ["Assert registered objects reside in LEEWAY_SEARCH_INDEX.", "Confirm recall lookup executes in <0.1ms."],
    violationBehavior: "Log warnings in inspector regarding unregistered elements.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Standards", "Recallability"]
  },
  {
    lawId: "LAW-0015",
    title: "Truthful Capability Degradation",
    description: "If a tool, MCP connector, VM, bridge, database, or agent capability is unavailable, the system must not simulate authority. It must identify the missing capability, classify the runtime state, display the degraded state to the owner, disable unsafe actions, preserve safe read-only/manual workflows where allowed, log the condition, and provide remediation instructions.",
    ownerAgent: "Shield",
    enforcementMethod: "Enforced via strict interface validation checking and missing credential diagnostics.",
    affectedSystems: ["Vault Settings", "Integrations Console", "AI Workforce Card"],
    complianceChecks: ["Verify that unavailable tools display degraded statuses honestly.", "Assert that silent fallback simulation is blocked."],
    violationBehavior: "Trigger security notification, lock unsafe settings, and present explicit fallback configuration guides.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Standards", "TruthfulDegradation"]
  },
  {
    lawId: "LAW-0016",
    title: "Unified Theme Coupling",
    description: "Global experience settings must apply to both public and administrative surfaces unless the setting is explicitly scoped. AdminOS must visually communicate the scope before applying changes.",
    ownerAgent: "Avion",
    enforcementMethod: "Live synchronized CSS variables and UI highlights.",
    affectedSystems: ["AdminPortal theme hooks", "Storefront theme hooks"],
    complianceChecks: ["Assert settings change instantly re-renders active theme accent colors globally.", "Log scoped exclusions with approval IDs."],
    violationBehavior: "Trigger global fallback style sheet, output style drift alert.",
    auditCategory: "theme.synchronization",
    tracePath: ["LeeWay", "Experience", "ThemeCoupling"]
  },
  {
    lawId: "LAW-0017",
    title: "Governed Growth",
    description: "LeeWay Standards must never prevent lawful expansion of the application. New users, agents, tools, MCP connectors, workflows, pages, settings, products, layouts, integrations, and runtime capabilities may be added as long as they enter through the LeeWay governance path, carry a stable LeeWay ID, owner agent, risk level, permissions, telemetry, and are documented in AdminOS.",
    ownerAgent: "Lee Prime",
    enforcementMethod: "Automatic registration scans and compile-time schema bounds verification.",
    affectedSystems: ["Registries", "Compliance Scanner", "Settings Center"],
    complianceChecks: ["Assert every new capability carries a valid LeeWay ID.", "Verify new nodes are mapped to active telemetry streams and risk levels."],
    violationBehavior: "Flag untraceable growth items as un-configured/blocked until registered correctly.",
    auditCategory: "standards.integrity",
    tracePath: ["LeeWay", "Sovereignty", "GovernedGrowth"]
  },
  {
    lawId: "LAW-0018",
    title: "Father/Creator Independence",
    description: "The system must explain itself to the owner so the owner does not need to call the creator for routine understanding. AdminOS must contain contextual help, capability explanations, notifications, and agent guidance.",
    ownerAgent: "Avion",
    enforcementMethod: "Interactive 'What Can I Do Here?' portal panels.",
    affectedSystems: ["Contextual Help Desk", "Guidance Sheets"],
    complianceChecks: ["Assert help documentation covers all primary AdminOS tabs.", "Display contextual guidance prompts inside all settings and agent views."],
    violationBehavior: "Highlight tab as missing documentation; present default help guides.",
    auditCategory: "owner.guide",
    tracePath: ["LeeWay", "Experience", "SelfDocumented"]
  }
];

export const LEEWAY_LAW_SHORT = `
LEEWAY LAW OF HUMAN-CENTERED GOVERNANCE:
The owner controls the experience.
LeeWay controls the law.
Agents assist under law.
MCP tools operate under permission.
Public and Admin surfaces project from governed state.
Every node, action, setting, workflow, skill, tool, agent, and telemetry event must be named, classified, tagged, traceable, trackable, auditable, and recallable.
`;
