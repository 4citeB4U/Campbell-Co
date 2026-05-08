/*
LEEWAY HEADER — DO NOT REMOVE

REGION: UI
TAG: UI.SRC.COMPONENTS.CART_SIDEBAR.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = CartSidebar.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/CartSidebar.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Trash2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { publicAssetUrl } from '../lib/publicPath';

export default function CartSidebar() {
  const navigate = useNavigate();
  const { cartItems, isCartOpen, toggleCart, subtotal, updateQuantity, removeFromCart } = useCart();
  
  const freeShippingThreshold = 500;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black-pure/90 z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-black-soft z-[70] flex flex-col shadow-2xl border-l border-gray-border"
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-border flex justify-between items-center bg-black-pure/50 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-serif text-xl tracking-wide italic">Your Selection</h2>
                <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length}
                </span>
              </div>
              <button onClick={toggleCart} className="text-gray-text hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-6 bg-black-pure border-b border-gray-border">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-3">
                <span className={subtotal >= freeShippingThreshold ? 'text-gold' : 'text-gray-text'}>
                  {subtotal >= freeShippingThreshold ? 'Complimentary Insured Shipping Attained' : `Add $${freeShippingThreshold - subtotal} for Free Shipping`}
                </span>
                <span className="text-white">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-gray-border rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gold"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-black-pure shrink-0 border border-gold/10">
                      <img src={publicAssetUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-lg leading-tight text-white">{item.title}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-text hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gold font-medium">{item.metal}</p>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center border border-gold/20 rounded-sm px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-xs px-2 text-white hover:text-gold transition-colors"
                          >
                            -
                          </button>
                          <span className="text-xs px-3 font-bold text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-xs px-2 text-white hover:text-gold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-white font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-gold/20 mb-6" strokeWidth={1} />
                  <p className="text-gray-text font-serif italic text-lg mb-8">Your bag is empty</p>
                  <button 
                    onClick={toggleCart}
                    className="bg-gold text-black-pure px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all"
                  >
                    Explore Collections
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-gray-border bg-black-pure/50 backdrop-blur-xl">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-text uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-text uppercase tracking-widest">
                  <span>Insured Shipping</span>
                  <span className="text-white">{subtotal >= freeShippingThreshold ? 'FREE' : '$45'}</span>
                </div>
                <div className="flex justify-between text-lg font-serif border-t border-gold/10 pt-4">
                  <span>Total</span>
                  <span className="text-gold">${(subtotal + (subtotal >= freeShippingThreshold ? 0 : 45)).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  navigate('/checkout');
                  toggleCart();
                }}
                className="w-full bg-gold hover:bg-white text-black-pure py-5 text-[11px] font-bold uppercase tracking-[3px] transition-all flex items-center justify-center gap-3 group"
              >
                Begin Secure Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-6 flex justify-center items-center gap-2 text-[9px] uppercase tracking-widest text-gray-text opacity-60">
                <ShieldCheck size={12} className="text-gold" />
                Guaranteed Safe Checkout
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
