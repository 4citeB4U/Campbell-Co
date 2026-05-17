/*
LEEWAY HEADER â€” DO NOT REMOVE

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
TAG: UI.COMPONENTS.ADMIN.ADMIN_PARTNERS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice â†’ Intent â†’ Location â†’ Vertical â†’ Ranking â†’ Render

5WH:
WHAT = AdminPartners.tsx â€” governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminPartners.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards â†’ Integrated â†’ Runtime â†’ Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useMemo, useState } from 'react';
import {
  Target,
  Plus,
  Search,
  Globe,
  ShieldCheck,
  ExternalLink,
  Link as LinkIcon,
  Save,
  CheckCircle2,
} from 'lucide-react';

type PartnerConnection = {
  id: string;
  name: string;
  category: string;
  dashboardUrl: string;
  productFeedUrl: string;
  payoutUrl: string;
  status: 'planning' | 'pending' | 'connected';
  notes: string;
};

const PARTNER_STORAGE_KEY = 'campbell-partner-connections';

const defaultPartners: PartnerConnection[] = [
  {
    id: 'amazon-marketplace',
    name: 'Amazon Marketplace',
    category: 'Marketplace',
    dashboardUrl: '',
    productFeedUrl: '',
    payoutUrl: '',
    status: 'planning',
    notes: 'Add seller dashboard and catalog-feed links once approval is complete.',
  },
  {
    id: 'coinbase-business',
    name: 'Coinbase Business',
    category: 'Crypto Payments',
    dashboardUrl: '',
    productFeedUrl: '',
    payoutUrl: '',
    status: 'planning',
    notes: 'Use for crypto settlement, payment links, and invoices when business setup is approved.',
  },
  {
    id: 'stripe-platform',
    name: 'Stripe',
    category: 'Payments',
    dashboardUrl: '',
    productFeedUrl: '',
    payoutUrl: '',
    status: 'planning',
    notes: 'Use for cards, debit, wallets, BNPL, invoices, and installment-related checkout flows.',
  },
];

export function AdminPartners() {
  const [partners, setPartners] = useState<PartnerConnection[]>(defaultPartners);
  const [selectedId, setSelectedId] = useState(defaultPartners[0].id);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(PARTNER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as PartnerConnection[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPartners(parsed);
          setSelectedId(parsed[0].id);
        }
      } catch {
        // Keep defaults if saved data is malformed.
      }
    }
  }, []);

  const filteredPartners = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return partners;
    return partners.filter((partner) =>
      [partner.name, partner.category, partner.status, partner.notes].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [partners, search]);

  const selectedPartner = partners.find((partner) => partner.id === selectedId) || partners[0];

  const updatePartner = (id: string, field: keyof PartnerConnection, value: string) => {
    setPartners((current) =>
      current.map((partner) => (partner.id === id ? { ...partner, [field]: value } : partner))
    );
  };

  const persistPartners = () => {
    window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(partners));
    setStatusMessage('Saved locally. You can paste real partner links here as approvals come in.');
    window.setTimeout(() => setStatusMessage(null), 3200);
  };

  const addPartner = () => {
    const next: PartnerConnection = {
      id: `partner-${Date.now()}`,
      name: 'New Partner',
      category: 'Vendor',
      dashboardUrl: '',
      productFeedUrl: '',
      payoutUrl: '',
      status: 'planning',
      notes: 'Paste dashboard, feed, or payout links when this partner is approved.',
    };
    setPartners((current) => [next, ...current]);
    setSelectedId(next.id);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Marketplace & Integrations</span>
          <h2 className="text-4xl font-serif tracking-widest uppercase">Partner Hub</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={persistPartners}
            className="px-8 py-4 border border-gold text-gold text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black-pure transition-all"
          >
            <Save size={16} />
            Save Connections
          </button>
          <button
            onClick={addPartner}
            className="px-8 py-4 bg-gold text-black-pure text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-white transition-all"
          >
            <Plus size={16} />
            Add Partner
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="border border-gold/20 bg-gold/5 p-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-gold font-black">
          <CheckCircle2 size={14} />
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-8">
        <aside className="bg-[#111] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-[#050505] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-black">Partner List</span>
              <Target size={16} className="text-gold/60" />
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="SEARCH PARTNERS..."
                className="w-full bg-black-pure border border-white/5 pl-10 pr-4 py-3 text-[9px] uppercase tracking-widest focus:border-gold outline-none text-white"
              />
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {filteredPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedId(partner.id)}
                className={`w-full text-left p-5 transition-all ${
                  selectedId === partner.id ? 'bg-gold/10 border-l-2 border-gold' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-white">{partner.name}</p>
                    <p className="text-[8px] uppercase tracking-widest text-white/30">{partner.category}</p>
                  </div>
                  <span className={`text-[8px] uppercase tracking-widest font-black ${
                    partner.status === 'connected' ? 'text-green-500' : partner.status === 'pending' ? 'text-yellow-500' : 'text-white/25'
                  }`}>
                    {partner.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-8">
          <div className="bg-[#111] border border-white/5 p-8 lg:p-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/5 pb-6">
              <div className="space-y-2">
                <h3 className="text-[12px] uppercase tracking-[0.35em] font-black">{selectedPartner.name}</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">Paste approved partner links here so the operating system has one place to reference dashboards, feeds, and payouts.</p>
              </div>
              <select
                value={selectedPartner.status}
                onChange={(e) => updatePartner(selectedPartner.id, 'status', e.target.value)}
                className="bg-black-pure border border-white/10 px-4 py-3 text-[9px] uppercase tracking-widest text-white outline-none"
              >
                <option value="planning">Planning</option>
                <option value="pending">Pending Approval</option>
                <option value="connected">Connected</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PartnerField label="Partner Name" value={selectedPartner.name} onChange={(value) => updatePartner(selectedPartner.id, 'name', value)} />
              <PartnerField label="Category" value={selectedPartner.category} onChange={(value) => updatePartner(selectedPartner.id, 'category', value)} />
              <PartnerField label="Dashboard URL" value={selectedPartner.dashboardUrl} onChange={(value) => updatePartner(selectedPartner.id, 'dashboardUrl', value)} />
              <PartnerField label="Payout / Billing URL" value={selectedPartner.payoutUrl} onChange={(value) => updatePartner(selectedPartner.id, 'payoutUrl', value)} />
              <div className="lg:col-span-2">
                <PartnerField label="Catalog / Product Feed URL" value={selectedPartner.productFeedUrl} onChange={(value) => updatePartner(selectedPartner.id, 'productFeedUrl', value)} />
              </div>
              <div className="lg:col-span-2 space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">Internal Notes</label>
                <textarea
                  value={selectedPartner.notes}
                  onChange={(e) => updatePartner(selectedPartner.id, 'notes', e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/5 p-4 text-[10px] uppercase tracking-[0.18em] text-white focus:border-gold outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="border border-gold/10 bg-gold/5 p-8 space-y-4">
              <div className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-gold" />
                <h4 className="text-[10px] uppercase tracking-[0.35em] font-black">Setup Flow</h4>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed text-white/45">
                Approval first, links second, live automation third. This keeps the portal usable before every integration is fully active.
              </p>
            </div>
            <div className="border border-white/10 bg-[#050505] p-8 space-y-4">
              <div className="flex items-center gap-4">
                <LinkIcon size={20} className="text-gold" />
                <h4 className="text-[10px] uppercase tracking-[0.35em] font-black">Link Types</h4>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed text-white/45">
                Save dashboard URLs, product feeds, payout pages, or affiliate consoles in one place so you do not have to memorize where each business system lives.
              </p>
            </div>
            <div className="border border-white/10 bg-[#050505] p-8 space-y-4">
              <div className="flex items-center gap-4">
                <Globe size={20} className="text-gold" />
                <h4 className="text-[10px] uppercase tracking-[0.35em] font-black">Future Automation</h4>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed text-white/45">
                Once APIs or feed permissions are available, this same section can become the source of truth for pulling partner inventory, payouts, and marketplace status.
              </p>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 p-8 space-y-6">
            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black border-b border-white/5 pb-4">Quick Open</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Dashboard', url: selectedPartner.dashboardUrl },
                { label: 'Catalog Feed', url: selectedPartner.productFeedUrl },
                { label: 'Payout / Billing', url: selectedPartner.payoutUrl },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.url || '#'}
                  target={item.url ? '_blank' : undefined}
                  rel={item.url ? 'noreferrer' : undefined}
                  className={`border px-4 py-4 text-[9px] uppercase tracking-[0.25em] font-black flex items-center justify-between transition-all ${
                    item.url ? 'border-gold/20 text-gold hover:bg-gold hover:text-black-pure' : 'border-white/10 text-white/25 cursor-not-allowed'
                  }`}
                >
                  <span>{item.label}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PartnerField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/5 p-4 text-[10px] uppercase tracking-[0.18em] text-white focus:border-gold outline-none"
      />
    </div>
  );
}
