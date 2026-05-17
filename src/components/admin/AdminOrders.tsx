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

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_ORDERS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminOrders.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminOrders.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard
} from 'lucide-react';
import { Order } from '../../types';

interface OrdersProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

export function AdminOrders({ orders, onUpdateStatus }: OrdersProps) {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Fulfillment</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Global Orders</h2>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white/10">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#050505] flex flex-wrap gap-6 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              type="text" 
              placeholder="SEARCH ORDERS, CUSTOMERS, SKU..." 
              className="w-full bg-black-pure border border-white/5 pl-12 pr-4 py-3 text-[10px] uppercase tracking-widest focus:border-gold outline-none transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-black-pure border border-white/5 text-white/40 hover:text-white">
              <Filter size={16} />
            </button>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <span className="text-[9px] uppercase tracking-widest text-white/20">{orders.length} TOTAL ORDERS</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#050505] border-b border-white/5">
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Order ID</th>
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Customer</th>
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Total</th>
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Status</th>
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black">Payment</th>
                <th className="p-6 text-[9px] uppercase tracking-widest text-white/30 font-black text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="p-6">
                    <p className="text-[11px] font-black tracking-widest text-gold uppercase">#{order.orderNumber}</p>
                    <p className="text-[8px] text-white/20 uppercase mt-1">2 hours ago</p>
                  </td>
                  <td className="p-6">
                    <p className="text-[11px] font-black uppercase tracking-widest">{order.customerInfo.name}</p>
                    <p className="text-[8px] text-white/20 uppercase mt-1">{order.customerInfo.email}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-[12px] font-mono">${order.total.toLocaleString()}</span>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <CreditCard size={12} className={order.paymentStatus === 'paid' ? 'text-green-500' : 'text-white/20'} />
                       <span className="text-[9px] uppercase tracking-widest">{order.paymentStatus}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="p-3 bg-white/5 hover:bg-gold hover:text-black transition-all">
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-white/20 uppercase tracking-[0.4em] text-[10px]">
                    No orders in the global registry
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    paid: 'bg-green-500/10 text-green-500 border-green-500/20',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    delivered: 'bg-green-600/10 text-green-600 border-green-600/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    refunded: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };

  return (
    <span className={`px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
}
