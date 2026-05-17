/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.HOOKS.USE_LEEWAY_ID.MAIN

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#C7FFD8

ICON_ASCII:
family=lucide
glyph=cpu

DESCRIPTION: Hook to register and track identifiable runtime segments.
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = useLeeWayID.ts — segment registration hook
WHY = Ensure "everything has an ID" and is registered with the Sovereign Runtime
WHO = Leeway Innovations / Agent Lee Prime
WHERE = src/hooks/useLeeWayID.ts
WHEN = 2026-05-16
HOW = React useEffect + leewayRuntime.registerComponent

AGENTS:
ASSESS
ALIGN
AUDIT

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { useEffect } from 'react';
import { leewayRuntime } from '../core/LeeWayRuntime';
import { GovernedUnit, GovernanceRegistry } from '../core/leeway/GovernanceRegistry';

/**
 * Hook to register a component or section with the LeeWay Sovereign Runtime.
 * @param identity The unique identifier string or GovernedUnit for this portion of the application.
 */
export function useLeeWayID(identity: string | GovernedUnit) {
  useEffect(() => {
    if (typeof identity === 'string') {
      leewayRuntime.registerComponent(identity);
    } else {
      leewayRuntime.registerComponent(identity.id);
      GovernanceRegistry.register(identity);
    }
  }, [identity]);
}
