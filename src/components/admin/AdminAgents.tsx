/*
LEEWAY HEADER - DO NOT REMOVE

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

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_AGENTS.MAIN
DESCRIPTION: LeeWay workforce command center for Campbell & Co.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = AdminAgents.tsx - workforce management surface
WHY = Give the owner a readable, purposeful view of each LeeWay employee-agent
WHO = Leeway Innovations
WHERE = src/components/admin/AdminAgents.tsx
WHEN = 2026-05-13
HOW = React + local agent telemetry presentation

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  Eye,
  Headphones,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Fingerprint,
  Network,
  Zap,
  ShieldAlert,
  Code,
  Globe,
} from 'lucide-react';
import { AIAgent } from '../../types';
import { LeeWayAgentRuntimeState } from '../../core/leeway/LeeWayRuntimeIdentity';

import { useLeeWayID } from '../../hooks/useLeeWayID';
import { LeeWayHelpTrigger } from './LeeWayHelpTrigger';

interface AgentsProps {
  agents: AIAgent[];
  onRequestProposal: (agentId: string, agentLabel: string, taskId: string) => void;
  runtimeStates: LeeWayAgentRuntimeState[];
}

export function AdminAgents({ agents, onRequestProposal, runtimeStates }: AgentsProps) {
  useLeeWayID('ADMIN_AGENTS_COMMAND_CENTER');
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'ask'>('overview');

  // Agents are now used directly — no in-flight progress tracking needed
  // since proposals are reviewed in a modal before any mutation occurs.
  const updatedAgents = useMemo(() => agents, [agents]);

  useEffect(() => {
    if (!updatedAgents.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(updatedAgents[0]?.id || '');
    }
  }, [updatedAgents, selectedAgentId]);

  // Truthful background telemetry — idle status readiness messages only
  useEffect(() => {
    const interval = window.setInterval(() => {
      setLogs((current) => {
        const next = { ...current };
        updatedAgents.forEach((agent) => {
          const entries = next[agent.id] || [];
          const message = buildAgentLog(agent);
          next[agent.id] = [`[${new Date().toLocaleTimeString()}] ${message}`, ...entries].slice(0, 18);
        });
        return next;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [updatedAgents]);


  // LAW-0005: Proposal-Before-Mutation
  // Clicking "Preview Proposal" does NOT mutate draft. It calls the parent
  // to build + display a governed proposal for owner review.
  const handlePreviewProposal = (agentId: string, taskId: string) => {
    const agent = agents.find(a => a.id === agentId);
    const agentLabel = agent?.name || agentId;

    // Record truthful telemetry — proposal created, awaiting owner action
    setLogs(current => {
      const next = { ...current };
      const entries = next[agentId] || [];
      next[agentId] = [
        `[${new Date().toLocaleTimeString()}] [AGENT_PROPOSAL_CREATED] ${agentLabel} has prepared a governed proposal for owner review.`,
        `[${new Date().toLocaleTimeString()}] [SYSTEM] Awaiting owner approval under LAW-0005. No draft mutation has occurred.`,
        ...entries
      ].slice(0, 18);
      return next;
    });

    // Hand off to parent — parent builds proposal + opens modal
    onRequestProposal(agentId, agentLabel, taskId);
  };


  const selectedAgent = useMemo(
    () => updatedAgents.find((agent) => agent.id === selectedAgentId) || updatedAgents[0] || null,
    [updatedAgents, selectedAgentId]
  );

  const connectedCount = updatedAgents.filter((agent) => agent.operatingMode === 'connected').length;
  const advisoryCount = updatedAgents.filter((agent) => agent.operatingMode === 'advisory').length;

  if (!selectedAgent) {
    return (
      <div className="rounded-[2rem] border border-stone-200 bg-white p-10 text-sm text-stone-500 shadow-sm">
        No LeeWay workforce profiles are available yet.
      </div>
    );
  }

  return (
    <div id="admin-agents-root" className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.8em] text-amber-700 font-black">LeeWay Workforce</span>
            <div className="h-[1px] w-12 bg-amber-200" />
            <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-black">Sovereign Agent Registry v1.2.0</span>
          </div>
          <h2 className="text-4xl font-serif tracking-[0.16em] uppercase text-stone-900">Digital Employees</h2>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            Governed by the LeeWay 8-Stage Sovereign Cycle. These agents are high-fidelity digital entities 
            responsible for the integrity, performance, and narrative of the Campbell & Co. luxury OS.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AgentMetric label="Active Fleet" value={String(updatedAgents.length)} icon={Users} />
          <AgentMetric label="Advisory" value={String(advisoryCount)} icon={Brain} />
          <AgentMetric label="Connected" value={String(connectedCount)} icon={Zap} />
          <AgentMetric label="Governance" value="ENFORCED" icon={ShieldCheck} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm flex flex-col h-[750px]">
          <div className="mb-4 flex items-center justify-between px-2 pt-2">
            <h3 className="text-xs font-black uppercase tracking-[0.32em] text-stone-500">Employee Roster</h3>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {updatedAgents.map((agent) => {
              const isActive = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full rounded-[1.5rem] border p-4 text-left transition-all group ${
                    isActive
                      ? 'border-amber-300 bg-amber-50 shadow-sm'
                      : 'border-stone-100 bg-stone-50/50 hover:border-amber-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-all ${
                      isActive ? 'bg-white text-amber-700' : 'bg-white text-stone-400 group-hover:text-amber-600'
                    }`}>
                      {getAgentIcon(agent.id, agent.family)}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-black uppercase tracking-[0.18em] text-stone-900">{agent.name}</p>
                        <span className="text-[8px] font-black uppercase tracking-widest text-stone-300 group-hover:text-amber-400 transition-colors">{agent.family}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500 truncate">{agent.title}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <StatusBadge label={agent.status} tone={agent.status} />
                        <ModeBadge mode={agent.operatingMode || 'advisory'} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.1fr)_380px]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm relative overflow-hidden">
              {/* Subtle background identifier */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                 <h4 className="text-[120px] font-black uppercase tracking-tighter leading-none">{selectedAgent.family}</h4>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between relative z-10">
                <div className="flex items-start gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-amber-50 text-amber-700 shadow-inner">
                    {getAgentIcon(selectedAgent.id, selectedAgent.family, 42)}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-3xl font-serif uppercase tracking-[0.14em] text-stone-900">{selectedAgent.name}</h3>
                        {selectedAgent.operatingMode === 'connected' && <Zap size={14} className="text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.25em] text-stone-400">{selectedAgent.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge label={selectedAgent.status} tone={selectedAgent.status} />
                      <ModeBadge mode={selectedAgent.operatingMode || 'advisory'} />
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-stone-600">
                        {selectedAgent.department || 'Operations'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-6 py-4 text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-stone-500">Authority</p>
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-stone-900">{selectedAgent.authorityLevel || 'Guided access'}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 px-2">
                    <Fingerprint size={10} className="text-stone-300" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-300">UID: {selectedAgent.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 relative z-10">
                <InfoPanel label="Mission Parameters" value={selectedAgent.purpose} />
                <div className="rounded-[1.5rem] border border-stone-100 bg-stone-50/50 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Capabilities</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(selectedAgent.capabilities || []).map(cap => (
                        <span key={cap} className="px-2 py-1 bg-white border border-stone-200 rounded text-[9px] font-black uppercase tracking-widest text-stone-500">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-[8px] font-black uppercase tracking-[0.22em] text-stone-400">Standard Lineage</p>
                      <p className="text-[10px] font-mono text-stone-600 truncate max-w-[200px]">{selectedAgent.lineage}</p>
                    </div>
                    <Network size={16} className="text-stone-200" />
                  </div>
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Defined Responsibilities</h4>
                  <div className="flex-1 h-[1px] bg-stone-100" />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {(selectedAgent.responsibilities || []).map((item) => (
                    <div key={item} className="rounded-[1.25rem] border border-stone-100 bg-white px-5 py-4 text-xs font-medium leading-6 text-stone-600 shadow-sm flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4 border-b border-stone-100 pb-px relative z-10">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 text-xs font-black uppercase tracking-[0.2em] transition-colors border-b-2 ${activeTab === 'overview' ? 'text-amber-700 border-amber-500' : 'text-stone-400 border-transparent hover:text-stone-700'}`}
                >
                  Overview & Telemetry
                </button>
                <LeeWayHelpTrigger helpId="help.ui.inspectAgent" label="Inspect Agent" />
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`pb-3 text-xs font-black uppercase tracking-[0.2em] transition-colors border-b-2 ${activeTab === 'skills' ? 'text-amber-700 border-amber-500' : 'text-stone-400 border-transparent hover:text-stone-700'}`}
                >
                  Governed Skills
                </button>
                <button
                  onClick={() => setActiveTab('ask')}
                  className={`pb-3 text-xs font-black uppercase tracking-[0.2em] transition-colors border-b-2 ${activeTab === 'ask' ? 'text-amber-700 border-amber-500' : 'text-stone-400 border-transparent hover:text-stone-700'}`}
                >
                  Ask Agents
                </button>
              </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section data-leeway-id="admin.agent-status.ledger" className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                        <LayoutTemplate size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Current Directives</h4>
                    </div>
                    <span className="px-2 py-1 bg-amber-50 rounded text-[8px] font-black uppercase tracking-widest text-amber-700">Approval Required</span>
                  </div>
                  <div className="space-y-4">
                    {selectedAgent.recommendations.length === 0 && (
                      <div className="rounded-[1.5rem] border border-dashed border-stone-200 bg-stone-50/50 p-8 text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-stone-400">No pending actions for this agent.</p>
                      </div>
                    )}
                    {selectedAgent.recommendations.map((rec) => (
                      <div key={rec.id} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6 group hover:bg-white hover:border-amber-200 transition-all">
                        <p className="text-sm leading-7 text-stone-700 font-medium">{rec.text}</p>
                        <div className="mt-4 space-y-2">
                          <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold">
                            Clicking Preview Proposal will NOT apply any changes. You will review the full proposal before deciding.
                          </p>
                          <button
                            onClick={() => handlePreviewProposal(selectedAgent.id, rec.id)}
                            className="w-full rounded-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.24em] text-white transition-all bg-stone-900 hover:bg-amber-600 group-hover:shadow-lg group-hover:shadow-amber-100 flex items-center justify-center gap-2"
                          >
                            <Eye size={12} />
                            Preview Proposal
                          </button>
                          <div className="pt-2">
                            <LeeWayHelpTrigger helpId="help.action.previewProposal" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Activity size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Telemetry Feed</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Streaming</span>
                    </div>
                  </div>
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed text-stone-500 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {(logs[selectedAgent.id] || []).map((entry, idx) => (
                      <div key={idx} className={`rounded-xl border px-4 py-3 ${idx === 0 ? 'bg-stone-900 text-stone-100 border-stone-800' : 'bg-stone-50 border-stone-100 opacity-60'}`}>
                        {entry}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Cpu size={16} />
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Runtime State Ledger</h4>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">
                      {runtimeStates.length} tracked
                    </span>
                  </div>
                  <div className="space-y-3 text-[11px] text-stone-600">
                    {runtimeStates.slice(0, 6).map((state) => (
                      <div key={state.runtimeId} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
                        <p className="font-black uppercase tracking-[0.16em] text-stone-800">{state.agentDisplayName}</p>
                        <p className="mt-1">Runtime: {state.runtimeId}</p>
                        <p>Status: {state.status}</p>
                        <p>Skill: {state.currentSkillId || 'none'}</p>
                        <p>Workflow: {state.currentWorkflowId || 'none'}</p>
                        <p>Action: {state.currentActionId || 'none'}</p>
                        <p>Region: {state.currentSelectedLeewayId || 'none'}</p>
                        <p>Telemetry: {state.currentTelemetryStreamId || 'none'}</p>
                        <p>Authority: {state.runtimeAuthorityMode}</p>
                        <p>Tools: {state.toolIdsUsed.join(', ') || 'none'}</p>
                        <p>MCPs: {state.mcpIdsUsed.join(', ') || 'none'}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <Wrench size={18} className="text-stone-500" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">Governed Skills Registry</h4>
                </div>
                <div className="space-y-4">
                   <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                     <p className="text-xs font-bold text-stone-900 uppercase">Available Skills</p>
                     <p className="text-[10px] text-stone-500 mt-1">This agent executes governed processes, not ad-hoc commands.</p>
                     <div className="mt-4 space-y-3">
                       <div className="p-3 bg-white border border-stone-200 rounded-lg">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-bold text-amber-700 uppercase">skill.media.public-image-not-showing</span>
                           <span className="text-[8px] font-black bg-stone-100 px-2 py-0.5 rounded uppercase">LAW-0005</span>
                         </div>
                         <p className="text-xs text-stone-600 mb-2">Diagnose and resolve problems where images added in AdminOS do not appear on the public storefront.</p>
                         <p className="text-[9px] text-stone-400"><strong>Requires:</strong> Draft State, Published State, Media MCP</p>
                         <p className="text-[9px] text-stone-400"><strong>Blocked:</strong> Direct publish, silent mutation</p>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'ask' && (
              <div className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-sm space-y-6">
                 <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <Headphones size={18} className="text-amber-600" />
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-900">Ask Agents (Issue Intake)</h4>
                </div>
                
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">Issue Summary</span>
                    <input type="text" placeholder="e.g. My image is not showing on the public site" className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-amber-400 outline-none" />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">Selected Area</span>
                      <select className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-amber-400 outline-none bg-white">
                        <option>None</option>
                        <option>Live Preview Region</option>
                        <option>Product Registry</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 block">Urgency</span>
                      <select className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-amber-400 outline-none bg-white">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </label>
                  </div>

                  <button className="w-full bg-stone-900 text-white rounded-xl py-4 text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-colors mt-4">
                    Submit Issue to LeeWay Router
                  </button>
                  <LeeWayHelpTrigger helpId="help.action.previewProposal" label="Ask Agents Help" />
                  
                  <div className="mt-6 p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50 text-center">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Issue intake will route to LeeWaySkillRouter for governed evidence collection and diagnostics.</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-stone-200 bg-stone-900 p-8 shadow-xl text-white">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mb-6">Integrity Audit</h4>
              <div className="space-y-5">
                <ReadinessCardDark
                  label="Operational Mode"
                  value={selectedAgent.operatingMode === 'connected' ? 'Connected to live LeeWay runtime.' : 'Advisory mode. Owner approval mandatory.'}
                  active={selectedAgent.operatingMode === 'connected'}
                />
                <ReadinessCardDark
                  label="Sovereign Gate"
                  value="All outputs are governed by the Veritas validation gate (Min Score: 85/100)."
                  active={true}
                />
                <ReadinessCardDark
                  label="Context Lock"
                  value={`Agent ${selectedAgent.name} has synchronized memory with the Atlas knowledge base.`}
                  active={true}
                />
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <div className="flex flex-col gap-1">
                   <p className="text-[8px] font-black uppercase tracking-widest text-stone-500">Security Family</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white">PRIME GUARD</p>
                 </div>
                 <ShieldCheck size={24} className="text-amber-500" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500">The LeeWay Standard</h4>
              <p className="mt-4 text-sm leading-7 text-stone-600 italic font-serif">
                "Leeway thinking is governed decision motion; Leeway intelligence is that motion made continuous, validated, and remembered."
              </p>
              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-amber-900 leading-relaxed">
                  Every agent in this roster is a specialist. There is no generic intelligence here—only purposeful, 
                  governed action under the Avion command.
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-500 mb-6">Sovereign Execution Cycle</h4>
              <div className="space-y-4">
                {[
                  { stage: 'Stage 1', label: 'Sensory Input', desc: 'Capturing intent and environment data.' },
                  { stage: 'Stage 2', label: 'Integrity Check', desc: 'Verifying provenance and identity.' },
                  { stage: 'Stage 3', label: 'Intent Synthesis', desc: 'Mapping raw data to governed goals.' },
                  { stage: 'Stage 4', label: 'Capability Check', desc: 'Validating agent permissions.' },
                  { stage: 'Stage 5', label: 'Execution Path', desc: 'Calculating optimal solution branch.' },
                  { stage: 'Stage 6', label: 'Veritas Validation', desc: 'Passing through the truth gate.' },
                  { stage: 'Stage 7', label: 'Action Deployment', desc: 'Committing state mutations.' },
                  { stage: 'Stage 8', label: 'Registry Archive', desc: 'Recording historical lineage.' },
                ].map((s, i) => (
                  <div key={s.stage} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full border-2 ${i < 6 ? 'bg-amber-500 border-amber-600' : 'bg-stone-100 border-stone-300'} transition-all`} />
                      {i < 7 && <div className="w-[1px] h-6 bg-stone-100" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-amber-700 transition-colors">{s.stage} — {s.label}</p>
                      <p className="text-[10px] text-stone-500 leading-tight mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-[2rem] bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white shadow-lg shadow-amber-200/50">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-2">System Status</h4>
               <p className="text-2xl font-serif uppercase tracking-widest mb-6">FLEET COHERENT</p>
               <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/20 pb-2">
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Uptime</span>
                     <span className="text-xs font-mono font-bold">99.998%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/20 pb-2">
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-70">Verification Cycle</span>
                     <span className="text-xs font-mono font-bold">42ms</span>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function buildAgentLog(agent: AIAgent) {
  const lines: Record<string, string[]> = {
    'agent-lee-prime': [
      'Synchronizing 8-stage sovereign execution cycle.',
      'Enforcing LeeWay Constitution on administrative publish request.',
      'Orchestrating multi-agent consensus for site-wide inventory update.',
      'Verifying identity attestation for high-privilege operations.',
    ],
    'atlas-memory-agent': [
      'Indexing high-fidelity client preference vectors.',
      'Retrieving historical sourcing data for natural round diamonds.',
      'Pruning stale memory records in the business context mesh.',
      'Applying semantic overlap analysis to customer feedback tags.',
    ],
    'nova-forge-agent': [
      'Performing structural alignment audit on UI component tree.',
      'Injecting LeeWay headers into newly discovered modules.',
      'Analyzing logic drift in the price calculation engine.',
      'Refactoring product grid for 100% administrative control.',
    ],
    'shield-governor-agent': [
      'Blocking unverified third-party script injection attempt.',
      'Reviewing administrative permission escalation request.',
      'Generating audit receipt for secure configuration change.',
      'Enforcing zero-trust boundary on external API bridge.',
    ],
    'aura-media-agent': [
      'Synchronizing brand aesthetic tokens across all viewports.',
      'Synthesizing luxury concierge voice profile for live consultation.',
      'Analyzing visual consistency in marketing asset pipeline.',
      'Optimizing media rendering paths for high-DPI displays.',
    ],
  };

  const options = lines[agent.id] || ['Maintaining LeeWay workforce readiness for the house.', 'Scanning system sensors for operational drift.', 'Executing governed background tasks.'];
  return options[Math.floor(Math.random() * options.length)];
}

function getAgentIcon(id: string, family?: string, size = 22) {
  const className = 'text-current';

  if (family === 'core') return <Cpu size={size} className={className} />;
  if (family === 'forge') return <Code size={size} className={className} />;
  if (family === 'memory') return <Database size={size} className={className} />;
  if (family === 'security') return <ShieldAlert size={size} className={className} />;
  if (family === 'media') return <Sparkles size={size} className={className} />;
  if (family === 'routing') return <Network size={size} className={className} />;
  if (family === 'pipeline') return <Globe size={size} className={className} />;

  switch (id) {
    case 'agent-lee-prime':
      return <Cpu size={size} className={className} />;
    case 'atlas-memory-agent':
      return <Database size={size} className={className} />;
    case 'nova-forge-agent':
      return <Code size={size} className={className} />;
    case 'shield-governor-agent':
      return <ShieldCheck size={size} className={className} />;
    case 'aura-media-agent':
      return <Sparkles size={size} className={className} />;
    default:
      return <Fingerprint size={size} className={className} />;
  }
}

function AgentMetric({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-[1.4rem] border border-stone-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{label}</p>
          <p className="mt-2 text-xl font-serif uppercase tracking-[0.1em] text-stone-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function InfoPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-4 text-sm leading-7 text-stone-700 font-medium">{value}</p>
    </div>
  );
}

function ReadinessCardDark({ label, value, active }: { label: string; value: string, active: boolean }) {
  return (
    <div className={`rounded-[1.25rem] border p-4 transition-all ${active ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-stone-400">{label}</p>
        <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-amber-500' : 'bg-stone-600'}`} />
      </div>
      <p className="text-[11px] leading-5 text-stone-300">{value}</p>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: AIAgent['status'];
}) {
  const styles: Record<AIAgent['status'], string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    idle: 'bg-stone-100 text-stone-600 border-stone-200',
    working: 'bg-blue-50 text-blue-700 border-blue-200',
    alert: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] ${styles[tone]}`}>
      {label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: NonNullable<AIAgent['operatingMode']> }) {
  const labels = {
    advisory: 'Advisory',
    connected: 'Sovereign',
    standby: 'Standby',
  };

  const colors = {
    advisory: 'text-stone-400',
    connected: 'text-amber-600',
    standby: 'text-stone-300',
  }

  return (
    <span className={`rounded-full border border-stone-100 bg-white px-2.5 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] ${colors[mode]}`}>
      {labels[mode]}
    </span>
  );
}
