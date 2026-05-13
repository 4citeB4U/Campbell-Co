/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.CHECKOUT.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = Checkout.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/Checkout.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  BadgeCheck,
  MapPin,
  Bitcoin,
  Wallet,
  Landmark,
  CircleDollarSign
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { publicAssetUrl } from '../lib/publicPath';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'installments' | 'deposit' | 'crypto'>('card');

  const monthlyTwelve = subtotal > 0 ? Math.ceil((subtotal * 0.88) / 12) : 0;
  const depositDue = subtotal > 0 ? Math.ceil(subtotal * 0.2) : 0;
  const reserveMonthly = subtotal > 0 ? Math.ceil((subtotal - depositDue) / 6) : 0;
  const paymentOptions = [
    {
      id: 'card' as const,
      title: 'Card or Debit',
      caption: 'Visa, Mastercard, Amex, debit, and wallet checkout.',
      icon: CreditCard,
    },
    {
      id: 'installments' as const,
      title: 'Monthly Installments',
      caption: `Estimated from $${monthlyTwelve.toLocaleString()} / month.`,
      icon: Landmark,
    },
    {
      id: 'deposit' as const,
      title: 'Reserve with Deposit',
      caption: `Reserve with $${depositDue.toLocaleString()} down.`,
      icon: CircleDollarSign,
    },
    {
      id: 'crypto' as const,
      title: 'Bitcoin or Crypto',
      caption: 'Verified digital-asset settlement flow.',
      icon: Bitcoin,
    },
  ];

  if (step === 'confirmation') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-black-pure flex items-center justify-center p-8"
      >
        <div className="max-w-2xl w-full text-center space-y-12">
           <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 border border-gold rounded-full flex items-center justify-center mx-auto"
           >
              <CheckCircle2 size={40} className="text-gold" />
           </motion.div>
           <div className="space-y-6">
              <span className="text-[12px] uppercase tracking-[0.8em] text-gold font-black">Transaction Verified</span>
              <h1 className="text-5xl lg:text-7xl font-serif text-white uppercase tracking-widest leading-tight">Registry Confirmed</h1>
              <p className="text-white/40 text-[12px] uppercase tracking-[0.3em] font-light leading-relaxed max-w-lg mx-auto">
                Your artifacts have been secured in our primary vault. A private acquisition officer will contact you within the hour to coordinate hand-delivery details.
              </p>
           </div>
           <button 
            onClick={() => { clearCart(); navigate('/'); }}
            className="px-12 py-6 bg-gold text-black-pure text-[10px] uppercase tracking-[0.5em] font-black hover:bg-white transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
           >
             Return to the House
           </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-black-pure pt-32 pb-20 px-8 lg:px-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-20">
        
        {/* Left Side: Forms */}
        <div className="flex-1 space-y-16">
          <Link 
            to="/shop"
            className="flex items-center gap-4 text-white/40 hover:text-gold transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-black">Back to Collection</span>
          </Link>

          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.8em] text-gold/40 font-black">Acquisition Portal</span>
            <h1 className="text-5xl lg:text-7xl font-serif text-white uppercase tracking-widest italic">Review Details</h1>
          </div>

          <div className="space-y-12">
            {/* Step Indicators */}
            <div className="flex gap-12 border-b border-gold/10 pb-8">
               {[
                 { id: 'details', label: 'Shipping & Persona', icon: Truck },
                 { id: 'payment', label: 'Financial Verification', icon: CreditCard }
               ].map((s, idx) => (
                 <div 
                  key={s.id}
                  className={`flex items-center gap-4 transition-all ${step === s.id ? 'text-gold' : 'text-white/20'}`}
                 >
                    <span className="text-[10px] font-mono italic">0{idx + 1}</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black">{s.label}</span>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {step === 'details' ? (
                 <>
                   <div className="space-y-3">
                      <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Full Name / Title</label>
                      <input type="text" className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2" placeholder="ALEXANDRA CAMPBELL" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Email Residence</label>
                      <input type="email" className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2" placeholder="AC@RESIDENCE.COM" />
                   </div>
                   <div className="md:col-span-2 space-y-3">
                      <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Primary Dispatch Address</label>
                      <input type="text" className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2" placeholder="12 MAYFAIR PLACE, LONDON" />
                   </div>
                   <button 
                    onClick={() => setStep('payment')}
                    className="md:col-span-2 w-full py-8 border border-gold/20 text-gold flex items-center justify-center gap-6 text-[10px] uppercase tracking-[0.5em] font-black hover:bg-gold hover:text-black-pure transition-all mt-10"
                   >
                     Continue to Payment <ChevronRight size={14} />
                   </button>
                 </>
               ) : (
                 <>
                   <div className="md:col-span-2 space-y-6">
                      <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Select Payment Route</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentOptions.map((option) => {
                          const Icon = option.icon;
                          const active = paymentMethod === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setPaymentMethod(option.id)}
                              className={`text-left border p-5 transition-all ${
                                active ? 'border-gold bg-gold/8 text-white' : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-gold/30'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="text-[10px] uppercase tracking-[0.35em] font-black">{option.title}</div>
                                  <p className="text-[9px] uppercase tracking-[0.2em] leading-relaxed text-white/45">{option.caption}</p>
                                </div>
                                <Icon size={18} className={active ? 'text-gold' : 'text-white/35'} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-3">
                      <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">
                        {paymentMethod === 'card' && 'Financial Instrument Number'}
                        {paymentMethod === 'installments' && 'Pre-Approval Contact Email'}
                        {paymentMethod === 'deposit' && 'Reserve Contact Email'}
                        {paymentMethod === 'crypto' && 'Digital Settlement Email'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2 pr-12"
                          placeholder={
                            paymentMethod === 'card'
                              ? '**** **** **** 8888'
                              : paymentMethod === 'crypto'
                                ? 'PRIVATECLIENT@DOMAIN.COM'
                                : 'CLIENT@DOMAIN.COM'
                          }
                        />
                        {paymentMethod === 'card' ? (
                          <CreditCard className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/40" size={20} strokeWidth={1} />
                        ) : paymentMethod === 'crypto' ? (
                          <Wallet className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/40" size={20} strokeWidth={1} />
                        ) : (
                          <Landmark className="absolute right-0 top-1/2 -translate-y-1/2 text-gold/40" size={20} strokeWidth={1} />
                        )}
                      </div>
                   </div>
                   {paymentMethod === 'card' ? (
                     <>
                       <div className="space-y-3">
                          <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Expiry</label>
                          <input type="text" className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2" placeholder="12 / 28" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Vault Code (CVC)</label>
                          <input type="text" className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2" placeholder="***" />
                       </div>
                     </>
                   ) : (
                     <>
                       <div className="space-y-3">
                          <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">
                            {paymentMethod === 'crypto' ? 'Preferred Asset' : 'Preferred Schedule'}
                          </label>
                          <input
                            type="text"
                            className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2"
                            placeholder={
                              paymentMethod === 'crypto'
                                ? 'BITCOIN / USDC / ETH'
                                : paymentMethod === 'installments'
                                  ? `12 MONTHS - EST. $${monthlyTwelve.toLocaleString()} / MONTH`
                                  : `20 PERCENT DOWN - EST. $${reserveMonthly.toLocaleString()} / MONTH`
                            }
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">
                            {paymentMethod === 'crypto' ? 'Wallet Confirmation' : 'Preferred Contact Number'}
                          </label>
                          <input
                            type="text"
                            className="w-full bg-transparent border-b border-gold/20 py-4 text-white outline-none focus:border-gold transition-colors text-[12px] uppercase tracking-widest px-2"
                            placeholder={paymentMethod === 'crypto' ? 'SEND PAYMENT LINK OR INVOICE' : '(555) 555-0199'}
                          />
                       </div>
                     </>
                   )}
                   <div className="md:col-span-2 border border-gold/10 bg-[#0a0a0a] p-6 space-y-3">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-gold font-black">Selected Payment Summary</div>
                      {paymentMethod === 'card' && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                          Pay in full at checkout using major credit cards, debit cards, and wallet-based checkout once the processor is connected.
                        </p>
                      )}
                      {paymentMethod === 'installments' && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                          Estimated monthly payment starts near ${monthlyTwelve.toLocaleString()} over 12 months, subject to lender approval and final processor terms.
                        </p>
                      )}
                      {paymentMethod === 'deposit' && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                          Reserve this piece with ${depositDue.toLocaleString()} down, then continue on an estimated six-month schedule near ${reserveMonthly.toLocaleString()} per month.
                        </p>
                      )}
                      {paymentMethod === 'crypto' && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                          Bitcoin and selected digital assets can be accepted through a verified crypto settlement partner with confirmation before release.
                        </p>
                      )}
                   </div>
                   <div className="md:col-span-2 pt-10">
                      <div className="bg-gold/5 border border-gold/20 p-8 flex items-start gap-6">
                         <ShieldCheck className="text-gold mt-1" size={24} strokeWidth={1} />
                         <div className="space-y-2">
                            <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Encrypted Line Secured</span>
                            <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                                This transaction is protected by the House of Campbell Multi-Sig security protocol. Your data is purged immediately following registry verification.
                            </p>
                         </div>
                      </div>
                   </div>
                   <button 
                    onClick={() => setStep('confirmation')}
                    className="md:col-span-2 w-full py-10 bg-gold text-black-pure flex items-center justify-center gap-10 text-[12px] font-black uppercase tracking-[0.8em] hover:bg-white transition-all shadow-[0_20px_60px_rgba(212,175,55,0.4)]"
                   >
                     {paymentMethod === 'card' && `Authorize Acquisition of $${subtotal.toLocaleString()}`}
                     {paymentMethod === 'installments' && 'Request Installment Approval'}
                     {paymentMethod === 'deposit' && 'Reserve Piece with Deposit'}
                     {paymentMethod === 'crypto' && 'Request Crypto Settlement Link'}
                   </button>
                   <button 
                    onClick={() => setStep('details')}
                    className="md:col-span-2 w-full py-4 text-white/20 text-[8px] uppercase tracking-[0.4em] font-black hover:text-gold transition-colors"
                   >
                     Amend Shipping Details
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[450px] space-y-12">
           <div className="bg-[#050505] border border-gold/10 p-10 space-y-12">
              <div className="flex justify-between items-center border-b border-gold/5 pb-8">
                 <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-black">Registry Summary</span>
                 <span className="text-[9px] text-white/30 font-mono italic">{cartItems.length} Artifacts</span>
              </div>

              <div className="space-y-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                 {cartItems.map((item) => (
                   <div key={item.id} className="flex gap-8 group">
                      <div className="w-20 h-20 bg-black-pure border border-gold/10 p-2 overflow-hidden flex items-center justify-center">
                         <img src={publicAssetUrl(item.image)} alt={item.title} className="max-w-full max-h-full object-contain filter group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 space-y-2">
                         <div className="flex justify-between items-start">
                            <h3 className="text-[10px] uppercase tracking-[0.3em] text-white font-black leading-tight">{item.title}</h3>
                            <span className="text-[10px] font-mono text-gold italic">${item.price.toLocaleString()}</span>
                         </div>
                         <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-black">{(item as any).diamondCut || 'Exquisite'} • {item.metal}</p>
                         <p className="text-[8px] text-gold/60 font-black italic">Ref: {item.sku}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-6 bg-black-pure/40 p-8 border border-gold/5">
                 <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-black">
                    <span className="text-white/30">Registry Subtotal</span>
                    <span className="text-white">${subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-black">
                    <span className="text-white/30">Vault Insurance</span>
                    <span className="text-gold italic">Complimentary</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-black">
                    <span className="text-white/30">Hand-Delivery</span>
                    <span className="text-gold italic">Included</span>
                 </div>
                 <div className="h-px bg-gold/10 my-4" />
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-black">Total Acquisition</span>
                    <span className="text-3xl font-serif text-white tracking-widest">${subtotal.toLocaleString()}</span>
                 </div>
              </div>

              <div className="space-y-5 border border-gold/10 bg-gold/5 p-8">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black">Flexible Payment Paths</span>
                    <Link to="/payments" className="text-[8px] uppercase tracking-[0.3em] text-white/40 hover:text-gold transition-colors">
                      View Options
                    </Link>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                      Card and debit checkout can be enabled first, followed by monthly installments, private reserve deposits, and Bitcoin settlement for qualified orders.
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between border border-white/10 px-4 py-3 text-[8px] uppercase tracking-[0.25em]">
                        <span className="text-white/40">12-month estimate</span>
                        <span className="text-gold font-black">From ${monthlyTwelve.toLocaleString()} / month</span>
                      </div>
                      <div className="flex items-center justify-between border border-white/10 px-4 py-3 text-[8px] uppercase tracking-[0.25em]">
                        <span className="text-white/40">Reserve deposit</span>
                        <span className="text-gold font-black">${depositDue.toLocaleString()} down</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-white/20">
                    <BadgeCheck size={14} className="text-gold/40" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black">Certificate of Authenticity Included</span>
                 </div>
                 <div className="flex items-center gap-4 text-white/20">
                    <Lock size={14} className="text-gold/40" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black">Guaranteed Appraisal Value</span>
                 </div>
              </div>
           </div>

           <div className="p-8 border border-gold/5 bg-gold/5 flex gap-6 items-start">
              <Info className="text-gold shrink-0" size={16} />
              <p className="text-[8px] text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                By authorizing this acquisition, you agree to the House of Campbell Charter, ensuring the legacy of these artifacts for a minimum of one generational cycle.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
