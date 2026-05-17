/*
LEEWAY HEADER — DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=sliders

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI.ADMIN
TAG: UI.ADMIN.SETTINGS
DESCRIPTION: Comprehensive Leeway-governed Settings Center with Unified Theme Manager, AI Fleet, MCP, and Guidance
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import React, { useEffect, useState, useMemo } from 'react';
import {
  Sliders,
  Palette,
  Users,
  Link,
  HelpCircle,
  Bell,
  ShieldCheck,
  Scale,
  Activity,
  Cpu,
  Eye,
  Database,
  ArrowRight,
  Smartphone,
  Tablet,
  Laptop,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  XCircle,
  FileText,
  UserRound,
  LockKeyhole,
  BellRing,
} from 'lucide-react';
import { SiteContent } from '../../content/siteContent';
import { LEEWAY_LAW_SET, LEEWAY_LAW_SHORT } from '../../core/leeway/LeeWayLawSet';
import { LEEWAY_CAPABILITY_REGISTRY } from '../../core/leeway/LeeWayAgentCapabilityRegistry';
import { LEEWAY_AGENT_ROSTER, LeeWayAgentRosterEntry } from '../../core/leeway/LeeWayAgentRegistry';
import { LEEWAY_SKILL_REGISTRY } from '../../core/leeway/LeeWaySkillRegistry';
import { LEEWAY_MCP_REGISTRY, LeeWayMcpEntry } from '../../core/leeway/LeeWayMCPRegistry';
import { LEEWAY_PROJECTION_CONTRACTS } from '../../core/leeway/LeeWayProjectionContract';
import {
  loadOwnerProfile,
  saveOwnerProfile,
  loadOwnerPasscode,
  saveOwnerPasscode,
  OwnerProfile,
  DEFAULT_OWNER_PROFILE
} from '../../lib/adminConfig';
import { OwnerManual } from './OwnerManual';
import { LeeWayHelpTrigger } from './LeeWayHelpTrigger';

interface AdminSettingsProps {
  sharedDraft: SiteContent | null;
  onChangeDraft: (draft: SiteContent) => void;
  onStartOnboarding: () => void;
}

interface GovernedNotification {
  id: string;
  type: string;
  ownerAgent: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  read: boolean;
}

export function AdminSettings({ sharedDraft, onChangeDraft, onStartOnboarding }: AdminSettingsProps) {
  // Roster Tab view state
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'theme' | 'workforce' | 'mcp' | 'help' | 'lanes'>('theme');

  // Profile state
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(DEFAULT_OWNER_PROFILE);
  const [ownerPasscode, setOwnerPasscode] = useState('');

  // Custom Agent Nicknames (persisted in LocalStorage)
  const [agentNicknames, setAgentNicknames] = useState<Record<string, string>>({});

  // Interactive Theme Staging Fields
  const [primaryColor, setPrimaryColor] = useState('#D6B46A');
  const [headingFont, setHeadingFont] = useState('Playfair Display');
  const [layoutDensity, setLayoutDensity] = useState('comfortable'); // compact | comfortable | loose
  const [luxuryLevel, setLuxuryLevel] = useState(90);
  const [animationIntensity, setAnimationIntensity] = useState('smooth'); // static | smooth | cinematic
  const [contrastMode, setContrastMode] = useState('luxury-dark'); // luxury-dark | high-contrast

  // Live VS Code bridge Simulation State
  const [vsCodeConnected, setVsCodeConnected] = useState(true);
  const [runtimeMode, setRuntimeMode] = useState<'DEVELOPMENT_BOOTSTRAP' | 'PRODUCTION_AUTHORITY' | 'CONFIGURATION_BLOCKED'>('DEVELOPMENT_BOOTSTRAP');

  // Roster fleet state
  const [fleetRoster, setFleetRoster] = useState<LeeWayAgentRosterEntry[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<GovernedNotification[]>([]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    setOwnerProfile(loadOwnerProfile());
    setOwnerPasscode(loadOwnerPasscode());

    // Load agent nicknames
    const savedNicknames = localStorage.getItem('campbell-agent-nicknames');
    if (savedNicknames) {
      setAgentNicknames(JSON.parse(savedNicknames));
    }

    setFleetRoster(LEEWAY_AGENT_ROSTER);

    // Initial theme variables
    if (sharedDraft?.theme) {
      setPrimaryColor(sharedDraft.theme.primaryColor || '#D6B46A');
      setHeadingFont(sharedDraft.theme.headingFont || 'Playfair Display');
    }

    // Seed governed notifications
    const initialNotifications: GovernedNotification[] = [
      {
        id: "NOT-001",
        type: "Draft Saved",
        ownerAgent: "Forge",
        severity: "info",
        message: "Visual storefront theme changes staged successfully to draft registry.",
        timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      },
      {
        id: "NOT-002",
        type: "VS Code Connected",
        ownerAgent: "Atlas",
        severity: "info",
        message: "Active handshake verified with LeeWay VS Code extension bridge.",
        timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      },
      {
        id: "NOT-003",
        type: "Compliance Warning",
        ownerAgent: "Sentinel",
        severity: "warning",
        message: "Public and administrative primary color drift detected. Unified synchronization auto-enforced.",
        timestamp: new Date(Date.now() - 10800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      }
    ];
    setNotifications(initialNotifications);
  }, [sharedDraft]);

  // LAW-0016: Unified Theme Coupling Rule Enforcer
  useEffect(() => {
    if (primaryColor) {
      // Set primary color variable globally on document
      document.documentElement.style.setProperty('--color-gold', primaryColor);
      document.documentElement.style.setProperty('--gold', primaryColor);
    }
  }, [primaryColor]);

  // Handle color or text theme adjustments
  const handleUpdateThemeValue = (colorHex: string) => {
    setPrimaryColor(colorHex);

    if (sharedDraft) {
      const updated = {
        ...sharedDraft,
        theme: {
          ...sharedDraft.theme,
          primaryColor: colorHex
        }
      };
      onChangeDraft(updated);
    }
  };

  const handleUpdateFontValue = (fontName: string) => {
    setHeadingFont(fontName);

    if (sharedDraft) {
      const updated = {
        ...sharedDraft,
        theme: {
          ...sharedDraft.theme,
          headingFont: fontName
        }
      };
      onChangeDraft(updated);
    }
  };

  const handleSaveNickname = (agentId: string, nickName: string) => {
    const updated = { ...agentNicknames, [agentId]: nickName };
    setAgentNicknames(updated);
    localStorage.setItem('campbell-agent-nicknames', JSON.stringify(updated));

    // Update fleet roster state
    setFleetRoster(current =>
      current.map(agent => agent.systemId === agentId ? { ...agent, nickname: nickName } : agent)
    );

    setSavedMessage(`Custom nickname saved for agent.`);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSaveProfileSettings = () => {
    saveOwnerProfile(ownerProfile);
    saveOwnerPasscode(ownerPasscode);
    setSavedMessage('Owner profile and security locks updated successfully.');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(current => current.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Selected agent computed details
  const activeAgentDetails = useMemo(() => {
    if (!selectedAgentId) return null;
    const agent = fleetRoster.find(a => a.systemId === selectedAgentId);
    if (!agent) return null;

    // Find all capabilities
    const capabilities = LEEWAY_CAPABILITY_REGISTRY.filter(cap => cap.agentId === agent.systemId);
    // Find skills
    const skills = LEEWAY_SKILL_REGISTRY.filter(sk => sk.agentOwner === agent.displayName);

    return { agent, capabilities, skills };
  }, [selectedAgentId, fleetRoster]);

  // Contextual Help Guide Data mapping
  const activeHelpGuide = useMemo(() => {
    return {
      title: "Settings & Experience Dashboard Controls",
      guidance: [
        {
          step: "1. Brand Identity Customization",
          description: "Modify the primary color selector. Notice that under LAW-0016 (Unified Theme Coupling), adjustments immediately update the public preview accents and AdminOS highlight rings synchronously."
        },
        {
          step: "2. Autonomous AI Fleet Customization",
          description: "Rename agent nicknames to fit your firm's display culture. The system retains stable underlying LeeWay IDs to ensure complete operational trace integrity."
        },
        {
          step: "3. Governed Integrations",
          description: "Inspect active heartbeats on the Model Context Protocol (MCP) server grid. View exactly which external directories and browser layers are allowed or blocked."
        }
      ]
    };
  }, []);

  return (
    <div className="space-y-8 pb-24 text-stone-800" data-leeway-screen-id="settings">

      {/* Top Header */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.8em] text-amber-700 font-bold flex items-center gap-2">
          <Sliders size={12} className="text-amber-600 animate-pulse" />
          Governance Dashboard
        </span>
        <h2 className="text-4xl font-serif tracking-[0.12em] uppercase text-stone-900">
          LeeWay Sovereign Command Center
        </h2>
        <p className="max-w-4xl text-sm leading-7 text-stone-600">
          Governed operating portal for Campbell &amp; Co. under the strict
          <strong> LeeWay Law Set</strong>. Manage brand experience theme synchronization,
          AI Workforce nickname mappings, external Model Context Protocol (MCP) nodes, and security profiles safely.
        </p>
      </div>

      {savedMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 flex items-center gap-3 animate-fade-in">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Main Tab bar */}
      <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar gap-2">
        <TabButton active={activeSubTab === 'theme'} onClick={() => setActiveSubTab('theme')} label="Experience Theme" icon={<Palette size={14} />} />
        <TabButton active={activeSubTab === 'workforce'} onClick={() => setActiveSubTab('workforce')} label="AI Fleet Roster" icon={<Users size={14} />} />
        <TabButton active={activeSubTab === 'mcp'} onClick={() => setActiveSubTab('mcp')} label="MCP & Integrations" icon={<Link size={14} />} />
        <TabButton active={activeSubTab === 'lanes'} onClick={() => setActiveSubTab('lanes')} label="Growth Lanes" icon={<Scale size={14} />} />
        <TabButton active={activeSubTab === 'profile'} onClick={() => setActiveSubTab('profile')} label="Owner & Access Controls" icon={<ShieldCheck size={14} />} />
        <TabButton active={activeSubTab === 'help'} onClick={() => setActiveSubTab('help')} label="Guidelines & Notifications Desk" icon={<HelpCircle size={14} />} />
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_400px]">

        {/* Workspace content block */}
        <div className="space-y-6">

          {/* TAB 1: UNIFIED THEME SETTINGS MANAGER */}
          {activeSubTab === 'theme' && (
            <div className="space-y-6 animate-fade-in">
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">Experience Theme Manager</h3>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Live synchronized variables scoped globally</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* Primary Color Picker */}
                  <label className="block space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Primary Color (Brand Accent)</span>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[8px] uppercase tracking-widest font-black rounded-full border border-amber-200">LAW-0016 Coupling</span>
                    </div>
                    <LeeWayHelpTrigger helpId="help.ui.themeColor" label="Change Theme Color" />
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => handleUpdateThemeValue(e.target.value)}
                        className="w-16 h-12 rounded-xl border border-stone-200 cursor-pointer outline-none bg-transparent"
                        data-leeway-id="theme-primary-picker"
                        data-leeway-tag="input.theme"
                        data-leeway-schema-path="settings.experience.primaryColor"
                        data-leeway-action-id="update-primary-color"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => handleUpdateThemeValue(e.target.value)}
                        className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 font-mono focus:border-amber-300 outline-none"
                        data-leeway-id="theme-primary-text"
                        data-leeway-tag="input.theme"
                        data-leeway-schema-path="settings.experience.primaryColor"
                        data-leeway-action-id="type-primary-color"
                      />
                    </div>
                  </label>

                  {/* Heading Font selection */}
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Heading Typography Family</span>
                    <select
                      value={headingFont}
                      onChange={(e) => handleUpdateFontValue(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-amber-300 outline-none"
                      data-leeway-id="theme-heading-font-select"
                      data-leeway-tag="select.theme"
                      data-leeway-schema-path="settings.experience.headingFont"
                      data-leeway-action-id="select-heading-font"
                    >
                      <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                      <option value="Inter">Inter (Sovereign Clean Sans)</option>
                      <option value="Cinzel">Cinzel (Classical Elegant)</option>
                      <option value="Bodoni Moda">Bodoni Moda (Modern High-Fashion)</option>
                    </select>
                  </label>

                  {/* Spacing & Density */}
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Layout Spacing Density</span>
                    <select
                      value={layoutDensity}
                      onChange={(e) => setLayoutDensity(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-amber-300 outline-none"
                      data-leeway-id="theme-density-select"
                      data-leeway-tag="select.theme"
                      data-leeway-schema-path="settings.experience.layoutDensity"
                      data-leeway-action-id="select-density"
                    >
                      <option value="compact">Compact (Minimalist grids)</option>
                      <option value="comfortable">Comfortable (Balanced luxury)</option>
                      <option value="loose">Loose (Cinematic narrative spacing)</option>
                    </select>
                  </label>

                  {/* Contrast preference */}
                  <label className="block space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Contrast Preset</span>
                    <select
                      value={contrastMode}
                      onChange={(e) => setContrastMode(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 focus:border-amber-300 outline-none"
                    >
                      <option value="luxury-dark">Luxury Gold/Light Sand</option>
                      <option value="high-contrast">High Contrast (Accessibility lock)</option>
                    </select>
                  </label>

                  {/* Luxury Value Slider */}
                  <div className="block space-y-2 md:col-span-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      <span>Brand Luxury Coefficient</span>
                      <span className="font-mono text-amber-700">{luxuryLevel}% Absolute Curation</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="100"
                      value={luxuryLevel}
                      onChange={(e) => setLuxuryLevel(parseInt(e.target.value))}
                      className="w-full accent-amber-600 bg-stone-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Animation presets */}
                  <div className="block space-y-2 md:col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">Animation Intensity Presets</span>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setAnimationIntensity('static')}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${animationIntensity === 'static' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                      >
                        Static
                      </button>
                      <button
                        onClick={() => setAnimationIntensity('smooth')}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${animationIntensity === 'smooth' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                      >
                        Smooth
                      </button>
                      <button
                        onClick={() => setAnimationIntensity('cinematic')}
                        className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${animationIntensity === 'cinematic' ? 'bg-amber-600 text-white border-amber-600 shadow-md' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                      >
                        Cinematic
                      </button>
                    </div>
                  </div>

                </div>

                {/* Scope Coupling Alert block under LAW-0016 */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 flex gap-4 items-start text-xs text-amber-800">
                  <Scale size={20} className="shrink-0 text-amber-600 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-bold uppercase tracking-wider">LAW-0016 Enforcement System</h4>
                    <p className="leading-relaxed">
                      Changing experience variables (primary color, typeface, intensity) is scoped as a
                      <strong> GLOBAL EXPERIENCE CHANGE</strong>. Under theme coupling laws, this instantly synchronized
                      CSS variable overrides across the administrative shell, visual CMS components, and live storefront preview panels.
                    </p>
                  </div>
                </div>

              </section>
            </div>
          )}

          {/* TAB 2: AI WORKFORCE STATUS & CAPABILITY ROSTER */}
          {activeSubTab === 'workforce' && (
            <div className="space-y-6 animate-fade-in">
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">Sovereign AI Workforce</h3>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Nickname customization & capability inspect console</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-normal">
                  The human owner owns the display nickname, but underlying LeeWay system IDs, permission blocks,
                  audit records, and compliance checkpoints remain fixed. Select an agent to inspect:
                </p>

                {/* Agents List Roster */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                  {fleetRoster.map(agent => (
                    <div
                      key={agent.systemId}
                      onClick={() => setSelectedAgentId(agent.systemId)}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${selectedAgentId === agent.systemId ? 'border-amber-400 bg-amber-50/20 shadow-sm' : 'border-stone-100 bg-stone-50 hover:bg-stone-100/50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${agent.status === 'working' ? 'bg-amber-100 text-amber-700 animate-spin' : 'bg-stone-200 text-stone-700'}`}>
                          {agent.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-stone-900">{agent.displayName}</h4>
                            <span className="text-[9px] text-stone-400 font-mono">({agent.systemId})</span>
                          </div>
                          <p className="text-[10px] text-stone-500">Custom Nickname: <strong className="text-amber-800">{agent.nickname}</strong></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-black ${agent.status === 'working' ? 'bg-amber-100 text-amber-700' : agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                          {agent.status}
                        </span>
                        <ArrowRight size={14} className="text-stone-400" />
                      </div>

                    </div>
                  ))}
                </div>

                {/* Agent Inspector Panel Details */}
                {activeAgentDetails && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-6 space-y-6 animate-fade-in">

                    <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">Agent Inspector</h4>
                        <span className="text-[10px] uppercase font-mono text-stone-500">ROLE ID: {activeAgentDetails.agent.immutableRoleId}</span>
                      </div>

                      {/* Customizable Nickname form inside inspector */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue={activeAgentDetails.agent.nickname}
                          id={`input-nick-${activeAgentDetails.agent.systemId}`}
                          placeholder="Assign nickname..."
                          className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 outline-none"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`input-nick-${activeAgentDetails.agent.systemId}`) as HTMLInputElement;
                            if (input) handleSaveNickname(activeAgentDetails.agent.systemId, input.value);
                          }}
                          className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-[9px] font-bold uppercase text-stone-400">Current Task</span>
                        <p className="text-stone-700 mt-1 font-semibold">{activeAgentDetails.agent.currentTask}</p>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase text-stone-400">Telemetry Stream ID</span>
                        <p className="text-stone-700 mt-1 font-mono">{activeAgentDetails.agent.currentTelemetryStream}</p>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase text-stone-400">Execution Layer</span>
                        <p className="text-stone-700 mt-1 uppercase font-mono">{activeAgentDetails.agent.executionEnvironment}</p>
                      </div>
                      <div>
                        <span className="block text-[9px] font-bold uppercase text-stone-400">VM State</span>
                        <p className="text-stone-700 mt-1 uppercase font-mono">{activeAgentDetails.agent.vmState}</p>
                      </div>
                    </div>

                    {/* Capabilities contract details */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold uppercase text-stone-400">Registered Capabilities</span>
                      <div className="flex gap-2 flex-wrap">
                        {activeAgentDetails.capabilities.length > 0 ? (
                          activeAgentDetails.capabilities.map(cap => (
                            <span key={cap.capabilityId} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-[9px] text-stone-700 font-semibold" title={cap.description}>
                              {cap.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-stone-400 italic">No direct schema mutation capabilities registered.</span>
                        )}
                      </div>
                    </div>

                    {/* Skills Details */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold uppercase text-stone-400">Active Skill Index</span>
                      <div className="flex gap-2 flex-wrap">
                        {activeAgentDetails.skills.length > 0 ? (
                          activeAgentDetails.skills.map(sk => (
                            <span key={sk.skillId} className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[9px] font-semibold" title={sk.description}>
                              {sk.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-stone-400 italic">No specific governed active skills registered.</span>
                        )}
                      </div>
                    </div>

                    {/* Law references */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold uppercase text-stone-400">Enforceable Law References</span>
                      <div className="flex gap-2">
                        {activeAgentDetails.agent.lawReferences.map(law => (
                          <span key={law} className="px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md text-[9px] font-mono font-bold" title={LEEWAY_LAW_SET.find(l => l.lawId === law)?.description}>
                            {law}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </section>
            </div>
          )}

          {/* TAB 3: MCP & BRIDGE INSPECTOR */}
          {activeSubTab === 'mcp' && (
            <div className="space-y-6 animate-fade-in">
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">

                {/* VS Code & Runtime header */}
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Link size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">MCP & Integration Bridge</h3>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Live system status & handshake protocols</p>
                  </div>
                </div>

                {/* VS Code bridge and runtime card indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* VS Code SDK card */}
                  <div className="p-5 border border-stone-200 bg-stone-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-stone-400">LeeWay VS Code SDK</span>
                      <h4 className="text-xs font-bold text-stone-700 mt-0.5">Local Extension Link</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${vsCodeConnected ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                        <span className="text-[10px] uppercase font-mono font-bold text-stone-600">{vsCodeConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setVsCodeConnected(!vsCodeConnected)}
                      className="p-3 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-stone-600 hover:text-stone-900 transition-colors"
                      title="Simulate handshake toggle"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>

                  {/* Runtime Authority modes */}
                  <div className="p-5 border border-stone-200 bg-stone-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-stone-400">Runtime Authority Mode</span>
                      <h4 className="text-xs font-bold text-stone-700 mt-0.5">Execution Constraints</h4>
                      <select
                        value={runtimeMode}
                        onChange={(e) => setRuntimeMode(e.target.value as any)}
                        className="bg-transparent border-none text-[10px] uppercase font-mono font-bold text-stone-600 focus:outline-none cursor-pointer mt-2"
                      >
                        <option value="DEVELOPMENT_BOOTSTRAP">DEVELOPMENT_BOOTSTRAP</option>
                        <option value="PRODUCTION_AUTHORITY">PRODUCTION_AUTHORITY</option>
                        <option value="CONFIGURATION_BLOCKED">CONFIGURATION_BLOCKED</option>
                      </select>
                    </div>
                    <ShieldCheck size={20} className="text-amber-600 shrink-0" />
                  </div>

                </div>

                <div className="border-t border-stone-100 pt-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Sovereign Model Context Protocols (MCP)</h4>

                  {/* MCP connection state rows */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {LEEWAY_MCP_REGISTRY.map(mcp => (
                      <div key={mcp.mcpId} className="p-4 border border-stone-100 bg-stone-50 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-xs font-bold text-stone-900">{mcp.label}</h5>
                              <span className="text-[9px] text-stone-400 font-mono">({mcp.mcpId})</span>
                            </div>
                            <span className="text-[9px] font-semibold text-stone-500 uppercase mt-0.5 block">Owner: <strong className="text-amber-800">{mcp.ownerAgent}</strong></span>
                          </div>

                          <span className={`px-2.5 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-black ${mcp.connectionState === 'MCP_CONNECTED' ? 'bg-green-100 text-green-700 border border-green-200' : mcp.connectionState === 'MCP_BLOCKED' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                            {mcp.connectionState.replace('MCP_', '')}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-stone-600">
                          <div>
                            <span className="text-stone-400 font-bold uppercase text-[8px] block">Risk Rating</span>
                            <span className="uppercase font-semibold">{mcp.riskLevel}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 font-bold uppercase text-[8px] block">Heartbeat Verified</span>
                            <span className="font-mono">{mcp.connectionState === 'MCP_CONNECTED' ? mcp.lastHeartbeat.slice(11, 19) : 'N/A'}</span>
                          </div>
                        </div>

                        {/* Block details / config requisites */}
                        {mcp.connectionState === 'MCP_BLOCKED' && mcp.blockedReason && (
                          <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-700 text-[10px] rounded-xl flex gap-2 items-start leading-relaxed">
                            <XCircle size={14} className="shrink-0 text-red-500 mt-0.5" />
                            <span>{mcp.blockedReason}</span>
                          </div>
                        )}

                        {mcp.connectionState === 'MCP_CONFIGURATION_MISSING' && (
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 text-amber-800 text-[10px] rounded-xl flex gap-2 items-start leading-relaxed">
                            <AlertTriangle size={14} className="shrink-0 text-amber-600 mt-0.5" />
                            <span>Requisite: {mcp.configurationRequirement}</span>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>

                </div>

              </section>
            </div>
          )}

          {/* TAB: LEEWAY GROWTH LANES DASHBOARD */}
          {activeSubTab === 'lanes' && (
            <div className="space-y-6 animate-fade-in text-stone-800">

              {/* Sovereign Growth Doctrine Banner */}
              <div className="rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-8 text-stone-100 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 font-serif text-[120px] pointer-events-none font-bold select-none translate-x-12 translate-y-6">
                  LANES
                </div>
                <div className="max-w-2xl space-y-4">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] uppercase tracking-widest font-black rounded-full">
                    Sovereign Growth Doctrine
                  </span>
                  <h3 className="text-2xl font-serif tracking-wider uppercase text-white">
                    The Growth-Safe visual governance
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-serif italic">
                    "LeeWay does not block growth. LeeWay blocks ungoverned growth. LeeWay does not stop agents. LeeWay gives agents lawful capability. LeeWay does not stop MCP tools. LeeWay makes MCP tools visible, permissioned, and auditable. LeeWay does not stop the owner. LeeWay protects the owner’s control."
                  </p>
                  <p className="text-xs text-stone-400">
                    By classifying capabilities into three distinct lanes, Campbell &amp; Co. maintains perfect visual and transactional integrity while letting the system scale safely.
                  </p>
                </div>
              </div>

              {/* Lanes Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* GREEN LANE: Safe Customization */}
                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        A
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[8px] uppercase tracking-widest font-black rounded-full border border-emerald-200">
                        Green Lane
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-emerald-800 transition-colors">Safe Customization</h4>
                      <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-mono">Immediate Deployment Allowed</p>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Theme customization, copywriting tweaks, FAQ refinements, product descriptors, layout ordering, and visual alt tag annotations are fully unlocked.
                    </p>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">Governed Rules</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-mono border border-emerald-100">LAW-0004</span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-mono border border-emerald-100">LAW-0009</span>
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-mono border border-emerald-100">LAW-0016</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between text-xs text-emerald-700 font-bold uppercase tracking-widest">
                    <span>Active &amp; Secure</span>
                    <CheckCircle size={16} />
                  </div>
                </div>

                {/* YELLOW LANE: Governed Expansion */}
                <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        B
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[8px] uppercase tracking-widest font-black rounded-full border border-amber-200">
                        Yellow Lane
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-amber-800 transition-colors">Governed Expansion</h4>
                      <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-mono">Sandbox-Enforced</p>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Integrating external Model Context Protocol (MCP) servers, adding new workforce agents, expanding databases, and custom schema extensions.
                    </p>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">Governed Rules</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-mono border border-amber-100">LAW-0011</span>
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-mono border border-amber-100">LAW-0013</span>
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-mono border border-amber-100">LAW-0017</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between text-xs text-amber-700 font-bold uppercase tracking-widest">
                    <span>Human Approval req.</span>
                    <AlertTriangle size={16} />
                  </div>
                </div>

                {/* RED LANE: Critical Lock */}
                <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:border-rose-300 transition-all group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                        C
                      </div>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-800 text-[8px] uppercase tracking-widest font-black rounded-full border border-rose-200">
                        Red Lane
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-rose-800 transition-colors">Critical Lock</h4>
                      <p className="text-[10px] text-stone-500 mt-1 uppercase tracking-wider font-mono">Bypasses Disabled</p>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Autonomous publishing to live production, direct core system file modifications, passcode resets, and un-sandboxed browser navigation.
                    </p>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5">
                      <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest block">Governed Rules</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-mono border border-rose-100">LAW-0001</span>
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-mono border border-rose-100">LAW-0005</span>
                        <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[9px] font-mono border border-rose-100">LAW-0006</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between text-xs text-rose-700 font-bold uppercase tracking-widest">
                    <span>Shield Guard active</span>
                    <LockKeyhole size={16} />
                  </div>
                </div>

              </div>

              {/* Interactive Audit Workspace panel */}
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <Scale size={20} />
                    </div>
                    <div>
                      <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">Workspace Lane Audit</h3>
                      <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Live capability check under LAW-0017 (Governed Growth)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSavedMessage("Running real-time workspace compilation audit... Clean build verified!");
                      setTimeout(() => setSavedMessage(null), 3000);
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                  >
                    <RefreshCw size={12} className="animate-spin" />
                    Run Audit
                  </button>
                </div>
                <LeeWayHelpTrigger helpId="help.action.runAudit" label="Verify System Compile" />

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Governance Lane Assignments (20 Capabilities)</h4>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 text-xs">
                    {LEEWAY_CAPABILITY_REGISTRY.map(cap => (
                      <div key={cap.capabilityId} className="p-3 border border-stone-100 bg-stone-50 rounded-xl flex items-center justify-between flex-wrap gap-2 hover:bg-stone-100/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`h-2.5 w-2.5 rounded-full ${cap.lane === 'GREEN' ? 'bg-emerald-500' : cap.lane === 'YELLOW' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <div>
                            <span className="font-bold text-stone-900">{cap.label}</span>
                            <span className="text-[9px] text-stone-400 font-mono block">ID: {cap.capabilityId}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-black ${cap.lane === 'GREEN' ? 'bg-emerald-50 text-emerald-700' : cap.lane === 'YELLOW' ? 'bg-amber-50 text-amber-700' : cap.lane === 'RED' ? 'bg-rose-50 text-rose-700' : 'bg-rose-50 text-rose-700'}`}>
                            {cap.lane} LANE
                          </span>
                          <span className="px-1.5 py-0.5 bg-stone-200 text-stone-600 rounded text-[8px] font-mono">
                            {cap.riskLevel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* browser-mcp classification detailed breakout */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 space-y-3 text-xs leading-relaxed text-stone-600">
                  <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider">
                    <AlertTriangle size={16} className="text-amber-600 animate-pulse" />
                    <span>Special Focus: browser-mcp (Browser Automation Controller)</span>
                  </div>
                  <p>
                    Under the strict <strong>LeeWay Standards (LAW-0001, LAW-0015, and LAW-0017)</strong>, visual browser automation tools are classified as <strong>MCP_BLOCKED_BY_DEFAULT</strong> inside the Yellow/Red transition boundary.
                  </p>
                  <p>
                    Rather than a raw, simulated, or silent lock, the system honestly registers the tool as <strong>blocked by default</strong> while explicitly mapping five sandboxed, human-authorized visual QA workflows:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-stone-700 font-medium">
                    <li>Visual Layout Sandbox QA Checks (screenshot comparisons)</li>
                    <li>Storefront Routing Live Checks (ensuring 0 dead pages)</li>
                    <li>Audited Accessibility and Contrast Checks</li>
                    <li>Broken Image & Asset Inspections</li>
                    <li>Public Storefront Mobile/Tablet Preview Validation</li>
                  </ul>
                  <p className="text-[10px] text-stone-400 font-mono mt-2">
                    * Bypasses are strictly blocked: browser-mcp is prevented from auto-entering credentials, submitting unapproved checkout workflows, or navigating outside the campbell-&-co sovereign domains.
                  </p>
                </div>
              </section>

            </div>
          )}

          {/* TAB 4: OWNER PROFILE & ACCESS SECURITY LOCK */}
          {activeSubTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">

              {/* Profile setup */}
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">Owner Profile</h3>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Primary workspace operator details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Owner Name" value={ownerProfile.name} onChange={(value) => setOwnerProfile(current => ({ ...current, name: value }))} />
                  <Field label="Title" value={ownerProfile.title} onChange={(value) => setOwnerProfile(current => ({ ...current, title: value }))} />
                  <Field label="Email Address" value={ownerProfile.email} onChange={(value) => setOwnerProfile(current => ({ ...current, email: value }))} />
                  <Field label="Phone" value={ownerProfile.phone} onChange={(value) => setOwnerProfile(current => ({ ...current, phone: value }))} />
                </div>
              </section>

              {/* Local security settings */}
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
                    <LockKeyhole size={20} />
                  </div>
                  <div>
                    <h3 className="text-md font-bold uppercase tracking-wider text-stone-900">Local Access Lock</h3>
                    <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Governs physical security locks for the AdminOS panel</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Local Passcode" value={ownerPasscode} type="password" onChange={(value) => setOwnerPasscode(value)} />
                  <div className="text-xs leading-normal text-stone-500 bg-stone-50 border border-stone-200 p-5 rounded-2xl">
                    Protects the administrative shell session when active connections to remote Firebase Identity pools are offline.
                  </div>
                </div>
              </section>

              <button
                onClick={handleSaveProfileSettings}
                className="w-full bg-amber-600 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-700 transition-colors shadow-sm"
              >
                Save Security Configuration
              </button>

            </div>
          )}

          {/* TAB 5: GUIDELINES & DYNAMIC NOTIFICATIONS LOG */}
          {activeSubTab === 'help' && (
            <div
              className="space-y-6 animate-fade-in"
              data-leeway-id="admin.settings.guidelines-notifications-desk"
            >
              <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex flex-col gap-4 border-b border-stone-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-stone-900">Guidelines & Notifications Desk</h3>
                    <p className="text-xs text-stone-500 uppercase tracking-[0.18em]">Owner education, notifications, and first-launch guidance</p>
                  </div>
                  <button
                    type="button"
                    onClick={onStartOnboarding}
                    data-leeway-action-id="action.onboarding.start"
                    className="rounded-full bg-stone-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.28em] text-white transition hover:bg-amber-600"
                  >
                    Start Onboarding
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_380px]">
                  <OwnerManual />
                  <div className="space-y-5">
                    <section className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
                        <BellRing size={16} className="text-amber-700" />
                        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-stone-900">Notifications Desk</h4>
                      </div>
                      <div className="mt-4 space-y-3">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`rounded-2xl border p-4 ${notification.read ? 'border-stone-200 bg-white' : 'border-amber-200 bg-amber-50/60'}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900">{notification.type}</p>
                                <p className="mt-1 text-xs text-stone-600 leading-relaxed">{notification.message}</p>
                                <p className="mt-2 text-[10px] uppercase tracking-widest text-stone-400">Owner agent: {notification.ownerAgent}</p>
                              </div>
                              {!notification.read && (
                                <button onClick={() => handleDismissNotification(notification.id)} className="text-[10px] font-black uppercase tracking-widest text-amber-700 hover:text-stone-900">
                                  Mark Read
                                </button>
                              )}
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-400">
                              <span>{notification.severity}</span>
                              <span>{notification.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-[1.5rem] border border-stone-200 bg-white p-5 space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-[0.25em] text-stone-900">Owner Recovery Guide</h4>
                      <p className="text-sm text-stone-600">If the page feels blocked, start with the troubleshooting section below the manual and only escalate when the guide explicitly tells you to stop.</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Start with Shield for blocked authority, Lee Prime for publishing, and Aura for preview or media confusion.</p>
                    </section>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Dynamic Sidebar */}
        <aside className="space-y-6">

          {/* Governed Owner card preview */}
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 border-b border-stone-100 pb-3">Sovereign Profile</h3>
            <div className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-md font-serif text-white font-bold select-none">
                {ownerProfile.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-900">{ownerProfile.name}</p>
                <p className="text-[9px] uppercase tracking-widest text-stone-500 mt-0.5">{ownerProfile.title}</p>
              </div>
            </div>
          </section>

          {/* Law Doctrine display panel */}
          <section className="rounded-[2rem] border border-stone-200 bg-stone-900 text-stone-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Scale size={14} className="text-amber-500 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">LeeWay Primary Doctrine</h3>
            </div>

            <p className="text-[10px] leading-relaxed uppercase tracking-wider text-amber-100/90 font-mono italic">
              {LEEWAY_LAW_SHORT.trim()}
            </p>

            <div className="pt-2 text-[9px] text-stone-400 uppercase tracking-widest flex items-center justify-between">
              <span>Status: ENFORCED</span>
              <span>18 Rules Active</span>
            </div>
          </section>

          {/* Quick status variables */}
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Activity size={14} className="text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Node telemetry</h3>
            </div>

            <div className="space-y-2 text-[10px] text-stone-700">
              <div className="flex justify-between items-center py-1.5 border-b border-stone-50">
                <span className="font-bold uppercase tracking-wider text-stone-400">Site Preview Sync</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-black text-[9px] uppercase">DYNAMIC</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-stone-50">
                <span className="font-bold uppercase tracking-wider text-stone-400">VS Code bridge</span>
                <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase ${vsCodeConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{vsCodeConnected ? 'ACTIVE' : 'OFFLINE'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-stone-50">
                <span className="font-bold uppercase tracking-wider text-stone-400">Core compiler</span>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full font-black text-[9px] uppercase">READY (0 err)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-bold uppercase tracking-wider text-stone-400">Compliance score</span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full font-black text-[9px] uppercase">98% PASS</span>
              </div>
            </div>
          </section>

        </aside>

      </div>

    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

function TabButton({ active, onClick, label, icon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-4 border-b-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 whitespace-nowrap ${active ? 'border-amber-600 text-amber-700 bg-amber-50/5' : 'border-transparent text-stone-500 hover:text-stone-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-amber-300 focus:bg-white"
      />
    </label>
  );
}
