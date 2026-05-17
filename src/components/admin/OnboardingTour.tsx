/*
LEEWAY HEADER - DO NOT REMOVE

COLOR_ONION_HEX:
NEON=#FF4DFF
FLUO=#FF33FF
PASTEL=#FFB3FF

ICON_ASCII:
family=lucide
glyph=map

AGENTS:
ASSESS
ALIGN
AUDIT

REGION: UI.ADMIN
TAG: UI.ADMIN.ONBOARDING
DESCRIPTION: Interactive owner onboarding tour component.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = OnboardingTour.tsx
WHY = Guided tours to educate the owner per LAW-0001
WHO = UI Runtime
WHERE = src/components/admin/OnboardingTour.tsx
WHEN = 2026-05-17
HOW = Overlay plus selector-based highlights with explicit start and skip controls

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

import React, { useEffect, useMemo, useState } from 'react';
import { X, ChevronRight, ChevronLeft, Map } from 'lucide-react';
import { LeeWayOnboardingRegistry } from '../../core/leeway/LeeWayOnboardingRegistry';

export const LEEWAY_ONBOARDING_START_EVENT = 'leeway:onboarding:start';

interface OnboardingTourProps {
  onComplete: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const steps = useMemo(() => LeeWayOnboardingRegistry.filter((step) => step.tourId === 'tour.first'), []);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [targetAvailable, setTargetAvailable] = useState(true);
  const step = steps[currentStepIndex];

  useEffect(() => {
    const startTour = () => {
      setCurrentStepIndex(0);
      setIsActive(true);
    };

    window.addEventListener(LEEWAY_ONBOARDING_START_EVENT, startTour);
    return () => window.removeEventListener(LEEWAY_ONBOARDING_START_EVENT, startTour);
  }, []);

  useEffect(() => {
    if (!isActive || !step) {
      return;
    }

    const element = document.querySelector(step.targetSelector) as HTMLElement | null;
    setTargetAvailable(Boolean(element));

    if (element) {
      element.style.outline = '4px solid #F59E0B';
      element.style.outlineOffset = '4px';
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
      }
    };
  }, [isActive, step]);

  if (!isActive || !step) {
    return null;
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((current) => current + 1);
      return;
    }

    setIsActive(false);
    onComplete();
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((current) => current - 1);
    }
  };

  const handleDismiss = () => {
    setIsActive(false);
    onComplete();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-96 rounded-2xl border border-amber-200 bg-white shadow-2xl overflow-hidden animate-fade-in pointer-events-auto">
      <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map size={16} className="text-amber-700" />
          <h3 className="text-xs font-black uppercase tracking-wider text-amber-900">Guided Tour</h3>
        </div>
        <button onClick={handleDismiss} className="text-stone-400 hover:text-stone-700">
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <h4 className="font-serif font-bold text-lg text-stone-900">{step.title}</h4>
        <p className="text-sm text-stone-600 leading-relaxed">{step.instruction}</p>
        {!targetAvailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            This area is unavailable in this build or not visible on this screen.
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold tracking-widest text-stone-400">
          <span>Laws: {step.lawReferences.join(', ')}</span>
          <span className="text-right">Step {currentStepIndex + 1} of {steps.length}</span>
          <span>Screen: {step.screenId}</span>
          <span className="text-right">Owner: {step.ownerAgent}</span>
        </div>
      </div>

      <div className="bg-stone-50 p-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
          className="p-2 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-400"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          data-leeway-action-id="action.onboarding.skip"
          className="rounded-full border border-stone-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-900"
        >
          Skip Tour
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-lg bg-stone-900 px-6 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-amber-600 transition-colors"
        >
          {currentStepIndex < steps.length - 1 ? 'Next' : 'Finish Tour'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
