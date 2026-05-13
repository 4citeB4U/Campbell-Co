/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.COMPONENTS.ADMIN.ADMIN_SETTINGS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = AdminSettings.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/admin/AdminSettings.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Bell, 
  Smartphone, 
  Globe, 
  Database,
  Cloud,
  UserCheck,
  CreditCard,
  ChevronRight,
  LogOut
} from 'lucide-react';

type CommerceSetup = {
  stripeDashboard: string;
  bnplProvider: string;
  coinbaseBusiness: string;
  marketFeedNotes: string;
};

const COMMERCE_SETUP_KEY = 'campbell-commerce-setup';

export function AdminSettings() {
  const [commerceSetup, setCommerceSetup] = useState<CommerceSetup>({
    stripeDashboard: '',
    bnplProvider: '',
    coinbaseBusiness: '',
    marketFeedNotes: '',
  });
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(COMMERCE_SETUP_KEY);
    if (saved) {
      try {
        setCommerceSetup(JSON.parse(saved) as CommerceSetup);
      } catch {
        // Ignore malformed saved config.
      }
    }
  }, []);

  const updateSetup = (field: keyof CommerceSetup, value: string) => {
    setCommerceSetup((current) => ({ ...current, [field]: value }));
  };

  const saveSetup = () => {
    window.localStorage.setItem(COMMERCE_SETUP_KEY, JSON.stringify(commerceSetup));
    setSavedMessage('Saved locally. Add live provider links and credentials later.');
    window.setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-16 pb-32">
      <div className="space-y-4">
        <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Configuration</span>
        <h2 className="text-4xl font-serif tracking-widest uppercase">Vault Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         
         <div className="lg:col-span-2 space-y-12">
            <SettingsSection title="Global Security">
               <SettingsToggle label="Two-Factor Authentication" description="Require biometric or token verification for vault access." active={true} />
               <SettingsToggle label="Sovereign Enforcement" description="Auto-block unauthorized API requests from non-governed nodes." active={true} />
               <SettingsToggle label="Neural Encryption" description="AES-512 encryption for all customer and transaction data." active={true} />
            </SettingsSection>

            <SettingsSection title="Operational Modes">
               <SettingsToggle label="Maintenance Mode" description="Show private entry screen to all public visitors." active={false} />
               <SettingsToggle label="Agent Autonomy" description="Allow AI agents to execute non-financial directives without approval." active={true} />
               <SettingsToggle label="Luxury Obfuscation" description="Hide sensitive analytics from standard staff roles." active={true} />
            </SettingsSection>

            <div className="space-y-8">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Commerce & Data Connections</h3>
                  <button onClick={saveSetup} className="px-5 py-3 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white transition-all">
                     Save Setup
                  </button>
               </div>
               {savedMessage && (
                  <div className="border border-gold/20 bg-gold/5 p-4 text-[9px] uppercase tracking-[0.25em] text-gold font-black">
                     {savedMessage}
                  </div>
               )}
               <div className="grid grid-cols-1 gap-6">
                  <SettingsInput
                    label="Stripe Dashboard or Payment Link"
                    value={commerceSetup.stripeDashboard}
                    onChange={(value) => updateSetup('stripeDashboard', value)}
                    description="Paste your Stripe dashboard URL, payment link, or checkout control URL when payments are ready."
                  />
                  <SettingsInput
                    label="Installment / BNPL Provider"
                    value={commerceSetup.bnplProvider}
                    onChange={(value) => updateSetup('bnplProvider', value)}
                    description="Store the provider you choose for monthly financing, such as Affirm, Klarna, or another approved lender."
                  />
                  <SettingsInput
                    label="Coinbase Business / Crypto Payments"
                    value={commerceSetup.coinbaseBusiness}
                    onChange={(value) => updateSetup('coinbaseBusiness', value)}
                    description="Paste your Coinbase Business dashboard or crypto payment setup link here."
                  />
                  <SettingsTextArea
                    label="Market Feed Notes"
                    value={commerceSetup.marketFeedNotes}
                    onChange={(value) => updateSetup('marketFeedNotes', value)}
                    description="Track where diamond, gemstone, and metal pricing should come from once your market-data provider is chosen."
                  />
               </div>
            </div>
            
            <div className="p-10 bg-red-500/5 border border-red-500/20 space-y-6">
               <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-red-500">Danger Zone</h3>
               <p className="text-[10px] uppercase tracking-widest text-red-500/60 leading-relaxed">The following actions are irreversible and require primary owner biometric confirmation.</p>
               <div className="flex gap-6">
                  <button className="px-8 py-3 border border-red-500/40 text-red-500 text-[9px] uppercase tracking-widest font-black hover:bg-red-500 hover:text-white transition-all">Wipe System Logs</button>
                  <button className="px-8 py-3 bg-red-500 text-white text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-red-500 transition-all">Deactivate Sovereign OS</button>
               </div>
            </div>
         </div>

         <aside className="space-y-8">
            <div className="bg-[#111] border border-white/5 p-8 space-y-10">
               <h3 className="text-[11px] uppercase tracking-[0.4em] font-black border-b border-white/5 pb-4">Owner Profile</h3>
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif text-2xl">L</div>
                  <div>
                     <p className="text-[11px] font-black uppercase tracking-widest text-white">Primary Owner</p>
                     <p className="text-[9px] uppercase tracking-widest text-white/40">Sovereign Identity Verified</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black-pure transition-all flex items-center justify-between px-6">
                     <span>Update Identity</span>
                     <ChevronRight size={14} />
                  </button>
                  <button className="w-full py-4 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white hover:text-black-pure transition-all flex items-center justify-between px-6">
                     <span>Payment Methods</span>
                     <CreditCard size={14} />
                  </button>
               </div>
            </div>

            <div className="bg-[#050505] border border-white/5 p-8 space-y-6">
               <div className="flex items-center gap-4 text-gold">
                  <Database size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-black">System Info</span>
               </div>
               <div className="space-y-3">
                  <SystemInfoRow label="OS Version" value="v4.2.0-SOVEREIGN" />
                  <SystemInfoRow label="Node Location" value="Distributed / Encrypted" />
                  <SystemInfoRow label="Last Update" value="May 12, 2026" />
               </div>
            </div>
         </aside>

      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-8">
       <h3 className="text-[12px] uppercase tracking-[0.4em] font-black border-b border-white/5 pb-4">{title}</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {children}
       </div>
    </div>
  );
}

function SettingsToggle({ label, description, active }: { label: string, description: string, active: boolean }) {
  const [isOn, setIsOn] = useState(active);
  return (
    <div className="bg-[#111] border border-white/5 p-8 space-y-6 group hover:border-gold/30 transition-all">
       <div className="flex justify-between items-start">
          <h4 className="text-[11px] font-black uppercase tracking-widest">{label}</h4>
          <button 
            onClick={() => setIsOn(!isOn)}
            className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isOn ? 'bg-gold' : 'bg-white/10'}`}
          >
             <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 ${isOn ? 'left-7' : 'left-1'}`} />
          </button>
       </div>
       <p className="text-[9px] uppercase tracking-widest text-white/40 leading-relaxed">{description}</p>
    </div>
  );
}

function SystemInfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[8px] uppercase tracking-widest text-white/30">{label}</span>
       <span className="text-[8px] uppercase tracking-widest font-black text-white/60">{value}</span>
    </div>
  );
}

function SettingsInput({
  label,
  value,
  description,
  onChange,
}: {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
        <p className="text-[9px] uppercase tracking-[0.18em] text-white/35 leading-relaxed">{description}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black-pure border border-white/10 p-4 text-[10px] uppercase tracking-[0.18em] text-white outline-none focus:border-gold"
      />
    </div>
  );
}

function SettingsTextArea({
  label,
  value,
  description,
  onChange,
}: {
  label: string;
  value: string;
  description: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-[#111] border border-white/5 p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-[9px] uppercase tracking-widest text-white/30 font-black">{label}</label>
        <p className="text-[9px] uppercase tracking-[0.18em] text-white/35 leading-relaxed">{description}</p>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-black-pure border border-white/10 p-4 text-[10px] uppercase tracking-[0.18em] text-white outline-none focus:border-gold leading-relaxed"
      />
    </div>
  );
}
