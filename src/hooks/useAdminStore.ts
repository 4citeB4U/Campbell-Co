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
          recommendations: [{ id: '1', text: 'Recommend follow-up for high-intent diamond inquiry and abandoned cart #882', actionLabel: 'Send SMS', actionType: 'marketing' }]
        },
        {
          id: 'procurement-agent',
          name: 'Procurement Specialist',
          purpose: 'Monitors diamond, gemstone, and precious metal markets',
          status: 'alert',
          tasks: [],
          recommendations: [
            { id: '2', text: 'Natural round VS1 stones softened this week. Review buy window for 1.00ct to 1.49ct inventory.', actionLabel: 'Review Buy', actionType: 'procurement' },
            { id: '3', text: '14K white gold costs moved above target. Adjust bridal ring margin bands.', actionLabel: 'Update Margin', actionType: 'pricing' }
          ]
        },
        {
          id: 'partner-agent',
          name: 'Partner Integration',
          purpose: 'Tracks external marketplace, affiliate, and vendor setup links',
          status: 'idle',
          tasks: [],
          recommendations: [
            { id: '4', text: 'Add Amazon, vendor, and payment-provider dashboard links once permissions are approved.', actionLabel: 'Open Setup', actionType: 'setup' }
          ]
        }
      ]);
      setProcurement({
        goldPrice: 2345.50,
        diamondPriceIndex: 112.4,
        lastUpdated: new Date().toISOString(),
        supplierCosts: { 'GoldSupplier-A': 2280, 'DiamondSource-Prime': 6120, 'GemBroker-Blue': 1840 },
        materials: [
          {
            id: 'dia-natural-round-vs1',
            label: 'Natural Diamond',
            category: 'diamond',
            specification: 'Round 1.00ct VS1 F GIA',
            unitPrice: 6120,
            unitLabel: 'per stone',
            trend: '-1.8%',
            trendUp: false,
            note: 'High bridal demand, slightly softer wholesale window this week.',
          },
          {
            id: 'dia-lab-oval-vvs2',
            label: 'Lab Diamond',
            category: 'diamond',
            specification: 'Oval 2.00ct VVS2 E IGI',
            unitPrice: 2240,
            unitLabel: 'per stone',
            trend: '+0.6%',
            trendUp: true,
            note: 'Premium elongated cuts holding value in social-led demand.',
          },
          {
            id: 'dia-black-round',
            label: 'Black Diamond',
            category: 'diamond',
            specification: 'Round 1.50ct treated black',
            unitPrice: 940,
            unitLabel: 'per stone',
            trend: '+2.1%',
            trendUp: true,
            note: 'Alternative bridal and men’s pieces trending upward.',
          },
          {
            id: 'gold-14k-white',
            label: '14K White Gold',
            category: 'gold',
            specification: 'Alloy casting rate',
            unitPrice: 74,
            unitLabel: 'per gram',
            trend: '+1.4%',
            trendUp: true,
            note: 'Rhodium-sensitive margin line; monitor bridal styles closely.',
          },
          {
            id: 'gold-18k-yellow',
            label: '18K Yellow Gold',
            category: 'gold',
            specification: 'Alloy casting rate',
            unitPrice: 91,
            unitLabel: 'per gram',
            trend: '+1.9%',
            trendUp: true,
            note: 'Luxury chain and statement ring cost basis remains elevated.',
          },
          {
            id: 'gem-emerald-colombian',
            label: 'Emerald',
            category: 'gem',
            specification: 'Colombian 0.75ct fine green',
            unitPrice: 1860,
            unitLabel: 'per stone',
            trend: '+0.3%',
            trendUp: true,
            note: 'Stable premium supply, lower volume than white diamond lines.',
          },
        ],
        alerts: [
          {
            id: 'alert-diamond-buy-window',
            title: 'Bulk Buy: Natural round VS1 bridal stones',
            reason: 'Wholesale pricing softened across 1.00ct to 1.49ct GIA natural rounds.',
            impact: 'Potential 6% cost reduction on bridal inventory.',
          },
          {
            id: 'alert-white-gold-margin',
            title: 'Reprice 14K white gold bridal settings',
            reason: 'White gold alloy and finishing cost moved above your current margin threshold.',
            impact: 'Protect margin on top-selling engagement styles.',
          },
          {
            id: 'alert-black-diamond-trend',
            title: 'Expand black diamond men’s assortment',
            reason: 'Alternative stone demand is increasing faster than standard men’s metal-only styles.',
            impact: 'Opportunity to widen assortment with lower stone cost basis.',
          },
        ]
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
