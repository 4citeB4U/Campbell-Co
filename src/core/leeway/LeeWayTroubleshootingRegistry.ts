/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF4D4D
FLUO=#FF3333
PASTEL=#FFB3B3

ICON_ASCII:
family=lucide
glyph=wrench

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.LEEWAY.TROUBLESHOOTING_REGISTRY.MAIN
DESCRIPTION: Governed troubleshooting database providing exact steps for common owner issues.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = LeeWayTroubleshootingRegistry.ts — problem resolution matrix
WHY = The owner must be able to resolve common issues without developer intervention
WHO = Shield Governor / Atlas Memory
WHERE = src/core/leeway/LeeWayTroubleshootingRegistry.ts
WHEN = 2026-05-17
HOW = Renders in the Manual and is linked dynamically from Help tooltips

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type LeeWayTroubleshootingItem = {
  issueId: string;
  title: string;
  symptoms: string[];
  likelyCauses: string[];
  fixSteps: string[];
  relatedScreens: string[];
  relatedAgents: string[];
  relatedMcpIds: string[];
  relatedLawIds: string[];
  severity: "low" | "medium" | "high" | "critical";
  canOwnerFix: boolean;
  escalationMessage?: string;
};

export const LeeWayTroubleshootingRegistry: LeeWayTroubleshootingItem[] = [
  {
    issueId: 'issue.publish.disabled',
    title: 'Publish Button is Disabled',
    symptoms: ['Publish button is greyed out', 'Cannot push changes to live site'],
    likelyCauses: ['Runtime authority mode is STATIC_BOOTSTRAP_CONTENT', 'No pending draft changes exist'],
    fixSteps: [
      'Check the top banner on the Publishing screen to verify your Runtime Authority.',
      'If it says Read-Only Mode, your database is not connected. Provide .env.local credentials.',
      'If it says Production Authority, ensure your draft preview actually contains unsaved changes.'
    ],
    relatedScreens: ['ADMIN_PUBLISHING_CONSOLE'],
    relatedAgents: ['agent-lee-prime', 'shield-governor-agent'],
    relatedMcpIds: ['product-registry-mcp'],
    relatedLawIds: ['LAW-0001', 'LAW-0009'],
    severity: 'high',
    canOwnerFix: false,
    escalationMessage: 'Contact developer to inject secure database credentials into environment variables.'
  },
  {
    issueId: 'issue.proposal.failed',
    title: 'Agent Proposal Did Not Apply',
    symptoms: ['Clicked "Apply to Draft" but preview did not update'],
    likelyCauses: ['React state hydration delay', 'Draft storage quota exceeded'],
    fixSteps: [
      'Refresh the AdminOS window (F5 or CMD+R).',
      'Verify if the draft changes appear in the Inspector panel.',
      'If persistent, check the Live Telemetry log for the agent to spot errors.'
    ],
    relatedScreens: ['ADMIN_AGENTS_COMMAND_CENTER', 'ADMIN_CMS_PREVIEW'],
    relatedAgents: ['agent-lee-prime'],
    relatedMcpIds: [],
    relatedLawIds: ['LAW-0005'],
    severity: 'medium',
    canOwnerFix: true
  },
  {
    issueId: 'issue.content.not.updating',
    title: 'Public Site Not Updating',
    symptoms: ['I changed something in the inspector but customers cannot see it'],
    likelyCauses: ['Changes were only saved to draft'],
    fixSteps: [
      'Navigate to the Publishing Console.',
      'Review the draft diff to ensure your changes are listed.',
      'Click "Publish Live" to commit changes to production.'
    ],
    relatedScreens: ['ADMIN_PUBLISHING_CONSOLE'],
    relatedAgents: ['agent-lee-prime'],
    relatedMcpIds: [],
    relatedLawIds: ['LAW-0001'],
    severity: 'low',
    canOwnerFix: true
  },
  {
    issueId: 'issue.product.hidden',
    title: 'Product Is Not Showing',
    symptoms: ['Product is missing from storefront'],
    likelyCauses: ['Visibility set to hidden or draft', 'Out of stock'],
    fixSteps: [
      'Open the PIM / Product Registry.',
      'Select the product and check the "Status" field.',
      'Ensure visibility is set to "Published" and stock is > 0.'
    ],
    relatedScreens: ['ADMIN_PRODUCT_REGISTRY'],
    relatedAgents: ['nova-operations-agent'],
    relatedMcpIds: ['product-registry-mcp'],
    relatedLawIds: ['LAW-0001'],
    severity: 'medium',
    canOwnerFix: true
  },
  {
    issueId: 'issue.image.broken',
    title: 'Image is Broken',
    symptoms: ['A grey box or broken image icon appears instead of my photo'],
    likelyCauses: ['Media MCP is blocked', 'URL is invalid'],
    fixSteps: [
      'Check if the Media Library MCP is connected in Settings.',
      'If missing configuration, contact developer to add Cloudinary keys.',
      'Ensure the image URL is a fully qualified HTTPS link.'
    ],
    relatedScreens: ['ADMIN_SETTINGS_CENTER'],
    relatedAgents: ['aura-media-agent'],
    relatedMcpIds: ['media-library-mcp'],
    relatedLawIds: ['LAW-0009'],
    severity: 'high',
    canOwnerFix: false,
    escalationMessage: 'Contact developer to provision a media bucket.'
  },
  {
    issueId: 'issue.authority.blocked',
    title: 'Runtime Authority Blocked',
    symptoms: ['Cannot publish', 'Red banner says Setup Required'],
    likelyCauses: ['No production database credentials found in environment'],
    fixSteps: [
      'This is a LAW-0001 security block. The system refuses to publish to a mock database.',
      'Check your .env.local file for VITE_FIREBASE_* variables.'
    ],
    relatedScreens: ['ADMIN_PORTAL'],
    relatedAgents: ['shield-governor-agent'],
    relatedMcpIds: [],
    relatedLawIds: ['LAW-0001', 'LAW-0009'],
    severity: 'critical',
    canOwnerFix: false,
    escalationMessage: 'Developer must inject Firebase credentials.'
  },
  {
    issueId: 'issue.mcp.missing',
    title: 'MCP is Missing',
    symptoms: ['Amber or Red badge on an MCP card in settings'],
    likelyCauses: ['API keys missing from .env', 'Extension uninstalled'],
    fixSteps: [
      'Click the MCP card to read the specific missing variables.',
      'If it is the VS Code bridge, ensure the Agent Lee extension is active.'
    ],
    relatedScreens: ['ADMIN_SETTINGS_CENTER'],
    relatedAgents: ['shield-governor-agent'],
    relatedMcpIds: [],
    relatedLawIds: ['LAW-0009'],
    severity: 'medium',
    canOwnerFix: false,
    escalationMessage: 'Developer must inject the required API keys.'
  },
  {
    issueId: 'issue.vscode.disconnected',
    title: 'VS Code Bridge Disconnected',
    symptoms: ['Cannot sync components', 'Agent Lee is offline'],
    likelyCauses: ['VS Code closed', 'Extension disabled'],
    fixSteps: [
      'Open VS Code.',
      'Ensure the Agent Lee extension is enabled and running.',
      'Wait 60 seconds for the heartbeat to sync.'
    ],
    relatedScreens: ['ADMIN_SETTINGS_CENTER'],
    relatedAgents: ['agent-lee-prime'],
    relatedMcpIds: ['vs-code-bridge-mcp'],
    relatedLawIds: ['LAW-0015'],
    severity: 'low',
    canOwnerFix: true
  },
  {
    issueId: 'issue.admin.crash',
    title: 'Admin Page Not Loading',
    symptoms: ['White screen', 'React error boundary visible'],
    likelyCauses: ['Invalid draft state', 'Wrong URL entry', 'Authentication lock not cleared', 'Runtime or build error'],
    fixSteps: [
      'Refresh the page once before changing anything.',
      'Confirm you opened the AdminOS URL and try /admin.html if you landed on the storefront entry point.',
      'If the lock screen appears, confirm your owner passcode or sign-in is correct.',
      'If the page loads partially, check the runtime authority banner for blocked configuration warnings.',
      'Only if instructed, clear Campbell & Co. local draft data for this browser and reload.'
    ],
    relatedScreens: ['ADMIN_PORTAL'],
    relatedAgents: ['shield-governor-agent'],
    relatedMcpIds: [],
    relatedLawIds: ['LAW-0013'],
    severity: 'critical',
    canOwnerFix: true,
    escalationMessage: 'Escalate to a developer if /admin.html does not load, auth keeps failing, or the page still crashes after the owner-safe recovery steps.'
  }
];

export function getTroubleshootingItem(issueId: string): LeeWayTroubleshootingItem | undefined {
  return LeeWayTroubleshootingRegistry.find((item) => item.issueId === issueId);
}
