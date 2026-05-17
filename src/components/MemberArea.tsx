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
TAG: UI.SRC.COMPONENTS.MEMBER_AREA.MAIN
DESCRIPTION: Complete interactive Member vault with signups, consent registries, and privacy requests.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = MemberArea.tsx — fully interactive storefront client registry area
WHY = Enable 360-degree customer testing for logins, registrations, dynamic consent, and privacy requests
WHO = Avion / LeeWay Innovations
WHERE = src/components/MemberArea.tsx
WHEN = 2026-05-17
HOW = React forms + local storage state synchronization

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShoppingBag, 
  Gem, 
  Settings, 
  LogOut, 
  History, 
  Heart,
  Award,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  FileText,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import { Member } from '../types';

interface PrivacyRequest {
  id: string;
  type: string;
  notes: string;
  status: 'Received by Sovereign Agent' | 'Authorized by Atlas' | 'Processed';
  date: string;
}

export default function MemberArea() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentProfiling, setConsentProfiling] = useState(true);
  const [consentZeroTrust, setConsentZeroTrust] = useState(true);
  
  // Interface Alerts
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  
  // Privacy Requests state
  const [privacyRequests, setPrivacyRequests] = useState<PrivacyRequest[]>([]);
  const [selectedRequestType, setSelectedRequestType] = useState('opt-out');
  const [requestNotes, setRequestNotes] = useState('');
  
  // Load session
  useEffect(() => {
    const session = localStorage.getItem('campbell-current-member');
    if (session) {
      setCurrentMember(JSON.parse(session));
    }
    
    const localRequests = localStorage.getItem('campbell-privacy-requests');
    if (localRequests) {
      setPrivacyRequests(JSON.parse(localRequests));
    } else {
      const initialRequests: PrivacyRequest[] = [
        {
          id: 'REQ-01',
          type: 'Opt-Out of Data Profiling (Sovereign Opt-Out)',
          notes: 'Standard zero-trust privacy check on login.',
          status: 'Processed',
          date: new Date(Date.now() - 86400000).toLocaleDateString()
        }
      ];
      localStorage.setItem('campbell-privacy-requests', JSON.stringify(initialRequests));
      setPrivacyRequests(initialRequests);
    }
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setAuthError('All credentials are required to provision an administrative vault.');
      return;
    }

    if (!consentZeroTrust) {
      setAuthError('You must accept the Zero-Trust Registry terms to activate your vault.');
      return;
    }

    const localMembers = localStorage.getItem('campbell-members');
    const membersList: Member[] = localMembers ? JSON.parse(localMembers) : [];

    // Check duplication
    if (membersList.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      setAuthError('This email is already associated with an active vault.');
      return;
    }

    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: '',
      customerTier: 'Private Client',
      rewardsBalance: 500, // Gift 500 points for registration
      lifetimeValue: 0,
      consentStatus: consentProfiling ? 'accepted' : 'rejected',
      signupDate: new Date().toISOString(),
      purchaseHistory: [],
      wishlist: []
    };

    const updatedMembersList = [newMember, ...membersList];
    localStorage.setItem('campbell-members', JSON.stringify(updatedMembersList));
    localStorage.setItem('campbell-current-member', JSON.stringify(newMember));
    
    // Dispatch standard event to force AdminOS stores to reload if listening on same page
    window.dispatchEvent(new Event('storage'));

    setCurrentMember(newMember);
    setAuthSuccess('Administrative Vault provisioned successfully. Welcome.');
    window.setTimeout(() => setAuthSuccess(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both your email and security vault password.');
      return;
    }

    const localMembers = localStorage.getItem('campbell-members');
    const membersList: Member[] = localMembers ? JSON.parse(localMembers) : [];

    const matched = membersList.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      localStorage.setItem('campbell-current-member', JSON.stringify(matched));
      setCurrentMember(matched);
      setAuthSuccess('Vault authentication successful.');
      window.setTimeout(() => setAuthSuccess(null), 3000);
    } else {
      // Create a temporary sandbox session or throw error
      setAuthError('Invalid vault credentials. Try registering a new registry account.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('campbell-current-member');
    setCurrentMember(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleWithdrawConsent = () => {
    if (!currentMember) return;
    
    const updated: Member = {
      ...currentMember,
      consentStatus: currentMember.consentStatus === 'accepted' ? 'rejected' : 'accepted'
    };

    // Update current session
    localStorage.setItem('campbell-current-member', JSON.stringify(updated));
    setCurrentMember(updated);

    // Update global list
    const localMembers = localStorage.getItem('campbell-members');
    if (localMembers) {
      const list: Member[] = JSON.parse(localMembers);
      const index = list.findIndex(m => m.id === currentMember.id);
      if (index !== -1) {
        list[index] = updated;
        localStorage.setItem('campbell-members', JSON.stringify(list));
      }
    }

    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmitPrivacyRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMember) return;

    let typeText = 'Opt-Out of Data Profiling (Sovereign Opt-Out)';
    if (selectedRequestType === 'export') {
      typeText = 'Access Personal Data Ledger (Export Data)';
    } else if (selectedRequestType === 'delete') {
      typeText = 'Right to Be Forgotten (Delete Profile)';
    }

    const newRequest: PrivacyRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      type: typeText,
      notes: requestNotes || 'Requested by customer via secure privacy panel.',
      status: 'Received by Sovereign Agent',
      date: new Date().toLocaleDateString()
    };

    const updatedRequests = [newRequest, ...privacyRequests];
    localStorage.setItem('campbell-privacy-requests', JSON.stringify(updatedRequests));
    setPrivacyRequests(updatedRequests);
    setRequestNotes('');

    // Simulate Agent approval sequence
    window.setTimeout(() => {
      setPrivacyRequests(current => 
        current.map(r => r.id === newRequest.id ? { ...r, status: 'Authorized by Atlas' } : r)
      );
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-black-pure pt-40 pb-24 px-6 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        
        <AnimatePresence mode="wait">
          {!currentMember ? (
            // ================== LOGIN / SIGNUP VIEW ==================
            <motion.div 
              key="auth-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto bg-[#070707] border border-white/5 p-8 lg:p-12 rounded-[2rem] space-y-8 shadow-2xl"
            >
              <div className="text-center space-y-3">
                <span className="text-[9px] uppercase tracking-[0.6em] text-gold font-black">Secure Authentication</span>
                <h1 className="text-3xl font-serif tracking-[0.16em] uppercase">Private Vault</h1>
                <p className="text-xs uppercase tracking-widest text-white/40">Campbell &amp; Co. Registry Access</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5">
                <button 
                  onClick={() => { setActiveTab('login'); setAuthError(null); }}
                  className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.24em] transition-colors ${activeTab === 'login' ? 'text-gold border-b-2 border-gold' : 'text-white/40 hover:text-white'}`}
                >
                  Authenticate
                </button>
                <button 
                  onClick={() => { setActiveTab('signup'); setAuthError(null); }}
                  className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.24em] transition-colors ${activeTab === 'signup' ? 'text-gold border-b-2 border-gold' : 'text-white/40 hover:text-white'}`}
                >
                  Join Registry
                </button>
              </div>

              {authError && (
                <div className="rounded-[1.25rem] border border-red-500/20 bg-red-500/5 px-4 py-3 flex gap-3 items-center text-xs text-red-400">
                  <ShieldAlert size={16} className="shrink-0 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {activeTab === 'login' ? (
                // Login Form
                <form onSubmit={handleLogin} className="space-y-6">
                  <label className="block space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Email Address</span>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="vault@client.com"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Security Password</span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="••••••••••••"
                    />
                  </label>
                  <button 
                    type="submit" 
                    className="w-full bg-gold text-black-pure py-5 rounded-full text-[10px] font-black uppercase tracking-[0.24em] hover:bg-white transition-all shadow-lg"
                  >
                    Authenticate Vault
                  </button>
                </form>
              ) : (
                // Signup Form
                <form onSubmit={handleRegister} className="space-y-5">
                  <label className="block space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Full Name</span>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="Evelyn Harper"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Email Address</span>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="evelyn@domain.com"
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Create Password</span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-gold transition-colors"
                      placeholder="••••••••••••"
                    />
                  </label>

                  {/* Consents */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={consentProfiling}
                        onChange={(e) => setConsentProfiling(e.target.checked)}
                        className="mt-1 accent-amber-600 rounded bg-white/5 border border-white/10"
                      />
                      <span className="text-[10px] text-white/60 leading-normal uppercase tracking-wider">
                        Consent to profile personalization &amp; AI concierge support (Consent ID: CC-101)
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={consentZeroTrust}
                        onChange={(e) => setConsentZeroTrust(e.target.checked)}
                        className="mt-1 accent-amber-600 rounded bg-white/5 border border-white/10"
                      />
                      <span className="text-[10px] text-white/60 leading-normal uppercase tracking-wider">
                        Accept Zero-Trust client registry ledger policy (Consent ID: CC-102)
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gold text-black-pure py-5 rounded-full text-[10px] font-black uppercase tracking-[0.24em] hover:bg-white transition-all shadow-lg mt-4"
                  >
                    Provision Registry Vault
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
            // ================== MEMBER DASHBOARD ==================
            <motion.div 
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-16">
                 <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-full border border-gold/30 p-1">
                       <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                          <UserCheck size={36} className="text-gold" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-black">Private Account Vault</span>
                       <h1 className="text-4xl lg:text-5xl font-serif tracking-widest uppercase">{currentMember.name}</h1>
                       <div className="flex gap-4">
                          <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 rounded-full">{currentMember.customerTier}</span>
                          <span className="text-[9px] uppercase tracking-widest px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full">Elite Member</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <span className="hidden sm:inline-flex items-center text-xs uppercase tracking-widest text-white/40">{currentMember.email}</span>
                    <button 
                      onClick={handleLogout}
                      className="p-4 bg-white/5 border border-white/10 hover:text-red-500 hover:bg-white/10 rounded-full transition-all"
                    >
                      <LogOut size={16} />
                    </button>
                 </div>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                 {/* Rewards Card */}
                 <div className="bg-[#050505] border border-white/5 p-10 space-y-10 rounded-[2rem] flex flex-col justify-between">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                         <h3 className="text-[12px] uppercase tracking-[0.4em] font-black">Loyalty Rewards</h3>
                         <Award size={18} className="text-gold" />
                      </div>
                      <div className="space-y-2">
                         <p className="text-[10px] uppercase tracking-widest text-white/40">Available Balance</p>
                         <h2 className="text-5xl font-serif text-white tracking-widest">{currentMember.rewardsBalance.toLocaleString()}</h2>
                         <p className="text-[9px] uppercase tracking-widest text-gold italic">Points worth ${(currentMember.rewardsBalance / 100).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <button className="w-full py-4 bg-gold text-black-pure text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white rounded-full transition-all">Redeem Gift</button>
                       <p className="text-[8px] uppercase tracking-widest text-white/20 text-center leading-relaxed">Earn 10 points for every $1 spent on Campbell-Co artifacts.</p>
                    </div>
                 </div>

                 {/* Consent & Data Sovereignty Panel */}
                 <div className="bg-[#050505] border border-white/5 p-10 space-y-8 rounded-[2rem] lg:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-950 text-gold border border-gold/10">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.22em] text-white">Sovereign Consent Ledger</h3>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">Manage your visual tracking and profiling settings</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Consent 1 */}
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold">Consent-CC-101</span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] uppercase tracking-widest rounded-full font-black">Active</span>
                          </div>
                          <h4 className="mt-1 text-[11px] font-black uppercase tracking-widest text-white">Personalization Profiling</h4>
                          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">Allows the Concierge to curate recommendations based on diamond selection history.</p>
                        </div>
                        <button 
                          onClick={handleWithdrawConsent}
                          className={`px-5 py-3 rounded-full text-[9px] uppercase tracking-widest font-black transition-all ${currentMember.consentStatus === 'accepted' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white'}`}
                        >
                          {currentMember.consentStatus === 'accepted' ? 'Withdraw' : 'Grant'}
                        </button>
                      </div>

                      {/* Consent 2 */}
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold">Consent-CC-102</span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] uppercase tracking-widest rounded-full font-black">Authoritative</span>
                          </div>
                          <h4 className="mt-1 text-[11px] font-black uppercase tracking-widest text-white">Zero-Trust Registry Persistence</h4>
                          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/40">Encrypts and retains transaction receipts on the local administrative block.</p>
                        </div>
                        <span className="px-5 py-3 border border-white/10 text-white/30 text-[9px] uppercase tracking-widest font-black rounded-full select-none">
                          Required
                        </span>
                      </div>
                    </div>
                 </div>
              </div>

              {/* GDPR Privacy Portal & Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <section className="bg-[#050505] border border-white/5 p-8 lg:p-10 rounded-[2rem] space-y-6">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gold" />
                    <h3 className="text-[12px] uppercase tracking-[0.25em] font-black">Submit Privacy Request</h3>
                  </div>
                  
                  <form onSubmit={handleSubmitPrivacyRequest} className="space-y-4">
                    <label className="block space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Request Type</span>
                      <select 
                        value={selectedRequestType}
                        onChange={(e) => setSelectedRequestType(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold"
                      >
                        <option value="opt-out">Opt-Out of Data Profiling (GDPR/CCPA)</option>
                        <option value="export">Access Personal Data Ledger (Export Data)</option>
                        <option value="delete">Right to Be Forgotten (Delete Profile)</option>
                      </select>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Reason / Details</span>
                      <textarea 
                        value={requestNotes}
                        onChange={(e) => setRequestNotes(e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold resize-none"
                        placeholder="Provide details for Avion or the security officer..."
                      />
                    </label>

                    <button 
                      type="submit" 
                      className="w-full bg-white/10 border border-white/10 text-white py-4 rounded-full text-[9px] font-black uppercase tracking-[0.24em] hover:bg-gold hover:text-black-pure transition-all"
                    >
                      Submit Sovereign Request
                    </button>
                  </form>
                </section>

                <section className="bg-[#050505] border border-white/5 p-8 lg:p-10 rounded-[2rem] lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-[12px] uppercase tracking-[0.25em] font-black">Privacy Ledger Logs</h3>
                    <span className="text-[9px] uppercase tracking-widest text-white/40">{privacyRequests.length} Requests Filed</span>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {privacyRequests.map((req) => (
                      <div key={req.id} className="rounded-2xl border border-white/5 bg-white/5 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gold">{req.id}</span>
                            <span className="text-[9px] uppercase tracking-widest text-white/30">{req.date}</span>
                          </div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{req.type}</h4>
                          <p className="text-[9px] uppercase tracking-widest text-white/40">Notes: {req.notes}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CheckCircle size={12} className={req.status === 'Processed' ? 'text-green-400' : 'text-amber-500'} />
                          <span className={`text-[9px] uppercase tracking-widest font-black ${req.status === 'Processed' ? 'text-green-400' : 'text-amber-400'}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Wishlist / saved items simulation */}
              <div className="space-y-8">
                 <h3 className="text-[12px] uppercase tracking-[0.4em] font-black border-b border-white/5 pb-6">Private Storefront Registry</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#050505] border border-white/5 p-8 flex items-center gap-6 rounded-2xl group hover:border-white/10 transition-all">
                       <div className="w-16 h-16 bg-black-pure border border-white/5 flex items-center justify-center shrink-0">
                          <ImageIcon size={20} className="text-white/20" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Classic Emerald Band</h4>
                          <p className="text-[9px] uppercase tracking-widest text-gold">$12,800</p>
                       </div>
                       <button className="px-5 py-3 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-black transition-all">
                          Acquire
                       </button>
                    </div>
                    <div className="bg-[#050505] border border-white/5 p-8 flex items-center gap-6 rounded-2xl group hover:border-white/10 transition-all">
                       <div className="w-16 h-16 bg-black-pure border border-white/5 flex items-center justify-center shrink-0">
                          <ImageIcon size={20} className="text-white/20" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Brilliant Crown Solitaire</h4>
                          <p className="text-[9px] uppercase tracking-widest text-gold">$18,400</p>
                       </div>
                       <button className="px-5 py-3 border border-white/10 rounded-full text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-black transition-all">
                          Acquire
                       </button>
                    </div>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
