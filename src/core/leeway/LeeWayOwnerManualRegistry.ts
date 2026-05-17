/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#4D4DFF
FLUO=#3333FF
PASTEL=#B3B3FF

ICON_ASCII:
family=lucide
glyph=book-open

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.LEEWAY.OWNER_MANUAL_REGISTRY.MAIN
DESCRIPTION: Governed structure of the comprehensive Owner Manual.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = LeeWayOwnerManualRegistry.ts - manual section definitions
WHY = Provides a printable, traceable, auto-generating manual structure
WHO = Atlas Memory Agent
WHERE = src/core/leeway/LeeWayOwnerManualRegistry.ts
WHEN = 2026-05-17
HOW = Consumed by OwnerManual.tsx

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type ManualSection = {
  sectionId: string;
  title: string;
  content: string;
  screenId: string;
  workflowId: string;
  ownerAgent: string;
  relatedHelpIds: string[];
  relatedTroubleshootingIds: string[];
  lawReferences: string[];
  printable: boolean;
};

export const LEEWAY_OWNER_MANUAL_VERSION = '2026.05.17-owner-education';

export const LeeWayOwnerManualRegistry: ManualSection[] = [
  {
    sectionId: 'manual.section.intro',
    title: 'A. Welcome / What This System Is',
    screenId: 'ADMIN_SETTINGS_CENTER',
    workflowId: 'workflow.owner.education.manual',
    ownerAgent: 'atlas-memory-agent',
    content: `Welcome to the Campbell & Co. AdminOS. This is your visual command center.
- **AdminOS:** Your private interface to control the business safely.
- **Public Storefront:** The customer-facing website.
- **Live Preview:** An interactive window inside AdminOS showing draft or published customer views.
- **LeeWay Standards:** The laws governing safety, transparency, traceability, and owner control.
- **Agents:** Specialized AI assistants that diagnose and propose changes for your approval.
- **MCPs:** Secure connections to third-party services such as data stores, storage, or code tools.
- **Draft vs Published:** Draft is private staging. Published is what customers can see right now.`,
    relatedHelpIds: ['help.ui.openLivePreview'],
    relatedTroubleshootingIds: ['issue.content.not.updating'],
    lawReferences: ['LAW-0001', 'LAW-0018'],
    printable: true,
  },
  {
    sectionId: 'manual.section.theme',
    title: 'B. Theme And Experience Controls',
    screenId: 'ADMIN_SETTINGS_CENTER',
    workflowId: 'workflow.settings.theme',
    ownerAgent: 'aura-media-agent',
    content: `Use Experience Theme controls to update governed visual settings.
- **Change Theme Color:** Updates the brand accent used across AdminOS and the public preview.
- **Draft impact:** You will see the update in your preview immediately.
- **Customer impact:** Customers do not see the change until you publish.
- **Owner-safe changes:** Accent color, approved typography, density, and approved visual presets.
- **Escalate when:** A control is missing, blocked, or no longer affects the expected surfaces.`,
    relatedHelpIds: ['help.ui.themeColor'],
    relatedTroubleshootingIds: ['issue.content.not.updating'],
    lawReferences: ['LAW-0001', 'LAW-0016'],
    printable: true,
  },
  {
    sectionId: 'manual.section.products',
    title: 'C. Product Registry Basics',
    screenId: 'ADMIN_PRODUCT_REGISTRY',
    workflowId: 'workflow.product.registry.manage',
    ownerAgent: 'nova-operations-agent',
    content: `Products are governed separately from page copy.
- **Add Product:** Creates a new draft product record.
- **Publish Product:** Marks the product to be included in the next live publish.
- **Required fields for live visibility:** Title, slug, valid price, image, and alt text.
- **Owner-safe actions:** Add, stage, edit, and publish products manually.
- **Escalate when:** Product routing fails, storage is blocked, or published data does not refresh after a verified publish.`,
    relatedHelpIds: ['help.action.addProduct', 'help.action.publishProduct'],
    relatedTroubleshootingIds: ['issue.product.hidden'],
    lawReferences: ['LAW-0001', 'LAW-0009'],
    printable: true,
  },
  {
    sectionId: 'manual.section.agents',
    title: 'I. Agents Guide',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    workflowId: 'workflow.agent.proposal.review',
    ownerAgent: 'agent-lee-prime',
    content: `Your AI Workforce operates strictly under LAW-0005 (Proposal-Before-Mutation).
- **Asking for help:** Open Ask Agents and describe the issue clearly.
- **Preview Proposal:** Review exactly what would change before anything is applied.
- **Apply to Draft:** Accepts the proposal into your draft workspace only.
- **Reject Proposal:** Cancels the proposal with no draft mutation.
- **Publishing:** Agents cannot publish live. Manual publish is always required.`,
    relatedHelpIds: ['help.action.previewProposal', 'help.action.applyToDraft', 'help.action.rejectProposal', 'help.ui.inspectAgent'],
    relatedTroubleshootingIds: ['issue.proposal.failed'],
    lawReferences: ['LAW-0001', 'LAW-0005'],
    printable: true,
  },
  {
    sectionId: 'manual.section.publishing',
    title: 'K. Publishing Guide',
    screenId: 'ADMIN_PUBLISHING_CONSOLE',
    workflowId: 'workflow.publish.production',
    ownerAgent: 'agent-lee-prime',
    content: `All content and product edits stay in Draft until you publish.
- **Draft Preview:** Shows unpublished staging changes.
- **Published Preview:** Shows what customers currently see.
- **Publish Live:** Pushes the current draft set to the live public data store.
- **Blockers:** Publishing is disabled if runtime authority is read-only or configuration is incomplete.`,
    relatedHelpIds: ['help.action.publishLive', 'help.ui.draftPreview', 'help.ui.publishedPreview', 'help.action.saveDraft'],
    relatedTroubleshootingIds: ['issue.publish.disabled', 'issue.content.not.updating'],
    lawReferences: ['LAW-0001', 'LAW-0011'],
    printable: true,
  },
  {
    sectionId: 'manual.section.growth',
    title: 'L. Growth Lanes Guide',
    screenId: 'ADMIN_SETTINGS_CENTER',
    workflowId: 'workflow.settings.growth_lanes',
    ownerAgent: 'avion-orchestrator',
    content: `System expansion is governed by visual lanes.
- **Green Lane:** Safe owner customization such as themes, content, and products.
- **Yellow Lane:** Governed expansion requiring explicit configuration, MCP setup, or approval.
- **Red Lane:** Blocked actions that bypass security or owner approval.
- **Run Audit:** Use the audit action to verify governed state before trusting a major change.`,
    relatedHelpIds: ['help.action.runAudit'],
    relatedTroubleshootingIds: ['issue.mcp.missing'],
    lawReferences: ['LAW-0001', 'LAW-0017'],
    printable: true,
  },
  {
    sectionId: 'manual.section.rules',
    title: 'N. What You Can and Cannot Do',
    screenId: 'ADMIN_SETTINGS_CENTER',
    workflowId: 'workflow.owner.education.rules',
    ownerAgent: 'shield-governor-agent',
    content: `**Owner CAN:** Edit content, change themes, manage products, ask agents for proposals, apply approved proposals to draft, publish manually, and inspect governed traces.
**Owner CANNOT:** Remove LeeWay IDs, allow agents to publish directly, bypass audit, fake MCP connections, disable core laws, or remove security boundaries.`,
    relatedHelpIds: ['help.ui.viewTrace'],
    relatedTroubleshootingIds: ['issue.authority.blocked'],
    lawReferences: ['LAW-0001', 'LAW-0015'],
    printable: true,
  },
  {
    sectionId: 'manual.section.agent.fix',
    title: 'O. How Agents Fix Problems',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    workflowId: 'workflow.agent.issue_intake',
    ownerAgent: 'avion-orchestrator',
    content: `When you encounter an issue, ask the AI Workforce for help through a governed skill flow.

Example: "My image is not showing on the public site."

1. Open AdminOS.
2. Open the live preview or the Agents workspace.
3. Describe the issue in Ask Agents.
4. Review the selected skill and diagnostic checklist.
5. Review the proposal and before/after changes.
6. Apply to Draft only if the proposal looks correct.
7. Verify the change in Draft Preview.
8. Publish manually when ready.`,
    relatedHelpIds: ['help.action.previewProposal', 'help.action.applyToDraft'],
    relatedTroubleshootingIds: ['issue.image.broken', 'issue.proposal.failed'],
    lawReferences: ['LAW-0001', 'LAW-0005'],
    printable: true,
  },
  {
    sectionId: 'manual.section.agent.selected.area',
    title: 'P. Changing A Selected Preview Area With Agents',
    screenId: 'ADMIN_PORTAL',
    workflowId: 'workflow.preview.selected_area.agent_request',
    ownerAgent: 'agent-lee-prime',
    content: `You can click real preview regions and ask agents to change that exact governed area.

Examples:
- Put this image here.
- Change this button text.
- Change this section background.
- Fix why this image is not showing.

Process:
1. Click the area in Live Preview.
2. Review the selected region details in the inspector.
3. Enter your request under Ask Agents.
4. Click Preview Proposal.
5. Review diagnostics and before/after values.
6. Apply to Draft only if you approve the proposal.
7. Verify Draft Preview.
8. Publish manually when ready.`,
    relatedHelpIds: ['help.ui.openLivePreview', 'help.action.previewProposal', 'help.action.applyToDraft'],
    relatedTroubleshootingIds: ['issue.image.broken', 'issue.content.not.updating'],
    lawReferences: ['LAW-0001', 'LAW-0005', 'LAW-0016'],
    printable: true,
  },
  {
    sectionId: 'manual.section.troubleshooting',
    title: 'Q. Troubleshooting And Escalation',
    screenId: 'ADMIN_SETTINGS_CENTER',
    workflowId: 'workflow.owner.education.troubleshooting',
    ownerAgent: 'shield-governor-agent',
    content: `Use the Troubleshooting Guide when something feels blocked, stale, or broken.
- **Owner can fix:** Follow the listed owner-safe steps first.
- **Ask this agent first:** Start with the listed agent before escalating.
- **Developer escalation required:** If credentials, storage, runtime authority, MCP configuration, or build state are blocked, stop and escalate instead of forcing a workaround.
- **Verify safely:** Compare Draft Preview and Published Preview before publishing any recovery change.`,
    relatedHelpIds: ['help.action.runAudit', 'help.ui.viewTrace'],
    relatedTroubleshootingIds: [
      'issue.publish.disabled',
      'issue.proposal.failed',
      'issue.content.not.updating',
      'issue.product.hidden',
      'issue.image.broken',
      'issue.authority.blocked',
      'issue.mcp.missing',
      'issue.vscode.disconnected',
      'issue.admin.crash',
    ],
    lawReferences: ['LAW-0001', 'LAW-0009', 'LAW-0013'],
    printable: true,
  },
];

export function getManualSection(sectionId: string): ManualSection | undefined {
  return LeeWayOwnerManualRegistry.find((section) => section.sectionId === sectionId);
}
