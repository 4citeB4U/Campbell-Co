/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FFDE59
FLUO=#FFD12A
PASTEL=#FFF2CC

ICON_ASCII:
family=lucide
glyph=help-circle

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.LEEWAY.HELP_REGISTRY.MAIN
DESCRIPTION: Governed help registry outlining what UI elements do and mapping them to manual sections.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = LeeWayHelpRegistry.ts — central source for contextual help content
WHY = A governed system must explain itself to the owner (LAW-0001)
WHO = Lee Prime / Atlas Memory Agent
WHERE = src/core/leeway/LeeWayHelpRegistry.ts
WHEN = 2026-05-17
HOW = Used by UI components to display hover tooltips and link to manual sections

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

export type LeeWayHelpItem = {
  helpId: string;
  title: string;
  summary: string;
  body: string;
  aliases?: string[];
  screenId: string;
  targetLeewayId?: string;
  actionId?: string;
  workflowId?: string;
  ownerAgent: string;
  lawReferences: string[];
  manualSectionId: string;
  relatedHelpIds: string[];
  troubleshootingIds: string[];
  printable: boolean;
};

export const LeeWayHelpRegistry: LeeWayHelpItem[] = [
  {
    helpId: 'help.action.publishLive',
    title: 'Publish Live',
    summary: 'Commits all draft changes to the production storefront.',
    body: 'Clicking Publish Live will sync your local draft content with the public database. This action makes changes instantly visible to customers. Ensure you have reviewed the Live Preview before executing.',
    aliases: ['Publish Staged Content'],
    screenId: 'ADMIN_PUBLISHING_CONSOLE',
    actionId: 'action.publish.commit',
    workflowId: 'workflow.publish.production',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001', 'LAW-0010', 'LAW-0011'],
    manualSectionId: 'manual.section.publishing',
    relatedHelpIds: ['help.action.applyToDraft'],
    troubleshootingIds: ['issue.publish.disabled'],
    printable: true,
  },
  {
    helpId: 'help.action.applyToDraft',
    title: 'Apply to Draft',
    summary: 'Accepts an agent proposal and applies changes to the draft view.',
    body: 'This applies proposed changes to your visual preview. It does not publish them live. You must still navigate to the Publishing Console to push these changes to production.',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    actionId: 'action.draft.apply',
    workflowId: 'workflow.proposal.apply',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0005', 'LAW-0001'],
    manualSectionId: 'manual.section.agents',
    relatedHelpIds: ['help.action.publishLive'],
    troubleshootingIds: ['issue.proposal.failed'],
    printable: true,
  },
  {
    helpId: 'help.ui.themeColor',
    title: 'Theme Color',
    summary: 'Changes the primary brand color across AdminOS and Public Storefront.',
    body: 'This setting modifies the root CSS variables instantly. It affects both your control panel and the live website preview to ensure perfect synchronization.',
    aliases: ['Change Theme Color', 'Primary Color'],
    screenId: 'ADMIN_SETTINGS_CENTER',
    targetLeewayId: 'settings.theme.primaryColor',
    ownerAgent: 'aura-media-agent',
    lawReferences: ['LAW-0016', 'LAW-0001'],
    manualSectionId: 'manual.section.theme',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.action.saveDraft',
    title: 'Save Draft',
    summary: 'Saves your current edits to the local browser storage.',
    body: 'This does not publish to the live site. It only saves your progress so you can review it or ask an agent to inspect it.',
    screenId: 'ADMIN_PORTAL',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.publishing',
    relatedHelpIds: ['help.action.publishLive'],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.action.rejectProposal',
    title: 'Reject Proposal',
    summary: 'Dismisses an agent\'s proposal without making changes.',
    body: 'Under LAW-0005, you have sovereign authority to reject any agent proposal. This action is safe and leaves no trace on your draft.',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    ownerAgent: 'shield-governor-agent',
    lawReferences: ['LAW-0005', 'LAW-0001'],
    manualSectionId: 'manual.section.agents',
    relatedHelpIds: ['help.action.applyToDraft'],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.action.previewProposal',
    title: 'Preview Proposal',
    summary: 'Opens the detailed breakdown of what an agent wants to change.',
    body: 'Clicking this is completely safe and makes no changes. It simply opens a modal showing exactly what the agent intends to do, allowing you to review before deciding.',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0005'],
    manualSectionId: 'manual.section.agents',
    relatedHelpIds: ['help.action.applyToDraft', 'help.action.rejectProposal'],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.action.addProduct',
    title: 'Add Product',
    summary: 'Creates a new empty product in the registry.',
    body: 'This creates a draft product. Customers will not see it until you fill out the details, set it to Published, and click Publish Live in the console.',
    aliases: ['New Addition'],
    screenId: 'ADMIN_PRODUCT_REGISTRY',
    ownerAgent: 'nova-operations-agent',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.products',
    relatedHelpIds: [],
    troubleshootingIds: ['issue.product.hidden'],
    printable: true,
  },
  {
    helpId: 'help.action.publishProduct',
    title: 'Publish Product',
    summary: 'Flags a draft product to be included in the next live publish.',
    body: 'This sets the product visibility to Published, but you must still go to the Publishing Console to push the database update to the live site.',
    aliases: ['Edit / Publish'],
    screenId: 'ADMIN_PRODUCT_REGISTRY',
    ownerAgent: 'nova-operations-agent',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.products',
    relatedHelpIds: ['help.action.publishLive'],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.ui.openLivePreview',
    title: 'Open Live Preview',
    summary: 'Opens the interactive website preview panel.',
    body: 'Use this to view your storefront exactly as a customer would. You can click on text directly in this preview to edit it.',
    screenId: 'ADMIN_PORTAL',
    ownerAgent: 'aura-media-agent',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.intro',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.ui.draftPreview',
    title: 'Draft Preview',
    summary: 'Shows the website with all your unpublished changes.',
    body: 'This is a sandbox view. None of the changes shown here are visible to the public until you hit Publish Live.',
    screenId: 'ADMIN_PUBLISHING_CONSOLE',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.publishing',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.ui.publishedPreview',
    title: 'Published Preview',
    summary: 'Shows the exact website currently live to the public.',
    body: 'Use this to compare against your Draft Preview to see exactly what you are about to change.',
    screenId: 'ADMIN_PUBLISHING_CONSOLE',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001'],
    manualSectionId: 'manual.section.publishing',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.action.runAudit',
    title: 'Run Audit',
    summary: 'Executes the sovereign compliance check across the system.',
    body: 'Runs the leeway:audit script to ensure no developer has bypassed security laws or created un-traceable components.',
    aliases: ['Verify System Compile'],
    screenId: 'ADMIN_SETTINGS_CENTER',
    ownerAgent: 'shield-governor-agent',
    lawReferences: ['LAW-0001', 'LAW-0017'],
    manualSectionId: 'manual.section.troubleshooting',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.ui.inspectAgent',
    title: 'Inspect Agent',
    summary: 'View an agent\'s capabilities, telemetry, and laws.',
    body: 'Click any agent in the workforce roster to see exactly what they are allowed to do and view their live thought process logs.',
    screenId: 'ADMIN_AGENTS_COMMAND_CENTER',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001', 'LAW-0015'],
    manualSectionId: 'manual.section.agents',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  },
  {
    helpId: 'help.ui.viewTrace',
    title: 'View Trace',
    summary: 'Inspect the LeeWay ID and schema path of an element.',
    body: 'Every interactive element in the AdminOS is fully traceable. Use this to see the exact database path and governing law for an input.',
    screenId: 'ADMIN_PORTAL',
    ownerAgent: 'shield-governor-agent',
    lawReferences: ['LAW-0002'],
    manualSectionId: 'manual.section.rules',
    relatedHelpIds: [],
    troubleshootingIds: [],
    printable: true,
  }
];

export function getHelpItem(helpId: string): LeeWayHelpItem | undefined {
  return LeeWayHelpRegistry.find((item) => item.helpId === helpId);
}
