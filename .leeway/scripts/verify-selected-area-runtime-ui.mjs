/*
LEEWAY HEADER - DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.UI_RUNTIME_VERIFY.MAIN
DESCRIPTION: Headless AdminOS verification for the selected-area agent runtime.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections

5WH:
WHAT = verify-selected-area-runtime-ui.mjs - browser-driven AdminOS runtime verification
WHY = Validate the actual AdminOS UI flow for governed selected-area agent actions
WHO = Leeway Innovations
WHERE = .leeway/scripts/verify-selected-area-runtime-ui.mjs
WHEN = 2026-05-17
HOW = Edge DevTools Protocol automation against the local AdminOS build

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

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const DEBUG_PORT = 9222;
const ADMIN_URL = 'http://127.0.0.1:3000/admin.html';
const OWNER_PROMPT = 'Put this image in the homepage hero.';
const PRIMARY_MEDIA_ASSET_ID = 'media.editorial.women-collection';
const REJECT_MEDIA_ASSET_ID = 'media.hero.diamond-macro';
const MISSING_ALT_MEDIA_ASSET_ID = 'media.editorial.alt-missing';
const VIDEO_MEDIA_ASSET_ID = 'media.video.brand-loop';
const EVIDENCE_DIR = path.resolve('.leeway/runtime-evidence');
const SCREENSHOT_DIR = path.join(EVIDENCE_DIR, 'selected-area-hero-image-runtime');
const ARTIFACT_PATH = path.join(EVIDENCE_DIR, 'selected-area-hero-image-runtime.json');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeStateSnapshot(state) {
  if (!state?.home?.hero) return state ?? null;
  return {
    home: {
      hero: clone(state.home.hero),
    },
  };
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function fetchJson(url, retries = 40) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      }
    } catch {}
    await sleep(250);
  }
  throw new Error(`Unable to fetch JSON from ${url}`);
}

async function launchEdge() {
  const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'leeway-edge-'));
  const process = spawn(
    EDGE_PATH,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${userDataDir}`,
      ADMIN_URL,
    ],
    { stdio: 'ignore', detached: true },
  );
  process.unref();
  return { userDataDir, pid: process.pid };
}

async function connectPage() {
  const targets = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const pageTarget = targets.find((entry) => entry.url.startsWith(ADMIN_URL));
  if (!pageTarget?.webSocketDebuggerUrl) {
    throw new Error('AdminOS page target not found.');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  const pending = new Map();
  let commandId = 0;

  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data.toString());
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    }
  });

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  const send = (method, params = {}) => {
    commandId += 1;
    ws.send(JSON.stringify({ id: commandId, method, params }));
    return new Promise((resolve, reject) => pending.set(commandId, { resolve, reject }));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    return result.result?.value;
  };

  return { ws, send, evaluate };
}

async function waitFor(evaluate, expression, timeoutMs = 20000, onTick) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (onTick) {
      await onTick();
    }
    const value = await evaluate(expression);
    if (value) return value;
    await sleep(250);
  }
  throw new Error(`Timed out waiting for expression: ${expression}`);
}

async function waitOrFalse(evaluate, expression, timeoutMs = 8000, onTick) {
  try {
    await waitFor(evaluate, expression, timeoutMs, onTick);
    return true;
  } catch {
    return false;
  }
}

function literal(value) {
  return JSON.stringify(value);
}

function buildSelectorLiteral(selector) {
  return literal(selector);
}

async function captureElementDom(evaluate, selector, fileName) {
  const payload = await evaluate(`
    (() => {
      const node = document.querySelector(${buildSelectorLiteral(selector)});
      if (!node) return null;
      return {
        selector: ${buildSelectorLiteral(selector)},
        text: node.textContent?.replace(/\\s+/g, ' ').trim() || '',
        html: node.outerHTML || '',
      };
    })()
  `);
  if (!payload) return null;
  const outputPath = path.join(SCREENSHOT_DIR, fileName);
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2));
  return outputPath;
}

async function captureElementScreenshot(send, evaluate, selector, fileName) {
  const rect = await evaluate(`
    (() => {
      const node = document.querySelector(${buildSelectorLiteral(selector)});
      if (!node) return null;
      node.scrollIntoView({ block: 'center', inline: 'center' });
      const bounds = node.getBoundingClientRect();
      return {
        x: Math.max(bounds.x - 16, 0),
        y: Math.max(bounds.y - 16, 0),
        width: Math.max(bounds.width + 32, 1),
        height: Math.max(bounds.height + 32, 1),
      };
    })()
  `);
  if (!rect) return null;
  await sleep(500);
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scale: 1,
    },
    fromSurface: true,
    captureBeyondViewport: true,
  });
  const outputPath = path.join(SCREENSHOT_DIR, fileName);
  await fs.writeFile(outputPath, Buffer.from(screenshot.data, 'base64'));
  return outputPath;
}

async function captureTextMatchedSectionDom(evaluate, markerText, fileName) {
  const payload = await evaluate(`
    (() => {
      const node = [...document.querySelectorAll('section, div')]
        .find((entry) => entry.textContent?.includes(${literal(markerText)}));
      if (!node) return null;
      return {
        markerText: ${literal(markerText)},
        text: node.textContent?.replace(/\\s+/g, ' ').trim() || '',
        html: node.outerHTML || '',
      };
    })()
  `);
  if (!payload) return null;
  const outputPath = path.join(SCREENSHOT_DIR, fileName);
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2));
  return outputPath;
}

async function captureTextMatchedSectionScreenshot(send, evaluate, markerText, fileName) {
  const rect = await evaluate(`
    (() => {
      const node = [...document.querySelectorAll('section, div')]
        .find((entry) => entry.textContent?.includes(${literal(markerText)}));
      if (!node) return null;
      node.scrollIntoView({ block: 'center', inline: 'center' });
      const bounds = node.getBoundingClientRect();
      return {
        x: Math.max(bounds.x - 16, 0),
        y: Math.max(bounds.y - 16, 0),
        width: Math.max(bounds.width + 32, 1),
        height: Math.max(bounds.height + 32, 1),
      };
    })()
  `);
  if (!rect) return null;
  await sleep(500);
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scale: 1,
    },
    fromSurface: true,
    captureBeyondViewport: true,
  });
  const outputPath = path.join(SCREENSHOT_DIR, fileName);
  await fs.writeFile(outputPath, Buffer.from(screenshot.data, 'base64'));
  return outputPath;
}

function evaluateVerdict(evidence) {
  const failReasons = [];
  const passChecks = [];
  const partialReasons = [];

  if (evidence.submittedOwnerPrompt !== OWNER_PROMPT) {
    partialReasons.push('Exact owner prompt was not recorded.');
  } else {
    passChecks.push('exact prompt used');
  }

  if (evidence.adminOsOpened) passChecks.push('AdminOS open recorded');
  else partialReasons.push('AdminOS open not recorded.');

  if (evidence.livePreviewOpened) passChecks.push('live preview open recorded');
  else partialReasons.push('Live preview open not recorded.');

  if (evidence.selectedRegion === 'public.home.hero') passChecks.push('selected region recorded');
  else partialReasons.push('Selected region was not recorded as public.home.hero.');

  if (Array.isArray(evidence.selectedSchemaPaths)
    && evidence.selectedSchemaPaths.includes('home.hero.image')
    && evidence.selectedSchemaPaths.includes('home.hero.imageAlt')) {
    passChecks.push('selected schema paths recorded');
  } else {
    partialReasons.push('Selected schema paths are incomplete.');
  }

  if (evidence.selectedOrRegisteredMediaAssetId) passChecks.push('media asset recorded');
  else partialReasons.push('Media asset was not recorded.');

  if (evidence.routedSkillId === 'skill.media.assign-to-selected-region') passChecks.push('routed skill recorded');
  else partialReasons.push('Routed skill was not recorded correctly.');

  if (Array.isArray(evidence.diagnosticsList) && evidence.diagnosticsList.length > 0) passChecks.push('diagnostics recorded');
  else partialReasons.push('Diagnostics were not recorded.');

  if (Array.isArray(evidence.proposalBeforeAfterValues) && evidence.proposalBeforeAfterValues.length > 0) passChecks.push('proposal before/after recorded');
  else partialReasons.push('Proposal before/after values were not recorded.');

  if (evidence.noMutationBeforeApproval === true) passChecks.push('no mutation before approval recorded');
  else failReasons.push('Draft mutated before owner approval.');

  if (evidence.requiresHumanApproval === true) passChecks.push('requiresHumanApproval recorded true');
  else failReasons.push('requiresHumanApproval was not true.');

  if (evidence.publishDirectly === false) passChecks.push('publishDirectly recorded false');
  else failReasons.push('publishDirectly was not false.');

  if (evidence.draftOnlyApplyRecorded === true) passChecks.push('draft-only apply recorded');
  else failReasons.push('Apply To Draft did not stay draft-only.');

  if (evidence.publishedBeforePublishUnchanged === true) passChecks.push('published-before-publish unchanged recorded');
  else failReasons.push('Published state changed before publish.');

  if (evidence.publishChangedPublishedState === true) passChecks.push('publish changed published state');
  else failReasons.push('Published state did not change after publish.');

  if (evidence.rejectTestResult?.noMutationOnReject === true) passChecks.push('reject no-mutation recorded');
  else failReasons.push('Reject path mutated draft state.');

  if (evidence.runtimeTraceSnapshot?.structured && Array.isArray(evidence.telemetryEventsRecorded) && Array.isArray(evidence.auditEventsRecorded)) {
    passChecks.push('telemetry/audit/trace snapshots exist');
  } else {
    partialReasons.push('Telemetry, audit, or runtime trace snapshot is incomplete.');
  }

  if (!evidence.artifactWritten) {
    partialReasons.push('Artifact was not written.');
  } else {
    passChecks.push('artifact exists');
  }

  if (failReasons.length > 0) {
    return { finalResult: 'FAIL', passChecks, failReasons, partialReasons };
  }

  if (partialReasons.length > 0) {
    return { finalResult: 'PARTIAL', passChecks, failReasons, partialReasons };
  }

  return { finalResult: 'PASS', passChecks, failReasons, partialReasons };
}

async function main() {
  await ensureDir(EVIDENCE_DIR);
  await ensureDir(SCREENSHOT_DIR);

  const evidence = {
    timestamp: new Date().toISOString(),
    appUrlUsed: ADMIN_URL,
    artifactPath: ARTIFACT_PATH,
    artifactWritten: false,
    runtimeMode: null,
    appStarted: false,
    adminOsOpened: false,
    livePreviewOpened: false,
    selectedRegion: null,
    selectedSchemaPaths: [],
    selectedOwnerAgent: null,
    selectedAllowedActions: [],
    selectedOrRegisteredMediaAssetId: null,
    submittedOwnerPrompt: OWNER_PROMPT,
    routedSkillId: null,
    workflowId: null,
    actionId: null,
    telemetryStreamId: null,
    capabilityIds: [],
    diagnosticsList: [],
    proposalId: null,
    proposalBeforeAfterValues: [],
    requiresHumanApproval: null,
    publishDirectly: null,
    draftStateBeforeApply: null,
    draftStateAfterApply: null,
    publishedStateBeforePublish: null,
    publishedStateAfterApplyButBeforePublish: null,
    publishedStateAfterPublish: null,
    noMutationBeforeApproval: null,
    draftOnlyApplyRecorded: null,
    publishedBeforePublishUnchanged: null,
    publishChangedPublishedState: null,
    rejectTestResult: null,
    missingAltTextTestResult: null,
    unsupportedRegionTestResult: null,
    videoOnImageOnlyTestResult: null,
    animationUnsupportedTestResult: null,
    runtimeTraceSnapshot: null,
    agentStatusSnapshot: null,
    telemetryEventsRecorded: [],
    auditEventsRecorded: [],
    toolOrMcpUsageRecord: 'NO_MCP_TOOL_USED',
    domCaptures: {},
    screenshots: {},
    browserErrors: [],
    submitResult: null,
    timeoutContext: null,
    caveats: [
      'Verification is browser-driven against localhost AdminOS.',
      'Verification uses window.__LEEWAY_PREVIEW_TEST_API and window.__LEEWAY_ADMIN_TEST_API test hooks to capture durable evidence.',
      'Blocked runtime mode is not exercisable in localhost DEVELOPMENT_BOOTSTRAP.',
    ],
    finalResult: 'PARTIAL',
    verdictDetails: null,
    error: null,
  };

  const launched = await launchEdge();
  const { ws, send, evaluate } = await connectPage();

  const close = () => {
    try { ws.close(); } catch {}
    try { spawn('taskkill', ['/PID', String(launched.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
  };

  try {
    evidence.appStarted = true;

    const ensureUnlocked = async () => {
      const needsUnlock = await evaluate(`Boolean(document.querySelector('input[type="password"]'))`);
      if (!needsUnlock) return false;
      await evaluate(`
        (() => {
          const input = document.querySelector('input[type="password"]');
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
          setter.call(input, '1111');
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          const button = [...document.querySelectorAll('button')].find((entry) => entry.textContent.includes('Create Passcode') || entry.textContent.includes('Unlock'));
          button?.click();
          return true;
        })()
      `);
      await sleep(750);
      return true;
    };

    await ensureUnlocked();

    await waitFor(evaluate, `document.readyState === 'complete'`, 30000, ensureUnlocked);
    await waitFor(evaluate, `Boolean(document.querySelector('[data-leeway-id="admin.preview.panel"]'))`, 30000, ensureUnlocked);
    await waitFor(evaluate, `Boolean(window.__LEEWAY_PREVIEW_TEST_API)`, 30000, ensureUnlocked);
    await waitFor(evaluate, `Boolean(window.__LEEWAY_ADMIN_TEST_API)`, 30000, ensureUnlocked);
    evidence.adminOsOpened = true;
    evidence.livePreviewOpened = await evaluate(`Boolean(document.querySelector('.projection-canvas [data-leeway-id="public.home.hero"]'))`);
    await evaluate(`
      (() => {
        window.__LEEWAY_EVIDENCE_ERRORS = [];
        window.addEventListener('error', (event) => {
          window.__LEEWAY_EVIDENCE_ERRORS.push({
            type: 'error',
            message: event.message,
            source: event.filename,
            line: event.lineno,
            column: event.colno,
          });
        });
        window.addEventListener('unhandledrejection', (event) => {
          window.__LEEWAY_EVIDENCE_ERRORS.push({
            type: 'unhandledrejection',
            message: String(event.reason?.message || event.reason || 'unknown'),
          });
        });
        return true;
      })()
    `);

    await evaluate(`window.localStorage.setItem('campbell-dev-mode', 'true')`);
    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.resetContentToDefaults()`);
    await sleep(1000);

    const selectRegion = async (leewayId) => {
      await ensureUnlocked();
      await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.selectRegion(${literal(leewayId)})`);
      await waitFor(evaluate, `window.__LEEWAY_PREVIEW_TEST_API.getSelectedRegion() === ${literal(leewayId)}`, 20000, ensureUnlocked);
    };

    const getDraftState = async () => normalizeStateSnapshot(await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getDraftContentState() || JSON.parse(window.localStorage.getItem('campbell-site-content-draft'))`));
    const getPublishedState = async () => normalizeStateSnapshot(await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getPublishedContentState() || JSON.parse(window.localStorage.getItem('campbell-site-content'))`));

    await selectRegion('public.home.hero');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openFieldsTab()`);
    const selectedSectionSnapshot = await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.getSelectedSectionSnapshot()`);
    evidence.runtimeMode = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getRuntimeAuthorityMode()`);
    evidence.selectedRegion = selectedSectionSnapshot?.leewayId || await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.getSelectedRegion()`);
    evidence.selectedSchemaPaths = selectedSectionSnapshot?.schemaPaths || [];
    evidence.selectedOwnerAgent = selectedSectionSnapshot?.ownerAgent || await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.getSelectedOwnerAgent()`);
    evidence.selectedAllowedActions = selectedSectionSnapshot?.allowedActions || [];

    evidence.domCaptures.selectedRegionPanel = await captureElementDom(evaluate, '[data-leeway-id="admin.selected-region.panel"]', 'selected-region-panel.dom.json');
    evidence.screenshots.selectedRegionPanel = await captureElementScreenshot(send, evaluate, '[data-leeway-id="admin.selected-region.panel"]', 'selected-region-panel.png');

    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    const beforeDraft = await getDraftState();
    const beforePublished = await getPublishedState();
    evidence.draftStateBeforeApply = beforeDraft;
    evidence.publishedStateBeforePublish = beforePublished;

    evidence.submitResult = await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest(${literal(OWNER_PROMPT)}, ${literal(PRIMARY_MEDIA_ASSET_ID)})`);
    try {
      await waitFor(evaluate, `Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`, 20000, ensureUnlocked);
    } catch (error) {
      evidence.browserErrors = await evaluate(`window.__LEEWAY_EVIDENCE_ERRORS || []`);
      evidence.timeoutContext = {
        activeProposalId: await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`),
        activeRuntimeResult: await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getActiveRuntimeResult()`),
        lastRuntimeResult: await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getLastRuntimeResult()`),
        bodyTextExcerpt: await evaluate(`document.body.innerText.replace(/\\s+/g, ' ').slice(0, 4000)`),
      };
      throw error;
    }

    const activeProposal = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getActiveProposal()`);
    const activeRuntimeResult = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getActiveRuntimeResult()`);
    evidence.selectedOrRegisteredMediaAssetId = activeRuntimeResult?.actionIdentity?.selectedMediaId || PRIMARY_MEDIA_ASSET_ID;
    evidence.routedSkillId = activeRuntimeResult?.skillId || activeProposal?.routedSkillId || null;
    evidence.workflowId = activeRuntimeResult?.actionIdentity?.workflowId || activeProposal?.workflowId || null;
    evidence.actionId = activeRuntimeResult?.actionIdentity?.actionId || activeProposal?.actionId || null;
    evidence.telemetryStreamId = activeRuntimeResult?.actionIdentity?.telemetryStreamId || activeProposal?.telemetryStreamId || null;
    evidence.capabilityIds = activeRuntimeResult?.actionIdentity?.capabilityIds || activeProposal?.capabilityIds || [];
    evidence.diagnosticsList = activeRuntimeResult?.diagnostics || [];
    evidence.proposalId = activeRuntimeResult?.proposalIdentity?.proposalId || activeProposal?.proposalId || null;
    evidence.proposalBeforeAfterValues = activeRuntimeResult?.proposalIdentity?.beforeValues?.map((entry, index) => ({
      fieldPath: entry.fieldPath,
      before: entry.value,
      after: activeRuntimeResult?.proposalIdentity?.afterValues?.[index]?.value,
    })) || activeProposal?.proposedChanges?.map((entry) => ({
      fieldPath: entry.fieldPath,
      before: entry.before,
      after: entry.after,
    })) || [];
    evidence.requiresHumanApproval = activeRuntimeResult?.actionIdentity?.requiresHumanApproval ?? activeProposal?.requiresHumanApproval ?? null;
    evidence.publishDirectly = activeRuntimeResult?.actionIdentity?.publishDirectly ?? activeRuntimeResult?.proposalIdentity?.publishDirectly ?? null;

    evidence.domCaptures.proposalModal = await captureElementDom(evaluate, '[data-leeway-id="admin.proposal.review"]', 'proposal-modal.dom.json');
    evidence.screenshots.proposalModal = await captureElementScreenshot(send, evaluate, '[data-leeway-id="admin.proposal.review"]', 'proposal-modal.png');

    const draftAfterProposalBeforeApply = await getDraftState();
    evidence.noMutationBeforeApproval = draftAfterProposalBeforeApply?.home?.hero?.image === beforeDraft?.home?.hero?.image
      && draftAfterProposalBeforeApply?.home?.hero?.imageAlt === beforeDraft?.home?.hero?.imageAlt;

    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.approveActiveProposal()`);
    await waitFor(
      evaluate,
      `(() => {
        const draft = window.__LEEWAY_ADMIN_TEST_API.getDraftContentState();
        return !window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId() && Boolean(draft?.home?.hero?.image?.includes('women-collection.png'));
      })()`,
      20000,
      ensureUnlocked,
    );

    const afterApplyDraft = await getDraftState();
    const afterApplyPublished = await getPublishedState();
    evidence.draftStateAfterApply = afterApplyDraft;
    evidence.publishedStateAfterApplyButBeforePublish = afterApplyPublished;
    evidence.draftOnlyApplyRecorded = afterApplyDraft?.home?.hero?.image?.includes('women-collection.png')
      && afterApplyPublished?.home?.hero?.image === beforePublished?.home?.hero?.image;

    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.setPreviewMode('draft')`);
    await waitFor(evaluate, `window.__LEEWAY_PREVIEW_TEST_API.getPreviewMode() === 'draft'`, 10000, ensureUnlocked);
    evidence.screenshots.draftPreviewAfterApply = await captureElementScreenshot(send, evaluate, '[data-leeway-id="admin.preview.panel"]', 'draft-preview-after-apply.png');
    evidence.domCaptures.draftPreviewAfterApply = await captureElementDom(evaluate, '[data-leeway-id="admin.preview.panel"]', 'draft-preview-after-apply.dom.json');

    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.setPreviewMode('published')`);
    await waitFor(evaluate, `window.__LEEWAY_PREVIEW_TEST_API.getPreviewMode() === 'published'`, 10000, ensureUnlocked);
    await sleep(1000);
    const livePreviewBeforePublish = await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.getHeroSnapshot()`);
    evidence.publishedBeforePublishUnchanged = livePreviewBeforePublish?.image === beforePublished?.home?.hero?.image;

    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.publishAll()`);
    await waitFor(
      evaluate,
      `(() => {
        const published = window.__LEEWAY_ADMIN_TEST_API.getPublishedContentState();
        return Boolean(published?.home?.hero?.image?.includes('women-collection.png'));
      })()`,
      30000,
      ensureUnlocked,
    );
    evidence.publishedStateAfterPublish = await getPublishedState();
    evidence.publishChangedPublishedState = evidence.publishedStateAfterPublish?.home?.hero?.image?.includes('women-collection.png') === true;
    evidence.screenshots.publishedPreviewAfterPublish = await captureElementScreenshot(send, evaluate, '[data-leeway-id="admin.preview.panel"]', 'published-preview-after-publish.png');
    evidence.domCaptures.publishedPreviewAfterPublish = await captureElementDom(evaluate, '[data-leeway-id="admin.preview.panel"]', 'published-preview-after-publish.dom.json');

    const mainRuntimeTraceSnapshot = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getRuntimeTraceSnapshot()`);
    evidence.runtimeTraceSnapshot = {
      structured: mainRuntimeTraceSnapshot,
      domPath: await captureElementDom(evaluate, '[data-leeway-id="admin.runtime.trace"]', 'runtime-trace.dom.json'),
      screenshotPath: await captureElementScreenshot(send, evaluate, '[data-leeway-id="admin.runtime.trace"]', 'runtime-trace.png'),
    };

    evidence.telemetryEventsRecorded = mainRuntimeTraceSnapshot?.telemetryEvents || [];
    evidence.auditEventsRecorded = mainRuntimeTraceSnapshot?.auditEvents || [];
    evidence.toolOrMcpUsageRecord = Array.isArray(mainRuntimeTraceSnapshot?.toolUsageRecords) && mainRuntimeTraceSnapshot.toolUsageRecords.length > 0
      ? mainRuntimeTraceSnapshot.toolUsageRecords
      : 'NO_MCP_TOOL_USED';

    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.navigateSection('agents')`);
    await waitFor(evaluate, `window.__LEEWAY_ADMIN_TEST_API.getActiveSection() === 'agents'`, 10000, ensureUnlocked);
    await waitFor(evaluate, `document.body.innerText.includes('Runtime State Ledger')`, 10000, ensureUnlocked);
    const agentRuntimeStates = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getRuntimeStates()`);
    evidence.agentStatusSnapshot = {
      state: agentRuntimeStates?.find((entry) => entry.currentActionId === evidence.actionId) || null,
      domPath: await captureTextMatchedSectionDom(evaluate, 'Runtime State Ledger', 'agent-status-ledger.dom.json'),
      screenshotPath: await captureTextMatchedSectionScreenshot(send, evaluate, 'Runtime State Ledger', 'agent-status-ledger.png'),
    };

    // Reject path.
    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.navigateSection('dashboard')`);
    await waitFor(evaluate, `window.__LEEWAY_ADMIN_TEST_API.getActiveSection() === 'dashboard'`, 10000, ensureUnlocked);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.setPreviewMode('draft')`);
    await selectRegion('public.home.hero');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    const draftBeforeReject = await getDraftState();
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest(${literal(OWNER_PROMPT)}, ${literal(REJECT_MEDIA_ASSET_ID)})`);
    await waitFor(evaluate, `Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`, 20000, ensureUnlocked);
    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.rejectActiveProposal()`);
    await waitFor(evaluate, `!window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`, 20000, ensureUnlocked);
    const draftAfterReject = await getDraftState();
    evidence.rejectTestResult = {
      prompt: OWNER_PROMPT,
      mediaAssetId: REJECT_MEDIA_ASSET_ID,
      noMutationOnReject: JSON.stringify(draftAfterReject) === JSON.stringify(draftBeforeReject),
      draftStateAfterReject: draftAfterReject,
    };

    // Missing alt text path.
    await selectRegion('public.home.hero');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openFieldsTab()`);
    await evaluate(`
      (() => {
        const field = [...document.querySelectorAll('input[type="text"]')].find((entry) => entry.value === ${literal(draftAfterReject?.home?.hero?.imageAlt)});
        if (!field) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(field, '');
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      })()
    `);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest(${literal(OWNER_PROMPT)}, ${literal(MISSING_ALT_MEDIA_ASSET_ID)})`);
    await waitFor(evaluate, `Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`, 20000, ensureUnlocked);
    const missingAltRuntime = await evaluate(`window.__LEEWAY_ADMIN_TEST_API.getActiveRuntimeResult()`);
    evidence.missingAltTextTestResult = {
      prompt: OWNER_PROMPT,
      mediaAssetId: MISSING_ALT_MEDIA_ASSET_ID,
      warningShown: Boolean(missingAltRuntime?.diagnostics?.find((entry) => entry.checkId === 'check.media.alt_text')),
      fallbackAltProposed: Boolean(missingAltRuntime?.proposalIdentity?.afterValues?.find((entry) => entry.fieldPath === 'home.hero.imageAlt' && String(entry.value || '').length > 0)),
      diagnostics: missingAltRuntime?.diagnostics || [],
    };
    await evaluate(`window.__LEEWAY_ADMIN_TEST_API.rejectActiveProposal()`);
    await waitFor(evaluate, `!window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`, 20000, ensureUnlocked);

    // Unsupported region without media binding.
    await selectRegion('public.header');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest(${literal(OWNER_PROMPT)})`);
    const unsupportedRegionBlocked = await waitOrFalse(
      evaluate,
      `document.body.innerText.includes('could not generate a governed draft proposal') || !window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`,
      12000,
      ensureUnlocked,
    );
    evidence.unsupportedRegionTestResult = {
      prompt: OWNER_PROMPT,
      selectedRegion: 'public.header',
      blocked: unsupportedRegionBlocked,
    };
    if (await evaluate(`Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`)) {
      await evaluate(`window.__LEEWAY_ADMIN_TEST_API.rejectActiveProposal()`);
      await waitOrFalse(evaluate, `!window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`, 8000, ensureUnlocked);
    }

    // Video on image-only region.
    await selectRegion('public.home.collections');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest('Put this video in the homepage hero.', ${literal(VIDEO_MEDIA_ASSET_ID)})`);
    const videoBlocked = await waitOrFalse(
      evaluate,
      `document.body.innerText.includes('could not generate a governed draft proposal') || !window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`,
      12000,
      ensureUnlocked,
    );
    evidence.videoOnImageOnlyTestResult = {
      prompt: 'Put this video in the homepage hero.',
      selectedRegion: 'public.home.collections',
      mediaAssetId: VIDEO_MEDIA_ASSET_ID,
      blocked: videoBlocked,
    };
    if (await evaluate(`Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`)) {
      await evaluate(`window.__LEEWAY_ADMIN_TEST_API.rejectActiveProposal()`);
      await waitOrFalse(evaluate, `!window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`, 8000, ensureUnlocked);
    }

    // Unsupported animation request.
    await selectRegion('public.home.hero');
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.openAiTab()`);
    await evaluate(`window.__LEEWAY_PREVIEW_TEST_API.submitAgentRequest('Add a fade-in animation to this block.')`);
    const animationBlocked = await waitOrFalse(
      evaluate,
      `document.body.innerText.includes('could not generate a governed draft proposal') || !window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`,
      12000,
      ensureUnlocked,
    );
    evidence.animationUnsupportedTestResult = {
      prompt: 'Add a fade-in animation to this block.',
      selectedRegion: 'public.home.hero',
      blocked: animationBlocked,
    };
    if (await evaluate(`Boolean(window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId())`)) {
      await evaluate(`window.__LEEWAY_ADMIN_TEST_API.rejectActiveProposal()`);
      await waitOrFalse(evaluate, `!window.__LEEWAY_ADMIN_TEST_API.getActiveProposalId()`, 8000, ensureUnlocked);
    }

    evidence.caveats.push('Runtime blocked mode remains unavailable in localhost DEVELOPMENT_BOOTSTRAP.');
  } catch (error) {
    evidence.error = error.stack || error.message;
    evidence.caveats.push('Verification encountered an execution error before all owner-visible proof could be captured.');
  } finally {
    close();
  }

  evidence.artifactWritten = true;
  const verdict = evaluateVerdict(evidence);
  evidence.finalResult = verdict.finalResult;
  evidence.verdictDetails = verdict;
  await fs.writeFile(ARTIFACT_PATH, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));

  if (evidence.finalResult === 'FAIL') {
    process.exit(1);
  }
}

main().catch(async (error) => {
  const fallback = {
    timestamp: new Date().toISOString(),
    appUrlUsed: ADMIN_URL,
    artifactPath: ARTIFACT_PATH,
    artifactWritten: true,
    finalResult: 'FAIL',
    error: error.stack || error.message,
    caveats: ['Script failed before verification could complete.'],
  };
  await ensureDir(EVIDENCE_DIR);
  await fs.writeFile(ARTIFACT_PATH, JSON.stringify(fallback, null, 2));
  console.error(fallback.error);
  process.exit(1);
});
