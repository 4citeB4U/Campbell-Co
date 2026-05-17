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
TAG: CORE.SRC.SERVICES.SITE_ANALYTICS.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = siteAnalytics.ts — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = src/services/siteAnalytics.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type SiteEventName =
  | 'page_view'
  | 'product_view'
  | 'product_dwell'
  | 'product_card_click'
  | 'add_to_cart'
  | 'wishlist_click'
  | 'newsletter_signup'
  | 'membership_interest'
  | 'referral_interest';

type EventPayload = Record<string, string | number | boolean | null | undefined>;

const SESSION_KEY = 'campbell_co_session_id';

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getSessionId() {
  if (typeof window === 'undefined') return 'server-session';

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const next = createSessionId();
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

export async function trackSiteEvent(name: SiteEventName, payload: EventPayload = {}) {
  if (typeof window === 'undefined') return;
  if (!db) return;

  try {
    await addDoc(collection(db, 'site_analytics'), {
      name,
      payload,
      sessionId: getSessionId(),
      path: window.location.pathname,
      search: window.location.search,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      occurredAt: serverTimestamp(),
    });
  } catch (error) {
    console.debug('Analytics event not recorded', error);
  }
}
