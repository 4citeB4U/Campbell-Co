/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF3131
FLUO=#FF5757
PASTEL=#FF9191

ICON_ASCII:
family=lucide
glyph=layout

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: CORE
TAG: CORE.SRC.APPS.ADMIN_PORTAL.MAIN
DESCRIPTION: Luxury-commerce Operating System (Admin Portal)
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminPortal.tsx — full luxury OS rebuild
WHY = Transform basic admin into mobile-first owner command center
WHO = Leeway Innovations
WHERE = src/apps/AdminPortal.tsx
WHEN = 2026-05-13
HOW = React + Motion + Lucide + Custom Admin Modules

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Image as ImageIcon, 
  Home, 
  Brain,
  ShoppingBag, 
  Settings as SettingsIcon,
  Plus,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Search,
  Users,
  ShieldCheck,
  Zap,
  Activity,
  Video,
  Target,
  LockKeyhole,
  LineChart,
  UserRound,
  Trash2,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { auth, signInWithGoogle, db } from '../lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useProducts, useDraftProducts, saveDraftProduct, publishProduct, deleteProduct, seedDatabase } from '../hooks/useProducts';
import { getRuntimeAuthorityMode, RUNTIME_METADATA, useSiteContent, useDraftSiteContent, saveDraftContent, publishSiteContent } from '../hooks/useSiteContent';
import { useAdminStore } from '../hooks/useAdminStore';
import { doc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../types';
import { publicAssetUrl } from '../lib/publicPath';
import {
  DEFAULT_OWNER_PROFILE,
  loadOwnerPasscode,
  loadOwnerProfile,
  saveOwnerPasscode,
} from '../lib/adminConfig';
import { DEFAULT_SITE_CONTENT, SiteContent } from '../content/siteContent';
import {
  LeeWayAgentProposal,
  createProposalForTask,
  recordProposalTelemetry,
} from '../core/leeway/LeeWayAgentProposal';
import { PreviewControlBinding } from '../core/leeway/PreviewControlRegistry';
import { LeeWaySkillRuntime, LeeWaySkillRuntimeResult } from '../core/leeway/skills/LeeWaySkillRuntime';
import { RegisteredMediaAsset } from '../data/registeredMediaAssets';
import {
  LeeWayAgentRuntimeState,
  LeeWayAuditEvent,
  LeeWayDraftPatchIdentity,
  LeeWayTelemetryEvent,
  createLeeWayIdentityId,
  getLeeWayAuditEvents,
  getLeeWayDraftPatches,
  getLeeWayRuntimeStates,
  getLeeWayTelemetryEvents,
  getLeeWayToolUsageRecords,
  recordLeeWayAuditEvent,
  recordLeeWayDraftPatch,
  recordLeeWayTelemetryEvent,
  upsertRuntimeState,
} from '../core/leeway/LeeWayRuntimeIdentity';


// New Components
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminMembers } from '../components/admin/AdminMembers';
import { AdminAgents } from '../components/admin/AdminAgents';
import { AdminProcurement } from '../components/admin/AdminProcurement';
import { AdminMedia } from '../components/admin/AdminMedia';
import { AdminCMS } from '../components/admin/AdminCMS';
import { AdminPartners } from '../components/admin/AdminPartners';
import { AdminSettings } from '../components/admin/AdminSettings';

import { LivePublicPreview } from '../components/admin/LivePublicPreview';
import { AdminLeeWayStandards } from '../components/admin/AdminLeeWayStandards';
import { AdminPublishing } from '../components/admin/AdminPublishing';
import { LeeWayHelpTrigger } from '../components/admin/LeeWayHelpTrigger';
import { OnboardingTour, LEEWAY_ONBOARDING_START_EVENT } from '../components/admin/OnboardingTour';

// Types for Admin View
type AdminSection = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'members' 
  | 'agents' 
  | 'procurement' 
  | 'media' 
  | 'vendors' 
  | 'analytics' 
  | 'privacy' 
  | 'site-control' 
  | 'settings'
  | 'layout'
  | 'publishing'
  | 'leeway-standards';

type AdminUser = Pick<User, 'displayName' | 'photoURL'>;

import { useLeeWayID } from '../hooks/useLeeWayID';

export default function AdminPortal() {
  useLeeWayID('ADMIN_PORTAL_CORE');
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ownerProfile, setOwnerProfile] = useState(DEFAULT_OWNER_PROFILE);

  // Governed proposal state (LAW-0005)
  const [activeProposal, setActiveProposal] = useState<LeeWayAgentProposal | null>(null);
  const [activeRuntimeResult, setActiveRuntimeResult] = useState<LeeWaySkillRuntimeResult | null>(null);
  const [lastRuntimeResult, setLastRuntimeResult] = useState<LeeWaySkillRuntimeResult | null>(null);
  const [runtimeStates, setRuntimeStates] = useState<LeeWayAgentRuntimeState[]>([]);
  const [telemetryEvents, setTelemetryEvents] = useState<LeeWayTelemetryEvent[]>([]);
  const [auditEvents, setAuditEvents] = useState<LeeWayAuditEvent[]>([]);
  const [draftPatchEvents, setDraftPatchEvents] = useState<LeeWayDraftPatchIdentity[]>([]);
  const [proposalNotification, setProposalNotification] = useState<string | null>(null);
  const [proposalLog, setProposalLog] = useState<Array<{ time: string; event: string; proposalId: string }>>([]);
  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [passcodeDraft, setPasscodeDraft] = useState('');
  const [passcodeMessage, setPasscodeMessage] = useState<string | null>(null);

  const [activeRole, setActiveRole] = useState<'owner' | 'manager' | 'staff'>(() => {
    if (typeof window === 'undefined') return 'owner';
    return (window.localStorage.getItem('campbell-active-role') as any) || 'owner';
  });

  const changeActiveRole = (role: 'owner' | 'manager' | 'staff') => {
    setActiveRole(role);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('campbell-active-role', role);
      window.dispatchEvent(new Event('storage'));
    }
  };

  const startOnboarding = () => {
    window.dispatchEvent(new Event(LEEWAY_ONBOARDING_START_EVENT));
  };

  const { products } = useProducts(true);
  const { orders, members, agents, procurement, actions } = useAdminStore();

  // ── LAW-0005: Proposal-Before-Mutation ────────────────────────────────────
  // STEP 1: Build and display proposal. No content is mutated here.
  const createAgentProposal = (agentId: string, agentLabel: string, taskId: string) => {
    const proposal = createProposalForTask(agentId, agentLabel, taskId, draftContentState);
    if (!proposal) return;

    recordProposalTelemetry('AGENT_PROPOSAL_CREATED', proposal);
    setProposalLog(prev => [
      { time: new Date().toLocaleTimeString(), event: 'AGENT_PROPOSAL_CREATED', proposalId: proposal.proposalId },
      ...prev,
    ]);
    setActiveRuntimeResult(null);
    setLastRuntimeResult(null);
    setActiveProposal(proposal);
  };

  const createPreviewProposal = async (
    section: PreviewControlBinding,
    request: string,
    selectedMediaAsset?: RegisteredMediaAsset,
  ) => {
    const runtimeResult = await LeeWaySkillRuntime.execute({
      requestId: `request-${Date.now()}`,
      ownerText: request,
      selectedLeewayId: section.leewayId,
      selectedScreenId: 'ADMIN_PORTAL',
      selectedSchemaPath: section.schemaPath,
      selectedSchemaPaths: section.editableFields
        .filter((field) => field.schemaPath.startsWith(section.schemaPath || ''))
        .map((field) => field.schemaPath),
      selectedAdminControlPath: `${section.adminModule}.${section.adminPanel}`,
      selectedMediaFields: section.editableFields
        .filter((field) => field.inputType === 'image')
        .map((field) => field.schemaPath),
      selectedAllowedActions: ['proposal.preview', 'draft.apply', 'proposal.reject'],
      selectedOwnerAgent: section.ownerAgent,
      selectedAuditCategory: section.auditCategory,
      selectedMediaId: selectedMediaAsset?.id,
      mediaContext: selectedMediaAsset,
      draftContent: draftContentState,
      publishedContent: liveContent || draftContentState,
      runtimeMode: getRuntimeAuthorityMode(),
      createdAt: new Date().toISOString(),
    });

    const proposal = runtimeResult.proposalResult?.proposalType === 'LeeWayAgentProposal'
      ? runtimeResult.proposalResult.proposal as LeeWayAgentProposal
      : null;

    if (!proposal) {
      setActiveRuntimeResult(runtimeResult);
      setProposalNotification('Selected-area runtime could not generate a governed draft proposal.');
      setTimeout(() => setProposalNotification(null), 4000);
      return;
    }

    recordProposalTelemetry('AGENT_PROPOSAL_CREATED', proposal, 'Preview inspector requested a governed proposal.');
    setProposalLog((prev) => [
      { time: new Date().toLocaleTimeString(), event: 'AGENT_PROPOSAL_CREATED', proposalId: proposal.proposalId },
      ...runtimeResult.telemetryEvents.map((event) => ({
        time: new Date().toLocaleTimeString(),
        event: `${event.eventType}:${event.message}`,
        proposalId: proposal.proposalId,
      })),
      ...runtimeResult.auditEvents.map((event) => ({
        time: new Date().toLocaleTimeString(),
        event: `${event.ownerApprovalStatus}:${event.message}`,
        proposalId: proposal.proposalId,
      })),
      ...prev,
    ]);
    setActiveRuntimeResult(runtimeResult);
    setLastRuntimeResult(runtimeResult);
    setActiveProposal(proposal);
  };

  // STEP 2: Owner explicitly approves — apply patch to draft only.
  const applyAgentProposal = async (proposal: LeeWayAgentProposal) => {
    if (!draftContentState) return;

    const updated: SiteContent = JSON.parse(JSON.stringify(draftContentState));

    // Apply each proposed field change using its fieldPath
    for (const change of proposal.proposedChanges) {
      const keys = change.fieldPath.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        node = node[keys[i]];
        if (!node) break;
      }
      if (node) {
        node[keys[keys.length - 1]] = change.after;
      }
    }

    setDraftContentState(updated);
    try {
      await saveDraftContent(updated);
    } catch (err) {
      console.error('[LeeWay] Proposal draft persistence failed:', err);
    }

    // Telemetry — truthful events only
    recordProposalTelemetry('AGENT_PROPOSAL_APPROVED', proposal, 'Owner applied proposal to draft.');
    recordProposalTelemetry('DRAFT_EDIT_APPLIED', proposal, `${proposal.proposedChanges.length} field(s) applied to draft buffer.`);
    setProposalLog(prev => [
      { time: new Date().toLocaleTimeString(), event: 'DRAFT_EDIT_APPLIED', proposalId: proposal.proposalId },
      { time: new Date().toLocaleTimeString(), event: 'AGENT_PROPOSAL_APPROVED', proposalId: proposal.proposalId },
      ...prev,
    ]);

    if (activeRuntimeResult) {
      const approvalTelemetry = recordLeeWayTelemetryEvent({
        eventId: createLeeWayIdentityId('TELEMETRY'),
        streamId: activeRuntimeResult.actionIdentity.telemetryStreamId,
        eventType: 'proposal-approved',
        agentId: activeRuntimeResult.actionIdentity.agentId,
        skillId: activeRuntimeResult.actionIdentity.skillId,
        workflowId: activeRuntimeResult.actionIdentity.workflowId,
        actionId: activeRuntimeResult.actionIdentity.actionId,
        selectedLeewayId: activeRuntimeResult.actionIdentity.selectedLeewayId,
        screenId: activeRuntimeResult.actionIdentity.screenId,
        runtimeAuthorityMode: activeRuntimeResult.actionIdentity.runtimeAuthorityMode,
        timestamp: new Date().toISOString(),
        severity: 'info',
        message: `Owner approved proposal ${proposal.proposalId}.`,
        tracePath: activeRuntimeResult.actionIdentity.tracePath,
      });

      const approvalAudit = recordLeeWayAuditEvent({
        auditEventId: createLeeWayIdentityId('AUDIT'),
        actionId: activeRuntimeResult.actionIdentity.actionId,
        agentId: activeRuntimeResult.actionIdentity.agentId,
        ownerApprovalStatus: 'approved',
        beforeAfter: proposal.proposedChanges.map((change) => ({ fieldPath: change.fieldPath, before: change.before, after: change.after })),
        timestamp: new Date().toISOString(),
        lawReferences: activeRuntimeResult.actionIdentity.lawReferences,
        riskLevel: activeRuntimeResult.actionIdentity.riskLevel,
        auditCategory: activeRuntimeResult.actionIdentity.auditCategory,
        message: `Owner approved proposal ${proposal.proposalId} and draft patch application began.`,
      });

      const draftPatch = recordLeeWayDraftPatch({
        patchId: createLeeWayIdentityId('PATCH'),
        proposalId: proposal.proposalId,
        skillId: activeRuntimeResult.actionIdentity.skillId,
        actionId: activeRuntimeResult.actionIdentity.actionId,
        agentId: activeRuntimeResult.actionIdentity.agentId,
        affectedFieldPaths: proposal.proposedChanges.map((change) => change.fieldPath),
        beforeAfterSnapshot: proposal.proposedChanges.map((change) => ({ fieldPath: change.fieldPath, before: change.before, after: change.after })),
        validationResult: 'passed',
        runtimeAuthorityMode: activeRuntimeResult.actionIdentity.runtimeAuthorityMode,
        auditEventId: approvalAudit.auditEventId,
        telemetryEventId: approvalTelemetry.eventId,
        timestamp: new Date().toISOString(),
      });

      const completedRuntimeState: LeeWayAgentRuntimeState = {
        ...activeRuntimeResult.runtimeState,
        status: 'completed',
        currentAuditEventId: approvalAudit.auditEventId,
        updatedAt: new Date().toISOString(),
      };
      upsertRuntimeState(completedRuntimeState);
      setLastRuntimeResult({
        ...activeRuntimeResult,
        runtimeState: completedRuntimeState,
        draftPatchIdentity: draftPatch,
        telemetryEvents: [...activeRuntimeResult.telemetryEvents, approvalTelemetry],
        auditEvents: [...activeRuntimeResult.auditEvents, approvalAudit],
      });
    }

    // Notify store of task completion
    await actions.approveAgentTask(proposal.agentId, proposal.taskId);

    setActiveProposal(null);
    setActiveRuntimeResult(null);
    setProposalNotification(`Draft updated — ${proposal.proposedChanges.length} field(s) applied from ${proposal.agentLabel}.`);
    setTimeout(() => setProposalNotification(null), 5000);
  };

  // STEP 3: Owner rejects — nothing is mutated.
  const rejectAgentProposal = async (proposal: LeeWayAgentProposal) => {
    recordProposalTelemetry('AGENT_PROPOSAL_REJECTED', proposal, 'Owner rejected proposal. No draft changes applied.');
    setProposalLog(prev => [
      { time: new Date().toLocaleTimeString(), event: 'AGENT_PROPOSAL_REJECTED', proposalId: proposal.proposalId },
      ...prev,
    ]);

    if (activeRuntimeResult) {
      const rejectionTelemetry = recordLeeWayTelemetryEvent({
        eventId: createLeeWayIdentityId('TELEMETRY'),
        streamId: activeRuntimeResult.actionIdentity.telemetryStreamId,
        eventType: 'proposal-rejected',
        agentId: activeRuntimeResult.actionIdentity.agentId,
        skillId: activeRuntimeResult.actionIdentity.skillId,
        workflowId: activeRuntimeResult.actionIdentity.workflowId,
        actionId: activeRuntimeResult.actionIdentity.actionId,
        selectedLeewayId: activeRuntimeResult.actionIdentity.selectedLeewayId,
        screenId: activeRuntimeResult.actionIdentity.screenId,
        runtimeAuthorityMode: activeRuntimeResult.actionIdentity.runtimeAuthorityMode,
        timestamp: new Date().toISOString(),
        severity: 'warning',
        message: `Owner rejected proposal ${proposal.proposalId}.`,
        tracePath: activeRuntimeResult.actionIdentity.tracePath,
      });

      const rejectionAudit = recordLeeWayAuditEvent({
        auditEventId: createLeeWayIdentityId('AUDIT'),
        actionId: activeRuntimeResult.actionIdentity.actionId,
        agentId: activeRuntimeResult.actionIdentity.agentId,
        ownerApprovalStatus: 'rejected',
        beforeAfter: proposal.proposedChanges.map((change) => ({ fieldPath: change.fieldPath, before: change.before, after: change.after })),
        timestamp: new Date().toISOString(),
        lawReferences: activeRuntimeResult.actionIdentity.lawReferences,
        riskLevel: activeRuntimeResult.actionIdentity.riskLevel,
        auditCategory: activeRuntimeResult.actionIdentity.auditCategory,
        message: `Owner rejected proposal ${proposal.proposalId}; no mutation occurred.`,
      });

      const rejectedRuntimeState: LeeWayAgentRuntimeState = {
        ...activeRuntimeResult.runtimeState,
        status: 'completed',
        currentAuditEventId: rejectionAudit.auditEventId,
        updatedAt: new Date().toISOString(),
      };
      upsertRuntimeState(rejectedRuntimeState);
      setLastRuntimeResult({
        ...activeRuntimeResult,
        runtimeState: rejectedRuntimeState,
        telemetryEvents: [...activeRuntimeResult.telemetryEvents, rejectionTelemetry],
        auditEvents: [...activeRuntimeResult.auditEvents, rejectionAudit],
      });
    }

    await actions.approveAgentTask(proposal.agentId, proposal.taskId);
    setActiveProposal(null);
    setActiveRuntimeResult(null);
    setProposalNotification(`Proposal rejected — no changes applied.`);
    setTimeout(() => setProposalNotification(null), 4000);
  };

  // Shared visual workspace / Live preview states
  const { content: liveContent } = useSiteContent();
  const { content: draftContent } = useDraftSiteContent();
  const [draftContentState, setDraftContentState] = useState<SiteContent | null>(null);
  
  useEffect(() => {
    if (draftContent) {
      setDraftContentState(JSON.parse(JSON.stringify(draftContent)));
    }
  }, [draftContent]);

  useEffect(() => {
    const syncRuntimeTrace = () => {
      setRuntimeStates(getLeeWayRuntimeStates());
      setTelemetryEvents(getLeeWayTelemetryEvents());
      setAuditEvents(getLeeWayAuditEvents());
      setDraftPatchEvents(getLeeWayDraftPatches());
    };

    syncRuntimeTrace();
    const interval = window.setInterval(syncRuntimeTrace, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const { products: draftProducts } = useDraftProducts();
  const { products: publishedProducts } = useProducts(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    (window as any).__LEEWAY_ADMIN_TEST_API = {
      navigateSection: (section: AdminSection) => setActiveSection(section),
      getActiveSection: () => activeSection,
      getRuntimeAuthorityMode: () => getRuntimeAuthorityMode(),
      approveActiveProposal: async () => {
        if (activeProposal) {
          await applyAgentProposal(activeProposal);
          return true;
        }
        return false;
      },
      rejectActiveProposal: async () => {
        if (activeProposal) {
          await rejectAgentProposal(activeProposal);
          return true;
        }
        return false;
      },
      getActiveProposalId: () => activeProposal?.proposalId || null,
      resetContentToDefaults: async () => {
        setDraftContentState(JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)));
        await saveDraftContent(DEFAULT_SITE_CONTENT);
        await publishSiteContent(DEFAULT_SITE_CONTENT);
        setRefreshKey((current) => current + 1);
        return true;
      },
      publishAll: async () => {
        if (!draftContentState) return false;
        await publishSiteContent(draftContentState);
        const changedProducts = draftProducts.filter((dp) => {
          const pub = publishedProducts.find((pp) => pp.id === dp.id);
          return !pub || JSON.stringify(dp) !== JSON.stringify(pub);
        });
        for (const product of changedProducts) {
          await publishProduct(product, draftProducts);
        }
        setRefreshKey((current) => current + 1);
        return true;
      },
      getDraftContentState: () => draftContentState,
      getPublishedContentState: () => liveContent || draftContentState,
      getActiveProposal: () => activeProposal,
      getActiveRuntimeResult: () => activeRuntimeResult,
      getLastRuntimeResult: () => lastRuntimeResult,
      getRuntimeStates: () => getLeeWayRuntimeStates(),
      getTelemetryEvents: () => getLeeWayTelemetryEvents(),
      getAuditEvents: () => getLeeWayAuditEvents(),
      getDraftPatchEvents: () => getLeeWayDraftPatches(),
      getToolUsageRecords: () => getLeeWayToolUsageRecords(),
      getRuntimeTraceSnapshot: () => {
        const runtimeResult = lastRuntimeResult || activeRuntimeResult;
        if (!runtimeResult) return null;
        const scopedRuntimeState = getLeeWayRuntimeStates().find((entry) => entry.runtimeId === runtimeResult.runtimeId) || runtimeResult.runtimeState;
        const scopedTelemetry = getLeeWayTelemetryEvents().filter((event) => event.actionId === runtimeResult.actionIdentity.actionId);
        const scopedAudit = getLeeWayAuditEvents().filter((event) => event.actionId === runtimeResult.actionIdentity.actionId);
        const scopedPatches = getLeeWayDraftPatches().filter((event) => event.actionId === runtimeResult.actionIdentity.actionId);
        const scopedTools = getLeeWayToolUsageRecords().filter((entry) => entry.actionId === runtimeResult.actionIdentity.actionId);
        return {
          actionId: runtimeResult.actionIdentity.actionId,
          agent: runtimeResult.actionIdentity.agentDisplayName,
          skill: runtimeResult.actionIdentity.skillId,
          workflow: runtimeResult.actionIdentity.workflowId,
          laws: runtimeResult.actionIdentity.lawReferences,
          selectedLeewayId: runtimeResult.actionIdentity.selectedLeewayId || null,
          schemaPaths: runtimeResult.proposalIdentity?.beforeValues.map((entry) => entry.fieldPath)
            || runtimeResult.proposalResult?.proposal?.selectedSchemaPaths
            || (runtimeResult.actionIdentity.selectedSchemaPath ? [runtimeResult.actionIdentity.selectedSchemaPath] : []),
          telemetryStream: runtimeResult.actionIdentity.telemetryStreamId,
          approvalStatus: scopedAudit[0]?.ownerApprovalStatus || 'awaiting-approval',
          runtimeAuthorityMode: runtimeResult.actionIdentity.runtimeAuthorityMode,
          auditEvents: scopedAudit,
          telemetryEvents: scopedTelemetry,
          toolUsageRecords: scopedTools,
          runtimeState: scopedRuntimeState,
          draftPatchEvents: scopedPatches,
        };
      },
    };

    return () => {
      delete (window as any).__LEEWAY_ADMIN_TEST_API;
    };
  }, [activeProposal, activeRuntimeResult, activeSection, draftContentState, draftProducts, lastRuntimeResult, liveContent, publishedProducts]);

  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [cmsInitialSection, setCmsInitialSection] = useState<'hero' | 'identity' | 'collections' | 'promo' | 'verification' | 'trust' | 'footer' | 'guide' | 'payments' | 'checkout'>('hero');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const profile = loadOwnerProfile();
    setOwnerProfile(profile);

    if (!auth) {
      setUser({ displayName: profile.name, photoURL: '' });
      setLoadingAuth(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const storedPasscode = !auth ? loadOwnerPasscode() : '';

  const handleLocalUnlock = () => {
    if (!storedPasscode) {
      if (!passcodeDraft.trim()) {
        setPasscodeMessage('Create a passcode first so the owner area is protected.');
        return;
      }

      saveOwnerPasscode(passcodeDraft);
      setPasscodeMessage('Owner passcode created for this device.');
      setLocalUnlocked(true);
      return;
    }

    if (passcodeDraft === storedPasscode) {
      setLocalUnlocked(true);
      setPasscodeMessage(null);
      return;
    }

    setPasscodeMessage('That passcode did not match the owner lock.');
  };

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
      return;
    }

    setLocalUnlocked(false);
    setPasscodeDraft('');
  };

  if (loadingAuth) return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center">
       <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent animate-spin rounded-full" />
    </div>
  );

  if (auth && !user) return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-8">
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full rounded-[2rem] bg-white border border-stone-200 p-12 space-y-10 text-center shadow-sm"
       >
          <div className="flex justify-center">
             <div className="w-16 h-16 rounded-2xl border-2 border-amber-600 flex items-center justify-center">
                <span className="text-amber-600 font-serif text-3xl">C</span>
             </div>
          </div>
          <div className="space-y-4">
             <h1 className="text-3xl font-serif text-stone-900 tracking-widest uppercase">Vault Access</h1>
             <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em]">Owner Operating System Restricted</p>
          </div>
          <button 
            onClick={signInWithGoogle}
            className="w-full py-5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-stone-900 transition-all transform active:scale-95"
          >
            Authenticate Identity
          </button>
       </motion.div>
    </div>
  );

  if (!auth && !localUnlocked) return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-[2rem] border border-stone-200 bg-white p-10 shadow-sm"
      >
        <div className="space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-amber-50 text-amber-700">
            <LockKeyhole size={28} />
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-700">Owner Access</p>
            <h1 className="text-3xl font-serif uppercase tracking-[0.14em] text-stone-900">{ownerProfile.name}</h1>
            <p className="text-sm leading-7 text-stone-600">
              This device is using the local admin lock. {storedPasscode ? 'Enter the owner passcode to continue.' : 'Create the first owner passcode to protect the administrative portal.'}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">
              {storedPasscode ? 'Enter Passcode' : 'Create Passcode'}
            </span>
            <input
              type="password"
              value={passcodeDraft}
              onChange={(event) => setPasscodeDraft(event.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
            />
          </label>

          {passcodeMessage && (
            <div className="rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {passcodeMessage}
            </div>
          )}

          <button
            onClick={handleLocalUnlock}
            className="w-full rounded-full bg-amber-600 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-stone-900"
          >
            {storedPasscode ? 'Unlock Administrative Portal' : 'Create Passcode & Enter'}
          </button>
        </div>
      </motion.div>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'site-control', label: 'Site Control', icon: Home },
    { id: 'layout', label: 'Layout Manager', icon: ChevronRight },
    { id: 'products', label: 'PIM / Registry', icon: Package },
    { id: 'media', label: 'Media Studio', icon: Video },
    { id: 'agents', label: 'AI Workforce', icon: Brain },
    { id: 'publishing', label: 'Publishing Console', icon: ShieldCheck },
    { id: 'leeway-standards', label: 'LeeWay Standards', icon: Zap },
    { id: 'settings', label: 'Vault Settings', icon: SettingsIcon },
  ];

  return (
    <div id="admin-portal-root" className="min-h-screen bg-stone-100 text-stone-900 flex flex-col lg:flex-row lg:h-screen overflow-x-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-[#f8f5ef] border-r border-stone-200 flex-col shrink-0">
         <div className="p-8 border-b border-stone-200 flex items-center gap-5">
            <div className="relative group">
               <div className="w-10 h-10 border border-amber-600/40 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-all duration-700">
                  <span className="text-amber-700 font-serif text-lg -rotate-45 group-hover:rotate-0 transition-all duration-700">C</span>
               </div>
               <div className="absolute inset-0 border border-amber-600/10 scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.5em] font-black text-stone-900">CAMPBELL</span>
                  <span className="text-amber-700 font-serif italic text-sm">&</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.5em] font-black text-stone-900">CO</span>
                  <span className="text-[8px] uppercase tracking-widest font-black text-amber-700/50">OS</span>
               </div>
            </div>
         </div>

         <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              item.id === 'agents' ? (
                <div
                  key={item.id}
                  data-leeway-id="admin.sidebar.agents"
                  data-leeway-screen-id="ADMIN_SIDEBAR"
                  data-leeway-workflow-id="workflow.onboarding.first_launch"
                  data-leeway-owner-agent="agent-lee-prime"
                >
                  <button
                    onClick={() => setActiveSection(item.id as AdminSection)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all group ${
                      activeSection === item.id
                        ? 'bg-amber-600 text-white font-black'
                        : 'hover:bg-white text-stone-500'
                    }`}
                  >
                    <item.icon size={16} strokeWidth={activeSection === item.id ? 2.5 : 1.5} />
                    <span className="text-[9px] uppercase tracking-[0.25em]">{item.label}</span>
                  </button>
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as AdminSection)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all group ${
                    activeSection === item.id 
                      ? 'bg-amber-600 text-white font-black' 
                      : 'hover:bg-white text-stone-500'
                  }`}
                >
                  <item.icon size={16} strokeWidth={activeSection === item.id ? 2.5 : 1.5} />
                  <span className="text-[9px] uppercase tracking-[0.25em]">{item.label}</span>
                </button>
              )
            ))}
         </nav>

         <div className="p-6 border-t border-stone-200 space-y-4 bg-white/40">
             <div className="space-y-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-stone-400 block text-left">Simulated Employee Persona</span>
                <select
                  value={activeRole}
                  onChange={(e) => changeActiveRole(e.target.value as any)}
                  className="w-full bg-white border border-stone-200 text-[10px] font-black uppercase tracking-wider py-2 px-3 rounded-lg outline-none text-stone-700 font-sans"
                >
                  <option value="owner">Avion Campbell-Lee (Owner)</option>
                  <option value="manager">Marcus Vance (Manager)</option>
                  <option value="staff">Seraphina Frost (Staff)</option>
                </select>
             </div>
             
             <div className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-stone-150 text-left">
                <div className="w-6 h-6 rounded-full bg-amber-600/10 flex items-center justify-center text-amber-700 font-serif font-black text-[10px]">
                   {activeRole[0].toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-[8px] font-black uppercase tracking-widest truncate">
                      {activeRole === 'owner' ? 'Avion (Owner)' : activeRole === 'manager' ? 'Marcus (Manager)' : 'Seraphina (Staff)'}
                   </p>
                </div>
                <button onClick={handleSignOut} className="text-stone-400 hover:text-stone-900 transition-colors">
                   <LogOut size={12} />
                </button>
             </div>
          </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-stone-100">
         {/* Header */}
         <header className="h-20 bg-[#f8f5ef] border-b border-stone-200 flex items-center justify-between px-4 lg:px-12 shrink-0 z-50 sticky top-0">
            <div className="flex items-center gap-6">
               <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={20} />
               </button>
               <h2 className="text-[12px] uppercase tracking-[0.6em] font-black text-stone-900">
                 {navItems.find(i => i.id === activeSection)?.label}
               </h2>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
               <button
                 type="button"
                 onClick={startOnboarding}
                 data-leeway-action-id="action.onboarding.start"
                 className="hidden rounded-full border border-stone-200 bg-white px-4 py-2 text-[8px] font-black uppercase tracking-[0.28em] text-stone-600 transition hover:border-amber-300 hover:text-amber-700 md:inline-flex"
               >
                 Start Onboarding
               </button>
               <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-widest text-stone-500">System Live</span>
               </div>
               <button onClick={() => setActiveSection('products')} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
                  <Search size={18} />
               </button>
               <button className="lg:hidden w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center overflow-hidden">
                  <img src={user.photoURL || ''} alt="" className="w-full h-full object-cover grayscale" />
               </button>
            </div>
         </header>

         <div className="lg:hidden border-b border-stone-200 bg-[#f8f5ef] px-4 py-3 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 min-w-max">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as AdminSection)}
                  className={`px-4 py-3 border text-[8px] uppercase tracking-[0.28em] font-black whitespace-nowrap transition-all ${
                    activeSection === item.id
                      ? 'border-amber-600 bg-amber-600 text-white'
                      : 'border-stone-200 bg-white text-stone-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
         </div>

         {proposalNotification && (
           <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-amber-800 lg:px-12">
             {proposalNotification}
           </div>
         )}

         {lastRuntimeResult && (
           <div className="border-b border-stone-200 bg-white px-4 py-4 lg:px-12">
             <div className="max-w-[1600px] mx-auto">
               <RuntimeTracePanel
                 runtimeResult={lastRuntimeResult}
                 runtimeStates={runtimeStates}
                 telemetryEvents={telemetryEvents}
                 auditEvents={auditEvents}
                 draftPatchEvents={draftPatchEvents}
               />
             </div>
           </div>
         )}

         {/* Content Viewport */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-12">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeSection}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="max-w-[1600px] mx-auto"
               >
                 {activeSection === 'dashboard' && <AdminDashboard orders={orders} members={members} products={products} analytics={{}} />}
                 {activeSection === 'orders' && <AdminOrders orders={orders} onUpdateStatus={actions.updateOrderStatus} />}
                 {activeSection === 'products' && <AdminProductList />}
                 {activeSection === 'members' && <AdminMembers members={members} />}
                 {activeSection === 'agents' && <AdminAgents agents={agents} onRequestProposal={createAgentProposal} runtimeStates={runtimeStates} />}
                  {activeSection === 'site-control' && (
                    activeRole === 'staff' ? (
                      <RBACBlockedView section="site-control" role={activeRole} onElevate={() => changeActiveRole('owner')} />
                    ) : (
                      <AdminCMS 
                        sharedDraft={draftContentState} 
                        onChangeDraft={setDraftContentState} 
                        initialSection={cmsInitialSection} 
                      />
                    )
                  )}
                  {activeSection === 'layout' && (
                    activeRole === 'staff' ? (
                      <RBACBlockedView section="site-control" role={activeRole} onElevate={() => changeActiveRole('owner')} />
                    ) : (
                      <AdminCMS 
                        sharedDraft={draftContentState} 
                        onChangeDraft={setDraftContentState} 
                        initialSection="collections" 
                      />
                    )
                  )}
                  {activeSection === 'leeway-standards' && <AdminLeeWayStandards />}
                  {activeSection === 'publishing' && (
                    <AdminPublishing 
                      draftContent={draftContentState}
                      publishedContent={liveContent || draftContentState!}
                      draftProducts={draftProducts}
                      publishedProducts={publishedProducts}
                      onSuccessfulPublish={() => {
                        setRefreshKey(k => k + 1);
                      }}
                    />
                  )}
                  {activeSection === 'media' && <AdminMedia />}
                  {activeSection === 'settings' && (
                    activeRole === 'staff' ? (
                      <RBACBlockedView section="settings" role={activeRole} onElevate={() => changeActiveRole('owner')} />
                    ) : (
                      <AdminSettings 
                        sharedDraft={draftContentState} 
                        onChangeDraft={setDraftContentState} 
                        onStartOnboarding={startOnboarding}
                      />
                    )
                  )}
               </motion.div>
            </AnimatePresence>
         </div>

         {activeProposal && (
           <ProposalReviewModal
             proposal={activeProposal}
             runtimeResult={activeRuntimeResult}
             onApply={applyAgentProposal}
             onReject={rejectAgentProposal}
           />
         )}
         {previewCollapsed && (
           <button
             onClick={() => setPreviewCollapsed(false)}
             className="fixed bottom-8 right-8 z-[60] h-12 w-12 rounded-full bg-stone-900 hover:bg-amber-600 text-white shadow-2xl flex items-center justify-center border border-white/10 transition-all duration-300 transform hover:scale-110 active:scale-95"
             title="Open Storefront Preview"
           >
             <Eye size={18} />
           </button>
         )}
      </main>

      {/* Zone 3: Interactive Live Storefront Preview */}
      <LivePublicPreview
        draftContent={draftContentState}
        onUpdateDraftContent={setDraftContentState}
        publishedContent={liveContent || draftContentState!}
        draftProducts={draftProducts}
        publishedProducts={publishedProducts}
        isCollapsed={previewCollapsed}
        onToggleCollapse={() => setPreviewCollapsed(true)}
        isExpanded={previewExpanded}
        onToggleExpand={() => setPreviewExpanded(!previewExpanded)}
        onRequestProposal={(section, request, selectedMediaAsset) => {
          void createPreviewProposal(section, request, selectedMediaAsset);
        }}
        onNavigateToModule={(module, panel) => {
          // Switch center workspace module
          setActiveSection(module as AdminSection);
          // Set focused section panel
          setCmsInitialSection(panel as any);
        }}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
         {mobileMenuOpen && (
           <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[200] bg-[#f8f5ef] flex flex-col lg:hidden"
           >
              <div className="h-20 border-b border-stone-200 flex items-center justify-between px-6">
                 <div className="w-8 h-8 border border-amber-600 flex items-center justify-center">
                    <span className="text-amber-700 font-serif text-sm">C</span>
                 </div>
                 <button onClick={() => setMobileMenuOpen(false)}>
                    <X size={24} />
                 </button>
              </div>
              <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
                 {navItems.map((item) => (
                   <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id as AdminSection); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-6 p-4 rounded-sm transition-all ${
                       activeSection === item.id ? 'bg-amber-600 text-white font-black' : 'text-stone-600 border border-stone-200 bg-white'
                    }`}
                   >
                      <item.icon size={20} />
                      <span className="text-[12px] uppercase tracking-[0.4em]">{item.label}</span>
                   </button>
                 ))}
              </nav>
              <div className="p-8 border-t border-stone-200 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full grayscale" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{user.displayName || ownerProfile.name}</p>
                 </div>
                 <button onClick={handleSignOut} className="p-2 text-stone-500">
                    <LogOut size={20} />
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <OnboardingTour onComplete={() => console.log('Onboarding tour finished')} />
    </div>
  );
}

function AdminIntelligencePanel({
  agentsCount,
  membersCount,
  productsCount,
  procurementReady,
}: {
  agentsCount: number;
  membersCount: number;
  productsCount: number;
  procurementReady: boolean;
}) {
  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.8em] text-amber-700 font-black">Intelligence</span>
        <h2 className="text-4xl font-serif tracking-[0.16em] uppercase text-stone-900">Business Readiness</h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-600">
          This module now explains what the system actually knows. It highlights the current operating coverage of the
          store rather than showing a dead setup button.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardTile icon={Users} label="Clients in CRM" value={String(membersCount)} />
        <DashboardTile icon={Package} label="Products in Registry" value={String(productsCount)} />
        <DashboardTile icon={Brain} label="LeeWay Employees" value={String(agentsCount)} />
        <DashboardTile icon={LineChart} label="Market Feed" value={procurementReady ? 'Ready' : 'Pending'} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InfoCard
          title="What The Intelligence Covers"
          body="Client activity, inventory count, workforce coverage, and sourcing readiness are visible now. Payments, partner APIs, and live media workflows still need external credentials before they can become autonomous."
        />
        <InfoCard
          title="Why This Matters"
          body="It gives Avion a plain-language snapshot of what is already operational and what is still waiting on a real provider connection. No more mystery buttons."
        />
      </div>
    </div>
  );
}

function AdminPrivacyPanel({
  membersCount,
  acceptedCount,
}: {
  membersCount: number;
  acceptedCount: number;
}) {
  const pendingCount = Math.max(membersCount - acceptedCount, 0);

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.8em] text-amber-700 font-black">Privacy & Consent</span>
        <h2 className="text-4xl font-serif tracking-[0.16em] uppercase text-stone-900">Consent Operations</h2>
        <p className="max-w-3xl text-sm leading-7 text-stone-600">
          This section is now a simple operational guide. It shows consent coverage and explains how customer data
          should be treated until a full compliance backend is connected.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DashboardTile icon={ShieldCheck} label="Accepted Consent" value={String(acceptedCount)} />
        <DashboardTile icon={Users} label="Customers Tracked" value={String(membersCount)} />
        <DashboardTile icon={UserRound} label="Needs Review" value={String(pendingCount)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <InfoCard
          title="Current Policy"
          body="Only collect what the store truly needs for selling, shipping, concierge follow-up, and account history. Sensitive owner actions should stay behind the admin lock and employee permissions."
        />
        <InfoCard
          title="Next Compliance Step"
          body="When live forms and member signups are connected, the next upgrade should be a real consent record, privacy request workflow, and role-based employee access policy."
        />
      </div>
    </div>
  );
}

function DashboardTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{label}</p>
          <p className="mt-2 text-2xl font-serif uppercase tracking-[0.1em] text-stone-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}
function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-[0.22em] text-stone-900">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-stone-600">{body}</p>
    </div>
  );
}

function AdminProductList() {
  const { products, loading } = useDraftProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];

  const renderRuntimeBanner = () => {
    switch (mode) {
      case 'PRODUCTION_AUTHORITY':
        return (
          <div className="rounded-[1.5rem] bg-stone-900 border border-amber-500/30 p-6 mb-8 flex items-start gap-5 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-[300px] h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08)_0%,transparent_75%)] pointer-events-none" />
            <div className="bg-amber-500/10 text-amber-500 p-3 rounded-xl border border-amber-500/20">
              <ShieldCheck size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">PRODUCTION_AUTHORITY — FIRESTORE ACTIVE</h3>
                <span className="text-[8px] bg-green-500/10 text-green-500 border border-green-500/25 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Enabled</span>
              </div>
              <p className="text-[11px] text-stone-300 max-w-4xl tracking-wide leading-relaxed">
                The product catalog is operating with full <strong>Sovereign Production Authority</strong>. All registry updates live-stream directly to customers.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-stone-400 font-black">
                <span>ID: <span className="text-amber-500">{meta.id}</span></span>
                <span>Agent: <span className="text-amber-500">{meta.ownerAgent}</span></span>
                <span>Risk: <span className="text-amber-500">{meta.riskLevel}</span></span>
                <span>Trace: <span className="text-amber-500">{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span className="text-amber-500">{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'DEVELOPMENT_BOOTSTRAP':
        return (
          <div className="rounded-[1.5rem] bg-amber-50 border border-amber-200 p-6 mb-8 flex items-start gap-5 shadow-md text-left">
            <div className="bg-amber-100 text-amber-700 p-3 rounded-xl border border-amber-200">
              <Package size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-amber-900">DEVELOPMENT_BOOTSTRAP — LOCAL DEVELOPER MODE</h3>
                <span className="text-[8px] bg-amber-600/10 text-amber-700 border border-amber-600/20 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Staging Sandbox</span>
              </div>
              <p className="text-[11px] text-amber-800 max-w-4xl leading-relaxed">
                Running in local developer staging mode. Edits save to localStorage keys (<code className="bg-amber-100/50 px-1 rounded">campbell-products-draft</code>). <strong>Visibly NOT production authority.</strong>
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-amber-900/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'STATIC_BOOTSTRAP_CONTENT':
        return (
          <div className="rounded-[1.5rem] bg-stone-50 border border-stone-200 p-6 mb-8 flex items-start gap-5 shadow-sm text-left">
            <div className="bg-stone-200 text-stone-600 p-3 rounded-xl">
              <Package size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-stone-800">STATIC_BOOTSTRAP_CONTENT — BUILD-TIME DEFAULTS</h3>
                <span className="text-[8px] bg-stone-600/10 text-stone-600 border border-stone-600/20 px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Disabled</span>
              </div>
              <p className="text-[11px] text-stone-600 max-w-4xl leading-relaxed">
                Rendered with build-time static default constants. No dynamic authority is active. Edits and publishing are disabled.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-stone-600/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
      case 'CONFIGURATION_BLOCKED':
      default:
        return (
          <div className="rounded-[1.5rem] bg-rose-50 border border-rose-200 p-6 mb-8 flex items-start gap-5 shadow-lg text-left">
            <div className="bg-rose-100 text-rose-700 p-3 rounded-xl border border-rose-200">
              <LockKeyhole size={24} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-rose-900">CONFIGURATION_BLOCKED — CRITICAL SECURITY INTERCEPT</h3>
                <span className="text-[8px] bg-rose-600 text-white px-2 py-0.5 font-bold uppercase tracking-widest rounded-full">Publish Disabled</span>
              </div>
              <p className="text-[11px] text-rose-800 max-w-4xl leading-relaxed font-bold">
                {meta.missingConfigDetail} The system refuses to pretend to have dynamic database authority. Publish and Draft modifications are strictly disabled.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-2 text-[9px] uppercase tracking-wider text-rose-900/60 font-black">
                <span>ID: <span>{meta.id}</span></span>
                <span>Agent: <span>{meta.ownerAgent}</span></span>
                <span>Risk: <span>{meta.riskLevel}</span></span>
                <span>Trace: <span>{meta.tracePath.join(' → ')}</span></span>
                <span>Audit: <span>{meta.auditCategory}</span></span>
              </div>
            </div>
          </div>
        );
    }
  };

  const displayedProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (p: Product) => {
    try {
      await saveDraftProduct(p);
      setEditingProduct(null);
    } catch (err: any) {
      alert(`Save Draft Failed: ${err.message}`);
    }
  };

  const handlePublish = async (p: Product) => {
    const role = localStorage.getItem('campbell-active-role') || 'owner';
    if (role !== 'owner') {
      alert(`SECURITY INTERCEPT (POLICY-RBAC-401): Simulated role "${role.toUpperCase()}" lacks authority to publish live updates to the storefront registry. Gated by Shield Governor Serah Kane. Switched to staging draft instead.`);
      return;
    }
    try {
      await publishProduct(p, products);
      alert(`Product "${p.title}" successfully published to the live storefront!`);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (product: Product) => {
    const role = localStorage.getItem('campbell-active-role') || 'owner';
    if (role !== 'owner') {
      alert(`SECURITY INTERCEPT (POLICY-RBAC-401): Simulated role "${role.toUpperCase()}" lacks authority to delete storefront registry records. Gated by Shield Governor Serah Kane.`);
      return;
    }
    if (!window.confirm(`Remove "${product.title || product.sku}" from the registry?`)) return;
    try {
      await deleteProduct(product);
    } catch (err: any) {
      alert(`Delete Failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-10">
       {renderRuntimeBanner()}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Registry</span>
             <h2 className="text-4xl font-serif tracking-widest uppercase">Inventory</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              disabled={!meta.publishPermission}
              onClick={() => setEditingProduct({ 
                id: `new-${Date.now()}`, 
                slug: '',
                sku: `CC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 
                title: '', 
                price: 0, 
                status: 'draft', 
                image: '', 
                images: [],
                stoneType: 'Lab', 
                metal: '14K Yellow Gold', 
                carat: 1, 
                diamondCut: 'Round', 
                clarity: 'VS1',
                color: 'F',
                certification: 'IGI',
                description: '', 
                productStory: '',
                diamondPassport: { source: '', inspectedBy: '', verifiedDate: '', qualityNotes: '' },
                symbolism: '',
                stylingNotes: '',
                matchingProducts: [],
                category: 'Rings', 
                subcategory: '', 
                gender: 'women', 
                collection: '', 
                inventory: 1, 
                available: true,
                tags: [],
                imageAlt: '',
                seoTitle: '',
                seoDescription: '',
                featured: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })}
              className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
               <Plus size={16} /> Add Product
            </button>
            <LeeWayHelpTrigger helpId="help.action.addProduct" />
          </div>
       </div>

       <div className="bg-[#111] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#050505] flex items-center justify-between">
             <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input 
                  type="text" 
                  placeholder="SEARCH REGISTRY..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black-pure border border-white/5 pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
                />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-[#050505] border-b border-white/5">
                   <tr>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Identity</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Specs</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Price</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Inventory</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Status</th>
                      <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {displayedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="p-6">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-black-pure border border-white/5 p-2 overflow-hidden flex items-center justify-center shrink-0">
                                  {product.image ? (
                                    <img src={publicAssetUrl(product.image)} alt="" className="max-w-full max-h-full object-contain grayscale" />
                                  ) : (
                                    <ImageIcon size={20} className="text-white/10" />
                                  )}
                                </div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-2">
                                     <p className="text-[11px] font-black tracking-widest uppercase truncate max-w-[200px]">{product.title || 'Untitled Artifact'}</p>
                                     {product.featured && <span className="bg-gold/10 text-gold text-[7px] font-black px-1.5 py-0.5 rounded tracking-widest">FEATURED</span>}
                                   </div>
                                   <p className="text-[8px] font-mono text-gold italic uppercase">{product.sku} ({product.slug || 'no-slug'})</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-6">
                             <span className="text-[9px] uppercase tracking-widest text-white/40 block">{product.category} ({product.gender})</span>
                             <span className="text-[8px] uppercase tracking-widest text-white/20">{product.metal} — {product.carat}ct — {product.stoneType}</span>
                          </td>
                          <td className="p-6">
                             <span className="text-[11px] font-mono">${product.price.toLocaleString()}</span>
                          </td>
                          <td className="p-6">
                             <span className="text-[11px] font-mono">{product.inventory}</span>
                          </td>
                          <td className="p-6">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  product.status === 'live' ? 'bg-green-500' : 
                                  product.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                                <span className="text-[9px] uppercase tracking-widest font-black">{product.status}</span>
                             </div>
                          </td>
                          <td className="p-6 text-right">
                             <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setEditingProduct(product)} className="px-4 py-2 bg-white/5 text-[9px] uppercase tracking-widest font-black text-white hover:bg-gold hover:text-black transition-all">Publish Product</button>
                                  <LeeWayHelpTrigger helpId="help.action.publishProduct" label="Help" />
                                </div>
                                <button onClick={() => handleDelete(product)} className="p-2 bg-red-950/20 text-red-400 hover:bg-red-900 hover:text-white transition-all"><Trash2 size={12} /></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {editingProduct && (
          <ProductEditModal 
            product={editingProduct} 
            products={products}
            onClose={() => setEditingProduct(null)} 
            onSave={handleSave} 
            onPublish={handlePublish}
          />
        )}
     </div>
  );
}

function AdminTextArea({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
       <label className="text-[9px] uppercase tracking-widest text-white/40 font-black">{label}</label>
       <textarea 
         value={value} 
         onChange={e => onChange(e.target.value)}
         rows={3}
         className="w-full bg-white/5 border border-white/10 p-4 text-[11px] uppercase tracking-widest focus:border-gold outline-none transition-colors leading-relaxed"
       />
    </div>
  );
}

function AdminTextField({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
      />
    </div>
  );
}

function ProductEditModal({ 
  product, 
  products,
  onClose, 
  onSave,
  onPublish 
}: { 
  product: Product, 
  products: Product[],
  onClose: () => void, 
  onSave: (p: Product) => void,
  onPublish: (p: Product) => void
}) {
  const [draft, setDraft] = useState<Product>(product);
  const mode = getRuntimeAuthorityMode();
  const meta = RUNTIME_METADATA[mode];
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Validate on load / edit
    const errors: string[] = [];
    if (!draft.title?.trim()) errors.push("Missing title");
    if (!draft.slug?.trim()) errors.push("Missing unique slug");
    if (draft.price <= 0) errors.push("Invalid price");
    if (draft.status === 'live') {
      if (!draft.image) errors.push("Live products must have a primary image");
      if (!draft.imageAlt) errors.push("Live products must have image alt text");
    }
    setValidationErrors(errors);
  }, [draft]);

  return (
    <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="bg-[#111] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl"
       >
          <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#111] z-10">
             <div>
                <h3 className="text-xl font-serif tracking-widest uppercase">Edit Registry Artifact</h3>
                <p className="text-[8px] uppercase tracking-widest text-white/30 mt-1">Universal Command Matrix / Sovereign Product Authority</p>
             </div>
             <button onClick={onClose} className="p-2 hover:text-gold transition-colors"><X size={24} /></button>
          </div>

          {validationErrors.length > 0 && (
            <div className="mx-12 mt-8 p-6 bg-red-950/20 border border-red-500/30 text-red-400 space-y-2">
               <span className="text-[9px] uppercase tracking-widest font-black block">Validation Integrity Warnings:</span>
               <ul className="list-disc list-inside text-[9px] uppercase tracking-widest space-y-1">
                 {validationErrors.map(err => <li key={err}>{err}</li>)}
               </ul>
            </div>
          )}
          
          <div className="p-12 space-y-12">
             {/* General Identity */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">1. Identity & Pricing</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <AdminTextField label="Title" value={draft.title} onChange={v => setDraft({...draft, title: v})} />
                   <AdminTextField label="Slug" value={draft.slug} placeholder="e.g. signature-gold-ring" onChange={v => setDraft({...draft, slug: v})} />
                   <AdminTextField label="Price ($)" value={draft.price.toString()} onChange={v => setDraft({...draft, price: Number(v) || 0})} />
                   <AdminTextField label="SKU" value={draft.sku} onChange={v => setDraft({...draft, sku: v})} />
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Status / Visibility</label>
                      <select 
                        value={draft.status} 
                        onChange={e => setDraft({...draft, status: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest text-white focus:border-gold outline-none"
                      >
                         <option value="draft" className="bg-[#111]">Draft</option>
                         <option value="preview" className="bg-[#111]">Preview</option>
                         <option value="live" className="bg-[#111]">Live Storefront</option>
                         <option value="unavailable" className="bg-[#111]">Unavailable</option>
                      </select>
                   </div>
                   <div className="flex items-center h-full pt-8 pl-4 gap-4">
                      <input 
                        type="checkbox" 
                        id="featured-check"
                        checked={draft.featured || false} 
                        onChange={e => setDraft({...draft, featured: e.target.checked})} 
                        className="w-5 h-5 accent-gold cursor-pointer"
                      />
                      <label htmlFor="featured-check" className="text-[9px] uppercase tracking-[0.2em] font-black text-white cursor-pointer select-none">Featured on Home</label>
                   </div>
                </div>
             </div>

             {/* Classification & Metadata */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">2. Category & Collection</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Category</label>
                      <select 
                        value={draft.category} 
                        onChange={e => setDraft({...draft, category: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest text-white focus:border-gold outline-none"
                      >
                         <option value="Rings" className="bg-[#111]">Rings</option>
                         <option value="Chains" className="bg-[#111]">Chains</option>
                         <option value="Pendants" className="bg-[#111]">Pendants</option>
                         <option value="Bracelets" className="bg-[#111]">Bracelets</option>
                         <option value="Stud Earrings" className="bg-[#111]">Stud Earrings</option>
                         <option value="Loose Diamonds" className="bg-[#111]">Loose Diamonds</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Gender Collection</label>
                      <select 
                        value={draft.gender} 
                        onChange={e => setDraft({...draft, gender: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest text-white focus:border-gold outline-none"
                      >
                         <option value="women" className="bg-[#111]">Women</option>
                         <option value="men" className="bg-[#111]">Men</option>
                         <option value="unisex" className="bg-[#111]">Unisex</option>
                      </select>
                   </div>
                   <AdminTextField label="Collection Tag" value={draft.collection || ''} onChange={v => setDraft({...draft, collection: v})} />
                </div>
             </div>

             {/* Images and Media */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">3. Media & Accessibility</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminTextField label="Primary Image Source Path" value={draft.image} onChange={v => setDraft({...draft, image: v})} />
                   <AdminTextField label="Image Accessibility Alt Text" value={draft.imageAlt || ''} placeholder="e.g. Stunning 14K Signature Diamond Ring on pure white background." onChange={v => setDraft({...draft, imageAlt: v})} />
                </div>
             </div>

             {/* Diamond & Material Specifications */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">4. Sourcing & Technical Specs</span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   <AdminTextField label="Material / Metal" value={draft.metal} onChange={v => setDraft({...draft, metal: v as any})} />
                   <AdminTextField label="Carat Weight" value={draft.carat.toString()} onChange={v => setDraft({...draft, carat: Number(v) || 0})} />
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Diamond Cut Shape</label>
                      <select 
                        value={draft.diamondCut} 
                        onChange={e => setDraft({...draft, diamondCut: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest text-white focus:border-gold outline-none"
                      >
                         <option value="Round" className="bg-[#111]">Round</option>
                         <option value="Princess" className="bg-[#111]">Princess</option>
                         <option value="Oval" className="bg-[#111]">Oval</option>
                         <option value="Cushion" className="bg-[#111]">Cushion</option>
                         <option value="Emerald" className="bg-[#111]">Emerald</option>
                         <option value="Pear" className="bg-[#111]">Pear</option>
                         <option value="Radiant" className="bg-[#111]">Radiant</option>
                         <option value="Heart" className="bg-[#111]">Heart</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Diamond/Stone Sourcing</label>
                      <select 
                        value={draft.stoneType} 
                        onChange={e => setDraft({...draft, stoneType: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/5 p-4 text-[11px] uppercase tracking-widest text-white focus:border-gold outline-none"
                      >
                         <option value="Lab" className="bg-[#111]">Lab Grown</option>
                         <option value="Natural" className="bg-[#111]">Natural Earth Mined</option>
                         <option value="Certified" className="bg-[#111]">Sovereign Certified</option>
                         <option value="None" className="bg-[#111]">None</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* SEO Fields */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">5. Search Engine Optimization (SEO)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminTextField label="SEO Title Tag Override" value={draft.seoTitle || ''} onChange={v => setDraft({...draft, seoTitle: v})} />
                   <AdminTextField label="SEO Meta Description" value={draft.seoDescription || ''} onChange={v => setDraft({...draft, seoDescription: v})} />
                </div>
             </div>

             {/* Narrative */}
             <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black block border-b border-white/5 pb-2">6. Narrative Storytelling</span>
                <AdminTextArea label="Core Product Description" value={draft.description} onChange={v => setDraft({...draft, description: v})} />
                <AdminTextArea label="Product Legacy Story" value={draft.productStory} onChange={v => setDraft({...draft, productStory: v})} />
             </div>
          </div>

          <div className="p-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-6 sticky bottom-0 bg-[#111] z-10 text-left">
             <div className="flex gap-4">
                <div className="space-y-2">
                  <button 
                    onClick={() => onPublish(draft)}
                    disabled={validationErrors.length > 0 || !meta.publishPermission}
                    className={`px-10 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-widest transition-all ${
                      validationErrors.length > 0 || !meta.publishPermission ? 'opacity-40 cursor-not-allowed text-[#444] bg-[#222]' : 'hover:bg-white'
                    }`}
                  >
                     Publish Live
                  </button>
                  <LeeWayHelpTrigger helpId="help.action.publishLive" />
                </div>
                <div className="space-y-2">
                  <button 
                    disabled={!meta.publishPermission}
                    onClick={() => onSave(draft)}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                     Save Draft
                  </button>
                  <LeeWayHelpTrigger helpId="help.action.saveDraft" />
                </div>
             </div>
             <button onClick={onClose} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">Cancel</button>
          </div>
       </motion.div>
    </div>
  );
}

function ProposalReviewModal({
  proposal,
  runtimeResult,
  onApply,
  onReject,
}: {
  proposal: LeeWayAgentProposal;
  runtimeResult: LeeWaySkillRuntimeResult | null;
  onApply: (proposal: LeeWayAgentProposal) => void;
  onReject: (proposal: LeeWayAgentProposal) => void;
}) {
  return (
    <div data-leeway-id="admin.proposal.review" className="fixed inset-0 z-[560] flex items-center justify-center bg-stone-950/65 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl rounded-[2rem] border border-stone-200 bg-white shadow-2xl"
      >
        <div className="border-b border-stone-100 px-8 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-700">Preview Proposal</p>
          <h3 className="mt-2 text-2xl font-serif uppercase tracking-[0.12em] text-stone-900">{proposal.taskTitle}</h3>
          <p className="mt-2 text-sm text-stone-600">Nothing changes until you explicitly apply this proposal to draft.</p>
        </div>

        <div className="grid gap-6 px-8 py-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 text-xs text-stone-600">
              <div className="rounded-2xl border border-stone-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Proposal Trace</p>
                <div className="mt-2 space-y-1">
                  <p>Proposal ID: {proposal.proposalId}</p>
                  <p>Proposal Tag: {proposal.proposalTag || 'not-captured'}</p>
                  <p>Selected LeeWay ID: {proposal.selectedLeewayId ?? 'not-applicable'}</p>
                  <p>Selected schema paths: {proposal.selectedSchemaPaths?.join(', ') || 'not-captured'}</p>
                  <p>Workflow ID: {proposal.workflowId}</p>
                  <p>Action ID: {proposal.actionId}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Governance</p>
                <div className="mt-2 space-y-1">
                  <p>Owner agent: {proposal.agentLabel}</p>
                  <p>Routed skill: {proposal.routedSkillId || runtimeResult?.skillId || 'not-captured'}</p>
                  <p>Capability IDs: {proposal.capabilityIds?.join(', ') || 'not-captured'}</p>
                  <p>Runtime mode: {proposal.runtimeMode}</p>
                  <p>Risk: {proposal.riskLevel}</p>
                  <p>Approval: {proposal.requiresHumanApproval ? 'required' : 'not-required'}</p>
                  <p>Publish directly: false</p>
                </div>
              </div>
            </div>

            {runtimeResult && (
              <div className="rounded-2xl border border-stone-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Runtime Diagnostics</p>
                <div className="mt-4 space-y-3">
                  {runtimeResult.diagnostics.map((diagnostic) => (
                    <div key={diagnostic.checkId} className="rounded-xl bg-stone-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-900">{diagnostic.checkId}</p>
                        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-widest text-stone-500">
                          {diagnostic.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-stone-700">{diagnostic.evidence}</p>
                      {diagnostic.schemaPath && <p className="mt-1 text-[11px] text-stone-500">Schema: {diagnostic.schemaPath}</p>}
                      <p className="mt-1 text-[11px] text-stone-500">Telemetry Event: {diagnostic.telemetryEventId}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Before / After Changes</p>
              <div className="mt-4 space-y-3">
                {proposal.proposedChanges.map((change) => (
                  <div key={change.fieldPath} className="rounded-xl bg-stone-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-900">{change.label}</p>
                    <p className="mt-1 text-[11px] text-stone-500">Field: {change.fieldPath}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Before</p>
                        <p className="mt-1 text-sm text-stone-700 whitespace-pre-wrap">{String(change.before ?? 'empty')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">After</p>
                        <p className="mt-1 text-sm text-stone-900 whitespace-pre-wrap">{String(change.after ?? 'empty')}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-stone-600">Reason: {change.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {proposal.visibleImpact && (
              <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-600">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Visible Impact</p>
                <p className="mt-2">{proposal.visibleImpact}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Help And Laws</p>
              <div className="mt-3 space-y-3">
                <LeeWayHelpTrigger helpId="help.action.previewProposal" />
                <LeeWayHelpTrigger helpId="help.action.applyToDraft" />
                <LeeWayHelpTrigger helpId="help.action.rejectProposal" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {proposal.lawReferences.map((law) => (
                  <span key={law} className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-amber-800">
                    {law}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-600">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">What happens next</p>
              <p className="mt-2">Apply to Draft updates only the draft workspace. Reject leaves draft untouched. Manual publish is still required afterward.</p>
            </div>

            {runtimeResult && (
              <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-600">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">Telemetry & Audit</p>
                <div className="mt-3 space-y-2 text-[11px]">
                  {runtimeResult.telemetryEvents.map((entry) => <p key={entry.eventId}>{entry.eventType}: {entry.message}</p>)}
                  {runtimeResult.auditEvents.map((entry) => <p key={entry.auditEventId}>{entry.ownerApprovalStatus}: {entry.message}</p>)}
                </div>
              </div>
            )}

            {runtimeResult && (
              <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-600">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">MCP / Tools</p>
                <div className="mt-3 space-y-2 text-[11px]">
                  {runtimeResult.toolUsageRecords.map((entry) => (
                    <p key={entry.usageId}>
                      {entry.toolId} via {entry.mcpId}: {entry.result} ({entry.permissionState})
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onApply(proposal)}
              className="w-full rounded-full bg-stone-900 px-5 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-amber-600"
            >
              Apply To Draft
            </button>
            <button
              type="button"
              onClick={() => onReject(proposal)}
              className="w-full rounded-full border border-stone-200 px-5 py-4 text-[10px] font-black uppercase tracking-[0.28em] text-stone-500 transition hover:text-stone-900"
            >
              Reject Proposal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function RuntimeTracePanel({
  runtimeResult,
  runtimeStates,
  telemetryEvents,
  auditEvents,
  draftPatchEvents,
}: {
  runtimeResult: LeeWaySkillRuntimeResult;
  runtimeStates: LeeWayAgentRuntimeState[];
  telemetryEvents: LeeWayTelemetryEvent[];
  auditEvents: LeeWayAuditEvent[];
  draftPatchEvents: LeeWayDraftPatchIdentity[];
}) {
  const scopedTelemetry = telemetryEvents.filter((event) => event.actionId === runtimeResult.actionIdentity.actionId).slice(0, 5);
  const scopedAudit = auditEvents.filter((event) => event.actionId === runtimeResult.actionIdentity.actionId).slice(0, 5);
  const scopedPatches = draftPatchEvents.filter((event) => event.actionId === runtimeResult.actionIdentity.actionId).slice(0, 3);
  const scopedRuntimeState = runtimeStates.find((entry) => entry.runtimeId === runtimeResult.runtimeId) || runtimeResult.runtimeState;

  return (
    <div data-leeway-id="admin.runtime.trace" className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Runtime Trace</p>
          <h3 className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-stone-900">
            {runtimeResult.actionIdentity.actionId}
          </h3>
        </div>
        <div className="grid gap-2 text-[11px] text-stone-600 sm:grid-cols-2 lg:grid-cols-4">
          <p>Agent: {runtimeResult.actionIdentity.agentDisplayName}</p>
          <p>Skill: {runtimeResult.actionIdentity.skillId}</p>
          <p>Workflow: {runtimeResult.actionIdentity.workflowId}</p>
          <p>Region: {runtimeResult.actionIdentity.selectedLeewayId || 'none'}</p>
                  <p>Schema: {runtimeResult.actionIdentity.selectedSchemaPath || 'none'}</p>
                  <p>Telemetry: {runtimeResult.actionIdentity.telemetryStreamId}</p>
                  <p>Authority: {runtimeResult.actionIdentity.runtimeAuthorityMode}</p>
                  <p>Status: {scopedRuntimeState.status}</p>
                </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Diagnostics</p>
          <div className="mt-3 space-y-2 text-[11px] text-stone-700">
            {runtimeResult.diagnostics.map((entry) => (
              <p key={entry.diagnosticId}>{entry.checkId}: {entry.status}</p>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Laws & Capabilities</p>
          <div className="mt-3 space-y-2 text-[11px] text-stone-700">
            <p>Laws: {runtimeResult.actionIdentity.lawReferences.join(', ') || 'none'}</p>
            <p>Capabilities: {runtimeResult.actionIdentity.capabilityIds.join(', ') || 'none'}</p>
            <p>Schema paths: {runtimeResult.proposalIdentity?.beforeValues.map((entry) => entry.fieldPath).join(', ') || runtimeResult.actionIdentity.selectedSchemaPath || 'none'}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Telemetry</p>
          <p className="mt-1 text-[10px] text-stone-500">Telemetry events recorded: {scopedTelemetry.length}</p>
          <div className="mt-3 space-y-2 text-[11px] text-stone-700">
            {scopedTelemetry.map((entry) => (
              <p key={entry.eventId}>{entry.eventType}: {entry.message}</p>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Audit & Patch</p>
          <p className="mt-1 text-[10px] text-stone-500">Audit events recorded: {scopedAudit.length}</p>
          <p className="mt-1 text-[10px] text-stone-500">Approval status: {scopedAudit[0]?.ownerApprovalStatus || 'awaiting-approval'}</p>
          <div className="mt-3 space-y-2 text-[11px] text-stone-700">
            {scopedAudit.map((entry) => (
              <p key={entry.auditEventId}>{entry.ownerApprovalStatus}: {entry.message}</p>
            ))}
            {scopedPatches.map((entry) => (
              <p key={entry.patchId}>Patch {entry.patchId}: {entry.validationResult}</p>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">MCP / Tools</p>
          <div className="mt-3 space-y-2 text-[11px] text-stone-700">
            {runtimeResult.toolUsageRecords.length > 0 ? runtimeResult.toolUsageRecords.map((entry) => (
              <p key={entry.usageId}>
                {entry.toolId} via {entry.mcpId}: {entry.result} ({entry.permissionState})
              </p>
            )) : (
              <p>NO_MCP_TOOL_USED</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RBACBlockedView({ section, role, onElevate }: { section: string; role: string; onElevate: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8 text-left">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-[#1c0f11]/90 backdrop-blur-xl border border-red-500/20 p-10 lg:p-12 rounded-[2rem] space-y-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500 animate-pulse" />
        <div className="flex justify-center">
          <div className="h-16 w-16 items-center justify-center rounded-[1.6rem] bg-red-500/10 text-red-500 border border-red-500/20 flex">
            <ShieldAlert size={28} className="animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-red-400">Zero-Trust Intercept — Policy Gated</span>
          <h2 className="text-3xl font-serif text-white uppercase tracking-widest leading-normal">Access Blocked</h2>
          <p className="text-stone-300 text-xs leading-relaxed max-w-md mx-auto">
            The employee access policy (<strong>POLICY-RBAC-403</strong>) enforced by <strong>Shield Governor Serah Kane</strong> restricts the simulated role <strong>{role.toUpperCase()}</strong> from accessing the administrative endpoint: <code className="text-red-400 bg-red-950/30 px-2 py-1 rounded">/{section}</code>.
          </p>
        </div>

        <div className="border-t border-white/5 pt-6 space-y-4">
          <p className="text-[9px] uppercase tracking-widest text-stone-400">
            Audit ID: SEC-{(Math.random() * 10000).toFixed(0)} | Agent: Shield Governor Serah Kane | Status: Blocked
          </p>
          <button 
            onClick={onElevate}
            className="px-8 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-white hover:text-black transition-all shadow-lg"
          >
            Escalate: Request Owner Override
          </button>
        </div>
      </motion.div>
    </div>
  );
}
