/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.SRC.HOOKS.USE_ADMIN_STORE.MAIN
DESCRIPTION: Admin state and data management hook for the Luxury OS.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = useAdminStore.ts — central state hook
WHY = Manage orders, members, vendors, and agents in one place
WHO = Leeway Innovations
WHERE = src/hooks/useAdminStore.ts
WHEN = 2026-05-13
HOW = React state + Firestore real-time listeners

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, Member, Vendor, AIAgent, ProcurementData, Product } from '../types';

export function useAdminStore() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [procurement, setProcurement] = useState<ProcurementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      // Mock data for local demo
      setOrders([]);
      setMembers([]);
      setVendors([]);
      setAgents([
        {
          id: 'site-manager',
          name: 'Site Manager',
          purpose: 'Monitors site health and load times',
          status: 'active',
          tasks: [],
          recommendations: []
        },
        {
          id: 'sales-agent',
          name: 'Sales Intelligence',
          purpose: 'Identifies high-intent shoppers',
          status: 'active',
          tasks: [],
          recommendations: [{ id: '1', text: 'Recommend follow-up for abandoned cart #882', actionLabel: 'Send SMS', actionType: 'marketing' }]
        },
        {
          id: 'procurement-agent',
          name: 'Procurement Specialist',
          purpose: 'Monitors gold and diamond markets',
          status: 'alert',
          tasks: [],
          recommendations: [{ id: '2', text: 'Gold prices up 4%. Suggest repricing Cuban chains.', actionLabel: 'Reprice', actionType: 'procurement' }]
        }
      ]);
      setProcurement({
        goldPrice: 2345.50,
        diamondPriceIndex: 112.4,
        lastUpdated: new Date().toISOString(),
        supplierCosts: { 'GoldSupplier-A': 2280 }
      });
      setLoading(false);
      return undefined;
    }

    const unsubscribers: (() => void)[] = [];

    // Listen to Orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
    unsubscribers.push(onSnapshot(ordersQuery, (s) => {
      setOrders(s.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    }));

    // Listen to Members
    const membersQuery = query(collection(db, 'members'), orderBy('signupDate', 'desc'));
    unsubscribers.push(onSnapshot(membersQuery, (s) => {
      setMembers(s.docs.map(d => ({ id: d.id, ...d.data() } as Member)));
    }));

    // Listen to Vendors
    const vendorsQuery = query(collection(db, 'vendors'));
    unsubscribers.push(onSnapshot(vendorsQuery, (s) => {
      setVendors(s.docs.map(d => ({ id: d.id, ...d.data() } as Vendor)));
    }));

    // Listen to Agents
    const agentsQuery = query(collection(db, 'agents'));
    unsubscribers.push(onSnapshot(agentsQuery, (s) => {
      setAgents(s.docs.map(d => ({ id: d.id, ...d.data() } as AIAgent)));
    }));

    // Listen to Procurement
    const procDoc = doc(db, 'system', 'procurement');
    unsubscribers.push(onSnapshot(procDoc, (s) => {
      if (s.exists()) setProcurement(s.data() as ProcurementData);
    }));

    setLoading(false);
    return () => unsubscribers.forEach(u => u());
  }, []);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!db) return;
    await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: serverTimestamp() });
  };

  const addMemberNote = async (memberId: string, note: string) => {
    if (!db) return;
    await updateDoc(doc(db, 'members', memberId), { adminNotes: note });
  };

  const approveAgentTask = async (agentId: string, taskId: string) => {
    // Logic to "approve" a task, which might trigger a real action
    console.log(`Approving task ${taskId} for agent ${agentId}`);
  };

  return {
    orders,
    members,
    vendors,
    agents,
    procurement,
    loading,
    actions: {
      updateOrderStatus,
      addMemberNote,
      approveAgentTask
    }
  };
}
