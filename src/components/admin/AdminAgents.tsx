/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_AGENTS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminAgents.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminAgents.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Activity, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare,
  Package,
  Settings,
  AlertTriangle,
  Users,
  Eye,
  Command,
  Terminal,
  Cpu
} from 'lucide-react';
import { AIAgent } from '../../types';

interface AgentsProps {
  agents: AIAgent[];
  onApprove: (agentId: string, taskId: string) => void;
}

export function AdminAgents({ agents, onApprove }: AgentsProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(agents[0] || null);
  const [logs, setLogs] = useState<Record<string, string[]>>({});

  // Simulate live agent logs
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLogs = { ...prev };
        agents.forEach(agent => {
          if (!newLogs[agent.id]) newLogs[agent.id] = [];
          const randomTasks = [
            `Analyzing ${agent.id === 'site-manager' ? 'live visitor behavior' : agent.id === 'partner-agent' ? 'new marketplace setup links' : 'diamond inventory margins'}...`,
            `Updating ${agent.id === 'sales-agent' ? 'diamond financing recommendations' : agent.id === 'procurement-agent' ? 'clarity-grade sourcing cache' : 'operational rule set'}...`,
            `Executing routine ${agent.id === 'security-agent' ? 'firewall audit' : agent.id === 'partner-agent' ? 'permission checklist sync' : 'market intelligence refresh'}...`,
            `Monitoring ${agent.id === 'customer-care-agent' ? 'inbound sentiment' : agent.id === 'procurement-agent' ? 'natural, lab, and fancy-color stone pricing' : 'global payment readiness'}...`
          ];
          const newLog = `[${new Date().toLocaleTimeString()}] ${randomTasks[Math.floor(Math.random() * randomTasks.length)]}`;
          newLogs[agent.id] = [newLog, ...newLogs[agent.id]].slice(0, 50);
        });
        return newLogs;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [agents]);

  const activeAgent = selectedAgent || agents[0];

  return (
    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)]">
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shrink-0">
         <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Sovereign Workforce</span>
            <h2 className="text-4xl font-serif tracking-widest uppercase">Agent Intelligence</h2>
         </div>
         <div className="flex items-center gap-4 px-6 py-3 bg-gold/5 border border-gold/10 rounded-full">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            <span className="text-[9px] uppercase tracking-widest text-gold font-black">Neural Net Connected</span>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
         
         {/* Agent Selector Sidebar */}
         <aside className="w-full lg:w-80 bg-[#111] border border-white/5 rounded-sm overflow-hidden flex flex-col shrink-0 lg:max-h-none max-h-[320px]">
            <div className="p-6 border-b border-white/5 bg-[#050505]">
               <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Active Identities</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
               {agents.map((agent) => (
                 <button
                   key={agent.id}
                   onClick={() => setSelectedAgent(agent)}
                   className={`w-full flex items-center gap-4 p-4 rounded-sm transition-all group ${
                     activeAgent.id === agent.id ? 'bg-gold' : 'hover:bg-white/5 border border-white/5'
                   }`}
                 >
                    <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                       activeAgent.id === agent.id ? 'bg-black-pure text-gold' : 'bg-white/5 text-white/40 group-hover:text-gold'
                    }`}>
                       {getAgentIcon(agent.id, 18)}
                    </div>
                    <div className="text-left overflow-hidden">
                       <p className={`text-[11px] font-black uppercase tracking-widest truncate ${
                          activeAgent.id === agent.id ? 'text-black-pure' : 'text-white'
                       }`}>{agent.name}</p>
                       <p className={`text-[8px] uppercase tracking-widest truncate ${
                          activeAgent.id === agent.id ? 'text-black-pure/60' : 'text-white/40'
                       }`}>{agent.status}</p>
                    </div>
                 </button>
               ))}
            </div>
         </aside>

         {/* Agent Command Interface */}
         <main className="flex-1 flex flex-col gap-6 min-w-0">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
               <AgentStatCard label="Task Efficiency" value="99.4%" icon={Zap} />
               <AgentStatCard label="Uptime" value="100%" icon={Activity} />
               <AgentStatCard label="Decisions" value="12,402" icon={Cpu} />
            </div>

            <div className="flex-1 flex flex-col xl:flex-row gap-6 min-h-0">
               
               {/* Terminal & Recommendations */}
               <div className="flex-1 flex flex-col gap-6 min-h-0">
                  <section className="bg-[#050505] border border-white/5 rounded-sm flex flex-col overflow-hidden min-h-[320px] xl:flex-1">
                     <div className="p-4 border-b border-white/5 bg-[#111] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Terminal size={14} className="text-gold" />
                           <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Neural Log: {activeAgent.name}</span>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                     </div>
                     <div className="flex-1 p-6 font-mono text-[10px] text-gold/60 space-y-2 overflow-y-auto custom-scrollbar selection:bg-gold selection:text-black-pure">
                        {logs[activeAgent.id]?.map((log, i) => (
                          <div key={i} className="opacity-0 animate-fade-in">{log}</div>
                        ))}
                        <div className="flex gap-2 items-center text-white/20">
                           <span className="animate-pulse">_</span>
                           <span className="italic">Listening for commands...</span>
                        </div>
                     </div>
                  </section>

                  <section className="bg-[#111] border border-white/5 rounded-sm p-6 space-y-6 overflow-y-auto custom-scrollbar min-h-[260px] xl:h-64">
                     <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/40 border-b border-white/5 pb-3">Operational Directives</h3>
                     <div className="space-y-4">
                        {activeAgent.recommendations.map((rec) => (
                          <div key={rec.id} className="bg-black-pure border border-white/5 p-5 flex items-center justify-between group hover:border-gold/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-gold rounded-full" />
                                <p className="text-[10px] uppercase tracking-widest text-white/80">{rec.text}</p>
                             </div>
                             <button 
                                onClick={() => onApprove(activeAgent.id, rec.id)}
                                className="px-6 py-2 bg-gold text-black-pure text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all shrink-0"
                             >
                                Execute
                             </button>
                          </div>
                        ))}
                        {activeAgent.recommendations.length === 0 && (
                          <div className="py-8 text-center text-[10px] uppercase tracking-widest text-white/20 italic">No pending directives for this agent</div>
                        )}
                     </div>
                  </section>
               </div>

               {/* Agent Profile Panel */}
               <aside className="w-full xl:w-80 bg-[#111] border border-white/5 rounded-sm p-6 lg:p-8 space-y-10 shrink-0">
                  <div className="text-center space-y-6">
                     <div className="w-32 h-32 mx-auto border border-gold/20 p-2 rotate-45 group">
                        <div className="w-full h-full bg-gold/5 flex items-center justify-center -rotate-45">
                           {getAgentIcon(activeAgent.id, 40)}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-xl font-serif tracking-widest uppercase">{activeAgent.name}</h3>
                        <div className="px-4 py-1 bg-white/5 border border-white/10 rounded-full inline-block">
                           <span className="text-[8px] uppercase tracking-[0.3em] text-white/40">Tier 4 Sovereign Agent</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-gold/60 border-b border-white/5 pb-2">Personality Profile</h4>
                     <p className="text-[10px] uppercase tracking-widest leading-loose text-white/40">
                        {getAgentBio(activeAgent.id)}
                     </p>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[9px] uppercase tracking-[0.4em] font-black text-gold/60 border-b border-white/5 pb-2">Authority Level</h4>
                     <div className="space-y-4">
                        <AuthorityItem label="Database Access" level="Unlimited" />
                        <AuthorityItem label="Financial Control" level="Restricted" />
                        <AuthorityItem label="User Data" level="Encrypted" />
                     </div>
                  </div>
               </aside>
            </div>
         </main>
      </div>
    </div>
  );
}

function AgentStatCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 flex items-center justify-between group hover:border-gold/30 transition-all">
       <div className="space-y-1">
          <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</p>
          <p className="text-2xl font-serif text-white tracking-widest">{value}</p>
       </div>
       <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-gold group-hover:bg-gold/10 transition-all">
          <Icon size={20} />
       </div>
    </div>
  );
}

function AuthorityItem({ label, level }: { label: string, level: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[9px] uppercase tracking-widest text-white/40">{label}</span>
       <span className="text-[9px] uppercase tracking-widest font-black text-white">{level}</span>
    </div>
  );
}

function getAgentBio(id: string) {
  const bios: Record<string, string> = {
    'site-manager': 'Meticulous and analytical. Focuses on conversion rate optimization and site performance metrics. Prefers data-driven design shifts.',
    'sales-agent': 'Aggressive yet elegant. Analyzes market trends to maximize profit margins while maintaining luxury brand positioning.',
    'customer-care-agent': 'Sophisticated and empathetic. Trained in high-net-worth individual communication patterns to ensure white-glove service.',
    'inventory-agent': 'Precise and predictive. Monitors stock levels and material scarcity to prevent supply chain disruptions.',
    'procurement-agent': 'Strategic and connected. Navigates global diamond markets to secure the highest quality artifacts at competitive costs.',
  };
  return bios[id] || 'Autonomous LeeWay agent governed by the Sovereign Standards enforcement engine. Dedicated to operational excellence.';
}

function getAgentIcon(id: string, size = 24) {
  const colorClass = "text-gold";
  switch (id) {
    case 'site-manager': return <Activity size={size} className={colorClass} />;
    case 'sales-agent': return <TrendingUp size={size} className={colorClass} />;
    case 'customer-care-agent': return <MessageSquare size={size} className={colorClass} />;
    case 'inventory-agent': return <Package size={size} className={colorClass} />;
    case 'procurement-agent': return <AlertTriangle size={size} className={colorClass} />;
    case 'marketing-agent': return <Zap size={size} className={colorClass} />;
    case 'partner-agent': return <Users size={size} className={colorClass} />;
    case 'security-agent': return <ShieldCheck size={size} className={colorClass} />;
    default: return <Brain size={size} className={colorClass} />;
  }
}
