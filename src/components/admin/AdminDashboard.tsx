import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Zap
} from 'lucide-react';
import { Order, Member, Product } from '../../types';

interface DashboardProps {
  orders: Order[];
  members: Member[];
  products: Product[];
  analytics: any; // Simplified for now
}

export function AdminDashboard({ orders, members, products, analytics }: DashboardProps) {
  const revenue = orders.filter(o => o.status === 'paid' || o.status === 'delivered').reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const newMembers = members.length;
  
  const stats = [
    { label: 'Revenue', value: `$${revenue.toLocaleString()}`, trend: '+12.5%', trendUp: true, icon: TrendingUp },
    { label: 'Total Orders', value: orders.length, trend: '+4.2%', trendUp: true, icon: ShoppingBag },
    { label: 'New Members', value: newMembers, trend: '+18.1%', trendUp: true, icon: Users },
    { label: 'Live Visitors', value: '24', trend: 'Peak Hour', trendUp: true, icon: Eye },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Top Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#111] border border-white/5 p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={80} />
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-serif text-white tracking-widest">{stat.value}</h3>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Urgent Alerts */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] uppercase tracking-[0.4em] font-black text-gold flex items-center gap-2">
              <Zap size={14} className="animate-pulse" /> Command Center Alerts
            </h3>
            <span className="text-[9px] uppercase tracking-widest text-white/20">Live Sync Active</span>
          </div>

          <div className="space-y-4">
            {pendingOrders > 0 && (
              <AlertItem 
                type="warning" 
                title={`${pendingOrders} Pending Orders`} 
                description="Orders waiting for payment verification or fulfillment."
                action="Process Orders"
              />
            )}
            <AlertItem 
              type="info" 
              title="Low Inventory: Cuban Link Bracelet" 
              description="Only 2 units remaining in stock. Suggested reorder: 10 units."
              action="Procurement"
            />
             <AlertItem 
              type="success" 
              title="New VIP Tier Reached" 
              description="Customer 'James Winston' has exceeded $50,000 LTV."
              action="Send Reward"
            />
          </div>
        </div>

        {/* Quick Intelligence */}
        <div className="bg-[#050505] border border-white/5 p-8 space-y-8">
          <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Sales Intelligence</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Conversion Rate</span>
              <span className="text-[12px] font-mono text-gold">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Abandoned Carts</span>
              <span className="text-[12px] font-mono text-white">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Avg. Order Value</span>
              <span className="text-[12px] font-mono text-white">$4,250</span>
            </div>
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-gold hover:text-black transition-all">
            Full Analytics Report
          </button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-[#111] border border-white/5 p-10 space-y-8">
        <div className="flex justify-between items-center border-b border-white/5 pb-6">
          <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Global Activity Feed</h3>
          <button className="text-[9px] uppercase tracking-widest text-gold hover:underline">View All</button>
        </div>
        <div className="space-y-6">
          {orders.slice(0, 5).map((order, idx) => (
            <div key={idx} className="flex items-center gap-6 group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <ShoppingBag size={14} className="text-white/40" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase tracking-widest">
                  Order <span className="text-gold">#{order.orderNumber}</span> received
                </p>
                <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">
                  {order.customerInfo.name} — ${order.total.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-white/20 uppercase">Just now</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
             <div className="text-center py-10 opacity-20">
                <Clock size={40} className="mx-auto mb-4" />
                <p className="text-[10px] uppercase tracking-widest">Awaiting first global orders...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertItem({ type, title, description, action }: { type: 'warning' | 'info' | 'success', title: string, description: string, action: string }) {
  const iconMap = {
    warning: <AlertCircle className="text-yellow-500" size={18} />,
    info: <Clock className="text-blue-400" size={18} />,
    success: <CheckCircle2 className="text-green-500" size={18} />
  };

  return (
    <div className="bg-[#111] border border-white/5 p-6 flex items-start gap-6 group hover:border-white/10 transition-colors">
      <div className="mt-1">{iconMap[type]}</div>
      <div className="flex-1 space-y-1">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h4>
        <p className="text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">{description}</p>
      </div>
      <button className="px-5 py-2 bg-white/5 text-[9px] uppercase tracking-widest font-black hover:bg-gold hover:text-black transition-all">
        {action}
      </button>
    </div>
  );
}
