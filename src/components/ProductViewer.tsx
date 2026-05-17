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
TAG: UI.SRC.COMPONENTS.PRODUCT_VIEWER.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = ProductViewer.tsx — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/components/ProductViewer.tsx
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Maximize2, RotateCcw, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { publicAssetUrl } from '../lib/publicPath';

interface ProductViewerProps {
  image: string;
  title: string;
}

export default function ProductViewer({ image, title }: ProductViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Motion values for tilt/rotation effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotationY = useMotionValue(0);

  // Smooth springs
  const rotateXSpring = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateYSpring = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), { stiffness: 100, damping: 30 });
  const dragRotationY = useSpring(rotationY, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      x.set(0);
      y.set(0);
    }
  };

  const handleReset = () => {
    rotationY.set(0);
    x.set(0);
    y.set(0);
    setZoomLevel(1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-move overflow-hidden group/viewer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Main Product Display with 3D Interaction */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onDrag={(e, info) => {
          // Map drag horizontal distance to rotation
          rotationY.set(rotationY.get() + info.delta.x * 0.5);
        }}
        style={{
          rotateX: rotateXSpring,
          rotateY: useTransform(() => dragRotationY.get() + rotateYSpring.get()),
          transformStyle: "preserve-3d",
          scale: zoomLevel,
          perspective: 2000
        }}
        className="relative z-10 w-full h-full flex items-center justify-center p-8 lg:p-20 active:cursor-grabbing"
      >
        <div className="relative">
          {/* Shadow/Reflection beneath */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-gold/10 blur-xl rounded-full scale-y-50" />
          
          <img 
            src={publicAssetUrl(image)} 
            alt={title}
            className="max-w-full max-h-[70vh] object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none pointer-events-none"
            draggable={false}
          />
          
          {/* Dynamic Glint Effect (follows rotation) */}
          <motion.div 
            style={{
              x: useTransform(dragRotationY, [0, 360], [-100, 100], { clamp: false }),
              opacity: useTransform(dragRotationY, (v) => Math.abs(Math.sin(v * Math.PI / 180)))
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none mix-blend-overlay"
          />

          {/* Subtle Sparkle Points */}
          <motion.div 
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5] 
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            className="absolute top-1/4 right-1/4 text-gold/60"
          >
            <div className="w-1 h-1 bg-white rounded-full blur-[1px]" />
          </motion.div>
        </div>
      </motion.div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black-pure/40 border border-gold/10 backdrop-blur-md px-6 py-3 rounded-full z-20 transition-all duration-500 opacity-0 group-hover/viewer:opacity-100">
        <button 
          onClick={handleReset}
          className="p-2 hover:text-gold transition-colors text-white/60 group/btn relative"
          title="Reset View"
        >
          <RotateCcw size={16} />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black-pure border border-gold/20 px-2 py-1 text-[8px] uppercase tracking-widest text-gold opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">Reset Orientation</span>
        </button>
        <div className="w-px h-4 bg-gold/20" />
        <div className="flex items-center gap-2">
           {[1, 1.5, 2].map((lvl) => (
             <button 
              key={lvl}
              onClick={() => setZoomLevel(lvl)}
              className={`w-2 h-2 rounded-full transition-all ${zoomLevel === lvl ? 'bg-gold w-4' : 'bg-white/20'}`}
             />
           ))}
        </div>
        <div className="w-px h-4 bg-gold/20" />
        <button 
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
          className="p-2 hover:text-gold transition-colors text-white/60"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Education Tags - Contextual Hints */}
      <div className="absolute top-12 left-12 flex flex-col gap-6 z-20">
          <div className="flex items-center gap-4 group/hint">
            <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-black group-hover/hint:text-gold transition-colors cursor-default">
              Drag to Rotate 360°
            </span>
          </div>
          <div className="flex items-center gap-4 group/hint">
            <div className="w-2 h-2 rounded-full bg-gold animate-ping delay-500" />
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-black group-hover/hint:text-gold transition-colors cursor-default">
              Shift Perspective
            </span>
          </div>
      </div>
    </div>
  );
}
