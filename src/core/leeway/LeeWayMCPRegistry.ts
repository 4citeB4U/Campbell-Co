/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=link

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE.LEEWAY
TAG: CORE.LEEWAY.MCP_REGISTRY
DESCRIPTION: Unified MCP registry for tracking heartbeats and permissions of external tools
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type LeeWayMcpConnectionState = 
  | 'MCP_CONNECTED'
  | 'MCP_NOT_CONNECTED'
  | 'MCP_REQUIRED'
  | 'MCP_BLOCKED'
  | 'MCP_BLOCKED_BY_DEFAULT'
  | 'MCP_CONFIGURATION_MISSING';

export interface LeeWayMcpEntry {
  mcpId: string;
  label: string;
  connectionState: LeeWayMcpConnectionState;
  ownerAgent: string;
  allowedAgents: string[];
  allowedTools: string[];
  allowedWorkflows: string[];
  permissions: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  configurationRequirement: string;
  lastHeartbeat: string;
  blockedReason?: string;
  tracePath: string[];
  auditCategory: string;
}

export const LEEWAY_MCP_REGISTRY: LeeWayMcpEntry[] = [
  {
    mcpId: "filesystem-mcp",
    label: "Local Filesystem Connector",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Sentinel",
    allowedAgents: ["sentinel-compliance-agent", "atlas-knowledge-agent", "muse-editorial-agent"],
    allowedTools: ["complianceAnalyzer", "bridgeChecker"],
    allowedWorkflows: ["workflow.standards.source.inspect"],
    permissions: ["readOnly", "indexStructure"],
    riskLevel: "medium",
    configurationRequirement: "Root directory path configuration inside .leeway/config.json",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "Filesystem"],
    auditCategory: "mcp.filesystem"
  },
  {
    mcpId: "github-mcp",
    label: "GitHub Repositories Controller",
    connectionState: "MCP_CONFIGURATION_MISSING",
    ownerAgent: "Beacon",
    allowedAgents: ["beacon-deployment-agent"],
    allowedTools: [],
    allowedWorkflows: ["workflow.build.monitor"],
    permissions: ["readWrite", "deployPages"],
    riskLevel: "high",
    configurationRequirement: "GH_TOKEN environment variable credentials",
    lastHeartbeat: "N/A",
    tracePath: ["LeeWay", "Integrations", "GitHub"],
    auditCategory: "mcp.github"
  },
  {
    mcpId: "browser-mcp",
    label: "Browser Automation Controller",
    connectionState: "MCP_BLOCKED_BY_DEFAULT",
    ownerAgent: "Shield",
    allowedAgents: ["sentinel-compliance-agent"],
    allowedTools: ["liveRouteValidator", "screenshotCapturer", "accessibilityTester"],
    allowedWorkflows: ["workflow.public.preview.qa", "workflow.accessibility.check"],
    permissions: ["isolatedSandboxOnly", "screenshotOnly", "noCredentials", "noUnapprovedFormSubmit", "noAutonomousSurf", "approvedDomainsOnly"],
    riskLevel: "critical",
    configurationRequirement: "Puppeteer proxy authorization parameters",
    lastHeartbeat: "N/A",
    blockedReason: "Blocked by default. May only operate in sandboxed, human-authorized workflows (live route validation, screenshot capture, accessibility testing, broken asset checks, public preview QA; no credential entry, no unapproved form submission, no autonomous web surfing, no external navigation outside approved domains).",
    tracePath: ["LeeWay", "Integrations", "Browser"],
    auditCategory: "mcp.browser"
  },
  {
    mcpId: "vs-code-bridge-mcp",
    label: "VS Code Plugin Bridge",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Atlas",
    allowedAgents: ["atlas-knowledge-agent", "nova-frontend-agent", "lee-prime-orchestrator"],
    allowedTools: ["bridgeChecker", "codeCompiler"],
    allowedWorkflows: ["workflow.vscode.bridge.inspect", "workflow.code.frontend.patch.propose"],
    permissions: ["readOnly", "queryEditorState"],
    riskLevel: "medium",
    configurationRequirement: "Active leeway VS Code workspace plugin handshake key",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "VSCodeBridge"],
    auditCategory: "mcp.vscode"
  },
  {
    mcpId: "leeway-standards-mcp",
    label: "LeeWay Core Standards Engine",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Sentinel",
    allowedAgents: ["*"],
    allowedTools: ["complianceAnalyzer"],
    allowedWorkflows: ["workflow.standards.source.inspect"],
    permissions: ["readOnly", "validateSchema"],
    riskLevel: "low",
    configurationRequirement: "Local standards guidelines index compilation",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "StandardsEngine"],
    auditCategory: "mcp.standards"
  },
  {
    mcpId: "code-patch-mcp",
    label: "Workspace Code Patcher",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Forge",
    allowedAgents: ["nova-frontend-agent", "forge-persistence-agent", "lee-prime-orchestrator"],
    allowedTools: ["codeCompiler", "fileWriter"],
    allowedWorkflows: ["workflow.code.frontend.patch.propose", "workflow.code.backend.patch.propose"],
    permissions: ["applyStagedPatch", "dryRunCompile"],
    riskLevel: "critical",
    configurationRequirement: "Admin signed token authentication header",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "CodePatcher"],
    auditCategory: "mcp.codepatch"
  },
  {
    mcpId: "document-retrieval-mcp",
    label: "Governance Documentation Retriever",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Atlas",
    allowedAgents: ["atlas-knowledge-agent", "muse-editorial-agent", "avion-assistant-agent"],
    allowedTools: ["helpLookup"],
    allowedWorkflows: ["workflow.owner.help.explainCapability"],
    permissions: ["readOnly"],
    riskLevel: "low",
    configurationRequirement: "Local markdown vector index compilation",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "DocRetriever"],
    auditCategory: "mcp.docs"
  },
  {
    mcpId: "media-library-mcp",
    label: "Luxury Asset Library",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Aura",
    allowedAgents: ["aura-media-agent", "nova-frontend-agent"],
    allowedTools: ["imageAnalyzer", "mediaWriter"],
    allowedWorkflows: ["workflow.media.altText.generate", "workflow.media.commit"],
    permissions: ["readOnly", "annotateMetadata"],
    riskLevel: "low",
    configurationRequirement: "Local static assets folders access permission",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "MediaLibrary"],
    auditCategory: "mcp.media"
  },
  {
    mcpId: "product-registry-mcp",
    label: "Loose Diamond Registry Database",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Forge",
    allowedAgents: ["forge-persistence-agent", "orion-catalog-agent"],
    allowedTools: ["catalogStager", "productDescriber"],
    allowedWorkflows: ["workflow.product.description.improve", "workflow.product.badge.generate"],
    permissions: ["readWriteDraft", "validateInventory"],
    riskLevel: "high",
    configurationRequirement: "Firestore server sdk auth configuration key",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "ProductRegistry"],
    auditCategory: "mcp.catalog"
  },
  {
    mcpId: "audit-log-mcp",
    label: "Action Audit Blockchain Ledger",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Ledger",
    allowedAgents: ["ledger-audit-agent"],
    allowedTools: ["auditTimelineParser"],
    allowedWorkflows: ["workflow.audit.timeline.inspect"],
    permissions: ["appendOnly", "queryLogs"],
    riskLevel: "medium",
    configurationRequirement: "Cryptographic vault log append endpoint configuration",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "AuditLedger"],
    auditCategory: "mcp.audit"
  },
  {
    mcpId: "telemetry-mcp",
    label: "Continuous Telemetry Watcher",
    connectionState: "MCP_CONNECTED",
    ownerAgent: "Sentinel",
    allowedAgents: ["sentinel-compliance-agent"],
    allowedTools: ["telemetryQuerier"],
    allowedWorkflows: ["workflow.telemetry.stream.inspect"],
    permissions: ["readOnly", "queryAggregates"],
    riskLevel: "low",
    configurationRequirement: "Continuous monitor analytics handshake port",
    lastHeartbeat: new Date().toISOString(),
    tracePath: ["LeeWay", "Integrations", "Telemetry"],
    auditCategory: "mcp.telemetry"
  }
];
