import React from 'react';
import { motion } from 'motion/react';
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
  AlertTriangle
} from 'lucide-react';
import { AIAgent } from '../../types';

interface AgentsProps {
  agents: AIAgent[];
  onApprove: (agentId: string, taskId: string) => void;
}

export function AdminAgents({ agents, onApprove }: AgentsProps) {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Autonomous Operations</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">AI Workforce</h2>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-green-500 font-black">All Agents Online</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {agents.map((agent) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/5 p-8 space-y-8 relative overflow-hidden"
          >
            {/* Status indicator */}
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rotate-45 ${
               agent.status === 'alert' ? 'bg-red-500/10' : 'bg-gold/10'
            }`} />

            <div className="flex items-start justify-between relative z-10">
               <div className="flex gap-6">
                  <div className={`w-16 h-16 border flex items-center justify-center ${
                     agent.status === 'alert' ? 'border-red-500/50 bg-red-500/10' : 'border-gold/50 bg-gold/10'
                  }`}>
                     {getAgentIcon(agent.id)}
                  </div>
                  <div>
                     <h3 className="text-xl font-serif tracking-widest uppercase text-white">{agent.name}</h3>
                     <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{agent.purpose}</p>
                  </div>
               </div>
               <span className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                  agent.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  agent.status === 'alert' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-white/5 text-white/40 border-white/10'
               }`}>
                  {agent.status}
               </span>
            </div>

            <div className="space-y-6 relative z-10">
               <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 border-b border-white/5 pb-3">Recommendations</h4>
               <div className="space-y-4">
                  {agent.recommendations.map((rec) => (
                    <div key={rec.id} className="bg-black-pure border border-white/5 p-5 flex items-start gap-5 group">
                       <div className="mt-1">
                          <Activity size={14} className="text-gold" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest leading-relaxed text-white/80">{rec.text}</p>
                          <div className="mt-4 flex gap-4">
                             <button 
                                onClick={() => onApprove(agent.id, rec.id)}
                                className="px-5 py-2 bg-gold text-black-pure text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all"
                             >
                                {rec.actionLabel}
                             </button>
                             <button className="px-5 py-2 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white/5">
                                Ignore
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {agent.recommendations.length === 0 && (
                    <p className="text-[10px] uppercase tracking-widest text-white/20 italic">No pending recommendations</p>
                  )}
               </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-[9px] uppercase tracking-widest font-black text-white/20 relative z-10">
               <div className="flex gap-4">
                  <span>Efficiency: 98%</span>
                  <span>Tasks: 1,420</span>
               </div>
               <button className="flex items-center gap-2 hover:text-gold transition-colors">
                  <Settings size={12} /> Configure Agent
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function getAgentIcon(id: string) {
  const size = 24;
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
