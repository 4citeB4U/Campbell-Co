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

REGION: CORE
TAG: CORE.LEEWAY.ONBOARDING_REGISTRY.MAIN
DESCRIPTION: Governed definitions for interactive onboarding step-by-step tours.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice -> Intent -> Location -> Vertical -> Ranking -> Render

5WH:
WHAT = LeeWayOnboardingRegistry.ts - interactive tour steps
WHY = The system must teach the owner how to navigate and operate it
WHO = Atlas Memory Agent
WHERE = src/core/leeway/LeeWayOnboardingRegistry.ts
WHEN = 2026-05-17
HOW = Consumed by OnboardingTour.tsx

CHAIN: Standards -> Integrated -> Runtime -> Projections
LICENSE: PROPRIETARY
*/

export type OnboardingStep = {
  stepId: string;
  tourId: string;
  title: string;
  instruction: string;
  targetSelector: string;
  screenId: string;
  workflowId: string;
  ownerAgent: string;
  lawReferences: string[];
  printable: boolean;
  canSkip: boolean;
  nextStepId?: string;
  prevStepId?: string;
  completionCondition?: string;
};

export const LeeWayOnboardingRegistry: OnboardingStep[] = [
  {
    stepId: 'tour.first.dashboard',
    tourId: 'tour.first',
    title: 'Welcome To The Command Center',
    instruction: 'This dashboard summarizes performance across storefront, orders, members, and agent activity.',
    targetSelector: '[data-leeway-id="admin.dashboard.main"]',
    screenId: 'ADMIN_DASHBOARD',
    workflowId: 'workflow.onboarding.first_launch',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001'],
    printable: true,
    canSkip: true,
    nextStepId: 'tour.first.preview',
  },
  {
    stepId: 'tour.first.preview',
    tourId: 'tour.first',
    title: 'Live Storefront Preview',
    instruction: 'This is the real governed preview panel. Draft mode shows unpublished changes. Live mode shows what customers see now.',
    targetSelector: '[data-leeway-id="admin.preview.panel"]',
    screenId: 'ADMIN_PORTAL',
    workflowId: 'workflow.onboarding.first_launch',
    ownerAgent: 'aura-media-agent',
    lawReferences: ['LAW-0001'],
    printable: true,
    canSkip: true,
    prevStepId: 'tour.first.dashboard',
    nextStepId: 'tour.first.agents',
  },
  {
    stepId: 'tour.first.agents',
    tourId: 'tour.first',
    title: 'AI Workforce Access',
    instruction: 'Use this navigation target to open the AI Workforce, inspect agents, and review proposals before anything touches draft state.',
    targetSelector: '[data-leeway-id="admin.sidebar.agents"]',
    screenId: 'ADMIN_SIDEBAR',
    workflowId: 'workflow.onboarding.first_launch',
    ownerAgent: 'agent-lee-prime',
    lawReferences: ['LAW-0001', 'LAW-0005'],
    printable: true,
    canSkip: true,
    prevStepId: 'tour.first.preview',
  },
];

export function getStepsForTour(tourId: string): OnboardingStep[] {
  return LeeWayOnboardingRegistry.filter((step) => step.tourId === tourId);
}
