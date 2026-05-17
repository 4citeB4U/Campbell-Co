/*
LEEWAY HEADER - DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.COMPLIANCE_CHECK.MAIN

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

DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = compliance-check - governed module
WHY = Provide developers with a pre-submit compliance validation tool
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = .leeway/scripts/compliance-check.mjs
WHEN = 2026-05-17
HOW = Static repository validation for LeeWay metadata and owner-education requirements

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const standardsRoot = path.resolve(__dirname, '..');

const SUPPORTED_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const DEFAULT_IGNORE = ['node_modules', '.git', 'dist', 'coverage', '__quarantine__', 'reports'];

async function checkFileCompliance(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  const issues = [];
  const isSourceFile = filePath.endsWith('.ts') || filePath.endsWith('.tsx');

  if (!content.includes('LEEWAY HEADER')) {
    issues.push({ severity: 'critical', check: 'header', message: 'Missing LEEWAY HEADER' });
  }
  if (!content.includes('TAG:')) {
    issues.push({ severity: 'critical', check: 'tag', message: 'Missing TAG metadata' });
  }
  if (!content.includes('REGION:')) {
    issues.push({ severity: 'critical', check: 'region', message: 'Missing REGION designation' });
  }
  if (!content.includes('COLOR_ONION_HEX:')) {
    issues.push({ severity: 'high', check: 'color_onion', message: 'Missing COLOR_ONION_HEX layer identity' });
  }
  if (!content.includes('ICON_ASCII:')) {
    issues.push({ severity: 'medium', check: 'icon', message: 'Missing ICON_ASCII metadata' });
  }
  if (!content.includes('AGENTS:')) {
    issues.push({ severity: 'high', check: 'agents', message: 'Missing AGENTS responsibility mapping' });
  }
  if (!content.includes('DISCOVERY_PIPELINE:')) {
    issues.push({ severity: 'high', check: 'pipeline', message: 'Missing DISCOVERY_PIPELINE' });
  }
  const has5WH = ['WHAT', 'WHY', 'WHO', 'WHERE', 'WHEN', 'HOW'].every((entry) => content.includes(`${entry} =`));
  if (!has5WH) {
    issues.push({ severity: 'high', check: '5wh', message: '5WH section incomplete' });
  }

  if (isSourceFile) {
    const hasSilentFallback = content.includes('localStorage fallback') || content.includes('simulated missing Firebase') || content.includes('demo mode fallback');
    if (hasSilentFallback) {
      issues.push({
        severity: 'critical',
        check: 'sovereignty',
        message: 'Anonymous silent fallback or simulated missing Firestore mode detected. Use explicit RuntimeAuthorityMode classification.',
      });
    }

    const hasRunButtonLabel = /actionLabel[^}]*["']Run["']/.test(content) || /\{['"`]Run['"`]\}/.test(content) || />Run<\/button>/.test(content);
    if (hasRunButtonLabel) {
      issues.push({
        severity: 'critical',
        check: 'law_0005_run_button',
        message: 'LAW-0005 VIOLATION: Agent action button labeled "Run" found. Must be "Preview Proposal".',
      });
    }

    const hasLegacyOnApprove = /onApprove=\{[^}]+\}/.test(content) && !content.includes('onRequestProposal');
    if (hasLegacyOnApprove) {
      issues.push({
        severity: 'critical',
        check: 'law_0005_legacy_approve',
        message: 'LAW-0005 VIOLATION: Legacy onApprove prop detected without proposal guard.',
      });
    }

    if (content.includes('publishDirectly: true') || content.includes("publishDirectly:'true'")) {
      issues.push({
        severity: 'critical',
        check: 'law_0005_publish_directly',
        message: 'LAW-0005 VIOLATION: Agent proposal has publishDirectly: true.',
      });
    }
  }

  if (filePath.endsWith('AdminSettings.tsx') && !content.includes('OwnerManual')) {
    issues.push({
      severity: 'high',
      check: 'law_0001_missing_manual',
      message: 'AdminSettings must mount OwnerManual.',
    });
  }

  if (filePath.endsWith('AdminPortal.tsx') && !content.includes('OnboardingTour')) {
    issues.push({
      severity: 'high',
      check: 'law_0001_missing_tour',
      message: 'AdminPortal must mount OnboardingTour.',
    });
  }

  if (filePath.endsWith('LeeWayHelpRegistry.ts') && (!content.includes('manualSectionId') || !content.includes('printable'))) {
    issues.push({
      severity: 'critical',
      check: 'law_0001_help_schema',
      message: 'Help registry missing required traceability fields.',
    });
  }

  if (filePath.endsWith('LeeWayOwnerManualRegistry.ts')) {
    ['screenId:', 'workflowId:', 'ownerAgent:', 'printable:'].forEach((field) => {
      if (!content.includes(field)) {
        issues.push({
          severity: 'critical',
          check: 'manual_traceability',
          message: `Owner manual registry missing ${field.replace(':', '')} metadata.`,
        });
      }
    });
  }

  if (filePath.endsWith('LeeWayOnboardingRegistry.ts')) {
    ['stepId:', 'targetSelector:', 'screenId:', 'workflowId:', 'ownerAgent:', 'lawReferences:', 'printable:'].forEach((field) => {
      if (!content.includes(field)) {
        issues.push({
          severity: 'critical',
          check: 'onboarding_traceability',
          message: `Onboarding registry missing ${field.replace(':', '')} metadata.`,
        });
      }
    });
  }

  if (filePath.endsWith('OwnerManual.tsx')) {
    if (!content.includes('## Table of Contents')) {
      issues.push({ severity: 'critical', check: 'manual_export_toc', message: 'Markdown manual export missing TOC.' });
    }
    if (!content.includes('## Troubleshooting Guide')) {
      issues.push({ severity: 'critical', check: 'manual_export_troubleshooting', message: 'Markdown manual export missing troubleshooting section.' });
    }
    if (!content.includes('Developer escalation required')) {
      issues.push({ severity: 'critical', check: 'manual_export_escalation', message: 'Troubleshooting escalation guidance is not rendered/exported.' });
    }
  }

  if (filePath.endsWith('OnboardingTour.tsx')) {
    if (!content.includes('action.onboarding.skip')) {
      issues.push({ severity: 'critical', check: 'missing_skip_tour_button', message: 'Missing Skip Tour button in onboarding.' });
    }
    if (!content.includes('This area is unavailable in this build or not visible on this screen.')) {
      issues.push({ severity: 'critical', check: 'missing_onboarding_fallback', message: 'Missing onboarding unavailable-target fallback message.' });
    }
  }

  if ((filePath.endsWith('AdminPortal.tsx') || filePath.endsWith('AdminSettings.tsx')) && !content.includes('action.onboarding.start')) {
    issues.push({ severity: 'critical', check: 'missing_start_onboarding_button', message: 'Missing Start Onboarding button.' });
  }

  if (filePath.endsWith('LivePublicPreview.tsx')) {
    if (content.includes('Synthesize Optimization')) {
      issues.push({ severity: 'critical', check: 'legacy_synthesize_text', message: 'Legacy "Synthesize Optimization" text detected.' });
    }
    if (content.includes('setAiResponse') || content.includes("handleFieldChange('home.hero")) {
      issues.push({ severity: 'critical', check: 'preview_direct_mutation', message: 'Direct draft mutation from live preview AI inspector detected.' });
    }
  }

  return {
    filePath,
    relativePath: path.relative(standardsRoot, filePath),
    compliant: issues.filter((issue) => issue.severity === 'critical').length === 0,
    issues,
  };
}

async function walkDirectory(dir, extensions) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (DEFAULT_IGNORE.includes(entry.name) || entry.name === 'build' || entry.name === '.next') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkDirectory(fullPath, extensions)));
    } else if (extensions.has(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }

  return results;
}

export async function runComplianceCheck(target = process.cwd()) {
  const stat = await fs.stat(target);
  const files = stat.isFile() ? [target] : await walkDirectory(target, SUPPORTED_EXTENSIONS);
  const results = [];

  for (const file of files) {
    results.push(await checkFileCompliance(file));
  }

  const fileContents = new Map();
  for (const file of files) {
    fileContents.set(path.basename(file), await fs.readFile(file, 'utf8'));
  }

  const globalIssues = [];
  const allContent = Array.from(fileContents.values()).join('\n');
  const adminDashboardContent = fileContents.get('AdminDashboard.tsx') || '';
  const livePreviewContent = fileContents.get('LivePublicPreview.tsx') || '';
  const adminPortalContent = fileContents.get('AdminPortal.tsx') || '';
  const ownerManualRegistryContent = fileContents.get('LeeWayOwnerManualRegistry.ts') || '';
  const helpRegistryContent = fileContents.get('LeeWayHelpRegistry.ts') || '';
  const runtimeIdentityContent = fileContents.get('LeeWayRuntimeIdentity.ts') || '';
  const skillRuntimeContent = fileContents.get('LeeWaySkillRuntime.ts') || '';
  const skillRouterContent = fileContents.get('LeeWaySkillRouter.ts') || '';
  const diagnosticRunnerContent = fileContents.get('LeeWayDiagnosticRunner.ts') || '';
  const proposalBuilderContent = fileContents.get('LeeWayProposalBuilder.ts') || '';
  const draftPatchApplierContent = fileContents.get('LeeWayDraftPatchApplier.ts') || '';

  if (!adminDashboardContent.includes('data-leeway-id="admin.dashboard.main"')) {
    globalIssues.push({ severity: 'critical', check: 'missing_onboarding_target_dashboard', message: 'Missing onboarding target admin.dashboard.main.' });
  }
  if (!livePreviewContent.includes('data-leeway-id="admin.preview.panel"')) {
    globalIssues.push({ severity: 'critical', check: 'missing_onboarding_target_preview', message: 'Missing onboarding target admin.preview.panel.' });
  }
  if (!adminPortalContent.includes('data-leeway-id="admin.sidebar.agents"')) {
    globalIssues.push({ severity: 'critical', check: 'missing_onboarding_target_agents', message: 'Missing onboarding target admin.sidebar.agents.' });
  }

  [
    'help.action.publishLive',
    'help.action.saveDraft',
    'help.action.applyToDraft',
    'help.action.rejectProposal',
    'help.action.previewProposal',
    'help.action.addProduct',
    'help.action.publishProduct',
    'help.ui.themeColor',
    'help.ui.openLivePreview',
    'help.ui.draftPreview',
    'help.ui.publishedPreview',
    'help.action.runAudit',
    'help.ui.inspectAgent',
    'help.ui.viewTrace',
  ].forEach((helpId) => {
    if (!allContent.includes(`helpId="${helpId}"`) && !allContent.includes(`helpId='${helpId}'`)) {
      globalIssues.push({ severity: 'critical', check: 'missing_help_surface', message: `Help registry entry not surfaced by LeeWayHelpTrigger: ${helpId}.` });
    }
  });

  ['manual.section.theme', 'manual.section.products', 'manual.section.troubleshooting'].forEach((sectionId) => {
    if (!ownerManualRegistryContent.includes(sectionId) || !helpRegistryContent.includes(sectionId)) {
      globalIssues.push({ severity: 'critical', check: 'dangling_manual_reference', message: `Dangling manual section reference detected for ${sectionId}.` });
    }
  });

  if (!runtimeIdentityContent.includes('type LeeWayAgentActionIdentity')) {
    globalIssues.push({ severity: 'critical', check: 'missing_action_identity_type', message: 'Agent action runtime identity type is missing.' });
  }
  if (!runtimeIdentityContent.includes('type LeeWayAgentRuntimeState')) {
    globalIssues.push({ severity: 'critical', check: 'missing_runtime_state_type', message: 'Agent runtime state identity type is missing.' });
  }
  if (!skillRuntimeContent.includes('actionIdentity: LeeWayAgentActionIdentity')) {
    globalIssues.push({ severity: 'critical', check: 'missing_action_identity_runtime', message: 'Runtime result missing LeeWay action identity.' });
  }
  if (!skillRuntimeContent.includes('runtimeState: LeeWayAgentRuntimeState')) {
    globalIssues.push({ severity: 'critical', check: 'missing_runtime_state_runtime', message: 'Runtime result missing LeeWay runtime state.' });
  }
  if (!skillRouterContent.includes('workflowId:')) {
    globalIssues.push({ severity: 'critical', check: 'missing_route_workflow_id', message: 'Skill route is missing workflow ID metadata.' });
  }
  if (!diagnosticRunnerContent.includes('diagnosticId:')) {
    globalIssues.push({ severity: 'critical', check: 'missing_diagnostic_id', message: 'Diagnostic identity is missing diagnosticId.' });
  }
  if (!proposalBuilderContent.includes('proposalTag')) {
    globalIssues.push({ severity: 'critical', check: 'missing_proposal_tag', message: 'Proposal identity is missing proposalTag.' });
  }
  if (!proposalBuilderContent.includes('beforeValues') || !proposalBuilderContent.includes('afterValues')) {
    globalIssues.push({ severity: 'critical', check: 'missing_proposal_before_after', message: 'Proposal identity is missing before/after values.' });
  }
  if (!draftPatchApplierContent.includes('draft-patch-apply-requested')) {
    globalIssues.push({ severity: 'critical', check: 'missing_draft_patch_telemetry', message: 'Draft patch telemetry is not recorded.' });
  }
  if (!runtimeIdentityContent.includes('streamId: string')) {
    globalIssues.push({ severity: 'critical', check: 'missing_telemetry_stream_id', message: 'Telemetry event identity is missing streamId.' });
  }
  if (!runtimeIdentityContent.includes('lawReferences: string[]')) {
    globalIssues.push({ severity: 'critical', check: 'missing_audit_law_references', message: 'Audit or action identities are missing law references.' });
  }
  if (!skillRuntimeContent.includes('toolUsageRecords')) {
    globalIssues.push({ severity: 'critical', check: 'missing_tool_usage_records', message: 'MCP/tool use is not recorded in the runtime.' });
  }
  if (skillRuntimeContent.includes('telemetryEvents: string[]') || skillRuntimeContent.includes('auditEvents: string[]')) {
    globalIssues.push({ severity: 'critical', check: 'generic_runtime_events', message: 'Runtime still uses generic string telemetry/audit arrays.' });
  }
  if (skillRuntimeContent.includes('console.log') || draftPatchApplierContent.includes('console.log') || fileContents.get('LeeWayRuntime.ts')?.includes('console.log')) {
    globalIssues.push({ severity: 'critical', check: 'generic_console_logs_used_as_telemetry', message: 'Generic console logs detected in runtime identity flow.' });
  }
  if (skillRuntimeContent.includes('workflow.media.assign') && !skillRuntimeContent.includes('selectedLeewayId')) {
    globalIssues.push({ severity: 'critical', check: 'missing_selected_region_runtime_metadata', message: 'Selected-region workflow is missing selectedLeewayId metadata.' });
  }
  if (!proposalBuilderContent.includes('publishDirectly: false')) {
    globalIssues.push({ severity: 'critical', check: 'missing_publish_directly_false', message: 'Proposal is missing publishDirectly false.' });
  }
  if (!proposalBuilderContent.includes('requiresHumanApproval: true')) {
    globalIssues.push({ severity: 'critical', check: 'missing_requires_human_approval_true', message: 'Proposal is missing requiresHumanApproval true.' });
  }

  const summary = {
    scanned: results.length,
    compliant: results.filter((result) => result.compliant).length,
    issues: results.filter((result) => !result.compliant).length,
    criticalIssues: results.flatMap((result) => result.issues).filter((issue) => issue.severity === 'critical').length + globalIssues.length,
    results,
    globalIssues,
  };

  console.log('\n=== LeeWay Sovereign Compliance Audit ===\n');
  console.log(`Files Scanned: ${summary.scanned}`);
  console.log(`Compliant: ${summary.compliant}`);
  console.log(`Critical Violations: ${summary.criticalIssues}\n`);

  if (summary.criticalIssues > 0) {
    console.log('❌ SOVEREIGN AUDIT FAILED\n');
    for (const result of results.filter((entry) => !entry.compliant)) {
      console.log(`\n${result.relativePath}`);
      for (const issue of result.issues.filter((entry) => entry.severity === 'critical')) {
        console.log(`  ❌ [${issue.check}] ${issue.message}`);
      }
      for (const issue of result.issues.filter((entry) => entry.severity === 'high')) {
        console.log(`  ⚠️  [${issue.check}] ${issue.message}`);
      }
    }
    for (const issue of globalIssues) {
      console.log(`\nGLOBAL`);
      console.log(`  ❌ [${issue.check}] ${issue.message}`);
    }
    return { ok: false, summary };
  }

  console.log('✅ SYSTEM IS SOVEREIGN AND COMPLIANT');
  return { ok: true, summary };
}

async function main() {
  const target = process.argv[2] || process.cwd();
  const result = await runComplianceCheck(target);
  process.exit(result.ok ? 0 : 1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('Audit error:', error.message);
    process.exit(1);
  });
}
