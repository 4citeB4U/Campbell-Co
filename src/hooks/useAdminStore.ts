/*
LEEWAY HEADER — DO NOT REMOVE

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
      const localMembers = localStorage.getItem('campbell-members');
      if (localMembers) {
        setMembers(JSON.parse(localMembers));
      } else {
        const seedMembers: Member[] = [
          {
            id: 'member-evelyn',
            name: 'Evelyn Harper',
            email: 'evelyn.harper@harperluxury.com',
            phone: '555-0199',
            customerTier: 'VIP',
            rewardsBalance: 12450,
            lifetimeValue: 24500,
            consentStatus: 'accepted',
            signupDate: new Date().toISOString(),
            purchaseHistory: [],
            wishlist: []
          }
        ];
        localStorage.setItem('campbell-members', JSON.stringify(seedMembers));
        setMembers(seedMembers);
      }
      setVendors([]);
      setAgents([
        {
          id: 'agent-lee-prime',
          name: 'Agent Lee Prime',
          title: 'Sovereign Orchestrator',
          department: 'Executive Core',
          family: 'core',
          purpose: 'System-wide orchestrator and final speaker. Enforces the LeeWay Constitution across all modules.',
          status: 'active',
          authorityLevel: 'Full Sovereign Control',
          sourceAgent: 'LEE_PRIME',
          lineage: 'LeeWay-Standards/src/core/lee-prime',
          capabilities: ['orchestration', 'synthesis', 'sovereignty', 'final-speaker'],
          responsibilities: [
            'Finalize all administrative outputs',
            'Enforce zero-trust security policies',
            'Coordinate multi-agent task sequences',
          ],
          operatingMode: 'connected',
          tasks: [],
          recommendations: [
            { id: 'prime-1', text: 'Initialize full 8-Stage Sovereign Cycle for the next site publication.', actionLabel: 'Begin Cycle', actionType: 'orchestration' },
          ]
        },
        {
          id: 'nova-forge-agent',
          name: 'Nova',
          title: 'Logic & Code Architect',
          department: 'Engineering',
          family: 'forge',
          purpose: 'High-fidelity code generation and structural refactoring. Maintains architectural integrity.',
          status: 'active',
          authorityLevel: 'Structural Mutation',
          sourceAgent: 'NOVA',
          lineage: 'LeeWay-Standards/src/agents/forge',
          capabilities: ['code-gen', 'refactor', 'optimization', 'logic-forge'],
          responsibilities: [
            'Maintain codebase hygiene and headers',
            'Optimize React component performance',
            'Audit logic drift in custom modules',
          ],
          operatingMode: 'advisory',
          tasks: [],
          recommendations: [
            { id: 'nova-1', text: 'Detected structural drift in the product grid layout. Recommend refactoring into governed sub-components.', actionLabel: 'Review Forge', actionType: 'engineering' }
          ]
        },
        {
          id: 'atlas-memory-agent',
          name: 'Atlas',
          title: 'Knowledge & Memory Keeper',
          department: 'Intelligence',
          family: 'memory',
          purpose: 'Manages the Triple-Threat memory stores. Ensures long-term continuity and knowledge retrieval.',
          status: 'active',
          authorityLevel: 'Semantic Retrieval',
          sourceAgent: 'ATLAS',
          lineage: 'LeeWay-Standards/src/agents/memory',
          capabilities: ['vector-search', 'indexing', 'persistence', 'semantic-memory'],
          responsibilities: [
            'Index private client preferences',
            'Retrieve historical sourcing data',
            'Maintain the business context mesh',
          ],
          operatingMode: 'connected',
          tasks: [],
          recommendations: [{ id: 'atlas-1', text: 'Semantic overlap detected in customer feedback tags. Consolidate for better recommendation accuracy.', actionLabel: 'Optimize Memory', actionType: 'intelligence' }]
        },
        {
          id: 'shield-governor-agent',
          name: 'Shield Governor Serah Kane',
          title: 'Security & Compliance Officer',
          department: 'Sovereign Security',
          family: 'security',
          purpose: 'Enforces constitutional runtime boundaries and reviews protected actions.',
          status: 'active',
          authorityLevel: 'Policy Enforcement',
          sourceAgent: 'SHIELD_GOVERNOR',
          lineage: 'LeeWay-Standards/src/core/security',
          capabilities: ['zone-enforcement', 'plugin-approval', 'protected-review', 'incident-receipts'],
          responsibilities: [
            'Audit administrative permission requests',
            'Enforce zero-trust boundaries',
            'Verify third-party script safety',
          ],
          operatingMode: 'connected',
          tasks: [],
          recommendations: [
            { id: 'shield-1', text: 'Unverified third-party script attempt detected in marketing block. Blocked by default.', actionLabel: 'Review Incident', actionType: 'security' }
          ]
        },
        {
          id: 'aura-media-agent',
          name: 'Aura',
          title: 'Experience & Interface Design',
          department: 'Creative Strategy',
          family: 'media',
          purpose: 'Governs the visual identity and emotional presence of the House of Campbell.',
          status: 'idle',
          authorityLevel: 'Visual Identity Authority',
          sourceAgent: 'AURA',
          lineage: 'LeeWay-Standards/src/agents/media',
          capabilities: ['ui-ux', 'voice-synth', 'media-gen', 'style-governance'],
          responsibilities: [
            'Maintain luxury brand aesthetics',
            'Generate marketing assets and icons',
            'Oversee concierge voice personality',
          ],
          operatingMode: 'standby',
          tasks: [],
          recommendations: [
            { id: 'aura-1', text: 'Color palette drift detected on mobile views. Re-aligning to secondary gold tokens.', actionLabel: 'Apply Style', actionType: 'design' }
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
    console.log(`Approving task ${taskId} for agent ${agentId}`);
    
    // Dynamically update local state
    setAgents((currentAgents) => {
      return currentAgents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: 'working',
            recommendations: agent.recommendations.filter(r => r.id !== taskId)
          };
        }
        return agent;
      });
    });

    // Schedule restore to active/idle state after task resolves
    setTimeout(() => {
      setAgents((currentAgents) => {
        return currentAgents.map((agent) => {
          if (agent.id === agentId) {
            return {
              ...agent,
              status: agentId === 'aura-media-agent' ? 'idle' : 'active'
            };
          }
          return agent;
        });
      });
    }, 2800);
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
