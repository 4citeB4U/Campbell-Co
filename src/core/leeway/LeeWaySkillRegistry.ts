/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=award

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE.LEEWAY
TAG: CORE.LEEWAY.SKILL_REGISTRY
DESCRIPTION: Registry outlining all 20 specific skills held by the AI Workforce
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export interface LeeWayAgentSkill {
  skillId: string;
  label: string;
  agentOwner: string;
  description: string;
  inputRequirements: string[];
  outputType: string;
  allowedWorkflows: string[];
  allowedTools: string[];
  requiredRuntimeMode: string;
  approvalRequirement: boolean;
  affectedSchemaPaths: string[];
  affectedScreens: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  lawReferences: string[];
  telemetryEventsEmitted: string[];
}

export const LEEWAY_SKILL_REGISTRY: LeeWayAgentSkill[] = [
  {
    skillId: "skill.theme.palette.propose",
    label: "Propose Experience Theme Palette",
    agentOwner: "Aura",
    description: "Generates custom HSL color harmonies matching luxury criteria.",
    inputRequirements: ["brandTonePrompt: string"],
    outputType: "Record<string, string>",
    allowedWorkflows: ["workflow.theme.palette.propose"],
    allowedTools: ["colorAnalyzer"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["theme"],
    affectedScreens: ["layout"],
    riskLevel: "low",
    lawReferences: ["LAW-0004", "LAW-0009", "LAW-0016"],
    telemetryEventsEmitted: ["theme.proposal.generated"]
  },
  {
    skillId: "skill.theme.palette.applyDraft",
    label: "Apply Theme Palette to Draft",
    agentOwner: "Avion",
    description: "Injects color codes into the active draft block, updating global styles.",
    inputRequirements: ["colors: Record<string, string>"],
    outputType: "boolean",
    allowedWorkflows: ["workflow.theme.palette.applyDraft"],
    allowedTools: ["cssVariableUpdater"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["theme"],
    affectedScreens: ["layout"],
    riskLevel: "medium",
    lawReferences: ["LAW-0001", "LAW-0004", "LAW-0016"],
    telemetryEventsEmitted: ["theme.draft.applied"]
  },
  {
    skillId: "skill.layout.section.reorder",
    label: "Reorder Page Sections",
    agentOwner: "Navigator",
    description: "Reorders primary page blocks to maximize customer conversion.",
    inputRequirements: ["sectionIds: string[]"],
    outputType: "string[]",
    allowedWorkflows: ["workflow.layout.section.reorder"],
    allowedTools: ["layoutSimulator"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["layout"],
    affectedScreens: ["layout"],
    riskLevel: "low",
    lawReferences: ["LAW-0009"],
    telemetryEventsEmitted: ["layout.reorder.proposed"]
  },
  {
    skillId: "skill.layout.section.visibility",
    label: "Toggle Section Visibility",
    agentOwner: "Nova",
    description: "Enables or disables homepage blocks inside the visual layout block.",
    inputRequirements: ["sectionId: string", "enabled: boolean"],
    outputType: "boolean",
    allowedWorkflows: ["workflow.layout.section.visibility"],
    allowedTools: ["layoutBuilder"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["layout"],
    affectedScreens: ["layout"],
    riskLevel: "medium",
    lawReferences: ["LAW-0001", "LAW-0009"],
    telemetryEventsEmitted: ["layout.visibility.updated"]
  },
  {
    skillId: "skill.content.hero.rewrite",
    label: "Rewrite Brand Hero Banners",
    agentOwner: "Muse",
    description: "Crafts sophisticated luxury tagline selections.",
    inputRequirements: ["eyebrow: string", "title: string", "body: string"],
    outputType: "Record<string, string>",
    allowedWorkflows: ["workflow.content.hero.rewrite"],
    allowedTools: ["textGenerators"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["home.hero"],
    affectedScreens: ["site-control"],
    riskLevel: "medium",
    lawReferences: ["LAW-0001", "LAW-0009"],
    telemetryEventsEmitted: ["content.hero.rewritten"]
  },
  {
    skillId: "skill.content.faq.refine",
    label: "Refine Client Care FAQs",
    agentOwner: "Muse",
    description: "Refines wording of answers inside client registries.",
    inputRequirements: ["questionsList: Array<{ question: string; answer: string }>"],
    outputType: "Array<{ question: string; answer: string }>",
    allowedWorkflows: ["workflow.content.faq.refine"],
    allowedTools: ["textGenerators"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["pages.faq"],
    affectedScreens: ["site-control"],
    riskLevel: "low",
    lawReferences: ["LAW-0009"],
    telemetryEventsEmitted: ["content.faq.refined"]
  },
  {
    skillId: "skill.content.checkout.trustCopy",
    label: "Optimize Checkout Trust Copy",
    agentOwner: "Shield",
    description: "Inserts compliant, verified guarantees to eliminate transactional cart friction.",
    inputRequirements: ["badgeTitle: string", "badgeBody: string"],
    outputType: "Record<string, string>",
    allowedWorkflows: ["workflow.standards.source.inspect"],
    allowedTools: ["complianceAnalyzer"],
    requiredRuntimeMode: "PRODUCTION_AUTHORITY",
    approvalRequirement: true,
    affectedSchemaPaths: ["checkout"],
    affectedScreens: ["site-control"],
    riskLevel: "medium",
    lawReferences: ["LAW-0001", "LAW-0005", "LAW-0010"],
    telemetryEventsEmitted: ["checkout.trustCopy.updated"]
  },
  {
    skillId: "skill.product.description.improve",
    label: "Improve Product Descriptions",
    agentOwner: "Orion",
    description: "Enhances product description copy with detailed material analysis.",
    inputRequirements: ["productId: string", "currentText: string"],
    outputType: "string",
    allowedWorkflows: ["workflow.product.description.improve"],
    allowedTools: ["productDescriber"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["products"],
    affectedScreens: ["products"],
    riskLevel: "low",
    lawReferences: ["LAW-0009"],
    telemetryEventsEmitted: ["catalog.product.improved"]
  },
  {
    skillId: "skill.product.badge.generate",
    label: "Generate Product Authenticity Badges",
    agentOwner: "Forge",
    description: "Binds structural proof metadata to product cards.",
    inputRequirements: ["productId: string", "certNumber: string"],
    outputType: "string[]",
    allowedWorkflows: ["workflow.product.badge.generate"],
    allowedTools: ["catalogStager"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["products"],
    affectedScreens: ["products"],
    riskLevel: "medium",
    lawReferences: ["LAW-0009"],
    telemetryEventsEmitted: ["catalog.badge.generated"]
  },
  {
    skillId: "skill.media.altText.generate",
    label: "Generate Media Alt Text",
    agentOwner: "Aura",
    description: "Analyzes jewelry and gemstone images and drafts luxury visual accessibility tags.",
    inputRequirements: ["mediaUrl: string"],
    outputType: "string",
    allowedWorkflows: ["workflow.media.altText.generate"],
    allowedTools: ["imageAnalyzer"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: ["home", "products"],
    affectedScreens: ["products", "site-control"],
    riskLevel: "low",
    lawReferences: ["LAW-0009"],
    telemetryEventsEmitted: ["media.altText.generated"]
  },
  {
    skillId: "skill.preview.section.inspect",
    label: "Inspect Live Storefront Preview Sections",
    agentOwner: "Nova",
    description: "Highlights individual elements inside the interactive preview portal side view.",
    inputRequirements: ["elementId: string"],
    outputType: "Record<string, any>",
    allowedWorkflows: ["workflow.layout.section.visibility"],
    allowedTools: ["layoutBuilder"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["layout", "site-control"],
    riskLevel: "low",
    lawReferences: ["LAW-0003", "LAW-0007", "LAW-0014"],
    telemetryEventsEmitted: ["preview.node.inspected"]
  },
  {
    skillId: "skill.preview.controls.open",
    label: "Control Preview Portal Scaling",
    agentOwner: "Avion",
    description: "Controls the dockable right side panel scaling options (mobile, tablet, desktop).",
    inputRequirements: ["zoomScale: number", "deviceView: string"],
    outputType: "boolean",
    allowedWorkflows: ["workflow.owner.guide"],
    allowedTools: ["helpLookup"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["*"],
    riskLevel: "low",
    lawReferences: ["LAW-0001", "LAW-0012"],
    telemetryEventsEmitted: ["preview.viewport.scaled"]
  },
  {
    skillId: "skill.standards.source.inspect",
    label: "Inspect Sovereign Standards File Headers",
    agentOwner: "Atlas",
    description: "Parses, confirms, and logs details of local leeway files.",
    inputRequirements: ["filePath: string"],
    outputType: "Record<string, string>",
    allowedWorkflows: ["workflow.standards.source.inspect"],
    allowedTools: ["bridgeChecker"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "low",
    lawReferences: ["LAW-0005", "LAW-0013"],
    telemetryEventsEmitted: ["standards.file.inspected"]
  },
  {
    skillId: "skill.audit.timeline.inspect",
    label: "Inspect Compliance Audit Logs",
    agentOwner: "Ledger",
    description: "Compiles audit indices and calculates compliance levels.",
    inputRequirements: ["limit: number"],
    outputType: "Array<Record<string, any>>",
    allowedWorkflows: ["workflow.audit.timeline.inspect"],
    allowedTools: ["auditTimelineParser"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "low",
    lawReferences: ["LAW-0007", "LAW-0014"],
    telemetryEventsEmitted: ["audit.timeline.inspected"]
  },
  {
    skillId: "skill.telemetry.stream.inspect",
    label: "Inspect Real-time Telemetry streams",
    agentOwner: "Sentinel",
    description: "Filters and logs streaming telemetry logs inside the workspace.",
    inputRequirements: ["streamId: string"],
    outputType: "Array<string>",
    allowedWorkflows: ["workflow.telemetry.stream.inspect"],
    allowedTools: ["telemetryQuerier"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "low",
    lawReferences: ["LAW-0007"],
    telemetryEventsEmitted: ["telemetry.stream.polled"]
  },
  {
    skillId: "skill.code.frontend.patch.propose",
    label: "Propose Frontend Layout Code Patches",
    agentOwner: "Nova",
    description: "Builds and checks isolated React scaffolding patches.",
    inputRequirements: ["targetComponent: string", "codePrompt: string"],
    outputType: "string",
    allowedWorkflows: ["workflow.code.frontend.patch.propose"],
    allowedTools: ["codeCompiler"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: true,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "high",
    lawReferences: ["LAW-0006", "LAW-0009", "LAW-0013"],
    telemetryEventsEmitted: ["code.patch.proposed"]
  },
  {
    skillId: "skill.code.backend.patch.propose",
    label: "Apply Human-Approved Backend Code Patches",
    agentOwner: "Forge",
    description: "Applies audited code changes directly to the workspace.",
    inputRequirements: ["patchContent: string"],
    outputType: "boolean",
    allowedWorkflows: ["workflow.code.backend.patch.propose"],
    allowedTools: ["fileWriter"],
    requiredRuntimeMode: "PRODUCTION_AUTHORITY",
    approvalRequirement: true,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "critical",
    lawReferences: ["LAW-0001", "LAW-0006", "LAW-0009", "LAW-0011", "LAW-0013"],
    telemetryEventsEmitted: ["code.patch.applied"]
  },
  {
    skillId: "skill.mcp.status.inspect",
    label: "Inspect Governed MCP Statuses",
    agentOwner: "Sentinel",
    description: "Queries active connection states and heartbeats of configured model context protocol links.",
    inputRequirements: [],
    outputType: "Record<string, any>",
    allowedWorkflows: ["workflow.mcp.status.inspect"],
    allowedTools: ["mcpChecker"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "low",
    lawReferences: ["LAW-0011"],
    telemetryEventsEmitted: ["mcp.statuses.queried"]
  },
  {
    skillId: "skill.vscode.bridge.inspect",
    label: "Inspect VS Code SDK Handshakes",
    agentOwner: "Atlas",
    description: "Queries connection states of VS Code local plugins.",
    inputRequirements: [],
    outputType: "boolean",
    allowedWorkflows: ["workflow.vscode.bridge.inspect"],
    allowedTools: ["bridgeChecker"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["leeway-standards"],
    riskLevel: "low",
    lawReferences: ["LAW-0013"],
    telemetryEventsEmitted: ["vscode.bridge.queried"]
  },
  {
    skillId: "skill.owner.help.explainCapability",
    label: "Explain Governed Roster Capabilities",
    agentOwner: "Avion",
    description: "Outputs detailed summaries explaining agent permission boundaries.",
    inputRequirements: ["agentId: string"],
    outputType: "string",
    allowedWorkflows: ["workflow.owner.help.explainCapability"],
    allowedTools: ["helpLookup"],
    requiredRuntimeMode: "DEVELOPMENT_BOOTSTRAP",
    approvalRequirement: false,
    affectedSchemaPaths: [],
    affectedScreens: ["*"],
    riskLevel: "low",
    lawReferences: ["LAW-0018"],
    telemetryEventsEmitted: ["help.capability.explained"]
  }
];
